// components/Advisor/Notifications/AdvisorNotificationItem.jsx
import React from "react"
import { BellAlertIcon } from "@heroicons/react/24/solid"
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline"

export default function AdvisorNotificationItem({
    title,
    message,
    date,
    read = false,
    onClick
}) {
    return (
        <div
            onClick={onClick}
            className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition 
                ${read ? "bg-white border-gray-200" : "bg-slate-50 border-slate-300"}
                hover:bg-slate-100`}
        >
            {/* Icono */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
                {read ? (
                    <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
                ) : (
                    <BellAlertIcon className="h-6 w-6 text-red-600" />
                )}
            </div>

            {/* Contenido */}
            <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">
                    {title}
                </p>

                <p className="mt-1 text-xs text-gray-600 leading-snug">
                    {message}
                </p>

                <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
                    <ClockIcon className="h-3 w-3" />
                    {date}
                </div>
            </div>
        </div>
    )
}
