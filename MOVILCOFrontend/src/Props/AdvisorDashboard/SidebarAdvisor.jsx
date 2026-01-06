// =========================================
// SidebarAdvisor.jsx
// Menú lateral para Asesores – MovilCo
// =========================================

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {api} from "../../../store/api"

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

export default function SidebarAdvisor() {
    const [open, setOpen] = useState(true)
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await fetch(`${api}/api/auth/logout`, {
                method: "POST",
                credentials: "include"
            })
            navigate("/login")
        } catch (err) {
            console.error("Error al cerrar sesión:", err)
        }
    }

    return (
        <aside
            className={`${
                open ? "w-64" : "w-20"
            } transition-all duration-300 bg-slate-900 text-white flex flex-col h-screen sticky top-0`}
        >
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-red-600 rounded flex items-center justify-center font-bold text-white">A</div>
                    {open && <span className="text-xl font-bold tracking-wide">MOVILCO</span>}
                </div>

                <button
                    onClick={() => setOpen(!open)}
                    className="text-slate-400 hover:text-white"
                >
                    <Icon path="M4 6h16M4 12h16M4 18h16" />
                </button>
            </div>

            {/* Menu */}
            <nav className="p-4 space-y-2 text-sm font-medium">

                <button
                    onClick={() => navigate("/advisor")}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                    <Icon path="M3 3h18v18H3z" size={18} />
                    {open && "Panel General"}
                </button>

                <button
                    onClick={() => navigate("/advisor/ventas")}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                    <Icon path="M5 12h14M12 5l7 7-7 7" size={18} />
                    {open && "Mis Ventas"}
                </button>

                <button
                    onClick={() => navigate("/advisor/ciap")}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                    <Icon path="M4 6h16M4 12h16M4 18h16" size={18} />
                    {open && "Mi CIAP"}
                </button>

                <button
                    onClick={() => navigate("/advisor/mensajes")}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                    <Icon path="M3 5h18M3 5v14h18V5" size={18} />
                    {open && "Mensajes"}
                </button>

                <button
                    onClick={() => navigate("/advisor/notificaciones")}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                    <Icon path="M12 2v20M2 12h20" size={18} />
                    {open && "Notificaciones"}
                </button>

            </nav>

            {/* Footer / Logout */}
            <div className="mt-auto p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
                >
                    <Icon path="M15 3h6v18h-6M3 12h12" size={18} />
                    {open && "Cerrar Sesión"}
                </button>
            </div>
        </aside>
    )
}
