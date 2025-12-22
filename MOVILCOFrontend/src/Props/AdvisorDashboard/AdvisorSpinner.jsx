// components/Advisor/UI/AdvisorSpinner.jsx
import React from "react"

export default function AdvisorSpinner({ message = "Cargando información..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">

            {/* Spinner animado */}
            <div className="h-10 w-10 mb-4 animate-spin rounded-full border-4 border-slate-300 border-t-red-600" />

            {/* Mensaje */}
            <p className="text-sm font-medium text-gray-600">{message}</p>
        </div>
    )
}
