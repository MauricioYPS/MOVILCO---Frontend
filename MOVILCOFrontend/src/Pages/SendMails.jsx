import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCoordAdvisorsByCoordinator,
  selectCoordAdvisors,
  selectCoordAdvisorsError,
  selectCoordAdvisorsLoading,
} from "../../store/reducers/coordAdvisorsReducers";
import api from "../../store/api";
import { currentPeriod, findNodeById, findNodes, parsePeriodInput } from "../components/budgets/budgetUtils";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Eye,
  Layers,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  Send,
  Settings2,
  UserRound,
  Users,
} from "lucide-react";

const DEFAULT_TEMPLATES = [
  { code: "PRESUPUESTO_ASESOR", name: "Presupuesto asesor", status: "active" },
  { code: "PRESUPUESTO_COORDINADOR", name: "Presupuesto coordinador", status: "active" },
  { code: "PRESUPUESTO_DIRECTOR", name: "Presupuesto director", status: "active" },
  { code: "INCUMPLIMIENTO_ASESOR", name: "Incumplimiento asesor", status: "active" },
  { code: "INCUMPLIMIENTO_COORDINADOR", name: "Incumplimiento coordinador", status: "disabled" },
  { code: "INCUMPLIMIENTO_DIRECTOR", name: "Incumplimiento director", status: "disabled" },
];

export default function SendMails() {
  const dispatch = useDispatch();
  const advisorsRaw = useSelector(selectCoordAdvisors);
  const advisorsLoading = useSelector(selectCoordAdvisorsLoading);
  const advisorsError = useSelector(selectCoordAdvisorsError);

  const [period, setPeriod] = useState(currentPeriod());
  const [treeData, setTreeData] = useState([]);
  const [treeLoading, setTreeLoading] = useState(false);
  const [treeError, setTreeError] = useState("");

  const [selectedGerenciaId, setSelectedGerenciaId] = useState("");
  const [selectedDireccionId, setSelectedDireccionId] = useState("");
  const [selectedCoordUnitId, setSelectedCoordUnitId] = useState("");

  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState("");
  const [messageType, setMessageType] = useState("PRESUPUESTO"); // PRESUPUESTO | INCUMPLIMIENTO
  const [targetRole, setTargetRole] = useState("ASESOR"); // ASESOR | COORDINADOR | DIRECTOR | GERENCIA | DIRECCION
  const [recipientRole, setRecipientRole] = useState("FILTROS"); // FILTROS | ASESOR | COORDINADOR | DIRECTOR | GERENCIA | DIRECCION

  const [city, setCity] = useState("Bogota D.C.");
  const [managerName, setManagerName] = useState("Gerente Regional");
  const [managerRole, setManagerRole] = useState("Director Comercial Regional");
  const [senderName, setSenderName] = useState("Equipo MOVILCO");
  const [senderRole, setSenderRole] = useState("Automatizador de correos");

  const [userIdInput, setUserIdInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewBump, setPreviewBump] = useState(0);

  const [sendSummary, setSendSummary] = useState(null);
  const [sending, setSending] = useState(false);
  const [roleUsers, setRoleUsers] = useState([]);
  const [roleUsersLoading, setRoleUsersLoading] = useState(false);
  const [roleUsersError, setRoleUsersError] = useState("");

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
      const dirIds = direcciones.map((d) => Number(d.id));
      return all.filter((item) => dirIds.includes(Number(item.parent_id)));
    }
    return all;
  }, [treeData, selectedDireccionId, selectedGerenciaId, direcciones]);

  const currentCoordNode = useMemo(() => {
    if (!selectedCoordUnitId) return null;
    return findNodeById(treeData, selectedCoordUnitId);
  }, [treeData, selectedCoordUnitId]);
  const currentCoordUserId = useMemo(() => {
    const user = currentCoordNode?.coordinator_user;
    return user?.id ? Number(user.id) : null;
  }, [currentCoordNode]);

  const normalizedUsers = useMemo(() => {
    if (!Array.isArray(advisorsRaw)) return [];
    return advisorsRaw
      .map((item, idx) => {
        const id = Number(item.id ?? item.user_id ?? item.advisor_id ?? idx);
        return {
          id,
          name: item.name ?? item.nombre ?? "Usuario",
          email: item.email ?? "",
          document: item.document_id ?? item.cedula ?? "",
          role: item.cargo ?? item.role ?? item.unit_type ?? "Asesor",
          district: item.district_claro ?? item.district ?? item.regional ?? "",
        };
      })
      .filter((u) => Number.isFinite(u.id));
  }, [advisorsRaw]);

  const matchesRole = useCallback(
    (user) => {
      const role = (user.role || "").toLowerCase();
      const roleFilter = recipientRole === "FILTROS" ? "ALL" : recipientRole;
      if (roleFilter === "ALL") return true;
      if (roleFilter === "ASESOR") return role.includes("asesor");
      if (roleFilter === "COORDINADOR") return role.includes("coord");
      if (roleFilter === "DIRECTOR") return role.includes("direct");
      if (roleFilter === "GERENCIA") return role.includes("gerenc") || role.includes("manager");
      if (roleFilter === "DIRECCION") return role.includes("direc");
      return true;
    },
    [recipientRole]
  );

  const baseUsers = useMemo(() => {
    const roleFilter = recipientRole === "FILTROS" ? "ALL" : recipientRole;
    if (roleFilter !== "ALL" && roleUsers.length > 0) return roleUsers;
    return normalizedUsers;
  }, [recipientRole, roleUsers, normalizedUsers]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    const byRole = baseUsers.filter(matchesRole);
    if (!q) return byRole;
    return byRole.filter((u) =>
      `${u.name} ${u.email} ${u.document} ${u.role} ${u.district}`.toLowerCase().includes(q)
    );
  }, [baseUsers, matchesRole, search]);

  const selectedUsers = useMemo(
    () => baseUsers.filter((u) => selectedIds.includes(u.id)),
    [baseUsers, selectedIds]
  );

  const previewUserId = useMemo(() => {
    const manualId = Number(userIdInput);
    if (Number.isFinite(manualId) && manualId > 0) return manualId;
    if (selectedIds.length > 0) return selectedIds[0];
    return null;
  }, [userIdInput, selectedIds]);

  const resolvedTemplate = useMemo(() => {
    const roleKey = targetRole === "GERENCIA" || targetRole === "DIRECCION" ? "DIRECTOR" : targetRole;
    const code = `${messageType}_${roleKey}`;
    const tpl = templates.find((t) => t.code === code);
    if (tpl) return tpl;
    const disabled = messageType === "INCUMPLIMIENTO" && roleKey !== "ASESOR";
    return { code, name: code.replace("_", " "), status: disabled ? "disabled" : "active" };
  }, [messageType, targetRole, templates]);

  const loadTemplates = useCallback(async () => {
    setTemplatesLoading(true);
    setTemplatesError("");
    try {
      const { data } = await api.get("/api/mail/templates");
      const list = Array.isArray(data?.templates) ? data.templates : Array.isArray(data) ? data : [];
      if (list.length > 0) {
        setTemplates(list);
      }
    } catch (err) {
      setTemplates(DEFAULT_TEMPLATES);
      setTemplatesError(err?.response?.data?.error || err?.message || "No se pudieron cargar plantillas, usando lista local.");
    } finally {
      setTemplatesLoading(false);
    }
  }, []);

  const loadTree = useCallback(async () => {
    const parsed = parsePeriodInput(period);
    if (!parsed) {
      setTreeError("Periodo invalido. Usa YYYY-MM.");
      return;
    }
    setTreeLoading(true);
    setTreeError("");
    try {
      const { data } = await api.get("/api/budgets/tree", { params: { period: parsed } });
      setTreeData(Array.isArray(data?.tree) ? data.tree : []);
    } catch (err) {
      setTreeError(err?.response?.data?.error || err?.message || "No se pudo cargar la jerarquia.");
      setTreeData([]);
    } finally {
      setTreeLoading(false);
    }
  }, [period]);

  const fetchUsers = useCallback(
    (coordUserId) => {
      if (!coordUserId) return;
      dispatch(fetchCoordAdvisorsByCoordinator({ coordinatorId: coordUserId, period }));
    },
    [dispatch, period]
  );

  const loadUsersByRole = useCallback(
    async (roleKey) => {
      if (roleKey === "ALL") {
        setRoleUsers([]);
        setRoleUsersError("");
        return;
      }
      setRoleUsersLoading(true);
      setRoleUsersError("");
      try {
        const { data } = await api.get("/api/users", { params: { role: roleKey.toLowerCase() } });
        const list = Array.isArray(data?.users) ? data.users : Array.isArray(data) ? data : [];
        const normalized = list
          .map((item, idx) => {
            const id = Number(item.id ?? item.user_id ?? idx);
            return {
              id,
              name: item.name ?? item.nombre ?? "Usuario",
              email: item.email ?? "",
              document: item.document_id ?? item.cedula ?? "",
              role: item.cargo ?? item.role ?? item.unit_type ?? "",
              district: item.district_claro ?? item.district ?? item.regional ?? "",
            };
          })
          .filter((u) => Number.isFinite(u.id));
        setRoleUsers(normalized);
        if (normalized.length === 0) {
          setRoleUsersError("No hay usuarios para el cargo seleccionado. Se usara la lista por jerarquia.");
        }
      } catch (err) {
        setRoleUsers([]);
        setRoleUsersError(err?.response?.data?.error || err?.message || "No se pudo cargar usuarios por cargo.");
      } finally {
        setRoleUsersLoading(false);
      }
    },
    []
  );

  const buildOverrides = useCallback(
    () => ({
      CIUDAD: city,
      GERENTE_NOMBRE: managerName,
      GERENTE_CARGO: managerRole,
      REMITENTE_NOMBRE: senderName,
      REMITENTE_CARGO: senderRole,
    }),
    [city, managerName, managerRole, senderName, senderRole]
  );

  const buildPayload = useCallback(
    (ids) => ({
      templateCode: resolvedTemplate?.code,
      period: parsePeriodInput(period) || period,
      userIds: ids,
      overrides: buildOverrides(),
    }),
    [resolvedTemplate, period, buildOverrides]
  );

  const requestPreview = useCallback(
    async (ids) => {
      setPreviewLoading(true);
      setPreviewError("");
      try {
        const monthText = prettyMonth(period);
        const year = String(period || "").split("-")[0] || "";
        const userName = ids?.length ? (selectedUsers.find((u) => u.id === ids[0])?.name || "Usuario") : "Usuario";
        const { data } = await api.post("/api/mail/preview", {
          templateCode: resolvedTemplate?.code,
          data: {
            MES_TEXTO: monthText.toUpperCase() || "MES",
            ANIO: year || "2026",
            NOMBRE_COMPLETO: userName,
          },
        });

        setPreviewData({
          subject: data?.subject || data?.asunto || resolvedTemplate?.name || "Vista previa",
          html: data?.html || data?.body || "<p>No se recibio HTML de vista previa.</p>",
        });
      } catch (err) {
        setPreviewData(null);
        setPreviewError(err?.response?.data?.error || err?.message || "No se pudo generar la vista previa.");
      } finally {
        setPreviewLoading(false);
      }
    },
    [period, resolvedTemplate, selectedUsers]
  );

  useEffect(() => {
    loadTemplates();
    loadTree();
  }, [loadTemplates, loadTree]);

  useEffect(() => {
    setSelectedDireccionId("");
    setSelectedCoordUnitId("");
    setSelectedIds([]);
  }, [selectedGerenciaId]);

  useEffect(() => {
    setSelectedCoordUnitId("");
    setSelectedIds([]);
  }, [selectedDireccionId]);

  useEffect(() => {
    setSelectedIds([]);
    if (currentCoordUserId) {
      fetchUsers(currentCoordUserId);
    }
  }, [currentCoordUserId, fetchUsers, selectedCoordUnitId]);

  useEffect(() => {
    const roleFilter = recipientRole === "FILTROS" ? "ALL" : recipientRole;
    loadUsersByRole(roleFilter);
  }, [recipientRole, loadUsersByRole]);

  useEffect(() => {
    if (!resolvedTemplate?.code || !previewUserId) {
      setPreviewData(null);
      setPreviewError("");
      return;
    }
    if (resolvedTemplate?.status === "disabled") {
      setPreviewData(null);
      setPreviewError("La plantilla para este cargo aun esta en desarrollo.");
      return;
    }
    if (!parsePeriodInput(period)) return;
    const ids = [Number(previewUserId)];
    const timer = setTimeout(() => requestPreview(ids), 300);
    return () => clearTimeout(timer);
  }, [resolvedTemplate, previewUserId, period, requestPreview, previewBump]);

  const toggleUser = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectAllFiltered = () => {
    const ids = filteredUsers.map((u) => u.id);
    setSelectedIds(Array.from(new Set([...selectedIds, ...ids])));
  };

  const clearAll = () => setSelectedIds([]);

  const handleSend = async () => {
    const parsed = parsePeriodInput(period);
    const ids = Number(userIdInput) ? [Number(userIdInput)] : selectedIds;
    const cleanedIds = ids.map((n) => Number(n)).filter((n) => Number.isFinite(n) && n > 0);

    if (!resolvedTemplate?.code || resolvedTemplate?.status === "disabled" || !parsed || cleanedIds.length === 0) {
      setSendSummary({ error: "Selecciona tipo, cargo, periodo valido y al menos un destinatario." });
      return;
    }

    setSending(true);
    setSendSummary(null);
    try {
      const { data } = await api.post("/api/mail/send/bulk/auto", buildPayload(cleanedIds));
      const failedList = Array.isArray(data?.failures) ? data.failures : Array.isArray(data?.errors) ? data.errors : [];
      const summary = {
        total: cleanedIds.length,
        sent: Number(data?.sent ?? data?.success ?? cleanedIds.length - failedList.length),
        failed: Number(data?.failed ?? failedList.length ?? 0),
        failures: failedList,
      };
      setSendSummary(summary);
      if (!summary.failed) {
        setSelectedIds([]);
        setUserIdInput("");
      }
    } catch (err) {
      setSendSummary({
        error: err?.response?.data?.error || err?.message || "No se pudo enviar el correo masivo.",
        total: cleanedIds.length,
      });
    } finally {
      setSending(false);
    }
  };

  const periodInvalid = Boolean(period && !parsePeriodInput(period));
  const recipientsCount = Number(userIdInput) ? 1 : selectedIds.length;
  const canSend = Boolean(
    resolvedTemplate?.code &&
      resolvedTemplate?.status !== "disabled" &&
      !periodInvalid &&
      recipientsCount > 0 &&
      !sending
  );

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-4">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Layers size={16} className="text-[#7f1d1d]" />
            <span className="font-semibold text-slate-700">Correo masivo automatizado</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Envio de correos masivos</h1>
              <p className="text-sm lg:text-base text-slate-600">
                Reusa la jerarquia de Presupuesto RH para escoger destinatarios y previsualizar antes de enviar.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge text={`Periodo ${period || "N/D"}`} />
              <Badge text={`${recipientsCount} destinatarios`} variant="muted" />
            </div>
          </div>
        </header>

        {sendSummary ? (
          <div
            className={`border rounded-xl p-4 flex flex-col gap-2 ${
              sendSummary.error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {sendSummary.error ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
              <p className="font-bold text-base">
                {sendSummary.error
                  ? "No se pudo completar el envio."
                  : `Envio procesado: ${sendSummary.sent ?? 0} enviados / ${sendSummary.failed ?? 0} fallidos`}
              </p>
            </div>
            {sendSummary.error && <p className="text-sm">{sendSummary.error}</p>}
            {Array.isArray(sendSummary.failures) && sendSummary.failures.length > 0 && (
              <div className="text-sm">
                <p className="font-semibold mb-1">Detalles de fallos:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {sendSummary.failures.map((f, idx) => (
                    <li key={idx} className="text-slate-700">
                      {typeof f === "string" ? f : JSON.stringify(f)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <Card
              title="Tipo de mensaje"
              icon={<Layers size={18} className="text-[#7f1d1d]" />}
              action={
                <button
                  type="button"
                  onClick={loadTemplates}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#7f1d1d] hover:text-red-900"
                  disabled={templatesLoading}
                >
                  <RefreshCw size={16} className={templatesLoading ? "animate-spin" : ""} />
                  Actualizar lista
                </button>
              }
            >
              {templatesError && (
                <div className="mb-3 text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {templatesError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMessageType("PRESUPUESTO")}
                  className={`w-full border rounded-xl p-4 text-left font-bold ${
                    messageType === "PRESUPUESTO" ? "border-[#7f1d1d] bg-red-50" : "border-slate-200 bg-white"
                  }`}
                >
                  Presupuesto
                  <p className="text-sm font-normal text-slate-600 mt-1">Asignacion y seguimiento.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setMessageType("INCUMPLIMIENTO")}
                  className={`w-full border rounded-xl p-4 text-left font-bold ${
                    messageType === "INCUMPLIMIENTO" ? "border-[#7f1d1d] bg-red-50" : "border-slate-200 bg-white"
                  }`}
                >
                  Incumplimiento
                  <p className="text-sm font-normal text-slate-600 mt-1">Alertas de desviacion.</p>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <SelectField
                  label="Cargo objetivo"
                  value={targetRole}
                  onChange={(v) => setTargetRole(v || "ASESOR")}
                  options={[
                    { id: "ASESOR", name: "Asesor" },
                    { id: "COORDINADOR", name: "Coordinacion" },
                    { id: "DIRECTOR", name: "Director" },
                    { id: "GERENCIA", name: "Gerencia" },
                    { id: "DIRECCION", name: "Direccion" },
                  ]}
                  placeholder="Seleccione cargo"
                  loading={false}
                />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Plantilla seleccionada</div>
                  <div
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                      resolvedTemplate?.status === "disabled"
                        ? "border-amber-200 bg-amber-50 text-amber-800"
                        : "border-emerald-200 bg-emerald-50 text-emerald-800"
                    }`}
                  >
                    {resolvedTemplate?.code || "N/D"}
                  </div>
                  {resolvedTemplate?.status === "disabled" && (
                    <p className="text-xs text-amber-700">Combinacion en desarrollo. Selecciona otro cargo.</p>
                  )}
                </div>
              </div>
            </Card>

            <Card
              title="Datos del remitente y contexto"
              icon={<Mail size={18} className="text-[#7f1d1d]" />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Periodo (YYYY-MM)" error={periodInvalid ? "Formato invalido" : ""}>
                  <input
                    type="month"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-red-100 ${
                      periodInvalid ? "border-red-400" : "border-slate-200"
                    }`}
                  />
                </Field>
                <Field label="Ciudad">
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
                  />
                </Field>
                <Field label="Nombre gerente">
                  <input
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
                  />
                </Field>
                <Field label="Cargo gerente">
                  <input
                    value={managerRole}
                    onChange={(e) => setManagerRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
                  />
                </Field>
                <Field label="Remitente (nombre)">
                  <input
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
                  />
                </Field>
                <Field label="Remitente (cargo)">
                  <input
                    value={senderRole}
                    onChange={(e) => setSenderRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
                  />
                </Field>
              </div>
            </Card>

            <Card
              title="Destinatarios"
              icon={<Users size={18} className="text-[#7f1d1d]" />}
              action={
                <span className="inline-flex items-center justify-center h-8 px-3 rounded-full bg-red-50 text-[#7f1d1d] border border-red-100 text-sm font-bold">
                  {recipientsCount} seleccionados
                </span>
              }
            >
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <SelectField
                    label="Gerencia"
                    value={selectedGerenciaId}
                    onChange={(v) => setSelectedGerenciaId(v)}
                    options={gerencias}
                    placeholder="Todas"
                    loading={treeLoading}
                  />
                  <SelectField
                    label="Direccion"
                    value={selectedDireccionId}
                    onChange={(v) => setSelectedDireccionId(v)}
                    options={direcciones}
                    placeholder={selectedGerenciaId ? "Todas de la gerencia" : "Todas"}
                    loading={treeLoading}
                  />
                  <SelectField
                    label="Coordinacion"
                    value={selectedCoordUnitId}
                    onChange={(v) => setSelectedCoordUnitId(v)}
                    options={coordinaciones}
                    placeholder="Seleccione una coordinacion"
                    loading={treeLoading}
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={loadTree}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#7f1d1d]"
                    disabled={treeLoading}
                  >
                    <RefreshCw size={16} className={treeLoading ? "animate-spin" : ""} />
                    Recargar jerarquia
                  </button>
                  {treeError && <span className="text-xs text-red-600">{treeError}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SelectField
                    label="Cargo destinatario"
                    value={recipientRole}
                    onChange={(v) => setRecipientRole(v || "FILTROS")}
                    options={[
                      { id: "FILTROS", name: "Segun filtros jerarquia" },
                      { id: "ASESOR", name: "Asesores" },
                      { id: "COORDINADOR", name: "Coordinadores" },
                      { id: "DIRECTOR", name: "Directores" },
                      { id: "GERENCIA", name: "Gerencia" },
                      { id: "DIRECCION", name: "Direccion" },
                    ]}
                    placeholder="Selecciona cargo"
                    loading={roleUsersLoading}
                  />
                  {roleUsersError && (
                    <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      {roleUsersError}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="relative flex-1">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar por nombre, documento, email o distrito"
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-100 text-base"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAllFiltered}
                      className="text-sm font-semibold text-[#7f1d1d] hover:text-red-900"
                    >
                      Seleccionar todos
                    </button>
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-sm font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white h-64 overflow-y-auto">
                  {advisorsLoading && (
                    <div className="h-full flex items-center justify-center text-sm text-slate-500 gap-2">
                      <Loader2 size={18} className="animate-spin" /> Cargando usuarios...
                    </div>
                  )}
                  {!advisorsLoading && advisorsError && (
                    <div className="p-4 text-sm text-red-700">{advisorsError}</div>
                  )}
                  {!advisorsLoading && !advisorsError && filteredUsers.length === 0 && (
                    <div className="p-4 text-sm text-slate-500">Sin usuarios para los filtros actuales.</div>
                  )}
                  {!advisorsLoading && !advisorsError && filteredUsers.length > 0 && (
                    <ul className="divide-y divide-slate-100">
                      {filteredUsers.map((u) => {
                        const checked = selectedIds.includes(u.id);
                        return (
                          <li key={u.id}>
                            <label className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleUser(u.id)}
                                className="mt-1 h-5 w-5 rounded border-slate-300 text-[#7f1d1d] focus:ring-[#7f1d1d]"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 truncate">{u.name}</p>
                                <p className="text-sm text-slate-500 truncate">
                                  {u.email || "Correo N/D"} - {u.document || "Doc N/D"}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                  {u.role} {u.district ? `- ${u.district}` : ""}
                                </p>
                              </div>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((u) => (
                    <Chip key={u.id} text={u.name} onRemove={() => toggleUser(u.id)} />
                  ))}
                  {selectedUsers.length === 0 && (
                    <p className="text-sm text-slate-500">No hay destinatarios seleccionados.</p>
                  )}
                </div>
              </div>
            </Card>

            <Card title="Opciones avanzadas" icon={<Settings2 size={18} className="text-[#7f1d1d]" />}>
              <div className="space-y-3">
                <Field label="Envio rapido por user_id (omite la seleccion masiva)">
                  <input
                    value={userIdInput}
                    onChange={(e) => setUserIdInput(e.target.value)}
                    placeholder="Ej: 1234"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
                  />
                </Field>
                <div className="text-xs text-slate-500">
                  Si se ingresa un user_id valido, se ignorara la lista de checks y se enviara solo a ese usuario.
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  className="w-full sm:w-1/3 bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-xl font-semibold hover:bg-slate-50"
                  onClick={() => {
                    setSelectedIds([]);
                    setUserIdInput("");
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!canSend}
                  className={`w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-extrabold text-white shadow-md ${
                    canSend ? "bg-[#7f1d1d] hover:bg-red-900" : "bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  Enviar
                </button>
              </div>
              {!canSend && (
                <p className="text-xs text-slate-500 mt-2">
                  Selecciona tipo y cargo, periodo valido y al menos un destinatario para habilitar el envio.
                </p>
              )}
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <Card
              title="Vista previa HTML"
              icon={<Eye size={18} className="text-[#7f1d1d]" />}
              action={
                <button
                  type="button"
                  onClick={() => setPreviewBump((v) => v + 1)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#7f1d1d]"
                  disabled={previewLoading}
                >
                  <RefreshCw size={16} className={previewLoading ? "animate-spin" : ""} />
                  Actualizar
                </button>
              }
            >
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                  <Badge text={resolvedTemplate?.code || "Plantilla sin seleccionar"} />
                  <Badge text={previewUserId ? `Preview user_id ${previewUserId}` : "Selecciona destinatario"} variant="muted" />
                </div>
                {previewError && (
                  <div className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {previewError}
                  </div>
                )}
              </div>

              {!previewUserId && (
                <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-500">
                  Selecciona tipo, cargo y destinatario para previsualizar.
                </div>
              )}

              {previewUserId && (
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail size={16} className="text-[#7f1d1d]" />
                      <span className="font-semibold text-slate-900 truncate">
                        {senderName} ({senderRole})
                      </span>
                    </div>
                    <span className="text-slate-400">-&gt;</span>
                    <div className="flex items-center gap-2 min-w-0">
                      <UserRound size={16} className="text-[#7f1d1d]" />
                      <span className="truncate text-slate-700">
                        user_id {previewUserId} {selectedUsers[0]?.name ? `- ${selectedUsers[0].name}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 border-b border-slate-200">
                    <div className="text-sm font-semibold text-slate-500">Asunto</div>
                    <div className="text-base font-bold text-slate-900">
                      {previewData?.subject || resolvedTemplate?.name || "Sin asunto"}
                    </div>
                  </div>

                  <div className="min-h-[320px] max-h-[520px] overflow-y-auto">
                    {previewLoading ? (
                      <div className="h-full flex items-center justify-center text-sm text-slate-500 gap-2">
                        <Loader2 size={18} className="animate-spin" /> Generando vista previa...
                      </div>
                    ) : (
                      <div
                        className="prose prose-sm max-w-none px-4 py-4"
                        dangerouslySetInnerHTML={{ __html: previewData?.html || "<p>No hay contenido.</p>" }}
                      />
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, icon, children, action }) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-800">
          <span className="p-2 rounded-lg bg-red-50 border border-red-100 text-[#7f1d1d]">{icon}</span>
          <h3 className="text-base font-extrabold uppercase tracking-wide">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</span>
      {children}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

function Badge({ text, variant = "primary" }) {
  const styles =
    variant === "muted"
      ? "bg-slate-100 text-slate-700 border-slate-200"
      : "bg-red-50 text-[#7f1d1d] border-red-100";
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${styles}`}>
      {text}
    </span>
  );
}

function SelectField({ label, value, onChange, options, placeholder, loading }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
        {label}
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-100"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function Chip({ text, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#7f1d1d] border border-red-100 text-sm font-semibold">
      {text}
      <button type="button" onClick={onRemove} className="text-[#7f1d1d] hover:text-red-900">
        x
      </button>
    </span>
  );
}

function prettyMonth(yyyyMm) {
  if (!yyyyMm || !/^\d{4}-\d{2}$/.test(yyyyMm)) return "";
  const month = Number(yyyyMm.split("-")[1]);
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  return months[(month || 1) - 1] || "";
}
