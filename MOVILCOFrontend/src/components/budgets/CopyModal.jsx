import React from "react";
import { Copy, Loader2 } from "lucide-react";
import Modal from "./Modal";

export default function CopyModal({ open, onClose, period, onCopy, loading, error, result }) {
  if (!open) return null;

  return (
    <Modal title="Copiar presupuestos desde el mes anterior" onClose={onClose} maxW="max-w-3xl">
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          Esta accion crea presupuestos en <span className="font-bold">{period}</span> para usuarios que tenian presupuesto en el mes anterior pero no lo tienen en el periodo actual.
          Se insertan como <span className="font-bold">DRAFT</span>.
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs p-3">
            <div className="font-bold">Error</div>
            <div className="mt-1">{error}</div>
          </div>
        )}

        {result && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm p-4">
            <div className="font-extrabold">Resultado</div>
            <div className="mt-1 text-xs font-mono">
              from={result.from_period || ""} | to={result.to_period || ""} | inserted={result.inserted ?? result.count ?? 0}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold"
          >
            Cancelar
          </button>

          <button
            onClick={onCopy}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Copy size={16} />}
            Ejecutar copia
          </button>
        </div>
      </div>
    </Modal>
  );
}
