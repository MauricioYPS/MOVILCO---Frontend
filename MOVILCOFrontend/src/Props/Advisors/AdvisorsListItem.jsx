const getInitials = (name = "") =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((segment) => segment[0]?.toUpperCase())
        .join("") || "AA"

const performanceColor = (value = 0) => {
    if (value >= 80) return "text-green-600"
    if (value >= 60) return "text-yellow-600"
    if (value >= 40) return "text-amber-600"
    return "text-red-600"
}

function StatusPing({ show }) {
    if (!show) return null
    return (
        <span className="relative ml-2 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" title="Mensaje pendiente" />
        </span>
    )
}

export default function AdvisorsListItem({ advisor, checked, onToggle, onView, trend = [] }) {
    const initials = getInitials(advisor.nombre)
    const showPing = advisor.status === "incumplimiento" || (advisor.novedades && advisor.novedades.length > 0)
    const novedadesCount = Array.isArray(advisor.novedades)
        ? advisor.novedades.length
        : advisor.novedades
            ? 1
            : 0
    const contratoLabel = advisor.contrato_fin || null

    return (
        <li className="group transition-colors hover:bg-gray-50">
            <div className="flex items-center space-x-4 p-4 sm:p-6">
                <div className="flex-shrink-0">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        checked={checked}
                        onChange={() => onToggle?.(advisor.id)}
                    />
                </div>
                <div className="flex-shrink-0">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-lg font-medium text-red-700">
                        {initials}
                    </span>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center">
                        <p className="truncate text-base font-semibold text-gray-900">{advisor.nombre}</p>
                        <StatusPing show={showPing} />
                    </div>
                    <p className="truncate text-sm text-gray-600">{advisor.distrito}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <div>
                            <span className="text-gray-500">Conexiones:</span>{" "}
                            <span className="font-medium text-gray-900">{advisor.ventas ?? 0}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Novedades:</span>{" "}
                            <span className="font-medium text-blue-600">{novedadesCount}</span>
                        </div>
                        {contratoLabel && (
                            <div>
                                <span className="text-gray-500">Fin Contrato:</span>{" "}
                                <span className="font-medium text-red-600">{contratoLabel}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex h-12 w-24 items-end justify-center" title="Rendimiento (ultimos meses)">
                    <div className="flex items-end space-x-1.5" aria-hidden="true">
                        {trend.map((bar, index) => (
                            <div
                                key={`${advisor.id}-bar-${index}`}
                                className={`w-3 rounded ${bar.color}`}
                                style={{ height: `${bar.value}%` }}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                            title="Enviar mensaje"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        </button>
                        <button
                            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                            title="Asignar tarea"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 2a1 1 0 00-1 1v1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1h-4V3a1 1 0 00-1-1H9z" />
                                <path
                                    fillRule="evenodd"
                                    d="M15.293 3.293a1 1 0 011.414 0l1 1a1 1 0 010 1.414l-1 1a1 1 0 01-1.414-1.414L15.586 5l-.293-.293zM11 7a1 1 0 100-2H9a1 1 0 100 2h2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex w-20 flex-col items-end">
                        <p className={`text-xl font-bold ${performanceColor(advisor.cumplimiento)}`}>
                            {Math.round(advisor.cumplimiento) ?? 0}%
                        </p>
                        <button
                            className="mt-1 text-sm font-medium text-red-600 transition hover:text-red-500"
                            onClick={() => onView?.(advisor)}
                        >
                            Ver
                        </button>
                    </div>
                </div>
            </div>
        </li>
    )
}
