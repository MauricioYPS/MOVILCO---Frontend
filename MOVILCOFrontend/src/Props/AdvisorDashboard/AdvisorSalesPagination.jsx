// components/Advisor/Pagination/AdvisorSalesPagination.jsx
import React from "react"

export default function AdvisorSalesPagination({
    currentPage,
    totalPages,
    onPageChange
}) {
    if (totalPages <= 1) return null

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return
        onPageChange(page)
    }

    const buildPages = () => {
        const pages = []

        // Mostrar máximo 5 botones: [1] ... [X-1] [X] [X+1] ... [N]
        const visible = 5
        let start = Math.max(1, currentPage - 2)
        let end = Math.min(totalPages, start + visible - 1)

        if (end - start < visible - 1) {
            start = Math.max(1, end - visible + 1)
        }

        // Página inicial
        if (start > 1) {
            pages.push(1)
            if (start > 2) pages.push("dots-start")
        }

        // Rango intermedio
        for (let p = start; p <= end; p++) {
            pages.push(p)
        }

        // Página final
        if (end < totalPages) {
            if (end < totalPages - 1) pages.push("dots-end")
            pages.push(totalPages)
        }

        return pages
    }

    const pages = buildPages()

    return (
        <div className="flex items-center justify-center gap-2 py-4 select-none">
            {/* Botón anterior */}
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 text-sm rounded-md border transition 
                    ${currentPage === 1 
                        ? "border-gray-200 text-gray-300 bg-gray-100 cursor-not-allowed"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-red-400"
                    }`}
            >
                Anterior
            </button>

            {/* Botones dinámicos */}
            {pages.map((p, idx) => {
                if (p === "dots-start" || p === "dots-end") {
                    return (
                        <span key={idx} className="px-2 text-gray-400">
                            ...
                        </span>
                    )
                }

                const isActive = p === currentPage

                return (
                    <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`px-3 py-1.5 text-sm rounded-md border transition font-medium
                            ${isActive
                                ? "bg-red-600 text-white border-red-600 shadow-sm"
                                : "bg-white border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-600"
                            }`}
                    >
                        {p}
                    </button>
                )
            })}

            {/* Botón siguiente */}
            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 text-sm rounded-md border transition 
                    ${currentPage === totalPages
                        ? "border-gray-200 text-gray-300 bg-gray-100 cursor-not-allowed"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-red-400"
                    }`}
            >
                Siguiente
            </button>
        </div>
    )
}
