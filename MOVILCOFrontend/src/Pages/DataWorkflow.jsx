import React, { useMemo, useState } from "react";
import axios from "axios";
import { api } from "../../store/api";

const iconPaths = {
  menu: "M4 6h16M4 12h16M4 18h16",
  database:
    "M4 6c0-2 4-3 8-3s8 1 8 3v12c0 2-4 3-8 3s-8-1-8-3V6zm0 0c0 2 4 3 8 3s8-1 8-3m-16 6c0 2 4 3 8 3s8-1 8-3",
  upload: "M12 3l-4 4h3v6h2V7h3l-4-4zM5 18h14v2H5z",
  promote: "M5 13l7-7 7 7M5 13v8h14v-8",
  calc:
    "M5 4h14v16H5zM8 7h2v2H8zM8 11h2v2H8zM8 15h2v2H8zM12 11h4v2h-4zM12 15h4v2h-4z",
  save: "M5 4h11l3 3v13H5zM9 4v5h6V4",
  refresh:
    "M4 4v6h6M20 20v-6h-6M4 10a8 8 0 0113.657-5.657L20 6M20 14a8 8 0 01-13.657 5.657L4 18",
  check: "M5 13l4 4L19 7",
  calendar: "M7 4v2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-2V4M7 4h2m6 0h2",
  file: "M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z",
  download: "M12 3v12m0 0l-4-4m4 4l4-4M5 19h14",
  users:
    "M8 13a4 4 0 10-4-4 4 4 0 004 4zm8 0a3 3 0 10-3-3 3 3 0 003 3zm-8 2c-3 0-6 1.5-6 4v2h8",
  fileDown: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6",
};

const Icon = ({ name, size = 20, className = "" }) => (
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
    <path d={iconPaths[name]} />
  </svg>
);

const formatCurrentPeriod = () => {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
};

const ActionButton = ({
  icon,
  label,
  subLabel,
  colorClass,
  onClick,
  disabled,
  loading,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative w-full flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm border
      disabled:opacity-50 disabled:cursor-not-allowed
      ${
        loading
          ? "cursor-wait opacity-80"
          : "hover:-translate-y-0.5 hover:shadow-md active:scale-95"
      }
      ${colorClass}
    `}
  >
    {loading ? (
      <div className="flex flex-col items-center gap-1">
        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <span>Procesando...</span>
      </div>
    ) : (
      <>
        <div className="flex items-center gap-2">
          <Icon name={icon} size={18} />
          <span>{label}</span>
        </div>
        {subLabel && (
          <span className="text-[10px] opacity-80 font-normal">{subLabel}</span>
        )}
      </>
    )}
  </button>
);

const FileDropZone = ({ file, onChange, label, helpText }) => (
  <div
    className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer group relative overflow-hidden h-full flex flex-col justify-center items-center
      ${
        file
          ? "border-emerald-300 bg-emerald-50"
          : "border-gray-200 hover:border-red-300 hover:bg-red-50"
      }
    `}
  >
    <input
      type="file"
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      onChange={onChange}
      accept=".xlsx, .xls, .csv"
    />
    <div className="relative z-0 w-full">
      {file ? (
        <div className="flex flex-col items-center text-emerald-700">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
            <Icon name="check" size={20} />
          </div>
          <p className="font-bold text-sm truncate max-w-full px-2">
            {file.name}
          </p>
          <p className="text-xs opacity-80">Listo para cargar</p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-400 group-hover:text-red-500 transition-colors">
          <Icon name="upload" size={32} className="mb-2" />
          <p className="font-semibold_prof-semibold text-sm text-gray-600 group-hover:text-red-600">
            {label || "Subir archivo"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {helpText || "Excel (.xlsx) o CSV"}
          </p>
        </div>
      )}
    </div>
  </div>
);

const StatusMessage = ({ message, error }) => {
  if (!message && !error) return null;
  const isError = Boolean(error);
  const text = error || message;
  return (
    <div
      className={`mt-3 rounded-lg px-4 py-3 text-sm ${
        isError
          ? "bg-red-50 text-red-700 border border-red-100"
          : "bg-emerald-50 text-emerald-700 border border-emerald-100"
      }`}
    >
      {text}
    </div>
  );
};

const DataWorkflow = () => {
  const defaultPeriod = useMemo(() => formatCurrentPeriod(), []);
  const [period, setPeriod] = useState(defaultPeriod);

  // Estados por módulo
  const [siappState, setSiappState] = useState({
    loadingStep: null,
    message: "",
    error: "",
    file: null,
  });

  const [presupuestoState, setPresupuestoState] = useState({
    loadingStep: null,
    message: "",
    error: "",
    file: null,
    batchId: null,
  });

  const [nominaState, setNominaState] = useState({
    loadingStep: null,
    message: "",
    error: "",
    file: null,
  });

  const [novedadesState, setNovedadesState] = useState({
    loadingStep: null,
    message: "",
    error: "",
    file: null,
  });

  const [downloadsState, setDownloadsState] = useState({
    loadingStep: null,
    message: "",
    error: "",
  });

  const triggerDownload = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const runStep = async (
    stepName,
    setter,
    fn,
    successMessage = "Paso completado correctamente"
  ) => {
    setter((prev) => ({
      ...prev,
      loadingStep: stepName,
      error: "",
      message: "",
    }));
    try {
      await fn();
      setter((prev) => ({ ...prev, message: successMessage }));
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Error inesperado";
      setter((prev) => ({ ...prev, error: msg }));
      throw err;
    } finally {
      setter((prev) => ({ ...prev, loadingStep: null }));
    }
  };

  /**
   * Helper: flujo 1 botón (import + promote)
   * - Si hay archivo: hace import (multipart)
   * - Siempre hace promote después
   */
  const runImportPromoteFlow = async ({
    file,
    importUrl,
    promoteUrl,
    setter,
    loadingKey,
    successMessage,
    importExtraFormData = null,
    promoteParams = null,
  }) => {
    return runStep(
      loadingKey,
      setter,
      async () => {
        // 1) Import (si hay file)
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          if (importExtraFormData && typeof importExtraFormData === "object") {
            Object.entries(importExtraFormData).forEach(([k, v]) =>
              formData.append(k, v)
            );
          }
          await axios.post(`${api}${importUrl}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          // Para evitar confusiones: exigimos archivo
          throw new Error("Selecciona un archivo antes de ejecutar el flujo.");
        }

        // 2) Promote
        await axios.post(`${api}${promoteUrl}`, null, {
          params: promoteParams || undefined,
        });
      },
      successMessage
    );
  };

  // --- SIAPP / CIAP (Ventas) -> 1 botón ---
  const handleSiappImportAndPromote = () =>
    runImportPromoteFlow({
      file: siappState.file,
      importUrl: "/api/imports/siapp_full",
      promoteUrl: "/api/promote/siapp_full",
      setter: setSiappState,
      loadingKey: "siapp-import-promote",
      successMessage: "SIAPP: importación y promote finalizados.",
      importExtraFormData: { type: "siapp" },
      promoteParams: { mode: "merge" },
    });

  // --- Presupuesto -> 1 botón (con batch_id y periodo) ---
  const handlePresupuestoImportAndPromote = async () => {
    setPresupuestoState((prev) => ({
      ...prev,
      loadingStep: "presupuesto-import-promote",
      error: "",
      message: "",
    }));

    try {
      if (!presupuestoState.file) {
        throw new Error("Selecciona un archivo de presupuesto antes de ejecutar.");
      }

      const formData = new FormData();
      formData.append("file", presupuestoState.file);

      const importRes = await axios.post(`${api}/api/imports/presupuesto`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const batchId = importRes?.data?.batch_id ?? importRes?.data?.batchId ?? null;

      await axios.post(`${api}/api/promote/presupuesto`, {
        period,
        batch_id: batchId,
      });

      setPresupuestoState((prev) => ({
        ...prev,
        batchId,
        message: `Presupuesto: import y promote completados${batchId ? ` (batch ${batchId})` : ""}.`,
      }));
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Error inesperado al procesar presupuesto.";
      setPresupuestoState((prev) => ({ ...prev, error: msg }));
    } finally {
      setPresupuestoState((prev) => ({ ...prev, loadingStep: null }));
    }
  };

  // --- Nómina -> 1 botón ---
  const handleNominaImportAndPromote = () =>
    runImportPromoteFlow({
      file: nominaState.file,
      importUrl: "/api/imports/nomina",
      promoteUrl: "/api/promote/nomina",
      setter: setNominaState,
      loadingKey: "nomina-import-promote",
      successMessage: "Nómina: importación y promote finalizados.",
    });

  // --- Novedades -> 1 botón ---
  const handleNovedadesImportAndPromote = () =>
    runImportPromoteFlow({
      file: novedadesState.file,
      importUrl: "/api/imports/novedades",
      promoteUrl: "/api/promote/novedades",
      setter: setNovedadesState,
      loadingKey: "novedades-import-promote",
      successMessage: "Novedades: importación y promote finalizados.",
    });

  // --- Exportes existentes (los dejo igual) ---
  const handleSiappExport = () =>
    runStep(
      "siapp-export",
      setDownloadsState,
      async () => {
        try {
          const { data } = await axios.get(`${api}/api/export/siapp`, {
            params: { period },
            responseType: "blob",
          });
          triggerDownload(data, `siapp-${period}.xlsx`);
        } catch (err) {
          const { data } = await axios.get(`${api}/api/export/kpi`, {
            params: { period },
            responseType: "blob",
          });
          triggerDownload(data, `kpi-${period}.xlsx`);
        }
      },
      "Export SIAPP/KPI generado."
    );

  const handleExportNomina = () =>
    runStep(
      "nomina-export",
      setDownloadsState,
      async () => {
        const { data } = await axios.get(`${api}/api/export/nomina`, {
          params: { period },
          responseType: "blob",
        });
        triggerDownload(data, `nomina-${period}.xlsx`);
      },
      "Export de nómina generado."
    );

  // Flags de bloqueo
  const siappBusy = Boolean(siappState.loadingStep);
  const presupuestoBusy = Boolean(presupuestoState.loadingStep);
  const nominaBusy = Boolean(nominaState.loadingStep);
  const novedadesBusy = Boolean(novedadesState.loadingStep);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white z-10 h-16 flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-gray-200">
              <Icon name="calendar" size={16} className="text-gray-500" />
              <span className="text-xs font-bold text-gray-500 uppercase">
                Periodo:
              </span>
              <input
                type="month"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
              ADM
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* SIAPP / CIAP (Ventas) */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                    <Icon name="database" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Flujo SIAPP / CIAP (Ventas)
                    </h2>
                    <p className="text-xs text-gray-500">
                      Subir archivo y promover en un solo paso.
                    </p>
                  </div>
                </div>
              </div>

              {/* ✅ Solo Paso 1 (Import + Promote) */}
              <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold border border-slate-200">
                      1
                    </span>
                    Origen de Datos
                  </h3>

                  <div className="flex-1">
                    <FileDropZone
                      file={siappState.file}
                      onChange={(e) =>
                        setSiappState((prev) => ({
                          ...prev,
                          file: e.target.files?.[0] || null,
                        }))
                      }
                      label="Subir Archivo SIAPP / CIAP"
                      helpText="Excel (.xlsx) o CSV"
                    />
                  </div>

                  <ActionButton
                    icon="refresh"
                    label="Subir y Promover (Ventas)"
                    subLabel="Importa SIAPP y promueve (merge) automáticamente"
                    colorClass="bg-slate-900 text-white hover:bg-slate-800 border-transparent shadow-md"
                    onClick={handleSiappImportAndPromote}
                    loading={siappState.loadingStep === "siapp-import-promote"}
                    disabled={!siappState.file || siappBusy}
                  />
                </div>

                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <p className="text-sm font-semibold text-slate-700 mb-1">
                      Nota de operación
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Se eliminó el paso de “procesar ventas” y “guardar KPI”. El
                      flujo ahora se limita a <strong>Import</strong> +{" "}
                      <strong>Promote</strong> para evitar inconsistencias.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 lg:px-8">
                <StatusMessage message={siappState.message} error={siappState.error} />
              </div>
            </section>

            {/* Presupuesto */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                    <Icon name="file" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Flujo Presupuesto</h2>
                    <p className="text-xs text-gray-500">
                      Importación y promote del presupuesto mensual.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <FileDropZone
                    file={presupuestoState.file}
                    onChange={(e) =>
                      setPresupuestoState((prev) => ({
                        ...prev,
                        file: e.target.files?.[0] || null,
                      }))
                    }
                    label="Subir Archivo de Presupuesto"
                    helpText="Excel (.xlsx) o CSV"
                  />

                  <ActionButton
                    icon="refresh"
                    label="Subir y Promover (Presupuesto)"
                    subLabel="Import + Promote en un solo clic"
                    colorClass="bg-amber-600 text-white hover:bg-amber-700 border-transparent shadow-amber-200 shadow-md"
                    onClick={handlePresupuestoImportAndPromote}
                    loading={presupuestoState.loadingStep === "presupuesto-import-promote"}
                    disabled={!presupuestoState.file || presupuestoBusy}
                  />
                </div>

                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="bg-amber-50/40 rounded-xl p-5 border border-amber-100">
                    <p className="text-sm font-semibold text-amber-800 mb-1">
                      Endpoint esperado
                    </p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Import: <code>/api/imports/presupuesto</code> <br />
                      Promote: <code>/api/promote/presupuesto</code>
                    </p>
                    <p className="text-[11px] text-amber-700 mt-2">
                      *Si el promote real tiene otro path, cámbialo aquí y listo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 lg:px-8">
                <StatusMessage
                  message={presupuestoState.message}
                  error={presupuestoState.error}
                />
              </div>
            </section>

            {/* Nómina */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                    <Icon name="users" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Flujo Nómina</h2>
                    <p className="text-xs text-gray-500">Importación y promote de nómina.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <FileDropZone
                    file={nominaState.file}
                    onChange={(e) =>
                      setNominaState((prev) => ({
                        ...prev,
                        file: e.target.files?.[0] || null,
                      }))
                    }
                    label="Subir Archivo de Nómina"
                    helpText="Excel (.xlsx) o CSV"
                  />

                  <ActionButton
                    icon="refresh"
                    label="Subir y Promover (Nómina)"
                    subLabel="Import + Promote en un solo clic"
                    colorClass="bg-purple-600 text-white hover:bg-purple-700 border-transparent shadow-purple-200 shadow-md"
                    onClick={handleNominaImportAndPromote}
                    loading={nominaState.loadingStep === "nomina-import-promote"}
                    disabled={!nominaState.file || nominaBusy}
                  />
                </div>

                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="bg-purple-50/40 rounded-xl p-5 border border-purple-100">
                    <p className="text-sm font-semibold text-purple-800 mb-1">
                      Endpoints
                    </p>
                    <p className="text-xs text-purple-700 leading-relaxed">
                      <code>/api/imports/nomina</code> + <code>/api/promote/nomina</code>
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 lg:px-8">
                <StatusMessage message={nominaState.message} error={nominaState.error} />
              </div>
            </section>

            {/* Novedades */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                    <Icon name="fileDown" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Flujo Novedades</h2>
                    <p className="text-xs text-gray-500">
                      Importación y promote de novedades (RH).
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <FileDropZone
                    file={novedadesState.file}
                    onChange={(e) =>
                      setNovedadesState((prev) => ({
                        ...prev,
                        file: e.target.files?.[0] || null,
                      }))
                    }
                    label="Subir Archivo de Novedades"
                    helpText="Excel (.xlsx) o CSV"
                  />

                  <ActionButton
                    icon="refresh"
                    label="Subir y Promover (Novedades)"
                    subLabel="Import + Promote en un solo clic"
                    colorClass="bg-emerald-600 text-white hover:bg-emerald-700 border-transparent shadow-emerald-200 shadow-md"
                    onClick={handleNovedadesImportAndPromote}
                    loading={novedadesState.loadingStep === "novedades-import-promote"}
                    disabled={!novedadesState.file || novedadesBusy}
                  />
                </div>

                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="bg-emerald-50/40 rounded-xl p-5 border border-emerald-100">
                    <p className="text-sm font-semibold text-emerald-800 mb-1">
                      Endpoints
                    </p>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      <code>/api/imports/novedades</code> +{" "}
                      <code>/api/promote/novedades</code>
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 lg:px-8">
                <StatusMessage
                  message={novedadesState.message}
                  error={novedadesState.error}
                />
              </div>
            </section>

            {/* Exportes (lo dejo tal cual, solo reubicado) */}
            <section className="mt-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2 pl-2">
                <Icon name="fileDown" size={16} /> Centro de Descargas y Reportes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-emerald-300 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      Reporte SIAPP / KPI
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Descarga el consolidado de ventas procesado.
                    </p>
                  </div>
                  <button
                    onClick={handleSiappExport}
                    disabled={downloadsState.loadingStep === "siapp-export"}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-xs hover:bg-emerald-100 transition-colors disabled:opacity-60"
                  >
                    <Icon name="file" size={16} /> Exportar Excel
                  </button>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-purple-300 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      Reporte de Nómina
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Estructura actual de asesores y pagos.
                    </p>
                  </div>
                  <button
                    onClick={handleExportNomina}
                    disabled={downloadsState.loadingStep === "nomina-export"}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg font-bold text-xs hover:bg-purple-100 transition-colors disabled:opacity-60"
                  >
                    <Icon name="download" size={16} /> Exportar Nómina
                  </button>
                </div>
              </div>
              <div className="px-2 pt-4">
                <StatusMessage
                  message={downloadsState.message}
                  error={downloadsState.error}
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DataWorkflow;
