// components/Advisor/Sales/AdvisorSalesHistory.jsx
import React, { useEffect, useState, useMemo } from "react"
import axios from "axios"
import { api } from "../../../store/api"

export default function AdvisorSalesHistory({ advisorId, period }) {
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadSales = async () => {
            try {
                setLoading(true)
                setError(null)

                const { data } = await axios.get(`${api}/api/workflow/advisor-sales`, {
                    params: { advisor_id: advisorId, period }
                })

                setSales(Array.isArray(data?.ventas) ? data.ventas : [])
            } catch (err) {
                console.error("ERROR loading sales:", err)
                setError("No fue posible cargar las ventas del asesor.")
            } finally {
                setLoading(false)
            }
        }

        if (advisorId) loadSales()
    }, [advisorId, period])

    /* ============================================================
       FILTRO LOCAL (por OT, Cuenta, Servicio)
    ============================================================ */
    const filteredSales = useMemo(() => {
        if (!search) return sales
        const q = search.toLowerCase()
        return sales.filter(s =>
            String(s.ot).toLowerCase().includes(q) ||
            String(s.cuenta).toLowerCase().includes(q) ||
            String(s.producto).toLowerCase().includes(q)
        )
    }, [sales, search])

    return (
        <div className="w-full rounded-xl border bg-white p-6 shadow-sm">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">Historial de Ventas</h2>

                <input
                    type="text"
                    placeholder="Buscar por OT, Cuenta o Producto..."
                    className="rounded-lg border px-3 py-1.5 text-sm shadow-sm w-64 focus:ring focus:ring-red-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* LOADING */}
            {loading && (
                <div className="text-center py-6 text-slate-500 text-sm">
                    Cargando ventas...
                </div>
            )}

            {/* ERROR */}
            {error && (
                <div className="text-center py-4 text-red-600 font-bold text-sm">
                    {error}
                </div>
            )}

            {/* TABLA DE VENTAS */}
            {!loading && filteredSales.length > 0 && (
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 text-left text-slate-600 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-2">Fecha</th>
                                <th className="px-4 py-2">OT</th>
                                <th className="px-4 py-2">Cuenta</th>
                                <th className="px-4 py-2">Producto</th>
                                <th className="px-4 py-2 text-center">Estado</th>
                                <th className="px-4 py-2 text-center">Fuente</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSales.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-2">{s.fecha || "-"}</td>
                                    <td className="px-4 py-2 font-semibold">{s.ot}</td>
                                    <td className="px-4 py-2">{s.cuenta}</td>
                                    <td className="px-4 py-2">{s.producto}</td>
                                    
                                    {/* ESTADO */}
                                    <td className="px-4 py-2 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold
                                            ${s.estado === "APROBADA" ? "bg-emerald-100 text-emerald-700" :
                                              s.estado === "PENDIENTE" ? "bg-amber-100 text-amber-700" :
                                              "bg-red-100 text-red-700"}
                                        `}>
                                            {s.estado}
                                        </span>
                                    </td>

                                    {/* ORIGEN DE VENTA */}
                                    <td className="px-4 py-2 text-center text-xs text-gray-500">
                                        {s.origen || "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* SIN RESULTADOS */}
            {!loading && filteredSales.length === 0 && (
                <div className="text-center py-6 text-gray-500 text-sm">
                    No se encontraron ventas para mostrar.
                </div>
            )}
        </div>
    )
}
