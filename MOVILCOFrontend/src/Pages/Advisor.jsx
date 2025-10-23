import { useMemo, useState } from "react";
import { mockAsesores } from "../Props/Advisors/datosquemados";
import AdvisorsListItem from "../Props/Advisors/AdvisorsListItem";
import SummaryCard from "../Props/Advisors/SummaryCard";
import MetricCard from "../Props/Advisors/MetricCard";
import InfoField from "../Props/Advisors/InfoField";
import { useNavigate } from "react-router-dom";

export default function Advisors() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(null); // "incumplimiento" | "completas" | "novedades" | "fin_contrato" | null
  const [selected, setSelected] = useState(null);

  // Totales para tarjetas resumen
  const counts = useMemo(() => ({
    incumplimiento: mockAsesores.filter(a => a.status === "incumplimiento" || a.cumplimiento < 80).length,
    completas:      mockAsesores.filter(a => a.cumplimiento === 100 || a.status === "completas").length,
    novedades:      mockAsesores.filter(a => a.status === "novedades").length,
    finContrato:    mockAsesores.filter(a => a.status === "fin_contrato").length,
  }), []);

  // Lista filtrada por query + filtro resumen
  const list = useMemo(() => {
    let L = [...mockAsesores];
    if (filter) {
      if (filter === "incumplimiento") L = L.filter(a => a.status === "incumplimiento" || a.cumplimiento < 80);
      if (filter === "completas")      L = L.filter(a => a.cumplimiento === 100 || a.status === "completas");
      if (filter === "novedades")      L = L.filter(a => a.status === "novedades");
      if (filter === "fin_contrato")   L = L.filter(a => a.status === "fin_contrato");
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      L = L.filter(a =>
        [a.nombre, a.distrito, a.regional, a.cargo].join(" ").toLowerCase().includes(q)
      );
    }
    return L;
  }, [query, filter]);

  const navigate = useNavigate();
  // Etiqueta de estado (pill) similar a la captura
  const statusPill = (a) => {
    if (!a) return null;
    const map = {
      incumplimiento: "bg-red-100 text-red-700",
      completas: "bg-green-100 text-green-700",
      novedades: "bg-blue-100 text-blue-700",
      fin_contrato: "bg-gray-100 text-gray-700",
      en_progreso: "bg-amber-100 text-amber-700",
    };
    const text = {
      incumplimiento: "Incumplimiento",
      completas: "Completo",
      novedades: "Novedades",
      fin_contrato: "Fin de contrato",
      en_progreso: "En progreso",
    };
    return <span className={`text-sm font-medium px-3 py-1 rounded-full ${map[a.status]}`}>{text[a.status] || a.status}</span>;
  };

  return (
    <div id="view-asesores" className="view-content w-full flex justify-center">
      <div className="flex flex-col md:flex-row gap-6 min-h-screen h-auto mt-10 w-[96%]">
        {/* Columna izquierda: lista + buscador */}
        <div className="w-full md:w-1/3">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Lista de Asesores</h2>

            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Buscar por nombre, distrito..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc0000]"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <ion-icon name="search-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></ion-icon>
            </div>

            {query && (
              <button
                onClick={() => setQuery("")}
                className="w-full text-sm text-[#cc0000] mb-4 hover:underline text-left"
              >
                Limpiar filtro
              </button>
            )}

            <div className="max-h-[70vh] overflow-y-auto space-y-3 pr-1">
              {list.map(a => (
                <AdvisorsListItem key={a.id} asesor={a} onClick={(item) => { setSelected(item); }} />
              ))}
              {list.length === 0 && (
                <div className="text-sm text-gray-500 p-3">Sin resultados.</div>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha: resumen o detalle */}
        <div className="w-full md:w-2/3">
          {!selected ? (
            <div id="asesor-summary-view">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Resumen de Asesores</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SummaryCard
                  title="Incumplimiento de Metas"
                  value={counts.incumplimiento}
                  color="red"
                  onClick={() => setFilter("incumplimiento")}
                />
                <SummaryCard
                  title="Metas Completas (100%)"
                  value={counts.completas}
                  color="green"
                  onClick={() => setFilter("completas")}
                />
                <SummaryCard
                  title="Asesores con Novedades"
                  value={counts.novedades}
                  color="blue"
                  onClick={() => setFilter("novedades")}
                />
                <SummaryCard
                  title="Finalizan Contrato este Mes"
                  value={counts.finContrato}
                  color="gray"
                  onClick={() => setFilter("fin_contrato")}
                />
              </div>
            </div>
          ) : (
            <div id="asesor-detail-view">
              {/* Header nombre + acciones */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl font-bold text-gray-900">{selected.nombre}</h1>
                  {statusPill(selected)}
                </div>
                <div className="flex gap-2">
                  <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 flex items-center"
                    onClick={() => { setSelected(null); navigate("/MessageHistory"); }}
                  >
                    <ion-icon name="archive-outline" class="mr-2"></ion-icon>
                    Ver Historial
                  </button>
                  <button className="bg-[#cc0000] text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex items-center">
                    <ion-icon name="send-outline" class="mr-2"></ion-icon>
                    Enviar Notificación
                  </button>
                </div>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <MetricCard label="Cumplimiento (Mes)" value={`${selected.cumplimiento}%`} accent />
                <MetricCard label="Metas Vencidas" value={selected.vencidas} />
                <MetricCard label="Insumos (Mes)" value={selected.insumos} />
              </div>

              {/* Información del funcionario */}
              <div className="bg-white shadow-lg rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Información del Funcionario</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <InfoField label="Cédula" value={selected.cedula} copyable />
                  <InfoField label="Cargo" value={selected.cargo} />
                  <InfoField label="Regional" value={selected.regional} />
                  <InfoField label="Distrito" value={selected.distrito} />
                  <InfoField label="Contrato" value={`${selected.contrato_inicio}${selected.contrato_fin ? ` → ${selected.contrato_fin}` : " (Indefinido)"}`} />
                  <InfoField label="Capacidad" value={selected.capacidad || "N/A"} />
                  <InfoField label="Teléfono" value={selected.telefono} copyable />
                  <InfoField label="Correo" value={selected.correo} copyable />
                  <div className="md:col-span-2">
                    <InfoField label="Novedades" value={selected.novedades || "N/A"} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
