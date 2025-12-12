// components/Advisor/Notifications/AdvisorNotificationList.jsx
import React from "react"
import AdvisorNotificationItem from "./AdvisorNotificationItem"

export default function AdvisorNotificationList({
    notifications = [],
    onSelectNotification
}) {

    if (!notifications.length) {
        return (
            <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-gray-300 bg-white">
                <p className="text-sm font-bold text-slate-700">Sin notificaciones</p>
                <p className="mt-1 text-xs text-gray-500">Aquí aparecerán los mensajes de tu coordinador.</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {notifications.map((n) => (
                <AdvisorNotificationItem
                    key={n.id}
                    title={n.title}
                    message={n.message}
                    date={n.date}
                    read={n.read}
                    onClick={() => onSelectNotification && onSelectNotification(n)}
                />
            ))}
        </div>
    )
}
