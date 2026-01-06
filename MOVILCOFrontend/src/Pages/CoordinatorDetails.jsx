import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import {
    fetchCoordAdvisorsByCoordinator,
    selectCoordAdvisors,
    selectCoordAdvisorsError,
    selectCoordAdvisorsLoading,
    selectCoordAdvisorMeta
} from "../../store/reducers/coordAdvisorsReducers"
import {
    fetchPayrollDetailsByUsers,
    selectPayrollDetails,
    selectPayrollError,
    selectPayrollLoading
} from "../../store/reducers/payrollReducers"
import { selectDirectionCoordinators } from "../../store/reducers/directionsReducers"
import { api } from "../../store/api"
import { getStoredToken } from "../utils/auth"

const currentPeriod = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    return `${year}-${month}`
}
const META_CONEXIONES = 13
const DIAS_META = 30

const clampPercent = (value) => Math.min(100, Math.max(0, Number(value) || 0))
const initials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase()).join("") || "CO"
const monthRange = (period) => {
    const [y, m] = String(period || "").split("-")
    if (!y || !m) return { date_from: "", date_to: "" }
    const year = Number(y)
    const month = Number(m)
    const date_from = `${y}-${String(m).padStart(2, "0")}-01`
    const lastDay = new Date(year, month, 0).getDate()
    const date_to = `${y}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`
    return { date_from, date_to }
}

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

export default function CoordinatorDetails() {
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const advisors = useSelector(selectCoordAdvisors)
    const advisorsLoading = useSelector(selectCoordAdvisorsLoading)
    const advisorsError = useSelector(selectCoordAdvisorsError)
    const coordMetaSlice = useSelector(selectCoordAdvisorMeta)
    const payroll = useSelector(selectPayrollDetails)
    const payrollLoading = useSelector(selectPayrollLoading)
    const payrollError = useSelector(selectPayrollError)
    const directionCoordinators = useSelector(selectDirectionCoordinators)
    const [metaMap, setMetaMap] = useState(new Map())
    const [metaLoading, setMetaLoading] = useState(false)
    const [metaError, setMetaError] = useState("")
    const [noveltyMap, setNoveltyMap] = useState(new Map())
    const [noveltyLoading, setNoveltyLoading] = useState(false)
    const [noveltyError, setNoveltyError] = useState("")
    const [salesMap, setSalesMap] = useState(new Map())
    const [salesLoading, setSalesLoading] = useState(false)
    const [salesError, setSalesError] = useState("")

    const coordinatorMeta =
        coordMetaSlice?.coordinator ||
        location.state?.coordinator ||
        (Array.isArray(directionCoordinators)
            ? directionCoordinators.find(
                  (c) => String(c.user_id || c.id) === String(id)
              )
            : null) ||
        {}

    const coordinatorIdForFetch = coordinatorMeta?.user_id || location.state?.coordinator?.user_id || id

    const selectedPeriod = location.state?.period || coordMetaSlice?.period || currentPeriod()
        

    useEffect(() => {
        if (coordinatorIdForFetch) {
            dispatch(fetchCoordAdvisorsByCoordinator({ coordinatorId: coordinatorIdForFetch, period: selectedPeriod }))
        }
    }, [dispatch, coordinatorIdForFetch, selectedPeriod])

    useEffect(() => {
        const entries = Array.isArray(advisors)
            ? advisors
                .map((a, idx) => ({
                    id: a.id ?? a.advisor_id ?? idx,
                    document: a.document_id || a.cedula,
                    period: selectedPeriod
                }))
                .filter((i) => i.id && i.document)
            : []

        if (entries.length > 0) {
            dispatch(fetchPayrollDetailsByUsers(entries))
        }
    }, [dispatch, advisors, selectedPeriod])

    useEffect(() => {
        const loadMetas = async () => {
            if (!Array.isArray(advisors) || advisors.length === 0) return
            setMetaLoading(true)
            setMetaError("")
            const token = getStoredToken()
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            try {
                const results = await Promise.all(
                    advisors.map(async (a) => {
                        const res = await fetch(`${api}/api/users/${a.id}`, { headers })
                        const json = await res.json()
                        if (!res.ok) throw new Error(json?.message || "No se pudo cargar meta")
                        return { id: a.id, meta: Number(json?.presupuesto ?? json?.prorrateo ?? META_CONEXIONES) || META_CONEXIONES }
                    })
                )
                const map = new Map()
                results.forEach((r) => map.set(r.id, r.meta))
                setMetaMap(map)
            } catch (err) {
                setMetaError(err?.message || "No se pudieron cargar las metas")
            } finally {
                setMetaLoading(false)
            }
        }
        loadMetas()
    }, [advisors])

    useEffect(() => {
        const loadNovelties = async () => {
            if (!selectedPeriod) return
            setNoveltyLoading(true)
            setNoveltyError("")
            const { date_from, date_to } = monthRange(selectedPeriod)
            const token = getStoredToken()
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            const idsMap = new Map()
            let offset = 0
            const limit = 200
            let keepGoing = true
            try {
                while (keepGoing) {
                    const qs = new URLSearchParams({ date_from, date_to, limit: String(limit), offset: String(offset) })
                    const res = await fetch(`${api}/api/novedades?${qs.toString()}`, { headers })
                    const json = await res.json()
                    if (!res.ok) throw new Error(json?.message || "No se pudieron cargar las novedades")
                    const items = Array.isArray(json?.items) ? json.items : []
                    items.forEach((n) => {
                        const uid = Number(n.user_id ?? n.advisor_id ?? n.id)
                        if (!Number.isNaN(uid)) {
                            idsMap.set(uid, (idsMap.get(uid) || 0) + 1)
                        }
                    })
                    const total = Number(json?.total ?? items.length)
                    offset += items.length
                    keepGoing = items.length === limit && offset < total
                }
                setNoveltyMap(idsMap)
            } catch (err) {
                setNoveltyError(err?.message || "No se pudieron cargar las novedades")
                setNoveltyMap(new Map())
            } finally {
                setNoveltyLoading(false)
            }
        }
        loadNovelties()
    }, [selectedPeriod])

    useEffect(() => {
        const loadSales = async () => {
            if (!coordinatorIdForFetch || !selectedPeriod) {
                setSalesMap(new Map())
                return
            }
            setSalesLoading(true)
            setSalesError("")
            const token = getStoredToken()
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            try {
                const res = await fetch(
                    `${api}/api/users/by-coordinator/${coordinatorIdForFetch}?period=${selectedPeriod}`,
                    { headers }
                )
                const json = await res.json()
                if (!res.ok) throw new Error(json?.message || "No se pudieron cargar las ventas")
                const asesores = Array.isArray(json?.asesores) ? json.asesores : []
                const map = new Map()
                asesores.forEach((a) => {
                    const key = a.id ?? a.advisor_id ?? a.user_id
                    if (key !== undefined) {
                        map.set(key, Number(a.ventas ?? 0) || 0)
                    }
                })
                setSalesMap(map)
            } catch (err) {
                setSalesError(err?.message || "No se pudieron cargar las ventas")
                setSalesMap(new Map())
            } finally {
                setSalesLoading(false)
            }
        }
        loadSales()
    }, [coordinatorIdForFetch, selectedPeriod])

    const dataset = useMemo(() => {
        if (!Array.isArray(advisors)) return []

        return advisors.map((item, idx) => {
            const key = item.id ?? item.advisor_id ?? idx
            const detalle = payroll?.[key] ?? {}
            const ventas = Number(detalle.ventas_totales ?? salesMap.get(key) ?? item.ventas ?? 0)
            const prorrateo = (metaMap.get(key) ?? Number(detalle.presupuesto_prorrateado ?? item.prorrateo ?? META_CONEXIONES)) || META_CONEXIONES
            const meta = prorrateo
            const cumplimientoRaw = meta ? (ventas / meta) * 100 : detalle.cumple_global ? 100 : 0
            const cumplimiento = clampPercent(Math.round(cumplimientoRaw * 100) / 100 ||  cumplimientoRaw)
            const novCount = noveltyMap.get(key) || 0
            const novedades = novCount > 0 ? novCount : null
            const contratoFin = detalle.fecha_fin_contrato || null

            let status = "en_progreso"
            if (contratoFin) status = "fin_contrato"
            else if (novedades) status = "novedades"
            else if (cumplimiento < 80) status = "riesgo"
            else status = "activo"

            return {
                id: key,
                nombre: detalle.asesor_nombre ?? item.name ?? "Asesor",
                cedula: detalle.documento ?? item.document_id ?? "N/A",
                telefono: item.phone ?? "",
                ventas,
                meta,
                cumplimiento,
                status,
                novedades: novCount || 0
            }
        })
    }, [advisors, payroll, metaMap, noveltyMap])

    const stats = useMemo(() => {
        const total = dataset.length
        const totalVentas = dataset.reduce((acc, a) => acc + Number(a.ventas ?? 0), 0)
        const totalMeta = dataset.reduce((acc, a) => acc + Number(a.meta ?? META_CONEXIONES), 0)
        const cumplimiento = totalMeta > 0 ? clampPercent((totalVentas / totalMeta) * 100) : 0
        const totalNovedades = dataset.reduce((acc, a) => acc + Number(a.novedades ?? 0), 0)
        return { total, totalVentas, totalMeta, cumplimiento, totalNovedades }
    }, [dataset])

    const handleBack = () => {
        window.history.back()
    }

    const handleViewAdvisor = (advisor) => {
        if (!advisor?.id) return
        navigate(`/AdvisorDetails/${advisor.id}`, { state: { advisor, period: selectedPeriod } })
    }

    const statusBadge = (status) => {
        if (status === "activo") return "bg-green-100 text-green-800"
        if (status === "riesgo") return "bg-yellow-100 text-yellow-800"
        if (status === "novedades") return "bg-blue-100 text-blue-800"
        if (status === "fin_contrato") return "bg-orange-100 text-orange-800"
        return "bg-gray-100 text-gray-800"
    }

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <main className="flex-1 pb-16 px-4 sm:px-6 lg:px-10">
                <div className="mb-4 mt-4 flex items-center text-sm text-slate-600">
                    <button onClick={handleBack} className="flex items-center font-semibold text-slate-700 hover:text-red-600">
                        <Icon path="M10 19 3 12l7-7m-7 7h18" className="mr-2 h-4 w-4" />
                        Volver
                    </button>
                </div>

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                            <div className="flex h-18 w-18 items-center justify-center rounded-full border-2 border-white bg-red-50 text-2xl font-bold text-[#C62828] shadow-sm sm:h-20 sm:w-20 sm:text-3xl">
                                {initials(coordinatorMeta.name || "CO")}
                            </div>
                            <div className="w-full">
                                <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{coordinatorMeta.name ?? "Coordinador"}</h1>
                                <div className="mt-2 grid w-full gap-2 text-sm sm:text-base text-slate-600 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center">
                                    <span className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                                        <Icon path="M12 2v20M2 12h20" className="h-4 w-4 text-red-600" />
                                        <span className="font-semibold">{coordinatorMeta.unit_type || "COORDINACION"}</span>
                                    </span>
                                    <span className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                                        <Icon path="M12 20.5 20 9a8 8 0 1 0-16 0l8 11.5Z" className="h-4 w-4 text-slate-600" />
                                        <span className="truncate">{coordinatorMeta.district || coordinatorMeta.district_claro || coordinatorMeta.name}</span>
                                    </span>
                                    <span className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                                        <Icon path="M4 4h16v16H4z" className="h-4 w-4 text-slate-600" />
                                        <span>{coordinatorMeta.document_id || "N/A"}</span>
                                    </span>
                                    <span className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                                        <Icon path="M22 2 11 13" className="h-4 w-4 text-slate-600" />
                                        <span className="truncate">{coordinatorMeta.phone || "N/A"}</span>
                                    </span>
                                    <span className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                                        <Icon path="M4 4h16v16H4z" className="h-4 w-4 text-slate-600" />
                                        <span className="truncate">{coordinatorMeta.email || "N/A"}</span>
                                    </span>
                                    <span className={`flex items-center gap-2 rounded-lg px-3 py-2 ${coordinatorMeta.active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                                        <Icon path="M5 13l4 4L19 7" className="h-4 w-4" />
                                        <span className="font-semibold">{coordinatorMeta.active ? "Activo" : "Inactivo"}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4 md:w-auto">
                            <div className="flex-1 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center md:flex-none">
                                <p className="text-xs font-bold uppercase tracking-wider text-red-600">Cumplimiento</p>
                                <p className="text-2xl font-extrabold text-red-700 sm:text-3xl">{Math.trunc(stats.cumplimiento)}%</p>
                            </div>
                            <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center md:flex-none">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Asesores</p>
                                <p className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="mb-2 flex flex-col justify-between gap-1 text-sm sm:text-base sm:flex-row sm:items-center">
                            <span className="font-semibold text-slate-700">Ventas (Ejecutado) vs Meta</span>
                            <span className="text-slate-500">
                                {stats.totalVentas} / {stats.totalMeta}
                            </span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-[#C62828] transition-all duration-500" style={{ width: `${Math.min(stats.cumplimiento, 100)}%` }} />
                        </div>
                        {(metaLoading || noveltyLoading) && (
                            <p className="mt-2 text-xs text-slate-500">Actualizando metas y novedades...</p>
                        )}
                        {(metaError || noveltyError) && (
                            <p className="mt-1 text-xs text-red-600">Aviso: {metaError || noveltyError}</p>
                        )}
                    </div>
                </div>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
                        <div className="w-full">
                            <h2 className="text-xl font-extrabold text-slate-900">Equipo de Asesores</h2>
                            <p className="text-sm text-slate-600">
                                Periodo: <span className="font-semibold text-slate-900">{selectedPeriod}</span>
                            </p>
                        </div>
                        {(advisorsLoading || payrollLoading) && <p className="text-xs text-slate-500">Actualizando datos...</p>}
                        {(advisorsError || payrollError) && (
                            <p className="text-xs text-red-600">No fue posible cargar datos: {advisorsError || payrollError}</p>
                        )}
                    </div>

                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-slate-50 text-sm font-semibold uppercase tracking-wider text-slate-600">
                                    <th className="px-6 py-4">Asesor</th>
                                    <th className="px-6 py-4 text-center">Ventas / Meta</th>
                                    <th className="px-6 py-4 text-center">Cumplimiento</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 ">
                                {dataset.map((advisor) => (
                                    <tr
                                        key={advisor.id}
                                        className="cursor-pointer transition-colors duration-150 hover:bg-red-50"
                                        onClick={() => handleViewAdvisor(advisor)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                                                    {initials(advisor.nombre)}
                                                </div>
                                                <div>
                                                    <p className="text-base font-semibold text-slate-900">{advisor.nombre}</p>
                                                    <p className="text-xs text-slate-500">{advisor.cedula}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-base font-semibold text-slate-900">
                                            <span>{advisor.ventas}</span>
                                            <span className="mx-1 text-slate-400">/</span>
                                            <span className="text-slate-600">{advisor.meta}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`rounded-md border px-3 py-1 text-sm font-bold ${statusBadge(advisor.status)}`}>
                                                {advisor.cumplimiento}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${statusBadge(advisor.status)}`}>
                                                {advisor.status === "activo"
                                                    ? "Activo"
                                                    : advisor.status === "riesgo"
                                                        ? "Riesgo"
                                                        : advisor.status === "novedades"
                                                            ? `Novedades (${advisor.novedades || 0})`
                                                            : "Fin contrato"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-red-600" aria-label="Ver asesor">
                                                <Icon path="m9 18 6-6-6-6" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {dataset.length === 0 && !advisorsLoading && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-6 text-center text-sm text-slate-500">
                                            No hay asesores para este coordinador.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid gap-3 p-4 md:hidden">
                        {dataset.map((advisor) => (
                            <div
                                key={advisor.id}
                                className="rounded-xl border-2 border-slate-200 bg-white p-4 shadow-sm ring-1 ring-red-50"
                                onClick={() => handleViewAdvisor(advisor)}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-base font-bold text-slate-600">
                                            {initials(advisor.nombre)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{advisor.nombre}</p>
                                            <p className="text-xs text-slate-500">{advisor.cedula}</p>
                                        </div>
                                    </div>
                                    <button className="text-slate-400 hover:text-red-600" aria-label="Ver asesor">
                                        <Icon path="m9 18 6-6-6-6" />
                                    </button>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                                    <span className="rounded bg-slate-50 px-2 py-1 font-semibold text-slate-800">
                                        Ventas {advisor.ventas}
                                    </span>
                                    <span className="rounded bg-slate-50 px-2 py-1">Meta {advisor.meta}</span>
                                    <span className={`rounded bg-slate-50 px-2 py-1 text-center font-bold ${statusBadge(advisor.status)}`}>
                                        {advisor.cumplimiento}% cump.
                                    </span>
                                    <span className={`rounded bg-slate-50 px-2 py-1 font-semibold ${statusBadge(advisor.status)}`}>
                                        {advisor.status === "activo"
                                            ? "Activo"
                                            : advisor.status === "riesgo"
                                                ? "Riesgo"
                                                : advisor.status === "novedades"
                                                    ? `Novedades (${advisor.novedades || 0})`
                                                    : "Fin contrato"}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {dataset.length === 0 && !advisorsLoading && (
                            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
                                No hay asesores para este coordinador.
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-100 bg-slate-50 p-4 text-center text-sm text-slate-600">
                        Total asesores: {dataset.length}
                    </div>
                </section>
            </main>
        </div>
    )
}
