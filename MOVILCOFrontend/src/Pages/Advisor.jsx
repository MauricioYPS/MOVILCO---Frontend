import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { mockAsesores } from "../Props/Advisors/datosquemados";
import AdvisorsListItem from "../Props/Advisors/AdvisorsListItem";
import SummaryCard from "../Props/Advisors/SummaryCard";
import MetricCard from "../Props/Advisors/MetricCard";
import InfoField from "../Props/Advisors/InfoField";
import EnviarNotificacion from "../Props/Advisors/EnviarNotificacion";
import {
  fetchNomina,
  selectNomina,
  selectNominaError,
  selectNominaLoading,
} from "../../store/reducers/nominaReducers";
import {
  fetchSiapp,
  selectSiapp,
  selectSiappError,
  selectSiappLoading,
} from "../../store/reducers/siappReducers";

const META_CONEXIONES = 13;
const DIAS_META = 30;

const normalizeName = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const resolveDiasLaborados = (registro) => {
  if (typeof registro?.dias_laborados === "number") {
    return registro.dias_laborados;
  }

  if (typeof registro?.novedad === "string") {
    const match = registro.novedad.match(/(\d+)/);
    if (match) {
      const diasAusencia = Number(match[1]);
      if (!Number.isNaN(diasAusencia)) {
        return Math.max(0, DIAS_META - diasAusencia);
      }
    }
  }

  return DIAS_META;
};

export default function Advisors() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState(null);

  const dispatch = useDispatch();
  const nomina = useSelector(selectNomina);
  const nominaLoading = useSelector(selectNominaLoading);
  const nominaError = useSelector(selectNominaError);
  const siapp = useSelector(selectSiapp);
  const siappLoading = useSelector(selectSiappLoading);
  const siappError = useSelector(selectSiappError);

  useEffect(() => {
    dispatch(fetchNomina());
    dispatch(fetchSiapp());
  }, [dispatch]);

  useEffect(() => {
    setShowNotificationForm(false);
    setNotificationStatus(null);
  }, [selected]);

  const handleSendNotification = (payload) => {
    console.log("Payload notificación:", payload);
    setNotificationStatus("Notificación enviada correctamente.");
    setShowNotificationForm(false);
  };

  const ventasPorNombre = useMemo(() => {
    const counts = new Map();
    if (!Array.isArray(siapp)) return counts;
    siapp.forEach((registro) => {
      const nombreBase =
        registro?.nombre_funcionario ??
        registro?.asesor ??
        registro?.nombreAsesor ??
        registro?.nombre;
      const key = normalizeName(nombreBase || "");
      if (!key) return;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return counts;
  }, [siapp]);

  const deriveStatusFromNomina = (registro) => {
    if (!registro) return "en_progreso";
    if (registro.novedad) return "novedades";
    if (registro.estado_envio_presupuesto === "ATRASADO") return "incumplimiento";
    if (registro.fecha_fin_contrato) {
      const fin = new Date(registro.fecha_fin_contrato);
      const hoy = new Date();
      const fechaLimite = new Date();
      fechaLimite.setDate(hoy.getDate() + 30);
      if (fin <= fechaLimite) return "fin_contrato";
    }
    if (registro.estado_envio_presupuesto === "ENVIADO") return "completas";
    return "en_progreso";
  };

  const apiAsesores = useMemo(() => {
    if (!Array.isArray(nomina)) return [];

    return nomina.map((item, idx) => {
      const nombre = item.nombre_funcionario ?? "Funcionario sin nombre";
      const key = normalizeName(nombre);
      const diasLaborados = Math.max(
        0,
        Math.min(resolveDiasLaborados(item), DIAS_META)
      );
      const prorrateo = Number(
        ((META_CONEXIONES / DIAS_META) * diasLaborados).toFixed(2)
      );
      const ventas = ventasPorNombre.get(key) ?? 0;
      const cumplimiento =
        prorrateo > 0
          ? Math.min(100, Number(((ventas / prorrateo) * 100).toFixed(2)))
          : 0;

      return {
        id: item.raw_row ?? idx,
        nombre,
        cargo: item.contratado === "SI" ? "Asesor Comercial" : "Sin contrato activo",
        cedula: item.cedula ?? "N/A",
        distrito: item.distrito ?? item.distrito_claro ?? "N/A",
        regional: item.distrito_claro ?? "N/A",
        contrato_inicio: item.fecha_inicio_contrato
          ? item.fecha_inicio_contrato.split("T")[0]
          : "N/A",
        contrato_fin: item.fecha_fin_contrato
          ? item.fecha_fin_contrato.split("T")[0]
          : null,
        novedades: item.novedad,
        presupuesto: item.presupuesto_mes ?? "0",
        capacidad: "N/A",
        telefono: "N/A",
        correo: "N/A",
        ventas,
        venta: ventas,
        prorrateo,
        diasLaborados,
        cumplimiento,
        status: deriveStatusFromNomina(item),
        estado_envio_presupuesto: item.estado_envio_presupuesto,
      };
    });
  }, [nomina, ventasPorNombre]);

  const dataset = apiAsesores.length > 0 ? apiAsesores : mockAsesores;
  const usingMockData = apiAsesores.length === 0;

  const counts = useMemo(
    () => ({
      incumplimiento: dataset.filter(
        (a) => a.status === "incumplimiento" || a.cumplimiento < 80
      ).length,
      completas: dataset.filter(
        (a) => a.cumplimiento === 100 || a.status === "completas"
      ).length,
      novedades: dataset.filter((a) => a.status === "novedades").length,
      finContrato: dataset.filter((a) => a.status === "fin_contrato").length,
    }),
    [dataset]
  );

  const list = useMemo(() => {
    let resultado = [...dataset];
    if (filter) {
      if (filter === "incumplimiento") {
        resultado = resultado.filter(
          (a) => a.status === "incumplimiento" || a.cumplimiento < 80
        );
      }
      if (filter === "completas") {
        resultado = resultado.filter(
          (a) => a.status === "completas" || a.cumplimiento === 100
        );
      }
      if (filter === "novedades") {
        resultado = resultado.filter((a) => a.status === "novedades");
      }
      if (filter === "fin_contrato") {
        resultado = resultado.filter((a) => a.status === "fin_contrato");
      }
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      resultado = resultado.filter((a) =>
        [a.nombre, a.distrito, a.regional, a.cargo]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    return resultado;
  }, [dataset, filter, query]);

  const navigate = useNavigate();

  if ((nominaLoading || siappLoading) && apiAsesores.length === 0) {
    return <p>Cargando información de nómina y ventas...</p>;
  }

  if ((nominaError || siappError) && apiAsesores.length === 0) {
    return <p>Error al cargar los datos: {nominaError || siappError}</p>;
  }

  const statusPill = (asesor) => {
    if (!asesor) return null;
    const map = {
      incumplimiento: "bg-red-100 text-red-700",
      completas: "bg-green-100 text-green-700",
      novedades: "bg-blue-100 text-blue-700",
      fin_contrato: "bg-gray-100 text-gray-700",
      en_progreso: "bg-amber-100 text-amber-700",
    };
    const labels = {
      incumplimiento: "Incumplimiento",
      completas: "Completo",
      novedades: "Novedades",
      fin_contrato: "Fin de contrato",
      en_progreso: "En progreso",
    };
    return (
      <span className={`text-sm font-medium px-3 py-1 rounded-full ${map[asesor.status]}`}>
        {labels[asesor.status] || asesor.status}
      </span>
    );
  };

  return (
    <div id="view-asesores" className="view-content w-full flex justify-center">
      <div className="flex flex-col md:flex-row gap-6 min-h-screen h-auto mt-10 w-[96%]">
        {/* Columna izquierda */}
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
              <ion-icon
                name="search-outline"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              ></ion-icon>
            </div>

            {siappLoading && (
              <p className="text-xs text-gray-500 mb-2">
                Actualizando ventas desde SIAPP...
              </p>
            )}
            {siappError && (
              <p className="text-xs text-red-500 mb-2">
                No fue posible sincronizar SIAPP: {siappError}
              </p>
            )}
            {usingMockData && (
              <p className="text-xs text-gray-500 mb-3">
                Mostrando datos de ejemplo mientras llega la información real.
              </p>
            )}

            {query && (
              <button
                onClick={() => setQuery("")}
                className="w-full text-sm text-[#cc0000] mb-4 hover:underline text-left"
              >
                Limpiar filtro
              </button>
            )}

            <div className="max-h-[70vh] overflow-y-auto space-y-3 pr-1">
              {list.map((asesor) => (
                <AdvisorsListItem
                  key={asesor.id}
                  asesor={asesor}
                  onClick={(item) => setSelected(item)}
                />
              ))}
              {list.length === 0 && (
                <div className="text-sm text-gray-500 p-3">Sin resultados.</div>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha */}
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
              {showNotificationForm ? (
                <EnviarNotificacion
                  asesor={selected}
                  onBack={() => setShowNotificationForm(false)}
                  onSend={handleSendNotification}
                />
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-3xl font-bold text-gray-900">{selected.nombre}</h1>
                      {statusPill(selected)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 flex items-center"
                        onClick={() => {
                          setSelected(null);
                          navigate("/MessageHistory");
                        }}
                      >
                        <ion-icon name="archive-outline" class="mr-2"></ion-icon>
                        Ver Historial
                      </button>
                      <button
                        className="bg-[#cc0000] text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex items-center"
                        onClick={() => setShowNotificationForm(true)}
                      >
                        <ion-icon name="send-outline" class="mr-2"></ion-icon>
                        Enviar Notificación
                      </button>
                    </div>
                  </div>

                  {notificationStatus && (
                    <div className="mb-4 rounded-lg bg-green-50 text-green-700 px-4 py-2 text-sm">
                      {notificationStatus}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <MetricCard
                      label="Cumplimiento (Mes)"
                      value={`${selected.cumplimiento ?? 0}%`}
                      accent
                    />
                    <MetricCard
                      label="Ventas registradas"
                      value={selected.ventas ?? 0}
                    />
                    <MetricCard
                      label="Meta prorrateada"
                      value={Math.trunc(selected.prorrateo) ?? META_CONEXIONES}
                    />
                  </div>

                  <div className="bg-white shadow-lg rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Información del Funcionario
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <InfoField label="Cédula" value={selected.cedula} copyable />
                      <InfoField label="Cargo" value={selected.cargo} />
                      <InfoField label="Regional" value={selected.regional} />
                      <InfoField label="Distrito" value={selected.distrito} />
                      <InfoField
                        label="Contrato"
                        value={`${selected.contrato_inicio}${
                          selected.contrato_fin ? ` - ${selected.contrato_fin}` : " (Indefinido)"
                        }`}
                      />
                      <InfoField label="Capacidad" value={selected.capacidad || "N/A"} />
                      <InfoField label="Ventas (SIAPP)" value={selected.ventas ?? 0} />
                      <InfoField
                        label="Prorrateo (Meta conexiones)"
                        value={selected.prorrateo ?? META_CONEXIONES}
                      />
                      <InfoField label="Días laborados" value={selected.diasLaborados ?? "N/A"} />
                      <InfoField label="Teléfono" value={selected.telefono} copyable />
                      <InfoField label="Correo" value={selected.correo} copyable />
                      <div className="md:col-span-2">
                        <InfoField label="Novedades" value={selected.novedades || "N/A"} />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
