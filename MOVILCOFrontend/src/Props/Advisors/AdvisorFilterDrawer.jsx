export default function AdvisorFilterDrawer({
    open,
    onClose,
    complianceRange,
    onRangeChange,
    statusFilters,
    onToggleStatus,
    onClear,
    statusOptions
}) {
    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
                onClick={onClose}
            />
            <aside
                className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-white shadow-xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between border-b border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900">Filtros</h2>
                        <button
                            aria-label="Cerrar filtros"
                            onClick={onClose}
                            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-6">
                        <div>
                            <h3 className="mb-2 text-sm font-medium text-gray-600">Por Cumplimiento (%)</h3>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={complianceRange.min}
                                    onChange={(e) => onRangeChange({ ...complianceRange, min: e.target.value })}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={complianceRange.max}
                                    onChange={(e) => onRangeChange({ ...complianceRange, max: e.target.value })}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-2 text-sm font-medium text-gray-600">Por Estado</h3>
                            <div className="space-y-2">
                                {statusOptions.map((option) => (
                                    <label key={option.id} className="flex items-center text-sm text-gray-800">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                            checked={statusFilters.has(option.id)}
                                            onChange={() => onToggleStatus(option.id)}
                                        />
                                        <span className="ml-2">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                        <div className="flex gap-3">
                            <button
                                onClick={onClear}
                                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Limpiar todo
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Aplicar filtros
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
