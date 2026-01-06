import React from "react";
import { Edit3, Hash, Mail, MapPin, RefreshCw, UserCog } from "lucide-react";

const StatusBadge = ({ manual }) => {
  // Base compacto (mobile/tablet) + se “agranda” en sm+
  const base =
    "inline-flex items-center justify-center gap-1 rounded-full font-extrabold uppercase border shadow-sm " +
    "px-2 py-0.5 text-[10px] leading-none whitespace-nowrap max-w-full";
  const upSm = " sm:px-3 sm:py-1 sm:text-xs sm:gap-1.5";

  if (manual) {
    return (
      <span className={`${base} ${upSm} bg-blue-50 text-blue-700 border-blue-200`}>
        <UserCog className="shrink-0" size={12} />
        <span className="truncate">Manual</span>
      </span>
    );
  }

  return (
    <span className={`${base} ${upSm} bg-slate-100 text-slate-600 border-slate-200`}>
      <RefreshCw className="shrink-0" size={12} />
      <span className="truncate">Automatico</span>
    </span>
  );
};

function Avatar({ name }) {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-extrabold text-base border-2 border-white shadow-sm shrink-0">
      {(name || "?").charAt(0)}
    </div>
  );
}

export default function UsersTable({ rows, onEdit }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* =========================
          DESKTOP (lg+): TABLA
      ========================== */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full min-w-[1080px] table-fixed text-left border-collapse">
          <colgroup>
            <col style={{ width: "36%" }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "8%" }} />
          </colgroup>

          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 xl:px-8 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Asesor / Identificación
              </th>
              <th className="px-6 xl:px-8 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Coordinador
              </th>
              <th className="px-6 xl:px-8 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Distrito
              </th>
              <th className="px-6 xl:px-8 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider text-center bg-slate-100/50 border-x border-slate-200">
                Días laborados
              </th>
              <th className="px-6 xl:px-8 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider text-center">
                Acción
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-12 text-center text-slate-400 font-medium">
                  No se encontraron asesores con los filtros actuales.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const isManual = row.manual?.isManual;
                const daysDisplay = row.manual?.displayDays ?? row.autoDays;

                return (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* ASESOR */}
                    <td className="px-6 xl:px-8 py-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <Avatar name={row.name} />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-800 text-base truncate">
                            {row.name || "Sin nombre"}
                          </div>

                          <div className="mt-0.5 flex items-center gap-3 text-sm text-slate-500 min-w-0">
                            <span className="flex items-center gap-1 font-mono whitespace-nowrap">
                              <Hash size={14} /> {row.documentId || "N/D"}
                            </span>

                            <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />

                            <span className="flex items-center gap-1.5 min-w-0">
                              <Mail size={14} className="shrink-0" />
                              <span className="truncate">{row.email || "N/D"}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* COORDINADOR */}
                    <td className="px-6 xl:px-8 py-4">
                      <div className="text-sm min-w-0">
                        <div className="font-bold text-slate-800 truncate">
                          {row.coordinatorName || "Sin coordinador"}
                        </div>
                        {row.directionName ? (
                          <div className="text-slate-500 text-xs mt-1 truncate">
                            Dirección: {row.directionName}
                          </div>
                        ) : null}
                      </div>
                    </td>

                    {/* DISTRITO */}
                    <td className="px-6 xl:px-8 py-4">
                      <div className="text-sm min-w-0">
                        <span className="font-bold block text-slate-800 truncate">
                          {row.districtClaro || "Sin distrito"}
                        </span>
                        <span className="text-slate-500 block truncate">
                          {row.district || "Sin distrito"}
                        </span>
                      </div>
                    </td>

                    {/* DÍAS */}
                    <td
                      className={`px-6 xl:px-8 py-4 text-center border-x border-slate-100 ${
                        isManual ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span
                          className={`text-3xl font-extrabold ${
                            isManual ? "text-blue-700" : "text-slate-700"
                          }`}
                        >
                          {daysDisplay}
                        </span>

                        {/* Evita overflow del badge */}
                        <div className="max-w-full flex justify-center">
                          <StatusBadge manual={isManual} />
                        </div>
                      </div>
                    </td>

                    {/* ACCIÓN (centrado real) */}
                    <td className="px-6 xl:px-8 py-4 align-middle">
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => onEdit(row)}
                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm hover:shadow-md"
                          title="Editar días laborados"
                        >
                          <Edit3 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* =========================
          TABLET (md a <lg): GRID ROWS
      ========================== */}
      <div className="hidden md:block lg:hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
          <div className="grid grid-cols-12 gap-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            <div className="col-span-5">Asesor / Identificación</div>
            <div className="col-span-3">Coordinador</div>
            <div className="col-span-2">Distrito</div>
            <div className="col-span-1 text-center">Días</div>
            <div className="col-span-1 text-center">Acción</div>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="p-10 text-center text-slate-400 font-medium">
            No se encontraron asesores con los filtros actuales.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {rows.map((row) => {
              const isManual = row.manual?.isManual;
              const daysDisplay = row.manual?.displayDays ?? row.autoDays;

              return (
                <div key={row.id} className="px-5 py-4 hover:bg-slate-50/70 transition">
                  <div className="grid grid-cols-12 gap-3 items-center">
                    {/* Asesor */}
                    <div className="col-span-5 min-w-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={row.name} />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">
                            {row.name || "Sin nombre"}
                          </div>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500 min-w-0">
                            <span className="flex items-center gap-1 font-mono whitespace-nowrap">
                              <Hash size={12} /> {row.documentId || "N/D"}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                            <span className="flex items-center gap-1 min-w-0">
                              <Mail size={12} className="shrink-0" />
                              <span className="truncate">{row.email || "N/D"}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coordinador */}
                    <div className="col-span-3 min-w-0">
                      <div className="text-sm min-w-0">
                        <div className="font-bold text-slate-800 truncate">
                          {row.coordinatorName || "Sin coordinador"}
                        </div>
                        {row.directionName ? (
                          <div className="text-xs text-slate-500 truncate">
                            Dirección: {row.directionName}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Distrito */}
                    <div className="col-span-2 min-w-0">
                      <div className="text-sm min-w-0">
                        <div className="font-bold text-slate-800 truncate">
                          {row.districtClaro || "Sin distrito"}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {row.district || "Sin distrito"}
                        </div>
                      </div>
                    </div>

                    {/* Días (más compacto) */}
                    <div
                      className={`col-span-1 rounded-xl border px-2 py-2 text-center ${
                        isManual ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div
                        className={`text-xl font-extrabold leading-none ${
                          isManual ? "text-blue-700" : "text-slate-700"
                        }`}
                      >
                        {daysDisplay}
                      </div>
                      <div className="mt-2 flex justify-center max-w-full">
                        <StatusBadge manual={isManual} />
                      </div>
                    </div>

                    {/* Acción (centrado) */}
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => onEdit(row)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm"
                        title="Editar días laborados"
                      >
                        <Edit3 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* línea inferior opcional, queda bien tipo lista */}
                  <div className="mt-3 text-xs text-slate-500 flex items-center gap-1 min-w-0">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">
                      {row.districtClaro || row.district || "Sin distrito"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================
          MOBILE (<md): LISTA VERTICAL COMPACTA
          - Header en columna
          - Días debajo, compacto
      ========================== */}
      <div className="md:hidden p-3 space-y-3">
        {rows.length === 0 ? (
          <div className="p-6 text-center text-slate-400 font-medium">
            No se encontraron asesores con los filtros actuales.
          </div>
        ) : (
          rows.map((row) => {
            const isManual = row.manual?.isManual;
            const daysDisplay = row.manual?.displayDays ?? row.autoDays;

            return (
              <div
                key={row.id}
                className="border border-slate-200 rounded-2xl p-3 shadow-sm bg-white"
              >
                {/* Top: Asesor (vertical) */}
                <div className="flex items-start gap-3 min-w-0">
                  <Avatar name={row.name} />

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[15px] text-slate-900 truncate">
                      {row.name || "Sin nombre"}
                    </div>

                    <div className="mt-1 text-[13px] text-slate-500 space-y-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <Hash size={13} className="shrink-0" />
                        <span className="font-mono">{row.documentId || "N/D"}</span>
                      </div>

                      <div className="flex items-center gap-1 min-w-0">
                        <Mail size={13} className="shrink-0" />
                        <span className="truncate">{row.email || "N/D"}</span>
                      </div>

                      <div className="flex items-center gap-1 min-w-0">
                        <MapPin size={13} className="shrink-0" />
                        <span className="truncate">
                          {row.districtClaro || row.district || "Sin distrito"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acción arriba a la derecha (compacta) */}
                  <button
                    onClick={() => onEdit(row)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition border border-slate-200/60"
                    title="Editar días laborados"
                  >
                    <Edit3 size={18} />
                  </button>
                </div>

                {/* Días + badge (más pequeño, en fila) */}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Coordinador
                    </div>
                    <div className="text-[13px] font-semibold text-slate-800 truncate">
                      {row.coordinatorName || "Sin coordinador"}
                    </div>
                    {row.directionName ? (
                      <div className="text-[12px] text-slate-500 truncate">
                        Dirección: {row.directionName}
                      </div>
                    ) : null}
                  </div>

                  <div
                    className={`shrink-0 rounded-xl border px-2.5 py-2 text-center ${
                      isManual ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div
                      className={`text-[20px] font-extrabold leading-none ${
                        isManual ? "text-blue-700" : "text-slate-700"
                      }`}
                    >
                      {daysDisplay}
                    </div>
                    <div className="mt-2 max-w-[120px] flex justify-center">
                      <StatusBadge manual={isManual} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
