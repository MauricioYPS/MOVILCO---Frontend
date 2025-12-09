import Icon from "./Icon"

export default function TemplatePreview({ template, recipientsCount }) {
    return (
        <div className="flex h-[500px] flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between rounded-t-xl border-b border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex items-center gap-2">
                    <Icon path="M3 5h18M3 12h18M3 19h18" size={16} className="text-gray-500" />
                    <span className="text-sm font-bold text-gray-600">Vista Previa de Plantilla</span>
                </div>
                <span
                    className={`rounded px-2 py-1 text-xs font-bold uppercase ${
                        template.tag === "performance" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                    }`}
                >
                    {template.tagLabel}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto bg-white p-6 sm:p-8">
                <div className="mx-auto max-w-2xl rounded-lg border border-gray-100 p-6 shadow-sm sm:p-8">
                    <div className="mb-6 space-y-2 border-b border-gray-100 pb-4 text-sm">
                        <div className="flex">
                            <span className="w-20 text-gray-400">De:</span>
                            <span className="font-medium text-slate-800">no-reply@movilco.com</span>
                        </div>
                        <div className="flex">
                            <span className="w-20 text-gray-400">Para:</span>
                            <span className="flex w-fit items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-slate-600">
                                [Lista de {recipientsCount} destinatarios]
                            </span>
                        </div>
                        <div className="flex">
                            <span className="w-20 text-gray-400">Asunto:</span>
                            <span className="font-bold text-slate-800">{template.subject}</span>
                        </div>
                    </div>

                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{template.body}</div>

                    <div className="mt-8 flex items-center gap-3 border-t border-gray-100 pt-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-red-600 text-white">
                            <Icon path="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-800">Departamento Comercial</p>
                            <p className="text-[10px] text-gray-400">Este mensaje es automático.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 rounded-b-xl border-t border-gray-200 bg-gray-50 p-4">
                <button className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-white">Cancelar</button>
                <button className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-105 hover:bg-red-700">
                    <Icon path="M4 12h16M12 4v16" size={16} />
                    Enviar a {recipientsCount} Usuarios
                </button>
            </div>
        </div>
    )
}
