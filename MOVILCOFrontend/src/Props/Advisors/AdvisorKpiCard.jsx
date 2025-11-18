export default function AdvisorKpiCard({ title, value, accentColor, icon, onFilter, linkLabel = "Filtrar lista" }) {
    return (
        <article
            className="cursor-pointer overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-md"
            onClick={onFilter}
        >
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${accentColor}`}>
                            {icon}
                        </div>
                    </div>
                    <div className="ml-5 flex-1">
                        <dl>
                            <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
                            <dd className="text-3xl font-semibold text-gray-900">{value}</dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 text-sm">
                <span className="font-medium text-red-600 hover:text-red-500">{linkLabel}</span>
            </div>
        </article>
    )
}
