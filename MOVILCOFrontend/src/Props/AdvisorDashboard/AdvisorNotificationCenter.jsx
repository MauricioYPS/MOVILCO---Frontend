// components/Advisor/Notifications/AdvisorNotificationCenter.jsx
import React, { useEffect, useState } from "react"
import axios from "axios"
import { api } from "../../../store/api"

export default function AdvisorNotificationCenter({ advisorId }) {
    const [notifications, setNotifications] = useState([])
    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                setLoading(true)
                setError(null)

                const { data } = await axios.get(`${api}/api/notifications/advisor`, {
                    params: { advisor_id: advisorId }
                })

                setNotifications(Array.isArray(data?.notificaciones) ? data.notificaciones : [])
            } catch (err) {
                console.error("ERROR loading notifications:", err)
                setError("No fue posible cargar las notificaciones.")
            } finally {
                setLoading(false)
            }
        }

        if (advisorId) loadNotifications()
    }, [advisorId])

    const markAsRead = async (notif) => {
        if (!notif || notif.leido) return

        try {
            await axios.post(`${api}/api/notifications/mark-read`, {
                id: notif.id
            })

            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notif.id ? { ...n, leido: true } : n
                )
            )
        } catch (err) {
            console.error("ERROR marking notification as read:", err)
        }
    }

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* ============================================================
                LISTA IZQUIERDA — BANDEJA
            ============================================================ */}
            <div className="lg:col-span-1 border rounded-xl bg-white shadow-sm h-[650px] flex flex-col">

                <div className="border-b p-4">
                    <h2 className="text-lg font-bold text-slate-800">Notificaciones</h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Bandeja del asesor
                    </p>
                </div>

                {loading && (
                    <div className="text-center p-6 text-gray-500 text-sm">
                        Cargando notificaciones...
                    </div>
                )}

                {error && (
                    <div className="text-center p-4 text-red-600 font-bold text-sm">
                        {error}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`p-4 border-b cursor-pointer transition hover:bg-slate-50
                                ${notif.id === selected?.id ? "bg-slate-100" : ""}
                            `}
                            onClick={() => {
                                setSelected(notif)
                                markAsRead(notif)
                            }}
                        >
                            <div className="flex justify-between items-center">
                                <h4 className="text-sm font-bold text-slate-800">
                                    {notif.asunto || "Sin asunto"}
                                </h4>

                                {!notif.leido && (
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                )}
                            </div>

                            <p className="text-xs text-gray-500 mt-1">
                                {notif.fecha?.split("T")[0] || ""}
                            </p>

                            <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                                {notif.mensaje}
                            </p>
                        </div>
                    ))}

                    {!loading && notifications.length === 0 && (
                        <div className="text-center p-6 text-gray-500 text-sm">
                            No tienes notificaciones.
                        </div>
                    )}
                </div>
            </div>

            {/* ============================================================
                PANEL DERECHO — CONTENIDO DE NOTIFICACIÓN
            ============================================================ */}
            <div className="lg:col-span-2 border rounded-xl bg-white shadow-sm p-6 h-[650px] overflow-y-auto">

                {!selected ? (
                    <div className="text-center text-gray-400 text-sm mt-20">
                        Selecciona una notificación para leerla
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{selected.asunto}</h2>

                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span>De: {selected.remitente || "Sistema"}</span>
                            <span>•</span>
                            <span>{selected.fecha?.split("T")[0]}</span>
                        </div>

                        <div className="w-full h-px bg-gray-200 my-4"></div>

                        <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                            {selected.mensaje}
                        </p>
                    </div>
                )}

            </div>
        </div>
    )
}
