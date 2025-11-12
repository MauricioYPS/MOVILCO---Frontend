import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchNomina = createAsyncThunk(
  "nomina/fetchNomina",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/staging/nomina",
        { params }
      );
      console.log(data.rows);
      
      return data.rows;
      
    } catch (error) {
      const fallbackMessage = "No fue posible obtener la nómina.";
      const responseMessage = error?.response?.data ?? fallbackMessage;
      return rejectWithValue(responseMessage);
    }
  }
);

const initialState = {
  data: [],
  filters: null,
  loading: false,
  error: null,
  lastFetched: null,
};

const nominaSlice = createSlice({
  name: "nomina",
  initialState,
  reducers: {
    setNominaFilters(state, action) {
      state.filters = action.payload ?? null;
    },
    clearNomina(state) {
      state.data = [];
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNomina.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNomina.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload ?? [];
        state.lastFetched = Date.now();
      })
      .addCase(fetchNomina.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error desconocido.";
      });
  },
});

export const { setNominaFilters, clearNomina } = nominaSlice.actions;

export const selectNomina = (state) => state.nomina.data;
export const selectNominaLoading = (state) => state.nomina.loading;
export const selectNominaError = (state) => state.nomina.error;
export const selectNominaFilters = (state) => state.nomina.filters;
export const selectNominaLastFetched = (state) => state.nomina.lastFetched;

export default nominaSlice.reducer;
