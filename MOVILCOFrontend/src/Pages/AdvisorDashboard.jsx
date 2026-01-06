import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  Globe,
  Hash,
  Loader2,
  MessageSquare,
  Monitor,
  Search,
  Smartphone,
  Wifi,
  X,
  Zap,
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  Briefcase,
  DollarSign,
  Phone,
  Mail,
  Building2
} from "lucide-react";
import useAuthSession from "../hooks/useAuthSession";
import { api } from "../../store/api";

const pad2 = (v) => String(v).padStart(2, "0");
const parseNumber = (val, fallback = 0) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
};

const formatPeriodLabel = (period) => {
  const [y, m] = (period || "").split("-");
  if (!y || !m) return period || "Periodo";
  const monthName = new Date(Number(y), Number(m) - 1, 1).toLocaleString("es-CO", { month: "long" });
  return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${y}`;
};

const formatDate = (iso) => {
  if (!iso) return "N/D";
  try {
    return new Date(iso).toLocaleDateString("es-CO", { year: "numeric", month: "2-digit", day: "2-digit" });
  } catch {
    return String(iso);
  }
};

const ServiceIcon = ({ line }) => {
  const value = String(line || "").toUpperCase();
  if (value.includes("MOVIL")) return <Smartphone className="text-purple-600" size={18} />;
  if (value.includes("TV") || value.includes("VIDEO")) return <Monitor className="text-pink-600" size={18} />;
  return <Wifi className="text-blue-600" size={18} />;
};

const Modal = ({ title, onClose, children, footer }) => (
  <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-100 flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="font-bold text-lg text-slate-900">{title}</div>
        <button onClick={onClose} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/60">{children}</div>
      {footer ? <div className="px-6 py-4 border-t border-slate-100 bg-white">{footer}</div> : null}
    </div>
  </div>
);

const PeriodSelector = ({ period, onChange }) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
      <Calendar size={16} className="text-[#C62828]" />
      <span className="text-sm font-semibold text-slate-700">{formatPeriodLabel(period)}</span>
    </div>
    <input
      type="month"
      value={period}
      onChange={(e) => {
        const now = new Date();
        const current = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`;
        const val = e.target.value || current;
        onChange(val);
      }}
      className="border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-200 bg-white"
    />
  </div>
);

const KpiCard = ({ title, value, subtitle, tone = "slate" }) => {
  const toneClasses =
    tone === "red"
      ? "bg-white border-red-100"
      : tone === "green"
      ? "bg-white border-emerald-100"
      : "bg-white border-slate-200";
  return (
    <div className={`rounded-2xl border ${toneClasses} shadow-sm p-4`}>
      <div className="text-sm font-semibold text-slate-500">{title}</div>
      <div className="mt-1 text-2xl font-extrabold text-slate-900">{value}</div>
      {subtitle ? <div className="mt-1 text-sm text-slate-600">{subtitle}</div> : null}
    </div>
  );
};

/** Mini-card de progreso para móvil (mosaico) */
const ProgressMiniCard = ({ total, presupuesto, advisorName, advisorDistrict }) => {
  const pct = presupuesto > 0 ? Math.min(100, (total / presupuesto) * 100) : 0;
  const faltan = presupuesto > 0 ? Math.max(0, presupuesto - total) : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
      <div className="text-sm font-semibold text-slate-500">Progreso</div>
      <div className="mt-1 text-2xl font-extrabold text-slate-900">
        {total}
        {presupuesto > 0 ? <span className="text-slate-400"> / {presupuesto}</span> : null}
      </div>
      <div className="mt-2 w-full bg-slate-100 h-3 rounded-full overflow-hidden">
        <div className="h-full bg-[#C62828] transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 text-sm text-slate-500">
        {presupuesto > 0 ? `${faltan} ventas para meta` : "Sin meta definida"}
      </div>
      <div className="mt-2 text-xs text-slate-500 truncate">
        {advisorName} · {advisorDistrict}
      </div>
    </div>
  );
};

const DataField = ({ icon: Icon, label, value, highlight = false }) => (
  <div className={`flex flex-col p-2.5 rounded-lg border ${highlight ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"}`}>
    <div className="flex items-center gap-1.5 mb-1">
      <Icon size={12} className={highlight ? "text-[#C62828]" : "text-slate-400"} />
      <span className={`text-[10px] font-bold uppercase tracking-wider ${highlight ? "text-red-700" : "text-slate-500"}`}>{label}</span>
    </div>
    <span className={`text-xs font-semibold truncate ${highlight ? "text-red-900" : "text-slate-800"}`}>{value || "N/A"}</span>
  </div>
);

const MobileProfileInfo = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const asesor = data?.asesor || {};
  const coordinador = data?.coordinador || {};

  const getInitials = (name) => (name ? name.substring(0, 2).toUpperCase() : "US");
  const formatName = (name) => {
    if (!name) return "Usuario";
    return name
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <div className="block lg:hidden w-full mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="w-full flex items-center justify-between p-4 bg-white active:bg-slate-50 transition-colors focus:outline-none"
        >
          <div className="flex items-center gap-3 text-left overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-[#C62828] text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0 border-2 border-red-50">
              {getInitials(asesor.name)}
            </div>
            <div className="min-w-0">
              <h2 className="text-md font-bold text-slate-800 truncate leading-tight">{formatName(asesor.name)}</h2>
              <p className="text-sm text-slate-500 font-medium truncate flex items-center gap-1">{asesor.cargo || "Asesor Comercial"}</p>
            </div>
          </div>

          <div className={`p-1.5 rounded-full bg-slate-50 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 bg-red-50 text-red-600" : ""}`}>
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {isOpen && (
          <div className="border-t border-slate-100 bg-white px-4 pb-5 pt-2 animate-in slide-in-from-top-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-3 pl-1 flex items-center gap-2">
                  <User size={12} /> Mis Datos Corporativos
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <DataField icon={User} label="Nombre Completo" value={asesor.name} />
                  </div>
                  <DataField icon={Mail} label="Email" value={asesor.email} />
                  <DataField icon={Phone} label="Teléfono" value={asesor.phone} />
                  <DataField icon={MapPin} label="Distrito" value={asesor.district_claro} />
                  <DataField icon={Building2} label="Regional" value={asesor.regional} />
                  <div className="col-span-2">
                    <DataField
                      icon={DollarSign}
                      label="Presupuesto Asignado"
                      value={`${asesor.presupuesto || 0} Conexiones`}
                      highlight={true}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-3 pl-1 flex items-center gap-2">
                  <Briefcase size={12} /> Información de mi Supervisor
                </h3>
                <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm">
                      {getInitials(coordinador.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{coordinador.name || "No asignado"}</p>
                      <p className="text-sm text-slate-500 truncate">{coordinador.cargo}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="text-slate-400" />
                      <span className="truncate">{coordinador.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-slate-400" />
                      <span>{coordinador.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-slate-400" />
                      <span className="truncate">{coordinador.district || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SalesTable = ({ sales, loading, searchTerm, onSearch, onSelect }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
    <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div>
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Zap size={18} className="text-[#C62828]" />
          Ventas del periodo
        </h3>
        <p className="text-sm text-slate-500">Listado SIAPP asociado a tu cédula.</p>
      </div>
      <div className="w-full sm:w-80">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar cuenta, OT, plan, zona..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-200 text-sm font-semibold outline-none"
          />
        </div>
      </div>
    </div>

    {/* LOADING / EMPTY */}
    {loading ? (
      <div className="px-6 py-10 text-center text-slate-500">
        <div className="inline-flex items-center gap-2 text-sm font-semibold">
          <Loader2 className="animate-spin" size={18} /> Cargando ventas...
        </div>
      </div>
    ) : sales.length === 0 ? (
      <div className="px-6 py-12 text-center text-slate-500 text-sm">No hay ventas registradas para este periodo.</div>
    ) : (
      <>
        {/* ====== MOBILE + TABLET (<lg): CARDS (sin scroll horizontal) ====== */}
        <div className="lg:hidden divide-y divide-slate-100">
          {sales.map((sale) => (
            <div
              key={sale.id}
              onClick={() => onSelect(sale)}
              className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-100 shrink-0">
                  <ServiceIcon line={sale.linea_negocio} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                    {sale.paquete_pvd || sale.venta || "Venta"}
                  </div>

                  <div className="mt-1 text-xs text-slate-500 font-semibold flex flex-wrap items-center gap-2">
                    <span>{sale.linea_negocio || "N/D"}</span>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={14} className="text-slate-400" />
                      {formatDate(sale.fecha)}
                    </span>
                    {sale.in_district != null ? (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className={sale.in_district ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                          {sale.in_district ? "Local" : "Fuera"}
                        </span>
                      </>
                    ) : null}
                  </div>

                  {/* Meta en “mosaico” para que quepa en md sin overflow */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase">Cuenta</div>
                      <div className="mt-0.5 text-sm font-mono font-bold text-slate-800 truncate">{sale.cuenta || "N/A"}</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase">OT</div>
                      <div className="mt-0.5 text-sm font-mono font-bold text-slate-800 truncate">{sale.ot || "N/A"}</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 col-span-2">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase">Ubicación</div>
                      <div className="mt-0.5 text-sm font-semibold text-slate-800 flex items-center gap-2 truncate">
                        <Globe size={14} className="text-slate-400" />
                        <span className="truncate">{sale.poblacion || "N/D"}</span>
                      </div>
                      <div className="text-xs text-slate-500 font-semibold mt-0.5 truncate">
                        {sale.zona || sale.area || sale.distrito_venta || "N/D"}
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 col-span-2">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase">Modalidad</div>
                      <div className="mt-0.5 text-sm font-extrabold text-slate-800 truncate">
                        {sale.modalidad_venta || "N/D"}
                      </div>
                      <div className="text-xs text-slate-500 font-semibold truncate">
                        {sale.tipo_prodcuto || sale.tipo_contrato || ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ====== DESKTOP (lg+): TABLE ====== */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-sm text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 xl:px-6 py-3">Plan / Servicio</th>
                  <th className="px-4 xl:px-6 py-3">Identificadores</th>
                  <th className="px-4 xl:px-6 py-3">Ubicación</th>
                  <th className="px-4 xl:px-6 py-3 text-right">Modalidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => onSelect(sale)}
                  >
                    <td className="px-4 xl:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-100">
                          <ServiceIcon line={sale.linea_negocio} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                            {sale.paquete_pvd || sale.venta || "Venta"}
                          </div>
                          <div className="text-xs text-slate-500 font-semibold flex flex-wrap items-center gap-2">
                            <span>{sale.linea_negocio || "N/D"}</span>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center gap-1">
                              <Calendar size={14} className="text-slate-400" />
                              {formatDate(sale.fecha)}
                            </span>
                            {sale.in_district != null ? (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className={sale.in_district ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                                  {sale.in_district ? "Local" : "Fuera"}
                                </span>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 xl:px-6 py-4">
                      <div className="text-sm font-mono font-bold text-slate-800">{sale.cuenta || "N/A"}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        OT: <span className="font-mono font-semibold text-slate-700">{sale.ot || "N/A"}</span>
                      </div>
                    </td>

                    <td className="px-4 xl:px-6 py-4">
                      <div className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                        <Globe size={14} className="text-slate-400" /> {sale.poblacion || "N/D"}
                      </div>
                      <div className="text-xs text-slate-500 font-semibold mt-1 truncate max-w-[260px]">
                        {sale.zona || sale.area || sale.distrito_venta || "N/D"}
                      </div>
                    </td>

                    <td className="px-4 xl:px-6 py-4 text-right">
                      <div className="text-sm font-extrabold text-slate-800">{sale.modalidad_venta || "N/D"}</div>
                      <div className="text-xs text-slate-500 font-semibold">{sale.tipo_prodcuto || sale.tipo_contrato || ""}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-6 py-3 text-sm text-slate-600 border-t border-slate-100 bg-slate-50">
          Mostrando {sales.length} ventas
        </div>
      </>
    )}
  </div>
);

const SaleDetailModal = ({ sale, onClose }) => {
  if (!sale) return null;
  const fields = [
    { label: "Cuenta", value: sale.cuenta },
    { label: "OT", value: sale.ot },
    { label: "Fecha", value: formatDate(sale.fecha) },
    { label: "Distrito venta", value: sale.distrito_venta },
    { label: "Población", value: sale.poblacion },
    { label: "Zona", value: sale.zona || sale.area },
    { label: "Modalidad", value: sale.modalidad_venta },
    { label: "Tipo producto", value: sale.tipo_prodcuto },
    { label: "Tipo red", value: sale.tipored },
    { label: "Tipo contrato", value: sale.tipo_contrato },
    { label: "Línea de negocio", value: sale.linea_negocio },
    { label: "Plan / paquete", value: sale.paquete_pvd || sale.venta },
    { label: "Convergente", value: sale.ventaconvergente },
    { label: "Estado liquidación", value: sale.estado_liquidacion },
    { label: "Registro", value: sale.tipo_registro },
  ];

  return (
    <Modal
      title="Detalle de venta"
      onClose={onClose}
      footer={
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800"
          >
            Cerrar
          </button>
        </div>
      }
    >
      <div className="space-y-5 ">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="p-3 bg-slate-100 rounded-xl w-fit">
              <ServiceIcon line={sale.linea_negocio} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xl font-extrabold text-slate-900 leading-tight">
                {sale.paquete_pvd || sale.venta || "Venta"}
              </div>
              <div className="mt-1 text-sm text-slate-600 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" /> {formatDate(sale.fecha)}
                </span>
                {sale.in_district != null && (
                  <span
                    className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-bold ${
                      sale.in_district ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {sale.in_district ? "Venta local" : "Fuera de distrito"}
                  </span>
                )}
                {sale.estado_liquidacion && (
                  <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                    {sale.estado_liquidacion}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Identificadores</div>
            <div className="mt-3 space-y-2 text-sm font-semibold text-slate-800">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Cuenta</span>
                <span className="font-mono">{sale.cuenta || "N/D"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">OT</span>
                <span className="font-mono">{sale.ot || "N/D"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Registro</span>
                <span>{sale.tipo_registro || "N/D"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Ubicación</div>
            <div className="mt-3 space-y-2 text-sm font-semibold text-slate-800">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Distrito venta</span>
                <span className="text-right">{sale.distrito_venta || "N/D"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Población</span>
                <span className="text-right">{sale.poblacion || "N/D"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Zona / Área</span>
                <span className="text-right">{sale.zona || sale.area || "N/D"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Estado</div>
            <div className="mt-3 space-y-2 text-sm font-semibold text-slate-800">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Línea de negocio</span>
                <span className="text-right">{sale.linea_negocio || "N/D"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Tipo contrato</span>
                <span className="text-right">{sale.tipo_contrato || "N/D"}</span>
              </div>

            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Detalle comercial</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {fields.map((f) => (
              <div key={f.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="text-[11px] font-semibold text-slate-500 uppercase">{f.label}</div>
                <div className="mt-1 text-sm font-bold text-slate-800 break-words min-h-[36px]">{f.value || "N/D"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const ContactModal = ({ onClose }) => (
  <Modal
    title="Contactar supervisor"
    onClose={onClose}
    footer={
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800"
        >
          Cerrar
        </button>
      </div>
    }
  >
    <div className="bg-white border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
      Funcionalidad en desarrollo. Aquí se conectará el flujo para contactar al supervisor/coordinador.
    </div>
  </Modal>
);

export default function AdvisorDashboard() {
  const { user, token } = useAuthSession();

  const [period, setPeriod] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const advisorId = useMemo(() => {
    const sources = [
      user?.document_id,
      user?.documentId,
      user?.document,
      user?.documento,
      user?.cedula,
      user?.advisor_id,
      user?.advisorId
    ];
    return sources.find((v) => v) || "";
  }, [user]);

  const sales = useMemo(() => (Array.isArray(data?.sales) ? data.sales : []), [data]);
  const total = data?.total ?? sales.length;

  const filteredSales = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return sales;
    return sales.filter((s) => {
      const check = [s.cuenta, s.ot, s.id, s.poblacion, s.zona, s.paquete_pvd, s.linea_negocio]
        .map((v) => String(v || "").toLowerCase())
        .join(" ");
      return check.includes(term);
    });
  }, [sales, searchTerm]);

  const headers = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

  const fetchSales = async () => {
    if (!advisorId) {
      setError("No se pudo determinar el documento del asesor.");
      setData(null);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({ period, advisor_id: String(advisorId) });
      const res = await fetch(`${api}/api/siapp/monthly/sales?${qs.toString()}`, { headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "No se pudo cargar la información");
      setData(json);
    } catch (err) {
      setError(err?.message || "Error al cargar las ventas");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, advisorId, token]);

  const advisorName = user?.name || user?.nombre || "Asesor";
  const advisorDistrict = user?.district_claro || user?.district || "N/D";
  const now = useMemo(() => new Date(), []);
  const currentPeriod = useMemo(() => `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`, [now]);
  const isCurrentPeriod = period === currentPeriod;

  const budgetFromProfile = useMemo(() => {
    const val = profileData?.asesor?.presupuesto;
    return val !== undefined ? parseNumber(val, null) : null;
  }, [profileData]);

  const presupuesto = useMemo(() => {
    if (!isCurrentPeriod) return 0;
    if (budgetFromProfile !== null) return budgetFromProfile;
    return parseNumber(user?.presupuesto, 0);
  }, [isCurrentPeriod, budgetFromProfile, user]);

  const cumplimiento = presupuesto > 0 ? Math.round((parseNumber(total, 0) / presupuesto) * 100) : 0;

  const fetchProfile = async () => {
    if (!user?.id) return;
    setProfileLoading(true);
    setProfileError("");
    try {
      const res = await fetch(`${api}/api/users/profile/${user.id}`, { headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "No se pudo cargar el perfil");
      setProfileData(json);
    } catch (err) {
      setProfileError(err?.message || "No se pudo cargar el perfil del asesor");
      setProfileData(null);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, token]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 min-w-full">
      <header className="">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">Dashboard Asesor</h1>
            <p className="text-sm text-slate-500">Ventas SIAPP del periodo seleccionado</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <PeriodSelector period={period} onChange={setPeriod} />
            <button
              onClick={() => setContactOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-[#C62828] border border-red-100 rounded-xl text-sm font-semibold hover:bg-red-100"
            >
              <MessageSquare size={16} /> Contactar supervisor
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 ">
        <MobileProfileInfo data={profileData} />

        {!advisorId && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm">
            No se pudo determinar el documento del asesor. Inicie sesión nuevamente o contacte soporte.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 flex items-start gap-3">
            <AlertTriangle size={16} className="mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold">Error al cargar ventas</div>
              <div className="mt-0.5">{error}</div>
              <button
                onClick={fetchSales}
                className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-[#C62828] text-white rounded-lg text-xs font-semibold hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* ===== KPI MOSAICO SOLO EN MÓVIL (evita 4 bloques en columna) ===== */}
        {isCurrentPeriod ? (
          <>
            <section className="md:hidden grid grid-cols-2 gap-3">
              <KpiCard title="Periodo" value={formatPeriodLabel(period)} subtitle={period} />
              <KpiCard title="Presupuesto" value={presupuesto > 0 ? presupuesto : "N/A"} subtitle="Meta asignada" />
              <KpiCard
                title="Cumplimiento"
                value={presupuesto > 0 ? `${cumplimiento}%` : "0%"}
                subtitle={presupuesto > 0 ? `${total} / ${presupuesto} conexiones` : `${total} conexiones`}
                tone="green"
              />
              <ProgressMiniCard
                total={total}
                presupuesto={presupuesto}
                advisorName={advisorName}
                advisorDistrict={advisorDistrict}
              />
            </section>

            {/* ===== KPI NORMAL EN md+ (se mantiene como lo tienes porque ahí se ve bien) ===== */}
            <section className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4">
              <KpiCard title="Periodo" value={formatPeriodLabel(period)} subtitle={period} />
              <KpiCard title="Presupuesto" value={presupuesto > 0 ? presupuesto : "N/A"} subtitle="Meta asignada" />
              <KpiCard
                title="Cumplimiento"
                value={presupuesto > 0 ? `${cumplimiento}%` : "0%"}
                subtitle={presupuesto > 0 ? `${total} / ${presupuesto} conexiones` : `${total} conexiones registradas`}
                tone="green"
              />
            </section>

            {/* ===== Progreso grande SOLO md+ (en móvil ya va en la mini-card) ===== */}
            <section className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500 font-semibold">Progreso del periodo</div>
                  <div className="text-2xl font-extrabold text-slate-900">
                    {total} conexiones {presupuesto > 0 && <span className="text-slate-400">/ {presupuesto}</span>}
                  </div>
                </div>

              </div>
              <div className="mt-3 w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C62828] transition-all duration-500"
                  style={{ width: `${Math.min(100, presupuesto > 0 ? (total / presupuesto) * 100 : 0)}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-slate-500">
                {presupuesto > 0
                  ? `${Math.max(0, presupuesto - total)} ventas para cumplir la meta.`
                  : "Define una meta para ver faltantes."}
              </div>
            </section>
          </>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <KpiCard title="Periodo" value={formatPeriodLabel(period)} subtitle={period} />
            <KpiCard title="Ventas del periodo" value={total} subtitle="Conexiones registradas" />
          </section>
        )}

        <SalesTable
          sales={filteredSales}
          loading={loading}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          onSelect={setSelectedSale}
        />
      </main>

      {selectedSale ? <SaleDetailModal sale={selectedSale} onClose={() => setSelectedSale(null)} /> : null}
      {contactOpen ? <ContactModal onClose={() => setContactOpen(false)} /> : null}
    </div>
  );
}
