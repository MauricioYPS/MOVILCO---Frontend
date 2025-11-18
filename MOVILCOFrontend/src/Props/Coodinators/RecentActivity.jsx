function ActivityItem({ activity }) {
    const { name, location, message, time, accentBg, icon } = activity
    return (
        <div className="flex space-x-3">
            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${accentBg}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-800">
                    <span className="font-medium text-gray-900">{name}</span> ({location}) {message}
                </p>
                <p className="text-xs text-gray-500">{time}</p>
            </div>
        </div>
    )
}

export default function RecentActivity({ items }) {
    return (
        <section className="overflow-hidden rounded-lg bg-white shadow-md">
            <h3 className="border-b border-gray-200 px-5 py-4 text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            <div className="max-h-96 space-y-5 overflow-y-auto px-5 py-5">
                {items.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                ))}
                <div className="pt-2">
                    <button className="text-sm font-medium text-red-600 transition-colors duration-200 hover:text-red-700">
                    </button>
                </div>
            </div>
        </section>
    )
}
