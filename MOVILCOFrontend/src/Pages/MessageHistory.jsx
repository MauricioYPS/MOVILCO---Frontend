import { useMemo, useState } from "react";

// --- Datos quemados (puedes moverlos a /mock) ---
const mockAsesores = [
  { id: 1, nombre: "Carlos Mendoza" },
  { id: 2, nombre: "Ana Gutierrez" },
  { id: 3, nombre: "Luis Jimenez" },
];

const mockNotificationHistory = [
  { asesorId: 1, asesorNombre: "Carlos Mendoza", asunto: "Incumplimiento de Presupuesto", fecha: "2025-10-22 10:30", estado: "Visto" },
  { asesorId: 1, asesorNombre: "Carlos Mendoza", asunto: "Recordatorio Capacitación",  fecha: "2025-10-15 14:00", estado: "Recibido" },
  { asesorId: 2, asesorNombre: "Ana Gutierrez",   asunto: "Asignación de Presupuesto", fecha: "2025-10-01 09:00", estado: "Visto" },
];

const mockStatsHistory = [
  { asesorId: 1, asesorNombre: "Carlos Mendoza", mes: "2025-09", cumplimiento: "80%", insumos: 15 },
  { asesorId: 1, asesorNombre: "Carlos Mendoza", mes: "2025-08", cumplimiento: "75%", insumos: 14 },
  { asesorId: 2, asesorNombre: "Ana Gutierrez",  mes: "2025-09", cumplimiento: "95%", insumos: 19 },
];


export default function MessageHistory() {
  const [tab, setTab] = useState("notificaciones"); // 'notificaciones' | 'estadisticas'
  const [asesor, setAsesor] = useState(1); // id del asesor; usa 'all' para todo

  const asesoresOptions = useMemo(
    () => [{ id: "all", nombre: "Mostrar todo el historial" }, ...mockAsesores],
    []
  );

  const notifs = useMemo(() => {
    return mockNotificationHistory.filter((r) => asesor === "all" || r.asesorId === asesor);
  }, [asesor]);

  const stats = useMemo(() => {
    return mockStatsHistory.filter((r) => asesor === "all" || r.asesorId === asesor);
  }, [asesor]);

  return (
    <>
    <div className="w-full justify-center flex ">
    <div id="view-historial" className="view-content w-[95%] mt-10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Historial y Reportes</h1>

      {/* Selector de asesor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Asesor:</label>
        <select
          value={asesor}
          onChange={(e) => {
            const v = e.target.value === "all" ? "all" : Number(e.target.value);
            setAsesor(v);
          }}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc0000]"
        >
          {asesoresOptions.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab("notificaciones")}
          className={`px-6 py-3 text-sm md:text-base font-medium border-b-2 ${
            tab === "notificaciones"
              ? "text-[#cc0000] border-[#cc0000]"
              : "text-gray-500 border-transparent hover:text-[#cc0000]"
          }`}
        >
          Historial de Notificaciones
        </button>
        <button
          onClick={() => setTab("estadisticas")}
          className={`px-6 py-3 text-sm md:text-base font-medium border-b-2 ${
            tab === "estadisticas"
              ? "text-[#cc0000] border-[#cc0000]"
              : "text-gray-500 border-transparent hover:text-[#cc0000]"
          }`}
        >
          Historial de Estadísticas
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        {tab === "notificaciones" ? (
          <TabNotificaciones rows={notifs} />
        ) : (
          <TabEstadisticas rows={stats} />
        )}
      </div>
    </div>
    </div>
  </>);
}

function TabNotificaciones({ rows }) {
  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Registro de Notificaciones</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Asesor", "Asunto", "Fecha", "Estado"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((r, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-900">{r.asesorNombre}</td>
                <td className="px-6 py-3 text-sm text-gray-900">{r.asunto}</td>
                <td className="px-6 py-3 text-sm text-gray-900">{r.fecha}</td>
                <td className="px-6 py-3 text-sm text-gray-900">
                  <span className="inline-flex items-center gap-2">
                    <ion-icon
                      name={r.estado === "Visto" ? "checkmark-done-outline" : "checkmark-outline"}
                      class="text-sky-600"
                    ></ion-icon>
                    {r.estado}
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-sm text-gray-500">
                  Sin registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function TabEstadisticas({ rows }) {
  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Rendimiento Histórico</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Asesor", "Mes", "Cumplimiento", "Insumos"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((r, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-900">{r.asesorNombre}</td>
                <td className="px-6 py-3 text-sm text-gray-900">{r.mes}</td>
                <td className="px-6 py-3 text-sm text-gray-900">{r.cumplimiento}</td>
                <td className="px-6 py-3 text-sm text-gray-900">{r.insumos}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-sm text-gray-500">
                  Sin registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
