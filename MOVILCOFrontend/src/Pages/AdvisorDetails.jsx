import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Calendar,
  Globe,
  Hash,
  Loader2,
  Mail,
  MapPin,
  Monitor,
  Search,
  Smartphone,
  User,
  Wifi,
  X,
  Zap,
  Phone,
  TrendingUp,
  FileText
} from "lucide-react";
import { api } from "../../store/api";
import { getStoredToken } from "../utils/auth";

const pad2 = (v) => String(v).padStart(2, "0");
const parseNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const formatDate = (iso) => {
  if (!iso) return "N/D";
  try {
    return new Date(iso).toLocaleDateString("es-CO", { year: "numeric", month: "2-digit", day: "2-digit" });
  } catch {
    return String(iso);
  }
};
    const handleBack = () => {
        window.history.back()
    }

const formatPeriodLabel = (period) => {
  const [y, m] = (period || "").split("-");
  if (!y || !m) return period || "Periodo";
  const name = new Date(Number(y), Number(m) - 1, 1).toLocaleString("es-CO", { month: "long" });
  return `${name.charAt(0).toUpperCase() + name.slice(1)} ${y}`;
};

const monthRange = (period) => {
  const [y, m] = String(period || "").split("-");
  if (!y || !m) return { date_from: "", date_to: "" };
  const year = Number(y);
  const month = Number(m);
  const date_from = `${y}-${pad2(month)}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const date_to = `${y}-${pad2(month)}-${pad2(lastDay)}`;
  return { date_from, date_to };
};

const ServiceIcon = ({ line }) => {
  const value = String(line || "").toUpperCase();
  if (value.includes("MOVIL")) return <Smartphone className="text-purple-600" size={18} />;
  if (value.includes("TV") || value.includes("VIDEO")) return <Monitor className="text-pink-600" size={18} />;
  return <Wifi className="text-blue-600" size={18} />;
};
const Icon = ({ path, size = 20, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        width={size}
        height={size}
        className={className}
    >
        <path d={path} />
    </svg>
)

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-100 flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="font-bold text-lg text-slate-900">{title}</div>
        <button onClick={onClose} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/60">{children}</div>
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

const KpiCard = ({ title, value, subtitle, className = "" }) => (
  <div className={`rounded-2xl border border-slate-200 shadow-sm p-4 bg-white min-w-0 ${className}`}>
    <div className="text-sm font-semibold text-slate-500">{title}</div>
    <div className="mt-1 text-2xl font-extrabold text-slate-900 truncate">{value}</div>
    {subtitle ? <div className="mt-1 text-sm text-slate-600 truncate">{subtitle}</div> : null}
  </div>
);

/**
 * Responsive sales list:
 * - Mobile ( < md ): card list (no horizontal scroll)
 * - Desktop ( >= md ): table layout, fixed table + truncation to avoid md horizontal scroll
 */
const SalesTable = ({ sales, loading, searchTerm, onSearch, onSelect }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
    <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <div>
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Zap size={18} className="text-[#C62828]" />
          Ventas del periodo
        </h3>
        <p className="text-sm text-slate-500">Listado SIAPP del asesor seleccionado.</p>
      </div>
      <div className="w-full md:w-80">
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

    {/* Mobile cards */}
    <div className="md:hidden">
      {loading ? (
        <div className="px-4 py-6 text-center text-slate-500">
          <div className="inline-flex items-center gap-2 text-sm font-semibold">
            <Loader2 className="animate-spin" size={18} /> Cargando ventas...
          </div>
        </div>
      ) : sales.length === 0 ? (
        <div className="px-4 py-8 text-center text-slate-500 text-sm">No hay ventas registradas para este periodo.</div>
      ) : (
        <div className="divide-y divide-slate-100">
          {sales.map((sale) => (
            <button
              key={sale.id}
              onClick={() => onSelect(sale)}
              className="w-full text-left px-4 py-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-100 shrink-0">
                  <ServiceIcon line={sale.linea_negocio} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-slate-900 text-sm truncate">
                    {sale.paquete_pvd || sale.venta || "Venta"}
                  </div>

                  <div className="mt-1 text-xs text-slate-500 font-semibold flex flex-wrap items-center gap-2">
                    <span className="truncate max-w-[160px]">{sale.linea_negocio || "N/D"}</span>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={13} className="text-slate-400" />
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

                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 min-w-0">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Cuenta</div>
                      <div className="font-mono font-bold text-slate-800 truncate">{sale.cuenta || "N/A"}</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 min-w-0">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">OT</div>
                      <div className="font-mono font-bold text-slate-800 truncate">{sale.ot || "N/A"}</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 col-span-2 min-w-0">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Ubicación</div>
                      <div className="text-slate-800 font-semibold truncate">
                        {sale.poblacion || "N/D"} · {sale.zona || sale.area || sale.distrito_venta || "N/D"}
                      </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 col-span-2 min-w-0">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Modalidad</div>
                      <div className="text-slate-800 font-extrabold truncate">{sale.modalidad_venta || "N/D"}</div>
                      <div className="text-slate-500 font-semibold truncate">
                        {sale.tipo_prodcuto || sale.tipo_contrato || ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && sales.length > 0 ? (
        <div className="px-4 py-3 text-sm text-slate-600 border-t border-slate-100 bg-slate-50">
          Mostrando {sales.length} ventas
        </div>
      ) : null}
    </div>

    {/* Desktop table */}
    <div className="hidden md:block">
      <div className="overflow-x-hidden">
        <table className="w-full text-left table-fixed">
          <thead className="bg-slate-50 text-sm text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 lg:px-6 py-3 w-[40%]">Plan / Servicio</th>
              <th className="px-4 lg:px-6 py-3 w-[20%]">Identificadores</th>
              <th className="px-4 lg:px-6 py-3 w-[25%]">Ubicación</th>
              <th className="px-4 lg:px-6 py-3 w-[15%] text-right">Modalidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-center text-slate-500">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold">
                    <Loader2 className="animate-spin" size={18} /> Cargando ventas...
                  </div>
                </td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">
                  No hay ventas registradas para este periodo.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr
                  key={sale.id}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => onSelect(sale)}
                >
                  <td className="px-4 lg:px-6 py-4 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-slate-100 shrink-0">
                        <ServiceIcon line={sale.linea_negocio} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                          {sale.paquete_pvd || sale.venta || "Venta"}
                        </div>
                        <div className="text-xs text-slate-500 font-semibold flex flex-wrap items-center gap-2">
                          <span className="truncate max-w-[180px]">{sale.linea_negocio || "N/D"}</span>
                          <span className="text-slate-300">•</span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={14} className="text-slate-400" />
                            {formatDate(sale.fecha)}
                          </span>
                          {sale.in_district != null ? (
                            <>
                              <span className="text-slate-300">•</span>
                              <span
                                className={
                                  sale.in_district ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"
                                }
                              >
                                {sale.in_district ? "Local" : "Fuera"}
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 lg:px-6 py-4 min-w-0">
                    <div className="text-sm font-mono font-bold text-slate-800 truncate">{sale.cuenta || "N/A"}</div>
                    <div className="text-xs text-slate-500 mt-1 truncate">
                      OT: <span className="font-mono font-semibold text-slate-700">{sale.ot || "N/A"}</span>
                    </div>
                  </td>

                  <td className="px-4 lg:px-6 py-4 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 flex items-center gap-2 min-w-0">
                      <Globe size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate">{sale.poblacion || "N/D"}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mt-1 truncate">
                      {sale.zona || sale.area || sale.distrito_venta || "N/D"}
                    </div>
                  </td>

                  <td className="px-4 lg:px-6 py-4 text-right min-w-0">
                    <div className="text-sm font-extrabold text-slate-800 truncate">{sale.modalidad_venta || "N/D"}</div>
                    <div className="text-xs text-slate-500 font-semibold truncate">
                      {sale.tipo_prodcuto || sale.tipo_contrato || ""}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {sales.length > 0 ? (
        <div className="px-6 py-3 text-sm text-slate-600 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          Mostrando {sales.length} ventas
        </div>
      ) : null}
    </div>
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
    { label: "Fuente", value: sale.source_file }
  ];

  return (
    <Modal title="Detalle de venta" onClose={onClose}>
      <div className="space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="p-3 bg-slate-100 rounded-xl w-fit">
              <ServiceIcon line={sale.linea_negocio} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xl font-extrabold text-slate-900 leading-tight break-words">
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
                <span className="font-mono break-all text-right">{sale.cuenta || "N/D"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">OT</span>
                <span className="font-mono break-all text-right">{sale.ot || "N/D"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Registro</span>
                <span className="text-right break-words">{sale.tipo_registro || "N/D"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Ubicación</div>
            <div className="mt-3 space-y-2 text-sm font-semibold text-slate-800">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Distrito venta</span>
                <span className="text-right break-words">{sale.distrito_venta || "N/D"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Población</span>
                <span className="text-right break-words">{sale.poblacion || "N/D"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Zona / Área</span>
                <span className="text-right break-words">{sale.zona || sale.area || "N/D"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Estado</div>
            <div className="mt-3 space-y-2 text-sm font-semibold text-slate-800">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Línea de negocio</span>
                <span className="text-right break-words">{sale.linea_negocio || "N/D"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Tipo contrato</span>
                <span className="text-right break-words">{sale.tipo_contrato || "N/D"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Fuente</span>
                <span className="text-right break-words">{sale.source_file || "N/D"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Detalle comercial</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {fields.map((f) => (
              <div key={f.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3 min-w-0">
                <div className="text-[11px] font-semibold text-slate-500 uppercase">{f.label}</div>
                <div className="mt-1 text-sm font-bold text-slate-800 break-words">{f.value || "N/D"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const NoveltyDetailModal = ({ novelty, onClose }) => {
  if (!novelty) return null;
  return (
    <Modal title="Detalle de novedad" onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 text-[#C62828] rounded-xl">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-extrabold text-slate-900 break-words">{novelty.novelty_type}</div>
              <div className="text-xs text-slate-500 break-words">
                Asesor: {novelty.name || "N/D"} · CC: {novelty.document_id || "N/D"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Periodo efectivo</div>
            <div className="text-sm font-bold text-slate-800 break-words">
              {formatDate(novelty.start)} {novelty.end ? `- ${formatDate(novelty.end)}` : ""}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 min-w-0">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Ubicación</div>
            <div className="text-sm font-bold text-slate-800 break-words">{novelty.district || "N/D"}</div>
            <div className="text-xs text-slate-500 break-words">{novelty.regional || ""}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Creado</div>
            <div className="text-sm font-bold text-slate-800">{formatDate(novelty.created_at)}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Actualizado</div>
            <div className="text-sm font-bold text-slate-800">{formatDate(novelty.updated_at)}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Notas registradas</div>
          <div className="text-sm text-slate-800 leading-relaxed break-words">{novelty.notes || "Sin notas"}</div>
        </div>
      </div>
    </Modal>
  );
};

export default function AdvisorDetails({ onBack }) {
  const { id: idParam } = useParams();
  const location = useLocation();
  const token = getStoredToken();
  const navigate = useNavigate();

  const advisorId = idParam || location.state?.advisor?.id;
  const advisorDocFromState = location.state?.advisor?.document_id || location.state?.advisor?.documento;

  const [period, setPeriod] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [advisorData, setAdvisorData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [novelties, setNovelties] = useState([]);
  const [noveltyLoading, setNoveltyLoading] = useState(false);
  const [noveltyError, setNoveltyError] = useState("");
  const [selectedNovelty, setSelectedNovelty] = useState(null);

  const isCurrentPeriod = useMemo(() => {
    const now = new Date();
    const current = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`;
    return period === current;
  }, [period]);

  const advisorDoc = useMemo(() => {
    const sources = [advisorData?.document_id, advisorData?.documento, advisorDocFromState];
    return sources.find((v) => v) || "";
  }, [advisorData, advisorDocFromState]);

  const meta = useMemo(() => (isCurrentPeriod ? parseNumber(advisorData?.presupuesto, 0) : 0), [advisorData, isCurrentPeriod]);
  const sales = useMemo(() => (Array.isArray(salesData?.sales) ? salesData.sales : []), [salesData]);
  const total = salesData?.total ?? sales.length;
  const cumplimiento = meta > 0 ? Math.round((parseNumber(total, 0) / meta) * 100) : 0;

  const advisorName = advisorData?.name || advisorData?.user_name || "Asesor";
  const advisorDistrict = advisorData?.district_claro || advisorData?.district || "N/D";

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

  const mappedNovelties = useMemo(
    () =>
      novelties.map((n) => ({
        id: n.id,
        name: n.user_name || advisorName,
        document_id: n.document_id || advisorDoc,
        novelty_type: n.novelty_type || n.type || "Novedad",
        start: n.start_date || n.start,
        end: n.end_date || n.end,
        notes: n.notes || "",
        district: n.district_claro || n.district || "",
        regional: n.regional || "",
        created_at: n.created_at,
        updated_at: n.updated_at
      })),
    [novelties, advisorName, advisorDoc]
  );

  useEffect(() => {
    const loadAdvisor = async () => {
      if (!advisorId) return;
      try {
        const res = await fetch(`${api}/api/users/${advisorId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "No se pudo cargar el asesor");
        setAdvisorData(json || null);
      } catch (err) {
        setError(err?.message || "No se pudo cargar la información del asesor");
        setAdvisorData(null);
      }
    };
    loadAdvisor();
  }, [advisorId, token]);

  useEffect(() => {
    const loadSales = async () => {
      if (!advisorDoc) {
        setError("No se encontró documento del asesor para consultar ventas");
        setSalesData(null);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const qs = new URLSearchParams({ period, advisor_id: String(advisorDoc) });
        const res = await fetch(`${api}/api/siapp/monthly/sales?${qs.toString()}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "No se pudo cargar las ventas");
        setSalesData(json || null);
      } catch (err) {
        setError(err?.message || "Error cargando ventas");
        setSalesData(null);
      } finally {
        setLoading(false);
      }
    };
    loadSales();
  }, [advisorDoc, period, token]);

  useEffect(() => {
    const loadNovelties = async () => {
      if (!advisorDoc && !advisorId) return;
      setNoveltyLoading(true);
      setNoveltyError("");
      try {
        const { date_from, date_to } = monthRange(period);
        const qs = new URLSearchParams({
          date_from,
          date_to,
          limit: "200",
          offset: "0",
          user_id: advisorId ?? "",
          advisor_id: advisorDoc ?? ""
        });
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${api}/api/novedades?${qs.toString()}`, { headers });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "No se pudieron cargar las novedades");
        const items = Array.isArray(json?.items) ? json.items : [];
        const filtered = items.filter((n) => {
          const uid = String(n.user_id ?? n.advisor_id ?? n.id_usuario ?? "");
          return uid === String(advisorId ?? advisorData?.id ?? "");
        });
        setNovelties(filtered);
      } catch (err) {
        setNoveltyError(err?.message || "No se pudieron cargar las novedades");
        setNovelties([]);
      } finally {
        setNoveltyLoading(false);
      }
    };
    loadNovelties();
  }, [advisorDoc, advisorId, advisorData, period, token]);

  // Small-screen mosaic: include "Resumen" as a tile so top area doesn't become 4 huge stacked blocks.
  const resumenSubtitle = isCurrentPeriod && meta > 0 ? `${total} / ${meta} conexiones` : `${total} conexiones registradas`;
  const resumenValue = isCurrentPeriod && meta > 0 ? `${total} / ${meta}` : `${total}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 min-w-full">
      <header>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
                <div className="mb-4 flex items-center text-sm text-slate-600">
                    <button onClick={handleBack} className="flex items-center font-semibold text-slate-700 hover:text-red-600">
                        <Icon path="M10 19 3 12l7-7m-7 7h18" className="mr-2 h-4 w-4" />
                        Volver
                    </button>
                </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">Detalle de Asesor</h1>
              <p className="text-sm text-slate-500">Ventas SIAPP y métricas del periodo seleccionado</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <PeriodSelector period={period} onChange={setPeriod} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 flex items-start gap-3">
            <AlertTriangle size={16} className="mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold">Error</div>
              <div className="mt-0.5 break-words">{error}</div>
            </div>
          </div>
        )}

        {/* Top mosaic cards:
            - Mobile: 2 cols mosaic, Resumen spans 2 cols
            - md+: keeps the clean desktop layout
        */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard title="Periodo" value={formatPeriodLabel(period)} subtitle={period} className="col-span-2 md:col-span-1" />

          {isCurrentPeriod ? (
            <>
              <KpiCard title="Presupuesto" value={meta > 0 ? meta : "N/A"} subtitle="Meta asignada" />
              <KpiCard
                title="Cumplimiento"
                value={meta > 0 ? `${cumplimiento}%` : "0%"}
                subtitle={meta > 0 ? `${total} / ${meta} conexiones` : `${total} conexiones registradas`}
              />
              <KpiCard
                title="Resumen"
                value={resumenValue}
                subtitle={resumenSubtitle}
                className="col-span-2 md:col-span-1"
              />
            </>
          ) : (
            <>
              <KpiCard title="Ventas del periodo" value={total} subtitle="Conexiones registradas" />
              <KpiCard title="Resumen" value={resumenValue} subtitle={resumenSubtitle} className="col-span-2 md:col-span-2" />
            </>
          )}
        </section>

        {/* Desktop/Tablet detailed summary block (kept), but now more robust on small screens */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm text-slate-500 font-semibold">Resumen</div>
              <div className="text-2xl font-extrabold text-slate-900 break-words">
                {total} conexiones {isCurrentPeriod && meta > 0 && <span className="text-slate-400">/ {meta}</span>}
              </div>
              <div className="text-sm text-slate-600 break-words">
                Asesor: <span className="font-bold">{advisorName}</span> · Distrito: {advisorDistrict}
              </div>
            </div>

            {isCurrentPeriod && meta > 0 && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <TrendingUp size={16} className="text-[#C62828]" />
                <span className="break-words">Faltan {Math.max(0, meta - total)} para cumplir la meta</span>
              </div>
            )}
          </div>

          {isCurrentPeriod && meta > 0 && (
            <div className="mt-3">
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C62828] transition-all duration-500"
                  style={{ width: `${Math.min(100, (total / meta) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </section>

        {/* Advisor info: prevent overflow (email/long fields) */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
            <User size={16} className="text-[#C62828]" /> Información del asesor
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-slate-700">
            <div className="flex items-center gap-2 min-w-0">
              <Hash size={14} className="text-slate-400 shrink-0" />
              <span className="truncate">{advisorDoc || "N/D"}</span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <Mail size={14} className="text-slate-400 shrink-0" />
              <span className="truncate">{advisorData?.email || "N/D"}</span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <Phone size={14} className="text-slate-400 shrink-0" />
              <span className="truncate">{advisorData?.phone || "N/D"}</span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <MapPin size={14} className="text-slate-400 shrink-0" />
              <span className="truncate">{advisorDistrict}</span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <MapPin size={14} className="text-slate-400 shrink-0" />
              <span className="truncate">{advisorData?.regional || "N/D"}</span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <Zap size={14} className="text-slate-400 shrink-0" />
              <span className="truncate">Cargo: {advisorData?.cargo || "N/D"}</span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FileText size={16} className="text-[#C62828]" /> Novedades del periodo
            </h3>
            {noveltyLoading && (
              <span className="text-xs text-slate-500 inline-flex items-center gap-1">
                <Loader2 size={14} className="animate-spin" /> Cargando
              </span>
            )}
          </div>

          {noveltyError && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2 mb-3 break-words">
              {noveltyError}
            </div>
          )}

          {mappedNovelties.length === 0 ? (
            <div className="text-sm text-slate-500">No hay novedades para este periodo.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {mappedNovelties.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedNovelty(n)}
                  className="w-full text-left py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-slate-50 rounded-lg px-2"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 break-words">{n.novelty_type}</div>
                    <div className="text-xs text-slate-500">
                      {formatDate(n.start)} {n.end ? `- ${formatDate(n.end)}` : ""}
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 sm:text-right break-words sm:max-w-[320px]">
                    {n.notes || "Sin notas"}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <SalesTable
          sales={filteredSales}
          loading={loading}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          onSelect={setSelectedSale}
        />
      </main>

      {selectedSale ? <SaleDetailModal sale={selectedSale} onClose={() => setSelectedSale(null)} /> : null}
      {selectedNovelty ? <NoveltyDetailModal novelty={selectedNovelty} onClose={() => setSelectedNovelty(null)} /> : null}
    </div>
  );
}
