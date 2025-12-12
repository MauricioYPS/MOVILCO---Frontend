// components/Advisor/UI/AdvisorErrorState.jsx
import React from "react"
import { XCircleIcon } from "@heroicons/react/24/solid"

export default function AdvisorErrorState({
    message = "Ocurrió un error inesperado.",
    onRetry = null
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">

            {/* Ícono de error */}
            <XCircleIcon className="h-12 w-12 text-red-600 mb-4" />

            {/* Mensaje de error */}
            <p className="text-sm font-semibold text-slate-700 mb-2">
                {message}
            </p>

            {/* Mensaje secundario */}
            <p className="text-xs text-gray-500 max-w-xs mb-4">
                Verifica tu conexión o vuelve a intentarlo.
            </p>

            {/* Botón de reintentar */}
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 text-xs font-bold rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                >
                    Reintentar
                </button>
            )}
        </div>
    )
}
