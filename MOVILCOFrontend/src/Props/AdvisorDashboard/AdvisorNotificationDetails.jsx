// components/Advisor/Notifications/AdvisorNotificationDetail.jsx
import React from "react"

export default function AdvisorNotificationDetail({ notification, onClose }) {
    if (!notification) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl animate-fadeIn">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-bold text-slate-800">Mensaje del Coordinador</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-600 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="mt-4 space-y-3">
                    <p className="text-sm font-bold text-slate-700">{notification.title}</p>

                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {notification.message}
                    </p>

                    <p className="text-xs text-gray-400 border-t pt-2">
                        {notification.date}
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-red-700 transition"
                    >
                        Cerrar
                    </button>
                </div>

            </div>
        </div>
    )
}
