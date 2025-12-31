import React from "react";
import { Calendar, CheckCircle2, CreditCard, Trash2, Edit3, MapPin, User } from "lucide-react";
import Badge from "../common/Badge";
import ModalShell from "./ModalShell";

const DetailModal = ({ detailData, loading, isAuthorized, onClose, onEdit, onDelete }) => {
  if (!detailData) return null;
  
  return (
    <ModalShell title={`Detalle: ${detailData.id || ""}`} onClose={onClose}>
      <div className="space-y-6">
        {loading && <div className="text-sm text-slate-500 bg-slate-100 border border-slate-200 rounded-md p-3">Cargando detalle...</div>}
        <div className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded flex items-center justify-center font-bold text-xl border border-slate-200">
            {detailData.name?.charAt(0) || "?"}
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900">{detailData.name}</h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-mono">
                <CreditCard size={12} /> {detailData.docId}
              </span>
              <span className="w-px h-3 bg-slate-300"></span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-500" /> Activo
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              {detailData.role && (
                <span className="flex items-center gap-1">
                  <User size={12} /> {detailData.role}
                </span>
              )}
              {detailData.userId && (
                <span className="flex items-center gap-1 font-mono text-slate-600">
                  ID usuario: {detailData.userId}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Categoria</span>
            <Badge type={detailData.type} />
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Ubicacion</span>
            <div className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {detailData.district}
              </span>
              {detailData.regional && <span className="text-xs text-slate-500">Regional: {detailData.regional}</span>}
            </div>
          </div>
          <div className="col-span-2 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
            <Calendar size={20} className="text-blue-600" />
            <div>
              <span className="block text-[10px] font-bold text-blue-800 uppercase">Periodo Efectivo</span>
              <span className="text-sm font-bold text-blue-900">
                {detailData.start} <span className="mx-1 text-blue-400">hasta</span> {detailData.end}
              </span>
            </div>
          </div>
          </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Notas Registradas</span>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 italic">"{detailData.notes}"</div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
          {detailData.created_at && (
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Creado</span>
              <span className="font-semibold text-slate-700">{detailData.created_at}</span>
            </div>
          )}
          {detailData.updated_at && (
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Actualizado</span>
              <span className="font-semibold text-slate-700">{detailData.updated_at}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={() => onDelete(detailData)}
            className="flex-1 py-2.5 border border-red-200 text-red-700 font-bold rounded-md text-sm hover:bg-red-50 flex justify-center gap-2 transition-colors"
            disabled={!isAuthorized}
          >
            <Trash2 size={16} /> Eliminar Registro
          </button>
          <button
            onClick={() => onEdit(detailData)}
            className="flex-1 py-2.5 bg-slate-800 text-white font-bold rounded-md text-sm hover:bg-slate-900 flex justify-center gap-2 transition-colors shadow-sm disabled:opacity-60"
            disabled={!isAuthorized}
          >
            <Edit3 size={16} /> Modificar Datos
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default DetailModal;
