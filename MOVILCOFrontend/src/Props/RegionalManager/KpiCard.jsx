import React from "react"
import { CircularProgress } from "./shared"

export default function KpiCard({ title, value, meta, progress }) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-blue-200">
            <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{title}</p>
                <h3 className="mt-1 text-3xl font-bold text-slate-900">{value}</h3>
                {meta !== undefined && <p className="mt-2 text-xs font-medium text-gray-600">Meta: {meta}</p>}
            </div>
            <CircularProgress value={progress} size={65} colorClass="text-blue-600" />
        </div>
    )
}
