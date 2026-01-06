import React from "react";
import { Clock, Search } from "lucide-react";
import Badge from "./Badge";
import { clsx } from "./budgetUtils";

function Avatar({ name }) {
  return (
    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-extrabold text-sm border border-slate-200 shrink-0">
      {(name || "?").trim().charAt(0).toUpperCase()}
    </div>
  );
}

function BudgetInput({ amount, hasBudget, disabled, onChange }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      value={Number.isFinite(amount) ? String(amount) : "0"}
      onChange={onChange}
      disabled={disabled}
      className={clsx(
        "w-28 sm:w-32 md:w-36 text-center font-extrabold text-base rounded-lg py-2 px-2 border outline-none",
        "focus:ring-2 focus:ring-offset-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed",
        hasBudget
          ? "border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-blue-100 bg-white"
          : "border-red-300 bg-red-50 text-red-700 focus:border-red-500 focus:ring-red-100"
      )}
    />
  );
}

export default function BudgetTable({
  selectedCoordUnitId,
  listLoading,
  coordinatorPayload,
  tableRows = [],
  dirty = {},
  search = "",
  onSearchChange,
  onResetDirty,
  dirtyCount = 0,
  onBudgetChange,
  onMarkZero,
}) {
  const disabledAll = listLoading;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex items-center gap-2 text-base sm:text-lg font-extrabold text-slate-800">
          <span className="inline-flex items-center gap-2">
            <Clock size={16} className="text-slate-500" />
            Asignación de presupuesto por usuario
          </span>
          {listLoading && (
            <div className="h-4 w-4 rounded-full border-2 border-slate-200 border-t-slate-500 animate-spin" />
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nombre, documento o email..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-red-500"
            />
          </div>

          <button
            onClick={onResetDirty}
            disabled={dirtyCount === 0}
            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-extrabold disabled:opacity-50"
          >
            Reset cambios
          </button>
        </div>
      </div>

      {/* Estados vacíos */}
      {!selectedCoordUnitId ? (
        <div className="px-4 sm:px-6 py-10 text-center text-slate-500">
          Selecciona una <span className="font-extrabold">Coordinación</span> para cargar sus usuarios y presupuestos.
        </div>
      ) : selectedCoordUnitId && (listLoading || !coordinatorPayload) ? (
        <div className="px-4 sm:px-6 py-10 text-center text-slate-500">
          {listLoading ? "Cargando presupuestos..." : "Sin datos para mostrar."}
        </div>
      ) : (
        <>
          {/* =========================
              DESKTOP (lg+): TABLA REAL
          ========================== */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[1040px] table-fixed text-left border-collapse">
              <colgroup>
                <col style={{ width: "34%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "8%" }} />
              </colgroup>

              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-xs uppercase tracking-wider text-slate-500 font-extrabold">
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4 text-center">Rol</th>
                  <th className="px-6 py-4">Ubicación</th>
                  <th className="px-6 py-4 bg-slate-100/50 border-x border-slate-200 text-center">
                    Presupuesto
                  </th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-center">Acción</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {tableRows.map((row) => {
                  const key = String(row.user_id);
                  const isDirty = dirty[key] != null;
                  const amount = isDirty ? Number(dirty[key]) : Number(row?.budget?.budget_amount || 0);
                  const hasBudget = Number.isFinite(amount) && amount > 0;

                  return (
                    <tr
                      key={`${row.kind}-${row.user_id}`}
                      className={clsx(
                        "transition-colors",
                        isDirty ? "bg-amber-50/40" : "hover:bg-slate-50"
                      )}
                    >
                      {/* Usuario */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar name={row.name} />
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-900 truncate">{row.name}</div>
                            <div className="text-xs text-slate-400 font-mono truncate">
                              ID: {row.user_id} | Doc: {row.document_id || "N/D"} |{" "}
                              {row.active ? "Activo" : "Inactivo"}
                            </div>
                            <div className="text-xs text-slate-400 truncate">{row.email || ""}</div>
                          </div>
                        </div>
                      </td>

                      {/* Rol */}
                      <td className="px-6 py-4 text-center">
                        <Badge variant={row.kind === "COORD" ? "COORDINACION" : "ASESORIA"} />
                      </td>

                      {/* Ubicación */}
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-600 min-w-0">
                          <span className="font-extrabold block text-slate-800 truncate">
                            {row.district_claro || "N/D"}
                          </span>
                          <span className="text-slate-400 block truncate">{row.regional || ""}</span>
                          <span className="text-slate-400 block truncate">{row.cargo || ""}</span>
                        </div>
                      </td>

                      {/* Presupuesto */}
                      <td
                        className={clsx(
                          "px-4 py-3 border-x border-slate-100",
                          isDirty ? "bg-amber-50/20" : "bg-slate-50/30"
                        )}
                      >
                        <div className="flex items-center justify-center">
                          <BudgetInput
                            amount={amount}
                            hasBudget={hasBudget}
                            disabled={disabledAll}
                            onChange={(e) => onBudgetChange(row.user_id, e.target.value)}
                          />
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4 text-center">
                        {isDirty ? (
                          <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                            SIN GUARDAR
                          </span>
                        ) : (
                          <Badge variant={hasBudget ? "ASIGNADO" : "PENDIENTE"} />
                        )}
                      </td>

                      {/* Acción */}
                      <td className="px-6 py-4 text-center">
                        <button
                          className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-slate-200 bg-red-100 hover:bg-red-200 text-sm font-bold"
                          onClick={() => onMarkZero(key)}
                        >
                          Marcar 0
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* =========================
              TABLET (md a <lg): FILAS EN GRID (SIN SCROLL)
          ========================== */}
          <div className="hidden md:block lg:hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-4 sm:px-5 py-3">
              <div className="grid grid-cols-12 gap-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                <div className="col-span-5">Usuario</div>
                <div className="col-span-2 text-center">Rol</div>
                <div className="col-span-3">Ubicación</div>
                <div className="col-span-2 text-center">Presupuesto</div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {tableRows.map((row) => {
                const key = String(row.user_id);
                const isDirty = dirty[key] != null;
                const amount = isDirty ? Number(dirty[key]) : Number(row?.budget?.budget_amount || 0);
                const hasBudget = Number.isFinite(amount) && amount > 0;

                return (
                  <div
                    key={`${row.kind}-${row.user_id}`}
                    className={clsx(
                      "px-4 sm:px-5 py-4 transition-colors",
                      isDirty ? "bg-amber-50/40" : "hover:bg-slate-50"
                    )}
                  >
                    <div className="grid grid-cols-12 gap-3 items-start">
                      {/* Usuario */}
                      <div className="col-span-5 min-w-0">
                        <div className="flex items-start gap-3 min-w-0">
                          <Avatar name={row.name} />
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-900 truncate">{row.name}</div>
                            <div className="text-xs text-slate-400 font-mono truncate">
                              ID: {row.user_id} | Doc: {row.document_id || "N/D"} |{" "}
                              {row.active ? "Activo" : "Inactivo"}
                            </div>
                            <div className="text-xs text-slate-400 truncate">{row.email || ""}</div>
                          </div>
                        </div>
                      </div>

                      {/* Rol */}
                      <div className="col-span-2 flex justify-center pt-1">
                        <Badge variant={row.kind === "COORD" ? "COORDINACION" : "ASESORIA"} />
                      </div>

                      {/* Ubicación */}
                      <div className="col-span-3 min-w-0">
                        <div className="text-xs text-slate-600">
                          <div className="font-extrabold text-slate-800 truncate">
                            {row.district_claro || "N/D"}
                          </div>
                          <div className="text-slate-400 truncate">{row.regional || ""}</div>
                          <div className="text-slate-400 truncate">{row.cargo || ""}</div>
                        </div>
                      </div>

                      {/* Presupuesto + estado + acción */}
                      <div className="col-span-2 flex flex-col items-center gap-2">
                        <BudgetInput
                          amount={amount}
                          hasBudget={hasBudget}
                          disabled={disabledAll}
                          onChange={(e) => onBudgetChange(row.user_id, e.target.value)}
                        />

                        {isDirty ? (
                          <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                            SIN GUARDAR
                          </span>
                        ) : (
                          <Badge variant={hasBudget ? "ASIGNADO" : "PENDIENTE"} />
                        )}

                        <button
                          className="text-xs font-extrabold px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
                          onClick={() => onMarkZero(key)}
                        >
                          Marcar 0
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================
              MOBILE (<md): TARJETAS VERTICALES
          ========================== */}
          <div className="md:hidden p-3 space-y-3">
            {tableRows.map((row) => {
              const key = String(row.user_id);
              const isDirty = dirty[key] != null;
              const amount = isDirty ? Number(dirty[key]) : Number(row?.budget?.budget_amount || 0);
              const hasBudget = Number.isFinite(amount) && amount > 0;

              return (
                <div
                  key={`${row.kind}-${row.user_id}`}
                  className={clsx(
                    "border border-slate-200 rounded-2xl p-3 bg-white shadow-sm",
                    isDirty ? "ring-1 ring-amber-200 bg-amber-50/20" : ""
                  )}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <Avatar name={row.name} />
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-slate-900 text-sm truncate">{row.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        ID: {row.user_id} | Doc: {row.document_id || "N/D"} | {row.active ? "Activo" : "Inactivo"}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{row.email || ""}</div>

                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <Badge variant={row.kind === "COORD" ? "COORDINACION" : "ASESORIA"} />
                        {isDirty ? (
                          <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                            SIN GUARDAR
                          </span>
                        ) : (
                          <Badge variant={hasBudget ? "ASIGNADO" : "PENDIENTE"} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div className="mt-3 text-xs text-slate-600">
                    <div className="font-extrabold text-slate-800 truncate">{row.district_claro || "N/D"}</div>
                    <div className="text-slate-400 truncate">{row.regional || ""}</div>
                    <div className="text-slate-400 truncate">{row.cargo || ""}</div>
                  </div>

                  {/* Presupuesto + acción */}
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold text-slate-500 uppercase">
                        Presupuesto
                      </span>
                      <BudgetInput
                        amount={amount}
                        hasBudget={hasBudget}
                        disabled={disabledAll}
                        onChange={(e) => onBudgetChange(row.user_id, e.target.value)}
                      />
                    </div>

                    <button
                      className="text-xs font-extrabold px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shrink-0"
                      onClick={() => onMarkZero(key)}
                    >
                      Marcar 0
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Footer nota */}
      {coordinatorPayload && (
        <div className="p-4 border-t border-slate-200 text-xs sm:text-sm text-slate-500 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            Nota: "Pendiente" significa sin presupuesto o presupuesto igual a 0. El guardado se hace con batch.
          </div>
          <div className="font-mono text-[11px]">
            {`coord_id=${coordinatorPayload.coordinator?.id || "N/D"} | period=${coordinatorPayload.period || ""} | scope=${coordinatorPayload.scope || ""}`}
          </div>
        </div>
      )}
    </section>
  );
}
