// ===============================================================
// AdvisorSalesSearchBar.jsx
// Barra de búsqueda y filtros para ventas del Asesor (CIAP Personal)
// ===============================================================

import React from "react"

const Icon = ({ path, size = 18, className = "", stroke = 1.5 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
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

export default function AdvisorSalesSearchBar({
    query,
    onQueryChange,
    status,
    onStatusChange,
    dateStart,
    dateEnd,
    onDateStartChange,
    onDateEndChange,
    onClearFilters
}) {
    return (
        <div className="w-full rounded-xl bg-white p-4 shadow-sm border border-gray-200 mb-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">

                {/* Buscador general */}
                <div className="flex-1">
                    <div className="relative">
                        <Icon
                            path="M21 21l-4.35-4.35M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
                            className="absolute left-3 top-2.5 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Buscar por cuenta, OT, producto…"
                            value={query}
                            onChange={(e) => onQueryChange(e.target.value)}
                            className="
                                w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm
                                focus:ring-2 focus:ring-red-200 focus:border-red-500
                            "
                        />
                    </div>
                </div>

                {/* Filtro por estado */}
                <div className="w-full md:w-40">
                    <select
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="
                            w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white
                            focus:ring-2 focus:ring-red-200 focus:border-red-500
                        "
                    >
                        <option value="">Todas</option>
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="APROBADA">Aprobada</option>
                    </select>
                </div>

                {/* Fecha inicial */}
                <div className="w-full md:w-40">
                    <input
                        type="date"
                        value={dateStart}
                        onChange={(e) => onDateStartChange(e.target.value)}
                        className="
                            w-full rounded-lg border border-gray-300 px-3 py-2 text-sm 
                            focus:ring-2 focus:ring-red-200 focus:border-red-500
                        "
                    />
                </div>

                {/* Fecha final */}
                <div className="w-full md:w-40">
                    <input
                        type="date"
                        value={dateEnd}
                        onChange={(e) => onDateEndChange(e.target.value)}
                        className="
                            w-full rounded-lg border border-gray-300 px-3 py-2 text-sm 
                            focus:ring-2 focus:ring-red-200 focus:border-red-500
                        "
                    />
                </div>

                {/* Botón limpiar */}
                <div className="flex justify-end">
                    <button
                        onClick={onClearFilters}
                        className="
                            px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold
                            hover:bg-gray-200 transition shadow-sm
                        "
                    >
                        Limpiar
                    </button>
                </div>
            </div>
        </div>
    )
}
