import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { api } from "../../store/api.js"
import { getStoredToken } from "../utils/auth"

const isValidPeriod = (value) => /^\d{4}-(0[1-9]|1[0-2])$/.test(value || "")
const getCurrentPeriod = () => {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `${now.getFullYear()}-${month}`
}

const STEP_MESSAGES = {
  1: "Paso 1/3: Calculando weekly...",
  2: "Paso 2/3: Guardando weekly...",
  3: "Paso 3/3: Recalculando KPI mensual..."
}

export default function KpiSyncButton({ period, onSuccess, className = "", disabled = false }) {
  const [status, setStatus] = useState("idle") // idle | loading | success | error
  const [step, setStep] = useState(0)
  const [error, setError] = useState("")
  const [periodInput, setPeriodInput] = useState(getCurrentPeriod())

  useEffect(() => {
    if (isValidPeriod(period)) {
      setPeriodInput(period)
    }
  }, [period])

  const computedPeriod = useMemo(
    () => (isValidPeriod(periodInput) ? periodInput : getCurrentPeriod()),
    [periodInput]
  )
  const invalidPeriod = !isValidPeriod(computedPeriod)
  const isBusy = status === "loading"

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        setStatus("idle")
        setStep(0)
        setError("")
      }, 4000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [status])

  const attachAuth = (config = {}) => {
    const token = getStoredToken?.()
    if (token) {
      config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` }
    }
    return config
  }

  const runSync = async () => {
    if (invalidPeriod) {
      setError("Periodo invalido, use YYYY-MM")
      setStatus("error")
      return
    }
    setStatus("loading")
    setStep(1)
    setError("")

    try {
      await axios.post(
        `${api}/api/kpi/weekly/calculate`,
        null,
        attachAuth({ params: { period: computedPeriod } })
      )
      setStep(2)
      await axios.post(
        `${api}/api/kpi/weekly/save`,
        null,
        attachAuth({ params: { period: computedPeriod } })
      )
      setStep(3)
      await axios.get(`${api}/api/kpi/calculate`, attachAuth({ params: { period: computedPeriod } }))

      setStatus("success")
      setStep(0)
      if (typeof onSuccess === "function") {
        onSuccess()
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Error al actualizar KPIs"
      setError(msg)
      setStatus("error")
    }
  }

  const renderIcon = () => {
    if (status === "loading") return <Loader2 className="h-5 w-5 text-slate-600 animate-spin" />
    if (status === "success") return <CheckCircle2 className="h-5 w-5 text-emerald-600" />
    if (status === "error") return <AlertCircle className="h-5 w-5 text-amber-600" />
    return <RefreshCw className="h-5 w-5 text-slate-700" />
  }

  const title = (() => {
    if (status === "loading") return "Actualizando KPIs..."
    if (status === "success") return "Actualización completada"
    if (status === "error") return "Error al actualizar"
    return "Actualizar KPIs"
  })()

  const subtitle = (() => {
    if (status === "loading") return STEP_MESSAGES[step] || "Ejecutando pipeline..."
    if (status === "success") return "Calculate semanal, guarda y recalcula mes"
    if (status === "error") return error || "Revise el periodo e intente de nuevo"
    return "Calculate semanal, guarda y recalcula mes"
  })()

  return (
    <div className={`w-full ${className}`}>
      {/* Wrapper: en pantallas grandes se alinea en 2 columnas; en móvil se apila */}
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {/* BOTÓN principal (tile-friendly) */}
        <button
          type="button"
          onClick={runSync}
          disabled={disabled || isBusy}
          className={`
            w-full min-h-[72px]
            rounded-xl border border-gray-200 bg-white
            px-4 py-4
            shadow-sm transition hover:shadow-md
            flex items-center gap-3 text-left
            ${disabled || isBusy ? "opacity-80 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <div
            className={`
              shrink-0 rounded-lg p-2
              ${status === "success" ? "bg-emerald-50" : status === "error" ? "bg-amber-50" : "bg-slate-50"}
            `}
          >
            {renderIcon()}
          </div>

          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wide text-gray-400">
              KPI · Weekly + Mensual
            </div>
            <div className="text-sm font-bold text-slate-800 truncate">{title}</div>
            <div className={`mt-0.5 text-[11px] truncate ${status === "error" ? "text-amber-700" : "text-gray-500"}`}>
              {invalidPeriod ? "Periodo invalido, use YYYY-MM" : subtitle}
            </div>
          </div>
        </button>

        {/* Tile de periodo (misma altura visual, sin deformar) */}
        <div className="w-full min-h-[72px] rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm flex items-center">
          <div className="w-full flex items-center gap-3">
            <div className="shrink-0 rounded-lg bg-slate-50 p-2">
              <span className="text-[11px] font-bold text-slate-700">PERIODO</span>
            </div>

            <div className="min-w-0 w-full">
              <label className="block text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Seleccione mes
              </label>
              <input
                type="month"
                value={periodInput}
                onChange={(e) => setPeriodInput(e.target.value)}
                className="
                  mt-1 w-full
                  rounded-md border border-gray-200
                  px-3 py-2 text-sm text-slate-800
                  focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
