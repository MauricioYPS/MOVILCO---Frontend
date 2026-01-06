import React, { useEffect, useState } from "react";
import { AlertTriangle, Hash, Loader2, Mail, Save, Trash2, X } from "lucide-react";
import { getDaysInMonth } from "./manualDaysUtils";

const ModalShell = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
    {/* Panel */}
    <div
      className="
        bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-slate-100 overflow-hidden
        flex flex-col
        max-h-[92vh] sm:max-h-[90vh]
      "
      role="dialog"
      aria-modal="true"
    >
      {/* Header fijo */}
      <div className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 border-b border-slate-100 flex justify-between items-start bg-white">
        <div className="min-w-0 pr-3">
          <h3 className="font-extrabold text-base sm:text-lg md:text-xl text-slate-800 tracking-tight truncate">
            {title}
          </h3>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors shrink-0"
          aria-label="Cerrar modal"
        >
          <X size={20} className="sm:hidden" />
          <X size={22} className="hidden sm:block" />
        </button>
      </div>

      {/* Contenido scrolleable */}
      <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 bg-white">
        {children}
      </div>
    </div>
  </div>
);

export default function EditManualDaysModal({
  user,
  year,
  month,
  manualRecord,
  onClose,
  onSave,
  onDelete,
  saving,
  deleting,
  error
}) {
  const [value, setValue] = useState(manualRecord?.dias ?? manualRecord?.days ?? "");
  const daysInMonth = getDaysInMonth(year, month);

  useEffect(() => {
    setValue(manualRecord?.dias ?? manualRecord?.days ?? "");
  }, [manualRecord]);

  const handleSave = () => {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue) || numberValue < 0 || numberValue > 31) {
      alert("Ingrese un numero de dias valido (0-31).");
      return;
    }
    onSave(numberValue);
  };

  return (
    <ModalShell title="Ajuste manual de dias" onClose={onClose}>
      <div className="space-y-5 sm:space-y-7">
        {/* Tarjeta usuario: en mobile es vertical, en sm+ horizontal */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-extrabold text-slate-700 shadow-sm border-2 border-white shrink-0">
              {(user?.name || "?").charAt(0)}
            </div>

            {/* En mobile mostramos nombre cerca del avatar para evitar “salto” */}
            <div className="min-w-0 sm:hidden">
              <h4 className="font-extrabold text-base text-slate-900 leading-tight truncate">
                {user?.name || "Sin nombre"}
              </h4>
              <div className="mt-1 text-xs text-slate-500 flex items-center gap-2 min-w-0">
                <span className="flex items-center gap-1 font-mono whitespace-nowrap">
                  <Hash size={13} /> {user?.documentId || "N/D"}
                </span>
              </div>
            </div>
          </div>

          {/* En sm+ mostramos bloque completo a la derecha */}
          <div className="flex-1 min-w-0 hidden sm:block">
            <h4 className="font-extrabold text-lg md:text-xl text-slate-900 leading-tight truncate">
              {user?.name || "Sin nombre"}
            </h4>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-2 min-w-0">
              <span className="flex items-center gap-1.5 font-mono whitespace-nowrap">
                <Hash size={16} /> {user?.documentId || "N/D"}
              </span>
              <span className="flex items-center gap-1.5 min-w-0">
                <Mail size={16} className="shrink-0" />
                <span className="truncate">{user?.email || "N/D"}</span>
              </span>
            </div>
          </div>

          {/* Email en mobile debajo, para que no fuerce horizontal */}
          <div className="sm:hidden text-xs text-slate-500 flex items-center gap-1.5 min-w-0">
            <Mail size={13} className="shrink-0" />
            <span className="truncate">{user?.email || "N/D"}</span>
          </div>
        </div>

        {/* Input días */}
        <div>
          <label className="block text-xs sm:text-sm font-extrabold text-slate-600 uppercase tracking-wide mb-2 sm:mb-3">
            Días laborados (periodo {year}-{String(month).padStart(2, "0")})
          </label>

          <div className="relative">
            <input
              type="number"
              min="0"
              max="31"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={String(daysInMonth)}
              className="
                w-full pl-4 pr-16 py-3.5 sm:pl-5 sm:pr-16 sm:py-4
                bg-white border-2 border-slate-300 rounded-xl
                text-2xl sm:text-3xl font-extrabold text-slate-800
                focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all
                placeholder:text-slate-300
              "
              autoFocus
              disabled={saving || deleting}
              inputMode="numeric"
            />
            <span className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-[11px] sm:text-sm font-extrabold text-slate-400 bg-slate-100 px-2 py-1 rounded">
              DÍAS
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 sm:mt-3">
            Referencia días del mes:{" "}
            <strong className="text-slate-800">{daysInMonth}</strong>
          </p>
        </div>

        {/* Warning: compacto en mobile */}
        <div className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 sm:gap-4 items-start">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0">
            <AlertTriangle size={18} className="sm:hidden" />
            <AlertTriangle size={20} className="hidden sm:block" />
          </div>
          <div className="min-w-0">
            <h5 className="text-xs sm:text-sm font-extrabold text-amber-900 mb-1">
              Sobrescribe el cálculo automático
            </h5>
            <p className="text-xs sm:text-sm text-amber-800/80 leading-relaxed">
              El valor que guardes reemplaza el cálculo automático del periodo para este usuario.
            </p>
          </div>
        </div>

        {/* Error */}
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {/* Footer responsive:
            - Mobile: botones a ancho completo y en columna
            - Sm+: fila normal
        */}
        <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          {/* Izquierda: eliminar */}
          <div className="sm:min-w-[220px]">
            {manualRecord?.id ? (
              <button
                onClick={onDelete}
                disabled={deleting || saving}
                className="
                  text-red-600 hover:text-red-800 text-sm font-extrabold
                  flex items-center gap-2 hover:bg-red-50 px-3 py-2 rounded-lg
                  transition-colors disabled:opacity-70
                  w-full sm:w-auto justify-center sm:justify-start
                "
              >
                {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                Eliminar ajuste manual
              </button>
            ) : (
              <div />
            )}
          </div>

          {/* Derecha: acciones */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onClose}
              disabled={saving || deleting}
              className="
                px-5 py-3 border border-slate-300 text-slate-700 font-extrabold rounded-xl text-sm
                hover:bg-slate-50 hover:text-slate-800 transition-colors disabled:opacity-70
                w-full sm:w-auto
              "
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              disabled={saving || deleting}
              className="
                px-6 py-3 bg-[#C62828] text-white font-extrabold rounded-xl text-sm
                hover:bg-[#b02222] shadow-lg shadow-red-200
                flex items-center justify-center gap-2
                disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.99]
                w-full sm:w-auto
              "
            >
              {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              Guardar ajuste
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
