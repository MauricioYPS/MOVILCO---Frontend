import React from "react";
import Modal from "./Modal";
import { AlertOctagon, Edit3, Lock, Unlock, UserCheck } from "lucide-react";
import { clsx } from "./budgetUtils";

function RoleCard({
  title,
  description,
  node,
  editAllowed,
  detectedUser,
  userId,
  amount,
  onUserIdChange,
  onAmountChange,
  onRequestEnable,
  onDisable,
  warning,
}) {
  const disabled = !node;
  const hasUser = !!detectedUser?.id;

  return (
    <div
      className={clsx(
        "p-4 sm:p-5 rounded-xl border shadow-sm bg-white flex flex-col gap-3",
        disabled ? "opacity-60" : ""
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Texto: permitir truncado correcto */}
        <div className="min-w-0">
          {/* label */}
          <p className="text-[11px] sm:text-xs font-bold uppercase text-slate-400 tracking-wide">
            {title}
          </p>

          {/* título principal */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight truncate">
            {node?.name || "Seleccione una opcion"}
          </h3>

          {/* descripción */}
          <p className="text-sm sm:text-[15px] text-slate-500 mt-1 leading-snug">
            {description}
          </p>

          {hasUser ? (
            <p className="text-xs sm:text-sm text-slate-600 mt-2 inline-flex items-center gap-2 min-w-0">
              <UserCheck size={16} className="text-emerald-600 shrink-0" />
              <span className="shrink-0">Usuario detectado:</span>
              <span className="font-mono font-bold text-slate-800 shrink-0">
                ID {detectedUser.id}
              </span>
              <span className="text-slate-500 truncate min-w-0">
                ({detectedUser.name || "Sin nombre"})
              </span>
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-amber-700 mt-2 inline-flex items-center gap-2">
              <Lock size={14} className="shrink-0" /> Sin usuario asociado en este nodo
            </p>
          )}
        </div>

        {/* Botones: evitar que colapsen */}
        <div className="flex items-center gap-2 shrink-0">
          {editAllowed ? (
            <button
              onClick={onDisable}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold"
            >
              <Lock size={16} /> Bloquear
            </button>
          ) : (
            <button
              onClick={onRequestEnable}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-sm font-bold text-amber-800 disabled:opacity-60"
              disabled={disabled || !hasUser}
            >
              <Unlock size={16} /> Desbloquear edicion
            </button>
          )}
        </div>
      </div>

      {editAllowed && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] sm:text-xs font-bold uppercase text-slate-400 tracking-wide">
              Usuario (ID) asociado
            </label>
            <input
              editAllowed={disabled}
              value={userId}
              onChange={(e) => onUserIdChange(e.target.value)}
              placeholder="Ej: 12345"
              className="border border-slate-200 rounded-lg px-3 py-2 text-base font-mono outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] sm:text-xs font-bold uppercase text-slate-400 tracking-wide">
              Presupuesto
            </label>
            <input
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              inputMode="numeric"
              placeholder="Presupuesto"
              className="border border-slate-200 rounded-lg px-3 py-2 text-base font-semibold outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {warning && (
            <div className="md:col-span-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 inline-flex items-start gap-2">
              <AlertOctagon size={16} className="shrink-0 mt-0.5" /> {warning}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LeadershipBudgetPanel({
  gerenciaNode,
  direccionNode,
  gerenciaEditAllowed,
  direccionEditAllowed,
  detectedGerenciaUser,
  detectedDireccionUser,
  gerenciaUserId,
  direccionUserId,
  gerenciaAmount,
  direccionAmount,
  onGerenciaUserId,
  onDireccionUserId,
  onGerenciaAmount,
  onDireccionAmount,
  onRequestAllowGerencia,
  onRequestAllowDireccion,
  onDisableGerencia,
  onDisableDireccion,
  confirmRole,
  onConfirmRole,
  onCancelConfirm,
}) {
  const confirmTitle =
    confirmRole === "GERENCIA" ? "Editar presupuesto de GERENCIA" : "Editar presupuesto de DIRECCION";

  const confirmDescription =
    confirmRole === "GERENCIA"
      ? "Estas a punto de modificar presupuesto de una gerencia completa. Asegurate de que los montos y el usuario sean correctos."
      : "Estas a punto de modificar presupuesto de una direccion. Verifica montos y usuario antes de guardar.";

  return (
    <>
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs uppercase font-bold text-slate-400 tracking-wide">
              Roles gerenciales
            </p>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              Presupuestos de Gerencia y Direccion
            </h3>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 shrink-0">
            <UserCheck size={16} /> Edicion protegida
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RoleCard
            title="Gerencia seleccionada"
            description="Editar presupuesto para el rol de gerencia."
            node={gerenciaNode}
            editAllowed={gerenciaEditAllowed}
            detectedUser={detectedGerenciaUser}
            userId={gerenciaUserId}
            amount={gerenciaAmount}
            onUserIdChange={onGerenciaUserId}
            onAmountChange={onGerenciaAmount}
            onRequestEnable={() => onRequestAllowGerencia()}
            onDisable={onDisableGerencia}
          />

          <RoleCard
            title="Direccion seleccionada"
            description="Editar presupuesto para el rol de direccion."
            node={direccionNode}
            editAllowed={direccionEditAllowed}
            detectedUser={detectedDireccionUser}
            userId={direccionUserId}
            amount={direccionAmount}
            onUserIdChange={onDireccionUserId}
            onAmountChange={onDireccionAmount}
            onRequestEnable={() => onRequestAllowDireccion()}
            onDisable={onDisableDireccion}
          />
        </div>
      </section>

      {confirmRole && (
        <Modal title={confirmTitle} onClose={onCancelConfirm} maxW="max-w-lg">
          <div className="space-y-4">
            <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 p-3 text-sm flex items-start gap-2">
              <AlertOctagon size={18} className="mt-0.5" />
              <div>
                <div className="font-bold">Accion sensible</div>
                <p className="text-sm mt-1">{confirmDescription}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={onCancelConfirm}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold"
              >
                Cancelar
              </button>

              <button
                onClick={onConfirmRole}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold"
              >
                <Edit3 size={16} /> Habilitar edicion
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
