import { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { mockAsesores } from "../Props/Advisors/datosquemados"
import AdvisorsListItem from "../Props/Advisors/AdvisorsListItem"
import AdvisorKpiCard from "../Props/Advisors/AdvisorKpiCard"
import AdvisorFilterDrawer from "../Props/Advisors/AdvisorFilterDrawer"
import {
    fetchNomina,
    selectNomina,
    selectNominaError,
    selectNominaLoading
} from "../../store/reducers/nominaReducers"
import {
    fetchSiapp,
    selectSiapp,
    selectSiappError,
    selectSiappLoading
} from "../../store/reducers/siappReducers"

const META_CONEXIONES = 13
const DIAS_META = 30

const STATUS_OPTIONS = [
    { id: "incumplimiento", label: "Con Mensajes Pendientes" },
    { id: "novedades", label: "Con Novedades" },
    { id: "fin_contrato", label: "Finaliza Contrato (prox. 30 dias)" }
]

const normalizeName = (value = "") =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()

const resolveDiasLaborados = (registro) => {
    if (typeof registro?.dias_laborados === "number") {
        return registro.dias_laborados
    }

    if (typeof registro?.novedad === "string") {
        const match = registro.novedad.match(/(\d+)/)
        if (match) {
            const diasAusencia = Number(match[1])
            if (!Number.isNaN(diasAusencia)) {
                return Math.max(0, DIAS_META - diasAusencia)
            }
        }
    }

    return DIAS_META
}

const matchesStatusFilter = (asesor, status) => {
    switch (status) {
        case "incumplimiento":
            return asesor.status === "incumplimiento" || (asesor.cumplimiento ?? 0) < 80
        case "completas":
            return asesor.status === "completas" || (asesor.cumplimiento ?? 0) === 100
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
    const nomina = useSelector(selectNomina)
    const nominaLoading = useSelector(selectNominaLoading)
    const nominaError = useSelector(selectNominaError)
    const siapp = useSelector(selectSiapp)
    const siappLoading = useSelector(selectSiappLoading)
    const siappError = useSelector(selectSiappError)

    const selectAllRef = useRef(null)

    useEffect(() => {
        dispatch(fetchNomina())
        dispatch(fetchSiapp())
    }, [dispatch])

    useEffect(() => {
        setSelectedIds((prev) => {
            const available = new Set((Array.isArray(nomina) ? nomina : []).map((item) => item.raw_row))
            if (available.size === 0) return prev
            const next = new Set()
            prev.forEach((id) => {
                if (!id || available.has(id)) {
                    next.add(id)
                }
            })
            return next
        })
    }, [nomina])

    const ventasPorNombre = useMemo(() => {
        const counts = new Map()
        if (!Array.isArray(siapp)) return counts
        siapp.forEach((registro) => {
            const nombreBase =
                registro?.nombre_funcionario ??
                registro?.asesor ??
                registro?.nombreAsesor ??
                registro?.nombre
            const key = normalizeName(nombreBase || "")
            if (!key) return
            counts.set(key, (counts.get(key) ?? 0) + 1)
        })
        return counts
    }, [siapp])

    const deriveStatusFromNomina = (registro) => {
        if (!registro) return "en_progreso"
        if (registro.novedad) return "novedades"
        if (registro.estado_envio_presupuesto === "ATRASADO") return "incumplimiento"
        if (registro.fecha_fin_contrato) {
            const fin = new Date(registro.fecha_fin_contrato)
            const hoy = new Date()
            const limite = new Date()
            limite.setDate(hoy.getDate() + 30)
            if (fin <= limite) return "fin_contrato"
        }
        if (registro.estado_envio_presupuesto === "ENVIADO") return "completas"
        return "en_progreso"
    }

    const apiAsesores = useMemo(() => {
        if (!Array.isArray(nomina)) return []

        return nomina.map((item, idx) => {
            const nombre = item.nombre_funcionario ?? "Funcionario sin nombre"
            const key = normalizeName(nombre)
            const diasLaborados = Math.max(0, Math.min(resolveDiasLaborados(item), DIAS_META))
            const prorrateo = Number(((META_CONEXIONES / DIAS_META) * diasLaborados).toFixed(2))
            const ventas = ventasPorNombre.get(key) ?? 0
            const cumplimiento =
                prorrateo > 0
                    ? Math.min(100, Number(((ventas / prorrateo) * 100).toFixed(2)))
                    : 0

            return {
                id: item.raw_row ?? idx,
                nombre,
                cargo: item.contratado === "SI" ? "Asesor Comercial" : "Sin contrato activo",
                cedula: item.cedula ?? "N/A",
                distrito: item.distrito ?? item.distrito_claro ?? "N/A",
                regional: item.distrito_claro ?? "N/A",
                contrato_inicio: item.fecha_inicio_contrato ? item.fecha_inicio_contrato.split("T")[0] : "N/A",
                contrato_fin: item.fecha_fin_contrato ? item.fecha_fin_contrato.split("T")[0] : null,
                novedades: item.novedad,
                ventas,
                prorrateo,
                diasLaborados,
                cumplimiento,
                status: deriveStatusFromNomina(item)
            }
        })
    }, [nomina, ventasPorNombre])

    const dataset = apiAsesores.length > 0 ? apiAsesores : mockAsesores
    const usingMockData = apiAsesores.length === 0

    const counts = useMemo(
        () => ({
            incumplimiento: dataset.filter((a) => matchesStatusFilter(a, "incumplimiento")).length,
            completas: dataset.filter((a) => matchesStatusFilter(a, "completas")).length,
            novedades: dataset.filter((a) => matchesStatusFilter(a, "novedades")).length,
            finContrato: dataset.filter((a) => matchesStatusFilter(a, "fin_contrato")).length
        }),
        [dataset]
    )

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

    if ((nominaLoading || siappLoading) && apiAsesores.length === 0) {
        return <p className="p-6 text-gray-700">Cargando informacion de nomina y ventas...</p>
    }

    if ((nominaError || siappError) && apiAsesores.length === 0) {
        return <p className="p-6 text-red-600">Error al cargar los datos: {nominaError || siappError}</p>
    }

    const kpiCards = [
        {
            id: "incumplimiento",
            title: "Incumplimiento de Metas",
            value: counts.incumplimiento,
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
            id: "completas",
            title: "Metas Completas (100%)",
            value: counts.completas,
            accentColor: "bg-green-100",
            statusKey: "completas",
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
                            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                <input
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Buscar por nombre, distrito..."
                                    className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 sm:w-64"
                                />
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
                        {siappLoading && (
                            <p className="mt-2 text-xs text-gray-500">Actualizando ventas desde SIAPP...</p>
                        )}
                        {siappError && (
                            <p className="mt-2 text-xs text-red-500">No fue posible sincronizar SIAPP: {siappError}</p>
                        )}
                        {usingMockData && (
                            <p className="mt-2 text-xs text-gray-500">
                                Mostrando datos de ejemplo mientras llega la informacion real.
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
                        <nav className="flex items-center justify-between text-sm text-gray-600">
                            <p>Pagina 1 de 1</p>
                            <div className="space-x-2">
                                <button className="rounded-md border border-gray-300 px-3 py-1 transition hover:bg-gray-100" disabled>
                                    Anterior
                                </button>
                                <button className="rounded-md border border-gray-300 px-3 py-1 transition hover:bg-gray-100" disabled={visibleAsesores === 0}>
                                    Siguiente
                                </button>
                            </div>
                        </nav>
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
