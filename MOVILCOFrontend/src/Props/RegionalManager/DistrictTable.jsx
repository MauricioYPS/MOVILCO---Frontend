import React, { Fragment, useState } from "react"
import { Icon, CircularProgress, ProgressBar, getGapColor, getProgressBarColor } from "./shared"

export default function DistrictTable({ data, currentDate, handleViewCoordinator }) {
    const [expanded, setExpanded] = useState(null)

    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-200 bg-gray-50 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase text-slate-800">
                    <Icon path="M12 2v20M2 12h20" size={16} className="text-red-600" />
                    Gestión por Direccion Regional
                </h3>
                <div className="flex gap-2">
                    <button className="rounded border border-transparent p-1.5 text-gray-500 hover:border-gray-200 hover:bg-white">
                        <Icon path="M10 4h11M3 12h18M6 20h15M6 4 4 6m0 0 2 2M4 6H2" size={16} />
                    </button>
                    <button className="rounded border border-transparent p-1.5 text-gray-500 hover:border-gray-200 hover:bg-white">
                        <Icon path="M3 5h18M3 10h18M3 15h10" size={16} />
                    </button>
                </div>
            </div>

            <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-gray-100 bg-white text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            <th className="w-8 px-4 py-3" />
                            <th className="px-4 py-3">Direccion</th>
                            <th className="px-4 py-3 text-center">Meta Mes</th>
                            <th className="px-4 py-3 text-center text-blue-700">Meta Dia {currentDate}</th>
                            <th className="px-4 py-3 text-center text-blue-700 font-extrabold">Real</th>
                            <th className="px-4 py-3 text-center text-blue-700">GAP</th>
                            <th className="px-4 py-3 text-center">% Prorrateo</th>
                            <th className="px-4 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {data.map((d) => (
                            <Fragment key={d.id}>
                                <tr
                                    className={`cursor-pointer border-l-4 transition-colors ${expanded === d.id ? "border-red-600 bg-slate-50" : "border-transparent bg-white"} hover:bg-slate-50`}
                                    onClick={() => setExpanded(expanded === d.id ? null : d.id)}
                                >
                                    <td className="px-4 py-4 text-center">
                                        {expanded === d.id ? (
                                            <Icon path="m6 9 6 6 6-6" size={16} className="text-slate-800" />
                                        ) : (
                                            <Icon path="m6 9 6 6 6-6" size={16} className="rotate-180 text-gray-400" />
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm font-bold text-slate-800">{d.name}</div>
                                        <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                            <Icon path="M12 20.5 20 9a8 8 0 1 0-16 0l8 11.5Z" size={10} />
                                            {d.director}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center text-gray-400">{d.monthGoal}</td>
                                    <td className="px-4 py-4 bg-blue-50/20 text-center font-medium text-gray-600">{d.proratedGoal}</td>
                                    <td className="px-4 py-4 bg-blue-50/20 text-center font-bold text-slate-900">{d.sales}</td>
                                    <td className={`px-4 py-4 text-center font-bold ${getGapColor(d.gap)}`}>
                                        {d.gap > 0 ? "+" : ""}
                                        {d.gap}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center">
                                            <CircularProgress
                                                value={d.proratedCompliance}
                                                size={38}
                                                strokeWidth={4}
                                                colorClass={d.proratedCompliance >= 90 ? "text-emerald-500" : d.proratedCompliance >= 60 ? "text-amber-500" : "text-red-500"}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <button
                                            className="p-1 text-gray-400 hover:text-red-600"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleViewCoordinator(d.id)
                                            }}
                                        >
                                            <Icon path="M12 5v14M5 12h14" size={16} />
                                        </button>
                                    </td>
                                </tr>

                                {expanded === d.id && (
                                    <tr className="bg-slate-50">
                                        <td colSpan="8" className="p-0">
                                            <div className="border-b border-gray-200 p-5">
                                                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                                    <div
                                                        className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 rounded-lg p-2 -m-2 transition"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleViewCoordinator(d.id)
                                                        }}
                                                    >
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-500">
                                                            {d.director?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold uppercase text-gray-400">Director Responsable</p>
                                                            <p className="font-bold text-slate-800">{d.director}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-3">
                                                        <button className="flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:bg-gray-50">
                                                            <Icon path="M3 5h18M3 5v14h18V5" size={14} />
                                                            Correo
                                                        </button>
                                                        <button className="flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:bg-gray-50">
                                                            <Icon path="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5" size={14} />
                                                            Chat
                                                        </button>
                                                        <button
                                                            className="flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleViewCoordinator(d.id)
                                                            }}
                                                        >
                                                            Ver Director
                                                        </button>
                                                        <button
                                                            className="flex items-center gap-2 rounded border border-red-600 bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleViewCoordinator(d.id)
                                                            }}
                                                        >
                                                            Ver Coordinaciones
                                                        </button>
                                                    </div>
                                                </div>

                                                {expanded === d.id && (
                                                    <div className="space-y-2">
                                                        {d.coordinators.map((coord) => (
                                                            <div key={coord.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div>
                                                                        <p className="text-[10px] font-bold uppercase text-gray-400">Coordinación</p>
                                                                        <p className="text-sm font-bold text-slate-800">{coord.coord_unit_name}</p>
                                                                        <p className={`text-xs font-bold ${getGapColor(coord.gap)}`}>
                                                                            GAP {coord.gap > 0 ? "+" : ""}
                                                                            {coord.gap}
                                                                        </p>
                                                                    </div>
                                                                    <span className="rounded-full bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-600">Ventas {coord.sales}</span>
                                                                </div>

                                                                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                                                                    <div className="rounded bg-slate-50 px-2 py-1">Meta Dia: {coord.metaDia}</div>
                                                                    <div className="rounded bg-slate-50 px-2 py-1">Meta Semana: {coord.metaSemana}</div>
                                                                    <div className="rounded bg-slate-50 px-2 py-1">Meta Mes: {coord.metaMes}</div>
                                                                    <div className="rounded bg-slate-50 px-2 py-1">Prorrateo: {coord.proratedCompliance.toFixed(0)}%</div>
                                                                </div>

                                                                <div className="mt-3 flex items-center justify-between gap-2">
                                                                    <ProgressBar value={coord.proratedCompliance} colorClass={getProgressBarColor(coord.proratedCompliance)} />
                                                                    <button
                                                                        className="rounded bg-red-600 px-3 py-1 text-[11px] font-bold text-white transition hover:bg-red-700"
                                                                        onClick={() => handleViewCoordinator(coord.id)}
                                                                    >
                                                                        Ver Coord.
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vista móvil */}
            <div className="md:hidden divide-y divide-gray-100">
                {data.map((d) => {
                    const isOpen = expanded === d.id
                    return (
                        <div key={d.id} className="bg-white">
                            <button
                                className="w-full px-4 py-3 text-left"
                                onClick={() => setExpanded(isOpen ? null : d.id)}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate">{d.name}</p>
                                        <p className="text-xs text-gray-500 truncate">Director: {d.director}</p>
                                        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-600">
                                            <span className="rounded bg-blue-50 px-2 py-0.5">Meta Mes: {d.monthGoal}</span>
                                            <span className="rounded bg-blue-50 px-2 py-0.5">Real: {d.sales}</span>
                                            <span className={`rounded px-2 py-0.5 font-semibold ${getGapColor(d.gap)}`}>GAP {d.gap > 0 ? "+" : ""}{d.gap}</span>
                                        </div>
                                    </div>
                                    <span className="text-gray-500">
                                        {isOpen ? <Icon path="m6 9 6 6 6-6" size={16} /> : <Icon path="m6 9 6 6 6-6" size={16} className="rotate-180" />}
                                    </span>
                                </div>
                            </button>

                            {isOpen && (
                                <div className="bg-slate-50 px-4 pb-4">
                                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 mb-3">
                                        <span className="rounded bg-white px-2 py-1">Meta Día {currentDate}: {d.proratedGoal}</span>
                                        <span className="rounded bg-white px-2 py-1 font-semibold text-slate-800">Real: {d.sales}</span>
                                        <span className="rounded bg-white px-2 py-1">Prorrateo: {d.proratedCompliance.toFixed(1)}%</span>
                                        <span className="rounded bg-white px-2 py-1">Meta Mes: {d.monthGoal}</span>
                                    </div>

                                    <div className="space-y-2">
                                        {d.coordinators.map((coord) => (
                                            <div key={coord.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                                                <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase text-gray-400">Coordinación</p>
                                                    <p className="text-sm font-bold text-slate-800">{coord.coord_unit_name}</p>
                                                    <p className={`text-xs font-bold ${getGapColor(coord.gap)}`}>
                                                        GAP {coord.gap > 0 ? "+" : ""}
                                                        {coord.gap}
                                                    </p>
                                                </div>
                                                <span className="rounded-full bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-600">Ventas {coord.sales}</span>
                                                </div>

                                                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                                                    <div className="rounded bg-slate-50 px-2 py-1">Meta Dia: {coord.metaDia}</div>
                                                    <div className="rounded bg-slate-50 px-2 py-1">Meta Mes: {coord.metaMes}</div>
                                                    <div className="rounded bg-slate-50 px-2 py-1">Prorrateo: {coord.proratedCompliance.toFixed(0)}%</div>
                                                    <div className="rounded bg-slate-50 px-2 py-1">Meta Sem: {coord.metaSemana}</div>
                                                </div>

                                                <div className="mt-3 flex items-center justify-between gap-2">
                                                    <ProgressBar value={coord.proratedCompliance} colorClass={getProgressBarColor(coord.proratedCompliance)} />
                                                    <button
                                                        className="rounded bg-red-600 px-3 py-1 text-[11px] font-bold text-white transition hover:bg-red-700"
                                                        onClick={() => handleViewCoordinator(coord.id)}
                                                    >
                                                        Ver Coord.
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
