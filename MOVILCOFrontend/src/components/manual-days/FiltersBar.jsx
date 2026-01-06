import React from "react";
import { Search, MapPin, Users, Calendar } from "lucide-react";

const monthNames = Array.from({ length: 12 }, (_, i) => {
  const label = new Date(0, i).toLocaleString("es", { month: "long" });
  return label.charAt(0).toUpperCase() + label.slice(1);
});

export default function FiltersBar({
  year,
  month,
  onYearChange,
  onMonthChange,
  searchTerm,
  onSearchChange,
  directionFilter,
  onDirectionChange,
  coordinatorFilter,
  onCoordinatorChange,
  directions,
  coordinators,
  loading
}) {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 4 }, (_, idx) => currentYear - 1 + idx);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="w-full xl:col-span-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Buscar asesor
          </label>
          <div className="relative group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Nombre, cedula o correo..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all placeholder:text-slate-400"
              disabled={loading}
            />
            <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
          </div>
        </div>

        <div className="w-full">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Direccion
          </label>
          <div className="relative">
            <select
              value={directionFilter}
              onChange={(e) => onDirectionChange(e.target.value)}
              className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-red-500 outline-none cursor-pointer appearance-none shadow-sm hover:border-slate-300 disabled:opacity-70"
              disabled={loading}
            >
              <option value="Todos">Todas</option>
              {directions.map((dir) => (
                <option key={dir} value={dir}>
                  {dir}
                </option>
              ))}
            </select>
            <MapPin size={16} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="w-full">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Coordinacion
          </label>
          <div className="relative">
            <select
              value={coordinatorFilter}
              onChange={(e) => onCoordinatorChange(e.target.value)}
              className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-red-500 outline-none cursor-pointer appearance-none shadow-sm hover:border-slate-300 disabled:opacity-70"
              disabled={loading}
            >
              <option value="Todos">Todas</option>
              {coordinators.map((coord) => (
                <option key={coord} value={coord}>
                  {coord}
                </option>
              ))}
            </select>
            <Users size={16} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="w-full sm:col-span-2 xl:col-span-1">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Periodo
          </label>
          <div className="flex items-center bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 p-1.5 transition-colors">
            <select
              value={year}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="bg-transparent text-base font-bold text-slate-700 py-1.5 px-3 outline-none cursor-pointer disabled:opacity-70"
              disabled={loading}
            >
              {yearOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="w-px h-6 bg-slate-300 mx-1" />
            <select
              value={month}
              onChange={(e) => onMonthChange(Number(e.target.value))}
              className="bg-transparent text-base font-bold text-slate-700 py-1.5 px-3 outline-none cursor-pointer disabled:opacity-70"
              disabled={loading}
            >
              {monthNames.map((label, idx) => {
                const value = idx + 1;
                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
            <Calendar size={16} className="ml-auto mr-3 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
