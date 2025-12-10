import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Mail,
  Send,
  Save,
  X,
  Plus,
  Eye,
  Code,
  RefreshCw,
  Users,
  ChevronRight,
  FileText,
  LayoutTemplate,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { api } from "../../store/api";
axios.defaults.baseURL = `${api}`;

export default function EmailSenderPage() {
  // ========================
  // ESTADOS PRINCIPALES
  // ========================
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [placeholders, setPlaceholders] = useState({});
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewSubject, setPreviewSubject] = useState("");

  const [recipientInput, setRecipientInput] = useState("");
  const [recipientsList, setRecipientsList] = useState([]);

  const [metaInfo, setMetaInfo] = useState({ user_id: "", periodo: "" });

  const [notification, setNotification] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // ========================
  // 1. CARGAR PLANTILLAS DEL BACKEND
  // ========================
  useEffect(() => {
    async function loadTemplates() {
      try {
        setLoadingTemplates(true);
        const { data } = await axios.get("/api/email/templates/1");
        setTemplates(data);
      } catch (e) {
        console.error(e);
        showToast("error", "Error cargando plantillas del servidor");
      } finally {
        setLoadingTemplates(false);
      }
    }
    loadTemplates();
  }, []);

  // ========================
  // 2. DETECTAR PLACEHOLDERS
  // ========================

  function extractPlaceholders(html, subject) {
    if (!html && !subject) return [];

    const regex = /{{\s*(.*?)\s*}}|{\s*(.*?)\s*}/g;
    const found = new Set();
    let m;

    const full = `${html || ""} ${subject || ""}`;

    while ((m = regex.exec(full)) !== null) {
      const key = m[1] || m[2]; // Soporta {{KEY}} y {KEY}
      if (key) found.add(key.trim());
    }

    return [...found];
  }

  // Cuando seleccionas una plantilla REAL
  const handleChangeTemplate = (templateId) => {
    if (!templateId) {
      setSelectedTemplate(null);
      setPlaceholders({});
      setPreviewHtml("");
      setPreviewSubject("");
      return;
    }

    const tpl = templates.find((t) => t.id === Number(templateId));
    setSelectedTemplate(tpl);

    const keys = extractPlaceholders(tpl.html, tpl.asunto);
    const initialValues = {};

    keys.forEach((key) => (initialValues[key] = ""));
    setPlaceholders(initialValues);
  };

  // ========================
  // 3. RENDER PREVIEW
  // ========================

  function applyPlaceholders(text, values) {
    let out = text;

    for (const key of Object.keys(values)) {
      const val = values[key] || "";

      const patterns = [
        new RegExp(`{{\\s*${key}\\s*}}`, "gi"),
        new RegExp(`{\\s*${key}\\s*}`, "gi"),
      ];

      patterns.forEach((p) => (out = out.replace(p, val)));
    }

    return out;
  }

  useEffect(() => {
    if (!selectedTemplate) return;

    const renderedHtml = applyPlaceholders(selectedTemplate.html, placeholders);
    const renderedSubject = applyPlaceholders(
      selectedTemplate.asunto,
      placeholders
    );

    setPreviewHtml(renderedHtml);
    setPreviewSubject(renderedSubject);
  }, [selectedTemplate, placeholders]);

  // ========================
  // 4. MANEJO DE DESTINATARIOS
  // ========================
  function addRecipient() {
    if (!recipientInput) return;

    const emails = recipientInput
      .split(/[\s,]+/)
      .filter((e) => e.includes("@"));

    const newOnes = emails.filter((e) => !recipientsList.includes(e));

    setRecipientsList([...recipientsList, ...newOnes]);
    setRecipientInput("");
  }

  function removeRecipient(email) {
    setRecipientsList(recipientsList.filter((e) => e !== email));
  }

  function handleRecipientKey(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addRecipient();
    }
  }

  // ========================
  // 5. ENVÍO REAL AL BACKEND
  // ========================
  async function handleSend() {
    if (!selectedTemplate) {
      showToast("error", "Selecciona una plantilla");
      return;
    }
    if (recipientsList.length === 0) {
      showToast("error", "Agrega al menos un destinatario");
      return;
    }

    setIsSending(true);

    try {
      for (const email of recipientsList) {
        await axios.post(
          `/api/email/send-template/${selectedTemplate.codigo}`,
          {
            to: email,
            data: placeholders,
            user_id: metaInfo.user_id || null,
            periodo: metaInfo.periodo || null,
          }
        );
      }

      showToast("success", "Correos enviados correctamente");
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.error ||
        e.message ||
        "Error enviando correos";
      showToast("error", msg);
    } finally {
      setIsSending(false);
    }
  }

  // ========================
  // 6. TOAST
  // ========================
  function showToast(type, message) {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }

  // ============================================================
  // ======================= RENDER =================================
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      {/* Toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-lg border flex items-center gap-3 ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Mail /> Gestor de Envíos Masivos
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ===================== Columna Izquierda ===================== */}
        <div className="lg:col-span-5 space-y-6">
          {/* SELECCIÓN DE PLANTILLA */}
          <section className="bg-white p-5 rounded-xl border shadow-sm">
            <h2 className="flex items-center gap-2 font-semibold mb-4">
              <LayoutTemplate className="text-red-600" /> Selección de Plantilla
            </h2>

            {loadingTemplates ? (
              <p className="text-gray-500 text-center py-4">Cargando...</p>
            ) : (
              <select
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3"
                onChange={(e) => handleChangeTemplate(e.target.value)}
              >
                <option value="">-- Seleccionar Plantilla --</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            )}

            {selectedTemplate && (
              <div className="bg-blue-50 border text-sm mt-3 p-3 rounded">
                <div className="flex justify-between">
                  <span>Código:</span>
                  <span className="font-mono">{selectedTemplate.codigo}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Formato:</span>
                  <button
                    className="text-blue-600 underline"
                    onClick={() => setShowCodeModal(true)}
                  >
                    Ver HTML Original
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* CAMPOS AUTOMÁTICOS */}
          <section className="bg-white p-5 rounded-xl border shadow-sm">
            <h2 className="flex items-center gap-2 font-semibold mb-4">
              <FileText className="text-red-600" /> Variables Detectadas
            </h2>

            {Object.keys(placeholders).length === 0 ? (
              <p className="text-gray-400 text-center">Selecciona una plantilla.</p>
            ) : (
              Object.keys(placeholders).map((key) => (
                <div key={key} className="mb-3">
                  <label className="text-xs text-gray-500 mb-1 block">
                    {key}
                  </label>
                  <input
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm"
                    value={placeholders[key]}
                    onChange={(e) =>
                      setPlaceholders({
                        ...placeholders,
                        [key]: e.target.value,
                      })
                    }
                  />
                </div>
              ))
            )}
          </section>

          {/* DESTINATARIOS */}
          <section className="bg-white p-5 rounded-xl border shadow-sm">
            <h2 className="flex items-center gap-2 font-semibold mb-4">
              <Users className="text-red-600" /> Destinatarios
            </h2>

            <div className="flex gap-2 mb-3">
              <input
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                onKeyDown={handleRecipientKey}
                placeholder="correo@ejemplo.com"
                className="flex-1 border p-2 rounded-lg"
              />
              <button
                onClick={addRecipient}
                className="bg-slate-800 text-white px-3 rounded-lg"
              >
                <Plus />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {recipientsList.map((email) => (
                <span
                  key={email}
                  className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded"
                >
                  {email}
                  <button onClick={() => removeRecipient(email)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* META OPCIONAL */}
          <section className="bg-white p-5 rounded-xl border shadow-sm">
            <h2 className="flex items-center gap-2 font-semibold mb-4">
              Opciones Avanzadas
            </h2>

            <label className="text-xs">user_id (opcional)</label>
            <input
              className="w-full border p-2 rounded mb-3"
              value={metaInfo.user_id}
              onChange={(e) =>
                setMetaInfo({ ...metaInfo, user_id: e.target.value })
              }
            />

            <label className="text-xs">periodo (YYYY-MM)</label>
            <input
              className="w-full border p-2 rounded"
              value={metaInfo.periodo}
              onChange={(e) =>
                setMetaInfo({ ...metaInfo, periodo: e.target.value })
              }
            />
          </section>
        </div>

        {/* ===================== COLUMNA DERECHA: PREVIEW ===================== */}
        <div className="lg:col-span-7">
          <div className="bg-white border rounded-xl shadow p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="flex items-center gap-2 font-semibold">
                <Eye /> Vista Previa
              </h3>
              <button
                onClick={() =>
                  setPreviewHtml(
                    applyPlaceholders(selectedTemplate.html, placeholders)
                  )
                }
                className="text-blue-600 underline flex items-center gap-1"
              >
                <RefreshCw size={14} /> Actualizar
              </button>
            </div>

            <h2 className="text-lg font-semibold border-b pb-2 mb-4">
              {previewSubject}
            </h2>

            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />

            <div className="mt-auto pt-6 flex justify-end gap-4">
              <button className="border px-6 py-2 rounded-lg">Cancelar</button>

              <button
                onClick={handleSend}
                disabled={isSending}
                className="bg-red-600 text-white px-8 py-2 rounded-lg"
              >
                {isSending ? "Enviando..." : <span className="flex items-center gap-2"><Send size={16}/> Enviar</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== MODAL HTML ===================== */}
      {showCodeModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-slate-900 p-4 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-mono flex items-center gap-2">
                <Code /> Código HTML
              </h3>
              <button
                className="text-white"
                onClick={() => setShowCodeModal(false)}
              >
                <X />
              </button>
            </div>

            <pre className="text-green-300 text-xs whitespace-pre-wrap max-h-[60vh] overflow-auto">
              {selectedTemplate.html}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
