import Icon from "./Icon"

export default function TemplateSelector({ selectedType, onChangeType, targetRole, onChangeRole }) {
    const options = [
        {
            id: "performance",
            title: "Incumplimiento de Meta",
            desc: "Notificación formal por bajo rendimiento mensual.",
            accent: "red"
        },
        {
            id: "budget",
            title: "Asignación Presupuestal",
            desc: "Envío de metas y recursos del nuevo periodo.",
            accent: "blue"
        }
    ]

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase text-slate-800">
                <Icon path="M3 4h18M3 12h18M3 20h18" size={16} className="text-red-600" />
                1. Tipo de Comunicación
            </h2>
            <div className="space-y-3">
                {options.map((opt) => {
                    const active = selectedType === opt.id
                    const accent =
                        opt.accent === "red"
                            ? active
                                ? "bg-red-50 border-red-200 ring-1 ring-red-500 text-red-700"
                                : "bg-white border-gray-200 hover:border-gray-300 text-slate-700"
                            : active
                                ? "bg-blue-50 border-blue-200 ring-1 ring-blue-500 text-blue-700"
                                : "bg-white border-gray-200 hover:border-gray-300 text-slate-700"
                    return (
                        <label
                            key={opt.id}
                            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${accent}`}
                        >
                            <input
                                type="radio"
                                name="templateType"
                                className="mt-1"
                                checked={active}
                                onChange={() => onChangeType(opt.id)}
                            />
                            <div>
                                <span className="block text-sm font-bold">{opt.title}</span>
                                <span className="text-xs text-gray-500">{opt.desc}</span>
                            </div>
                        </label>
                    )
                })}
            </div>

            <div className="mt-6">
                <h3 className="mb-2 text-xs font-bold uppercase text-gray-500">Rol del Destinatario</h3>
                <div className="flex rounded-lg bg-gray-100 p-1">
                    {["advisor", "coordinator", "director"].map((role) => (
                        <button
                            key={role}
                            onClick={() => onChangeRole(role)}
                            className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
                                targetRole === role ? "bg-white text-slate-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {role === "advisor" ? "Asesor" : role === "coordinator" ? "Coord." : "Director"}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
