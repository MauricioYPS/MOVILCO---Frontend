import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { api } from "../api"

const DEFAULT_DIRECTION_ID = 99

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
            directionId: payload.directionId ?? payload.id ?? DEFAULT_DIRECTION_ID,
            period: formatPeriod(payload.period)
        }
    }

    return {
        directionId: payload ?? DEFAULT_DIRECTION_ID,
        period: formatPeriod()
    }
}

const normalizeCoordinator = (coordinator, idx) => {
    const totalVentas = Number(coordinator?.total_ventas ?? 0)
    const totalAsesores = Number(coordinator?.total_asesores ?? 0)
    const ventasDistrito = Number(coordinator?.ventas_distrito ?? 0)
    const ventasFuera = Number(coordinator?.ventas_fuera ?? 0)
    const productivity = totalAsesores > 0 ? Number((totalVentas / totalAsesores).toFixed(1)) : 0
    const localPercentage = totalVentas > 0 ? Math.round((ventasDistrito / totalVentas) * 100) : 0
    const outsidePercentage = totalVentas > 0 ? Math.round((ventasFuera / totalVentas) * 100) : 0

    const trendBase = totalVentas || 1
    const trendData = [
        Math.round(trendBase * 0.6),
        Math.round(trendBase * 0.7),
        Math.round(trendBase * 0.85),
        trendBase
    ]

    return {
        id: coordinator?.id ?? coordinator?.org_unit_id ?? idx,
        name: coordinator?.name ?? "Coordinacion sin nombre",
        unit_type: coordinator?.unit_type ?? "COORDINACION",
        total_asesores: totalAsesores,
        total_ventas: totalVentas,
        ventas_distrito: ventasDistrito,
        ventas_fuera: ventasFuera,
        productivity,
        localPercentage,
        outsidePercentage,
        trendData
    }
}

export const fetchCoordinatorsByDirection = createAsyncThunk(
    "direction/fetchCoordinators",
    async (payload, { rejectWithValue }) => {
        const { directionId, period } = normalizePayload(payload)

        try {
            const { data } = await axios.get(`${api}/api/users/by-direction/${directionId}`, {
                params: { period: period ?? formatPeriod() }
            })

            const coordinatorsRaw = Array.isArray(data?.coordinadores) ? data.coordinadores : []
            const coordinators = coordinatorsRaw.map((coord, idx) => normalizeCoordinator(coord, idx))
            const topVentas = Math.max(...coordinators.map((c) => c.total_ventas), 0)
            const enhanced = coordinators.map((c) => ({
                ...c,
                isTopPerformer: c.total_ventas === topVentas,
                status: c.total_ventas > 120 ? "good" : c.total_ventas > 80 ? "average" : "critical"
            }))

            return {
                directionId,
                direction: data?.direccion ?? null,
                period: data?.periodo ?? period ?? formatPeriod(),
                total: data?.total ?? enhanced.length,
                coordinators: enhanced
            }
        } catch (error) {
            const message = error?.response?.data ?? "No fue posible obtener los coordinadores de la direccion."
            return rejectWithValue(message)
        }
    }
)

const initialState = {
    data: [],
    directionId: DEFAULT_DIRECTION_ID,
    direction: null,
    period: formatPeriod(),
    total: 0,
    loading: false,
    error: null,
    lastFetched: null
}

const directionsSlice = createSlice({
    name: "direction",
    initialState,
    reducers: {
        setDirectionContext(state, action) {
            state.directionId = action.payload?.directionId ?? action.payload ?? DEFAULT_DIRECTION_ID
            state.direction = action.payload?.direction ?? state.direction
        },
        setDirectionPeriod(state, action) {
            state.period = formatPeriod(action.payload)
        },
        clearDirectionData(state) {
            state.data = []
            state.direction = null
            state.total = 0
            state.period = formatPeriod()
            state.error = null
            state.lastFetched = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoordinatorsByDirection.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCoordinatorsByDirection.fulfilled, (state, action) => {
                state.loading = false
                state.directionId = action.payload?.directionId ?? DEFAULT_DIRECTION_ID
                state.data = action.payload?.coordinators ?? []
                state.direction = action.payload?.direction ?? null
                state.period = action.payload?.period ?? formatPeriod()
                state.total = action.payload?.total ?? state.data.length
                state.lastFetched = Date.now()
            })
            .addCase(fetchCoordinatorsByDirection.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? "Error desconocido al consultar coordinadores."
            })
    }
})

export const { setDirectionContext, setDirectionPeriod, clearDirectionData } = directionsSlice.actions

export const selectDirectionCoordinators = (state) => state.direction.data
export const selectDirectionMeta = (state) => ({
    directionId: state.direction.directionId,
    direction: state.direction.direction,
    period: state.direction.period,
    total: state.direction.total
})
export const selectDirectionLoading = (state) => state.direction.loading
export const selectDirectionError = (state) => state.direction.error

export default directionsSlice.reducer
