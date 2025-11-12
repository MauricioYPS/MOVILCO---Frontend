import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSiapp = createAsyncThunk(
  "siapp/fetchSiapp",
  async (params = {}, { rejectWithValue }) => {
    const defaultParams = { limit: 100, ...params };
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/staging/siapp",
        { params: defaultParams }
      );
      return data;
    } catch (error) {
      const message =
        error?.response?.data ?? "No fue posible obtener la información de SIAPP.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
  lastFetched: null,
};

const siappSlice = createSlice({
  name: "siapp",
  initialState,
  reducers: {
    clearSiapp(state) {
      state.data = [];
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiapp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiapp.fulfilled, (state, action) => {
        state.loading = false;
        state.data = Array.isArray(action.payload) ? action.payload : [];
        state.lastFetched = Date.now();
      })
      .addCase(fetchSiapp.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Ocurrió un error desconocido al consultar SIAPP.";
      });
  },
});

export const { clearSiapp } = siappSlice.actions;

export const selectSiapp = (state) => state.siapp.data;
export const selectSiappLoading = (state) => state.siapp.loading;
export const selectSiappError = (state) => state.siapp.error;

export default siappSlice.reducer;
