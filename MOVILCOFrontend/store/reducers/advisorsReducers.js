import { createAsyncThunk, createSlice, createSelector } from "@reduxjs/toolkit"
import axios from "axios"
import  {api}  from "../api"
const DEFAULT_COORDINATOR_ID = 26

const normalizeErrorMessage = (err) => {
    if (!err) return "Ocurrió un error desconocido."
    if (typeof err === "string") return err
    if (err?.error) return String(err.error)
    try {
        return JSON.stringify(err)
    } catch (e) {
        return "Ocurrió un error desconocido."
    }
}

const getDefaultCoordinatorId = () => {
    if (typeof window === "undefined") return DEFAULT_COORDINATOR_ID
    try {
        const stored = localStorage.getItem("auth_user")
        if (stored) {
            const parsed = JSON.parse(stored)
            
            return parsed?.coordinator_id || parsed?.id || DEFAULT_COORDINATOR_ID
        }
    } catch (e) {
        return DEFAULT_COORDINATOR_ID
    }
    return DEFAULT_COORDINATOR_ID
}

const formatPeriod = (period) => {
    if (typeof period === "string" && /^\d{4}-\d{2}$/.test(period)) return period
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    return `${year}-${month}`
}

const normalizePayload = (payload) => {
    if (payload && typeof payload === "object") {
        return {
            coordinatorId: payload.coordinatorId ?? payload.id ?? getDefaultCoordinatorId(),
            period: formatPeriod(payload.period),
            persistId: payload.persistId !== false
        }
    }

    return {
        coordinatorId: payload ?? getDefaultCoordinatorId(),
        period: formatPeriod(),
        persistId: true
    }
}

const normalizeAdvisor = (advisor, coordinatorName, idx) => {
    const realId = advisor?.id ?? advisor?.user_id ?? idx
    return {
        advisor_id: `advisor_${realId}`,
        id: realId,
        name: advisor?.name ?? advisor?.nombre ?? "Asesor sin nombre",
        document_id: advisor?.document_id ?? advisor?.cedula ?? "",
        org_unit_id: advisor?.org_unit_id ?? null,
        active: advisor?.active ?? true,
        district: advisor?.district ?? advisor?.distrito ?? "N/A",
        district_claro: advisor?.district_claro ?? advisor?.regional ?? null,
        ventas: Number(advisor?.ventas ?? 0),
        ventas_distrito: Number(advisor?.ventas_distrito ?? 0),
        ventas_fuera: Number(advisor?.ventas_fuera ?? 0),
        dias_laborados: Number(advisor?.dias_laborados ?? 0),
        prorrateo: Number(advisor?.prorrateo ?? 0),
        novedades: Array.isArray(advisor?.novedades)
            ? advisor.novedades
            : advisor?.novedades
                ? [advisor.novedades]
                : [],
        coordinator_name: advisor?.coordinator_name ?? coordinatorName ?? null
    }
}

export const fetchAdvisorsByCoordinator = createAsyncThunk(
    "advisors/fetchByCoordinator",
    async (payload, { rejectWithValue }) => {
        const { coordinatorId, period } = normalizePayload(payload)

        try {
            const { data } = await axios.get(
                `${api}/api/users/by-coordinator/${coordinatorId}`,
                { params: { period: period ?? formatPeriod() } }
            )

            const coordinatorName = data?.coordinador?.name
            const advisorsRaw = Array.isArray(data?.asesores) ? data.asesores : []
            const advisors = advisorsRaw.map((advisor, idx) => normalizeAdvisor(advisor, coordinatorName, idx))

            return {
                coordinatorId,
                advisors,
                coordinator: data?.coordinador ?? null,
                period: data?.periodo ?? period ?? formatPeriod(),
                total: data?.total ?? advisors.length
            }
        } catch (error) {
            const message = error?.response?.data?.error || error?.response?.data || "No fue posible obtener los asesores del coordinador."
            return rejectWithValue(message)
        }
    }
)

export const fetchAdvisorsByDirector = createAsyncThunk(
    "advisors/fetchByDirector",
    async (payload, { rejectWithValue }) => {
        const { coordinatorId, period } = normalizePayload(payload)
        try {
            const { data } = await axios.get(
                `${api}/api/users/by-director/${coordinatorId}`,
                { params: { period: period ?? formatPeriod() } }
            )

            const directorName = data?.director?.name
            const advisorsRaw = Array.isArray(data?.usuarios) ? data.usuarios : []
            const advisors = advisorsRaw.map((advisor, idx) => normalizeAdvisor(advisor, directorName, idx))

            return {
                coordinatorId,
                advisors,
                coordinator: data?.director ?? null,
                period: data?.periodo ?? period ?? formatPeriod(),
                total: data?.total_usuarios ?? advisors.length
            }
        } catch (error) {
            const message = error?.response?.data?.error || error?.response?.data || "No fue posible obtener los asesores de la dirección."
            return rejectWithValue(message)
        }
    }
)

const initialState = {
    advisors: [],
    coordinatorId: getDefaultCoordinatorId(),
    coordinator: null,
    period: formatPeriod(),
    total: 0,
    loading: false,
    error: null,
    lastFetched: null
}

const advisorsSlice = createSlice({
    name: "coordinatorAdvisors",
    initialState,
    reducers: {
        setCoordinatorId(state, action) {
            const incoming = action.payload ?? getDefaultCoordinatorId()
            if (incoming === null || incoming === undefined) return
            state.coordinatorId = incoming
        },
        setCoordinatorPeriod(state, action) {
            state.period = formatPeriod(action.payload)
        },
        clearAdvisors(state) {
            state.advisors = []
            state.coordinator = null
            state.period = formatPeriod()
            state.error = null
            state.lastFetched = null
            state.total = 0
            state.coordinatorId = getDefaultCoordinatorId()
            state.loading = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdvisorsByCoordinator.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAdvisorsByCoordinator.fulfilled, (state, action) => {
                state.loading = false
                state.advisors = action.payload?.advisors ?? []
                state.coordinator = action.payload?.coordinator ?? null
                state.period = action.payload?.period ?? formatPeriod()
                state.total = action.payload?.total ?? state.advisors.length
                state.lastFetched = Date.now()
            })
            .addCase(fetchAdvisorsByCoordinator.rejected, (state, action) => {
                state.loading = false
                state.error = normalizeErrorMessage(action.payload)
            })
            .addCase(fetchAdvisorsByDirector.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAdvisorsByDirector.fulfilled, (state, action) => {
                state.loading = false
                state.advisors = action.payload?.advisors ?? []
                state.coordinator = action.payload?.coordinator ?? null
                state.period = action.payload?.period ?? formatPeriod()
                state.total = action.payload?.total ?? state.advisors.length
                state.lastFetched = Date.now()
            })
            .addCase(fetchAdvisorsByDirector.rejected, (state, action) => {
                state.loading = false
                state.error = normalizeErrorMessage(action.payload)
            })
    }
})

export const { setCoordinatorId, setCoordinatorPeriod, clearAdvisors } = advisorsSlice.actions

export const selectCoordinatorAdvisors = (state) => state.coordinatorAdvisors.advisors
export const selectCoordinatorId = (state) => state.coordinatorAdvisors.coordinatorId
export const selectCoordinatorAdvisorsLoading = (state) => state.coordinatorAdvisors.loading
export const selectCoordinatorAdvisorsError = (state) => state.coordinatorAdvisors.error
export const selectCoordinatorMeta = createSelector(
    (state) => state.coordinatorAdvisors,
    (slice) => ({
        coordinator: slice.coordinator,
        period: slice.period,
        total: slice.total
    })
)

export default advisorsSlice.reducer
