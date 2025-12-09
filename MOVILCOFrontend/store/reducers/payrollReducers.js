import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { api } from "../api"

const currentPeriod = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    return `${year}-${month}`
}

const normalizeEntries = (entries) => {
    if (!Array.isArray(entries)) return []
    return entries
        .map((entry) => {
            if (typeof entry === "string" || typeof entry === "number") {
                return { id: entry, document: String(entry) }
            }
            if (entry && typeof entry === "object") {
                return {
                    id: entry.id ?? entry.user_id ?? entry.asesor_id ?? entry.document ?? entry.documento,
                    document: entry.document ?? entry.document_id ?? entry.documento ?? entry.cedula,
                    period: entry.period
                }
            }
            return null
        })
        .filter((item) => item?.id && item.document)
}

export const fetchPayrollDetailsByUsers = createAsyncThunk(
    "payroll/fetchDetailsByUsers",
    async (userEntries = [], { rejectWithValue }) => {
        const entries = normalizeEntries(userEntries)
        if (entries.length === 0) return []

        try {
            const responses = await Promise.all(
                entries.map(({ id, document, period }) =>
                    axios
                        .get(`${api}/api/kpi/get`, {
                            params: { period: period || currentPeriod(), details: false, documento: document }
                        })
                        .then((res) => ({ id, document, period: period || currentPeriod(), data: res.data }))
                )
            )
            
            return responses
            
        } catch (error) {
            const message = error?.response?.data ?? "No fue posible obtener el detalle de nomina."
            return rejectWithValue(message)
        }
    }
)

const initialState = {
    detailsById: {},
    loading: false,
    error: null,
    lastFetched: null
}

const payrollSlice = createSlice({
    name: "payroll",
    initialState,
    reducers: {
        clearPayroll(state) {
            state.detailsById = {}
            state.error = null
            state.lastFetched = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayrollDetailsByUsers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPayrollDetailsByUsers.fulfilled, (state, action) => {
                state.loading = false
                const incoming = action.payload ?? []
                incoming.forEach((item) => {
                    if (item?.id) {
                        const detail = item?.data?.data?.[0] ?? {}
                        state.detailsById[item.id] = {
                            ...detail,
                            document: item.document,
                            period: item.data?.period ?? item.period ?? currentPeriod()
                        }
                    }
                })
                state.lastFetched = Date.now()
            })
            .addCase(fetchPayrollDetailsByUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? "Error desconocido al consultar nomina."
            })
    }
})

export const { clearPayroll } = payrollSlice.actions

export const selectPayrollDetails = (state) => state.payroll.detailsById
export const selectPayrollLoading = (state) => state.payroll.loading
export const selectPayrollError = (state) => state.payroll.error

export default payrollSlice.reducer
