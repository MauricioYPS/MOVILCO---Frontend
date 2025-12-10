import React from "react"
import { useNavigate } from "react-router-dom"
import useAuthSession from "../hooks/useAuthSession"

export default function Home() {
  const navigate = useNavigate()
  const { token } = useAuthSession()
  const isLoggedIn = Boolean(token)

  const handleAction = () => {
    if (isLoggedIn) {
      navigate("/Advisors")
    } else {
      navigate("/SignIn")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex flex-col">
      <header className="max-w-6xl w-full mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-extrabold flex items-center justify-center shadow-md">M</div>
          <div>
            <p className="text-sm font-semibold text-red-700">MOVILCO</p>
            <p className="text-xs text-gray-500">Portal Comercial</p>
          </div>
        </div>
        <button
          onClick={handleAction}
          className="px-4 py-2 text-sm font-bold bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors"
        >
          {isLoggedIn ? "Ir al módulo" : "Iniciar sesión"}
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wide">
              Plataforma comercial
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
              Gestiona tus ventas y equipos con el portal <span className="text-red-600">MOVILCO</span>
            </h1>
            <p className="text-lg text-slate-600">
              Accede a métricas en tiempo real, registra ventas, consulta CIAP y gestiona asesores y coordinadores desde un solo lugar.
            </p>
            <button
              onClick={handleAction}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-bold bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all"
            >
              {isLoggedIn ? "Ir al módulo" : "Iniciar sesión"}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-100 rounded-full blur-2xl opacity-60" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-100 rounded-full blur-2xl opacity-60" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Panel Asesor</p>
                  <p className="text-2xl font-bold text-slate-900">Resumen diario</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Tiempo real</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <p className="text-xs font-bold text-gray-500 uppercase">Ventas aprobadas</p>
                  <p className="text-3xl font-extrabold text-slate-900">42</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">+8 esta semana</p>
                </div>
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <p className="text-xs font-bold text-gray-500 uppercase">Pendientes</p>
                  <p className="text-3xl font-extrabold text-slate-900">7</p>
                  <p className="text-xs text-amber-600 font-semibold mt-1">En revisión CIAP</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 bg-white">
                <p className="text-xs font-bold text-gray-500 uppercase">Bandeja de notificaciones</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  <li>• Nueva venta registrada en Meta</li>
                  <li>• CIAP generado para Julio</li>
                  <li>• Coordinador aprobó 2 ventas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
