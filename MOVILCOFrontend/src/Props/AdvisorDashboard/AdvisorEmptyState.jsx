// components/Advisor/UI/AdvisorEmptyState.jsx
import React from "react"
import { InboxIcon } from "@heroicons/react/24/outline"

export default function AdvisorEmptyState({
    title = "Sin datos disponibles",
    message = "No encontramos información para mostrar en este momento.",
    actionLabel = null,
    onAction = null
}) {
    return (
        <div className="flex flex-col items-center justify-center py-14 text-center">

            {/* Ícono */}
            <InboxIcon className="h-12 w-12 text-slate-300 mb-3" />

            {/* Título */}
            <h3 className="text-sm font-bold text-slate-700 mb-1">
                {title}
            </h3>

            {/* Mensaje */}
            <p className="text-xs text-gray-500 max-w-xs mb-4">
                {message}
            </p>

            {/* Acción opcional */}
            {onAction && (
                <button
                    onClick={onAction}
                    className="px-4 py-2 text-xs font-bold rounded-md bg-slate-800 text-white hover:bg-slate-900 transition"
                >
                    {actionLabel || "Actualizar"}
                </button>
            )}
        </div>
    )
}
