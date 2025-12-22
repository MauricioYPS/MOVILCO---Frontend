// components/Advisor/Sales/AdvisorSaleRow.jsx
import React from "react"
import { ChevronRight } from "lucide-react"

export default function AdvisorSaleRow({ sale, onSelect }) {
    if (!sale) return null

    const statusColor = {
        pendiente: "text-amber-600 bg-amber-100 border-amber-300",
        aprobada: "text-emerald-600 bg-emerald-100 border-emerald-300",
        rechazada: "text-red-600 bg-red-100 border-red-300"
    }[sale.estado || "pendiente"]

    return (
        <tr
            className="cursor-pointer hover:bg-slate-50 transition-colors border-b border-gray-100"
            onClick={() => onSelect(sale)}
        >
            {/* Cuenta */}
            <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                {sale.cuenta}
            </td>

            {/* OT */}
            <td className="px-4 py-3 text-sm text-gray-600">
                {sale.ot || "—"}
            </td>

            {/* Producto */}
            <td className="px-4 py-3 text-xs font-bold text-slate-700">
                {sale.tipo_producto}
            </td>

            {/* Comisión */}
            <td className="px-4 py-3 text-sm font-bold text-slate-900">
                {sale.comision_neta || 0}
            </td>

            {/* Fecha */}
            <td className="px-4 py-3 text-xs text-gray-500">
                {String(sale.fecha).split("T")[0]}
            </td>

            {/* Estado */}
            <td className="px-4 py-3 text-center">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${statusColor}`}>
                    {String(sale.estado || "pendiente").toUpperCase()}
                </span>
            </td>

            {/* Acción */}
            <td className="px-4 py-3 text-right pr-6">
                <ChevronRight size={18} className="text-gray-400" />
            </td>
        </tr>
    )
}
