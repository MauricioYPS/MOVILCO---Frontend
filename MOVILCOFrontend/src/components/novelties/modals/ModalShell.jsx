import React from "react";
import { X } from "lucide-react";

const ModalShell = ({ title, onClose, children, footer, size = "md" }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
    <div className={`bg-white rounded-lg shadow-2xl flex flex-col max-h-[90vh] w-full ${size === "lg" ? "max-w-2xl" : "max-w-lg"}`}>
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-lg">
        <div>
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Gestion de Novedades RH</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">{children}</div>
      {footer && <div className="px-6 py-4 border-t border-slate-100 bg-white rounded-b-lg flex justify-end gap-3">{footer}</div>}
    </div>
  </div>
);

export default ModalShell;
