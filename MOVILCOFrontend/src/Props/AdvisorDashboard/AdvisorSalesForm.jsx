// ===============================================
// AdvisorSalesForm.jsx
// Formulario de Registro de Venta - Asesor MovilCo
// ===============================================

import React, { useState } from "react"
import axios from "axios"
import { api } from "../../store/api"

export default function AdvisorSalesForm({ advisorId, onCreated }) {
    const [form, setForm] = useState({
        cuenta: "",
        tipo_servicio: "",
        ot: "",
        ciudad: "",
        direccion: "",
        fecha_instalacion: "",
        detalles: ""
    })

    const [loading, setLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    const updateField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setSuccessMsg("")
        setErrorMsg("")

        try {
            const payload = {
                advisor_id: advisorId,
                ...form
            }

            const res = await axios.post(`${api}/api/workflow/advisor/create-sale`, payload)

            if (res.data.ok) {
                setSuccessMsg("Venta registrada con éxito.")
                setForm({
                    cuenta: "",
                    tipo_servicio: "",
                    ot: "",
                    ciudad: "",
                    direccion: "",
                    fecha_instalacion: "",
                    detalles: ""
                })
                if (onCreated) onCreated()
            } else {
                setErrorMsg(res.data.error || "Error al registrar la venta.")
            }
        } catch (err) {
            console.error(err)
            setErrorMsg("No se pudo registrar la venta.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Registrar Nueva Venta</h2>

            {successMsg && (
                <div className="mb-3 rounded bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700">
                    {successMsg}
                </div>
            )}

            {errorMsg && (
                <div className="mb-3 rounded bg-red-100 px-3 py-2 text-sm font-medium text-red-700">
                    {errorMsg}
                </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Cuenta */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Número de Cuenta</label>
                    <input
                        type="text"
                        value={form.cuenta}
                        onChange={(e) => updateField("cuenta", e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-600 focus:ring-red-600"
                    />
                </div>

                {/* Tipo Servicio */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Tipo de Servicio</label>
                    <select
                        value={form.tipo_servicio}
                        onChange={(e) => updateField("tipo_servicio", e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-red-600 focus:ring-red-600"
                    >
                        <option value="">Seleccione...</option>
                        <option value="INTERNET">Internet</option>
                        <option value="TELEFONIA">Telefonía</option>
                        <option value="TELEVISION">Televisión</option>
                        <option value="COMBO">Combo</option>
                    </select>
                </div>

                {/* OT */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Número OT</label>
                    <input
                        type="text"
                        value={form.ot}
                        onChange={(e) => updateField("ot", e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-600 focus:ring-red-600"
                    />
                </div>

                {/* Ciudad */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Ciudad</label>
                    <input
                        type="text"
                        value={form.ciudad}
                        onChange={(e) => updateField("ciudad", e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-600 focus:ring-red-600"
                    />
                </div>

                {/* Dirección */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Dirección de Instalación</label>
                    <input
                        type="text"
                        value={form.direccion}
                        onChange={(e) => updateField("direccion", e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-600 focus:ring-red-600"
                    />
                </div>

                {/* Fecha Instalación */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Fecha Instalación</label>
                    <input
                        type="date"
                        value={form.fecha_instalacion}
                        onChange={(e) => updateField("fecha_instalacion", e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-600 focus:ring-red-600"
                    />
                </div>

                {/* Detalles */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Detalles (Opcional)</label>
                    <textarea
                        value={form.detalles}
                        onChange={(e) => updateField("detalles", e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-600 focus:ring-red-600"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-red-600 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                    {loading ? "Registrando..." : "Registrar Venta"}
                </button>
            </form>
        </div>
    )
}
