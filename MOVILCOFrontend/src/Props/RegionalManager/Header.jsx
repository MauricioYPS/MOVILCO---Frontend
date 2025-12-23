import React from "react"
import { Icon } from "./shared"

export default function Header({ onMenu, currentDay = 0, totalDays = 0, progressPct = 0 }) {
    return (
        <header className="z-10 flex h-16 items-center justify-between bg-slate-50 px-6 lg:px-10">
            <div className="flex items-center">
                <button onClick={onMenu} className="mr-4 text-gray-500 lg:hidden" aria-label="Abrir menú">
                    <Icon path="M4 6h16M4 12h16M4 18h16" size={22} />
                </button>
                <div>
                    <h1 className="hidden text-lg font-bold text-slate-800 sm:block">Tablero de Control</h1>
                    <p className="hidden items-center gap-1 text-xs text-gray-400 sm:flex">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Datos listos para conectar
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="mr-4 hidden flex-col items-end md:flex">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Icon path="M8 2h8M8 6h8M12 10v10M7 10h10M7 14h10M7 18h10" size={16} className="text-red-600" />
                        <span>Día {currentDay} de {totalDays}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-32 rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-slate-800" style={{ width: `${progressPct}%` }} />
                    </div>
                    <span className="mt-0.5 text-[10px] text-gray-500">Avance Mes: {progressPct.toFixed(0)}%</span>
                </div>
                <div className="hidden h-8 w-px bg-gray-200 md:block" />
                <div className="flex gap-3">
                    <button className="relative rounded-full border border-gray-100 bg-white p-2 text-gray-400 shadow-sm transition hover:text-red-600 hover:shadow-md" aria-label="Notificaciones">
                        <Icon path="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" size={20} />
                        <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
                    </button>
                    <button className="rounded-full border border-gray-100 bg-white p-2 text-gray-400 shadow-sm transition hover:text-blue-600 hover:shadow-md" aria-label="Correo">
                        <Icon path="M3 5h18M3 5v14h18V5" size={20} />
                    </button>
                </div>
            </div>
        </header>
    )
}
