import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import  {api}  from "../api"
const DEFAULT_COORDINATOR_ID = 26

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
            coordinatorId: payload.coordinatorId ?? payload.id ?? DEFAULT_COORDINATOR_ID,
            period: formatPeriod(payload.period)
        }
    }

    return {
        coordinatorId: payload ?? DEFAULT_COORDINATOR_ID,
        period: formatPeriod()
    }
}

const normalizeAdvisor = (advisor, coordinatorName, idx) => ({
    id: advisor?.id ?? advisor?.user_id ?? idx,
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
})

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
            const message = error?.response?.data ?? "No fue posible obtener los asesores del coordinador."
            return rejectWithValue(message)
        }
    }
)

const initialState = {
    data: [],
    coordinatorId: DEFAULT_COORDINATOR_ID,
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
            state.coordinatorId = action.payload ?? DEFAULT_COORDINATOR_ID
        },
        setCoordinatorPeriod(state, action) {
            state.period = formatPeriod(action.payload)
        },
        clearAdvisors(state) {
            state.data = []
            state.coordinator = null
            state.period = formatPeriod()
            state.error = null
            state.lastFetched = null
            state.total = 0
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
                state.coordinatorId = action.payload?.coordinatorId ?? DEFAULT_COORDINATOR_ID
                state.data = action.payload?.advisors ?? []
                state.coordinator = action.payload?.coordinator ?? null
                state.period = action.payload?.period ?? formatPeriod()
                state.total = action.payload?.total ?? state.data.length
                state.lastFetched = Date.now()
            })
            .addCase(fetchAdvisorsByCoordinator.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? "Ocurrio un error desconocido al consultar asesores."
            })
    }
})

export const { setCoordinatorId, setCoordinatorPeriod, clearAdvisors } = advisorsSlice.actions

export const selectCoordinatorAdvisors = (state) => state.coordinatorAdvisors.data
export const selectCoordinatorId = (state) => state.coordinatorAdvisors.coordinatorId
export const selectCoordinatorAdvisorsLoading = (state) => state.coordinatorAdvisors.loading
export const selectCoordinatorAdvisorsError = (state) => state.coordinatorAdvisors.error
export const selectCoordinatorMeta = (state) => ({
    coordinator: state.coordinatorAdvisors.coordinator,
    period: state.coordinatorAdvisors.period,
    total: state.coordinatorAdvisors.total
})

export default advisorsSlice.reducer
