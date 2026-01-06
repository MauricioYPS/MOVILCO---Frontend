import React from "react"
import { Hash, Eye, Edit3, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import Badge from "./common/Badge"

const DataTable = React.memo(function DataTable({
  listLoading,
  allNovelties,
  isAuthorized,
  openDetailModal,
  openEditModal,
  openDeleteModal,
  fromRecord,
  toRecord,
  total,
  limit,
  offset,
  handleLimitChange,
  handlePageChange,
  listError
}) {
  const hasRows = allNovelties?.length > 0

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="relative">
        {/* ===== MOBILE (cards) ===== */}
        <div className="md:hidden">
          <div className="divide-y divide-slate-100">
            {hasRows &&
              allNovelties.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex items-start gap-3">
                      <div className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-200">
                        {item.name?.charAt(0) || "?"}
                      </div>

                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 text-base truncate">{item.name}</div>
                        <div className="text-sm text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <Hash size={12} /> {item.docId}
                        </div>

                        <div className="mt-3 flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-slate-600">Tipo</span>
                            <Badge type={item.type} />
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-slate-600">Vigencia</span>
                            <span className="text-sm text-slate-700 font-semibold text-right">
                              {item.start} al {item.end}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-slate-600">Distrito</span>
                            <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                              {item.district}
                            </span>
                          </div>

                          <div className="text-sm text-slate-400">Reg: {item.created_at}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => openDetailModal(item)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Ver Detalle"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded disabled:opacity-40"
                        title="Editar"
                        disabled={!isAuthorized}
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(item)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-40"
                        title="Eliminar"
                        disabled={!isAuthorized}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {!hasRows && (
              <div className="px-6 py-10 text-center text-slate-400 text-base">
                {listLoading ? "Buscando..." : "Sin registros para los filtros actuales."}
              </div>
            )}
          </div>
        </div>

        {/* ===== DESKTOP (table) ===== */}
        <div className="hidden md:block">
          {/* En desktop mantenemos overflow-x-auto por seguridad, pero con el layout ya no debería aparecer scroll
              en md/lg salvo casos extremos de contenido. */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm uppercase tracking-wider text-slate-500 font-bold">
                  <th className="px-4 lg:px-6 py-4">Empleado / ID</th>

                  {/* En md ocultamos columnas para evitar scroll horizontal; vuelven en lg */}
                  <th className="hidden lg:table-cell px-4 lg:px-6 py-4 text-center">Tipo</th>
                  <th className="hidden lg:table-cell px-4 lg:px-6 py-4">Vigencia</th>
                  <th className="hidden lg:table-cell px-4 lg:px-6 py-4 text-center">Distrito</th>

                  <th className="px-4 lg:px-6 py-4 text-right">Control</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-[15px]">
                {hasRows &&
                  allNovelties.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-4 lg:px-6 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-200 shrink-0">
                            {item.name?.charAt(0) || "?"}
                          </div>

                          <div className="min-w-0">
                            <div className="font-bold text-slate-800 truncate">{item.name}</div>

                            <div className="text-sm text-slate-400 font-mono tracking-tight flex items-center gap-1 mt-0.5">
                              <Hash size={12} /> {item.docId}
                            </div>

                            {/* Meta compacta visible en md (porque ocultamos columnas). En lg se oculta. */}
                            <div className="mt-2 space-y-1 lg:hidden">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-slate-600">Tipo:</span>
                                <Badge type={item.type} />
                              </div>

                              <div className="text-sm text-slate-700">
                                <span className="font-semibold text-slate-600">Vigencia:</span>{" "}
                                <span className="font-semibold">
                                  {item.start} al {item.end}
                                </span>
                              </div>

                              <div className="text-sm text-slate-700">
                                <span className="font-semibold text-slate-600">Distrito:</span>{" "}
                                <span className="inline-flex text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                  {item.district}
                                </span>
                              </div>

                              <div className="text-sm text-slate-400">Reg: {item.created_at}</div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Columnas completas solo en lg+ */}
                      <td className="hidden lg:table-cell px-4 lg:px-6 py-4 text-center align-top">
                        <Badge type={item.type} />
                      </td>

                      <td className="hidden lg:table-cell px-4 lg:px-6 py-4 align-top">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700 text-sm">
                            {item.start} al {item.end}
                          </span>
                          <span className="text-sm text-slate-400 mt-0.5">Reg: {item.created_at}</span>
                        </div>
                      </td>

                      <td className="hidden lg:table-cell px-4 lg:px-6 py-4 text-center align-top">
                        <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                          {item.district}
                        </span>
                      </td>

                      <td className="px-4 lg:px-6 py-4 text-right align-top">
                        <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openDetailModal(item)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Ver Detalle"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded disabled:opacity-40"
                            title="Editar"
                            disabled={!isAuthorized}
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(item)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-40"
                            title="Eliminar"
                            disabled={!isAuthorized}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {!hasRows && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-base">
                      {listLoading ? "Buscando..." : "Sin registros para los filtros actuales."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overlay de carga */}
        {listLoading && (
          <div className="absolute inset-0 bg-white/65 backdrop-blur-[1px] flex items-center justify-center">
            <div className="px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-600 text-sm shadow-sm">
              Cargando...
            </div>
          </div>
        )}
      </div>

      {/* Footer paginación (responsive) */}
      <div className="px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-sm font-medium text-slate-500">
        <span>
          Registro {fromRecord}-{toRecord} de {total}
        </span>

        <div className="flex flex-wrap items-center gap-2 justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <span>Filas por página:</span>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:border-slate-400 text-sm"
              disabled={listLoading}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="hidden sm:block w-px h-5 bg-slate-300 mx-2" />

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange("prev")}
              className="p-1.5 hover:text-slate-800 disabled:opacity-50"
              disabled={offset <= 0 || listLoading}
              aria-label="Anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => handlePageChange("next")}
              className="p-1.5 hover:text-slate-800 disabled:opacity-50"
              disabled={offset + limit >= total || listLoading}
              aria-label="Siguiente"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {listError && <div className="px-6 py-2 bg-red-50 border-t border-red-100 text-red-700 text-sm">{listError}</div>}
    </div>
  )
})

export default DataTable
