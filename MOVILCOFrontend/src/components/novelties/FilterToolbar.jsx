import React, { useEffect, useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";

const FilterToolbar = React.memo(function FilterToolbar({ listLoading, onApply, initialFilters }) {
  const [searchValue, setSearchValue] = useState(initialFilters.q || "");
  const [dateFrom, setDateFrom] = useState(initialFilters.dateFrom || "");
  const [dateTo, setDateTo] = useState(initialFilters.dateTo || "");

  // Sync cuando el store cambia filtros externamente
  useEffect(() => {
    setSearchValue(initialFilters.q || "");
    setDateFrom(initialFilters.dateFrom || "");
    setDateTo(initialFilters.dateTo || "");
  }, [initialFilters.q, initialFilters.dateFrom, initialFilters.dateTo]);

  // Debounce
  useEffect(() => {
    const next = { q: searchValue.trim(), dateFrom, dateTo };

    const handler = setTimeout(() => {
      onApply(next);
    }, 250);

    return () => clearTimeout(handler);
  }, [searchValue, dateFrom, dateTo, onApply]);

  const triggerApply = () => onApply({ q: searchValue.trim(), dateFrom, dateTo });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-1 flex flex-col md:flex-row gap-1 ">
      <div className="flex-1 relative">
        <Search size={16} className="absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, documento o ID..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              triggerApply();
            }
          }}
          className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-slate-700 focus:bg-slate-50 outline-none rounded-md transition-colors font-medium placeholder:text-slate-400"
        />
      </div>
      <div className="h-auto w-px bg-slate-200 mx-1 hidden md:block"></div>
      <div className="flex items-center gap-2 p-1">
        <div className="relative">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded px-3 py-2 outline-none focus:border-red-500 hover:bg-slate-100 transition-colors cursor-pointer"
          />
        </div>
        <span className="text-slate-300">-</span>
        <div className="relative">
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded px-3 py-2 outline-none focus:border-red-500 hover:bg-slate-100 transition-colors cursor-pointer"
          />
        </div>
        <button
          onClick={triggerApply}
          className="p-2 bg-slate-800 text-white rounded hover:bg-slate-900 transition-colors shadow-sm"
          disabled={listLoading}
          title={listLoading ? "Cargando..." : "Aplicar filtros"}
        >
          <Filter size={16} />
        </button>
      </div>
    </div>
  );
});

export default FilterToolbar;
