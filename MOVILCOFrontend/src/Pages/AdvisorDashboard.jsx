import React, { useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import {
  LayoutDashboard,
  Plus,
  Bell,
  DollarSign,
  Smartphone,
  Menu,
  X,
  LogOut,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  MessageSquare,
  Zap,
  HelpCircle,
  FileWarning,
  Wifi,
  Monitor
} from "lucide-react"
import useAuthSession from "../hooks/useAuthSession"
import { loadAdvisorInfo, loadAdvisorKpi, selectAdvisorInfo } from "../../store/reducers/advisorInfoSlice"
import {
  loadApprovedSales,
  loadPendingSales,
  loadRejectedSales,
  registerSale,
  selectAdvisorSales
} from "../../store/reducers/advisorSalesSlice"
import {selectAdvisorCiap } from "../../store/reducers/advisorCiapSlice"

const SERVICE_STYLES = {
  internet: { classes: "bg-blue-100 text-blue-700", icon: <Wifi size={16} /> },
  movil: { classes: "bg-purple-100 text-purple-700", icon: <Smartphone size={16} /> },
  tv: { classes: "bg-pink-100 text-pink-700", icon: <Monitor size={16} /> },
  default: { classes: "bg-slate-100 text-slate-700", icon: <FileText size={16} /> }
}

const STATUS_CONFIG = {
  aprobada: { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200", icon: <CheckCircle2 size={12} /> },
  pendiente: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: <Clock size={12} /> },
  rechazada: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: <AlertTriangle size={12} /> },
  revision: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: <FileWarning size={12} /> }
}

const MONTHLY_GOAL_DEFAULT = 13

const formatCurrency = (value) => {
  if (Number.isNaN(Number(value))) return "$ 0"
  return `$ ${Number(value).toLocaleString("es-CO")}`
}

const adaptNotification = (raw) => ({
  id: raw?.id ?? crypto.randomUUID?.() ?? String(Date.now()),
  title: raw?.title ?? raw?.titulo ?? "Notificacion",
  type: raw?.type ?? raw?.tipo ?? "info",
  msg: raw?.msg ?? raw?.mensaje ?? "",
  time: raw?.time ?? raw?.hora ?? ""
})

const computeKpiFallback = (sales, monthlyGoal = MONTHLY_GOAL_DEFAULT) => {
  const approved = sales.filter((s) => s.estado === "aprobada").length
  const pending = sales.filter((s) => s.estado === "pendiente").length
  const rejected = sales.filter((s) => s.estado === "rechazada").length
  const projectedCommission = sales.reduce((acc, s) => acc + (s.estado === "aprobada" ? s.monto ?? 0 : 0), 0)

  return {
    monthlyGoal,
    approvedSales: approved,
    pendingSales: pending,
    rejectedSales: rejected,
    projectedCommission,
    gapToBonus: Math.max(monthlyGoal - approved, 0)
  }
}

const ServiceIcon = ({ type }) => {
  const cfg = SERVICE_STYLES[type] || SERVICE_STYLES.default
  return <div className={`p-2 rounded-lg ${cfg.classes} shadow-sm`}>{cfg.icon}</div>
}

const StatusPill = ({ status }) => {
  const style = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pendiente
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${style.bg} ${style.text} ${style.border}`}>
      {style.icon} {status}
    </span>
  )
}

const ProgressBar = ({ value, max, colorClass = "bg-red-600" }) => {
  const percentage = Math.min((value / max) * 100, 100)
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${colorClass}`} style={{ width: `${percentage}%` }} />
    </div>
  )
}

const SalesList = ({ sales, onSelect, filterType, setFilterType }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-slate-800 text-lg">Gestiones Recientes</h3>
      <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
        {["all", "pendiente", "aprobada", "rechazada"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 text-xs font-bold rounded-md capitalize transition-all ${
              filterType === type ? "bg-slate-800 text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {type === "all" ? "Todas" : type}
          </button>
        ))}
      </div>
    </div>

    <div className="space-y-3">
      {sales.map((sale) => (
        <div
          key={sale.id}
          className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <ServiceIcon type={sale.type} />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-800">{sale.cliente}</h4>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono">{sale.id}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">{sale.producto}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-bold text-slate-700">{formatCurrency(sale.monto)}</span>
              <span className="block text-[10px] text-gray-400">{sale.fecha}</span>
            </div>
            <StatusPill status={sale.estado} />
            <button
              onClick={() => onSelect(sale.id)}
              className="p-2 text-gray-400 hover:text-[#C62828] hover:bg-red-50 rounded-full transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default function AdvisorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNewSaleModal, setShowNewSaleModal] = useState(false)
  const [filterType, setFilterType] = useState("all")
  const [saleForm, setSaleForm] = useState({
    fecha: new Date().toISOString().slice(0, 10),
    estado_liquidacion: "PENDIENTE",
    linea_negocio: "HOGAR",
    cuenta: "",
    ot: "",
    idasesor: "",
    nombreasesor: "",
    cantserv: "1",
    tipored: "FTTH",
    division: "",
    area: "",
    zona: "",
    poblacion: "",
    d_distrito: "",
    renta: "80000",
    venta: "1",
    tipo_registro: "VENTA",
    estrato: "3",
    paquete_pvd: "",
    mintic: "NO",
    tipo_producto: "INTERNET FIJO",
    venta_convergente: "NO",
    venta_instale_dth: "",
    sac_final: "",
    cedula_vendedor: "",
    nombre_vendedor: "",
    modalidad_venta: "",
    tipo_vendedor: "ASESOR COMERCIAL FIJO",
    tipo_red_comercial: "",
    nombre_regional: "",
    nombre_comercial: "",
    nombre_lider: "",
    retencion_control: "",
    observ_retencion: "",
    tipo_contrato: "DOBLE",
    tarifa_venta: "0",
    comision_neta: "80000",
    punto_equilibrio: "0"
  })

  const dispatch = useDispatch()
  const { token, user } = useAuthSession()
  const salesState = useSelector(selectAdvisorSales)
  const infoState = useSelector(selectAdvisorInfo)
  const ciapState = useSelector(selectAdvisorCiap)

  const advisorId = infoState.advisor?.id || user?.id
  const advisorDocument =
    infoState.advisor?.document || user?.document_id || user?.documento || user?.cedula || user?.document || ""
  const coordinatorId =
    infoState.advisor?.coordinator_id ||
    user?.coordinator_id ||
    user?.coordinatorId ||
    user?.coordinator ||
    user?.coordinador_id ||
    null

  const advisorName = infoState.advisor?.name || user?.name || "Asesor Movilco"
  const advisorCargo = infoState.advisor?.cargo || user?.cargo || user?.role || "Asesor Comercial"

  const sales = useMemo(
    () => [
      ...(salesState.pending || []),
      ...(salesState.approved || []),
      ...(salesState.rejected || [])
    ],
    [salesState.pending, salesState.approved, salesState.rejected]
  )

  const notifications = useMemo(
    () =>
      (salesState.rejected || []).map((sale) =>
        adaptNotification({
          id: sale.id,
          title: "Correccion requerida",
          type: "error",
          msg: sale.observaciones || "Venta rechazada, revise los documentos.",
          time: sale.fecha || ""
        })
      ),
    [salesState.rejected]
  )

  const filteredSales = useMemo(
    () => (filterType === "all" ? sales : sales.filter((s) => s.estado?.toLowerCase() === filterType)),
    [sales, filterType]
  )

  const kpiData = useMemo(() => {
    if (infoState.kpi) {
      const k = infoState.kpi
      return {
        monthlyGoal: k.prorrateo || MONTHLY_GOAL_DEFAULT,
        approvedSales: k.ventas || salesState.approved?.length || 0,
        pendingSales: salesState.pending?.length || 0,
        rejectedSales: salesState.rejected?.length || 0,
        projectedCommission: (k.ventas || salesState.approved?.length || 0) * 0.1,
        gapToBonus: Math.max((k.prorrateo || MONTHLY_GOAL_DEFAULT) - (k.ventas || salesState.approved?.length || 0), 0)
      }
    }
    return computeKpiFallback(sales, MONTHLY_GOAL_DEFAULT)
  }, [infoState.kpi, sales, salesState.pending?.length, salesState.rejected?.length, salesState.approved?.length])

  const loadAll = useCallback(() => {
    if (!advisorId) return
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    }
    dispatch(loadAdvisorInfo(advisorId))
    dispatch(loadAdvisorKpi({ documento: advisorDocument, period: new Date().toISOString().slice(0, 7) }))
    dispatch(loadPendingSales(coordinatorId || advisorId))
    dispatch(loadApprovedSales(coordinatorId || advisorId))
    dispatch(loadRejectedSales(coordinatorId || advisorId))
  }, [advisorDocument, advisorId, coordinatorId, dispatch, token])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const handleNewSaleSubmit = async () => {
    const payload = {
      ...saleForm,
      asesor_id: advisorId,
      coordinator_id: coordinatorId,
      idasesor: saleForm.idasesor || advisorDocument,
      nombreasesor: saleForm.nombreasesor || user?.name || "",
      cedula_vendedor: saleForm.cedula_vendedor || advisorDocument,
      nombre_vendedor: saleForm.nombre_vendedor || user?.name || "",
      fecha: saleForm.fecha || new Date().toISOString().slice(0, 10),
      estado_liquidacion: saleForm.estado_liquidacion || "PENDIENTE",
      estado_revision: saleForm.estado_revision || "pendiente",
      linea_negocio: saleForm.linea_negocio || "HOGAR",
      mintic: saleForm.mintic || "NO",
      venta_convergente: saleForm.venta_convergente || "NO",
      tipo_vendedor: saleForm.tipo_vendedor || "ASESOR COMERCIAL FIJO",
      tipo_producto: saleForm.tipo_producto || "INTERNET FIJO",
      tipo_contrato: saleForm.tipo_contrato || "DOBLE"
    }
    await dispatch(registerSale(payload))
    setShowNewSaleModal(false)
    loadAll()
  }



  const handleInputChange = (field, value) => {
    setSaleForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">



      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="bg-white   h-16 flex items-center justify-between px-6 lg:px-8 z-10">
          <div className="flex items-center gap-4">

            <h1 className="text-xl font-bold text-slate-800">Panel del Asesor</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Hoy</span>
              <span className="text-sm font-bold text-slate-800">{new Date().toLocaleDateString("es-CO")}</span>
              
            </div>
            <button className="relative p-2 text-gray-400 hover:text-[#C62828] transition-colors">
              <Bell size={24} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
            
          <div className="max-w-7xl mx-auto space-y-6">
            {/* {(salesState.error || infoState.error || ciapState.error) && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
                {salesState.error || infoState.error || ciapState.error}
              </div>
            )} */}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#868686]" />
                <div className="flex-1 w-full">
                  <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Meta Mensual</h2>
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-4xl font-extrabold text-slate-900">
                      {Math.round((kpiData.approvedSales / (kpiData.monthlyGoal || 1)) * 100)}%
                    </span>
                    <span className="text-sm font-medium text-gray-400 mb-1.5">/ 100%</span>
                  </div>
                  <ProgressBar value={kpiData.approvedSales} max={kpiData.monthlyGoal} colorClass="bg-gradient-to-r from-red-500 to-red-700" />
                  <p className="mt-3 text-sm font-medium text-slate-600 flex items-center gap-2">
                    <Zap size={16} className="text-amber-500 fill-amber-500" />
                    Te faltan <span className="font-bold text-[#C62828]">{kpiData.gapToBonus} conexiones</span> para el bono.
                  </p>
                </div>

                <div className="flex gap-4 sm:border-l sm:border-gray-100 sm:pl-6">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-emerald-600">{kpiData.approvedSales}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase">Aprobadas</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-amber-500">{kpiData.pendingSales}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase">Pendientes</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-red-500">{kpiData.rejectedSales}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase">Rechazos</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 grid grid-rows-2 gap-4">
                <button
                  onClick={() => setShowNewSaleModal(true)}
                  className="bg-[#C62828] hover:bg-red-800 text-white rounded-xl p-4 shadow-md flex items-center justify-between transition-all group"
                >
                  <div className="text-left">
                    <span className="block font-bold text-lg">Registrar Venta</span>
                    <span className="text-red-100 text-xs">Nueva solicitud</span>
                  </div>
                  <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
                    <Plus size={24} />
                  </div>
                </button>

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase">Comision Estimada</span>
                    <span className="block font-bold text-xl text-slate-800">{formatCurrency(kpiData.projectedCommission)}</span>
                  </div>
                  <div className="bg-emerald-50 p-2.5 rounded-full text-emerald-600">
                    <DollarSign size={20} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">CIAP</h3>
                <p className="text-xs text-gray-500">Solicita CIAP del periodo actual</p>
              </div>

            </div>
            {ciapState.loading && <p className="text-xs text-gray-500">Cargando CIAP...</p>}
            {ciapState.records && ciapState.records.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="text-sm font-bold mb-2">Ventas CIAP</div>
                <ul className="divide-y divide-gray-100">
                  {ciapState.records.map((item) => (
                    <li key={`${item.cuenta}-${item.ot}`} className="py-2 text-sm text-gray-700 flex justify-between">
                      <span>{item.producto}</span>
                      <span className="text-xs text-gray-500">{item.estado}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-4">
                <SalesList sales={filteredSales} onSelect={() => {}} filterType={filterType} setFilterType={setFilterType} />
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <Bell size={18} className="text-slate-400" /> Novedades
                </h3>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-gray-200 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase">Mensajes del Coordinador</span>
                    <span className="text-xs text-blue-600 font-bold hover:underline cursor-pointer">Ver todos</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer relative">
                        {notif.type === "error" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />}
                        {notif.type === "info" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}

                        <div className="flex justify-between items-start mb-1">
                          <h5 className={`text-xs font-bold ${notif.type === "error" ? "text-red-600" : "text-blue-600"}`}>{notif.title}</h5>
                          <span className="text-[10px] text-gray-400">{notif.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-snug">{notif.msg}</p>
                      </div>
                    ))}
                  </div>


                </div>
              </div>
            </div>
          </div>
        </main>

        {showNewSaleModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
              <div className="bg-[#C62828] p-4 flex justify-between items-center text-white shrink-0">
                <h3 className="font-bold text-lg">Registrar Venta</h3>
                <button onClick={() => setShowNewSaleModal(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Datos del Cliente</label>
                  <input
                    type="text"
                    placeholder="Cuenta"
                    value={saleForm.cuenta}
                    onChange={(e) => handleInputChange("cuenta", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none mb-3"
                  />
                  <input
                    type="text"
                    placeholder="OT"
                    value={saleForm.ot}
                    onChange={(e) => handleInputChange("ot", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none mb-3"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Cant. servicios"
                      value={saleForm.cantserv}
                      onChange={(e) => handleInputChange("cantserv", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Tipo red (FTTH, HFC...)"
                      value={saleForm.tipored}
                      onChange={(e) => handleInputChange("tipored", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Servicio e Instalacion</label>
                  <input
                    type="text"
                    placeholder="Producto"
                    value={saleForm.paquete_pvd}
                    onChange={(e) => handleInputChange("paquete_pvd", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none mb-3"
                  />
                  <input
                    type="text"
                    placeholder="Direccion de Instalacion"
                    value={saleForm.direccion_instalacion}
                    onChange={(e) => handleInputChange("direccion_instalacion", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <input
                      type="text"
                      placeholder="Division"
                      value={saleForm.division}
                      onChange={(e) => handleInputChange("division", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Area"
                      value={saleForm.area}
                      onChange={(e) => handleInputChange("area", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <input
                      type="text"
                      placeholder="Zona"
                      value={saleForm.zona}
                      onChange={(e) => handleInputChange("zona", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Poblacion"
                      value={saleForm.poblacion}
                      onChange={(e) => handleInputChange("poblacion", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <input
                      type="text"
                      placeholder="Distrito"
                      value={saleForm.d_distrito}
                      onChange={(e) => handleInputChange("d_distrito", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Estrato"
                      value={saleForm.estrato}
                      onChange={(e) => handleInputChange("estrato", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <input
                      type="text"
                      placeholder="Tipo producto"
                      value={saleForm.tipo_producto}
                      onChange={(e) => handleInputChange("tipo_producto", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Tipo contrato"
                      value={saleForm.tipo_contrato}
                      onChange={(e) => handleInputChange("tipo_contrato", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <input
                      type="text"
                      placeholder="Modalidad venta"
                      value={saleForm.modalidad_venta}
                      onChange={(e) => handleInputChange("modalidad_venta", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Tipo registro"
                      value={saleForm.tipo_registro}
                      onChange={(e) => handleInputChange("tipo_registro", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <input
                      type="text"
                      placeholder="Renta"
                      value={saleForm.renta}
                      onChange={(e) => handleInputChange("renta", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Venta"
                      value={saleForm.venta}
                      onChange={(e) => handleInputChange("venta", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Observaciones</label>
                  <textarea
                    rows="2"
                    placeholder="Detalles adicionales..."
                    value={saleForm.observ_retencion || ""}
                    onChange={(e) => handleInputChange("observ_retencion", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0">
                <button
                  onClick={() => setShowNewSaleModal(false)}
                  className="flex-1 py-3 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleNewSaleSubmit}
                  className="flex-1 py-3 text-sm font-bold text-white bg-[#C62828] hover:bg-red-800 rounded-lg shadow-md transition-all transform active:scale-95"
                >
                  Guardar Venta
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
