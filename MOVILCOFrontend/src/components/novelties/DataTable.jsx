import React, { useMemo } from "react";
import { Hash, Eye, Edit3, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Badge from "./common/Badge";

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
  // Para evitar saltos si allNovelties queda vacío durante loading por culpa del slice,
  // podrías cachear el último listado no vacío aquí (opcional).
  // Pero con overlay + min-height ya queda muy estable.
  const hasRows = allNovelties?.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* wrapper relativo para overlay */}
      <div className="relative">
        <div className="overflow-x-auto">
          {/* min-h para evitar colapso */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                <th className="px-6 py-4">Empleado / ID</th>
                <th className="px-6 py-4 text-center">Tipo</th>
                <th className="px-6 py-4">Vigencia</th>
                <th className="px-6 py-4 text-center">Distrito</th>
                <th className="px-6 py-4 text-right">Control</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {hasRows &&
                allNovelties.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
                          {item.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{item.name}</div>
                          <div className="text-xs text-slate-400 font-mono tracking-tight flex items-center gap-1">
                            <Hash size={10} /> {item.docId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge type={item.type} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700 text-xs">
                          {item.start} al {item.end}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Reg: {item.created_at}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        {item.district}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openDetailModal(item)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Ver Detalle"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded"
                          title="Editar"
                          disabled={!isAuthorized}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Eliminar"
                          disabled={!isAuthorized}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {/* Empty state se mantiene, pero NO lo uses como loading */}
              {!hasRows && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm">
                    {listLoading ? "Buscando..." : "Sin registros para los filtros actuales."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Overlay de carga para no colapsar la tabla */}
        {listLoading && (
          <div className="absolute inset-0 bg-white/65 backdrop-blur-[1px] flex items-center justify-center">
            <div className="px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-600 text-sm shadow-sm">
              Cargando...
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs font-medium text-slate-500">
        <span>
          Registro {fromRecord}-{toRecord} de {total}
        </span>
        <div className="flex items-center gap-2">
          <span>Filas por página:</span>
          <select
            value={limit}
            onChange={(e) => handleLimitChange(e.target.value)}
            className="bg-white border border-slate-300 rounded px-1 py-0.5 outline-none focus:border-slate-400"
            disabled={listLoading}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <div className="w-px h-4 bg-slate-300 mx-2"></div>
          <button
            onClick={() => handlePageChange("prev")}
            className="hover:text-slate-800 disabled:opacity-50"
            disabled={offset <= 0 || listLoading}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => handlePageChange("next")}
            className="hover:text-slate-800 disabled:opacity-50"
            disabled={offset + limit >= total || listLoading}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {listError && (
        <div className="px-6 py-2 bg-red-50 border-t border-red-100 text-red-700 text-xs">
          {listError}
        </div>
      )}
    </div>
  );
});

export default DataTable;
