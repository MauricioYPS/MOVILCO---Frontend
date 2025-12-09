import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useParams } from "react-router-dom"
import {
    fetchPayrollDetailsByUsers,
    selectPayrollDetails,
    selectPayrollError,
    selectPayrollLoading
} from "../../store/reducers/payrollReducers"

const currentPeriod = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    return `${year}-${month}`
}
const clampPercent = (value) => Math.min(100, Math.max(0, Number(value) || 0))
const formatPeriod = (period) => {
    const [year, month] = (period || "").split("-")
    const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ]
    const label = months[Number(month) - 1]
    return label && year ? `${label} ${year}` : "Periodo no definido"
}

const normalizeNovedades = (value) => {
    const list = Array.isArray(value) ? value : value ? [value] : []
    return list
        .map((item) => {
            if (!item) return null
            if (typeof item === "string" || typeof item === "number") return String(item)
            if (item && typeof item === "object") {
                const tipo = item.tipo || "Novedad"
                const descripcion = item.descripcion || ""
                const inicio = item.fecha_inicio ? `(${item.fecha_inicio}` : ""
                const fin = item.fecha_fin ? `${inicio ? " - " : "("}${item.fecha_fin}` : inicio ? ")" : ""
                const fechas = inicio ? `${inicio}${fin || ")"}` : ""
                return `${tipo}: ${descripcion}${fechas ? ` ${fechas}` : ""}`.trim()
            }
            return null
        })
        .filter(Boolean)
}

export default function AdvisorDetails({ onBack }) {
    const dispatch = useDispatch()
    const { id: idParam } = useParams()
    const location = useLocation()

    const advisorFromState = location.state?.advisor
    const selectedPeriod = location.state?.period || currentPeriod()
    const advisorId = idParam || advisorFromState?.id

    const payrollDetails = useSelector(selectPayrollDetails)
    const payrollLoading = useSelector(selectPayrollLoading)
    const payrollError = useSelector(selectPayrollError)

    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        if (advisorId && !payrollDetails?.[advisorId] && !payrollLoading) {
            dispatch(fetchPayrollDetailsByUsers([{ id: advisorId, document: advisorFromState?.cedula, period: selectedPeriod }]))
        }
    }, [advisorId, advisorFromState?.cedula, dispatch, payrollDetails, payrollLoading, selectedPeriod])

    const detail = payrollDetails?.[advisorId] ?? {}
    const nombre = detail.asesor_nombre || detail.nombre || detail.nombre_funcionario || advisorFromState?.nombre || "Asesor sin nombre"
    const cedula = detail.documento || detail.cedula || advisorFromState?.cedula || "N/A"
    const cargo = advisorFromState?.cargo || "Asesor Comercial"
    const distrito = detail.direccion || detail.distrito || advisorFromState?.distrito || "N/A"
    const regional = detail.regional || detail.distrito_claro || advisorFromState?.regional || "N/A"
    const diasLaborados = detail.dias_laborados ?? detail.dias_laborados_31 ?? advisorFromState?.diasLaborados ?? 0
    const telefono = advisorFromState?.telefono || "N/D"
    const correo = advisorFromState?.correo || "N/D"
    const conexiones = Number(detail.ventas_totales ?? advisorFromState?.ventas ?? 0)
    const meta = Number(detail.presupuesto_prorrateado ?? advisorFromState?.prorrateo ?? 0)
    const cumplimiento = clampPercent(meta ? (conexiones / meta) * 100 : detail.cumple_global ? 100 : advisorFromState?.cumplimiento ?? 0)
    const novedades = normalizeNovedades(detail.novedades ?? advisorFromState?.novedades ?? null)

    const goBack = () => {
        if (onBack) onBack()
        else window.history.back()
    }

    if (!advisorId) {
        return <div className="p-6 text-red-600">No se encontr&oacute; el asesor solicitado.</div>
    }

    if (payrollLoading && !detail.nombre_funcionario) {
        return <div className="p-6 text-gray-700">Cargando informaci&oacute;n del asesor...</div>
    }

    if (payrollError && !detail.nombre_funcionario) {
        return <div className="p-6 text-red-600">Error al cargar la informaci&oacute;n: {payrollError}</div>
    }

    return (
        <div className="flex min-h-screen bg-secundario font-sans">
            <main className="flex-1 p-6 md:p-8 lg:pl-12 pb-16">
                <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center text-sm text-gray-600 hover:text-principal font-medium mb-2 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver
                </button>

                <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Dashboard del Asesor</h2>
                        <p className="text-gray-600">
                            Viendo a: <span className="font-semibold text-gray-800">{nombre}</span>
                        </p>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            Enviar Mensaje
                        </button>

                        <button
                            type="button"
                            onClick={() => setModalOpen(true)}
                            className="flex items-center red-movilco text-white px-4 py-2 rounded-lg shadow-md hover:bg-principal-darker transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                            Enviar Notificaci&oacute;n
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <StatCard
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-rojo-icono"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        }
                        label="Mes Actual"
                        value={formatPeriod(selectedPeriod)}
                    />
                    <StatCard
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-rojo-icono"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        }
                        label="Conexiones"
                        value={conexiones}
                    />
                    <StatCard
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-rojo-icono"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H7a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        }
                        label="Meta"
                        value={meta}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <AdvisorInfo
                            cedula={cedula}
                            cargo={cargo}
                            regional={regional}
                            distrito={distrito}
                            diasLaborados={diasLaborados}
                            telefono={telefono}
                            correo={correo}
                            cumplimiento={cumplimiento}
                        />
                        <NovedadesPanel novedades={novedades} />
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <SalesTable />

                        <CollapsibleCard title="Historial de estad&iacute;sticas">
                            <div className="space-y-6">
                                <HistorialMes
                                    mes="Octubre 2024"
                                    conexiones="12 / 15"
                                    progreso={80}
                                    barraColor="bg-principal"
                                    alerta="Notificar incumplimiento"
                                    novedades="Vacaciones del 19/07/2024 al 05/08/2024. Incap. del 14/08/2024 al 15/08/2024"
                                    borderColor="border-principal"
                                />

                                <hr className="border-gray-200" />

                                <HistorialMes
                                    mes="Septiembre 2024"
                                    conexiones="17 / 15"
                                    progreso={100}
                                    barraColor="bg-green-500"
                                    novedades="Asesor felicitado por cliente en servicio de 22/09."
                                    borderColor="border-principal"
                                />

                                <hr className="border-gray-200" />

                                <HistorialMes
                                    mes="Agosto 2024"
                                    conexiones="10 / 15"
                                    progreso={66}
                                    barraColor="bg-principal"
                                    alerta="Notificar incumplimiento"
                                    novedades="Sin novedades registradas."
                                    borderColor="border-gray-400"
                                    novedadesMuted
                                />
                            </div>
                        </CollapsibleCard>

                        <CollapsibleCard title="Historial de reportes">
                            <ul className="space-y-4">
                                <ReporteItem
                                    titulo="Reporte de veh&iacute;culo"
                                    asunto="Falla en frenos"
                                    fecha="10/11/2025"
                                    leido="Si"
                                    leidoColor="text-green-600"
                                />
                                <ReporteItem
                                    titulo="Reporte de material"
                                    asunto="Falta de conectores"
                                    fecha="08/11/2025"
                                    leido="Si"
                                    leidoColor="text-green-600"
                                />
                                <ReporteItem
                                    titulo="Reporte de incidente"
                                    asunto="Problema con cliente"
                                    fecha="05/11/2025"
                                    leido="No"
                                    leidoColor="text-principal"
                                />
                            </ul>
                        </CollapsibleCard>
                    </div>
                </div>
            </main>

            <NotificationModal open={modalOpen} onClose={() => setModalOpen(false)} asesorNombre={nombre} />

            <ExportButton />
        </div>
    )
}



function NotificationModal({ open, onClose, asesorNombre = "Asesor" }) {
    if (!open) return null

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-30"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose?.()
            }}
        >
            <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-2xl transform transition-transform duration-300 scale-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Enviar Notificaci&oacute;n</h3>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="modal-asunto" className="block text-sm font-medium text-gray-700 mb-1">
                            Asunto
                        </label>
                        <input
                            id="modal-asunto"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-principal focus:border-principal"
                            placeholder="Asunto de la notificaci&oacute;n"
                        />
                    </div>

                    <div>
                        <label htmlFor="modal-mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                            Mensaje
                        </label>
                        <textarea
                            id="modal-mensaje"
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-principal focus:border-principal"
                            placeholder={`Escribe tu mensaje para ${asesorNombre}...`}
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={() => onClose?.()}
                            className="bg-principal text-white px-4 py-2 rounded-lg shadow-md hover:bg-principal-darker transition-colors"
                        >
                            Enviar Notificaci&oacute;n
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ icon, label, value }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-full">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    )
}

function AdvisorInfo({ cedula, cargo, regional, distrito, diasLaborados, telefono, correo, cumplimiento }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informaci&oacute;n del Asesor</h2>
            <div className="space-y-3">
                <InfoRow label="C&eacute;dula" value={cedula} />
                <InfoRow label="Cargo" value={cargo} />
                <InfoRow label="Regional" value={regional} />
                <InfoRow label="Distrito" value={distrito} />
                <InfoRow label="D&iacute;as Laborados" value={diasLaborados} />
                <InfoRow label="Tel&eacute;fono" value={telefono} />
                <InfoRow label="Correo" value={correo} small />
                <InfoRow label="Cumplimiento" value={`${Math.round(cumplimiento)}%`} />
            </div>
        </div>
    )
}

function NovedadesPanel({ novedades }) {
    const items = Array.isArray(novedades) ? novedades.filter(Boolean) : novedades ? [novedades] : []

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Novedades recientes</h2>
            {items.length === 0 ? (
                <p className="text-sm text-gray-600">Sin novedades registradas para este asesor.</p>
            ) : (
                <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
                    {items.map((n, idx) => (
                        <li key={idx} className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                            {n}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

function SalesTable() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Historial de conexiones</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-gray-200">
                        <tr>
                            <Th>Servicio</Th>
                            <Th>Fecha</Th>
                            <Th>Estado</Th>
                            <Th>Observaciones</Th>
                        </tr>
                    </thead>
                    <tbody>
                        <VentaRow
                            servicio="Instalaci&oacute;n Fibra"
                            fecha="15/10/2024"
                            estado="Entregado"
                            estadoColor="bg-green-100 text-green-700"
                            obs="Zona - Dire - Obs"
                        />
                        <VentaRow
                            servicio="Mantenimiento HFC"
                            fecha="14/10/2024"
                            estado="Entregado"
                            estadoColor="bg-green-100 text-green-700"
                            obs="Zona - Dire - Servicio"
                        />
                        <VentaRow
                            servicio="Revision DTH"
                            fecha="12/10/2024"
                            estado="Pendiente"
                            estadoColor="bg-yellow-100 text-yellow-700"
                            obs="Cliente no encontrado"
                        />
                        <VentaRow
                            servicio="Instalaci&oacute;n Triple Play"
                            fecha="11/10/2024"
                            estado="Cancelado"
                            estadoColor="bg-red-100 text-red-700"
                            obs="Usuario anula servicio"
                        />
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function HistorialMes({ mes, conexiones, progreso, barraColor, alerta, novedades, borderColor, novedadesMuted }) {
    return (
        <div>
            <p className="font-semibold text-gray-700">{mes}</p>
            <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Conexiones:</span>
                <span className="font-bold text-gray-800">{conexiones}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className={`${barraColor} h-2 rounded-full`} style={{ width: `${progreso}%` }}></div>
            </div>

            {alerta && (
                <div className="mt-3">
                    <span className="bg-principal text-white text-xs font-bold px-3 py-1 rounded-full">{alerta}</span>
                </div>
            )}

            <div className="mt-3">
                <p className="font-semibold text-gray-600 text-sm">Novedades</p>
                <div className={`bg-gray-50 border-l-4 ${borderColor} p-3 rounded-r-lg mt-1`}>
                    <p className={`text-sm ${novedadesMuted ? "text-gray-500 italic" : "text-gray-700"}`}>{novedades}</p>
                </div>
            </div>
        </div>
    )
}

function ReporteItem({ titulo, asunto, fecha, leido, leidoColor }) {
    return (
        <li className="flex flex-wrap justify-between items-center bg-gray-50 p-4 rounded-lg">
            <div>
                <p className="font-semibold text-gray-800">{titulo}</p>
                <p className="text-sm text-gray-500">Asunto: {asunto}</p>
            </div>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <span className="text-sm text-gray-500">{fecha}</span>
                <span className={`text-sm font-bold ${leidoColor}`}>Le&iacute;do: {leido}</span>
            </div>
        </li>
    )
}

function CollapsibleCard({ title, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <div className="bg-white rounded-xl shadow-lg">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex justify-between items-center text-left p-6"
            >
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                className={`px-6 pb-6 overflow-hidden transition-all duration-500 ease-in-out ${
                    open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="border-t pt-4">{children}</div>
            </div>
        </div>
    )
}

function EmptyState() {
    return (
        <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-600">
            No hay secciones adicionales para este asesor.
        </div>
    )
}

function InfoRow({ label, value, small }) {
    return (
        <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">{label}</span>
            <span className={`font-semibold text-gray-800 ${small ? "text-sm" : ""}`}>{value}</span>
        </div>
    )
}

function Th({ children }) {
    return (
        <th className="py-3 px-4 text-sm font-semibold text-gray-500 uppercase">
            {children}
        </th>
    )
}

function VentaRow({ servicio, fecha, estado, estadoColor, obs }) {
    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-4 px-4 font-medium text-gray-800">{servicio}</td>
            <td className="py-4 px-4 text-gray-600">{fecha}</td>
            <td className="py-4 px-4">
                <span className={`${estadoColor} text-xs font-semibold px-3 py-1 rounded-full`}>{estado}</span>
            </td>
            <td className="py-4 px-4 text-gray-600 text-sm">{obs}</td>
        </tr>
    )
}

function ExportButton() {
    return (
        <button
            type="button"
            className="fixed bottom-8 right-8 bg-excel text-white p-4 rounded-full shadow-lg z-10 hover:bg-excel-darker hover:scale-110 transition-all duration-300"
            title="Exportar a Excel"
            onClick={() => console.log("Exportar a Excel")}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6C4.897 2 4 2.897 4 4V20C4 21.103 4.897 22 6 22H18C19.103 22 20 21.103 20 20V8L14 2ZM13 3.414L17.586 8H13V3.414ZM12.8 14.5L15 17H13.5L12 15.2L10.5 17H9L11.2 14.5L9 12H10.5L12 13.8L13.5 12H15L12.8 14.5Z" />
            </svg>
        </button>
    )
}
