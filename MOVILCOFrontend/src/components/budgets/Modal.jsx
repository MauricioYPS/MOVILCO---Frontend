import React from "react";
import { X } from "lucide-react";
import { clsx } from "./budgetUtils";

export default function Modal({ title, onClose, children, maxW = "max-w-4xl" }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={clsx("bg-white rounded-xl shadow-2xl w-full flex flex-col max-h-[85vh] border border-slate-100", maxW)}>
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-full transition-colors" aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 bg-white">{children}</div>
      </div>
    </div>
  );
}
