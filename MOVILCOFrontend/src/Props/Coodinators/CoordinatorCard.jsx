export default function CoordinatorCard({ coordinator }) {
    const {
        name,
        district,
        advisors,
        performance,
        performanceLabel,
        performanceColor,
        bars,
        avatarBg = "bg-red-100",
        avatarIcon,
        barColor = "bg-red-500"
    } = coordinator

    return (
        <article className="overflow-hidden rounded-lg bg-white shadow-md">
            <div className="p-5">
                <div className="flex items-center space-x-4">
                    <span className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full ${avatarBg}`}>
                        {avatarIcon}
                    </span>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                        <p className="text-sm text-gray-600">{district}</p>
                    </div>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                    Asesores a cargo: <span className="text-base font-medium text-gray-800">{advisors}</span>
                </p>
            </div>

            <div className="px-5 pb-5 pt-4">
                <div className="mb-4">
                    <p className={`text-3xl font-bold ${performanceColor}`}>{performance}%</p>
                    <p className="text-sm font-medium text-gray-600">{performanceLabel}</p>
                </div>
                <div className="flex h-32 w-full items-end justify-between space-x-2" aria-label="Grafica de rendimiento semanal">
                    {bars.map(({ label, value }, index) => (
                        <div key={`${label}-${value}`} className="flex flex-1 flex-col items-center" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                            <div className={`bar-chart-bar w-full rounded-t-md ${barColor}`} style={{ height: `${value}%` }} />
                            <span className="mt-1 text-xs text-gray-500">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-100 p-4">
                <button className="w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    Ver Equipo
                </button>
            </div>
        </article>
    )
}
