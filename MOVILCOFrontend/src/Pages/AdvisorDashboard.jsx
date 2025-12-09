import React, { useState } from 'react';

// --- COMPONENTES UI ---

const ServiceIcon = ({ type }) => {
  switch(type) {
    case 'internet': return <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Wifi size={18}/></div>;
    case 'movil': return <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Smartphone size={18}/></div>;
    case 'tv': return <div className="p-2 bg-pink-50 text-pink-600 rounded-lg"><Monitor size={18}/></div>;
    default: return <div className="p-2 bg-gray-50 text-gray-600 rounded-lg"><FileText size={18}/></div>;
  }
};

const StatusBadge = ({ status }) => {
  const config = {
    'activo': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle2 size={12}/> },
    'pendiente': { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock size={12}/> },
    'agendado': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Calendar size={12}/> },
    'rechazado': { color: 'bg-red-50 text-red-600 border-red-100', icon: <AlertTriangle size={12}/> }
  };
  
  const style = config[status.toLowerCase()] || config['pendiente'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${style.color}`}>
      {style.icon} {status}
    </span>
  );
};

const AdvisorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('todas');
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [expandedSale, setExpandedSale] = useState(null); // ID de la venta expandida

  // --- DATOS SIMULADOS (Modelo Complejo Telco) ---
  const [sales, setSales] = useState([
    { 
      id: 101, 
      client: { name: "Carlos Eduardo López", id: "1.098.765.432", phone: "310 555 1234", email: "carlos.edu@mail.com" },
      service: { type: "internet", plan: "Fibra Óptica Simétrica 500MB", technology: "FTTH", extras: ["Win Sports+", "IP Fija"] },
      installation: { address: "Cra 45 # 123 - 89, Apto 402", city: "Ibagué", date: "2025-12-12", time: "AM" },
      financial: { value: "$ 129,900", activationFee: "$ 0", status: "Agendado" },
      date: "2025-12-09"
    },
    { 
      id: 102, 
      client: { name: "Empresas S.A.S.", id: "900.123.456-1", phone: "320 888 9999", email: "compras@empresas.co" },
      service: { type: "movil", plan: "Plan Corporativo Ilimitado", technology: "5G", extras: ["Roaming USA", "Deezer"] },
      installation: { address: "Calle 100 # 15 - 20, Of. 301", city: "Bogotá", date: "2025-12-10", time: "PM" },
      financial: { value: "$ 250,000", activationFee: "$ 0", status: "Activo" },
      date: "2025-12-08"
    },
    { 
        id: 103, 
        client: { name: "Maria Fernanda Gil", id: "52.345.678", phone: "300 111 2233", email: "mafe.gil@mail.com" },
        service: { type: "tv", plan: "Triple Play (TV + Net + Voz)", technology: "HFC", extras: ["HBO Max", "Disney+"] },
        installation: { address: "Av. Siempre Viva 742", city: "Espinal", date: "Pendiente", time: "-" },
        financial: { value: "$ 185,000", activationFee: "$ 50,000", status: "Pendiente" },
        date: "2025-12-09"
      }
  ]);

  const filteredSales = activeTab === 'todas' ? sales : sales.filter(s => s.financial.status.toLowerCase() === activeTab);
  const progress = 76; // Mock KPI

  // Toggle para expandir detalles
  const toggleExpand = (id) => {
    setExpandedSale(expandedSale === id ? null : id);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-800 overflow-hidden relative">
      
      {/* Sidebar Rojo (Mismo diseño) */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-red-700 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-red-600 shadow-md">
            </div>
            <span className="text-xl font-bold tracking-tight">MOVILCO</span>
          </div>
          <div className="mb-8 text-center">
             <div className="w-20 h-20 mx-auto bg-red-800 rounded-full flex items-center justify-center text-2xl font-bold border-4 border-red-600 shadow-lg mb-3">JB</div>
             <h3 className="font-bold text-lg">Julieth Beltran</h3>
             <p className="text-xs text-red-200 uppercase tracking-widest">Asesor Comercial</p>
          </div>
          <nav className="space-y-2">
            <button className="w-full flex items-center space-x-3 px-4 py-3 bg-white text-red-700 rounded-xl shadow-sm font-bold transition-transform active:scale-95">
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-100 hover:bg-red-600 rounded-xl transition-colors">
            </button>
          </nav>
        </div>
        <div className="absolute bottom-0 w-full p-6">
          <button className="w-full flex items-center justify-center gap-2 text-red-200 hover:text-white py-2 text-sm font-medium transition-colors">
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="bg-white border-b border-gray-200 shadow-sm z-30 h-16 flex items-center justify-between px-4 lg:px-8">
           <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500"><Menu size={24} /></button>
             <h1 className="text-lg font-bold text-slate-800 hidden sm:block">Gestión Comercial</h1>
           </div>
           <div className="flex items-center gap-3">
             <button className="relative p-2.5 bg-gray-50 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors">
               <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
             </button>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50">
           <div className="max-w-5xl mx-auto space-y-6">

              {/* Header KPI Rápido */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-16 h-16">
                       <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                          <circle cx="32" cy="32" r="28" stroke="#dc2626" strokeWidth="6" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * progress) / 100} strokeLinecap="round" />
                       </svg>
                       <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">{progress}%</span>
                    </div>
                    <div>
                       <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Meta Mensual</h2>
                       <p className="text-xs text-gray-500">Faltan 12 conexiones para bono.</p>
                    </div>
                 </div>
                 <button 
                    onClick={() => setShowNewSaleModal(true)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all font-bold text-sm flex items-center justify-center gap-2"
                 >
                 </button>
              </div>

              {/* LISTA DE GESTIONES (ESTILO CARD DETALLADO) */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between px-1">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    </h3>
                    <div className="flex bg-white border border-gray-200 rounded-lg p-1">
                       {['todas', 'pendiente', 'activo'].map(tab => (
                          <button
                             key={tab}
                             onClick={() => setActiveTab(tab)}
                             className={`px-3 py-1 rounded text-xs font-bold capitalize transition-all ${activeTab === tab ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                             {tab}
                          </button>
                       ))}
                    </div>
                 </div>

                 {filteredSales.map((sale) => (
                    <div key={sale.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
                       
                       {/* Cabecera de la Tarjeta (Resumen) */}
                       <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between cursor-pointer" onClick={() => toggleExpand(sale.id)}>
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                             <div>
                                <h4 className="font-bold text-slate-800 text-sm">{sale.service.plan}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                   <span className="text-gray-300">|</span>
                                   <span>{sale.client.id}</span>
                                </div>
                             </div>
                          </div>

                          <div className="flex items-center justify-between w-full sm:w-auto gap-4 pl-12 sm:pl-0">
                             <div className="text-right hidden sm:block">
                                <span className="block text-xs font-bold text-slate-700">{sale.financial.value}</span>
                                <span className="block text-[10px] text-gray-400">{sale.date}</span>
                             </div>
                             <button className="text-gray-300 hover:text-slate-600 transition-colors">
                             </button>
                          </div>
                       </div>

                       {/* Detalles Expandibles */}
                       {expandedSale === sale.id && (
                          <div className="bg-gray-50/50 border-t border-gray-100 p-5 animate-in slide-in-from-top-2">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                
                                {/* Columna 1: Servicio Técnico */}
                                <div>
                                   <h5 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1"><Wifi size={12}/> Detalles Técnicos</h5>
                                   <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
                                      <div className="flex justify-between">
                                         <span className="text-gray-500 text-xs">Tecnología:</span>
                                         <span className="font-medium text-slate-800 text-xs">{sale.service.technology}</span>
                                      </div>
                                      <div className="flex justify-between">
                                         <span className="text-gray-500 text-xs">Extras:</span>
                                         <span className="font-medium text-slate-800 text-xs text-right">{sale.service.extras.join(", ")}</span>
                                      </div>
                                   </div>
                                </div>

                                {/* Columna 2: Instalación */}
                                <div>
                                   <h5 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1"><MapPin size={12}/> Datos Instalación</h5>
                                   <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
                                      <div>
                                         <span className="block text-gray-500 text-[10px]">Dirección:</span>
                                         <span className="block font-medium text-slate-800 text-xs">{sale.installation.address}</span>
                                         <span className="block text-gray-400 text-[10px]">{sale.installation.city}</span>
                                      </div>
                                      {sale.installation.date !== "Pendiente" && (
                                         <div className="pt-1 border-t border-gray-100 mt-1 flex items-center gap-2 text-xs text-blue-600 font-medium">
                                         </div>
                                      )}
                                   </div>
                                </div>

                                {/* Columna 3: Cliente y Contacto */}
                                <div>
                                   <h5 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1"><User size={12}/> Contacto Cliente</h5>
                                   <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
                                      <div className="flex items-center gap-2 text-xs">
                                      </div>
                                      <div className="flex items-center gap-2 text-xs">
                                      </div>
                                      <div className="flex items-center gap-2 text-xs">
                                      </div>
                                   </div>
                                </div>
                             </div>

                             {/* Footer de Acciones de la Tarjeta */}
                             <div className="mt-4 flex justify-end gap-2 pt-3 border-t border-gray-200">
                                <button className="px-3 py-1.5 bg-white border border-gray-300 text-slate-600 text-xs font-bold rounded hover:bg-gray-50">Editar Datos</button>
                                <button className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded hover:bg-blue-100">Ver Contrato</button>
                                <button className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 shadow-sm">Gestionar Estado</button>
                             </div>
                          </div>
                       )}
                    </div>
                 ))}
              </div>
           </div>
        </main>

        {/* --- MODAL NUEVA SOLICITUD (TABBED) --- */}
        {showNewSaleModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col animate-in zoom-in duration-200">
                
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-600 rounded-t-2xl">
                   <div>
                      <h3 className="font-bold text-lg text-white">Nueva Solicitud de Servicio</h3>
                      <p className="text-red-100 text-xs">Complete todos los campos requeridos para agendar.</p>
                   </div>
                   <button onClick={() => setShowNewSaleModal(false)} className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20}/></button>
                </div>
                
                {/* Modal Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                   
                   {/* Sección 1: Cliente */}
                   <section>
                      <h4 className="text-sm font-bold text-slate-800 uppercase mb-3 flex items-center gap-2 border-b pb-1 border-gray-100">
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Nombre Completo</label>
                            <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" placeholder="Ej. Juan Pérez"/>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Cédula / NIT</label>
                            <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"/>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Teléfono Principal</label>
                            <input type="tel" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"/>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Correo Electrónico</label>
                            <input type="email" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"/>
                         </div>
                      </div>
                   </section>

                   {/* Sección 2: Servicio */}
                   <section>
                      <h4 className="text-sm font-bold text-slate-800 uppercase mb-3 flex items-center gap-2 border-b pb-1 border-gray-100">
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Plan Seleccionado</label>
                            <select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white">
                               <option>Seleccione un plan...</option>
                               <option>Fibra Óptica 300MB - Residencial</option>
                               <option>Fibra Óptica 500MB - Gamer</option>
                               <option>Triple Play (TV + Voz + Datos)</option>
                               <option>Plan Móvil Ilimitado</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Tecnología</label>
                            <select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white">
                               <option>FTTH (Fibra)</option>
                               <option>HFC (Coaxial)</option>
                               <option>4G/5G Móvil</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Estrato</label>
                            <select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white">
                               <option>1</option> <option>2</option> <option>3</option> <option>4+</option>
                            </select>
                         </div>
                      </div>
                   </section>

                   {/* Sección 3: Instalación */}
                   <section>
                      <h4 className="text-sm font-bold text-slate-800 uppercase mb-3 flex items-center gap-2 border-b pb-1 border-gray-100">
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Dirección Exacta</label>
                            <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" placeholder="Calle, Carrera, Número, Barrio..."/>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="block text-xs font-bold text-gray-500 mb-1">Ciudad / Municipio</label>
                               <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none"/>
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-gray-500 mb-1">Barrio / Localidad</label>
                               <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none"/>
                            </div>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Observaciones / Referencias</label>
                            <textarea rows="2" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none resize-none" placeholder="Casa de rejas blancas, llamar antes de ir..."></textarea>
                         </div>
                      </div>
                   </section>

                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex gap-3 justify-end">
                   <button onClick={() => setShowNewSaleModal(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-xl text-sm hover:bg-white hover:shadow-sm transition-all">Cancelar</button>
                   <button className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                   </button>
                </div>

             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdvisorDashboard;