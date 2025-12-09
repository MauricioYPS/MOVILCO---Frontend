import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Bell, 
  Search, 
  MapPin, 
  Smartphone,
  Briefcase,
  Menu,
  X,
  Mail,
  Phone,
  Calendar,
  User,
  ChevronRight,
  Filter,
  ArrowLeft,
  MessageCircle, // Icono para mensaje
  Send           // Icono para notificación (avión de papel o similar)
} from 'lucide-react';

const CoordinatorDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- DATOS DEL COORDINADOR (Tu JSON) ---
  const coordinatorData = {
    "id": "4",
    "name": "GALINDO PIMIENTO NENCY",
    "email": "nencyg81.ngp@gmail.com",
    "phone": "3132488518",
    "role": "DIRECCION", 
    "active": true,
    "district": "META",
    "regional": "REGIONAL META",
    "cargo": "DIRECTOR META",
    "presupuesto": "865",
    "ejecutado": "420", 
    "cierre_porcentaje": "48.5",
    "contract_start": "2007-08-01T05:00:00.000Z"
  };

  // --- DATOS SIMULADOS DE ASESORES ---
  const advisorsList = [
    { id: 101, name: "Maria Gonzalez", status: "active", sales: 45, goal: 50, compliance: 90, phone: "3101234567" },
    { id: 102, name: "Juan Perez", status: "warning", sales: 20, goal: 50, compliance: 40, phone: "3119876543" },
    { id: 103, name: "Carlos Rodriguez", status: "active", sales: 55, goal: 50, compliance: 110, phone: "3154567890" },
    { id: 104, name: "Ana Martinez", status: "inactive", sales: 0, goal: 50, compliance: 0, phone: "3201122334" },
    { id: 105, name: "Luisa Fernanda", status: "active", sales: 38, goal: 50, compliance: 76, phone: "3005556677" },
    { id: 106, name: "Pedro Paramo", status: "warning", sales: 22, goal: 50, compliance: 44, phone: "3123334455" },
  ];

  const handleAdvisorClick = (advisorId) => {
    console.log(`Navegando al detalle del asesor ${advisorId}`);
  };

  const getTenure = (dateString) => {
    const start = new Date(dateString);
    const now = new Date();
    const years = now.getFullYear() - start.getFullYear();
    return `${years} años`;
  };

  const getComplianceColor = (percentage) => {
    if (percentage >= 100) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (percentage >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-800 overflow-hidden">
      
      {/* Sidebar Rojo */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-red-700 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 bg-red-800 lg:hidden">
          <span className="text-xl font-bold">Menú</span>
          <button onClick={() => setSidebarOpen(false)}><X size={24} /></button>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-bold mb-8 mt-2">Panel Director</h2>
          <nav className="space-y-2">
            <a href="#" className="flex items-center space-x-3 px-4 py-3 text-red-100 hover:bg-red-600 rounded-lg transition-colors">
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-4 py-3 bg-red-800 rounded-lg text-white shadow-sm">
              <Users size={20} />
              <span className="font-medium">Coordinadores</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-4 py-3 text-red-100 hover:bg-red-600 rounded-lg transition-colors">
              <Target size={20} />
              <span className="font-medium">Metas</span>
            </a>
          </nav>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">

            {/* --- NUEVO: BARRA DE ACCIONES SUPERIOR --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              {/* Botón de Inicio / Volver */}
              <button className="flex items-center text-gray-500 hover:text-red-600 transition-colors group">
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Volver al Inicio</span>
              </button>

              {/* Botones de Acción (Mensaje y Notificación) */}
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                  <MessageCircle size={18} />
                  <span>Enviar Mensaje</span>
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                  <Bell size={18} />
                  <span>Enviar Notificación</span>
                </button>
              </div>
            </div>

            {/* --- HEADER DEL PERFIL --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-400 border-2 border-white shadow-md">
                    <User size={40} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">{coordinatorData.name}</h1>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <Briefcase size={14} />
                      <span className="font-medium">{coordinatorData.cargo}</span>
                      <span className="mx-1">•</span>
                      <MapPin size={14} />
                      <span>{coordinatorData.regional} ({coordinatorData.district})</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm">
                      <a href={`mailto:${coordinatorData.email}`} className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 transition-colors">
                        <Mail size={14} /> {coordinatorData.email}
                      </a>
                      <a href={`tel:${coordinatorData.phone}`} className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 transition-colors">
                        <Phone size={14} /> {coordinatorData.phone}
                      </a>
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <Calendar size={14} /> Antigüedad: {getTenure(coordinatorData.contract_start)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Métricas Rápidas en Header */}
                <div className="flex gap-4 w-full md:w-auto">
                  <div className="flex-1 md:flex-none bg-red-50 px-5 py-3 rounded-lg border border-red-100 text-center">
                    <p className="text-xs text-red-600 font-bold uppercase tracking-wider mb-1">Cumplimiento</p>
                    <p className="text-2xl font-extrabold text-red-700">{coordinatorData.cierre_porcentaje}%</p>
                  </div>
                  <div className="flex-1 md:flex-none bg-gray-50 px-5 py-3 rounded-lg border border-gray-200 text-center">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Presupuesto</p>
                    <p className="text-2xl font-extrabold text-gray-800">{coordinatorData.presupuesto}</p>
                  </div>
                </div>
              </div>

              {/* Barra de Progreso General */}
              <div className="mt-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Progreso de Ventas (Ejecutado vs Presupuesto)</span>
                  <span className="text-gray-500">{coordinatorData.ejecutado} / {coordinatorData.presupuesto}</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((coordinatorData.ejecutado / coordinatorData.presupuesto) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* --- LISTA DE ASESORES --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Equipo de Asesores</h2>
                  <p className="text-sm text-gray-500">Gestión individual y seguimiento de metas.</p>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                   <div className="relative flex-1 sm:flex-none">
                      <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Buscar asesor..." 
                        className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-64"
                      />
                   </div>
                   <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                     <Filter size={20} />
                   </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                      <th className="px-6 py-4">Asesor</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4 text-center">Ventas / Meta</th>
                      <th className="px-6 py-4 text-center">Cumplimiento</th>
                      <th className="px-6 py-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {advisorsList.map((advisor) => (
                      <tr 
                        key={advisor.id} 
                        onClick={() => handleAdvisorClick(advisor.id)}
                        className="hover:bg-red-50 cursor-pointer transition-colors duration-150 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                              {advisor.name.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors">{advisor.name}</p>
                              <p className="text-xs text-gray-500">{advisor.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            advisor.status === 'active' ? 'bg-green-100 text-green-800' : 
                            advisor.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {advisor.status === 'active' ? 'Activo' : advisor.status === 'warning' ? 'Riesgo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-gray-800">{advisor.sales}</span> 
                          <span className="text-gray-400 mx-1">/</span> 
                          <span className="text-gray-500">{advisor.goal}</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center justify-center">
                             <span className={`px-3 py-1 rounded-md text-xs font-bold border ${getComplianceColor(advisor.compliance)}`}>
                               {advisor.compliance}%
                             </span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-red-600">
                            <ChevronRight size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center">
                <button className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors">
                  Ver todos los asesores ({advisorsList.length})
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default CoordinatorDetails;