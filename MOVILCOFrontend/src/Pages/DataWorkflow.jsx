import React, { useMemo, useState } from "react";
import axios from "axios";
import { api } from "../../store/api";

const iconPaths = {
  menu: "M4 6h16M4 12h16M4 18h16",
  database: "M4 6c0-2 4-3 8-3s8 1 8 3v12c0 2-4 3-8 3s-8-1-8-3V6zm0 0c0 2 4 3 8 3s8-1 8-3m-16 6c0 2 4 3 8 3s8-1 8-3",
  upload: "M12 3l-4 4h3v6h2V7h3l-4-4zM5 18h14v2H5z",
  promote: "M5 13l7-7 7 7M5 13v8h14v-8",
  calc: "M5 4h14v16H5zM8 7h2v2H8zM8 11h2v2H8zM8 15h2v2H8zM12 11h4v2h-4zM12 15h4v2h-4z",
  save: "M5 4h11l3 3v13H5zM9 4v5h6V4",
  refresh: "M4 4v6h6M20 20v-6h-6M4 10a8 8 0 0113.657-5.657L20 6M20 14a8 8 0 01-13.657 5.657L4 18",
  check: "M5 13l4 4L19 7",
  calendar: "M7 4v2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-2V4M7 4h2m6 0h2",
  file: "M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z",
  download: "M12 3v12m0 0l-4-4m4 4l4-4M5 19h14",
  users: "M8 13a4 4 0 10-4-4 4 4 0 004 4zm8 0a3 3 0 10-3-3 3 3 0 003 3zm-8 2c-3 0-6 1.5-6 4v2h8",
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

const ActionButton = ({ icon, label, subLabel, colorClass, onClick, disabled, loading }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative w-full flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm border
      disabled:opacity-50 disabled:cursor-not-allowed
      ${loading ? "cursor-wait opacity-80" : "hover:-translate-y-0.5 hover:shadow-md active:scale-95"}
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
        {subLabel && <span className="text-[10px] opacity-80 font-normal">{subLabel}</span>}
      </>
    )}
  </button>
);

const FileDropZone = ({ file, onChange, label, helpText }) => (
  <div
    className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer group relative overflow-hidden h-full flex flex-col justify-center items-center
      ${file ? "border-emerald-300 bg-emerald-50" : "border-gray-200 hover:border-red-300 hover:bg-red-50"}
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
          <p className="font-bold text-sm truncate max-w-full px-2">{file.name}</p>
          <p className="text-xs opacity-80">Listo para cargar</p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-400 group-hover:text-red-500 transition-colors">
          <Icon name="upload" size={32} className="mb-2" />
          <p className="font-semibold text-sm text-gray-600 group-hover:text-red-600">{label || "Subir archivo"}</p>
          <p className="text-xs text-gray-400 mt-1">{helpText || "Excel (.xlsx) o CSV"}</p>
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [siappState, setSiappState] = useState({
    loadingStep: null,
    message: "",
    error: "",
    file: null,
  });

  const [budgetState, setBudgetState] = useState({
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

  const runStep = async (stepName, setter, fn, successMessage = "Paso completado correctamente") => {
    setter((prev) => ({ ...prev, loadingStep: stepName, error: "", message: "" }));
    try {
      await fn();
      setter((prev) => ({ ...prev, message: successMessage }));
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || err?.message || "Error inesperado";
      setter((prev) => ({ ...prev, error: msg }));
      throw err;
    } finally {
      setter((prev) => ({ ...prev, loadingStep: null }));
    }
  };

  // --- SIAPP ---
  const handleSiappUpload = () =>
    runStep(
      "siapp-upload",
      setSiappState,
      async () => {
        if (!siappState.file) throw new Error("Selecciona un archivo SIAPP antes de subir.");
        const formData = new FormData();
        formData.append("file", siappState.file);
        formData.append("type", "siapp");
        await axios.post(`${api}/api/imports/siapp_full`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      },
      "Archivo SIAPP subido."
    );

  const handleSiappPromote = () =>
    runStep(
      "siapp-promote",
      setSiappState,
      async () => {
        await axios.post(`${api}/api/promote/siapp_full`, null, { params: { mode: "merge" } });
      },
      "SIAPP promovido."
    );

  const handleSiappProcess = () =>
    runStep(
      "siapp-process",
      setSiappState,
      async () => {
        await axios.get(`${api}/api/kpi/calculate`, { params: { period } });
      },
      "Ventas procesadas."
    );

  const handleSiappSave = () =>
    runStep(
      "siapp-save",
      setSiappState,
      async () => {
        await axios.post(`${api}/api/kpi/save`, null, { params: { period } });
      },
      "KPI guardado."
    );

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

  const handleSiappFullFlow = async () => {
    try {
      if (siappState.file) {
        await handleSiappUpload();
      }
      await handleSiappPromote();
      await handleSiappProcess();
      await handleSiappSave();
      setSiappState((prev) => ({ ...prev, message: "Flujo completo SIAPP finalizado." }));
    } catch (err) {
      // errores ya gestionados en cada step
    }
  };

  // --- Jerarquía / Presupuesto (también actualiza nómina) ---
  const handleBudgetUpload = () =>
    runStep(
      "budget-upload",
      setBudgetState,
      async () => {
        if (!budgetState.file) throw new Error("Selecciona un archivo de jerarquía/presupuesto.");
        const formData = new FormData();
        formData.append("file", budgetState.file);
        await axios.post(`${api}/api/imports/presupuesto-jerarquia`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      },
      "Archivo cargado y nómina/presupuesto actualizados."
    );

  const handleBudgetPromote = () =>
    runStep(
      "budget-promote",
      setBudgetState,
      async () => {
        await axios.post(`${api}/api/promote/presupuesto-jerarquia`);
      },
      "Presupuesto promovido."
    );

  const handleBudgetFullFlow = async () => {
    try {
      if (budgetState.file) {
        await handleBudgetUpload();
      }
      await handleBudgetPromote();
      setBudgetState((prev) => ({ ...prev, message: "Flujo completo jerarquía/presupuesto finalizado." }));
    } catch (err) {
      // errores ya gestionados en cada step
    }
  };

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

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden">


      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white z-10 h-16 flex items-center justify-between px-6 lg:px-10 ">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500">
              <Icon name="menu" size={24} />
            </button>
            <h1 className="text-lg font-bold text-slate-800">Centro de Procesamiento ETL</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-gray-200">
              <Icon name="calendar" size={16} className="text-gray-500" />
              <span className="text-xs font-bold text-gray-500 uppercase">Periodo:</span>
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
            {/* SIAPP */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                    <Icon name="database" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Flujo SIAPP / CIAP (Ventas)</h2>
                    <p className="text-xs text-gray-500">
                      Importación, procesamiento y cálculo de KPIs de ventas.
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    1. Carga
                  </span>
                  <Icon name="refresh" size={12} />
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    2. Lógica
                  </span>
                  <Icon name="refresh" size={12} />
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    3. Persistencia
                  </span>
                </div>
              </div>

              <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Paso 1 */}
                <div className="lg:col-span-4 flex flex-col gap-4">
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
                        setSiappState((prev) => ({ ...prev, file: e.target.files?.[0] || null }))
                      }
                      label="Subir Archivo SIAPP"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton
                      icon="upload"
                      label="Subir SIAPP"
                      colorClass="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      onClick={handleSiappUpload}
                      loading={siappState.loadingStep === "siapp-upload"}
                      disabled={!siappState.file || Boolean(siappState.loadingStep)}
                    />
                    <ActionButton
                      icon="promote"
                      label="Promover"
                      colorClass="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                      onClick={handleSiappPromote}
                      loading={siappState.loadingStep === "siapp-promote"}
                      disabled={Boolean(siappState.loadingStep)}
                    />
                  </div>
                </div>

                {/* Paso 2 */}
                <div className="lg:col-span-4 flex flex-col gap-4 relative">
                  <div className="hidden lg:block absolute -left-5 top-1/2 -translate-y-1/2 text-gray-200 z-10">
                    <Icon name="refresh" size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold border border-slate-200">
                      2
                    </span>
                    Cálculo y lógica
                  </h3>
                  <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-100 h-full flex flex-col justify-center gap-4">
                    <div className="text-center mb-2">
                      <p className="text-xs text-gray-500">
                        Ejecuta las reglas de negocio sobre la data cargada.
                      </p>
                    </div>
                    <ActionButton
                      icon="calc"
                      label="Procesar Ventas"
                      subLabel="(Generate Sales)"
                      colorClass="bg-blue-600 text-white hover:bg-blue-700 border-transparent shadow-blue-200 shadow-md"
                      onClick={handleSiappProcess}
                      loading={siappState.loadingStep === "siapp-process"}
                      disabled={Boolean(siappState.loadingStep)}
                    />
                    <ActionButton
                      icon="save"
                      label="Guardar KPI"
                      subLabel="(Save DB)"
                      colorClass="bg-orange-600 text-white hover:bg-orange-700 border-transparent shadow-orange-200 shadow-md"
                      onClick={handleSiappSave}
                      loading={siappState.loadingStep === "siapp-save"}
                      disabled={Boolean(siappState.loadingStep)}
                    />
                  </div>
                </div>

                {/* Paso 3 */}
                <div className="lg:col-span-4 flex flex-col gap-4 relative">
                  <div className="hidden lg:block absolute -left-5 top-1/2 -translate-y-1/2 text-gray-200 z-10">
                    <Icon name="refresh" size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold border border-slate-200">
                      3
                    </span>
                    Automatización
                  </h3>
                  <div className="bg-emerald-50/30 rounded-xl p-5 border border-emerald-100 h-full flex flex-col justify-center items-center gap-4 text-center">
                    <div className="mb-2">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon name="check" size={20} />
                      </div>
                      <p className="text-xs text-emerald-800 font-medium">
                        Flujo configurado correctamente
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      Ejecuta todo el proceso en un solo paso si el archivo ya está en el servidor.
                    </p>
                    <ActionButton
                      icon="refresh"
                      label="Ejecutar Flujo Completo"
                      colorClass="bg-slate-800 text-white hover:bg-slate-900 border-transparent shadow-md w-full"
                      onClick={handleSiappFullFlow}
                      loading={siappState.loadingStep === "siapp-full"}
                      disabled={Boolean(siappState.loadingStep)}
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 lg:px-8">
                <StatusMessage message={siappState.message} error={siappState.error} />
              </div>
            </section>

            {/* Jerarquía y Presupuesto */}
            {/* <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-amber-50/50">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                  <Icon name="users" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Actualización Masiva: Jerarquía y Presupuesto
                  </h2>
                  <p className="text-xs text-gray-500">
                    Este archivo actualiza automáticamente la nómina de asesores y carga el presupuesto del mes.
                  </p>
                </div>
              </div>

              <div className="p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <FileDropZone
                    file={budgetState.file}
                    onChange={(e) =>
                      setBudgetState((prev) => ({ ...prev, file: e.target.files?.[0] || null }))
                    }
                    label="Subir Archivo de Jerarquía / Presupuesto"
                    helpText="Contiene estructura de asesores y metas"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center gap-4">
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <div className="flex items-start gap-3">
                      <Icon name="refresh" size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-amber-800 mb-1">Acción crítica</h4>
                        <p className="text-xs text-amber-700 leading-relaxed">
                          Al procesar este archivo se reestructurará la jerarquía de usuarios y se asignarán
                          metas para el periodo <strong>{period}</strong>. Verifica que el archivo sea definitivo.
                        </p>
                      </div>
                    </div>
                  </div>
                  <ActionButton
                    icon="upload"
                    label="Cargar Jerarquía y Presupuesto"
                    colorClass="bg-amber-600 text-white border-transparent hover:bg-amber-700 shadow-amber-200 shadow-md"
                    onClick={handleBudgetUpload}
                    loading={budgetState.loadingStep === "budget-upload"}
                    disabled={!budgetState.file || Boolean(budgetState.loadingStep)}
                  />
                  <ActionButton
                    icon="promote"
                    label="Promover Presupuesto"
                    colorClass="bg-slate-900 text-white border-transparent hover:bg-slate-800 shadow-md"
                    onClick={handleBudgetPromote}
                    loading={budgetState.loadingStep === "budget-promote"}
                    disabled={Boolean(budgetState.loadingStep)}
                  />
                  <ActionButton
                    icon="refresh"
                    label="Flujo completo Presupuesto"
                    colorClass="bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                    onClick={handleBudgetFullFlow}
                    loading={budgetState.loadingStep === "budget-full"}
                    disabled={Boolean(budgetState.loadingStep)}
                  />
                </div>
              </div>
              <div className="px-6 pb-6 lg:px-8">
                <StatusMessage message={budgetState.message} error={budgetState.error} />
              </div>
            </section> */}

            {/* Exportes */}
            <section className="mt-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2 pl-2">
                <Icon name="fileDown" size={16} /> Centro de Descargas y Reportes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-emerald-300 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Reporte SIAPP / KPI</h4>
                    <p className="text-xs text-gray-500 mt-1">Descarga el consolidado de ventas procesado.</p>
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
                    <h4 className="font-bold text-slate-800 text-sm">Reporte de Nómina</h4>
                    <p className="text-xs text-gray-500 mt-1">Estructura actual de asesores y pagos.</p>
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
                <StatusMessage message={downloadsState.message} error={downloadsState.error} />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DataWorkflow;
