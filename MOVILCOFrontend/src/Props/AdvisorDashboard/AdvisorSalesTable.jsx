// components/Advisor/Sales/AdvisorSaleDetailsModal.jsx
import React, { useState, useEffect } from "react"

const statusColor = {
    PENDIENTE: "bg-yellow-100 text-yellow-700",
    APROBADA: "bg-emerald-100 text-emerald-700",
    RECHAZADA: "bg-red-100 text-red-700"
}

export default function AdvisorSaleDetailsModal({ sale, open, onClose, onSave }) {
    const [formData, setFormData] = useState(null)

    useEffect(() => {
        if (sale) {
            setFormData({ ...sale })
        }
    }, [sale])

    if (!open || !formData) return null

    const canEdit = formData.status === "PENDIENTE"

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((f) => ({ ...f, [name]: value }))
    }

    const handleSubmit = () => {
        if (!canEdit) return
        onSave(formData)
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-xl rounded-xl bg-white shadow-xl border border-gray-200 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 bg-gray-50">
                    <h2 className="text-lg font-bold text-slate-800">
                        Detalles de la Venta
                    </h2>
                    <button
                        className="text-gray-400 hover:text-red-600"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="p-5 space-y-4">

                    {/* Estado */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600">Estado:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor[formData.status]}`}>
                            {formData.status}
                        </span>
                    </div>

                    {/* Campos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field
                            label="Número de Cuenta"
                            name="cuenta"
                            value={formData.cuenta}
                            editable={canEdit}
                            onChange={handleChange}
                        />
                        <Field
                            label="OT"
                            name="ot"
                            value={formData.ot}
                            editable={canEdit}
                            onChange={handleChange}
                        />
                        <Field
                            label="Producto"
                            name="producto"
                            value={formData.producto}
                            editable={canEdit}
                            onChange={handleChange}
                        />
                        <Field
                            label="Fecha"
                            name="fecha"
                            type="date"
                            value={formData.fecha}
                            editable={canEdit}
                            onChange={handleChange}
                        />
                        <Field
                            label="Comisión"
                            name="comision"
                            value={formData.comision}
                            editable={canEdit}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Observaciones */}
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Observaciones
                        </label>
                        <textarea
                            name="observacion"
                            value={formData.observacion || ""}
                            disabled={!canEdit}
                            onChange={handleChange}
                            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                                canEdit
                                    ? "border-gray-300 focus:border-red-600 focus:ring-red-600"
                                    : "bg-gray-100 border-gray-200 text-gray-500"
                            }`}
                            rows={3}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center px-5 py-4 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-red-600 transition"
                    >
                        Cerrar
                    </button>

                    {canEdit && (
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition shadow-sm"
                        >
                            Guardar cambios
                        </button>
                    )}
                </div>

            </div>
        </div>
    )
}

/* Subcomponente de campo */
function Field({ label, name, value, editable, type = "text", onChange }) {
    return (
        <div>
            <label className="text-sm font-medium text-gray-600">{label}</label>
            <input
                type={type}
                name={name}
                value={value || ""}
                disabled={!editable}
                onChange={onChange}
                className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                    editable
                        ? "border-gray-300 focus:border-red-600 focus:ring-red-600"
                        : "bg-gray-100 border-gray-200 text-gray-500"
                }`}
            />
        </div>
    )
}
