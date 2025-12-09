import { useMemo, useState } from "react"
import TemplateSelector from "../Props/Messaging/TemplateSelector"
import RecipientList from "../Props/Messaging/RecipientList"
import TemplatePreview from "../Props/Messaging/TemplatePreview"
import HistoryTable from "../Props/Messaging/HistoryTable"
import FilterDrawer from "../Props/Messaging/FilterDrawer"
import Icon from "../Props/Messaging/Icon"

const templates = {
    performance: {
        advisor: {
            subject: "Alerta de Incumplimiento de Metas - [Mes]",
            body: "Hola [Nombre],\n\nHemos notado que tu rendimiento está por debajo del umbral esperado. Revisa tus indicadores y planifica acciones inmediatas.\n\nAtentamente,\nGerencia Regional",
            tag: "performance",
            tagLabel: "Incumplimiento"
        },
        coordinator: {
            subject: "Seguimiento crítico de indicadores de zona",
            body: "Estimado Coordinador [Nombre],\n\nSu zona presenta un déficit en el cumplimiento proyectado. Requerimos un plan de acción inmediato.\n\nDirección Comercial",
            tag: "performance",
            tagLabel: "Incumplimiento"
        },
        director: {
            subject: "Reporte de desviación regional - Acción requerida",
            body: "Estimado Director [Nombre],\n\nEl cierre proyecta una desviación significativa en su distrito. Solicitamos auditoría urgente.\n\nGerencia General",
            tag: "performance",
            tagLabel: "Incumplimiento"
        }
    },
    budget: {
        advisor: {
            subject: "Asignación de Presupuesto Comercial - [Mes]",
            body: "Hola [Nombre],\n\nTu meta asignada para este mes es de [Valor]. ¡Contamos contigo para superarla!\n\nÉxitos,\nMovilco",
            tag: "budget",
            tagLabel: "Presupuesto"
        },
        coordinator: {
            subject: "Distribución presupuestal de zona - [Mes]",
            body: "Estimado Coordinador [Nombre],\n\nAdjuntamos la distribución presupuestal para su equipo. Socializar antes del día 5.\n\nSaludos,\nMovilco",
            tag: "budget",
            tagLabel: "Presupuesto"
        },
        director: {
            subject: "Presupuesto operativo distrital - [Mes]",
            body: "Señor Director [Nombre],\n\nConfirmamos asignación de recursos y metas globales para su distrito en el periodo actual.\n\nCordialmente,\nFinanciera",
            tag: "budget",
            tagLabel: "Presupuesto"
        }
    }
}

const historyLog = [
    { id: 101, type: "Incumplimiento", role: "Asesor", count: 12, date: "Hace 2 horas", status: "sent" },
    { id: 102, type: "Presupuesto", role: "Coordinador", count: 5, date: "Ayer, 4:00 PM", status: "sent" },
    { id: 103, type: "Incumplimiento", role: "Asesor", count: 1, date: "08/10/2025", status: "failed" }
]

const initialRecipients = [
    { id: 1, name: "Maria Gonzalez", role: "Asesor", email: "maria@movilco.com" },
    { id: 2, name: "Juan Perez", role: "Asesor", email: "juan@movilco.com" },
    { id: 3, name: "Carlos Rodriguez", role: "Asesor", email: "carlos@movilco.com" },
    { id: 4, name: "Ana Martinez", role: "Asesor", email: "ana@movilco.com" }
]

export default function MessagingHub() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedTemplateType, setSelectedTemplateType] = useState("performance")
    const [targetRole, setTargetRole] = useState("advisor")
    const [recipients, setRecipients] = useState(initialRecipients)

    const currentTemplate = useMemo(() => templates[selectedTemplateType][targetRole], [selectedTemplateType, targetRole])

    const handleRemoveRecipient = (id) => setRecipients((prev) => prev.filter((r) => r.id !== id))

    return (
        <div className="flex min-h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex h-16 items-center justify-between bg-slate-950 px-6 lg:hidden">
                    <span className="text-xl font-bold">Menú</span>
                    <button onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú">
                        <Icon path="M18 6 6 18M6 6l12 12" size={22} />
                    </button>
                </div>
                <div className="p-6">
                    <div className="mb-10 flex items-center space-x-2 text-2xl font-bold tracking-tight text-white">
                        <Icon path="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" size={26} className="text-red-600" />
                        <span>MOVILCO</span>
                    </div>
                    <nav className="space-y-2">
                        <button className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-slate-400 transition hover:bg-slate-800 hover:text-white">
                            <Icon path="M3 3h8v7H3zM13 3h8v11h-8zM3 12h8v9H3zM13 16h8v5h-8z" size={18} />
                            <span>Dashboard</span>
                        </button>
                        <button className="flex w-full items-center space-x-3 rounded-lg border-l-4 border-red-500 bg-red-700 px-4 py-3 text-white shadow-md">
                            <Icon path="M3 5h18M3 12h18M3 19h18" size={18} />
                            <span>Comunicaciones</span>
                        </button>
                    </nav>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <header className="z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="text-gray-500 lg:hidden">
                            <Icon path="M4 6h16M4 12h16M4 18h16" size={22} />
                        </button>
                        <div className="flex items-center text-gray-500">
                            <Icon path="M10 19 3 12l7-7m-7 7h18" size={18} className="mr-1" />
                            <span className="text-sm font-medium">Volver</span>
                        </div>
                        <div className="hidden h-6 w-px bg-gray-200 sm:block" />
                        <h1 className="text-base font-bold text-slate-800 sm:text-lg">Centro de Comunicaciones</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden text-xs font-bold uppercase tracking-wider text-gray-400 sm:block">Modo envío masivo</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">GR</div>
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            Filtros
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8">
                    <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-12">
                        <div className="flex flex-col gap-6 lg:col-span-4">
                            <TemplateSelector
                                selectedType={selectedTemplateType}
                                onChangeType={setSelectedTemplateType}
                                targetRole={targetRole}
                                onChangeRole={setTargetRole}
                            />
                            <RecipientList recipients={recipients} onRemove={handleRemoveRecipient} />
                        </div>

                        <div className="flex flex-col gap-6 lg:col-span-8">
                            <TemplatePreview template={currentTemplate} recipientsCount={recipients.length} />
                            <HistoryTable items={historyLog} />
                        </div>
                    </div>
                </main>
            </div>

            <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </div>
    )
}
