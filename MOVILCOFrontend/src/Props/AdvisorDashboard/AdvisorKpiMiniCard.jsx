// ===============================================================
// AdvisorKpiMiniCard.jsx
// Tarjeta pequeña de KPI para asesores - MovilCo
// ===============================================================

import React from "react"

const Icon = ({ path, size = 20, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width={size}
        height={size}
        className={className}
    >
        <path d={path} />
    </svg>
)

const Circular = ({ value, size = 48, strokeWidth = 4, color = "text-blue-600" }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (Math.min(value, 100) / 100) * circumference

    return (
        <div className="relative flex items-center justify-center"
            style={{ width: size, height: size }}>
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
                    className={`${color} transition-all duration-700`}
                />
            </svg>
            <span className="absolute text-[10px] font-bold text-slate-800">
                {Math.round(value)}%
            </span>
        </div>
    )
}

export default function AdvisorKpiMiniCard({
    title = "KPI",
    value = 0,
    meta = 0,
    progress = 0,
    color = "text-blue-600",
    icon,
}) {
    const percent = meta > 0 ? (value / meta) * 100 : 0

    return (
        <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-400 hover:shadow-md">
            {/* LEFT SIDE */}
            <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {title}
                </p>

                <h3 className="mt-1 text-2xl font-bold text-slate-900">
                    {value}
                    {meta > 0 && (
                        <span className="ml-1 text-xs text-gray-400 font-medium">
                            / {meta}
                        </span>
                    )}
                </h3>

                <div className="mt-2 flex items-center gap-1 text-xs font-medium text-gray-500">
                    {icon && <Icon path={icon} size={14} className="text-blue-600" />}
                    Proyección: {progress.toFixed(1)}%
                </div>
            </div>

            {/* RIGHT SIDE */}
            <Circular value={percent} size={48} color={color} />
        </div>
    )
}
