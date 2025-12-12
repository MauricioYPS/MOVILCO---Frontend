// =========================================
// AdvisorStats.jsx
// Resumen KPI del Asesor – MovilCo
// =========================================

import React from "react"

const Icon = ({ path, size = 20, className = "", stroke = 1.5 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={size}
        height={size}
        className={className}
    >
        <path d={path} />
    </svg>
)

const CircularProgress = ({ value, size = 70, strokeWidth = 5, colorClass = "text-blue-600" }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (Math.min(value, 100) / 100) * circumference

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="h-full w-full -rotate-90 transform">
                <circle
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={`${colorClass} transition-all duration-700 ease-out`}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>

            <div className="absolute text-xs font-bold text-slate-700">{Math.round(value)}%</div>
        </div>
    )
}

export default function AdvisorStats({
    totalSales = 0,
    metaMes = 0,
    metaDia = 0,
    prorrateo = 0
}) {
    const cumplimiento = metaMes > 0 ? (totalSales / metaMes) * 100 : 0
    const cumplimientoDia = metaDia > 0 ? (totalSales / metaDia) * 100 : 0

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Ventas totales */}
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Venta Total Acumulada
                    </p>
                    <h3 className="mt-1 text-3xl font-bold text-slate-900">
                        {totalSales}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Meta Mes: {metaMes}
                    </p>
                </div>
                <CircularProgress value={cumplimiento} />
            </div>

            {/* Meta del día */}
            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600" />
                <div className="flex items-center justify-between pl-2">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Meta Día
                        </p>
                        <h3 className="mt-1 text-3xl font-bold text-slate-900">
                            {metaDia}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                            Cumplimiento Día: {cumplimientoDia.toFixed(1)}%
                        </p>
                    </div>
                    <Icon path="M3 17h2l1-2 3 3 5-7 4 5 3-9" size={32} className="text-blue-600" />
                </div>
            </div>

            {/* Prorrateo Mensual */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Prorrateo Mensual
                    </p>
                    <h3 className="mt-1 text-3xl font-bold text-slate-900">
                        {prorrateo}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Ventas necesarias para cumplir
                    </p>
                </div>
                <CircularProgress
                    value={prorrateo > 0 ? (totalSales / prorrateo) * 100 : 0}
                    colorClass="text-emerald-500"
                />
            </div>
        </div>
    )
}
