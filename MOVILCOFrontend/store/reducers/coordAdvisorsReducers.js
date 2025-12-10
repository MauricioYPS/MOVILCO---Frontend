import { createAsyncThunk, createSlice, createSelector } from "@reduxjs/toolkit"
import axios from "axios"
import { api } from "../api"

const DEFAULT_COORDINATOR_ID = 26

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
            period: formatPeriod(payload.period)
        }
    }

    return {
        coordinatorId: payload ?? getDefaultCoordinatorId(),
        period: formatPeriod()
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

export const fetchCoordAdvisorsByCoordinator = createAsyncThunk(
    "coordAdvisors/fetchByCoordinator",
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
            const message = error?.response?.data ?? "No fue posible obtener los asesores del coordinador."
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

const coordAdvisorsSlice = createSlice({
    name: "coordAdvisors",
    initialState,
    reducers: {
        setCoordAdvisorContext(state, action) {
            if (action.payload?.coordinatorId !== undefined && action.payload?.coordinatorId !== null) {
                state.coordinatorId = action.payload.coordinatorId
            }
            if (action.payload?.coordinator) {
                state.coordinator = action.payload.coordinator
            }
        },
        setCoordAdvisorPeriod(state, action) {
            state.period = formatPeriod(action.payload)
        },
        clearCoordAdvisors(state) {
            state.advisors = []
            state.coordinator = null
            state.period = formatPeriod()
            state.total = 0
            state.error = null
            state.lastFetched = null
            state.coordinatorId = getDefaultCoordinatorId()
            state.loading = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoordAdvisorsByCoordinator.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCoordAdvisorsByCoordinator.fulfilled, (state, action) => {
                state.loading = false
                state.coordinatorId = action.payload?.coordinatorId ?? state.coordinatorId
                state.advisors = action.payload?.advisors ?? []
                state.coordinator = action.payload?.coordinator ?? null
                state.period = action.payload?.period ?? formatPeriod()
                state.total = action.payload?.total ?? state.advisors.length
                state.lastFetched = Date.now()
            })
            .addCase(fetchCoordAdvisorsByCoordinator.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? "Error desconocido al consultar asesores."
            })
    }
})

export const { setCoordAdvisorContext, setCoordAdvisorPeriod, clearCoordAdvisors } = coordAdvisorsSlice.actions

export const selectCoordAdvisors = (state) => state.coordAdvisors.advisors
export const selectCoordAdvisorMeta = createSelector(
    (state) => state.coordAdvisors,
    (slice) => ({
        coordinatorId: slice.coordinatorId,
        coordinator: slice.coordinator,
        period: slice.period,
        total: slice.total
    })
)
export const selectCoordAdvisorsLoading = (state) => state.coordAdvisors.loading
export const selectCoordAdvisorsError = (state) => state.coordAdvisors.error

export default coordAdvisorsSlice.reducer
