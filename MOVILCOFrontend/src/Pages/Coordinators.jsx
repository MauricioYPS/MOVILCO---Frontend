import { useEffect, useMemo, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  fetchCoordinatorsByDirection,
  selectDirectionCoordinators,
  selectDirectionError,
  selectDirectionLoading,
  selectDirectionMeta,
  setDirectionContext,
  setDirectionPeriod
} from "../../store/reducers/directionsReducers"
import { getStoredUser } from "../utils/auth"
// import SiappBackupsButton from "../Props/SiappBackupsButton"

const IconBase = ({ size = 20, className = "", children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
  >
    {children}
  </svg>
)

const LayoutDashboard = (props) => (
  <IconBase {...props}>
    <rect x="3" y="3" width="8" height="7" />
    <rect x="13" y="3" width="8" height="11" />
    <rect x="3" y="12" width="8" height="9" />
    <rect x="13" y="16" width="8" height="5" />
  </IconBase>
)
const Users = (props) => (
  <IconBase {...props}>
    <path d="M9 7a3 3 0 11-6 0 3 3 0 016 0Z" />
    <path d="M21 7a3 3 0 11-6 0 3 3 0 016 0Z" />
    <path d="M2 21v-2a4 4 0 014-4h2a4 4 0 014 4v2" />
    <path d="M14 21v-2a4 4 0 014-4h2a4 4 0 014 4v2" />
  </IconBase>
)
const Target = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" />
  </IconBase>
)
const Bell = (props) => (
  <IconBase {...props}>
    <path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10 21h4" />
  </IconBase>
)
const Search = (props) => (
  <IconBase {...props}>
    <circle cx="11" cy="11" r="6" />
    <path d="m20 20-3.5-3.5" />
  </IconBase>
)
const ChevronDown = (props) => (
  <IconBase {...props}>
    <path d="m6 9 6 6 6-6" />
  </IconBase>
)
const MapPin = (props) => (
  <IconBase {...props}>
    <path d="M12 21s-6-5.19-6-10a6 6 0 1112 0c0 4.81-6 10-6 10Z" />
    <circle cx="12" cy="11" r="2" />
  </IconBase>
)
const MoreHorizontal = (props) => (
  <IconBase {...props}>
    <circle cx="6" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="18" cy="12" r="1.5" />
  </IconBase>
)
const Smartphone = (props) => (
  <IconBase {...props}>
    <rect x="7" y="3" width="10" height="18" rx="2" />
    <path d="M12 17h.01" />
  </IconBase>
)
const Briefcase = (props) => (
  <IconBase {...props}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
    <path d="M3 13h18" />
  </IconBase>
)
const Menu = (props) => (
  <IconBase {...props}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </IconBase>
)
const X = (props) => (
  <IconBase {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </IconBase>
)
const Award = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="m8.5 12.5-1 7L12 17l4.5 2.5-1-7" />
  </IconBase>
)
const Globe = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
  </IconBase>
)
const CalendarClock = (props) => (
  <IconBase {...props}>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M4 11h16M9 3v4M15 3v4" />
    <path d="M16 15.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
    <path d="M14.5 14.25V16l1 1" />
  </IconBase>
)

const getStatusColor = (status) => {
  switch (status) {
    case "good":
      return "#10B981"
    case "average":
      return "#F59E0B"
    case "critical":
      return "#EF4444"
    default:
      return "#6B7280"
  }
}

const Sparkline = ({ data, color }) => {
  const max = Math.max(...data, 100)
  const min = 0
  const width = 200
  const height = 40

  const points = data
    .map((val, index) => {
      const x = (index / (data.length - 1 || 1)) * width
      const y = height - ((val - min) / (max - min || 1)) * height
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="mt-3 w-full">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((val, index) => {
          const x = (index / (data.length - 1 || 1)) * width
          const y = height - ((val - min) / (max - min || 1)) * height
          return <circle key={index} cx={x} cy={y} r="2.5" fill="white" stroke={color} strokeWidth="2" />
        })}
      </svg>
    </div>
  )
}

const novedadesMock = [
  { id: 1, type: "incapacidad", title: "Incapacidad reportada", description: "Incapacidad medica por 3 dias en Cucuta 2.", time: "Hace 2 horas" },
  { id: 2, type: "meta", title: "Meta cumplida", description: "El equipo de Ocaña alcanzó el 100% de la cuota de ventas.", time: "Hace 45 min" },
  { id: 3, type: "alerta", title: "Bajo rendimiento", description: "Pamplona con ventas por debajo del 50%.", time: "Hace 5 horas" }
]

export default function Coordinators() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [sortBy, setSortBy] = useState("ventas")
  const lastFetchRef = useRef({ id: null, period: null })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const coordinators = useSelector(selectDirectionCoordinators)
  const meta = useSelector(selectDirectionMeta)
  const loading = useSelector(selectDirectionLoading)
  const error = useSelector(selectDirectionError)

  useEffect(() => {
    const stored = getStoredUser()
    const storedId = stored?.org_unit_id || stored?.direccion_unit_id || stored?.id
    if (storedId && storedId !== meta?.directionId) {
      dispatch(setDirectionContext({ directionId: storedId }))
    }
  }, [dispatch, meta?.directionId])

  useEffect(() => {
    const stored = getStoredUser()
    const desiredId = stored?.org_unit_id || stored?.direccion_unit_id || stored?.id || meta?.directionId
    if (!desiredId) return

    if (desiredId !== meta?.directionId) {
      dispatch(setDirectionContext({ directionId: desiredId }))
      return
    }

    const comboChanged = desiredId !== lastFetchRef.current.id || meta?.period !== lastFetchRef.current.period
    if (!comboChanged || loading) return
    lastFetchRef.current = { id: desiredId, period: meta?.period }
    dispatch(fetchCoordinatorsByDirection({ directionId: desiredId, period: meta?.period }))
  }, [dispatch, meta?.directionId, meta?.period, loading])

  const periodOptions = useMemo(() => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1
    const options = []
    for (let m = currentMonth; m >= 1; m--) {
      const month = String(m).padStart(2, "0")
      const value = `${currentYear}-${month}`
      options.push({ value, label: value })
    }
    return options
  }, [])

  const filtered = useMemo(() => {
    const list = Array.isArray(coordinators) ? [...coordinators] : []
    const needle = query.trim().toLowerCase()

    const filteredList = needle ? list.filter((c) => `${c.name} ${c.unit_type}`.toLowerCase().includes(needle)) : list

    return filteredList.sort((a, b) => {
      switch (sortBy) {
        case "asesores":
          return (b.total_asesores ?? 0) - (a.total_asesores ?? 0)
        case "productividad":
          return (b.productivity ?? 0) - (a.productivity ?? 0)
        default:
          return (b.total_ventas ?? 0) - (a.total_ventas ?? 0)
      }
    })
  }, [coordinators, query, sortBy])

  const stats = useMemo(() => {
    const totalCoordinators = meta?.total ?? filtered.length
    const totalAdvisors = filtered.reduce((acc, curr) => acc + Number(curr.total_asesores ?? 0), 0)
    const totalSales = filtered.reduce((acc, curr) => acc + Number(curr.total_ventas ?? 0), 0)
    const bestUnit = filtered[0]?.name || "N/D"
    return { totalCoordinators, totalAdvisors, totalSales, bestUnit }
  }, [filtered, meta?.total])

  const handleViewTeam = (coord) => {
    const targetId = coord?.id || coord?.id
    if (!targetId) return
    navigate(`/CoordinatorDetails/${targetId}`, { state: { coordinator: coord, period: meta?.period } })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-slate-800 min-w-full">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    Directorio: {meta?.direction?.name ?? "Direccion"}
                  </h1>
                  <p className="mt-1 text-base text-gray-600">
                    Reporte de gestion - Periodo:{" "}
                    <span className="font-semibold text-gray-900">{meta?.period}</span>
                  </p>
                  {error && (
                    <p className="mt-2 text-base text-red-600">
                      No fue posible cargar coordinadores: {error}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-stretch gap-3 sm:gap-4">
                <div className="flex min-w-[220px] flex-1 items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm sm:flex-none sm:w-[260px]">
                  <div className="rounded-lg bg-green-50 p-2.5 text-green-600">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Coordinadores</p>
                    <p className="text-xl font-extrabold text-gray-900">{stats.totalCoordinators}</p>
                  </div>
                </div>

                <div className="flex min-w-[220px] flex-1 items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm sm:flex-none sm:w-[260px]">
                  <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Ventas</p>
                    <p className="text-xl font-extrabold text-gray-900">{stats.totalSales}</p>
                  </div>
                </div>

                <div className="flex min-w-[220px] flex-1 items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm sm:flex-none sm:w-[260px]">
                  <div className="rounded-lg bg-orange-50 p-2.5 text-orange-600">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fuerza Ventas</p>
                    <p className="text-xl font-extrabold text-gray-900">{stats.totalAdvisors}</p>
                  </div>
                </div>
{/* 
                <div className="flex w-full items-center justify-start rounded-xl sm:w-auto sm:flex-none sm:justify-center">
                  <SiappBackupsButton />
                </div> */}
              </div>
            </div>

            {/* Novedades (mobile/tablet) */}
            {/* <div className="xl:hidden">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-base font-extrabold text-gray-900">
                    <Bell size={18} className="text-red-600" />
                    Ultimas Novedades
                  </h3>
                  <span className="text-xs rounded-full bg-red-50 px-2.5 py-1 font-extrabold text-red-600">
                    {novedadesMock.length} Nuevas
                  </span>
                </div>

                <div className="space-y-3">
                  {novedadesMock.map((nov) => (
                    <div
                      key={nov.id}
                      className="relative rounded-xl border border-gray-100 bg-gray-50 p-4 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-lg bg-white p-2 text-red-500 shadow-sm">
                          <CalendarClock size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="mb-1 text-sm font-extrabold text-gray-900">{nov.title}</p>
                          <p className="mb-2 text-sm leading-snug text-gray-700">{nov.description}</p>
                          <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                            <CalendarClock size={12} />
                            {nov.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">
                  Ver historial de notificaciones
                </button>
              </div>
            </div> */}

            <div className="flex flex-col gap-6">
              <div className="flex-1">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Buscar coordinacion..."
                      className="w-full rounded-xl border border-gray-200 bg-white px-11 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <select
                    value={meta?.period}
                    onChange={(e) => {
                      const value = e.target.value
                      if (loading) return
                      dispatch(setDirectionPeriod(value))
                      lastFetchRef.current = { id: meta.directionId, period: value }
                      dispatch(fetchCoordinatorsByDirection({ directionId: meta.directionId, period: value }))
                    }}
                    disabled={loading}
                    className="block w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:w-48"
                  >
                    {periodOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() =>
                      setSortBy((prev) => (prev === "ventas" ? "productividad" : prev === "productividad" ? "asesores" : "ventas"))
                    }
                    className="flex min-w-[210px] items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 hover:bg-gray-50"
                  >
                    <span>
                      Ordenar por{" "}
                      <span className="font-semibold">
                        {sortBy === "ventas" ? "Ventas" : sortBy === "productividad" ? "Productividad" : "Asesores"}
                      </span>
                    </span>
                    <ChevronDown size={18} />
                  </button>
                </div>

                {loading && <p className="mb-4 text-base text-gray-700">Cargando coordinadores...</p>}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {filtered.map((coord) => (
                    <div
                      key={coord.id}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      {coord.isTopPerformer && (
                        <div className="absolute right-0 top-0 z-10 flex items-center gap-1 rounded-bl-xl bg-yellow-400 px-3 py-1.5 text-xs font-extrabold text-yellow-900 shadow-sm">
                          <Award size={14} /> TOP VENDEDOR
                        </div>
                      )}

                      <div className="flex-1 p-6">
                        <div className="mb-5 flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-extrabold ${
                                coord.isTopPerformer ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {(coord.name || "").substring(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-extrabold text-gray-900 text-lg leading-tight truncate">{coord.name}</h3>
                              <p className="mt-1 flex items-center text-sm text-gray-500">
                                <MapPin size={14} className="mr-1" />
                                {coord.unit_type}
                              </p>
                            </div>
                          </div>

                          {!coord.isTopPerformer && (
                            <button className="text-gray-300 transition hover:text-gray-500" aria-label="Opciones">
                              <MoreHorizontal size={22} />
                            </button>
                          )}
                        </div>

                        <div className="mb-5 grid grid-cols-2 gap-4">
                          <div>
                            <p className="mb-1 text-sm uppercase tracking-wider text-gray-400">Ventas Totales</p>
                            <span className="text-4xl font-extrabold" style={{ color: getStatusColor(coord.status) }}>
                              {coord.total_ventas}
                            </span>
                          </div>

                          <div>
                            <p className="mb-1 text-sm uppercase tracking-wider text-gray-400">Productividad</p>
                            <div className="flex items-end gap-1">
                              <span className="text-2xl font-extrabold text-gray-800">{coord.productivity}</span>
                              <span className="mb-1 text-sm text-gray-500">/ asesor</span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="mb-2 flex justify-between text-sm">
                            <span className="flex items-center gap-1 text-gray-700">
                              <MapPin size={12} />
                              Distrito: <strong>{coord.ventas_distrito}</strong>
                            </span>
                            <span className="flex items-center gap-1 text-gray-600">
                              <Globe size={12} />
                              Fuera: <strong>{coord.ventas_fuera}</strong>
                            </span>
                          </div>

                          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${coord.localPercentage}%` }}
                              title={`Distrito: ${coord.localPercentage}%`}
                            />
                            <div
                              className="h-full bg-orange-400"
                              style={{ width: `${coord.outsidePercentage}%` }}
                              title={`Fuera: ${coord.outsidePercentage}%`}
                            />
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-extrabold uppercase text-gray-400">Tendencia (est.)</p>
                          <Sparkline data={coord.trendData ?? []} color={getStatusColor(coord.status)} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users size={16} className="mr-2 text-gray-400" />
                          <strong className="text-gray-900">{coord.total_asesores}</strong>&nbsp;asesores activos
                        </div>
                        <button
                          className="text-sm font-extrabold text-red-600 transition-colors hover:text-red-800"
                          onClick={() => handleViewTeam(coord)}
                        >
                          Ver equipo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Novedades (desktop xl) */}
            {/* <div className="hidden xl:block mt-6">
              <div className="w-full max-w-4xl mx-auto rounded-2xl border border-dashed border-gray-200 bg-white/80 p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Bell size={20} className="text-red-600" />
                    <div>
                      <p className="text-base font-extrabold text-gray-900">Últimas novedades</p>
                      <p className="text-sm text-gray-500">Sección en pausa por ahora</p>
                    </div>
                  </div>
                  <span className="text-sm rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700">
                    {novedadesMock.length} ítems en espera
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {novedadesMock.map((nov) => (
                    <div key={nov.id} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                      <p className="font-extrabold text-gray-900 flex items-center gap-2">
                        <CalendarClock size={14} className="text-red-500" />
                        {nov.title}
                      </p>
                      <p className="mt-1 line-clamp-2">{nov.description}</p>
                      <p className="mt-1 text-xs text-gray-500 font-semibold">{nov.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  )
}
