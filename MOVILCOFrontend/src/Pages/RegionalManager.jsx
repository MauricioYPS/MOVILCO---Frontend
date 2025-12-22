import { Fragment, useEffect, useMemo, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { api } from "../../store/api"
import SiappBackupsButton from "../Props/SiappBackupsButton"
import { Database, Mail } from "lucide-react"

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
const Users = (props) => (
    <IconBase {...props}>
        <path d="M9 7a3 3 0 11-6 0 3 3 0 016 0Z" />
        <path d="M21 7a3 3 0 11-6 0 3 3 0 016 0Z" />
        <path d="M2 21v-2a4 4 0 014-4h2a4 4 0 014 4v2" />
        <path d="M14 21v-2a4 4 0 014-4h2a4 4 0 014 4v2" />
    </IconBase>
)

const Icon = ({ path, size = 20, className = "" }) => (
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
        <path d={path} />
    </svg>
)

const CircularProgress = ({ value, size = 50, strokeWidth = 4, colorClass = "text-red-600", trackClass = "text-gray-200" }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (Math.min(value, 100) / 100) * circumference

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="h-full w-full -rotate-90 transform">
                <circle className={trackClass} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
                <circle
                    className={`${colorClass} transition-all duration-700 ease-out`}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <div className="absolute text-[10px] font-bold text-slate-700">{Math.round(value)}%</div>
        </div>
    )
}


const ProgressBar = ({ value, colorClass = "bg-blue-600" }) => (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
)

const Sidebar = ({ open, onClose }) => (
    <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
            }`}
    >
        <div className="flex h-16 items-center justify-between bg-slate-950 px-6 lg:hidden">
            <span className="text-xl font-bold">Menú</span>
            <button onClick={onClose} aria-label="Cerrar menú">
                <Icon path="M18 6 6 18M6 6l12 12" size={22} />
            </button>
        </div>

        <div className="p-6">
            <div className="mb-10 flex items-center space-x-2 text-2xl font-bold tracking-tight text-white">
                <Icon path="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" size={26} className="text-red-600" />
                <span>MOVILCO</span>
            </div>

            <p className="ml-2 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Gerencia Regional</p>
            <nav className="space-y-1">
                <div className="flex items-center space-x-3 rounded-lg border-l-4 border-red-500 bg-red-700 px-4 py-3 text-white shadow-md transition-all">
                    <Icon path="M3 3h8v7H3zM13 3h8v11h-8zM3 12h8v9H3zM13 16h8v5h-8z" size={18} />
                    <span className="text-sm font-medium">Dashboard</span>
                </div>
                <div className="flex items-center space-x-3 rounded-lg px-4 py-3 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
                    <Icon path="M12 2v20M2 12h20" size={18} />
                    <span className="text-sm font-medium">Metas y KPIs</span>
                </div>
                <div className="flex items-center space-x-3 rounded-lg px-4 py-3 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
                    <Icon path="M3 7h18M7 7V3h10v4m-8 4h6m-6 4h4m-4 4h2" size={18} />
                    <span className="text-sm font-medium">Directores</span>
                </div>
                <div className="flex items-center space-x-3 rounded-lg px-4 py-3 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
                    <Icon path="M9 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M21 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M2 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2 M14 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2" size={18} />
                    <span className="text-sm font-medium">Fuerza Ventas</span>
                </div>
            </nav>
        </div>

        <div className="absolute bottom-0 w-full border-t border-slate-800 bg-slate-950 p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 bg-gradient-to-tr from-slate-700 to-slate-600 text-sm font-bold">GR</div>
                <div>
                    <p className="text-xs font-bold text-white">Gerente Regional</p>
                    <p className="text-[10px] text-slate-400">Vista Global</p>
                </div>
            </div>
        </div>
    </aside>
)

const Header = ({ onMenu, currentDay, totalDays, progressPct }) => (
    <header className="z-10 flex h-16 items-center justify-between   bg-slate-50 px-6 lg:px-10">
        <div className="flex items-center">
            <button onClick={onMenu} className="mr-4 text-gray-500 lg:hidden" aria-label="Abrir menú">
                <Icon path="M4 6h16M4 12h16M4 18h16" size={22} />
            </button>
            <div>
                <h1 className="hidden text-lg font-bold text-slate-800 sm:block">Tablero de Control</h1>
                <p className="hidden items-center gap-1 text-xs text-gray-400 sm:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Datos listos para conectar
                </p>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="mr-4 hidden flex-col items-end md:flex">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Icon path="M8 2h8M8 6h8M12 10v10M7 10h10M7 14h10M7 18h10" size={16} className="text-red-600" />
                    <span>Día {currentDay} de {totalDays}</span>
                </div>
                <div className="mt-1 h-1.5 w-32 rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-slate-800" style={{ width: `${progressPct}%` }} />
                </div>
                <span className="mt-0.5 text-[10px] text-gray-500">Avance Mes: {progressPct.toFixed(0)}%</span>
            </div>
            <div className="hidden h-8 w-px bg-gray-200 md:block" />
            <div className="flex gap-3">
                <button className="relative rounded-full border border-gray-100 bg-white p-2 text-gray-400 shadow-sm transition hover:text-red-600 hover:shadow-md" aria-label="Notificaciones">
                    <Icon path="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" size={20} />
                    <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
                </button>
                <button className="rounded-full border border-gray-100 bg-white p-2 text-gray-400 shadow-sm transition hover:text-blue-600 hover:shadow-md" aria-label="Correo">
                    <Icon path="M3 5h18M3 5v14h18V5" size={20} />
                </button>
            </div>
        </div>
    </header>
)

const KpiCard = ({ title, value, meta, progress }) => (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-blue-200">
        <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{title}</p>
            <h3 className="mt-1 text-3xl font-bold text-slate-900">{value}</h3>
            {meta !== undefined && <p className="mt-2 text-xs font-medium text-gray-600">Meta: {meta}</p>}
        </div>
        <CircularProgress value={progress} size={65} colorClass="text-blue-600" />
    </div>
)

const NewsPanel = ({ items }) => (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 p-5">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-slate-800">
                    <Icon path="M2 6h20M5 6v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" size={16} className="text-amber-500" />
                    Centro de Novedades
                </h3>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">{items.length}</span>
            </div>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {items.map((nov) => (
                <div key={nov.id} className="relative cursor-pointer overflow-hidden rounded-lg border border-gray-100 bg-white p-3 shadow-sm transition hover:shadow-md">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${nov.severity === "high" ? "bg-red-500" : nov.severity === "success" ? "bg-emerald-500" : "bg-amber-500"}`} />
                    <div className="pl-2">
                        <div className="mb-1 flex items-start justify-between">
                            <span className="text-[10px] font-bold uppercase text-gray-500">{nov.zona}</span>
                            <span className="text-[10px] text-gray-400">{nov.time}</span>
                        </div>
                        <h5 className="mb-1 text-xs font-bold text-slate-800">
                            {nov.tipo}: {nov.ciudad}
                        </h5>
                        <p className="text-xs leading-snug text-gray-600">{nov.mensaje}</p>
                    </div>
                </div>
            ))}
        </div>
        <button className="p-3 text-center text-xs font-bold text-slate-500 transition-colors hover:bg-gray-50 hover:text-red-600">Ver Historial Completo</button>
    </div>
)

const DistrictTable = ({ data, currentDate, getGapColor, getProgressBarColor, handleViewCoordinator }) => {
    const [expanded, setExpanded] = useState(null)
    console.log(data);
    
    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-slate-800">
                    <Icon path="M12 2v20M2 12h20" size={16} className="text-red-600" />
                    Gestión por Dirección Regional
                </h3>
                <div className="flex gap-2">
                    <button className="rounded border border-transparent p-1.5 text-gray-500 hover:border-gray-200 hover:bg-white">
                        <Icon path="M10 4h11M3 12h18M6 20h15M6 4 4 6m0 0 2 2M4 6H2" size={16} />
                    </button>
                    <button className="rounded border border-transparent p-1.5 text-gray-500 hover:border-gray-200 hover:bg-white">
                        <Icon path="M3 5h18M3 10h18M3 15h10" size={16} />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-gray-100 bg-white text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            <th className="w-8 px-4 py-3" />
                            <th className="px-4 py-3">Dirección</th>
                            <th className="px-4 py-3 text-center">Meta Mes</th>
                            <th className="px-4 py-3 text-center text-blue-700">Meta Día {currentDate}</th>
                            <th className="px-4 py-3 text-center text-blue-700 font-extrabold">Real</th>
                            <th className="px-4 py-3 text-center text-blue-700">GAP</th>
                            <th className="px-4 py-3 text-center">% Prorrateo</th>
                            <th className="px-4 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {data.map((d) => (
                            <Fragment key={d.id}>
                                <tr
                                    className={`cursor-pointer border-l-4 transition-colors ${expanded === d.id ? "border-red-600 bg-slate-50" : "border-transparent bg-white"} hover:bg-slate-50`}
                                    onClick={() => setExpanded(expanded === d.id ? null : d.id)}
                                >
                                    <td className="px-4 py-4 text-center">
                                        {expanded === d.id ? (
                                            <Icon path="m6 9 6 6 6-6" size={16} className="text-slate-800" />
                                        ) : (
                                            <Icon path="m6 9 6 6 6-6" size={16} className="rotate-180 text-gray-400" />
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm font-bold text-slate-800">{d.name}</div>
                                        <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                            <Icon path="M12 20.5 20 9a8 8 0 1 0-16 0l8 11.5Z" size={10} />
                                            {d.director}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center text-gray-400">{d.monthGoal}</td>
                                    <td className="px-4 py-4 bg-blue-50/20 text-center font-medium text-gray-600">{d.proratedGoal}</td>
                                    <td className="px-4 py-4 bg-blue-50/20 text-center font-bold text-slate-900">{d.sales}</td>
                                    <td className={`px-4 py-4 text-center font-bold ${getGapColor(d.gap)}`}>
                                        {d.gap > 0 ? "+" : ""}
                                        {d.gap}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center">
                                            <CircularProgress
                                                value={d.proratedCompliance}
                                                size={38}
                                                strokeWidth={4}
                                                colorClass={d.proratedCompliance >= 90 ? "text-emerald-500" : d.proratedCompliance >= 60 ? "text-amber-500" : "text-red-500"}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <button
                                            className="p-1 text-gray-400 hover:text-red-600"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleViewCoordinator(d.id)
                                            }}
                                        >
                                            <Icon path="M12 5v14M5 12h14" size={16} />
                                        </button>
                                    </td>
                                </tr>

                                {expanded === d.id && (
                                    <tr className="bg-slate-50">
                                        <td colSpan="8" className="p-0">
                                            <div className="border-b border-gray-200 p-5">
                                                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <div
                                                        className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 rounded-lg p-2 -m-2 transition"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleViewCoordinator(d.id)
                                                        }}
                                                    >
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-500">
                                                            {d.director?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold uppercase text-gray-400">Director Responsable</p>
                                                            <p className="font-bold text-slate-800">{d.director}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-3">
                                                        <button className="flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:bg-gray-50">
                                                            <Icon path="M3 5h18M3 5v14h18V5" size={14} />
                                                            Correo
                                                        </button>
                                                        <button className="flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:bg-gray-50">
                                                            <Icon path="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5" size={14} />
                                                            Chat
                                                        </button>
                                                        <button
                                                            className="flex items-center gap-2 rounded border border-red-600 bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleViewCoordinator(d.id)
                                                            }}
                                                        >
                                                            Ver Director
                                                            <Icon path="m9 18 6-6-6-6" size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <h4 className="mb-3 pl-1 text-xs font-bold uppercase text-gray-500">Desglose por Coordinación</h4>
                                                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                                                    <table className="w-full text-xs">
                                                        <thead className="border-b border-gray-200 bg-gray-50 text-gray-500">
                                                            <tr>
                                                                <th className="px-4 py-2 text-left">Coordinación</th>
                                                                <th className="px-4 py-2 text-center">Meta Día</th>
                                                                <th className="px-4 py-2 text-center">Meta Semana</th>
                                                                <th className="px-4 py-2 text-center">Meta Mes</th>
                                                                <th className="px-4 py-2 text-center">Ventas</th>
                                                                <th className="px-4 py-2 text-center">GAP</th>
                                                                <th className="w-32 px-4 py-2 text-center">Progreso</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {d.coordinators.map((coord) => (
                                                                <tr key={coord.id} className="hover:bg-gray-50">
                                                                    <td className="px-4 py-3 font-medium text-slate-700">{coord.coord_unit_name}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-500">{coord.metaDia}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-500">{coord.metaSemana}</td>
                                                                    <td className="px-4 py-3 text-center text-gray-500">{coord.metaMes}</td>
                                                                    <td className="px-4 py-3 text-center font-bold text-slate-800">{coord.sales}</td>
                                                                    <td className={`px-4 py-3 text-center font-bold ${getGapColor(coord.gap)}`}>
                                                                        {coord.gap > 0 ? "+" : ""}
                                                                        {coord.gap}
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        <div className="flex items-center gap-2">
                                                                            <ProgressBar value={coord.proratedCompliance} colorClass={getProgressBarColor(coord.proratedCompliance)} />
                                                                            <span className="w-8 text-right text-[10px] font-bold">{coord.proratedCompliance.toFixed(0)}%</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right">
                                                                        <button
                                                                            className="rounded bg-red-600 px-2 py-1 text-[10px] font-bold text-white transition hover:bg-red-700"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                handleViewCoordinator(coord.id)
                                                                            }}
                                                                        >
                                                                            Ver Coord.
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const currentPeriod = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    return `${year}-${month}`
}

const normalizeNovedades = (data) => {
    if (!data || typeof data !== "object") return []
    const entries = []
    Object.entries(data).forEach(([district, list]) => {
        if (Array.isArray(list)) {
            list.forEach((item, idx) =>
                entries.push({
                    id: `${district}-${idx}`,
                    zona: district,
                    ciudad: item.coordinacion || "N/A",
                    tipo: item.tipo || "N/A",
                    mensaje: item.descripcion || "",
                    time: `${item.fecha_inicio || ""}`.split("T")[0],
                    severity: item.tipo === "PERMISO" ? "success" : "warning"
                })
            )
        }
    })
    return entries
}

export default function RegionalManager() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [directions, setDirections] = useState([])
    const [novedades, setNovedades] = useState([])
    const [loading, setLoading] = useState(false)
    const [periodDirections] = useState("2025-12")
    const [periodNovedades] = useState(currentPeriod())
    const navigate = useNavigate()
    const handleViewCoordinator = (coordId) => {
        if (!coordId) return
        navigate(`/CoordinatorDetails/${coordId}`, {
            state: {
                period: periodDirections,
                directionId: coordId
            }
        })
    }
    const goDB = () => {
        navigate("/dataWorkFlow")
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [dirRes, novRes] = await Promise.all([
                    axios.get(`${api}/api/regional/directions`, { params: { period: periodDirections } }),
                    axios.get(`${api}/api/regional/novedades`, { params: { period: periodNovedades } })
                ])
                setDirections(Array.isArray(dirRes.data?.direcciones) ? dirRes.data.direcciones : [])
                setNovedades(normalizeNovedades(novRes.data?.resultado))
            } catch (error) {
                console.error("Error cargando datos regionales", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [periodDirections, periodNovedades])

    const currentDay = directions[0]?.metas?.dia_actual ?? 0
    const totalDays = directions[0]?.metas?.dias_mes ?? 30
    const progressTimePct = totalDays > 0 ? (currentDay / totalDays) * 100 : 0

    const processedData = useMemo(() => {
        return directions.map((dir) => {
            const metas = dir.metas || {}
            const proratedGoal = metas.meta_dia ?? 0
            const compliance = metas.meta_mes > 0 ? (metas.total_ventas / metas.meta_mes) * 100 : 0
            const proratedCompliance = proratedGoal > 0 ? (metas.total_ventas / proratedGoal) * 100 : 0
            const gap = metas.total_ventas - (metas.meta_dia ?? 0)

            const coordsProcessed = (dir.coordinaciones || []).map((c) => {
                const coordId = c.id || c.coordinacion_id || c.name
                const metaDia = c.meta_dia ?? c.prorrateo ?? 0
                const metaSemana = c.meta_semana ?? 0
                const metaMes = c.meta_mes ?? c.prorrateo ?? 0
                const prorratedCompliance = metaDia > 0 ? (c.ventas / metaDia) * 100 : 0
                const gap = c.ventas - metaDia

                return {
                    ...c,
                    id: coordId,
                    metaDia,
                    metaSemana,
                    metaMes,
                    proratedGoal: metaDia,
                    proratedCompliance,
                    gap
                }
            })

            return {
                id: dir.id,
                name: dir.direccion?.name || "Sin nombre",
                director: dir.direccion?.name || "Director",
                sales: metas.total_ventas ?? 0,
                monthGoal: metas.meta_mes ?? 0,
                proratedGoal,
                compliance,
                proratedCompliance,
                gap,
                coordinators: coordsProcessed,
                metaDia: metas.meta_dia ?? 0
            }
        })
    }, [directions])

    const globalStats = useMemo(() => {
        const totalGoal = processedData.reduce((acc, d) => acc + (d.monthGoal ?? 0), 0)
        const totalSales = processedData.reduce((acc, d) => acc + (d.sales ?? 0), 0)
        const totalProrated = processedData.reduce((acc, d) => acc + (d.proratedGoal ?? 0), 0)
        const gap = totalSales - totalProrated
        return {
            sales: totalSales,
            goal: totalGoal,
            proratedGoal: totalProrated,
            compliance: totalGoal > 0 ? (totalSales / totalGoal) * 100 : 0,
            proratedCompliance: totalProrated > 0 ? (totalSales / totalProrated) * 100 : 0,
            gap
        }
    }, [processedData])

    const getGapColor = (gap) => (gap >= 0 ? "text-emerald-600" : "text-rose-600")
    const getProgressBarColor = (val) => {
        if (val >= 100) return "bg-emerald-500"
        if (val >= 90) return "bg-amber-500"
        return "bg-rose-500"
    }



    return (
        <div className="flex min-h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">


            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Header onMenu={() => setSidebarOpen(true)} currentDay={currentDay} totalDays={totalDays} progressPct={progressTimePct} />

                <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8">
                    <div className="flex flex-wrap items-end justify-end gap-3 mb-6">
                        <button
                            onClick={() => window.location.href = '/SendMails'}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 hover:shadow-md transition"
                        >
                            <div className="bg-orange-50 text-orange-600 p-2 rounded-lg">
                                <Mail size={18} />
                            </div>
                            <div className="text-left">
                                <div className="text-xs font-bold text-gray-400 uppercase">
                                    Comunicaciones
                                </div>
                                <div className="text-sm font-bold text-slate-800">
                                    Enviar Correos
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={goDB}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 hover:shadow-md transition"
                        >
                            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                                <Database size={18} />
                            </div>
                            <div className="text-left">
                                <div className="text-xs font-bold text-gray-400 uppercase">
                                    Datos
                                </div>
                                <div className="text-sm font-bold text-slate-800">
                                    Actualizar DB
                                </div>
                            </div>
                        </button>

                        <div className="mr-15">
                            <SiappBackupsButton />
                        </div>
                    </div>

                    <div className="mx-auto max-w-[1400px] space-y-6">

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <KpiCard
                                title="Venta Total Acumulada"
                                value={Number(globalStats.sales || 0).toLocaleString()}
                                meta={Number(globalStats.goal || 0).toLocaleString()}
                                progress={globalStats.compliance}
                            />
                            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600" />
                                <div className="flex items-center justify-between pl-2">
                                    <div>

                                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                            Control Prorrateo <span className="font-extrabold text-red-600">(Día {currentDay})</span>
                                        </p>
                                        <h3 className={`mt-1 text-3xl font-bold ${getGapColor(globalStats.gap)}`}>
                                            {globalStats.gap > 0 ? "+" : ""}
                                            {globalStats.gap}
                                        </h3>
                                        <p className="mt-1 text-xs font-medium text-slate-500">Unidades de Diferencia</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="mb-1 text-[10px] text-gray-400">Meta Ideal Hoy</p>
                                        <p className="text-lg font-bold text-slate-700">{globalStats.proratedGoal.toLocaleString()}</p>
                                        <div className={`mt-1 rounded px-2 py-1 text-xs font-bold ${globalStats.proratedCompliance >= 100 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                                            {globalStats.proratedCompliance.toFixed(1)}% Cump.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Direcciones</p>
                                    <h3 className="mt-1 text-3xl font-bold text-slate-900">{processedData.length}</h3>
                                    <p className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-600">
                                        <Icon path="M9 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M21 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" size={12} />
                                        Datos {loading ? "cargando" : "listos"}
                                    </p>
                                </div>
                                <div className="rounded-full bg-slate-50 p-3 text-slate-600">
                                    <Icon path="M9 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M21 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M2 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2 M14 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2" size={24} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white shadow-md">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Proyección Cierre</p>
                                    <h3 className="mt-1 text-3xl font-bold">94.5%</h3>
                                    <p className="mt-1 text-xs text-slate-300">Tendencia al alza</p>
                                </div>
                                <Icon path="M3 17h2l1-2 3 3 5-7 4 5 3-9" size={32} className="text-emerald-400 opacity-80" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <div className="xl:col-span-2">
                                <DistrictTable
                                    data={processedData}
                                    currentDate={currentDay}
                                    getGapColor={getGapColor}
                                    getProgressBarColor={getProgressBarColor}
                                    handleViewCoordinator={handleViewCoordinator}
                                />
                            </div>
                            <div className="h-full">
                                <NewsPanel items={novedades} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
