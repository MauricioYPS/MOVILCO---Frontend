import React from "react";
import { clsx } from "./budgetUtils";

const BADGE_STYLES = {
  GERENCIA: "bg-slate-900 text-white border-slate-900",
  DIRECCION: "bg-purple-50 text-purple-700 border-purple-200",
  COORDINACION: "bg-blue-50 text-blue-700 border-blue-200",
  ASESORIA: "bg-slate-50 text-slate-600 border-slate-200",
  ASIGNADO: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-100",
  PENDIENTE: "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-100",
  DRAFT: "bg-amber-50 text-amber-700 border-amber-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CLOSED: "bg-slate-100 text-slate-600 border-slate-200",
  DEFAULT: "bg-slate-50 text-slate-600 border-slate-200",
};

export default function Badge({ variant = "", children }) {
  const styles = BADGE_STYLES[variant] || BADGE_STYLES.DEFAULT;
  return (
    <span className={clsx("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border", styles)}>
      {children || variant || "N/D"}
    </span>
  );
}
