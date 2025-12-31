import React from "react";
import { AlertCircle } from "lucide-react";
import ModalShell from "./ModalShell";

const DeleteModal = ({ mutationLoading, onClose, onConfirm }) => (
  <ModalShell title="Confirmar Eliminacion" onClose={onClose} size="md">
    <div className="text-center py-6">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle size={32} />
      </div>
      <h3 className="text-xl font-bold text-slate-900">¿Eliminar definitivamente?</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
        Esta accion eliminara el registro de la base de datos y recalculara los reportes asociados. No se puede deshacer.
      </p>

      <div className="flex gap-3 mt-8 justify-center">
        <button
          onClick={onClose}
          className="px-6 py-2.5 border border-slate-300 rounded-md text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          disabled={mutationLoading}
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={mutationLoading}
          className="px-6 py-2.5 bg-red-700 text-white rounded-md text-sm font-bold hover:bg-red-800 shadow-md shadow-red-200 transition-colors disabled:opacity-60"
        >
          {mutationLoading ? "Eliminando..." : "Confirmar y Eliminar"}
        </button>
      </div>
    </div>
  </ModalShell>
);

export default DeleteModal;
