import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../api";
import { getStoredToken } from "../../src/utils/auth";

const withAuth = () => {
  const token = getStoredToken?.() || localStorage.getItem("token") || "";
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
};

const normalizeItem = (raw = {}) => {
  const item = raw?.novelty || raw; // algunos endpoints devuelven el objeto anidado en { novelty }
  return {
    id: item.id,
    user_name: item.user_name || item.name || "Sin nombre",
    document_id: item.document_id || item.docId || "",
    novelty_type: item.novelty_type || item.type || "N/D",
    start_date: item.start_date || item.start,
    end_date: item.end_date || item.end,
    district: item.district,
    district_claro: item.district_claro,
    regional: item.regional,
    role: item.role,
    user_id: item.user_id,
    created_at: item.created_at,
    updated_at: item.updated_at,
    notes: item.notes || ""
  };
};

export const fetchRecentNovelties = createAsyncThunk(
  "novelties/fetchRecent",
  async (params = { days: 3, limit: 50 }, { rejectWithValue }) => {
    try {
      withAuth();
      const { data } = await axios.get(`${api}/api/novedades/recent`, { params });
      return Array.isArray(data?.items) ? data.items.map(normalizeItem) : [];
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || err?.message || "No se pudieron cargar recientes";
      return rejectWithValue(message);
    }
  }
);

export const fetchNovelties = createAsyncThunk(
  "novelties/fetchList",
  async (params = {}, { rejectWithValue }) => {
    try {
      withAuth();
      const { data } = await axios.get(`${api}/api/novedades`, { params });
      const items = Array.isArray(data?.items) ? data.items.map(normalizeItem) : [];
      
      return {
        items,
        total: Number(data?.total) || items.length,
        limit: Number(data?.limit ?? params.limit) || 25,
        offset: Number(data?.offset ?? params.offset) || 0,
        filters: {
          q: params.q || "",
          dateFrom: params.date_from || "",
          dateTo: params.date_to || ""
        }
      };
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || err?.message || "No se pudieron cargar las novedades";
      return rejectWithValue(message);
    }
  }
);

export const fetchNoveltyDetail = createAsyncThunk(
  "novelties/fetchDetail",
  async (id, { rejectWithValue }) => {
    try {
      withAuth();
      const { data } = await axios.get(`${api}/api/novedades/${id}`);
      return normalizeItem(data || {});
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || err?.message || "No se pudo cargar el detalle";
      return rejectWithValue(message);
    }
  }
);

export const createNovelty = createAsyncThunk(
  "novelties/create",
  async (payload, { rejectWithValue }) => {
    try {
      withAuth();
      const { data } = await axios.post(`${api}/api/novedades/manual`, payload);
      return normalizeItem(data || payload);
    } catch (err) {
      const respData = err?.response?.data;
      if (err?.response?.status === 409) return rejectWithValue(respData);
      const message = respData?.message || respData?.error || err?.message || "No se pudo crear la novedad";
      return rejectWithValue(message);
    }
  }
);

export const updateNovelty = createAsyncThunk(
  "novelties/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      withAuth();
      const { data } = await axios.put(`${api}/api/novedades/${id}`, payload);
      return normalizeItem(data || { ...payload, id });
    } catch (err) {
      const respData = err?.response?.data;
      if (err?.response?.status === 409) return rejectWithValue(respData);
      const message = respData?.message || respData?.error || err?.message || "No se pudo actualizar la novedad";
      return rejectWithValue(message);
    }
  }
);

export const deleteNovelty = createAsyncThunk(
  "novelties/delete",
  async (id, { rejectWithValue }) => {
    try {
      withAuth();
      await axios.delete(`${api}/api/novedades/${id}`);
      return id;
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || err?.message || "No se pudo eliminar la novedad";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  recent: [],
  list: [],
  total: 0,
  limit: 25,
  offset: 0,
  filters: { q: "", dateFrom: "", dateTo: "" },
  recentLoading: false,
  listLoading: false,
  mutationLoading: false,
  detail: { data: null, loading: false, error: null },
  error: null,
  recentError: null,
  mutationError: null
};

const noveltiesSlice = createSlice({
  name: "novelties",
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...(action.payload || {}) };
    },
    clearDetail(state) {
      state.detail = { data: null, loading: false, error: null };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentNovelties.pending, (state) => {
        state.recentLoading = true;
        state.recentError = null;
      })
      .addCase(fetchRecentNovelties.fulfilled, (state, action) => {
        state.recentLoading = false;
        state.recent = action.payload || [];
      })
      .addCase(fetchRecentNovelties.rejected, (state, action) => {
        state.recentLoading = false;
        state.recentError = action.payload || action.error?.message || "Error cargando recientes";
      })
      .addCase(fetchNovelties.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchNovelties.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload?.items || [];
        state.total = action.payload?.total || 0;
        state.limit = action.payload?.limit || 25;
        state.offset = action.payload?.offset || 0;
        if (action.payload?.filters) {
          state.filters = {
            q: action.payload.filters.q || "",
            dateFrom: action.payload.filters.dateFrom || "",
            dateTo: action.payload.filters.dateTo || ""
          };
        }
      })
      .addCase(fetchNovelties.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload || action.error?.message || "Error cargando novedades";
      })
      .addCase(fetchNoveltyDetail.pending, (state) => {
        state.detail = { ...state.detail, loading: true, error: null };
      })
      .addCase(fetchNoveltyDetail.fulfilled, (state, action) => {
        state.detail = { data: action.payload || null, loading: false, error: null };
      })
      .addCase(fetchNoveltyDetail.rejected, (state, action) => {
        state.detail = { data: null, loading: false, error: action.payload || action.error?.message || "Error cargando detalle" };
      })
      .addCase(createNovelty.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(createNovelty.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.list = [normalizeItem(action.payload), ...state.list];
        state.total += 1;
      })
      .addCase(createNovelty.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload || action.error?.message || "Error creando novedad";
      })
      .addCase(updateNovelty.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(updateNovelty.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.list = state.list.map((item) => (item.id === action.payload?.id ? normalizeItem(action.payload) : item));
      })
      .addCase(updateNovelty.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload || action.error?.message || "Error actualizando novedad";
      })
      .addCase(deleteNovelty.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(deleteNovelty.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.list = state.list.filter((item) => item.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(deleteNovelty.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload || action.error?.message || "Error eliminando novedad";
      });
  }
});

export const { setFilters, clearDetail } = noveltiesSlice.actions;

export const selectNovelties = (state) => state.novelties;

export default noveltiesSlice.reducer;
