import React from "react";
import { RefreshCw } from "lucide-react";
import Badge from "./Badge";
import Modal from "./Modal";

export default function MissingModal({ open, onClose, period, onRefresh, loading, error, rows = [] }) {
  if (!open) return null;

  return (
    <Modal title={`Faltantes de presupuesto - ${period}`} onClose={onClose} maxW="max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="text-sm text-slate-600 leading-relaxed">
          Lista de usuarios que deberian tener presupuesto (roles COORDINACION/ASESORIA) pero no lo tienen en el periodo.
        </div>

        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold disabled:opacity-70"
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Consultar faltantes
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm p-3 mb-4">
          <div className="font-bold">Error</div>
          <div className="mt-1">{error}</div>
        </div>
      )}

      {!loading && rows.length === 0 && (
        <div className="text-base text-slate-500 py-10 text-center">
          No hay resultados aun. Presiona "Consultar faltantes".
        </div>
      )}

      {loading && <div className="text-base text-slate-500 py-10 text-center">Cargando...</div>}

      {/* Mobile: Cards */}
      {rows.length > 0 && !loading && (
        <>
          <div className="md:hidden space-y-3">
            {rows.map((r) => (
              <div key={r.user_id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-900 text-base truncate">{r.name}</div>
                    <div className="text-sm text-slate-500 font-mono mt-1">ID: {r.user_id}</div>
                  </div>
                  <div className="shrink-0">
                    <Badge variant={r.role} />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500 font-semibold">Org Unit</span>
                    <span className="font-mono text-slate-700">{r.org_unit_id || "N/D"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500 font-semibold">Coordinator Id</span>
                    <span className="font-mono text-slate-700">{r.coordinator_id || "N/D"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500 font-semibold">Activo</span>
                    <span>{r.active ? <Badge variant="ACTIVE" /> : <Badge variant="CLOSED" />}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/Tablet: Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3 text-center">Rol</th>
                  <th className="px-4 py-3">Org Unit</th>
                  <th className="px-4 py-3">Coordinator Id</th>
                  <th className="px-4 py-3 text-center">Activo</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {rows.map((r) => (
                  <tr key={r.user_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 text-base truncate">{r.name}</div>
                        <div className="text-xs text-slate-400 font-mono">ID: {r.user_id}</div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Badge variant={r.role} />
                    </td>

                    <td className="px-4 py-3 font-mono text-sm whitespace-nowrap">{r.org_unit_id || "N/D"}</td>
                    <td className="px-4 py-3 font-mono text-sm whitespace-nowrap">{r.coordinator_id || "N/D"}</td>

                    <td className="px-4 py-3 text-center">
                      {r.active ? <Badge variant="ACTIVE" /> : <Badge variant="CLOSED" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Modal>
  );
}
