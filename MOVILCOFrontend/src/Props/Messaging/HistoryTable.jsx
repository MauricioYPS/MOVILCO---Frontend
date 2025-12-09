import Icon from "./Icon"

export default function HistoryTable({ items }) {
    return (
        <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <Icon path="M3 5h18M3 12h18M3 19h18" size={16} className="text-gray-400" />
                    Últimos Envios Masivos
                </h3>
                <button className="text-xs font-bold text-blue-600 hover:underline">Ver Todo</button>
            </div>
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                        <th className="w-32 px-6 py-3">Estado</th>
                        <th className="px-6 py-3">Plantilla / Rol</th>
                        <th className="px-6 py-3 text-center">Destinatarios</th>
                        <th className="px-6 py-3 text-right">Fecha</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {items.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-6 py-3">
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                                        log.status === "sent" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    <Icon path={log.status === "sent" ? "M5 13l4 4L19 7" : "M12 2v20M2 12h20"} size={10} />
                                    {log.status === "sent" ? "Enviado" : "Fallido"}
                                </span>
                            </td>
                            <td className="px-6 py-3">
                                <p className="font-bold text-slate-700">{log.type}</p>
                                <p className="text-xs text-gray-400">Para: {log.role}</p>
                            </td>
                            <td className="bg-gray-50/50 px-6 py-3 text-center font-mono text-slate-600">{log.count}</td>
                            <td className="px-6 py-3 text-right text-xs text-gray-500">{log.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
