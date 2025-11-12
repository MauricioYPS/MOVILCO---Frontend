import { useEffect, useMemo, useState } from "react";

const PLANTILLAS = {
  incumplimiento: {
    asunto: "INCUMPLIMIENTO PRESUPUESTO [Mes Actual]",
    body: `Villavicencio, [Fecha Actual]

Señor(a)
[Nombre Asesor] Nro. [Cédula Asesor]
[Cargo Asesor] [Distrito Asesor]

Asunto: INCUMPLIMIENTO PRESUPUESTO [Mes Anterior]

Como es de su conocimiento, mes a mes se han comunicado tanto verbalmente como por escrito las metas comerciales que han sido fijadas para lograr la continuidad en el proyecto de zonificación donde ha sido asignado.

Revisando las cifras de productividad en el último mes, la gerencia le comunica que usted ha incurrido en el incumplimiento del presupuesto (Cumplimiento: [Cumplimiento Asesor]%). Le extendemos la invitación a tomar acciones a efectos de evitar procesos disciplinarios.

Nos permitimos recordar las obligaciones como asesor directo en el proyecto de zonificación.

Esperamos se tomen los correctivos necesarios para el mejoramiento de su productividad.

Cordialmente,

DIANA CAROLINA SERNA GUTIERREZ
Gerente comercial`,
  },
  presupuesto: {
    asunto: "PRESUPUESTO [Mes Actual]",
    body: `Villavicencio, [Fecha Actual]

Señor (a)
[Nombre Asesor] Nro. [Cédula Asesor]
[Cargo Asesor] [Distrito Asesor]

Asunto: PRESUPUESTO [Mes Actual]

Sabemos que este es un momento clave para usted y para su distrito, este presupuesto no es solo un número, sino una oportunidad real para alcanzar los resultados que se ha propuesto.

A continuación se le da a conocer el presupuesto asignado para el mes de [Mes Actual], el cual se le recuerda que será evaluado de manera semanal.

"INDICADOR MENSUAL"
META ACCESOS: 13
META POSTPAGO: 1

El asesor debe garantizar cuatro (4) marcaciones diarias en HHPP antes de las 10:00 AM.

De antemano le deseamos los mayores éxitos para este nuevo mes.

Cordialmente,

SERNA GUTIERREZ DIANA CAROLINA
Gerente comercial`,
  },
};

// --- Datos quemados del asesor seleccionado (puedes pasar por props o router) ---
const MOCK_ASESOR = {
  nombre: "Carlos Mendoza",
  cedula: "1.123.456.789",
  cargo: "Asesor Comercial Calle",
  distrito: "Comuneros",
  correo: "c.mendoza@movilco.com.co",
  cumplimiento: 65,
};

function formatFecha(fecha = new Date()) {
  const meses = [
    "enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","septiembre","octubre","noviembre","diciembre"
  ];
  const d = fecha.getDate().toString().padStart(2, "0");
  const m = meses[fecha.getMonth()];
  const y = fecha.getFullYear();
  return `${d} de ${m} de ${y}`;
}
function mesActual() {
  const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];
  return meses[new Date().getMonth()];
}
function mesAnterior() {
  const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return meses[d.getMonth()];
}

export default function Templates() {
  const [to] = useState(MOCK_ASESOR.correo);
  const [from] = useState("gerencia@movilco.com.co (Simulado)");
  const [templateKey, setTemplateKey] = useState("incumplimiento");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const placeholders = useMemo(
    () => ({
      "[Mes Actual]": mesActual(),
      "[Mes Anterior]": mesAnterior(),
      "[Fecha Actual]": formatFecha(),
      "[Nombre Asesor]": MOCK_ASESOR.nombre,
      "[Cédula Asesor]": MOCK_ASESOR.cedula,
      "[Cargo Asesor]": MOCK_ASESOR.cargo,
      "[Distrito Asesor]": MOCK_ASESOR.distrito,
      "[Cumplimiento Asesor]": String(MOCK_ASESOR.cumplimiento),
    }),
    []
  );

  // Aplica plantilla cuando cambia la selección
  useEffect(() => {
    const tpl = PLANTILLAS[templateKey];
    if (!tpl) return;
    const s = replaceTokens(tpl.asunto, placeholders).toUpperCase();
    const b = replaceTokens(tpl.body, placeholders);
    setSubject(s);
    setBody(b);
  }, [templateKey, placeholders]);

  return (
    <div id="view-notification" className="view-content">
      <button
        className="text-[#cc0000] font-medium mb-4 inline-flex items-center"
        onClick={() => window.history.back()}
      >
        <ion-icon name="arrow-back-outline" class="mr-2"></ion-icon>
        Volver a Detalles del Asesor
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Enviar Notificación</h1>

      <div className="bg-white shadow-lg rounded-xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Para */}
          <Field label="Para:">
            <input
              type="email"
              readOnly
              value={to}
              className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm p-2"
            />
          </Field>
          {/* De */}
          <Field label="De:">
            <input
              type="text"
              readOnly
              value={from}
              className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm p-2"
            />
          </Field>
          {/* Plantilla */}
          <Field label="Usar Plantilla:" colSpan>
            <select
              value={templateKey}
              onChange={(e) => setTemplateKey(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#cc0000] focus:border-[#cc0000]"
            >
              <option value="">-- Seleccionar Plantilla --</option>
              <option value="incumplimiento">Plantilla: Incumplimiento de Presupuesto</option>
              <option value="presupuesto">Plantilla: Asignación de Presupuesto</option>
            </select>
          </Field>
          {/* Asunto */}
          <Field label="Asunto:" colSpan>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#cc0000] focus:border-[#cc0000]"
            />
          </Field>
          {/* Mensaje */}
          <Field label="Mensaje:" colSpan>
            <textarea
              rows={14}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#cc0000] focus:border-[#cc0000]"
            />
          </Field>
        </div>
      </div>

      {/* Botón flotante (como en tu captura, parte inferior derecha) */}
      <button
        className="fixed bottom-6 right-6 bg-[#cc0000] hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg inline-flex items-center"
        onClick={() => alert("Mensaje simulado enviado")}
      >
        <ion-icon name="send-outline" class="mr-2"></ion-icon>
        Enviar Mensaje
      </button>
    </div>
  );
}

function Field({ label, children, colSpan = false }) {
  return (
    <div className={colSpan ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function replaceTokens(text, map) {
  return Object.entries(map).reduce((acc, [token, val]) => acc.split(token).join(val), text);
}
