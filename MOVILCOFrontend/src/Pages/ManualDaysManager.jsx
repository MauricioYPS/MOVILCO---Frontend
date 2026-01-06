import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight, Loader2, RefreshCw } from "lucide-react";
import apiClient from "../../store/api";
import FiltersBar from "../components/manual-days/FiltersBar";
import UsersTable from "../components/manual-days/UsersTable";
import EditManualDaysModal from "../components/manual-days/EditManualDaysModal";
import { getDaysInMonth, normalizeUser } from "../components/manual-days/manualDaysUtils";
import useAuthSession from "../hooks/useAuthSession";
import { persistAuthHeader } from "../utils/auth";

const extractArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.users)) return payload.users;
  return [];
};

export default function ManualDaysManager() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const [searchTerm, setSearchTerm] = useState("");
  const [directionFilter, setDirectionFilter] = useState("Todos");
  const [coordinatorFilter, setCoordinatorFilter] = useState("Todos");

  const [usersRaw, setUsersRaw] = useState([]);
  const [manualList, setManualList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");

  const { token } = useAuthSession();

  useEffect(() => {
    if (token) {
      persistAuthHeader(token);
    }
  }, [token]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [usersResponse, manualResponse] = await Promise.all([
        apiClient.get("/api/users/"),
        apiClient.get("/api/kpi/manualdays", { params: { year, month } })
      ]);

      const users = extractArray(usersResponse?.data).map(normalizeUser);
      const manualRecords = extractArray(manualResponse?.data);

      setUsersRaw(users);
      setManualList(manualRecords);
    } catch (err) {
      const message = err?.response?.data?.error || err?.message || "Error cargando informacion";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const manualMap = useMemo(() => {
    const map = new Map();
    for (const record of manualList) {
      const userId = record.user_id ?? record.userId ?? record.user ?? null;
      if (!userId) continue;
      map.set(Number(userId), record);
    }
    return map;
  }, [manualList]);

  const userNameById = useMemo(() => {
    const map = new Map();
    usersRaw.forEach((u) => {
      if (u.id) map.set(Number(u.id), u.name || "");
    });
    return map;
  }, [usersRaw]);

  const advisors = useMemo(() => {
    return usersRaw
      .filter((user) => String(user.role || "").toUpperCase().includes("ASESORIA"))
      .map((user) => {
        const coordinatorId = user.coordinatorId ? Number(user.coordinatorId) : null;
        const coordinatorName = user.coordinatorName || (coordinatorId ? userNameById.get(coordinatorId) || "" : "");
        const directionName = user.directionName || user.regional || "";
        return {
          ...user,
          coordinatorId,
          coordinatorName,
          directionName
        };
      });
  }, [usersRaw, userNameById]);

  const directions = useMemo(() => {
    const set = new Set();
    advisors.forEach((u) => u.directionName && set.add(u.directionName));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [advisors]);

  const coordinators = useMemo(() => {
    const set = new Set();
    advisors.forEach((u) => u.coordinatorName && set.add(u.coordinatorName));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [advisors]);

  const rows = useMemo(() => {
    const autoDays = getDaysInMonth(year, month);
    const query = searchTerm.trim().toLowerCase();

    return advisors
      .filter((user) => {
        const matchDirection = directionFilter === "Todos" || user.directionName === directionFilter;
        const matchCoordinator = coordinatorFilter === "Todos" || user.coordinatorName === coordinatorFilter;
        const matchSearch =
          !query ||
          user.name.toLowerCase().includes(query) ||
          user.documentId.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query);
        return matchDirection && matchCoordinator && matchSearch;
      })
      .map((user) => {
        const manualRecord = manualMap.get(Number(user.id));
        const manualValue = manualRecord?.dias ?? manualRecord?.days ?? manualRecord?.value ?? null;
        const isManual = Boolean(manualRecord);

        return {
          ...user,
          autoDays: autoDays,
          manual: {
            isManual,
            record: manualRecord || null,
            displayDays: isManual ? Number(manualValue) : null
          }
        };
      });
  }, [advisors, manualMap, year, month, directionFilter, coordinatorFilter, searchTerm]);

  const openEdit = (userRow) => {
    setCurrentUser(userRow);
    setActionError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentUser(null);
    setSaving(false);
    setDeleting(false);
    setActionError("");
  };

  const handleSave = async (dias) => {
    if (!currentUser) return;
    setSaving(true);
    setActionError("");
    try {
      await apiClient.post("/api/kpi/manualdays", {
        user_id: currentUser.id,
        year,
        month,
        dias
      });
      await loadData();
      closeModal();
    } catch (err) {
      const message = err?.response?.data?.error || err?.message || "No se pudo guardar el ajuste";
      setActionError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const manualRecord = manualMap.get(Number(currentUser?.id));
    if (!manualRecord?.id) return;
    setDeleting(true);
    setActionError("");
    try {
      await apiClient.delete(`/api/kpi/manualdays/${manualRecord.id}`);
      await loadData();
      closeModal();
    } catch (err) {
      const message = err?.response?.data?.error || err?.message || "No se pudo eliminar el ajuste";
      setActionError(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full min-w-0 bg-slate-50 flex-1">
      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-2 max-w-4xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
              <span>Recursos Humanos</span>
              <ChevronRight size={14} />
              <span>Correccion manual</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Ajuste manual de dias laborados</h1>
            <p className="text-sm text-slate-600 max-w-3xl">
              Gestiona los dias laborados de asesores (solo rol ASESORIA). Filtra por periodo, direccion o coordinacion y aplica ajustes manuales cuando sea necesario.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-slate-500 inline-flex items-center gap-2">
              Periodo
              <span className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 font-bold text-slate-800 shadow-sm">
                {year}-{String(month).padStart(2, "0")}
              </span>
            </span>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold text-slate-700 shadow-sm"
              disabled={loading}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Refrescar
            </button>
          </div>
        </div>

        <FiltersBar
          year={year}
          month={month}
          onYearChange={setYear}
          onMonthChange={setMonth}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          directionFilter={directionFilter}
          onDirectionChange={setDirectionFilter}
          coordinatorFilter={coordinatorFilter}
          onCoordinatorChange={setCoordinatorFilter}
          directions={directions}
          coordinators={coordinators}
          loading={loading}
        />

        {error ? (
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
            <div className="text-red-700 font-bold">Error</div>
            <div className="text-slate-600 mt-1">{error}</div>
          </div>
        ) : null}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-slate-600 font-medium">
            {loading ? "Cargando..." : `Mostrando ${rows.length} asesores`}
          </div>
          <div className="text-sm text-slate-600 font-medium">
            Ajustes manuales cargados:{" "}
            <span className="font-extrabold text-slate-800">{manualMap.size}</span>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center text-slate-500 font-medium">
            <Loader2 className="inline-block animate-spin mr-2" size={18} />
            Cargando datos...
          </div>
        ) : (
          <UsersTable rows={rows} onEdit={openEdit} />
        )}
      </div>

      {modalOpen && currentUser ? (
        <EditManualDaysModal
          user={currentUser}
          year={year}
          month={month}
          manualRecord={manualMap.get(Number(currentUser.id)) || null}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={handleDelete}
          saving={saving}
          deleting={deleting}
          error={actionError}
        />
      ) : null}
    </div>
  );
}
