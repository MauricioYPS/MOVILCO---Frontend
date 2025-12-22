import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { api } from "../api"

const mapAdvisorInfo = (raw) => ({
  id: raw?.id ?? raw?._id ?? null,
  name: raw?.name ?? raw?.nombre ?? "",
  email: raw?.email ?? "",
  phone: raw?.phone ?? raw?.telefono ?? "",
  document: raw?.documento ?? raw?.document_id ?? raw?.cedula ?? raw?.document ?? "",
  coordinator_id: raw?.coordinator_id ?? raw?.coordinador_id ?? raw?.coordinatorId ?? null,
  coordinator: raw?.coordinator ?? raw?.coordinador ?? null,
  role: raw?.role ?? raw?.cargo ?? raw?.jerarquia ?? "",
  cargo: raw?.cargo ?? "",
  district: raw?.district ?? raw?.distrito ?? "",
  regional: raw?.regional ?? raw?.district_claro ?? "",
  budget: raw?.presupuesto ?? null
})

const mapAdvisorKpi = (raw) => ({
  ventas: Number(raw?.ventas ?? 0),
  ventas_distrito: Number(raw?.ventas_distrito ?? 0),
  ventas_fuera: Number(raw?.ventas_fuera ?? 0),
  dias_laborados: Number(raw?.dias_laborados ?? 0),
  prorrateo: Number(raw?.prorrateo ?? 0),
  cumplimiento: Number(raw?.cumplimiento ?? 0)
})

const initialState = {
  advisor: null,
  kpi: null,
  loading: false,
  error: null,
  lastFetched: null
}

export const loadAdvisorInfo = createAsyncThunk("advisorInfo/loadAdvisorInfo", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${api}/api/users/${id}`)
    console.log(data);
    return mapAdvisorInfo(data || {})
    
  } catch (err) {
    const message = err?.response?.data?.error || err?.message || "No fue posible cargar la informacion del asesor."
    return rejectWithValue(message)
  }
})

export const loadAdvisorKpi = createAsyncThunk("advisorInfo/loadAdvisorKpi", async ({ documento, period }, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${api}/api/kpi/get`, {
      params: { documento, period}
    })
    return mapAdvisorKpi(data || {})
  } catch (err) {
    const message = err?.response?.data?.error || err?.message || "No fue posible cargar los KPI del asesor."
    return rejectWithValue(message)
  }
})

const advisorInfoSlice = createSlice({
  name: "advisorInfo",
  initialState,
  reducers: {
    clearAdvisorInfo(state) {
      state.advisor = null
      state.kpi = null
      state.loading = false
      state.error = null
      state.lastFetched = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAdvisorInfo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadAdvisorInfo.fulfilled, (state, action) => {
        state.loading = false
        state.advisor = action.payload
        state.lastFetched = Date.now()
      })
      .addCase(loadAdvisorInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error al cargar datos del asesor."
      })

      .addCase(loadAdvisorKpi.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadAdvisorKpi.fulfilled, (state, action) => {
        state.loading = false
        state.kpi = action.payload
        state.lastFetched = Date.now()
      })
      .addCase(loadAdvisorKpi.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error al cargar KPI del asesor."
      })
  }
})

export const { clearAdvisorInfo } = advisorInfoSlice.actions

export const selectAdvisorInfo = (state) => state.advisorInfo

export default advisorInfoSlice.reducer
