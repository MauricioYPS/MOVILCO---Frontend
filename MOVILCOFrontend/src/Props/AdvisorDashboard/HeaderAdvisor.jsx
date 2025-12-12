// =========================================
// HeaderAdvisor.jsx
// Encabezado para asesores – MovilCo
// =========================================

import React from "react"
import { useNavigate } from "react-router-dom"

const Icon = ({ path, size = 20, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        width={size}
        height={size}
        className={className}
    >
        <path d={path} />
    </svg>
)

export default function HeaderAdvisor({ day, totalDays }) {
    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem("movilco_user") || "{}")
    const progress = totalDays > 0 ? (day / totalDays) * 100 : 0

    return (
        <header
            className="
                flex items-center justify-between
                bg-white h-16 px-6 border-b border-gray-200
                shadow-sm z-10 sticky top-0
            "
        >
            {/* Left side */}
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-lg font-bold text-slate-900">
                        Bienvenido, {user?.name || "Asesor"}
                    </h1>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Sistema Operativo MovilCo
                    </p>
                </div>
            </div>

            {/* Right side: Progress of the month */}
            <div className="hidden md:flex flex-col items-end">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Icon path="M8 2h8M8 6h8M12 10v10M7 10h10M7 14h10M7 18h10" size={16} className="text-red-600" />
                    Día {day} de {totalDays}
                </div>

                <div className="mt-1 bg-gray-100 h-1.5 w-40 rounded-full overflow-hidden">
                    <div
                        className="bg-slate-800 h-full rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <span className="text-[10px] text-gray-500 mt-1">
                    Progreso del mes: {progress.toFixed(1)}%
                </span>
            </div>

            {/* Notifications */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate("/advisor/notificaciones")}
                    className="relative p-2 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-red-600 hover:shadow-md"
                >
                    <Icon path="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" size={20} />
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
                </button>

                <button
                    onClick={() => navigate("/advisor/mensajes")}
                    className="p-2 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-blue-600 hover:shadow-md"
                >
                    <Icon path="M3 5h18M3 5v14h18V5" size={20} />
                </button>
            </div>
        </header>
    )
}
