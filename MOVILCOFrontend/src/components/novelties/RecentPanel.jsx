import React from "react";
import { Clock, RefreshCw } from "lucide-react";
import Badge from "./common/Badge";

const RecentPanel = React.memo(function RecentPanel({ loading, items, onRefresh }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
          <Clock size={16} className="text-slate-400" /> Recientes (3 días)
        </h3>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-slate-400 hover:text-red-600 transition-colors disabled:opacity-60"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {loading && <div className="p-4 text-center text-slate-400 text-xs">Cargando...</div>}
        {!loading &&
          items.map((nov) => (
            <div key={nov.id} className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer border-l-2 border-transparent hover:border-red-600">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{nov.dates || "Sin fecha"}</span>
                <div className={`w-2 h-2 rounded-full ${nov.status === "Active" ? "bg-emerald-500" : nov.status === "Pending" ? "bg-amber-500" : "bg-slate-300"}`} />
              </div>
              <p className="font-bold text-slate-800 text-sm mb-1 group-hover:text-red-700 transition-colors">{nov.user}</p>
              <Badge type={nov.type} size="sm" />
            </div>
          ))}
        {!loading && items.length === 0 && <div className="p-8 text-center text-slate-400 text-xs">Sin actividad reciente.</div>}
      </div>
    </div>
  );
});

export default RecentPanel;
