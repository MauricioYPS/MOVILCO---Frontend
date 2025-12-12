// ===============================================================
// AdvisorMessageButton.jsx
// Botón para enviar mensaje al Coordinador (Panel Asesor)
// ===============================================================

import React from "react"

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

export default function AdvisorMessageButton({
    onClick = () => {},
    label = "Enviar mensaje al Coordinador",
    disabled = false
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow 
                transition-all bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
        >
            <Icon path="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5" size={18} />
            {label}
        </button>
    )
}
