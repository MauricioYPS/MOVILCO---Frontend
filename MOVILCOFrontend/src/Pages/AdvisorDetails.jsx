import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { api } from "../../store/api";
import SupervisorSalesPanel from "../Props/Advisors/SupervisorSalesPanel";
import { getStoredToken } from "../utils/auth";
const currentPeriod = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
};

const clampPercent = (value) => Math.min(100, Math.max(0, Number(value) || 0));

const formatPeriodLabel = (period) => {
    const [year, month] = (period || "").split("-");
    const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];
    const label = months[Number(month) - 1];
    return label && year ? `${label} ${year}` : "Periodo no definido";
};

const formatPeriodForApi = (value) => {
    const [year, month] = (value || "").split("-");
    if (!year || !month) return value;
    const paddedMonth = String(month).padStart(2, "0");
    return `${year}-${paddedMonth}`;
};

export default function AdvisorDetails({ onBack }) {
    const { id: idParam } = useParams();
    const location = useLocation();

    const advisorId = idParam || location.state?.advisor?.id;
    const selectedPeriod = location.state?.period || currentPeriod();
    const token = getStoredToken();

    const [userInfo, setUserInfo] = useState(null);
    const [kpi, setKpi] = useState(null);
    const [ventasDetalle, setVentasDetalle] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const goBack = () => {
        if (onBack) onBack();
        else window.history.back();
    };

    useEffect(() => {
        let active = true;
        const load = async () => {
            if (!advisorId) {
                setError("No se encontró el asesor solicitado.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError("");

                // Datos del asesor
                const userRes = await fetch(`${api}/api/users/${advisorId}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                });
                const userJson = await userRes.json();
                if (!userRes.ok) {
                    throw new Error(userJson?.message || "No se pudo cargar la información del asesor");
                }
                const userData = userJson || {};

                // KPI y detalle
                const documento = userData.document_id;
                if (!documento) {
                    throw new Error("El asesor no tiene documento asignado");
                }

                const periodApi = formatPeriodForApi(selectedPeriod);
                const kpiRes = await fetch(
                    `${api}/api/kpi/get?details=true&documento=${documento}&period=${periodApi}`,
                    { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
                );
                const kpiJson = await kpiRes.json();
                if (!kpiRes.ok) {
                    throw new Error(kpiJson?.message || "No se pudo cargar el historial del asesor");
                }
                const kpiData = kpiJson?.data?.[0] || {};

                if (!active) return;
                setUserInfo(userData);
                setKpi(kpiData);
                setVentasDetalle(kpiData.ventas_detalle || []);
            } catch (err) {
                if (!active) return;
                setError(err?.message || "Error cargando la información");
                setUserInfo(null);
                setKpi(null);
                setVentasDetalle([]);
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => {
            active = false;
        };
    }, [advisorId, selectedPeriod, token]);

    const resumen = useMemo(() => {
        const conexiones = Number(kpi?.ventas_totales || 0);
        const meta = Number(kpi?.presupuesto_prorrateado || 0);
        const cumplimiento = clampPercent(meta ? (conexiones / meta) * 100 : kpi?.cumple_global ? 100 : 0);
        return { conexiones, meta, cumplimiento };
    }, [kpi]);

    if (!advisorId) {
        return <div className="p-6 text-red-600">No se encontró el asesor solicitado.</div>;
    }

    if (loading) {
        return <div className="p-6 text-gray-700">Cargando información del asesor...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">Error: {error}</div>;
    }

    const display = {
        nombre: userInfo?.name || "Asesor sin nombre",
        cedula: userInfo?.document_id || "N/A",
        cargo: userInfo?.cargo || "N/A",
        telefono: userInfo?.phone || "N/D",
        correo: userInfo?.email || "N/D",
        role: userInfo?.role || "N/D",
        activo: userInfo?.active ? "Activo" : "Inactivo",
        distrito: userInfo?.district || userInfo?.district_claro || "N/D",
    };

    return (
        <div className="flex min-h-screen bg-secundario font-sans">
            <main className="flex-1 p-6 md:p-8 lg:pl-12 pb-16">
                <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center text-sm text-gray-600 hover:text-principal font-medium mb-2 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver
                </button>

                <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Dashboard del Asesor</h2>
                        <p className="text-gray-600">
                            Viendo a: <span className="font-semibold text-gray-800">{display.nombre}</span>
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <StatCard label="Mes Actual" value={formatPeriodLabel(selectedPeriod)} />
                    <StatCard label="Conexiones" value={resumen.conexiones} />
                    <StatCard label="Meta" value={resumen.meta} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <AdvisorInfo display={display} cumplimiento={resumen.cumplimiento} />
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <SalesTable ventas={ventasDetalle} />
                        <SupervisorSalesPanel advisorId={advisorId} period={selectedPeriod} />
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4">
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}

function AdvisorInfo({ display, cumplimiento }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Asesor</h2>
            <div className="space-y-3">
                <InfoRow label="Cédula" value={display.cedula} />
                <InfoRow label="Cargo" value={display.cargo} />
                <InfoRow label="Teléfono" value={display.telefono} />
                <InfoRow label="Correo" value={display.correo} small />
                <InfoRow label="Rol" value={display.role} />
                <InfoRow label="Estado" value={display.activo} />
                <InfoRow label="Distrito" value={display.distrito} />
                <InfoRow label="Cumplimiento" value={`${Math.round(cumplimiento)}%`} />
            </div>
        </div>
    );
}

function SalesTable({ ventas }) {
    const [showAll, setShowAll] = useState(false);
    const visibleVentas = showAll ? ventas : ventas.slice(0, 8);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Historial de conexiones</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-gray-200">
                        <tr>
                            <Th>Fecha</Th>
                            <Th>Paquete</Th>
                            <Th>Tipo producto</Th>
                            <Th>Estrato</Th>
                            <Th>Tipo red</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventas.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-4 px-4 text-gray-600 text-sm">
                                    No hay conexiones registradas en este periodo.
                                </td>
                            </tr>
                        )}
                        {visibleVentas.map((v) => (
                            <VentaRow
                                key={v.id}
                                fecha={v.fecha?.slice(0, 10) || "-"}
                                paquete={v.paquete_pvd || "N/D"}
                                tipoProducto={v.tipo_prodcuto || v.tipo_contrato || "N/D"}
                                estrato={v.estrato || "N/D"}
                                tipoRed={v.tipored || "N/D"}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            {ventas.length > 8 && (
                <div className="flex justify-center mt-4">
                    <button
                        type="button"
                        onClick={() => setShowAll((prev) => !prev)}
                        className="flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
                    >
                        <span>{showAll ? "Mostrar menos" : "Ver más"}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

function InfoRow({ label, value, small }) {
    return (
        <div className="flex justify-between flex-col">
            <span className="text-sm font-medium text-gray-500">{label}</span>
            <span className={`font-semibold text-gray-800 ${small ? "text-sm" : ""}`}>{value}</span>
        </div>
    );
}

function Th({ children }) {
    return (
        <th className="py-3 px-4 text-sm font-semibold text-gray-500 uppercase">
            {children}
        </th>
    );
}

function VentaRow({ fecha, paquete, tipoProducto, estrato, tipoRed }) {
    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-4 px-4 text-gray-600">{fecha}</td>
            <td className="py-4 px-4 font-medium text-gray-800">{paquete}</td>
            <td className="py-4 px-4 text-gray-600">{tipoProducto}</td>
            <td className="py-4 px-4 text-gray-600">{estrato}</td>
            <td className="py-4 px-4 text-gray-600">{tipoRed}</td>
        </tr>
    );
}
