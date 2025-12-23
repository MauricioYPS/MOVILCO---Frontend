import { Fragment, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { getStoredUser, getStoredToken } from "../utils/auth";
import { api } from "../../store/api";

const getCurrentPeriod = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${now.getFullYear()}-${month}`;
};

const formatPeriodForApi = (value) => value?.replace(/-0?(\d{1,2})$/, "-$1");

function WeeklyHeader({ selectedWeek, onChange, weeks }) {
    const currentIndex = weeks.findIndex(w => w.week_number === selectedWeek);

    const handlePrev = () => {
        if (currentIndex > 0) onChange(weeks[currentIndex - 1].week_number);
    };
    const handleNext = () => {
        if (currentIndex >= 0 && currentIndex < weeks.length - 1) {
            onChange(weeks[currentIndex + 1].week_number);
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 w-full min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 break-words">
                RECREO Semanal - Coordinacion
            </h1>

            <div className="flex flex-wrap items-center gap-3">
                <button
                    disabled={currentIndex <= 0}
                    onClick={handlePrev}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                    <ChevronLeft size={20} />
                </button>

                <span className="text-lg font-semibold">
                    Semana {selectedWeek ?? "-"}
                </span>

                <button
                    disabled={currentIndex === -1 || currentIndex >= weeks.length - 1}
                    onClick={handleNext}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}

function PeriodFilter({ value, onChange, onApply, loading }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                <label className="text-sm text-gray-600">Periodo:</label>
                <input
                    type="month"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto max-w-xs"
                />
            </div>
            {/* <button
                onClick={onApply}
                disabled={!value || loading}
                className="self-start px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-60"
            >
                Periodo
            </button> */}
        </div>
    );
}

function WeeklySummary({ data }) {
    const totalVentas = data.reduce((a, b) => a + b.ventas_totales, 0);
    const activos = data.filter(d => d.estado).length;
    const novedades = data.reduce((acc, b) => acc + (b.novedades?.length || 0), 0);

    const cards = [
        { title: "Ventas Totales", value: totalVentas },
        { title: "Asesores Activos", value: activos },
        { title: "Novedades Semana", value: novedades },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 w-full min-w-0">
            {cards.map((c, i) => (
                <div key={i} className="bg-white shadow rounded-xl p-5 border border-gray-100">
                    <p className="text-sm text-gray-500">{c.title}</p>
                    <p className="text-3xl font-bold mt-1">{c.value}</p>
                </div>
            ))}
        </div>
    );
}

function WeeklyRanking({ data }) {
    const ranking = [...data].sort((a, b) => b.ventas_totales - a.ventas_totales);

    return (
        <div className="bg-white shadow rounded-xl p-6 border border-gray-100 mb-6 w-full min-w-0">
            <h2 className="text-xl font-semibold mb-4">Ranking Semanal</h2>

            <div className="space-y-3">
                {ranking.map((r, i) => (
                    <div key={r.asesor_id} className="flex items-center justify-between gap-3 border px-3 py-2 border-dashed rounded-lg">
                        <div className="min-w-0">
                            <p className="font-medium truncate">{i + 1}. {r.nombre}</p>
                            <p className="text-sm text-gray-500 truncate">{r.distrito_claro}</p>
                        </div>
                        <p className="text-lg font-bold shrink-0">{r.ventas_totales}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function WeeklyTable({ data, period }) {
    const [openDoc, setOpenDoc] = useState(null);
    const [details, setDetails] = useState({});
    const token = getStoredToken();

    const fetchDetails = async (advisor) => {
        const doc = advisor.documento;
        setDetails(prev => ({
            ...prev,
            [doc]: { ...(prev[doc] || {}), loading: true, error: "", items: prev[doc]?.items || [] }
        }));
        try {
            const res = await fetch(
                `${api}/api/kpi/get?details=true&documento=${doc}&period=${formatPeriodForApi(period)}`,
                { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
            );
            const contentType = res.headers.get("content-type") || "";
            if (!contentType.includes("application/json")) {
                const statusInfo = `${res.status} ${res.statusText}`.trim();
                throw new Error(`Respuesta inesperada del servidor (${statusInfo})`);
            }
            const json = await res.json();
            if (!res.ok) {
                const msg = json?.message || json?.error || "No se pudo cargar el detalle del asesor";
                throw new Error(msg);
            }
            const items = json?.data?.[0]?.ventas_detalle || [];
            setDetails(prev => ({
                ...prev,
                [doc]: { loading: false, error: "", items }
            }));
        } catch (err) {
            setDetails(prev => ({
                ...prev,
                [doc]: { loading: false, error: err?.message || "Error cargando detalle", items: [] }
            }));
        }
    };

    const toggleAdvisor = (advisor) => {
        const doc = advisor.documento;
        if (openDoc === doc) {
            setOpenDoc(null);
            return;
        }
        setOpenDoc(doc);
        const current = details[doc];
        if (!current || (!current.items?.length && !current.loading)) {
            fetchDetails(advisor);
        }
    };

    const renderDetailsRow = (advisor) => {
        const doc = advisor.documento;
        const state = details[doc] || {};
        const items = state.items || [];
        return (
            <tr key={`${doc}-details`} className="bg-gray-50">
                <td colSpan={6} className="p-4">
                    {state.loading && (
                        <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
                            Cargando detalle...
                        </div>
                    )}
                    {state.error && (
                        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                            {state.error}
                        </div>
                    )}
                    {!state.loading && !state.error && !items.length && (
                        <div className="text-sm text-gray-600">Sin ventas detalladas en este periodo.</div>
                    )}
                    {!state.loading && !state.error && items.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                                <thead className="bg-white">
                                    <tr className="border">
                                        <th className="px-2 py-1 text-left">Fecha</th>
                                        <th className="px-2 py-1 text-left">Zona</th>
                                        <th className="px-2 py-1 text-left">Poblacion</th>
                                        <th className="px-2 py-1 text-left">Linea</th>
                                        <th className="px-2 py-1 text-left">Cuenta</th>
                                        <th className="px-2 py-1 text-left">OT</th>
                                        <th className="px-2 py-1 text-left">Tipo</th>
                                        <th className="px-2 py-1 text-left">Renta</th>
                                        <th className="px-2 py-1 text-left">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(item => (
                                        <tr key={item.id} className="border-t">
                                            <td className="px-2 py-1">{item.fecha?.slice(0, 10) || "-"}</td>
                                            <td className="px-2 py-1">{item.zona || item.area || "-"}</td>
                                            <td className="px-2 py-1">{item.poblacion || "-"}</td>
                                            <td className="px-2 py-1">{item.linea_negocio || "-"}</td>
                                            <td className="px-2 py-1">{item.cuenta || "-"}</td>
                                            <td className="px-2 py-1">{item.ot || "-"}</td>
                                            <td className="px-2 py-1">{item.tipo_contrato || item.tipo_prodcuto || "-"}</td>
                                            <td className="px-2 py-1">{item.renta || "-"}</td>
                                            <td className="px-2 py-1">{item.estado_liquidacion || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </td>
            </tr>
        );
    };

    const renderDetailContent = (advisor) => {
        const doc = advisor.documento;
        const state = details[doc] || {};
        const items = state.items || [];
        return (
            <div className="mt-3 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                {state.loading && (
                    <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        Cargando detalle...
                    </div>
                )}
                {state.error && (
                    <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                        {state.error}
                    </div>
                )}
                {!state.loading && !state.error && !items.length && (
                    <div className="text-sm text-gray-600">Sin ventas detalladas en este periodo.</div>
                )}
                {!state.loading && !state.error && items.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-xs">
                            <thead className="bg-white">
                                <tr className="border">
                                    <th className="px-2 py-1 text-left">Fecha</th>
                                    <th className="px-2 py-1 text-left">Zona</th>
                                    <th className="px-2 py-1 text-left">Poblacion</th>
                                    <th className="px-2 py-1 text-left">Linea</th>
                                    <th className="px-2 py-1 text-left">Cuenta</th>
                                    <th className="px-2 py-1 text-left">OT</th>
                                    <th className="px-2 py-1 text-left">Tipo</th>
                                    <th className="px-2 py-1 text-left">Renta</th>
                                    <th className="px-2 py-1 text-left">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-2 py-1 whitespace-nowrap">{item.fecha?.slice(0, 10) || "-"}</td>
                                        <td className="px-2 py-1 whitespace-nowrap">{item.zona || item.area || "-"}</td>
                                        <td className="px-2 py-1 whitespace-nowrap">{item.poblacion || "-"}</td>
                                        <td className="px-2 py-1 whitespace-nowrap">{item.linea_negocio || "-"}</td>
                                        <td className="px-2 py-1 whitespace-nowrap">{item.cuenta || "-"}</td>
                                        <td className="px-2 py-1 whitespace-nowrap">{item.ot || "-"}</td>
                                        <td className="px-2 py-1 whitespace-nowrap">{item.tipo_contrato || item.tipo_prodcuto || "-"}</td>
                                        <td className="px-2 py-1 whitespace-nowrap">{item.renta || "-"}</td>
                                        <td className="px-2 py-1 whitespace-nowrap">{item.estado_liquidacion || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4 w-full min-w-0">
            <div className="bg-white shadow rounded-xl border border-gray-100 overflow-x-auto hidden md:block">
                <table className="min-w-full text-sm min-w-[760px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">Asesor</th>
                            <th className="px-4 py-2">Distrito</th>
                            <th className="px-4 py-2">Ventas Distrito</th>
                            <th className="px-4 py-2">Fuera</th>
                            <th className="px-4 py-2">Totales</th>
                            <th className="px-4 py-2">Novedades</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(r => {
                            const isOpen = openDoc === r.documento;
                            return (
                                <Fragment key={r.documento || r.asesor_id}>
                                    <tr
                                        className={`border-t cursor-pointer hover:bg-gray-50 ${isOpen ? "bg-gray-50" : ""}`}
                                        onClick={() => toggleAdvisor(r)}
                                    >
                                        <td className="px-4 py-2 flex items-center gap-2">
                                            <span>{r.nombre}</span>
                                            <span className="text-gray-500">
                                                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">{r.distrito_claro}</td>
                                        <td className="px-4 py-2 text-center">{r.ventas_distrito}</td>
                                        <td className="px-4 py-2 text-center">{r.ventas_fuera}</td>
                                        <td className="px-4 py-2 text-center font-bold">{r.ventas_totales}</td>
                                        <td className="px-4 py-2">
                                            {r.novedades?.length ? (
                                                <span className="text-red-600 font-semibold">
                                                    {r.novedades.length} novedades
                                                </span>
                                            ) : "Sin novedades"}
                                        </td>
                                    </tr>
                                    {isOpen && (
                                        <tr className="bg-gray-50">
                                            <td colSpan={6} className="p-4">
                                                {renderDetailContent(r)}
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-3">
                {data.map((r) => {
                    const isOpen = openDoc === r.documento;
                    return (
                        <div
                            key={r.documento || r.asesor_id}
                            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                        >
                            <button
                                className="flex w-full items-start justify-between gap-2 text-left"
                                onClick={() => toggleAdvisor(r)}
                            >
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{r.nombre}</p>
                                    <p className="text-xs text-gray-500">{r.documento}</p>
                                </div>
                                <span className="text-gray-500">
                                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </span>
                            </button>

                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                                <div className="rounded-lg bg-gray-50 px-3 py-2">
                                    <p className="text-[10px] uppercase text-gray-400">Distrito</p>
                                    <p className="font-semibold text-gray-800">{r.distrito_claro}</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 px-3 py-2">
                                    <p className="text-[10px] uppercase text-gray-400">Ventas Distrito</p>
                                    <p className="font-semibold text-gray-800">{r.ventas_distrito}</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 px-3 py-2">
                                    <p className="text-[10px] uppercase text-gray-400">Ventas Fuera</p>
                                    <p className="font-semibold text-gray-800">{r.ventas_fuera}</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 px-3 py-2">
                                    <p className="text-[10px] uppercase text-gray-400">Totales</p>
                                    <p className="text-base font-bold text-gray-900">{r.ventas_totales}</p>
                                </div>
                                <div className="col-span-2 rounded-lg bg-red-50 px-3 py-2 text-red-700">
                                    {r.novedades?.length ? `${r.novedades.length} novedades` : "Sin novedades"}
                                </div>
                            </div>

                            {isOpen && renderDetailContent(r)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function WeeklyTrend({ data }) {
    const weeks = [...new Set(data.map(d => d.week_number))].sort((a, b) => a - b);
    if (!weeks.length) return null;

    const totals = weeks.map(w =>
        data
            .filter(d => d.week_number === w)
            .reduce((a, b) => a + b.ventas_totales, 0)
    );

    const chartHeight = 240;
    const chartWidth = Math.max(weeks.length * 120, 360);
    const padding = 28;
    const maxTotal = Math.max(...totals, 1);

    const xPositions = weeks.map((_, idx) => {
        if (weeks.length === 1) {
            return chartWidth / 2;
        }
        return padding + (idx / (weeks.length - 1)) * (chartWidth - padding * 2);
    });

    const yPositions = totals.map(value =>
        chartHeight - padding - (value / maxTotal) * (chartHeight - padding * 2)
    );

    const linePoints = xPositions
        .map((x, i) => `${x},${yPositions[i]}`)
        .join(" ");

    const areaPoints = [
        `${padding},${chartHeight - padding}`,
        ...xPositions.map((x, i) => `${x},${yPositions[i]}`),
        `${xPositions.at(-1) ?? padding},${chartHeight - padding}`
    ].join(" ");

    return (
        <div className="bg-white shadow rounded-xl p-6 border border-gray-100 w-full min-w-0">
            <h2 className="text-xl font-semibold mb-4">Tendencia Semanal</h2>

            <div className="overflow-x-auto">
                <div className="h-64" style={{ minWidth: `${chartWidth}px` }}>
                    <svg
                        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                        width={chartWidth}
                        height={chartHeight}
                        className="h-full w-full"
                    >
                        <defs>
                            <linearGradient id="weeklyTrendFill" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
                                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <polygon points={areaPoints} fill="url(#weeklyTrendFill)" />
                        <polyline
                            points={linePoints}
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {xPositions.map((x, i) => (
                            <g key={weeks[i]}>
                                <circle cx={x} cy={yPositions[i]} r="4" fill="#2563eb" />
                                <text
                                    x={x}
                                    y={chartHeight - 10}
                                    textAnchor="middle"
                                    className="fill-gray-600 text-[11px]"
                                >
                                    Semana {weeks[i]}
                                </text>
                                <text
                                    x={x}
                                    y={yPositions[i] - 12}
                                    textAnchor="middle"
                                    className="fill-gray-800 text-xs font-semibold"
                                >
                                    {totals[i]}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default function WeeklyCoordinatorPage() {
    const [data, setData] = useState([]);
    const [weeks, setWeeks] = useState([]);
    const [week, setWeek] = useState(null);
    const [period, setPeriod] = useState(getCurrentPeriod());
    const [periodInput, setPeriodInput] = useState(getCurrentPeriod());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const storedUser = getStoredUser();
    const coordId = storedUser?.id ?? storedUser?.user_id ?? storedUser?.coord_id ?? storedUser?.auth_user_id;
    const token = getStoredToken();

    async function load(selectedPeriod) {
        if (!coordId) {
            setError("No se encontro el usuario coordinador");
            setData([]);
            setWeeks([]);
            setWeek(null);
            return;
        }

        try {
            setLoading(true);
            setError("");
            const apiPeriod = formatPeriodForApi(selectedPeriod);
            const res = await fetch(`${api}/api/kpi/weekly?coord_id=${coordId}&period=${apiPeriod}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            const contentType = res.headers.get("content-type") || "";
            if (!contentType.includes("application/json")) {
                const statusInfo = `${res.status} ${res.statusText}`.trim();
                throw new Error(`Respuesta inesperada del servidor (${statusInfo})`);
            }
            const json = await res.json();
            if (!res.ok) {
                const msg = json?.message || json?.error || "No se pudo cargar la informacion semanal";
                throw new Error(msg);
            }
            const rows = json?.rows || [];
            setData(rows);

            const ws = [...new Set(rows.map(r => r.week_number))];
            const orderedWeeks = [...ws].sort((a, b) => a - b);
            setWeeks(orderedWeeks.map(w => ({ week_number: w })));

            if (!orderedWeeks.length) {
                setWeek(null);
                return;
            }
            if (!week || !orderedWeeks.includes(week)) {
                setWeek(orderedWeeks[0]);
            }
        } catch (err) {
            setError(err?.message || "Error cargando los datos");
            setData([]);
            setWeeks([]);
            setWeek(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load(period);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period, coordId]);

    const filtered = week ? data.filter(d => d.week_number === week) : [];

    return (
        <div className="w-full min-w-0 max-w-screen-2xl mx-auto px-3 py-6 sm:px-4 md:px-6 space-y-6">
            <WeeklyHeader
                selectedWeek={week}
                weeks={weeks}
                onChange={setWeek}
            />

            <PeriodFilter
                value={periodInput}
                onChange={setPeriodInput}
                onApply={() => periodInput && setPeriod(periodInput)}
                loading={loading}
            />

            {error && (
                <div className="p-3 rounded-lg bg-red-100 text-red-700 border border-red-200">
                    {error}
                </div>
            )}

            {loading && (
                <div className="p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                    Cargando datos...
                </div>
            )}

            <WeeklySummary data={filtered} />

            <WeeklyRanking data={filtered} />

            <WeeklyTable data={filtered} period={period} />

            <WeeklyTrend data={data} />
        </div>
    );
}
