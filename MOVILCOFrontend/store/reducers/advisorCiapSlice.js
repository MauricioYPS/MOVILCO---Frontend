import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { api } from "../api"

const mapCiap = (raw) => ({
  cuenta: raw?.cuenta ?? raw?.account ?? "",
  ot: raw?.ot ?? raw?.orden_trabajo ?? "",
  producto: raw?.producto ?? raw?.product ?? "",
  fecha: raw?.fecha ?? raw?.date ?? "",
  estado: raw?.estado ?? raw?.status ?? "",
  ciudad: raw?.ciudad ?? raw?.poblacion ?? raw?.zona ?? "",
  direccion: raw?.direccion ?? raw?.direccion_instalacion ?? "",
  asesor_documento: raw?.asesor_documento ?? raw?.documento ?? raw?.document_id ?? ""
})

const initialState = {
  records: [],
  loading: false,
  error: null,
  lastFetched: null
}

export const loadAdvisorCiap = createAsyncThunk("advisorCiap/loadAdvisorCiap", async ({ advisorId, period }, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${api}/api/workflow/advisor/ciap`, {
      params: { advisor_id: advisorId, period }
    })
    const list = Array.isArray(data) ? data : data?.data ?? []
    return list.map(mapCiap)
  } catch (err) {
    const message = err?.response?.data?.error || err?.message || "No fue posible obtener CIAP del asesor."
    return rejectWithValue(message)
  }
})

const advisorCiapSlice = createSlice({
  name: "advisorCiap",
  initialState,
  reducers: {
    clearAdvisorCiap(state) {
      state.records = []
      state.loading = false
      state.error = null
      state.lastFetched = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAdvisorCiap.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadAdvisorCiap.fulfilled, (state, action) => {
        state.loading = false
        state.records = action.payload || []
        state.lastFetched = Date.now()
      })
      .addCase(loadAdvisorCiap.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error al cargar CIAP."
      })
  }
})

export const { clearAdvisorCiap } = advisorCiapSlice.actions
export const selectAdvisorCiap = (state) => state.advisorCiap

export default advisorCiapSlice.reducer
