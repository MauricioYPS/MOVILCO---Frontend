// ===============================================================
// AdvisorNavigation.jsx
// Navegación principal del asesor - MovilCo
// ===============================================================

import React from "react"
import { useNavigate } from "react-router-dom"

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

export default function AdvisorNavigation({
    advisorName = "Asesor",
    active = "dashboard",
    onSelect = () => {}
}) {
    const navigate = useNavigate()

    const menu = [
        {
            id: "dashboard",
            label: "Panel General",
            icon: "M3 12h18M12 3v18",
        },
        {
            id: "kpis",
            label: "Mis KPIs",
            icon: "M4 6h16M4 12h10M4 18h7",
        },
        {
            id: "ventas",
            label: "Mis Ventas",
            icon: "M3 5h18M3 10h18M3 15h10",
        },
        {
            id: "pendientes",
            label: "Pendientes Supervisor",
            icon: "M12 6v6l4 2",
        },
        {
            id: "ciap",
            label: "Mi CIAP",
            icon: "M6 4h12v16H6z",
        },
        {
            id: "mensajes",
            label: "Mensajes",
            icon: "M4 5h16v14H4z M4 5l8 7 8-7",
        },
        {
            id: "notificaciones",
            label: "Notificaciones",
            icon: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",
        },
    ]

    const handleSelect = (id) => {
        onSelect(id)
    }

    return (
        <aside className="w-full bg-white border-b border-gray-200 shadow-sm lg:w-64 lg:border-r lg:border-gray-200 lg:h-screen lg:fixed">
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-slate-50 lg:block">
                <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        Bienvenido
                    </p>
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">
                        {advisorName}
                    </h2>
                </div>

                <button
                    className="lg:hidden text-gray-500 hover:text-gray-900"
                    onClick={() => navigate(-1)}
                >
                    <Icon path="M15 19l-7-7 7-7" size={22} />
                </button>
            </div>

            {/* NAV LINKS */}
            <nav className="p-3 space-y-1">
                {menu.map((item) => {
                    const selected = active === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleSelect(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                                ${selected
                                    ? "bg-red-600 text-white shadow-md"
                                    : "text-gray-600 hover:bg-slate-100"
                                }
                            `}
                        >
                            <Icon
                                path={item.icon}
                                size={18}
                                className={selected ? "text-white" : "text-red-600"}
                            />
                            {item.label}
                        </button>
                    )
                })}
            </nav>
        </aside>
    )
}
