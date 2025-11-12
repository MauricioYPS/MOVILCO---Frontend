import { useEffect, useMemo, useState } from "react";

const PLANTILLAS = {
  incumplimiento: {
    label: "Incumplimiento de Presupuesto",
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

DIANA CAROLINA SERNA GUTIÉRREZ
Gerente comercial`,
  },
  presupuesto: {
    label: "Asignación de Presupuesto",
    asunto: "PRESUPUESTO [Mes Actual]",
    body: `Villavicencio, [Fecha Actual]

Señor(a)
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

SERNA GUTIÉRREZ DIANA CAROLINA
Gerente comercial`,
  },
};

const upperMonth = (date) =>
  date.toLocaleString("es-CO", { month: "long" }).toUpperCase();

const fechaLarga = (date) =>
  date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const renderTemplate = (templateKey, asesor) => {
  const tpl = PLANTILLAS[templateKey];
  if (!tpl || !asesor) return { subject: "", body: "" };

  const today = new Date();
  const prev = new Date(today);
  prev.setMonth(prev.getMonth() - 1);

  const mesActual = upperMonth(today);
  const mesAnterior = upperMonth(prev);
  const fechaActual = fechaLarga(today);

  const subject = tpl.asunto.replace(/\[Mes Actual\]/g, mesActual);

  const body = tpl.body
    .replace(/\[Fecha Actual\]/g, fechaActual)
    .replace(/\[Nombre Asesor\]/g, (asesor.nombre || "").toUpperCase())
    .replace(/\[Cédula Asesor\]/g, asesor.cedula || "")
    .replace(/\[Cargo Asesor\]/g, asesor.cargo || "")
    .replace(/\[Distrito Asesor\]/g, (asesor.distrito || "").toUpperCase())
    .replace(/\[Mes Actual\]/g, mesActual)
    .replace(/\[Mes Anterior\]/g, mesAnterior)
    .replace(/\[Cumplimiento Asesor\]/g, asesor.cumplimiento ?? "");

  return { subject, body };
};

export default function EnviarNotificacion({
  asesor,
  fromEmail = "gerencia@movilco.com.co (Simulado)",
  onBack,
  onSend,
}) {
  const [templateKey, setTemplateKey] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setToEmail(asesor?.correo || "");
    setTemplateKey("");
    setSubject("");
    setBody("");
  }, [asesor]);

  const filledTemplate = useMemo(
    () => renderTemplate(templateKey, asesor),
    [templateKey, asesor]
  );

  useEffect(() => {
    if (templateKey) {
      setSubject(filledTemplate.subject);
      setBody(filledTemplate.body);
    } else {
      setSubject("");
      setBody("");
    }
  }, [templateKey, filledTemplate]);

  const canSend =
    Boolean(asesor) && Boolean(toEmail) && subject.trim() && body.trim();

  const handleSend = async () => {
    if (!canSend || !asesor) return;
    const payload = {
      asesorId: asesor.id,
      to: toEmail,
      from: fromEmail,
      template: templateKey || null,
      subject,
      body,
      metadata: {
        generatedAt: new Date().toISOString(),
        cumplimiento: asesor.cumplimiento ?? null,
        distrito: asesor.distrito ?? null,
        regional: asesor.regional ?? null,
      },
    };

    try {
      setSending(true);
      await Promise.resolve(onSend?.(payload));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <button
        onClick={onBack}
        className="text-[#cc0000] font-medium mb-4 inline-flex items-center hover:underline"
      >
        <ion-icon name="arrow-back-outline" class="mr-2"></ion-icon>
        Volver a Detalles
      </button>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Enviar notificación
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Completa los campos o selecciona una plantilla para cargar un mensaje
        automático con los datos de {asesor?.nombre}.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Para</label>
          <input
            type="email"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-lg p-2"
            placeholder="correo@movilco.com.co"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">De</label>
          <input
            type="text"
            value={fromEmail}
            readOnly
            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Plantilla
          </label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#cc0000]"
            value={templateKey}
            onChange={(e) => setTemplateKey(e.target.value)}
          >
            <option value="">-- Seleccionar plantilla --</option>
            {Object.entries(PLANTILLAS).map(([key, info]) => (
              <option key={key} value={key}>
                {info.label}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Asunto
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#cc0000]"
            placeholder="Asunto del mensaje"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Mensaje
          </label>
          <textarea
            rows={12}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#cc0000]"
            placeholder="Contenido del mensaje…"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          disabled={!canSend || sending}
          onClick={handleSend}
          className={`inline-flex items-center px-6 py-2 rounded-lg font-medium text-white ${
            !canSend || sending
              ? "bg-red-300 cursor-not-allowed"
              : "bg-[#cc0000] hover:bg-red-700"
          }`}
        >
          <ion-icon name="send-outline" class="mr-2"></ion-icon>
          {sending ? "Enviando..." : "Enviar mensaje"}
        </button>
      </div>
    </div>
  );
}
