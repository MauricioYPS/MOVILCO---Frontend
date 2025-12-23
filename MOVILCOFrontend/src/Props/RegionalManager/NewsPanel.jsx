import React from "react"
import { Icon } from "./shared"

export default function NewsPanel({ items }) {
    return (
        <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-slate-800">
                        <Icon path="M2 6h20M5 6v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" size={16} className="text-amber-500" />
                        Centro de Novedades
                    </h3>
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">{items.length}</span>
                </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {items.map((nov) => (
                    <div key={nov.id} className="relative cursor-pointer overflow-hidden rounded-lg border border-gray-100 bg-white p-3 shadow-sm transition hover:shadow-md">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${nov.severity === "high" ? "bg-red-500" : nov.severity === "success" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        <div className="pl-2">
                            <div className="mb-1 flex items-start justify-between">
                                <span className="text-[10px] font-bold uppercase text-gray-500">{nov.zona}</span>
                                <span className="text-[10px] text-gray-400">{nov.time}</span>
                            </div>
                            <h5 className="mb-1 text-xs font-bold text-slate-800">
                                {nov.tipo}: {nov.ciudad}
                            </h5>
                            <p className="text-xs leading-snug text-gray-600">{nov.mensaje}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="p-3 text-center text-xs font-bold text-slate-500 transition-colors hover:bg-gray-50 hover:text-red-600">Ver Historial Completo</button>
        </div>
    )
}
