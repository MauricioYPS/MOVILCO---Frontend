import React from "react";
import { Calendar, ChevronDown, RefreshCw, Users, Building2, Landmark } from "lucide-react";
import Badge from "./Badge";

export default function BudgetFilters({
  period,
  onPeriodChange,
  treeLoading,
  onReloadTree,
  gerencias = [],
  direcciones = [],
  coordinaciones = [],
  selectedGerenciaId,
  selectedDireccionId,
  selectedCoordUnitId,
  onSelectGerencia,
  onSelectDireccion,
  onSelectCoord,
  treeError,
  listError,
  currentCoordNode,
  currentCoordUserId,
}) {
  const errorMessage = treeError || listError;

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="w-full sm:w-auto">
            <label className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
              Periodo
            </label>
            <div className="relative">
              <input
                type="month"
                value={period}
                onChange={(e) => onPeriodChange(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-base font-bold text-slate-700 outline-none focus:border-red-500 transition-all cursor-pointer"
              />
              <Calendar size={18} className="absolute left-3 top-3 text-slate-400" />
            </div>
          </div>

          <div className="flex-1 flex items-end justify-start lg:justify-end">
            <button
              onClick={onReloadTree}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold disabled:opacity-70"
              disabled={treeLoading}
            >
              <RefreshCw size={18} className={treeLoading ? "animate-spin" : ""} />
              Refrescar jerarquia
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="min-w-0">
            <label className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase mb-1 block flex items-center gap-1 tracking-wider">
              <Landmark size={14} /> Gerencia
            </label>
            <div className="relative">
              <select
                value={selectedGerenciaId}
                onChange={(e) => onSelectGerencia(e.target.value)}
                className="w-full py-3 pl-3 pr-9 bg-white border border-slate-200 rounded-lg text-base font-medium text-slate-700 focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none cursor-pointer appearance-none"
                disabled={treeLoading}
              >
                <option value="">Todas</option>
                {gerencias.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="min-w-0">
            <label className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase mb-1 block flex items-center gap-1 tracking-wider">
              <Building2 size={14} /> Direccion
            </label>
            <div className="relative">
              <select
                value={selectedDireccionId}
                onChange={(e) => onSelectDireccion(e.target.value)}
                className="w-full py-3 pl-3 pr-9 bg-white border border-slate-200 rounded-lg text-base font-medium text-slate-700 focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none cursor-pointer appearance-none"
                disabled={treeLoading}
              >
                <option value="">{selectedGerenciaId ? "Todas (de la gerencia)" : "Todas"}</option>
                {direcciones.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="min-w-0">
            <label className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase mb-1 block flex items-center gap-1 tracking-wider">
              <Users size={14} /> Coordinacion
            </label>
            <div className="relative">
              <select
                value={selectedCoordUnitId}
                onChange={(e) => onSelectCoord(e.target.value)}
                className="w-full py-3 pl-3 pr-9 bg-white border border-slate-200 rounded-lg text-base font-medium text-slate-700 focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none cursor-pointer appearance-none"
                disabled={treeLoading}
              >
                <option value="">
                  {selectedDireccionId ? "Seleccione..." : "Seleccione (filtre por direccion para acotar)"}
                </option>
                {coordinaciones.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm p-3">
            <div className="font-bold">Error</div>
            <div className="mt-1">{errorMessage}</div>
          </div>
        )}

        {selectedCoordUnitId && currentCoordNode && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="font-semibold text-slate-700 min-w-0">
                Coordinacion seleccionada:{" "}
                <span className="text-slate-900 font-extrabold truncate inline-block align-bottom max-w-full">
                  {currentCoordNode.name}
                </span>{" "}
                <span className="ml-2 inline-flex align-middle">
                  <Badge variant="COORDINACION" />
                </span>
              </div>

              <div className="text-slate-600 min-w-0">
                Usuario coordinador asociado:{" "}
                <span className={`font-bold ${currentCoordUserId ? "text-emerald-700" : "text-red-700"}`}>
                  {currentCoordUserId
                    ? `${currentCoordNode.coordinator_user?.name || "COORDINADOR"} (ID: ${currentCoordUserId})`
                    : "NO ASOCIADO"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
