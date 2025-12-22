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
    window.open(
      `${api}/api/historico/siapp/${periodo_backup}/excel`,
      "_blank"
    )
  }

  return (
    <>
      {/* BOTÓN */}
      <button
        onClick={() => setOpen(true)}
        className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 hover:shadow-md transition"
      >
        <div className="bg-red-50 text-[#C62828] p-2 rounded-lg">
          <Database size={18} />
        </div>
        <div className="text-left">
          <div className="text-xs font-bold text-gray-400 uppercase">
            Historial
          </div>
          <div className="text-sm font-bold text-slate-800">
            Backups SIAPP
          </div>
        </div>
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            
            {/* HEADER */}
            <div className="bg-[#C62828] text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">
                Historial de Backups SIAPP
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="hover:bg-white/20 p-1 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
              {loading && (
                <p className="text-sm text-gray-500">
                  Cargando backups...
                </p>
              )}

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              {!loading && backups.length === 0 && (
                <p className="text-sm text-gray-500">
                  No hay backups disponibles.
                </p>
              )}

              {backups.map((b) => (
                <div
                  key={b.periodo_backup}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-slate-50 transition"
                >
                  <div>
                    <div className="font-bold text-slate-800">
                      Periodo {b.periodo_comercial}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(b.created_at).toLocaleString("es-CO")}
                    </div>
                  </div>

                  <button
                    onClick={() => downloadBackup(b.periodo_backup)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-white bg-[#C62828] hover:bg-red-800 rounded-lg shadow-sm"
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
                className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg"
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
