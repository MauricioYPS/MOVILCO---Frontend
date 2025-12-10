import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { api } from "../api"

const mapSale = (raw, forcedStatus) => ({
  id: raw?.id ?? raw?._id ?? raw?.venta_id ?? raw?.ot ?? "N/A",
  cliente: raw?.cliente ?? raw?.client ?? raw?.nombrecliente ?? raw?.nombre ?? raw?.nombreasesor ?? "Cliente",
  producto: raw?.producto ?? raw?.product ?? raw?.paquete_pvd ?? raw?.tipo_producto ?? "Producto",
  fecha: raw?.fecha ?? raw?.date ?? raw?.created_at ?? "",
  estado: (forcedStatus || raw?.estado || raw?.status || raw?.estado_liquidacion || "pendiente").toString().toLowerCase(),
  ciudad: raw?.poblacion ?? raw?.ciudad ?? raw?.zona ?? "",
  direccion_instalacion: raw?.direccion_instalacion ?? raw?.direccion ?? "",
  observaciones: raw?.observaciones ?? raw?.observation ?? raw?.observ_retencion ?? "",
  type: (raw?.tipo_producto ?? raw?.linea_negocio ?? raw?.tipo ?? "default").toString().toLowerCase(),
  monto: Number(raw?.renta ?? raw?.monto ?? raw?.amount ?? 0)
})


const initialState = {
  pending: [],
  approved: [],
  rejected: [],
  loading: false,
  error: null,
  success: false,
  lastFetched: null
}

export const registerSale = createAsyncThunk("advisorSales/registerSale", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${api}/api/workflow/advisor/sales/raw`, payload)
    return data
  } catch (err) {
    const message = err?.response?.data?.error || err?.message || "No fue posible registrar la venta."
    return rejectWithValue(message)
  }
})

export const loadPendingSales = createAsyncThunk("advisorSales/loadPendingSales", async (coordinatorId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${api}/api/advisor/sales/raw/pending`, {
      params: { coordinator_id: coordinatorId }
    })
    const list = Array.isArray(data) ? data : data?.data ?? []
    return list.map((item) => mapSale(item, "pendiente"))
  } catch (err) {
    const message = err?.response?.data?.error || err?.message || "No fue posible obtener ventas pendientes."
    return rejectWithValue(message)
  }
})

export const loadApprovedSales = createAsyncThunk("advisorSales/loadApprovedSales", async (coordinatorId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${api}/api/coordinator/sales/coordinator`, {
      params: { coordinator_id: coordinatorId }
    })
    const list = Array.isArray(data) ? data : data?.data ?? []
    return list.map((item) => mapSale(item, "aprobada"))
  } catch (err) {
    const message = err?.response?.data?.error || err?.message || "No fue posible obtener ventas aprobadas."
    return rejectWithValue(message)
  }
})

export const loadRejectedSales = createAsyncThunk("advisorSales/loadRejectedSales", async (coordinatorId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${api}/api/workflow/advisor/sales/raw/rejected`, {
      params: { coordinator_id: coordinatorId }
    })
    const list = Array.isArray(data) ? data : data?.data ?? []
    return list.map((item) => mapSale(item, "rechazada"))
  } catch (err) {
    const message = err?.response?.data?.error || err?.message || "No fue posible obtener ventas rechazadas."
    return rejectWithValue(message)
  }
})

const advisorSalesSlice = createSlice({
  name: "advisorSales",
  initialState,
  reducers: {
    clearSalesState(state) {
      state.pending = []
      state.approved = []
      state.rejected = []
      state.loading = false
      state.error = null
      state.success = false
      state.lastFetched = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerSale.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(registerSale.fulfilled, (state) => {
        state.loading = false
        state.success = true
        state.lastFetched = Date.now()
      })
      .addCase(registerSale.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error al registrar venta."
      })

      .addCase(loadPendingSales.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadPendingSales.fulfilled, (state, action) => {
        state.loading = false
        state.pending = action.payload || []
        state.lastFetched = Date.now()
      })
      .addCase(loadPendingSales.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error al cargar ventas pendientes."
      })

      .addCase(loadApprovedSales.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadApprovedSales.fulfilled, (state, action) => {
        state.loading = false
        state.approved = action.payload || []
        state.lastFetched = Date.now()
      })
      .addCase(loadApprovedSales.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error al cargar ventas aprobadas."
      })

      .addCase(loadRejectedSales.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadRejectedSales.fulfilled, (state, action) => {
        state.loading = false
        state.rejected = action.payload || []
        state.lastFetched = Date.now()
      })
      .addCase(loadRejectedSales.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error al cargar ventas rechazadas."
      })
  }
})

export const { clearSalesState } = advisorSalesSlice.actions

export const selectAdvisorSales = (state) => state.advisorSales

export default advisorSalesSlice.reducer
