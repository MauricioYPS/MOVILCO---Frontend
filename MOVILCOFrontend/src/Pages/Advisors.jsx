import { useState } from "react";

const INITIAL_NOTES = [
    {
        id: 1,
        text: "El asesor reporta problemas con el vehículo de la compañía.",
        time: "Hace 1 hora",
    },
    {
        id: 2,
        text: "Felicitado por cliente en servicio de 14/10.",
        time: "Hace 3 horas",
    },
];

export default function NewAdvisor({ onBack }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [noteText, setNoteText] = useState("");
    const [notes, setNotes] = useState(INITIAL_NOTES);

    const handleAddNote = () => {
        const text = noteText.trim();
        if (!text) return;
        setNotes((prev) => [{ id: Date.now(), text, time: "Ahora mismo" }, ...prev]);
        setNoteText("");
    };

    const goBack = () => {
        if (onBack) onBack();
        else window.history.back();
    };

    return (
        <div className="flex min-h-screen bg-secundario font-sans">
            <CoordinatorSidebar />

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
                            Viendo a: <span className="font-semibold text-gray-800">Juan Pérez</span>
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
                            Enviar Notificación
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
                        value="Noviembre"
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
                        value="13"
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
                        value="11"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <AdvisorInfo />
                        <NotesPanel
                            noteText={noteText}
                            notes={notes}
                            onChange={setNoteText}
                            onAdd={handleAddNote}
                        />
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <SalesTable />

                        <CollapsibleCard title="Historial de estadísticas">
                            <div className="space-y-6">
                                <HistorialMes
                                    mes="Octubre 2024"
                                    conexiones="12 / 15"
                                    progreso={80}
                                    barraColor="bg-principal"
                                    alerta="Notificar incumplimiento"
                                    novedades="VACACIONES DEL 19/07/2025 AL 05/08/2025. INCAP. DEL 14/08/2025 AL 15/08/2025"
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
                                    titulo="Reporte de vehículo"
                                    asunto="Falla en frenos"
                                    fecha="10/11/2025"
                                    leido="Sí"
                                    leidoColor="text-green-600"
                                />
                                <ReporteItem
                                    titulo="Reporte de material"
                                    asunto="Falta de conectores"
                                    fecha="08/11/2025"
                                    leido="Sí"
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

            <NotificationModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                asesorNombre="Juan Pérez"
            />

            <ExportButton />
        </div>
    );
}

function CoordinatorSidebar() {
    return (
        <nav className="hidden lg:flex w-[14%] red-movilco text-white flex-col sticky top-0 h-auto flex-shrink-0 shadow-lg z-10
     justify-end">

            <div className="flex-1 mt-4 overflow-y-auto pr-2  fixed top-16 bottom-40 w-[14%] justify-around flex-col">
                <div className="p-6 text-center">
                    <h1 className="text-2xl font-bold sticky">Panel Coordinador</h1>
                </div>
                <ol className="">
                    <li className="hover:red-movilco"><SidebarItem active iconPath="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                      Dashboard Asesor
                    </SidebarItem></li>
                    <li className="hover:red-movilco"><SidebarItem iconPath="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                        Trazabilidad
                    </SidebarItem></li>
                    <li className=" hover:red-movilco"><SidebarItem iconPath="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6">Metas</SidebarItem></li>
                    <li className=" hover:red-movilco"><SidebarItem iconPath="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
                        Novedades
                    </SidebarItem></li>
                </ol>


            </div>
            <div className="p-6 border-t border-principal-darker hover:red-movilco">
                <button className="flex items-center space-x-3 text-red-100 hover:text-white w-full ">
                    <SidebarIcon path="M17 16l4-4m0 0l-4-4m4 4H3" />
                    <span>Cerrar Sesión</span>
                </button>
            </div>

        </nav>
    );
}

function SidebarItem({ iconPath, children, active }) {
    return (
        <li
            className={`px-6 py-3 transition-colors duration-200 ${active ? "bg-principal-darker font-semibold" : "hover:bg-principal-darker"
                }`}
        >
            <button className="w-full flex items-center space-x-3 text-left">
                <SidebarIcon path={iconPath} />
                <span>{children}</span>
            </button>
        </li>
    );
}

function SidebarIcon({ path }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d={path} />
        </svg>
    );
}

function CollapsibleCard({ title, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);

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
                className={`px-6 pb-6 overflow-hidden transition-all duration-500 ease-in-out ${open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="border-t pt-4">{children}</div>
            </div>
        </div>
    );
}

function NotificationModal({ open, onClose, asesorNombre = "Juan Pérez" }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-30"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose?.();
            }}
        >
            <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-2xl transform transition-transform duration-300 scale-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Enviar Notificación</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
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
                            placeholder="Asunto de la notificación"
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
                        ></textarea>
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
                            Enviar Notificación
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-full">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}

function AdvisorInfo() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Asesor</h2>
            <div className="space-y-3">
                <InfoRow label="Cédula" value="12.345.678" />
                <InfoRow label="Cargo" value="Asesor de Campo" />
                <InfoRow label="Regional" value="Antioquia" />
                <InfoRow label="Distrito" value="Medellín" />
                <InfoRow label="Días Laborados" value="22" />
                <InfoRow label="Teléfono" value="300 123 4567" />
                <InfoRow label="Correo" value="j.perez@empresa.com" small />
            </div>
        </div>
    );
}

function NotesPanel({ noteText, notes, onChange, onAdd }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Novedades</h2>

            <div className="mb-4">
                <label htmlFor="novedad-texto" className="block text-sm font-medium text-gray-700 mb-1">
                    Agregar Novedad
                </label>
                <textarea
                    id="novedad-texto"
                    rows={3}
                    value={noteText}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-principal focus:border-principal"
                    placeholder="Escribir una nota..."
                ></textarea>
                <button
                    type="button"
                    onClick={onAdd}
                    className="w-full mt-2 red-movilco text-white py-2 px-4 rounded-lg shadow-md hover:bg-principal-darker transition-colors  active:scale-99 hover:scale-102"
                >
                    Agregar
                </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">Novedades Recientes</h3>
            <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {notes.map((n) => (
                    <li key={n.id} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{n.text}</p>
                        <span className="text-xs text-gray-400">{n.time}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SalesTable() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ventas del Mes</h2>
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
                            servicio="Instalación Fibra"
                            fecha="15/10/2024"
                            estado="Entregado"
                            estadoColor="bg-green-100 text-green-700"
                            obs="Zona - Dire - N[obs]"
                        />
                        <VentaRow
                            servicio="Mantenimiento HFC"
                            fecha="14/10/2024"
                            estado="Entregado"
                            estadoColor="bg-green-100 text-green-700"
                            obs="Zona - Dire - Servicio"
                        />
                        <VentaRow
                            servicio="Revisión DTH"
                            fecha="12/10/2024"
                            estado="Pendiente"
                            estadoColor="bg-yellow-100 text-yellow-700"
                            obs="Cliente no encontrado"
                        />
                        <VentaRow
                            servicio="Instalación Triple Play"
                            fecha="11/10/2024"
                            estado="Cancelado"
                            estadoColor="bg-red-100 text-red-700"
                            obs="Usuario anula servicio"
                        />
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function InfoRow({ label, value, small }) {
    return (
        <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">{label}</span>
            <span className={`font-semibold text-gray-800 ${small ? "text-sm" : ""}`}>{value}</span>
        </div>
    );
}

function Th({ children }) {
    return (
        <th className="py-3 px-4 text-sm font-semibold text-gray-500 uppercase">
            {children}
        </th>
    );
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
    );
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
                    <span className="bg-principal text-white text-xs font-bold px-3 py-1 rounded-full">
                        {alerta}
                    </span>
                </div>
            )}

            <div className="mt-3">
                <p className="font-semibold text-gray-600 text-sm">Novedades</p>
                <div className={`bg-gray-50 border-l-4 ${borderColor} p-3 rounded-r-lg mt-1`}>
                    <p className={`text-sm ${novedadesMuted ? "text-gray-500 italic" : "text-gray-700"}`}>
                        {novedades}
                    </p>
                </div>
                <div className="mt-2 flex justify-end">
                    <button
                        type="button"
                        className="bg-principal text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-principal-darker transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-principal-darker focus:ring-opacity-50"
                    >
                        Ver Detalles
                    </button>
                </div>
            </div>
        </div>
    );
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
                <span className={`text-sm font-bold ${leidoColor}`}>Leído: {leido}</span>
            </div>
        </li>
    );
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
    );
}
