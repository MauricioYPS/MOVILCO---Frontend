import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight, Copy, Info } from "lucide-react";
import api from "../../store/api";
import BudgetFilters from "../components/budgets/BudgetFilters";
import BudgetKpiGrid from "../components/budgets/BudgetKpiGrid";
import BudgetTable from "../components/budgets/BudgetTable";
import CopyModal from "../components/budgets/CopyModal";
import MissingModal from "../components/budgets/MissingModal";
import LeadershipBudgetPanel from "../components/budgets/LeadershipBudgetPanel";
import { currentPeriod, findNodeById, findNodes, parsePeriodInput, sumBudgetsFromRows } from "../components/budgets/budgetUtils";

export default function BudgetsRH() {
  const [period, setPeriod] = useState(currentPeriod());

  const [treeLoading, setTreeLoading] = useState(false);
  const [treeError, setTreeError] = useState("");
  const [treeData, setTreeData] = useState([]);

  const [selectedGerenciaId, setSelectedGerenciaId] = useState("");
  const [selectedDireccionId, setSelectedDireccionId] = useState("");
  const [selectedCoordUnitId, setSelectedCoordUnitId] = useState("");

  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [coordinatorPayload, setCoordinatorPayload] = useState(null);
  const [search, setSearch] = useState("");

  const [dirty, setDirty] = useState({});
  const [saving, setSaving] = useState(false);

  const [showMissing, setShowMissing] = useState(false);
  const [missingLoading, setMissingLoading] = useState(false);
  const [missingError, setMissingError] = useState("");
  const [missingRows, setMissingRows] = useState([]);

  const [showCopy, setShowCopy] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [copyResult, setCopyResult] = useState(null);

  const [gerenciaEditAllowed, setGerenciaEditAllowed] = useState(false);
  const [direccionEditAllowed, setDireccionEditAllowed] = useState(false);
  const [gerenciaUserId, setGerenciaUserId] = useState("");
  const [direccionUserId, setDireccionUserId] = useState("");
  const [gerenciaAmount, setGerenciaAmount] = useState("");
  const [direccionAmount, setDireccionAmount] = useState("");
  const [confirmRole, setConfirmRole] = useState("");
  const [detectedGerenciaUser, setDetectedGerenciaUser] = useState(null);
  const [detectedDireccionUser, setDetectedDireccionUser] = useState(null);

  const currentCoordNode = useMemo(() => {
    if (!selectedCoordUnitId) return null;
    return findNodeById(treeData, selectedCoordUnitId);
  }, [treeData, selectedCoordUnitId]);

  const currentCoordUserId = useMemo(() => {
    const user = currentCoordNode?.coordinator_user;
    return user?.id ? Number(user.id) : null;
  }, [currentCoordNode]);

  const currentGerenciaNode = useMemo(() => {
    if (!selectedGerenciaId) return null;
    return findNodeById(treeData, selectedGerenciaId);
  }, [treeData, selectedGerenciaId]);

  const currentDireccionNode = useMemo(() => {
    if (!selectedDireccionId) return null;
    return findNodeById(treeData, selectedDireccionId);
  }, [treeData, selectedDireccionId]);

  const detectGerenciaUser = (node) => {
    if (!node) return null;
    return node.manager_user || node.gerencia_user || null;
  };

  const detectDireccionUser = (node) => {
    if (!node) return null;
    return node.director_user || node.direccion_user || null;
  };

  const gerencias = useMemo(() => findNodes(treeData, (n) => n.unit_type === "GERENCIA"), [treeData]);

  const direcciones = useMemo(() => {
    const all = findNodes(treeData, (n) => n.unit_type === "DIRECCION");
    if (!selectedGerenciaId) return all;
    return all.filter((item) => Number(item.parent_id) === Number(selectedGerenciaId));
  }, [treeData, selectedGerenciaId]);

  const coordinaciones = useMemo(() => {
    const all = findNodes(treeData, (n) => n.unit_type === "COORDINACION");
    if (selectedDireccionId) return all.filter((item) => Number(item.parent_id) === Number(selectedDireccionId));
    if (selectedGerenciaId) {
      const dirs = direcciones.map((d) => Number(d.id));
      return all.filter((item) => dirs.includes(Number(item.parent_id)));
    }
    return all;
  }, [treeData, selectedDireccionId, selectedGerenciaId, direcciones]);

  const loadTree = useCallback(async () => {
    const parsedPeriod = parsePeriodInput(period);
    if (!parsedPeriod) {
      setTreeError("Periodo invalido. Debe ser YYYY-MM.");
      return;
    }
    setTreeLoading(true);
    setTreeError("");
    try {
      const { data } = await api.get("/api/budgets/tree", { params: { period: parsedPeriod } });
      setTreeData(Array.isArray(data?.tree) ? data.tree : []);
    } catch (err) {
      setTreeError(err?.response?.data?.error || err?.message || "Error cargando arbol");
    } finally {
      setTreeLoading(false);
    }
  }, [period]);

  const loadBudgetsByCoordinator = useCallback(
    async (coordinatorUserId) => {
      const parsedPeriod = parsePeriodInput(period);
      if (!parsedPeriod) {
        setListError("Periodo invalido. Debe ser YYYY-MM.");
        return;
      }
      if (!coordinatorUserId) {
        setListError("Coordinacion sin usuario COORDINACION asociado.");
        setCoordinatorPayload(null);
        return;
      }
      setListLoading(true);
      setListError("");
      setCoordinatorPayload(null);
      setDirty({});
      try {
        const { data } = await api.get("/api/budgets", { params: { period: parsedPeriod, coordinator_id: coordinatorUserId } });
        setCoordinatorPayload(data || null);
      } catch (err) {
        setListError(err?.response?.data?.error || err?.message || "Error cargando presupuestos del coordinador");
      } finally {
        setListLoading(false);
      }
    },
    [period]
  );

  const loadMissing = useCallback(async () => {
    const parsedPeriod = parsePeriodInput(period);
    if (!parsedPeriod) {
      setMissingError("Periodo invalido. Debe ser YYYY-MM.");
      return;
    }
    setMissingLoading(true);
    setMissingError("");
    setMissingRows([]);
    try {
      const { data } = await api.get("/api/budgets/missing", { params: { period: parsedPeriod } });
      const rows = Array.isArray(data?.missing)
        ? data.missing
        : Array.isArray(data?.rows)
          ? data.rows
          : Array.isArray(data?.users)
            ? data.users
            : Array.isArray(data)
              ? data
              : [];
      setMissingRows(rows);
    } catch (err) {
      setMissingError(err?.response?.data?.error || err?.message || "Error consultando faltantes");
    } finally {
      setMissingLoading(false);
    }
  }, [period]);

  const doCopyFromPrevious = useCallback(async () => {
    const parsedPeriod = parsePeriodInput(period);
    if (!parsedPeriod) {
      setCopyError("Periodo invalido. Debe ser YYYY-MM.");
      return;
    }
    setCopyLoading(true);
    setCopyError("");
    setCopyResult(null);
    try {
      const { data } = await api.post("/api/budgets/copy", { period: parsedPeriod });
      setCopyResult(data);
      await loadTree();
      if (currentCoordUserId) {
        await loadBudgetsByCoordinator(currentCoordUserId);
      }
    } catch (err) {
      setCopyError(err?.response?.data?.error || err?.message || "Error copiando presupuestos");
    } finally {
      setCopyLoading(false);
    }
  }, [period, loadTree, loadBudgetsByCoordinator, currentCoordUserId]);

  const saveBatch = useCallback(async () => {
    if (!coordinatorPayload) return;

    const parsedPeriod = parsePeriodInput(period);
    if (!parsedPeriod) {
      setListError("Periodo invalido. Debe ser YYYY-MM.");
      return;
    }

    if (!validateLeadershipInputs()) return;

    const items = Object.entries(dirty).map(([user_id, budget_amount]) => ({
      user_id: Number(user_id),
      budget_amount: Number(budget_amount || 0),
      status: "DRAFT",
      currency: "COP",
    }));

    if (gerenciaEditAllowed && gerenciaUserId) {
      items.push({
        user_id: Number(gerenciaUserId),
        budget_amount: Number(gerenciaAmount || 0),
        status: "DRAFT",
        currency: "COP",
      });
    }

    if (direccionEditAllowed && direccionUserId) {
      items.push({
        user_id: Number(direccionUserId),
        budget_amount: Number(direccionAmount || 0),
        status: "DRAFT",
        currency: "COP",
      });
    }

    if (items.length === 0) return;

    setSaving(true);
    try {
      await api.put("/api/budgets/batch", { period: parsedPeriod, items });
      await loadTree();
      const coordUserId = coordinatorPayload?.coordinator?.id || currentCoordUserId;
      if (coordUserId) await loadBudgetsByCoordinator(coordUserId);
    } catch (err) {
      setListError(err?.response?.data?.error || err?.message || "Error guardando presupuestos");
    } finally {
      setSaving(false);
    }
  }, [coordinatorPayload, dirty, period, loadTree, loadBudgetsByCoordinator, currentCoordUserId]);

  useEffect(() => {
    loadTree();
  }, [loadTree]);

  useEffect(() => {
    setSelectedDireccionId("");
    setSelectedCoordUnitId("");
    setCoordinatorPayload(null);
    setDirty({});
    setListError("");
    setGerenciaEditAllowed(false);
    setGerenciaUserId("");
    setGerenciaAmount("");
    if (currentGerenciaNode) {
      const u = detectGerenciaUser(currentGerenciaNode);
      setDetectedGerenciaUser(u);
      setGerenciaUserId(u?.id || "");
    } else {
      setDetectedGerenciaUser(null);
      setGerenciaUserId("");
    }
  }, [selectedGerenciaId]);

  useEffect(() => {
    setSelectedCoordUnitId("");
    setCoordinatorPayload(null);
    setDirty({});
    setListError("");
    setDireccionEditAllowed(false);
    setDireccionUserId("");
    setDireccionAmount("");
    if (currentDireccionNode) {
      const u = detectDireccionUser(currentDireccionNode);
      setDetectedDireccionUser(u);
      setDireccionUserId(u?.id || "");
    } else {
      setDetectedDireccionUser(null);
      setDireccionUserId("");
    }
  }, [selectedDireccionId]);

  useEffect(() => {
    if (!selectedCoordUnitId) return;
    if (!currentCoordUserId) {
      setListError("Coordinacion sin usuario COORDINACION asociado.");
      setCoordinatorPayload(null);
      return;
    }
    loadBudgetsByCoordinator(currentCoordUserId);
  }, [selectedCoordUnitId, currentCoordUserId, loadBudgetsByCoordinator]);

  useEffect(() => {
    if (currentGerenciaNode) {
      const u = detectGerenciaUser(currentGerenciaNode);
      setDetectedGerenciaUser(u);
      setGerenciaUserId(u?.id || "");
    }
  }, [currentGerenciaNode]);

  useEffect(() => {
    if (currentDireccionNode) {
      const u = detectDireccionUser(currentDireccionNode);
      setDetectedDireccionUser(u);
      setDireccionUserId(u?.id || "");
    }
  }, [currentDireccionNode]);

  useEffect(() => {
    if (!selectedCoordUnitId || !currentCoordUserId) return;
    loadBudgetsByCoordinator(currentCoordUserId);
  }, [period, selectedCoordUnitId, currentCoordUserId, loadBudgetsByCoordinator]);

  const tableRows = useMemo(() => {
    if (!coordinatorPayload) return [];
    const coordinator = coordinatorPayload.coordinator;
    const advisors = coordinatorPayload.advisors || [];
    const rows = [];

    if (coordinator) {
      rows.push({
        kind: "COORD",
        user_id: coordinator.id,
        name: coordinator.name,
        document_id: coordinator.document_id,
        email: coordinator.email,
        active: coordinator.active,
        district_claro: coordinator.district_claro,
        regional: coordinator.regional,
        cargo: coordinator.cargo,
        budget: coordinator.budget,
      });
    }

    advisors.forEach((advisor) => {
      rows.push({
        kind: "ASESOR",
        user_id: advisor.user_id,
        name: advisor.name,
        document_id: advisor.document_id,
        email: advisor.email,
        active: advisor.active,
        district_claro: advisor.district_claro,
        regional: advisor.regional,
        cargo: advisor.cargo,
        budget: advisor.budget,
      });
    });

    const query = String(search || "").trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) => {
      const blob = `${row.name || ""} ${row.document_id || ""} ${row.email || ""} ${row.district_claro || ""} ${row.regional || ""}`.toLowerCase();
      return blob.includes(query);
    });
  }, [coordinatorPayload, search]);

  const dirtyCount = useMemo(() => Object.keys(dirty).length, [dirty]);
  const leadershipDirtyCount = useMemo(() => {
    let count = 0;
    if (gerenciaEditAllowed && gerenciaUserId) count += 1;
    if (direccionEditAllowed && direccionUserId) count += 1;
    return count;
  }, [gerenciaEditAllowed, direccionEditAllowed, gerenciaUserId, direccionUserId]);
  const totalDirtyCount = useMemo(() => dirtyCount + leadershipDirtyCount, [dirtyCount, leadershipDirtyCount]);
  const kpiPeople = useMemo(() => tableRows.length, [tableRows]);
  const tableBudgetTotal = useMemo(() => sumBudgetsFromRows(tableRows, dirty), [tableRows, dirty]);
  const leadershipBudgetTotal = useMemo(() => {
    let total = 0;
    if (gerenciaEditAllowed && gerenciaUserId) total += Number(gerenciaAmount || 0);
    if (direccionEditAllowed && direccionUserId) total += Number(direccionAmount || 0);
    return total;
  }, [gerenciaEditAllowed, direccionEditAllowed, gerenciaUserId, direccionUserId, gerenciaAmount, direccionAmount]);
  const kpiTotalBudget = useMemo(() => tableBudgetTotal + leadershipBudgetTotal, [tableBudgetTotal, leadershipBudgetTotal]);
  const kpiMissing = useMemo(() => {
    return tableRows.filter((row) => {
      const key = String(row.user_id);
      const value = dirty[key] != null ? Number(dirty[key]) : Number(row?.budget?.budget_amount || 0);
      return !row.budget || !Number.isFinite(value) || value <= 0;
    }).length;
  }, [tableRows, dirty]);

  const handleBudgetChange = (userId, value) => {
    const numeric = Number(String(value ?? "").replace(/[^\d]/g, ""));
    setDirty((prev) => ({ ...prev, [String(userId)]: Number.isFinite(numeric) ? numeric : 0 }));
  };

  const handleMarkZero = (userKey) => {
    setDirty((prev) => ({ ...prev, [userKey]: 0 }));
  };

  const resetDirty = () => setDirty({});
  const canSave = totalDirtyCount > 0 && !saving;

  const openMissing = () => {
    setShowMissing(true);
    loadMissing();
  };

  const openCopy = () => {
    setCopyError("");
    setCopyResult(null);
    setShowCopy(true);
  };

  const onConfirmRole = () => {
    if (confirmRole === "GERENCIA") setGerenciaEditAllowed(true);
    if (confirmRole === "DIRECCION") setDireccionEditAllowed(true);
    setConfirmRole("");
  };

  const validateLeadershipInputs = () => {
    if (gerenciaEditAllowed) {
      const uid = Number(gerenciaUserId);
      if (!Number.isFinite(uid)) {
        setListError("Usuario invalido para gerencia. Ingresa un ID numerico.");
        return false;
      }
    }
    if (direccionEditAllowed) {
      const uid = Number(direccionUserId);
      if (!Number.isFinite(uid)) {
        setListError("Usuario invalido para direccion. Ingresa un ID numerico.");
        return false;
      }
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 min-w-full text-base md:text-[17px]">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900">Recursos Humanos - Presupuesto / Metas</h1>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
              <span>RRHH</span> <ChevronRight size={12} /> <span className="text-red-700 font-semibold">Asignacion por jerarquia</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openMissing}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold"
            >
              <Info size={18} className="text-slate-500" />
              Ver faltantes
            </button>

            <button
              onClick={openCopy}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold"
            >
              <Copy size={18} />
              Copiar mes anterior
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-6 space-y-6 text-base md:text-[17px]">
        <BudgetFilters
          period={period}
          onPeriodChange={setPeriod}
          treeLoading={treeLoading}
          onReloadTree={loadTree}
          gerencias={gerencias}
          direcciones={direcciones}
          coordinaciones={coordinaciones}
          selectedGerenciaId={selectedGerenciaId}
          selectedDireccionId={selectedDireccionId}
          selectedCoordUnitId={selectedCoordUnitId}
          onSelectGerencia={setSelectedGerenciaId}
          onSelectDireccion={setSelectedDireccionId}
          onSelectCoord={setSelectedCoordUnitId}
          treeError={treeError}
          listError={listError}
          currentCoordNode={currentCoordNode}
          currentCoordUserId={currentCoordUserId}
        />

        <LeadershipBudgetPanel
          gerenciaNode={currentGerenciaNode}
          direccionNode={currentDireccionNode}
          gerenciaEditAllowed={gerenciaEditAllowed}
          direccionEditAllowed={direccionEditAllowed}
          detectedGerenciaUser={detectedGerenciaUser}
          detectedDireccionUser={detectedDireccionUser}
          gerenciaUserId={gerenciaUserId}
          direccionUserId={direccionUserId}
          gerenciaAmount={gerenciaAmount}
          direccionAmount={direccionAmount}
          onGerenciaUserId={setGerenciaUserId}
          onDireccionUserId={setDireccionUserId}
          onGerenciaAmount={setGerenciaAmount}
          onDireccionAmount={setDireccionAmount}
          onRequestAllowGerencia={() => setConfirmRole("GERENCIA")}
          onRequestAllowDireccion={() => setConfirmRole("DIRECCION")}
          onDisableGerencia={() => {
            setGerenciaEditAllowed(false);
            setGerenciaUserId("");
            setGerenciaAmount("");
          }}
          onDisableDireccion={() => {
            setDireccionEditAllowed(false);
            setDireccionUserId("");
            setDireccionAmount("");
          }}
          confirmRole={confirmRole}
          onConfirmRole={onConfirmRole}
          onCancelConfirm={() => setConfirmRole("")}
        />

        <BudgetKpiGrid
          kpiPeople={kpiPeople}
          kpiTotalBudget={kpiTotalBudget}
          kpiMissing={kpiMissing}
          dirtyCount={totalDirtyCount}
          saving={saving}
          onSave={saveBatch}
          canSave={canSave}
        />

        <BudgetTable
          selectedCoordUnitId={selectedCoordUnitId}
          listLoading={listLoading}
          coordinatorPayload={coordinatorPayload}
          tableRows={tableRows}
          dirty={dirty}
          search={search}
          onSearchChange={setSearch}
          onResetDirty={resetDirty}
          dirtyCount={dirtyCount}
          onBudgetChange={handleBudgetChange}
          onMarkZero={handleMarkZero}
        />
      </main>

      <MissingModal
        open={showMissing}
        onClose={() => setShowMissing(false)}
        period={period}
        onRefresh={loadMissing}
        loading={missingLoading}
        error={missingError}
        rows={missingRows}
      />

      <CopyModal
        open={showCopy}
        onClose={() => setShowCopy(false)}
        period={period}
        onCopy={doCopyFromPrevious}
        loading={copyLoading}
        error={copyError}
        result={copyResult}
      />
    </div>
  );
}
