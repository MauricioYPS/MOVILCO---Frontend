import React from "react";
import { AlertOctagon, Loader2, Save, Target, Users } from "lucide-react";
import { formatMoneyCOP } from "./budgetUtils";

export default function BudgetKpiGrid({ kpiPeople = 0, kpiTotalBudget = 0, kpiMissing = 0, dirtyCount = 0, saving = false, onSave, canSave }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
          <Users size={20} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Usuarios visibles</p>
          <h3 className="text-xl font-extrabold text-slate-800">{kpiPeople}</h3>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
          <Target size={20} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total presupuestos</p>
          <h3 className="text-lg md:text-xl font-extrabold text-slate-800">{formatMoneyCOP(kpiTotalBudget)}</h3>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${kpiMissing > 0 ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-400"}`}>
          <AlertOctagon size={20} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Pendientes</p>
          <h3 className={`text-xl font-extrabold ${kpiMissing > 0 ? "text-red-600" : "text-slate-800"}`}>{kpiMissing}</h3>
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={!canSave}
        className="bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold shadow-md transition-all flex flex-col items-center justify-center gap-1 active:scale-[0.99] py-4"
      >
        {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
        <span className="text-xs">Guardar cambios ({dirtyCount})</span>
      </button>
    </section>
  );
}
