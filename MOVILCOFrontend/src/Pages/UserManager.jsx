import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import useAuthSession from "../hooks/useAuthSession";
import { getStoredToken } from "../utils/auth";
import { api } from "../../store/api";

const StatusBadge = ({ active }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${
      active ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
    }`}
  >
    <span className={`w-2 h-2 rounded-full ${active ? "bg-emerald-500" : "bg-amber-500"}`} />
    {active ? "Activo" : "Inactivo"}
  </span>
);

const RoleBadge = ({ role }) => (
  <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-2 py-1 text-[11px] font-semibold border border-slate-200">
    {role || "N/D"}
  </span>
);

const Modal = ({ title, onClose, children, footer, size = "md" }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 ">
    <div
      className={`bg-white rounded-lg shadow-2xl w-full max-h-[90vh] overflow-hidden ${size === "lg" ? "max-w-3xl" : "max-w-xl"} flex flex-col`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white ">
        <div>
          <h3 className="font-bold text-lg text-slate-900">{title}</h3>
          <p className="text-xs text-slate-400">Gestion de usuarios</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50">
          <X size={18} />
        </button>
      </div>
      <div className="p-6 overflow-y-auto bg-slate-50/60 flex-1 min-h-0">{children}</div>
      {footer && <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3">{footer}</div>}
    </div>
  </div>
);

const CatalogSelect = ({ label, value, onChange, options = [], placeholder = "Selecciona una opción", disabled, loading, error, name }) => (
  <div>
    <label className="text-sm font-semibold text-slate-600 block mb-1">{label}</label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        className="w-full border border-slate-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-200 appearance-none bg-white"
      >
        <option value="">{loading ? "Cargando..." : placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {loading && <div className="absolute right-3 top-3 h-4 w-4 animate-spin border-2 border-slate-300 border-t-red-600 rounded-full" />}
    </div>
    {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
  </div>
);

const ReadonlyField = ({ label, value, placeholder = "" }) => (
  <div>
    <label className="text-sm font-semibold text-slate-600 block mb-1">{label}</label>
    <input
      value={value || ""}
      readOnly
      className="w-full border border-slate-200 rounded-md px-3 py-3 text-base bg-slate-100 text-slate-600"
      placeholder={placeholder}
    />
  </div>
);

const CoordinatorSelect = ({ coordinators = [], value, onChange, loading, error, onRetry }) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return coordinators;
    return coordinators.filter((c) => {
      const haystack = [c.name, c.document_id, c.email, c.district, c.district_claro, c.regional].join(" ").toLowerCase();
      return haystack.includes(term);
    });
  }, [coordinators, query]);

  return (
    <div className="col-span-2">
      <label className="text-sm font-semibold text-slate-600 block mb-1">Coordinador</label>
      <div className="border border-slate-300 rounded-md bg-white">
        <div className="flex items-center px-3 py-2 border-b border-slate-200 bg-slate-50 gap-2">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, documento, email, regional o distrito"
            className="flex-1 bg-transparent text-base focus:outline-none"
            disabled={loading}
          />
          {loading && <div className="h-4 w-4 animate-spin border-2 border-slate-300 border-t-red-600 rounded-full" />}
        </div>
        <div className="max-h-52 overflow-y-auto divide-y divide-slate-100">
          {error && (
            <div className="p-3 text-sm text-red-600 flex items-center justify-between">
              <span>{error}</span>
              {onRetry && (
                <button onClick={() => onRetry()} className="text-xs font-semibold underline">
                  Reintentar
                </button>
              )}
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className="p-3 text-sm text-slate-500">No hay coordinadores que coincidan con la búsqueda.</div>
          )}
          {!loading &&
            !error &&
            filtered.map((coord) => {
              const isSelected = String(value || "") === String(coord.id);
              return (
                <button
                  key={coord.id}
                  type="button"
                  onClick={() => onChange(String(coord.id))}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-red-50 ${
                    isSelected ? "bg-red-50 border-l-4 border-l-red-600" : ""
                  }`}
                >
                  <div className="font-semibold text-slate-800">{coord.name}</div>
                  <div className="text-[11px] text-slate-500">{coord.document_id}</div>
                  <div className="text-[11px] text-slate-500">
                    {coord.regional} - {coord.district_claro || coord.district}
                  </div>
                  <div className="text-[11px] text-slate-500">{coord.email}</div>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};

const baseFormState = {
  document_id: "",
  name: "",
  email: "",
  phone: "",
  role: "",
  jerarquia: "",
  active: true, // IMPORTANTE: boolean para que el select funcione bien
  district: "",
  district_claro: "",
  regional: "",
  cargo: "",
  capacity: null,
  presupuesto: 0,
  ejecutado: 0,
  cierre_porcentaje: 0,
  org_unit_id: "",
  advisor_id: "",
  coordinator_id: "",
  contract_start: "",
  contract_end: "",
  notes: ""
};

const decodeTokenRole = (token) => {
  try {
    const payload = token?.split?.(".")?.[1];
    if (!payload) return "";
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return String(decoded?.role || decoded?.rol || "").toUpperCase();
  } catch (e) {
    return "";
  }
};

const getToken = () => {
  const stored = getStoredToken?.() || localStorage.getItem("token") || "";
  return stored;
};

const apiFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const resp = await fetch(url, { ...options, headers });
  if (!resp.ok) {
    let message = `Error ${resp.status}`;
    try {
      const data = await resp.json();
      if (data?.error) message = data.error;
      if (data?.message) message = data.message;
    } catch (e) {
      // ignore
    }
    if (resp.status === 401) {
      throw new Error("Sesion expirada o no autenticado");
    }
    throw new Error(message);
  }
  if (resp.status === 204) return null;
  return resp.json();
};

const useUserCatalogs = () => {
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtsClaro, setDistrictsClaro] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState(null);
  const [catalogsLoaded, setCatalogsLoaded] = useState(false);
  const inFlightRef = useRef(false);

  const fetchAllCatalogs = useCallback(
    async (force = false) => {
      if (inFlightRef.current) return;
      if (catalogsLoaded && !force) return;
      inFlightRef.current = true;
      setCatalogLoading(true);
      setCatalogError(null);
      try {
        const [regionsResp, districtsResp, districtsClaroResp, coordinatorsResp] = await Promise.all([
          apiFetch(`${api}/api/catalog/regions`),
          apiFetch(`${api}/api/catalog/districts`),
          apiFetch(`${api}/api/catalog/districts-claro`),
          apiFetch(`${api}/api/catalog/coordinators`)
        ]);
        setRegions(regionsResp?.items || []);
        setDistricts(districtsResp?.items || []);
        setDistrictsClaro(districtsClaroResp?.items || []);
        const coordItems = Array.isArray(coordinatorsResp?.items)
          ? coordinatorsResp.items.filter((c) => c?.active)
          : [];
        setCoordinators(coordItems);
        setCatalogsLoaded(true);
      } catch (err) {
        setCatalogError(err?.message || "No se pudieron cargar los catálogos");
        setCatalogsLoaded(false);
      } finally {
        setCatalogLoading(false);
        inFlightRef.current = false;
      }
    },
    [catalogsLoaded]
  );

  return {
    regions,
    districts,
    districtsClaro,
    coordinators,
    catalogLoading,
    catalogError,
    fetchAllCatalogs,
    catalogsLoaded
  };
};

/**
 * Construye un form "controlado" a partir del usuario, para que los inputs queden llenos (value),
 * no en placeholder.
 */
const buildFormFromUser = (user, modalType) => {
  const safe = user || {};
  return {
    ...baseFormState,
    ...safe,
    // asegurar tipos/strings para inputs controlados
    document_id: safe?.document_id ?? "",
    name: safe?.name ?? "",
    email: safe?.email ?? "",
    phone: safe?.phone ?? "",
    role: String(safe?.role ?? "").toUpperCase(),
    active: typeof safe?.active === "boolean" ? safe.active : true,
    district: safe?.district ?? "",
    district_claro: safe?.district_claro ?? "",
    regional: safe?.regional ?? "",
    cargo: safe?.cargo ?? "",
    jerarquia: safe?.jerarquia ?? "",
    capacity: safe?.capacity ?? null,
    presupuesto: safe?.presupuesto ?? "0",
    ejecutado: safe?.ejecutado ?? "0",
    cierre_porcentaje: safe?.cierre_porcentaje ?? "0",
    org_unit_id: safe?.org_unit_id ?? "",
    advisor_id: safe?.advisor_id ?? "",
    coordinator_id: safe?.coordinator_id ?? "",
    contract_start: safe?.contract_start ? String(safe.contract_start).slice(0, 10) : "",
    contract_end: safe?.contract_end ? String(safe.contract_end).slice(0, 10) : "",
    notes: safe?.notes ?? ""
  };
};

export default function UserManager() {
  const { token: sessionToken, role: sessionRole } = useAuthSession();

  const [users, setUsers] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [errorList, setErrorList] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [modalType, setModalType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [districtFilter, setDistrictFilter] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [form, setForm] = useState(baseFormState);

  const {
    regions,
    districts,
    districtsClaro,
    coordinators,
    catalogLoading,
    catalogError,
    fetchAllCatalogs,
    catalogsLoaded
  } = useUserCatalogs();
  const [selectedCoordinatorId, setSelectedCoordinatorId] = useState("");
  const selectedCoordinator = useMemo(
    () => coordinators.find((c) => String(c.id) === String(selectedCoordinatorId)),
    [coordinators, selectedCoordinatorId]
  );
  const isRoleAsesoria = useMemo(() => form.role === "ASESORIA", [form.role]);
  const isFormModalOpen = modalType === "create" || modalType === "edit";

  const userRole = useMemo(() => {
    if (sessionRole) return sessionRole;
    return decodeTokenRole(sessionToken || getToken());
  }, [sessionRole, sessionToken]);

  const isAuthorized = userRole === "ADMIN";

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setForm(buildFormFromUser(null, "create"));
    setSelectedCoordinatorId("");
    setSaveError(null);
    setModalType("create");
  };

  const handleOpenEdit = async (user) => {
    // Precarga inmediata con lo que ya tienes, para que el modal abra lleno incluso antes del fetch
    setSelectedUser(user);
    setForm(buildFormFromUser(user, "edit"));
    setSelectedCoordinatorId(user?.coordinator_id ? String(user.coordinator_id) : "");
    setSaveError(null);
    setModalType("edit");
    // Luego trae el detalle y vuelve a llenar form con lo más completo
    await fetchUserDetail(user.id, true);
  };

  const handleOpenDetail = async (user) => {
    setSelectedUser(user);
    setErrorDetail(null);
    setModalType("detail");
    await fetchUserDetail(user.id, false);
  };

  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setDeleteError(null);
    setModalType("delete");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedUser(null);
    setSaveError(null);
    setDeleteError(null);
    setErrorDetail(null);
    setSelectedCoordinatorId("");
    setForm(baseFormState);
  };

  useEffect(() => {
    if (isFormModalOpen && !catalogsLoaded) {
      fetchAllCatalogs();
    }
  }, [isFormModalOpen, catalogsLoaded, fetchAllCatalogs]);

  const fetchUsers = useCallback(async () => {
    setLoadingList(true);
    setErrorList(null);
    try {
      const data = await apiFetch(`${api}/api/users?include_inactive=true`);
      setUsers(Array.isArray(data) ? data : []);
      setPage(1);
    } catch (err) {
      setErrorList(err?.message || "No se pudieron cargar los usuarios");
    } finally {
      setLoadingList(false);
      setRefreshing(false);
    }
  }, []);

  const fetchUserDetail = useCallback(async (id, fillForm = false) => {
    if (!id) return;
    setLoadingDetail(true);
    setErrorDetail(null);
    try {
      const data = await apiFetch(`${api}/api/users/${id}`);
      setSelectedUser(data || null);

      if (fillForm) {
        setForm(buildFormFromUser(data, "edit"));
      }
    } catch (err) {
      setErrorDetail(err?.message || "No se pudo cargar el detalle");
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  useEffect(() => {
    if (!isRoleAsesoria && selectedCoordinatorId) {
      setSelectedCoordinatorId("");
    }
  }, [isRoleAsesoria, selectedCoordinatorId]);

  useEffect(() => {
    if (!isRoleAsesoria) return;
    if (!coordinators.length) return;
    const incomingId = form.coordinator_id || selectedUser?.coordinator_id;
    if (!incomingId) return;
    if (!selectedCoordinatorId) {
      setSelectedCoordinatorId(String(incomingId));
    }
  }, [isRoleAsesoria, coordinators, form.coordinator_id, selectedCoordinatorId, selectedUser]);

  useEffect(() => {
    if (!isRoleAsesoria || !selectedCoordinator) return;
    setForm((prev) => {
      if (prev.role !== "ASESORIA") return prev;
      const next = {
        ...prev,
        regional: selectedCoordinator.regional || "",
        district: selectedCoordinator.district || "",
        district_claro: selectedCoordinator.district_claro || "",
        coordinator_id: selectedCoordinator.id ?? "",
        org_unit_id: selectedCoordinator.org_unit_id ?? ""
      };
      const changed = ["regional", "district", "district_claro", "coordinator_id", "org_unit_id"].some(
        (key) => prev[key] !== next[key]
      );
      return changed ? next : prev;
    });
  }, [isRoleAsesoria, selectedCoordinator]);

  useEffect(() => {
    const nextRole = (form.role || "").toUpperCase();
    setForm((prev) => {
      const prevRole = (prev.role || "").toUpperCase();
      let nextJerarquia = prev.jerarquia;
      if (nextRole === "ASESORIA") nextJerarquia = "ASESORIA";
      else if (nextRole === "COORDINACION") nextJerarquia = "COORDINACION";
      else if (nextRole === "DIRECCION") nextJerarquia = "DIRECCION";
      else if (nextRole === "GERENCIA") nextJerarquia = "GERENCIA";

      let nextCargo = prev.cargo;
      if (nextRole === "ASESORIA") {
        nextCargo = "ASESOR COMERCIAL CALLE";
      } else if (nextRole === "COORDINACION") {
        nextCargo = "COORDINADOR COMERCIAL CALLE";
      } else if (prevRole === "ASESORIA" || prevRole === "COORDINACION") {
        nextCargo = "";
      }

      if (nextJerarquia !== prev.jerarquia || nextCargo !== prev.cargo) {
        return { ...prev, jerarquia: nextJerarquia, cargo: nextCargo };
      }
      return prev;
    });
  }, [form.role]);

  const refreshList = async () => {
    setRefreshing(true);
    await fetchUsers();
  };

  const normalizePayload = (payload) => {
    const numOrNull = (val) => {
      if (val === null || val === undefined || val === "") return null;
      const parsed = Number(val);
      return Number.isNaN(parsed) ? null : parsed;
    };
    const cleanDate = (val) => {
      if (val === null || val === undefined || val === "") return null;
      return val;
    };
    return {
      ...payload,
      role: String(payload.role || "").toUpperCase(),
      active: !!payload.active,
      org_unit_id: numOrNull(payload.org_unit_id),
      advisor_id: numOrNull(payload.advisor_id),
      coordinator_id: numOrNull(payload.coordinator_id),
      contract_start: cleanDate(payload.contract_start),
      contract_end: cleanDate(payload.contract_end)
    };
  };

  const validateForm = (isEdit = false) => {
    if (!String(form.name || "").trim()) return "El nombre es obligatorio";
    if (!String(form.document_id || "").trim()) return "El documento es obligatorio";
    if (!String(form.role || "").trim()) return "El rol es obligatorio";
    if (!String(form.email || "").trim()) return "El email es obligatorio";
    if (isRoleAsesoria && !selectedCoordinator) return "Selecciona un coordinador para roles de ASESORIA";
    return null;
  };

  const buildSubmitPayload = () => {
    if (isRoleAsesoria) {
      if (!selectedCoordinator) return null;
      return normalizePayload({
        ...form,
        regional: selectedCoordinator.regional || "",
        district: selectedCoordinator.district || "",
        district_claro: selectedCoordinator.district_claro || "",
        coordinator_id: selectedCoordinator.id ?? "",
        org_unit_id: selectedCoordinator.org_unit_id ?? ""
      });
    }
    return normalizePayload({
      ...form,
      coordinator_id: "",
      org_unit_id: ""
    });
  };

  const createUser = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const validationError = validateForm(false);
      if (validationError) {
        setSaveError(validationError);
        setSaving(false);
        return;
      }
      const payload = buildSubmitPayload();
      if (!payload) {
        setSaveError("Selecciona un coordinador para roles de ASESORIA");
        setSaving(false);
        return;
      }
      const data = await apiFetch(`${api}/api/users`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setUsers((prev) => [...prev, data]);
      closeModal();
      await fetchUsers();
      window.alert("Usuario creado correctamente");
    } catch (err) {
      setSaveError(err?.message || "No se pudo crear el usuario");
    } finally {
      setSaving(false);
    }
  };

  const updateUser = async () => {
    // IMPORTANTE: aquí en tu archivo tenías selectedUser?.user_id, pero en otros lugares usas u.id.
    // Para no dañar funcionalidades, soportamos ambos.
    const targetId = selectedUser?.user_id ?? selectedUser?.id;
    if (!targetId) return;

    setSaving(true);
    setSaveError(null);
    try {
      const validationError = validateForm(true);
      if (validationError) {
        setSaveError(validationError);
        setSaving(false);
        return;
      }
      const payload = buildSubmitPayload();
      if (!payload) {
        setSaveError("Selecciona un coordinador para roles de ASESORIA");
        setSaving(false);
        return;
      }
      const updated = await apiFetch(`${api}/api/users/${targetId}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });

      // Actualiza local usando id coherente
      setUsers((prev) =>
        prev.map((u) => (u.id === targetId || u.user_id === targetId ? updated : u))
      );

      closeModal();
      await fetchUsers();
      window.alert("Usuario actualizado correctamente");
    } catch (err) {
      setSaveError(err?.message || "No se pudo actualizar el usuario");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async () => {
    const targetId = selectedUser?.user_id ?? selectedUser?.id;
    if (!targetId) return;

    setDeleting(true);
    setDeleteError(null);
    try {
      await apiFetch(`${api}/api/users/${targetId}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.id !== targetId && u.user_id !== targetId));

      closeModal();
      await fetchUsers();
      window.alert("Usuario eliminado correctamente");
    } catch (err) {
      setDeleteError(err?.message || "No se pudo eliminar el usuario");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users
      .filter((u) => {
        const matchesTerm =
          !term ||
          (u.name || "").toLowerCase().includes(term) ||
          (u.document_id || "").toLowerCase().includes(term) ||
          (u.email || "").toLowerCase().includes(term);
        const matchesRole = roleFilter === "ALL" || (u.role || "").toUpperCase() === roleFilter;
        const matchesStatus =
          statusFilter === "ALL" || (statusFilter === "ACTIVE" ? u.active === true : u.active === false);
        const matchesDistrict =
          !districtFilter || (u.district_claro || u.district || "").toLowerCase().includes(districtFilter.toLowerCase());
        return matchesTerm && matchesRole && matchesStatus && matchesDistrict;
      })
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [users, searchTerm, roleFilter, statusFilter, districtFilter]);

  const total = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedUsers = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, safePage, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const dataQuality = useMemo(() => {
    const noDistrict = users.filter((u) => !u.district_claro && !u.district).length;
    const noContractStart = users.filter((u) => !u.contract_start).length;
    const noEmail = users.filter((u) => !u.email).length;
    return { noDistrict, noContractStart, noEmail };
  }, [users]);

  const exportCsv = () => {
    const headers = [
      "id",
      "name",
      "document_id",
      "email",
      "phone",
      "role",
      "active",
      "district",
      "district_claro",
      "regional",
      "cargo",
      "org_unit_id",
      "advisor_id",
      "coordinator_id",
      "contract_start",
      "contract_end",
      "notes"
    ];
    const rows = filteredUsers.map((u) =>
      headers
        .map((h) => {
          const val = u[h] ?? "";
          const str = typeof val === "boolean" ? (val ? "true" : "false") : String(val ?? "");
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "usuarios.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!getToken()) {
    return (
      <div className="w-full p-10 text-center text-slate-600">
        <p className="font-semibold text-lg">No autenticado</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="w-full p-10 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="text-red-600 mb-3" size={32} />
        <h2 className="text-xl font-bold text-slate-800">Acceso denegado</h2>
        <p className="text-sm text-slate-500 mt-1">Esta seccion es exclusiva para Recursos Humanos.</p>
      </div>
    );
  }

  const renderSkeletonRows = () =>
    Array.from({ length: 6 }).map((_, idx) => (
      <tr key={`sk-${idx}`} className="animate-pulse">
        <td className="px-6 py-3">
          <div className="h-4 bg-slate-200 rounded w-32" />
        </td>
        <td className="px-6 py-3">
          <div className="h-4 bg-slate-200 rounded w-24" />
        </td>
        <td className="px-6 py-3">
          <div className="h-4 bg-slate-200 rounded w-28" />
        </td>
        <td className="px-6 py-3">
          <div className="h-4 bg-slate-200 rounded w-20" />
        </td>
        <td className="px-6 py-3 text-right">
          <div className="h-4 bg-slate-200 rounded w-24 ml-auto" />
        </td>
      </tr>
    ));

  const renderForm = () => {
    const cargoOptions = [];
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Nombre</label>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full border border-slate-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Documento</label>
            <input
              value={form.document_id}
              onChange={(e) => setForm((prev) => ({ ...prev, document_id: e.target.value }))}
              className="w-full border border-slate-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="Documento de identidad"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full border border-slate-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="correo@movilco.com"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Telefono</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full border border-slate-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="3001234567"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Rol</label>
            <select
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value.toUpperCase() }))}
              className="w-full border border-slate-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-200 uppercase bg-white"
            >
              <option value="">Selecciona un rol</option>
              <option value="ADMIN">ADMIN</option>
              <option value="ASESORIA">ASESORIA</option>
              <option value="COORDINACION">COORDINACION</option>
              <option value="DIRECCION">DIRECCION</option>
              <option value="GERENCIA">GERENCIA</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Estado</label>
            <select
              value={form.active ? "ACTIVE" : "INACTIVE"}
              onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.value === "ACTIVE" }))}
              className="w-full border border-slate-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
            </select>
          </div>

          {catalogError && (
            <div className="col-span-2 bg-red-50 border border-red-100 text-red-700 text-sm px-3 py-2 rounded flex items-center justify-between">
              <span>{catalogError}</span>
              <button onClick={() => fetchAllCatalogs(true)} className="text-xs font-semibold underline">
                Reintentar
              </button>
            </div>
          )}

          {isRoleAsesoria ? (
            <>
              <CoordinatorSelect
                coordinators={coordinators}
                value={selectedCoordinatorId}
                onChange={(id) => setSelectedCoordinatorId(id)}
                loading={catalogLoading}
                error={catalogError}
                onRetry={() => fetchAllCatalogs(true)}
              />
              <ReadonlyField label="Regional" value={selectedCoordinator?.regional || form.regional} placeholder="Regional heredada" />
              <ReadonlyField
                label="Distrito"
                value={selectedCoordinator?.district || form.district}
                placeholder="Distrito heredado del coordinador"
              />
              <ReadonlyField
                label="Distrito Claro"
                value={selectedCoordinator?.district_claro || form.district_claro}
                placeholder="Distrito Claro heredado del coordinador"
              />
            </>
          ) : (
            <>
              <CatalogSelect
                label="Regional"
                value={form.regional}
                onChange={(val) => setForm((prev) => ({ ...prev, regional: val }))}
                options={regions}
                loading={catalogLoading}
                disabled={catalogLoading}
                placeholder="Selecciona la regional"
              />
              <CatalogSelect
                label="Distrito"
                value={form.district}
                onChange={(val) => setForm((prev) => ({ ...prev, district: val }))}
                options={districts}
                loading={catalogLoading}
                disabled={catalogLoading}
                placeholder="Selecciona el distrito"
              />
              <CatalogSelect
                label="Distrito Claro"
                value={form.district_claro}
                onChange={(val) => setForm((prev) => ({ ...prev, district_claro: val }))}
                options={districtsClaro}
                loading={catalogLoading}
                disabled={catalogLoading}
                placeholder="Selecciona el distrito claro"
              />
            </>
          )}

          <div>
            {cargoOptions.length > 0 ? (
              <CatalogSelect
                label="Cargo"
                value={form.cargo}
                onChange={(val) => setForm((prev) => ({ ...prev, cargo: val }))}
                options={cargoOptions}
                placeholder="Selecciona el cargo"
                disabled={catalogLoading}
              />
            ) : (
              <>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Cargo</label>
                <input
                  value={form.cargo}
                  onChange={(e) => setForm((prev) => ({ ...prev, cargo: e.target.value }))}
                  className="w-full border border-slate-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="Cargo"
                />
              </>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 block mb-1">Inicio Contrato</label>
            <input
              type="date"
              value={form.contract_start}
              onChange={(e) => setForm((prev) => ({ ...prev, contract_start: e.target.value }))}
              className="w-full border border-slate-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>
          {modalType === "edit" && (
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Fin Contrato</label>
              <input
                type="date"
                value={form.contract_end}
                onChange={(e) => setForm((prev) => ({ ...prev, contract_end: e.target.value || "" }))}
                className="w-full border border-slate-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>
          )}
          <div className="col-span-2">
            <label className="text-sm font-semibold text-slate-600 block mb-1">Notas</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              className="w-full border border-slate-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-200 min-h-[80px]"
              placeholder="Notas adicionales"
            />
          </div>
        </div>
        {saveError && <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-3 py-2 rounded">{saveError}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 text-slate-800 min-w-full text-base md:text-[17px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion de Usuarios</h1>
          <p className="text-base text-slate-600">Panel de administracion de Recursos Humanos</p>
        </div>
        <div className="flex gap-2">
          {/* <button
            onClick={exportCsv}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-base font-semibold hover:bg-slate-100 flex items-center gap-2 shadow-sm"
          >
            <Download size={18} /> Exportar CSV
          </button> */}
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-red-700 text-white rounded-md text-base font-semibold hover:bg-red-800 flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col md:flex-row gap-3 items-stretch shadow-sm">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-3 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, documento o email"
                className="w-full bg-slate-50 border border-slate-200 rounded-md pl-11 pr-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <option value="ALL">Rol: Todos</option>
                <option value="RECURSOS_HUMANOS">RECURSOS_HUMANOS</option>
                <option value="COORDINACION">COORDINACION</option>
                <option value="ASESORIA">ASESOR</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <option value="ALL">Estado: Todos</option>
                <option value="ACTIVE">Activos</option>
                <option value="INACTIVE">Inactivos</option>
              </select>
              <input
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                placeholder="Distrito"
                className="bg-slate-50 border border-slate-200 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-200"
              />
              <button
                onClick={refreshList}
                disabled={refreshing}
                className="p-3 rounded-md bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-60"
              >
                <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {errorList && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded flex items-center justify-between">
              <span>{errorList}</span>
              <button onClick={fetchUsers} className="underline text-red-700 text-xs">
                Reintentar
              </button>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm uppercase tracking-wide text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Usuario</th>
                    <th className="px-6 py-3">Rol</th>
                    <th className="px-6 py-3">Distrito</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loadingList && renderSkeletonRows()}
                  {!loadingList &&
                    pagedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3">
                          <div className="font-semibold text-slate-800">{u.name || "Sin nombre"}</div>
                          <div className="text-xs text-slate-500">{u.email || "Email N/D"}</div>
                          <div className="text-[11px] text-slate-400">{u.document_id || "Documento N/D"}</div>
                        </td>
                        <td className="px-6 py-3">
                          <RoleBadge role={u.role} />
                        </td>
                        <td className="px-6 py-3">
                          <div className="text-xs font-semibold text-slate-700">{u.district_claro || u.district || "N/D"}</div>
                          <div className="text-[11px] text-slate-400">{u.regional || ""}</div>
                        </td>
                        <td className="px-6 py-3">
                          <StatusBadge active={u.active} />
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="inline-flex gap-1 opacity-70 hover:opacity-100">
                            <button
                              onClick={() => handleOpenDetail(u)}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
                              title="Detalle"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(u)}
                              className="p-1.5 rounded hover:bg-amber-50 text-amber-600"
                              title="Editar"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleOpenDelete(u)}
                              className="p-1.5 rounded hover:bg-red-50 text-red-600"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {!loadingList && pagedUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-6 text-center text-slate-400 text-sm">
                        Sin resultados para los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600">
              <div>
                Pagina {safePage} de {totalPages} - {total} usuarios
              </div>
              <div className="flex items-center gap-2">
                <span>Filas:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <div className="w-px h-4 bg-slate-300" />
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="p-1 rounded hover:bg-slate-100 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="p-1 rounded hover:bg-slate-100 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-base">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={16} className="text-slate-500" />
              <h3 className="text-base font-bold text-slate-700">Calidad de datos</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Sin distrito asignado</span>
                <span className="font-bold text-slate-800">{dataQuality.noDistrict}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Sin fecha de contrato</span>
                <span className="font-bold text-slate-800">{dataQuality.noContractStart}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Email corporativo pendiente</span>
                <span className="font-bold text-slate-800">{dataQuality.noEmail}</span>
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-base">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <h3 className="text-base font-bold text-slate-700">Resumen</h3>
            </div>
            <p className="text-base text-slate-600">
              Usuarios cargados: <span className="font-bold text-slate-900">{users.length}</span>
            </p>
            <p className="text-base text-slate-600">
              Filtrados: <span className="font-bold text-slate-900">{filteredUsers.length}</span>
            </p>
          </div>
        </div>
      </div>

      {(modalType === "create" || modalType === "edit") && (
        <Modal
          title={modalType === "create" ? "Crear usuario" : `Editar usuario #${selectedUser?.name || ""}`}
          onClose={closeModal}
          size="lg"
          footer={
            <>
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-md border border-slate-300 text-base font-semibold text-slate-600 hover:bg-slate-50"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                onClick={modalType === "create" ? createUser : updateUser}
                disabled={saving}
                className="px-5 py-2 rounded-md bg-red-700 text-white text-base font-semibold hover:bg-red-800 disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </>
          }
        >
          {renderForm()}
        </Modal>
      )}

      {modalType === "detail" && selectedUser && (
        <Modal title={`Detalle usuario #${selectedUser.user_id ?? selectedUser.id}`} onClose={closeModal} size="lg">
          {loadingDetail && <div className="text-sm text-slate-500">Cargando detalle...</div>}
          {errorDetail && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{errorDetail}</div>
          )}
          {!loadingDetail && (
            <div className="grid grid-cols-2 gap-4 text-base">
              <div>
                <p className="text-sm text-slate-500">Nombre</p>
                <p className="font-semibold">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Documento</p>
                <p className="font-semibold">{selectedUser.document_id}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-semibold">{selectedUser.email || "N/D"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Telefono</p>
                <p className="font-semibold">{selectedUser.phone || "N/D"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Rol</p>
                <p className="font-semibold">{selectedUser.role}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Estado</p>
                <StatusBadge active={selectedUser.active} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Distrito</p>
                <p className="font-semibold">{selectedUser.district_claro || selectedUser.district || "N/D"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Regional</p>
                <p className="font-semibold">{selectedUser.regional || "N/D"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Inicio contrato</p>
                <p className="font-semibold">{selectedUser.contract_start ? String(selectedUser.contract_start).slice(0, 10) : "N/D"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Fin contrato</p>
                <p className="font-semibold">{selectedUser.contract_end ? String(selectedUser.contract_end).slice(0, 10) : "N/D"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-slate-500">Notas</p>
                <p className="font-semibold">{selectedUser.notes || "Sin notas"}</p>
              </div>
            </div>
          )}
        </Modal>
      )}

      {modalType === "delete" && selectedUser && (
        <Modal title="Eliminar usuario" onClose={closeModal}>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <p className="text-sm text-slate-600">
              ¿Seguro deseas eliminar al usuario <span className="font-semibold text-slate-800">{selectedUser.name}</span>?
            </p>
            {deleteError && <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-3 py-2 rounded">{deleteError}</div>}
            <div className="flex justify-center gap-3 mt-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-md border border-slate-300 text-base font-semibold text-slate-600 hover:bg-slate-50"
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                onClick={deleteUser}
                disabled={deleting}
                className="px-5 py-2 rounded-md bg-red-700 text-white text-base font-semibold hover:bg-red-800 disabled:opacity-60"
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
