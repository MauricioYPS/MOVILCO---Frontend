// ===============================================================
// AdvisorProfileHeader.jsx
// Encabezado principal del panel del Asesor - MovilCo
// ===============================================================

import React from "react"

const Icon = ({ path, size = 18, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={className}
    >
        <path d={path} />
    </svg>
)

export default function AdvisorProfileHeader({
    name = "Asesor",
    documentId = "",
    cargo = "ASESOR COMERCIAL",
    distrito = "",
    regional = "",
    ventas = 0,
    meta = 0,
    cumplimiento = 0,
    onMessage = () => {}
}) {
    // Iniciales
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()

    return (
        <section className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                {/* PERFIL */}
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-red-600 text-white flex items-center justify-center text-xl font-bold shadow">
                        {initials}
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{name}</h2>
                        <p className="text-sm text-gray-500">{cargo}</p>
                        <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-600">
                            {documentId && (
                                <span className="flex items-center gap-1">
                                    <Icon path="M12 2v20M5 9l7-7 7 7" size={12} />
                                    {documentId}
                                </span>
                            )}
                            {distrito && (
                                <span className="flex items-center gap-1">
                                    <Icon path="M12 20.5 20 9a8 8 0 1 0-16 0l8 11.5Z" size={12} />
                                    {distrito}
                                </span>
                            )}
                            {regional && (
                                <span className="flex items-center gap-1">
                                    <Icon path="M3 12h18" size={12} />
                                    {regional}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* KPI SUMMARY */}
                <div className="flex items-center gap-8 border-l lg:border-none lg:pl-0 pl-6">
                    <div className="text-center">
                        <p className="text-[11px] uppercase text-gray-400 font-bold tracking-wider">Ventas</p>
                        <h3 className="text-2xl font-bold text-slate-900">{ventas}</h3>
                    </div>

                    <div className="text-center">
                        <p className="text-[11px] uppercase text-gray-400 font-bold tracking-wider">Meta</p>
                        <h3 className="text-2xl font-bold text-slate-900">{meta}</h3>
                    </div>

                    <div className="text-center">
                        <p className="text-[11px] uppercase text-gray-400 font-bold tracking-wider">% Cumpl.</p>
                        <h3
                            className={`text-2xl font-bold ${
                                cumplimiento >= 100
                                    ? "text-emerald-600"
                                    : cumplimiento >= 60
                                    ? "text-amber-500"
                                    : "text-red-600"
                            }`}
                        >
                            {cumplimiento.toFixed(0)}%
                        </h3>
                    </div>
                </div>

                {/* ACCIONES */}
                <div className="flex items-center justify-end">
                    <button
                        onClick={onMessage}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-red-700 transition"
                    >
                        <Icon path="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5" />
                        Enviar mensaje al Coordinador
                    </button>
                </div>
            </div>
        </section>
    )
}
