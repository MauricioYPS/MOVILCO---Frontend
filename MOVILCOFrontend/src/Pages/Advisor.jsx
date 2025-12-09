import { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import AdvisorsListItem from "../Props/Advisors/AdvisorsListItem"
import AdvisorKpiCard from "../Props/Advisors/AdvisorKpiCard"
import AdvisorFilterDrawer from "../Props/Advisors/AdvisorFilterDrawer"
import {
    fetchAdvisorsByCoordinator,
    selectCoordinatorAdvisors,
    selectCoordinatorAdvisorsError,
    selectCoordinatorAdvisorsLoading,
    selectCoordinatorId,
    selectCoordinatorMeta,
    setCoordinatorPeriod
} from "../../store/reducers/advisorsReducers"
const META_CONEXIONES = 13
const DIAS_META = 30
const clampPercent = (value) => Math.min(100, Math.max(0, Number(value) || 0))
const normalizeNovedades = (value) => {
    const list = Array.isArray(value) ? value : value ? [value] : []
    return list
        .map((item) => {
            if (!item) return null
            if (typeof item === "string" || typeof item === "number") return String(item)
            if (item && typeof item === "object") {
                const tipo = item.tipo || "Novedad"
                const descripcion = item.descripcion || ""
                const inicio = item.fecha_inicio ? `(${item.fecha_inicio}` : ""
                const fin = item.fecha_fin ? `${inicio ? " - " : "("}${item.fecha_fin}` : inicio ? ")" : ""
                const fechas = inicio ? `${inicio}${fin || ")"}` : ""
                return `${tipo}: ${descripcion}${fechas ? ` ${fechas}` : ""}`.trim()
            }
            return null
        })
        .filter(Boolean)
}

const STATUS_OPTIONS = [
    { id: "incumplimiento", label: "Con Mensajes Pendientes" },
    { id: "novedades", label: "Con Novedades" },
    { id: "fin_contrato", label: "Finaliza Contrato (prox. 30 dias)" }
]

const matchesStatusFilter = (asesor, status) => {
    switch (status) {
        case "incumplimiento":
            if (asesor.status) {
                return asesor.status === "incumplimiento"
            }
            return (asesor.cumplimiento ?? 0) < 80
        case "completas":
            if (asesor.status) {
                return asesor.status === "completas"
            }
            return (asesor.cumplimiento ?? 0) === 100
        case "novedades":
            return asesor.status === "novedades"
        case "fin_contrato":
            return asesor.status === "fin_contrato"
        default:
            return false
    }
}

const buildTrend = (asesor) => {
    const current = Math.max(0, Math.min(100, asesor.cumplimiento ?? 0))
    const history = [Math.max(0, current - 30), Math.max(0, current - 10), current]
    const colorForValue = (value) => {
        if (value >= 80) return "bg-green-500"
        if (value >= 60) return "bg-green-300"
        if (value >= 40) return "bg-yellow-400"
        if (value >= 20) return "bg-yellow-300"
        return "bg-red-500"
    }

    return history.map((value) => ({
        value: Math.max(5, Math.min(100, value)),
        color: colorForValue(value)
    }))
}

export default function Advisors() {
    const [query, setQuery] = useState("")
    const [statusFilters, setStatusFilters] = useState(new Set())
    const [complianceRange, setComplianceRange] = useState({ min: "", max: "" })
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedIds, setSelectedIds] = useState(new Set())
    const [sortOrder, setSortOrder] = useState("desc")

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const coordinatorAdvisors = useSelector(selectCoordinatorAdvisors)
    const advisorsLoading = useSelector(selectCoordinatorAdvisorsLoading)
    const advisorsError = useSelector(selectCoordinatorAdvisorsError)
    const coordinatorId = useSelector(selectCoordinatorId)
    const coordinatorMeta = useSelector(selectCoordinatorMeta)

    const selectAllRef = useRef(null)
    const lastFetchRef = useRef({ id: null, period: null })

    useEffect(() => {
        if (!coordinatorId) return
        const comboChanged =
            coordinatorId !== lastFetchRef.current.id || coordinatorMeta.period !== lastFetchRef.current.period
        if (!comboChanged) return
        lastFetchRef.current = { id: coordinatorId, period: coordinatorMeta.period }
        dispatch(fetchAdvisorsByCoordinator({ coordinatorId, period: coordinatorMeta.period }))
    }, [dispatch, coordinatorId, coordinatorMeta.period])

    useEffect(() => {
        setSelectedIds((prev) => {
            const available = new Set((Array.isArray(coordinatorAdvisors) ? coordinatorAdvisors : []).map((item) => item.id))
            if (available.size === 0) return prev
            const next = new Set()
            prev.forEach((id) => {
                if (!id || available.has(id)) {
                    next.add(id)
                }
            })
            return next
        })
    }, [coordinatorAdvisors])

    const apiAsesores = useMemo(() => {
        if (!Array.isArray(coordinatorAdvisors)) return []

        return coordinatorAdvisors.map((item, idx) => {
            const ventas = Number(item.ventas ?? 0)
            const prorrateo = Number(item.prorrateo ?? META_CONEXIONES) || META_CONEXIONES
            const meta = Number(prorrateo) || prorrateo
            const cumplimientoRaw = meta ? (ventas / meta) * 100 : 0
            const cumplimiento = clampPercent(cumplimientoRaw)
            const novedades = normalizeNovedades(item.novedades)
            const contratoFin = null

            let status = "en_progreso"
            if (contratoFin) status = "fin_contrato"
            else if (novedades && novedades.length > 0) status = "novedades"
            else if (cumplimiento < 80) status = "incumplimiento"
            else if (cumplimiento >= 100) status = "completas"

            return {
                id: item.id ?? idx,
                nombre: item.name ?? "Asesor sin nombre",
                cargo: "Asesor Comercial",
                cedula: item.document_id ?? "N/A",
                distrito: item.district ?? "N/A",
                regional: item.district_claro ?? item.coordinator_name ?? "N/A",
                contrato_inicio: "N/A",
                contrato_fin: contratoFin,
                novedades,
                ventas,
                prorrateo,
                diasLaborados: Number(item.dias_laborados ?? DIAS_META) || DIAS_META,
                cumplimiento,
                status,
                telefono: item.phone ?? "",
                correo: item.email ?? "",
                meta
            }
        })
    }, [coordinatorAdvisors])

    const dataset = apiAsesores

    const averageCompliance = useMemo(() => {
        if (dataset.length === 0) return 0
        const total = dataset.reduce((acc, a) => acc + clampPercent(a.cumplimiento ?? 0), 0)
        const avg = total / dataset.length
        return clampPercent(Number(avg.toFixed(2)))
    }, [dataset])

    const averageIncumplimiento = useMemo(() => {
        if (dataset.length === 0) return 0
        const total = dataset.reduce((acc, a) => acc + (100 - clampPercent(a.cumplimiento ?? 0)), 0)
        const avg = total / dataset.length
        return clampPercent(Number(avg.toFixed(2)))
    }, [dataset])

    const counts = useMemo(
        () => ({
            incumplimiento: dataset.filter((a) => matchesStatusFilter(a, "incumplimiento")).length,
            completas: dataset.filter((a) => matchesStatusFilter(a, "completas")).length,
            novedades: dataset.filter((a) => matchesStatusFilter(a, "novedades")).length,
            finContrato: dataset.filter((a) => matchesStatusFilter(a, "fin_contrato")).length
        }),
        [dataset]
    )

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

    const filteredAdvisors = useMemo(() => {
        let result = [...dataset]

        if (query.trim()) {
            const q = query.toLowerCase()
            result = result.filter((asesor) =>
                [asesor.nombre, asesor.distrito, asesor.regional, asesor.cargo].join(" ").toLowerCase().includes(q)
            )
        }

        if (complianceRange.min !== "") {
            const min = Number(complianceRange.min)
            result = result.filter((asesor) => (asesor.cumplimiento ?? 0) >= min)
        }

        if (complianceRange.max !== "") {
            const max = Number(complianceRange.max)
            result = result.filter((asesor) => (asesor.cumplimiento ?? 0) <= max)
        }

        if (statusFilters.size > 0) {
            result = result.filter((asesor) => {
                for (const status of statusFilters) {
                    if (matchesStatusFilter(asesor, status)) {
                        return true
                    }
                }
                return false
            })
        }

        result.sort((a, b) => {
            const aValue = a.cumplimiento ?? 0
            const bValue = b.cumplimiento ?? 0
            return sortOrder === "asc" ? aValue - bValue : bValue - aValue
        })

        return result
    }, [dataset, query, complianceRange, statusFilters, sortOrder])

    const totalAsesores = dataset.length
    const visibleAsesores = filteredAdvisors.length
    const selectedCount = selectedIds.size
    const allVisibleSelected = visibleAsesores > 0 && selectedCount === visibleAsesores

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = selectedCount > 0 && selectedCount < visibleAsesores
        }
    }, [selectedCount, visibleAsesores])

    const handleToggleStatus = (status) => {
        setStatusFilters((prev) => {
            const next = new Set(prev)
            if (next.has(status)) {
                next.delete(status)
            } else {
                next.add(status)
            }
            return next
        })
    }

    const handleClearFilters = () => {
        setStatusFilters(new Set())
        setComplianceRange({ min: "", max: "" })
    }

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(new Set(filteredAdvisors.map((advisor) => advisor.id)))
        } else {
            setSelectedIds(new Set())
        }
    }

    const handleToggleSelect = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    const handleKpiFilter = (statusKey) => {
        if (!statusKey) {
            setStatusFilters(new Set())
            return
        }
        setStatusFilters(new Set([statusKey]))
    }

    const handleToggleSort = () => {
        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
    }

    const handleViewAdvisor = (advisor) => {
        if (!advisor?.id) return
        navigate(`/AdvisorDetails/${advisor.id}`, { state: { advisor } })
    }

    if (advisorsLoading && apiAsesores.length === 0) {
        return <p className="p-6 text-gray-700">Cargando asesores del coordinador y métricas...</p>
    }

    if (advisorsError && apiAsesores.length === 0) {
        return <p className="p-6 text-red-600">Error al cargar los asesores: {advisorsError}</p>
    }

    const kpiCards = [
        {
            id: "promIncumplimiento",
            title: "Promedio Incumplimiento",
            value: `${Math.round(averageIncumplimiento)}% `,
            accentColor: "bg-red-100",
            statusKey: "incumplimiento",
            icon: (
                <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.182 16.318A4.486 4.486 0 0012.001 15c-1.427 0-2.742.5-3.812 1.318M15.182 16.318A4.486 4.486 0 0112.001 17c-1.427 0-2.742-.5-3.812-1.318M9.189 16.318c-.552.44-1.15.79-1.78.99A4.486 4.486 0 013 13.5V9.25c0-.621.504-1.125 1.125-1.125h.75c.621 0 1.125.504 1.125 1.125v4.25c0 .621-.504 1.125-1.125 1.125h-.75m9-6.75h.75c.621 0 1.125.504 1.125 1.125v4.25c0 .621-.504 1.125-1.125 1.125h-.75c-.621 0-1.125-.504-1.125-1.125V9.25c0-.621.504-1.125 1.125-1.125Z"
                    />
                </svg>
            )
        },
        {
            id: "promCumplimiento",
            title: "Promedio Cumplimiento",
            value: `${Math.round(averageCompliance)}%`,
            accentColor: "bg-green-100",
            statusKey: null,
            icon: (
                <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0Z" />
                </svg>
            )
        },
        {
            id: "novedades",
            title: "Asesores con Novedades",
            value: counts.novedades,
            accentColor: "bg-blue-100",
            statusKey: "novedades",
            icon: (
                <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.266 24.266 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M1.125 7.5A8.967 8.967 0 013.42 1.622c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.266 24.266 0 00-5.714 0m5.714 0a3 3 0 10-5.714 0" />
                </svg>
            )
        },
        {
            id: "finContrato",
            title: "Finalizan Contrato",
            value: counts.finContrato,
            accentColor: "bg-yellow-100",
            statusKey: "fin_contrato",
            icon: (
                <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9Z"
                    />
                </svg>
            )
        }
    ]

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">Resumen de Asesores</h1>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {kpiCards.map((card) => (
                        <AdvisorKpiCard
                            key={card.id}
                            title={card.title}
                            value={card.value}
                            accentColor={card.accentColor}
                            icon={card.icon}
                            onFilter={() => handleKpiFilter(card.statusKey)}
                        />
                    ))}
                </div>

                <section className="mt-10 overflow-hidden rounded-lg bg-white shadow">
                    <div className="border-b border-gray-200 p-4 sm:p-6">
                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <input
                                    ref={selectAllRef}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                    checked={allVisibleSelected}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Lista de Asesores</h2>
                                    <p className="text-sm text-gray-600">
                                        Mostrando {visibleAsesores} de {totalAsesores} asesores
                                    </p>
                                </div>
                            </div>
                            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                                <input
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Buscar por nombre, distrito..."
                                    className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 sm:w-64"
                                />
                                <select
                                    value={coordinatorMeta.period}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        dispatch(setCoordinatorPeriod(value))
                                        dispatch(fetchAdvisorsByCoordinator({ coordinatorId, period: value }))
                                        lastFetchRef.current = { id: coordinatorId, period: value }
                                    }}
                                    disabled={advisorsLoading}
                                    className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:bg-gray-100 sm:w-40"
                                >
                                {periodOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                                <button
                                    onClick={() => setIsDrawerOpen(true)}
                                    className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    Filtros
                                </button>
                                <button
                                    onClick={handleClearFilters}
                                    className="flex w-full items-center justify-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 sm:w-auto"
                                >
                                    Limpiar filtros
                                </button>
                                <button
                                    onClick={handleToggleSort}
                                    className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M3 3a1 1 0 000 2h14a1 1 0 100-2H3zM3 7a1 1 0 000 2h10a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
                                    </svg>
                                    Ordenar por: Cumplimiento {sortOrder === "desc" ? "DESC" : "ASC"}
                                </button>
                            </div>
                        </div>
                        {advisorsLoading && (
                            <p className="mt-2 text-xs text-gray-500">Actualizando lista de asesores y métricas...</p>
                        )}
                        {advisorsError && (
                            <p className="mt-2 text-xs text-red-500">
                                No fue posible obtener asesores o métricas: {advisorsError}
                            </p>
                        )}
                    </div>

                    {selectedCount > 0 && (
                        <div className="border-b border-gray-200 bg-gray-100 p-4">
                            <div className="flex items-center justify-between text-sm text-gray-700">
                                <span>
                                    {selectedCount} seleccionados de {visibleAsesores}
                                </span>
                                <button className="flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    Enviar mensaje
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="custom-scrollbar max-h-[600px] overflow-y-auto">
                        <ul className="divide-y divide-gray-200">
                            {filteredAdvisors.map((asesor) => (
                                <AdvisorsListItem
                                    key={asesor.id}
                                    advisor={asesor}
                                    checked={selectedIds.has(asesor.id)}
                                    onToggle={handleToggleSelect}
                                    onView={handleViewAdvisor}
                                    trend={buildTrend(asesor)}
                                />
                            ))}
                            {filteredAdvisors.length === 0 && (
                                <li className="p-6 text-sm text-gray-500">
                                    No se encontraron asesores con los criterios actuales.
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="border-t border-gray-200 p-4 sm:p-6">

                    </div>
                </section>
            </div>

            <AdvisorFilterDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                complianceRange={complianceRange}
                onRangeChange={setComplianceRange}
                statusFilters={statusFilters}
                onToggleStatus={handleToggleStatus}
                onClear={handleClearFilters}
                statusOptions={STATUS_OPTIONS}
            />
        </main>
    )
}
