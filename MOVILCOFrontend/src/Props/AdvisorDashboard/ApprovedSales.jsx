// ===============================================================
// ApprovedSales.jsx
// Ventas Aprobadas y KPIs Personales del Asesor - MovilCo
// ===============================================================

import React, { useEffect, useState, useMemo } from "react"
import axios from "axios"
import { api } from "../../store/api"

const Icon = ({ path, size = 18, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
        width={size}
        height={size}
    >
        <path d={path} />
    </svg>
)

const CircularProgress = ({ value, size = 55, strokeWidth = 5 }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (Math.min(value, 100) / 100) * circumference

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="h-full w-full -rotate-90 transform">
                <circle
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    className="text-gray-200"
                />
                <circle
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    className="text-blue-600 transition-all duration-700 ease-out"
                />
            </svg>
            <div className="absolute text-[11px] font-bold text-slate-700">{Math.round(value)}%</div>
        </div>
    )
}

export default function ApprovedSales({ advisorId, metaMes }) {
    const [approved, setApproved] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const fetchApproved = async () => {
        setLoading(true)
        setError("")

        try {
            const res = await axios.get(
                `${api}/api/workflow/advisor/approved-sales`,
                { params: { advisor_id: advisorId } }
            )

            if (res.data.ok) {
                setApproved(res.data.resultado || [])
            } else {
                setError("No se pudieron cargar las ventas aprobadas.")
            }
        } catch (err) {
            console.error(err)
            setError("Error de conexión al cargar ventas.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApproved()
    }, [advisorId])

    // ================================
    // KPI PERSONALES
    // ================================
    const kpis = useMemo(() => {
        const total = approved.length
        const meta = metaMes || 30
        const compliance = meta > 0 ? (total / meta) * 100 : 0
        const projection = compliance > 0 ? Math.min(100, compliance * 1.15) : 0

        return { total, meta, compliance, projection }
    }, [approved, metaMes])

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Ventas Aprobadas</h2>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    {approved.length} aprobadas
                </span>
            </div>

            {loading && <p className="text-sm text-gray-500">Cargando...</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* ==============================
                KPIs Personales
            ============================== */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-4 text-center shadow-sm bg-white">
                    <p className="text-[10px] font-bold uppercase text-gray-400">Meta Mes</p>
                    <h3 className="text-2xl font-bold text-slate-800">{kpis.meta}</h3>
                </div>

                <div className="rounded-lg border p-4 text-center shadow-sm bg-white">
                    <p className="text-[10px] font-bold uppercase text-gray-400">Ventas Aprobadas</p>
                    <h3 className="text-2xl font-bold text-slate-800">{kpis.total}</h3>
                </div>

                <div className="flex flex-col items-center justify-center rounded-lg border p-4 shadow-sm bg-white">
                    <p className="text-[10px] font-bold uppercase text-gray-400">Cumplimiento</p>
                    <CircularProgress value={kpis.compliance} size={60} />
                </div>
            </div>

            {/* ==============================
                LISTA DE VENTAS APROBADAS
            ============================== */}
            <div className="mt-4 space-y-4">
                {approved.map((s) => (
                    <div
                        key={s.id}
                        className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-lg" />

                        <div className="pl-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-md font-bold text-slate-800">
                                    {s.tipo_servicio}
                                </h3>

                                <span className="rounded bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
                                    {s.fecha_instalacion?.split("T")[0]}
                                </span>
                            </div>

                            <p className="mt-1 text-xs text-gray-600">
                                Cuenta: <span className="font-semibold">{s.cuenta}</span>
                            </p>

                            <p className="text-xs text-gray-600">
                                OT: <span className="font-semibold">{s.ot}</span>
                            </p>

                            <p className="text-xs text-gray-600">
                                Ciudad: <span className="font-semibold">{s.ciudad}</span>
                            </p>

                            {s.detalles && (
                                <p className="mt-2 text-xs text-gray-600 italic">{s.detalles}</p>
                            )}

                            <div className="mt-3 flex justify-end">
                                <button
                                    className="flex items-center gap-1 rounded bg-slate-800 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-900"
                                >
                                    <Icon path="M15 12H9m6 0l-3 3m3-3l-3-3" size={14} />
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && approved.length === 0 && (
                <p className="mt-4 text-sm text-gray-500">
                    Aún no tienes ventas aprobadas este mes.
                </p>
            )}
        </div>
    )
}
