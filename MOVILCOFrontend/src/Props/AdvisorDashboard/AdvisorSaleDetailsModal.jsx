// components/Advisor/Sales/AdvisorSaleDetailsModal.jsx
import React from "react"
import { X } from "lucide-react"

export default function AdvisorSaleDetailsModal({ sale, open, onClose }) {
    if (!open || !sale) return null

    const Info = ({ label, value }) => (
        <div className="flex flex-col px-2 py-1">
            <span className="text-[11px] font-bold uppercase text-gray-400">{label}</span>
            <span className="text-sm font-semibold text-slate-800">{value || "N/A"}</span>
        </div>
    )

    const statusColor = {
        pendiente: "bg-amber-100 text-amber-700 border-amber-300",
        aprobada: "bg-emerald-100 text-emerald-700 border-emerald-300",
        rechazada: "bg-red-100 text-red-700 border-red-300"
    }[sale.estado || "pendiente"]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-xl rounded-xl bg-white shadow-xl animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    <h2 className="text-lg font-bold text-slate-900">
                        Detalle de la Venta
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 hover:text-red-600"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Status */}
                <div className="px-5 py-3">
                    <span className={`inline-block rounded-md border px-3 py-1 text-xs font-bold ${statusColor}`}>
                        {String(sale.estado || "pendiente").toUpperCase()}
                    </span>
                </div>

                {/* Body */}
                <div className="max-h-[70vh] overflow-y-auto px-5 pb-6 space-y-4">

                    {/* Primera sección: básicos */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
                            Información general
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Info label="Cuenta" value={sale.cuenta} />
                            <Info label="OT" value={sale.ot} />
                            <Info label="Fecha" value={sale.fecha} />
                            <Info label="Producto" value={sale.tipo_producto} />
                            <Info label="Comisión" value={sale.comision_neta} />
                        </div>
                    </div>

                    {/* Ubicación */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
                            Ubicación / Red
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Info label="Zona" value={sale.zona} />
                            <Info label="Población" value={sale.poblacion} />
                            <Info label="División" value={sale.division} />
                            <Info label="Área" value={sale.area} />
                        </div>
                    </div>

                    {/* Información comercial */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
                            Información comercial
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Info label="Renta" value={sale.renta} />
                            <Info label="Estrato" value={sale.estrato} />
                            <Info label="Modalidad Venta" value={sale.modalidad_venta} />
                            <Info label="Tipo Registro" value={sale.tipo_registro} />
                        </div>
                    </div>

                    {/* Workflow data */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
                            Workflow
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Info label="Creada" value={sale.created_at} />
                            <Info label="Modificada" value={sale.updated_at} />
                            <Info label="Aprobada por Supervisor" value={sale.supervisor_ok ? "Sí" : "No"} />
                            <Info label="Exportada al CIAP" value={sale.exportada ? "Sí" : "No"} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-5 py-3 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}
