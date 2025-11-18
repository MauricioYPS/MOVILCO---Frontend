import CoordinatorCard from "../Props/Coodinators/CoordinatorCard"
import KpiCard from "../Props/Coodinators/KpiCard"
import RecentActivity from "../Props/Coodinators/RecentActivity"
import SearchFilters from "../Props/Coodinators/SearchFilters"

const avatarIcon = () => (
    <svg className="h-8 w-8 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
)

const coordinators = [
    {
        id: "eliana",
        name: "Eliana Martínez",
        district: "Distrito Villavicencio",
        advisors: 30,
        performance: 76,
        performanceLabel: "Rendimiento Promedio",
        performanceColor: "text-yellow-600",
        avatarBg: "bg-red-100",
        avatarIcon: avatarIcon(),
        bars: [
            { label: "S1", value: 75 },
            { label: "S2", value: 50 },
            { label: "S3", value: 90 },
            { label: "S4", value: 65 }
        ]
    },
    {
        id: "mauricio",
        name: "Mauricio Londoño",
        district: "Distrito Cundinamarca",
        advisors: 15,
        performance: 56,
        performanceLabel: "Rendimiento Promedio",
        performanceColor: "text-red-600",
        avatarBg: "bg-red-100",
        avatarIcon: avatarIcon(),
        bars: [
            { label: "S1", value: 40 },
            { label: "S2", value: 60 },
            { label: "S3", value: 55 },
            { label: "S4", value: 70 }
        ]
    },
    {
        id: "diana",
        name: "Diana Velásquez",
        district: "Distrito Medellín",
        advisors: 17,
        performance: 82,
        performanceLabel: "Rendimiento Promedio",
        performanceColor: "text-green-600",
        avatarBg: "bg-red-100",
        avatarIcon: avatarIcon(),
        bars: [
            { label: "S1", value: 70 },
            { label: "S2", value: 80 },
            { label: "S3", value: 85 },
            { label: "S4", value: 90 }
        ]
    },
    {
        id: "carlos",
        name: "Carlos Jiménez",
        district: "Distrito Bogotá",
        advisors: 22,
        performance: 91,
        performanceLabel: "Rendimiento Promedio",
        performanceColor: "text-green-600",
        avatarBg: "bg-red-100",
        avatarIcon: avatarIcon(),
        bars: [
            { label: "S1", value: 85 },
            { label: "S2", value: 90 },
            { label: "S3", value: 95 },
            { label: "S4", value: 92 }
        ]
    }
]

const kpiCards = [
    {
        id: "total-coordinators",
        value: "3",
        label: "Coordinadores",
        accent: "bg-red-100",
        icon: (
            <svg className="h-6 w-6 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-2.29l-2.114 1.585M17 20v-4M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1V10M9 9h6v6H9V9z" />
            </svg>
        )
    },
    {
        id: "total-advisors",
        value: "62",
        label: "Asesores",
        accent: "bg-red-100",
        icon: (
            <svg className="h-6 w-6 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        )
    },
    {
        id: "best-compliance",
        value: "Medellín",
        label: "Mejor Cumplimiento",
        accent: "bg-green-100",
        icon: (
            <svg className="h-6 w-6 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0A3.42 3.42 0 0016.165 4.697A3.42 3.42 0 0118 5.83c0 2.828-2.239 5.131-5 5.131S8 8.658 8 5.83a3.42 3.42 0 012.165-1.133zM9 12v9a2 2 0 002 2h2a2 2 0 002-2v-9" />
            </svg>
        )
    },
    {
        id: "lowest-compliance",
        value: "Villavicencio",
        label: "Menor Cumplimiento",
        accent: "bg-yellow-100",
        icon: (
            <svg className="h-6 w-6 text-yellow-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
            </svg>
        )
    }
]

const activityFeed = [
    {
        id: "activity-1",
        name: "Diana Velásquez",
        location: "Medellín",
        message: (
            <>
                alcanzó <span className="font-medium text-green-600">82%</span> de meta.
            </>
        ),
        time: "hace 10 minutos",
        accentBg: "bg-green-100",
        icon: (
            <svg className="h-5 w-5 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        id: "activity-2",
        name: "Mauricio Londoño",
        location: "Cundinamarca",
        message: (
            <>
                reportó <span className="font-medium text-red-600">56%</span>.
            </>
        ),
        time: "hace 45 minutos",
        accentBg: "bg-red-100",
        icon: (
            <svg className="h-5 w-5 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        )
    },
    {
        id: "activity-3",
        name: "Eliana Martínez",
        location: "Villavicencio",
        message: <>agregó 2 nuevos asesores.</>,
        time: "hace 2 horas",
        accentBg: "bg-blue-100",
        icon: (
            <svg className="h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
        )
    }
]

export default function Coordinators() {
    return (
        <main className="min-h-screen bg-gray-50">
            <div className="p-4 sm:p-6 lg:p-8 lg:grid lg:grid-cols-3 lg:gap-8">
                <section className="lg:col-span-2">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Directorio de Coordinadores</h1>
                        <p className="mt-1 text-gray-600">Supervisa el rendimiento de los coordinadores en tu distrito.</p>
                    </header>

                    <SearchFilters />

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {coordinators.map((coordinator) => (
                            <CoordinatorCard key={coordinator.id} coordinator={coordinator} />
                        ))}
                    </div>

                    <div className="mt-8 flex items-center justify-between text-sm text-gray-600">
                        <button className="rounded-lg border bg-white px-4 py-2 shadow-sm hover:bg-gray-50" disabled>
                            Anterior
                        </button>
                        <span>
                            Página <span className="font-medium text-gray-800">1</span> de <span className="font-medium text-gray-800">1</span>
                        </span>
                        <button className="rounded-lg border bg-white px-4 py-2 shadow-sm hover:bg-gray-50" disabled>
                            Siguiente
                        </button>
                    </div>
                </section>

                <aside className="lg:col-span-1">
                    <div className="space-y-8 lg:sticky lg:top-8">
                        <section>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Resumen del Distrito</h3>
                            <div className="grid grid-cols-2 gap-6">
                                {kpiCards.map((card) => (
                                    <KpiCard key={card.id} {...card} />
                                ))}
                            </div>
                        </section>

                        <RecentActivity items={activityFeed} />
                    </div>
                </aside>
            </div>
        </main>
    )
 }
