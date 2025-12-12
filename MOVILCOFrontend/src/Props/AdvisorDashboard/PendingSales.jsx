// ===============================================================
// PendingSales.jsx
// Ventas Pendientes de Aprobación - Asesor MovilCo
// ===============================================================

import React, { useEffect, useState } from "react"
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

export default function PendingSales({ advisorId, onUpdated }) {
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const fetchPending = async () => {
        setLoading(true)
        setError("")

        try {
            const res = await axios.get(
                `${api}/api/workflow/advisor/pending-sales`,
                { params: { advisor_id: advisorId } }
            )

            if (res.data.ok) {
                setSales(res.data.resultado || [])
            } else {
                setError("No se pudieron cargar las ventas")
            }
        } catch (err) {
            console.error(err)
            setError("Error de conexión al cargar ventas")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPending()
    }, [advisorId])

    const handleDelete = async (saleId) => {
        if (!window.confirm("¿Eliminar esta venta?")) return

        try {
            await axios.delete(`${api}/api/workflow/advisor/delete-sale/${saleId}`)
            fetchPending()
            if (onUpdated) onUpdated()
        } catch (err) {
            console.error(err)
            alert("No se pudo eliminar la venta.")
        }
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Ventas Pendientes</h2>

                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                    {sales.length} pendientes
                </span>
            </div>

            {loading && <p className="text-sm text-gray-500">Cargando...</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {!loading && sales.length === 0 && (
                <p className="text-sm text-gray-500">No hay ventas pendientes.</p>
            )}

            <div className="mt-4 space-y-4">
                {sales.map((s) => (
                    <div
                        key={s.id}
                        className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                    >
                        {/* Linea lateral */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-lg" />

                        <div className="pl-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase text-gray-400">
                                        Cuenta {s.cuenta}
                                    </p>
                                    <h3 className="text-md font-bold text-slate-800">
                                        {s.tipo_servicio}
                                    </h3>
                                </div>

                                <span className="rounded bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600">
                                    {s.fecha_instalacion?.split("T")[0]}
                                </span>
                            </div>

                            <p className="mt-1 text-xs text-gray-500">
                                OT: <span className="font-semibold">{s.ot}</span>
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Ciudad: <span className="font-semibold">{s.ciudad}</span>
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Dirección: <span className="font-semibold">{s.direccion}</span>
                            </p>

                            {s.detalles && (
                                <p className="mt-2 text-xs text-gray-600 italic">{s.detalles}</p>
                            )}

                            <div className="mt-3 flex justify-end gap-3">
                                <button
                                    className="flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-red-700"
                                    onClick={() => handleDelete(s.id)}
                                >
                                    <Icon path="M6 18 18 6M6 6l12 12" size={14} />
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
