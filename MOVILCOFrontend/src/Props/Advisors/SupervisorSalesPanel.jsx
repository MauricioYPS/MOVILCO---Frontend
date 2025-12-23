import { useEffect, useState } from "react";
import { getStoredToken, getStoredUser } from "../../utils/auth";
import { api } from "../../../store/api";

const formatPeriodForApi = (value) => value?.replace(/-0?(\d{1,2})$/, "-$1");

const normalizeSale = (sale) => ({
  id: sale.id,
  fecha: sale.fecha?.slice(0, 10) || sale.fecha || "-",
  cliente: sale.nombreasesor || sale.nombre || sale.nombre_comercial || sale.cliente || "N/D",
  producto: sale.paquete_pvd || sale.linea_negocio || sale.producto || "N/D",
  estrato: sale.estrato || sale.estrato_social || "-",
  raw: sale,
});

export default function SupervisorSalesPanel({ advisorId, period }) {
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [pendingSales, setPendingSales] = useState([]);
  const [approvedSales, setApprovedSales] = useState([]);
  const [ciapList, setCiapList] = useState([]);
  const [exportedIds, setExportedIds] = useState(new Set());
  const [monthExported, setMonthExported] = useState(false);

  const token = getStoredToken();
  const coordinatorId = getStoredUser()?.coordinator_id || getStoredUser()?.id;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : undefined;

  const loadPending = async () => {
    if (!coordinatorId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${api}/api/advisor/sales/raw/pending?coordinator_id=${coordinatorId}`,
        { headers: authHeaders }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "No se pudo cargar pendientes");
      const rows = Array.isArray(json) ? json : json?.rows || json?.data || [];
      setPendingSales(rows.map(normalizeSale));
    } catch (err) {
      console.error(err);
      setPendingSales([]);
    } finally {
      setLoading(false);
    }
  };

  const loadApproved = async () => {
    if (!coordinatorId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${api}/api/coordinator/sales/coordinator?coordinator_id=${coordinatorId}`,
        { headers: authHeaders }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "No se pudo cargar aprobadas");
      const rows = Array.isArray(json) ? json : json?.rows || json?.data || [];
      setApprovedSales(rows.map(normalizeSale));
    } catch (err) {
      console.error(err);
      setApprovedSales([]);
    } finally {
      setLoading(false);
    }
  };

  const approveSale = async (sale) => {
    if (!sale?.id) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${api}/api/workflow/sales/workflow/approve/${sale.id}`,
        { method: "PUT", headers: authHeaders }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "No se pudo aprobar la venta");
      setPendingSales((prev) => prev.filter((s) => s.id !== sale.id));
      await loadApproved();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const editSale = async (sale) => {
    if (!sale?.id) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${api}/api/coordinator/sales/coordinator/${sale.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...(authHeaders || {}) },
          body: JSON.stringify(sale.raw || sale),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "No se pudo editar la venta");
      await loadApproved();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportSale = async (sale) => {
    if (!sale?.id) return;
    if (exportedIds.has(sale.id)) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${api}/api/workflow/sales/workflow/export/${sale.id}`,
        { method: "PUT", headers: authHeaders }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "No se pudo exportar la venta");
      setExportedIds((prev) => {
        const next = new Set(prev);
        next.add(sale.id);
        return next;
      });
      await loadApproved();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportMonth = async () => {
    if (!coordinatorId) return;
    if (monthExported) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${api}/api/workflow/sales/workflow/export-month?month=${formatPeriodForApi(period)}&coordinator_id=${coordinatorId}`,
        { method: "PUT", headers: authHeaders }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "No se pudo exportar el mes");
      setMonthExported(true);
      setCiapList((prev) => prev);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const storedUser = JSON.parse(localStorage.getItem("auth_user") || "{}");
  const role = storedUser?.role || "";


  useEffect(() => {
    if (activeTab === "pending") loadPending();
    if (activeTab === "approved") loadApproved();
  }, [activeTab]);

  if(role === "COORDINACION"){
    return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Gestion de Ventas del Coordinador
      </h2>

      <div className="flex gap-2 border-b mb-6">
        <Tab label="Pendientes" active={activeTab === "pending"} onClick={() => setActiveTab("pending")} />
        <Tab label="Aprobadas" active={activeTab === "approved"} onClick={() => setActiveTab("approved")} />
        <Tab label="CIAP" active={activeTab === "ciap"} onClick={() => setActiveTab("ciap")} />
      </div>

      {loading && (
        <div className="text-center py-6 text-gray-500">
          Cargando informaci&oacute;n...
        </div>
      )}

      {!loading && activeTab === "pending" && (
        <SalesTable
          data={pendingSales}
          emptyText="No hay ventas pendientes por aprobar"
          actions={[
            { label: "Aprobar", onClick: approveSale },
            { label: "Editar", onClick: editSale },
            { label: "Ver" },
          ]}
        />
      )}

      {!loading && activeTab === "approved" && (
        <SalesTable
          data={approvedSales}
          emptyText="No hay ventas aprobadas"
          actions={[
            // { label: "Editar", onClick: editSale },
            { label: "Exportar CIAP", onClick: exportSale, disabled: (item) => exportedIds.has(item.id) },
            // { label: "Ver" },
          ]}
        />
      )}

      {!loading && activeTab === "ciap" && (
        <CiapTable data={ciapList} onExportMonth={exportMonth} monthExported={monthExported} />
      )}
    </div>
  );}
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-t-md
        ${
          active
            ? "text-red-600 border-b-2 border-red-600 bg-red-50"
            : "text-gray-500 hover:text-gray-700"
        }`}
    >
      {label}
    </button>
  );
}

function SalesTable({ data, emptyText, actions }) {
  if (!data.length) {
    return (
      <div className="text-center py-6 text-gray-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="py-2">Fecha</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Estrato</th>
            <th className="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} className="border-b last:border-0">
              <td className="py-2">{item.fecha}</td>
              <td>{item.cliente}</td>
              <td className="text-blue-600">{item.producto}</td>
              <td>{item.estrato}</td>
              <td className="text-right space-x-2">
                {actions.map(action => {
                  const disabled = typeof action.disabled === "function" ? action.disabled(item) : action.disabled;
                  return (
                    <button
                      key={action.label || action}
                      className={`text-xs px-3 py-1 rounded-md border ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
                      onClick={disabled ? undefined : action.onClick ? () => action.onClick(item) : undefined}
                      disabled={disabled}
                    >
                      {disabled ? "Exportado" : action.label || action}
                    </button>
                  );
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CiapTable({ data, onExportMonth, monthExported }) {
  if (!data.length) {
    return (
      <div className="text-center py-6 text-gray-500">
        No hay CIAP generados
        <div className="mt-3">
          <button
            className={`text-xs px-3 py-1 rounded-md border ${monthExported ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
            onClick={monthExported ? undefined : onExportMonth}
            disabled={monthExported}
          >
            {monthExported ? "Mes exportado" : "Exportar mes a SIAPP"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="py-2">Fecha</th>
            <th>Total ventas</th>
            <th>Estado</th>
            <th className="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(ciap => (
            <tr key={ciap.id} className="border-b last:border-0">
              <td className="py-2">{ciap.fecha}</td>
              <td>{ciap.totalVentas}</td>
              <td className="text-green-600">{ciap.estado}</td>
              <td className="text-right space-x-2">
                <button className="text-xs px-3 py-1 rounded-md border">
                  Ver
                </button>
                <button className="text-xs px-3 py-1 rounded-md border" onClick={onExportMonth}>
                  Descargar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
