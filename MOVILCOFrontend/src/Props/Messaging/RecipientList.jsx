import Icon from "./Icon"

export default function RecipientList({ recipients, onRemove }) {
    return (
        <div className="flex min-h-[320px] flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-bold uppercase text-slate-800">
                    <Icon path="M9 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M21 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" size={16} className="text-red-600" />
                    Destinatarios ({recipients.length})
                </h2>
                <button className="text-xs font-bold text-blue-600 hover:underline">+ Agregar</button>
            </div>

            <div className="mb-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
                <Icon path="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm8 16-4-4" size={14} className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar en lista..."
                    className="w-full bg-transparent text-sm outline-none text-slate-700"
                />
            </div>

            <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto pr-1">
                {recipients.map((recipient) => (
                    <div
                        key={recipient.id}
                        className="group flex items-center justify-between rounded-md border border-transparent p-2 transition-colors hover:border-gray-100 hover:bg-gray-50"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                                {recipient.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-slate-700">{recipient.name}</p>
                                <p className="truncate text-[11px] text-gray-500">
                                    {recipient.role} | {recipient.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => onRemove(recipient.id)}
                            className="p-1 text-gray-300 transition-opacity group-hover:opacity-100 hover:text-red-500 opacity-0"
                            aria-label="Eliminar destinatario"
                        >
                            <Icon path="M18 6 6 18M6 6l12 12" size={14} />
                        </button>
                    </div>
                ))}
                {recipients.length === 0 && (
                    <div className="py-10 text-center text-xs text-gray-400">
                        <Icon path="M9 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M21 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" size={24} className="mx-auto mb-2 opacity-50" />
                        No hay destinatarios seleccionados.
                    </div>
                )}
            </div>
        </div>
    )
}
