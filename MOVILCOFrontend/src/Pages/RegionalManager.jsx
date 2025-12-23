import { useNavigate } from "react-router-dom"
import { Database, Mail } from "lucide-react"
import SiappBackupsButton from "../Props/SiappBackupsButton"
import Header from "../Props/RegionalManager/Header"
import KpiCard from "../Props/RegionalManager/KpiCard"
import DistrictTable from "../Props/RegionalManager/DistrictTable"
import useRegionalManagerData from "../hooks/useRegionalManagerData"
import { Icon, getGapColor } from "../Props/RegionalManager/shared"
import KpiSyncButton from "../components/KpiSyncButton"

export default function RegionalManager() {
  const navigate = useNavigate()
  const {
    processedData,
    globalStats,
    novedades,
    loading,
    error,
    currentDay,
    totalDays,
    progressTimePct,
    periodDirections,
    reload
  } = useRegionalManagerData()

  const handleViewCoordinator = (coordId) => {
    if (!coordId) return
    navigate(`/CoordinatorDetails/${coordId}`, {
      state: {
        period: periodDirections,
        directionId: coordId
      }
    })
  }

  const goDB = () => {
    navigate("/dataWorkFlow")
  }

  return (
    <div className="flex min-h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenu={() => {}} currentDay={currentDay} totalDays={totalDays} progressPct={progressTimePct} />

        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8 rm-text-up">
          {/* ACCIONES / BOTONES SUPERIORES */}
          <div
            className="
              mb-6 w-full
              grid gap-3
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-4
              items-stretch
            "
          >
            {/* Enviar correos */}
            <button
              onClick={() => (window.location.href = "/SendMails")}
              className="
                w-full min-h-[72px]
                flex items-center gap-3
                rounded-xl border border-gray-200 bg-white
                px-4 py-4 text-left
                shadow-sm transition hover:shadow-md
                overflow-hidden
              "
            >
              <div className="shrink-0 bg-orange-50 text-orange-600 p-2 rounded-lg">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Comunicaciones</div>
                <div className="text-sm font-bold text-slate-800 truncate">Enviar Correos</div>
                <div className="mt-0.5 text-[11px] text-gray-500 truncate">Acceso al módulo de correos</div>
              </div>
            </button>

            {/* Actualizar DB */}
            <button
              onClick={goDB}
              className="
                w-full min-h-[72px]
                flex items-center gap-3
                rounded-xl border border-gray-200 bg-white
                px-4 py-4 text-left
                shadow-sm transition hover:shadow-md
                overflow-hidden
              "
            >
              <div className="shrink-0 bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                <Database size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Datos</div>
                <div className="text-sm font-bold text-slate-800 truncate">Actualizar DB</div>
                <div className="mt-0.5 text-[11px] text-gray-500 truncate">Workflow de carga y sync</div>
              </div>
            </button>

            {/* KPI Sync: ocupa 2 columnas en XL para que no se monte (porque internamente son 2 tiles) */}
            <div className="w-full xl:col-span-2 min-w-0">
              <KpiSyncButton period={periodDirections} className="w-full" onSuccess={reload} />
            </div>

            {/* Backups SIAPP: normal, sin justify-end (evita que “se corra” raro) */}
            <div className="w-full min-w-0">
              <SiappBackupsButton />
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {loading && (
            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Cargando datos...
            </div>
          )}

          <div className="mx-auto max-w-[1400px] space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                title="Venta Total Acumulada"
                value={Number(globalStats.sales || 0).toLocaleString()}
                meta={Number(globalStats.goal || 0).toLocaleString()}
                progress={globalStats.compliance}
              />

              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600" />
                <div className="flex items-center justify-between pl-2">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Control Prorrateo{" "}
                      <span className="font-extrabold text-red-600">(Día {currentDay})</span>
                    </p>
                    <h3 className={`mt-1 text-3xl font-bold ${getGapColor(globalStats.gap)}`}>
                      {globalStats.gap > 0 ? "+" : ""}
                      {globalStats.gap}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-slate-500">Unidades de Diferencia</p>
                  </div>
                  <div className="text-right">
                    <p className="mb-1 text-[10px] text-gray-400">Meta Ideal Hoy</p>
                    <p className="text-lg font-bold text-slate-700">{globalStats.proratedGoal.toLocaleString()}</p>
                    <div
                      className={`mt-1 rounded px-2 py-1 text-xs font-bold ${
                        globalStats.proratedCompliance >= 100
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {globalStats.proratedCompliance.toFixed(1)}% Cump.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Direcciones</p>
                  <h3 className="mt-1 text-3xl font-bold text-slate-900">{processedData.length}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <Icon path="M9 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M21 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" size={12} />
                    Datos {loading ? "cargando" : "listos"}
                  </p>
                </div>
                <div className="rounded-full bg-slate-50 p-3 text-slate-600">
                  <Icon
                    path="M9 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M21 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M2 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2 M14 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2"
                    size={24}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white shadow-md">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Proyección Cierre</p>
                  <h3 className="mt-1 text-3xl font-bold">94.5%</h3>
                  <p className="mt-1 text-xs text-slate-300">Tendencia al alza</p>
                </div>
                <Icon path="M3 17h2l1-2 3 3 5-7 4 5 3-9" size={32} className="text-emerald-400 opacity-80" />
              </div>
            </div>

            <div className="space-y-6">
              <DistrictTable data={processedData} currentDate={currentDay} handleViewCoordinator={handleViewCoordinator} />

              <div className="w-full">
                <div className="mx-auto max-w-6xl">
                  <div className="rounded-xl border border-dashed border-gray-200 bg-white/90 p-4 shadow-sm">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Icon path="M2 6h20M5 6v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" size={16} className="text-amber-500" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">Centro de Novedades</p>
                          <p className="text-[11px] text-gray-500">Sección en pausa (próximamente)</p>
                        </div>
                      </div>
                      <span className="text-[11px] rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-600">
                        {novedades.length} ítems en espera
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {novedades.map((nov) => (
                        <div
                          key={nov.id}
                          className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-600"
                        >
                          <p className="font-semibold text-gray-800 flex items-center gap-2">
                            <Icon path="M2 6h20M5 6v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" size={12} className="text-amber-500" />
                            {nov.tipo}: {nov.ciudad}
                          </p>
                          <p className="mt-1 line-clamp-2">{nov.mensaje}</p>
                          <p className="mt-1 text-[11px] text-gray-400">
                            {nov.zona} · {nov.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
