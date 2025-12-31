import React from "react";
import { AlertTriangle, CreditCard, Hash, Save, Search, User } from "lucide-react";
import Badge from "../common/Badge";
import ModalShell from "./ModalShell";

const CreateEditModal = ({
  modalType,
  onClose,
  mutationLoading,
  formData,
  setFormData,
  noveltyOptions,
  identifyMode,
  setIdentifyMode,
  identifier,
  setIdentifier,
  formError,
  conflictError,
  onSubmit
}) => {
  return (
    <ModalShell
      title={modalType === "create" ? "Nueva Novedad" : "Editar Registro"}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            disabled={mutationLoading}
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={mutationLoading}
            className="px-6 py-2 bg-red-700 text-white rounded-md text-sm font-bold hover:bg-red-800 shadow-sm flex items-center gap-2 transition-colors disabled:opacity-60"
          >
            <Save size={16} /> {mutationLoading ? "Guardando..." : "Guardar Registro"}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {modalType === "create" && (
          <div className="bg-white p-1 rounded-lg border border-slate-200">
            <div className="grid grid-cols-3 gap-1 mb-3 bg-slate-100 p-1 rounded-md">
              {[
                { key: "document_id", label: "Cedula", icon: <CreditCard size={12} /> },
                { key: "user_id", label: "ID Interno", icon: <Hash size={12} /> },
                { key: "name", label: "Nombre", icon: <User size={12} /> }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setIdentifyMode(tab.key);
                    setIdentifier("");
                  }}
                  className={`text-xs font-bold py-1.5 rounded flex items-center justify-center gap-2 transition-all ${
                    identifyMode === tab.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="px-3 pb-3">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                {identifyMode === "document_id" && "Documento de Identidad"}
                {identifyMode === "user_id" && "ID Interno"}
                {identifyMode === "name" && "Nombre Completo"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    identifyMode === "document_id"
                      ? "Ej: 1.098.765.432"
                      : identifyMode === "user_id"
                      ? "Ej: 1024"
                      : "Ej: Carlos Perez"
                  }
                  className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                />
                <Search size={16} className="absolute right-3 top-2.5 text-slate-400" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Tipo de Novedad</label>
            <select
              value={formData.novelty_type}
              onChange={(e) => setFormData((prev) => ({ ...prev, novelty_type: e.target.value }))}
              className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none cursor-pointer"
            >
              {noveltyOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Inicio</label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData((prev) => ({ ...prev, start_date: e.target.value }))}
              className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Fin</label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData((prev) => ({ ...prev, end_date: e.target.value }))}
              className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Observaciones</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none resize-none placeholder:text-slate-400"
              placeholder="Justificacion o detalles adicionales..."
            ></textarea>
          </div>
        </div>

        {formError && <div className="bg-red-50 border border-red-100 rounded-md p-3 text-sm text-red-700">{formError}</div>}

        {conflictError && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <div className="flex gap-3">
              <div className="p-2 bg-amber-100 rounded text-amber-700 h-fit">
                <AlertTriangle size={18} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-amber-900">Conflicto de Fechas (Overlap)</h4>
                <p className="text-xs text-amber-800 mt-1 mb-2">El rango seleccionado se superpone con registros existentes:</p>

                <div className="space-y-2">
                  {conflictError.overlaps.map((ov, i) => (
                    <div key={`${ov.start}-${ov.end}-${i}`} className="flex items-center justify-between bg-white/80 p-2 rounded border border-amber-200/50 text-xs">
                      <div className="flex items-center gap-2">
                        <Badge type={ov.type} size="sm" />
                        <span className="font-mono text-amber-900 font-medium">
                          {ov.start} - {ov.end}
                        </span>
                      </div>
                      <span className="text-amber-700/70 italic truncate max-w-[150px]">{ov.notes}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
};

export default CreateEditModal;
