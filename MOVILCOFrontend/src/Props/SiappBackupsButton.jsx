import { useEffect, useState } from "react"
import axios from "axios"
import { X, Download, Database } from "lucide-react"
import { api } from "../../store/api"

export default function SiappBackupsButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [backups, setBackups] = useState([])
  const [error, setError] = useState(null)

  const loadBackups = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await axios.get(`${api}/api/historico/siapp`)
      setBackups(data?.backups || [])
    } catch (err) {
      setError("No fue posible cargar el historial de backups.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) loadBackups()
  }, [open])

  const downloadBackup = (periodo_backup) => {
    window.open(`${api}/api/historico/siapp/${periodo_backup}/excel`, "_blank")
  }

  return (
    <>
      {/* BOTÓN (tile-friendly, full width, altura consistente) */}
      <button
        onClick={() => setOpen(true)}
        className="
          w-full min-h-[72px]
          rounded-xl border border-gray-200 bg-white
          px-4 py-4
          shadow-sm transition hover:shadow-md
          flex items-center gap-3
        "
      >
        <div className="shrink-0 rounded-lg bg-red-50 p-2 text-[#C62828]">
          <Database size={18} />
        </div>

        <div className="min-w-0 text-left">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            Historial
          </div>
          <div className="text-sm font-bold text-slate-800 truncate">
            Backups SIAPP
          </div>
          <div className="mt-0.5 text-[11px] text-gray-500 truncate">
            Ver y descargar respaldos por periodo
          </div>
        </div>
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="bg-[#C62828] text-white px-6 py-4 flex justify-between items-center">
              <div className="min-w-0">
                <h3 className="font-bold text-lg truncate">Historial de Backups SIAPP</h3>
                <p className="text-xs text-white/80 truncate">
                  Descarga el respaldo en Excel para cada periodo
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="shrink-0 hover:bg-white/20 p-2 rounded-lg transition"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
              {loading && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  Cargando backups...
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {!loading && !error && backups.length === 0 && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  No hay backups disponibles.
                </div>
              )}

              {backups.map((b) => (
                <div
                  key={b.periodo_backup}
                  className="
                    border border-gray-200 rounded-xl p-4
                    flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between
                    hover:bg-slate-50 transition
                  "
                >
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800 truncate">
                      Periodo {b.periodo_comercial}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(b.created_at).toLocaleString("es-CO")}
                    </div>
                  </div>

                  <button
                    onClick={() => downloadBackup(b.periodo_backup)}
                    className="
                      inline-flex items-center justify-center gap-2
                      px-4 py-2.5
                      text-sm font-bold text-white
                      bg-[#C62828] hover:bg-red-800
                      rounded-lg shadow-sm transition
                      w-full sm:w-auto
                    "
                  >
                    <Download size={16} />
                    Descargar
                  </button>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-right">
              <button
                onClick={() => setOpen(false)}
                className="
                  px-4 py-2
                  text-sm font-bold text-gray-700
                  hover:bg-gray-200
                  rounded-lg transition
                "
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
