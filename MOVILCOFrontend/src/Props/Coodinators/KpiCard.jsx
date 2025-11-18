export default function KpiCard({ value, label, accent, icon }) {
    return (
        <article className="rounded-lg bg-white p-5 text-center shadow-md">
            <div className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ${accent}`}>
                {icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600">{label}</p>
        </article>
    )
}
