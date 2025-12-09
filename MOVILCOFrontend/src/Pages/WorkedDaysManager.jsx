import React, { useState, useMemo } from 'react';


const WorkedDaysManager = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // --- ESTADOS DE FILTRO ---
  const [selectedRole, setSelectedRole] = useState('Asesor'); // 'Asesor' | 'Coordinador' | 'Director'
  const [selectedDistrict, setSelectedDistrict] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // --- DATOS SIMULADOS (EMPLEADOS) ---
  const [employees, setEmployees] = useState([
    { id: '101', name: "Julieth Beltran", docId: "1.098.765.432", role: "Asesor", district: "Norte de Santander", city: "Cúcuta", daysWorked: 30, baseSalary: 1300000 },
    { id: '102', name: "Carlos Pérez", docId: "88.234.567", role: "Coordinador", district: "Norte de Santander", city: "Ocaña", daysWorked: 30, baseSalary: 2500000 },
    { id: '103', name: "Ana María Polo", docId: "52.111.222", role: "Asesor", district: "Meta", city: "Villavicencio", daysWorked: 15, baseSalary: 1300000 }, // Novedad: 15 días
    { id: '104', name: "Jorge Baron", docId: "79.333.444", role: "Director", district: "Bogotá", city: "Bogotá DC", daysWorked: 30, baseSalary: 4500000 },
    { id: '105', name: "Luisa Lane", docId: "1.122.333.444", role: "Asesor", district: "Meta", city: "Acacías", daysWorked: 0, baseSalary: 1300000 }, // Novedad: 0 días
    { id: '106', name: "Pedro Picapiedra", docId: "12.345.678", role: "Asesor", district: "Norte de Santander", city: "Pamplona", daysWorked: 28, baseSalary: 1300000 },
  ]);

  // --- LÓGICA DE FILTRADO ---
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchRole = selectedRole === 'Todos' || emp.role === selectedRole;
      const matchDistrict = selectedDistrict === 'Todos' || emp.district === selectedDistrict;
      const matchSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.docId.includes(searchQuery);
      return matchRole && matchDistrict && matchSearch;
    });
  }, [employees, selectedRole, selectedDistrict, searchQuery]);

  // --- MANEJADORES ---
  const handleDaysChange = (id, newDays) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, daysWorked: value } : emp
    ));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Novedades de nómina guardadas correctamente.');
    }, 1500);
  };

  // --- HELPERS VISUALES ---
  const getStatusColor = (days) => {
    if (days === 30) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (days > 0) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* Sidebar (Simplificado para contexto) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center space-x-2 text-white font-bold text-2xl tracking-tight mb-10">
            <span>MOVILCO</span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 ml-2">RRHH & Nómina</p>
          <nav className="space-y-1">
            <button className="w-full flex items-center space-x-3 px-4 py-3 bg-red-700 text-white rounded-lg shadow-md border-l-4 border-red-500">
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white rounded-lg transition-colors">
            </button>
          </nav>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm z-10 h-16 flex items-center justify-between px-6 lg:px-10">
           <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500"><Menu size={24} /></button>
             <div>
                <h1 className="text-lg font-bold text-slate-800">Gestión de Novedades</h1>
                <p className="text-xs text-gray-400">Periodo Activo: <span className="font-bold text-red-600">Diciembre 2025</span></p>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <div className="hidden md:flex bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100 items-center gap-2">
                {filteredEmployees.length} Registros
             </div>
             <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 shadow-sm transition-all active:scale-95 disabled:opacity-70 disabled:cursor-wait">
                {isSaving ? 'Guardando...' : <><Save size={16}/> Guardar Cambios</>}
             </button>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8">
           <div className="max-w-[1600px] mx-auto space-y-6">

              {/* BARRA DE FILTROS & CONTROL */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col lg:flex-row gap-5 justify-between items-end lg:items-center">
                 
                 {/* Selectores de Rol y Ubicación */}
                 <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative group">
                       <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Rol Funcional</label>
                       <div className="relative">
                          <select 
                             value={selectedRole}
                             onChange={(e) => setSelectedRole(e.target.value)}
                             className="w-full sm:w-48 appearance-none bg-gray-50 border border-gray-200 text-slate-700 text-sm font-bold rounded-lg py-2.5 pl-10 pr-8 focus:ring-2 focus:ring-red-500 outline-none cursor-pointer hover:bg-white hover:border-gray-300 transition-colors"
                          >
                             <option>Todos</option>
                             <option>Asesor</option>
                             <option>Coordinador</option>
                             <option>Director</option>
                          </select>
                       </div>
                    </div>

                    <div className="relative group">
                       <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Distrito / Zona</label>
                       <div className="relative">
                          <select 
                             value={selectedDistrict}
                             onChange={(e) => setSelectedDistrict(e.target.value)}
                             className="w-full sm:w-48 appearance-none bg-gray-50 border border-gray-200 text-slate-700 text-sm font-bold rounded-lg py-2.5 pl-10 pr-8 focus:ring-2 focus:ring-red-500 outline-none cursor-pointer hover:bg-white hover:border-gray-300 transition-colors"
                          >
                             <option>Todos</option>
                             <option>Norte de Santander</option>
                             <option>Meta</option>
                             <option>Bogotá</option>
                          </select>
                       </div>
                    </div>
                 </div>

                 {/* Búsqueda */}
                 <div className="w-full lg:w-96">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Buscar Empleado</label>
                    <div className="relative">
                       <input 
                          type="text" 
                          placeholder="Nombre o Número de Documento..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                       />
                    </div>
                 </div>
              </div>

              {/* TABLA DE GESTIÓN */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-gray-50 text-[11px] uppercase text-gray-500 font-bold tracking-wider border-b border-gray-200">
                             <th className="px-6 py-4">Colaborador</th>
                             <th className="px-6 py-4">Ubicación</th>
                             <th className="px-6 py-4">Rol</th>
                             <th className="px-6 py-4 text-center bg-red-50/50 border-l border-red-50 w-48">Días Laborados</th>
                             <th className="px-6 py-4 text-center">Estado</th>
                             <th className="px-6 py-4 text-right">Proyección</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 text-sm">
                          {filteredEmployees.map((emp) => (
                             <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                                
                                {/* Columna Nombre e ID */}
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm border border-slate-200">
                                         {emp.name.charAt(0)}
                                      </div>
                                      <div>
                                         <p className="font-bold text-slate-800">{emp.name}</p>
                                         <p className="text-xs text-gray-400 font-mono flex items-center gap-1">
                                         </p>
                                      </div>
                                   </div>
                                </td>

                                {/* Ubicación */}
                                <td className="px-6 py-4">
                                   <div className="flex flex-col">
                                      <span className="font-medium text-slate-700">{emp.city}</span>
                                      <span className="text-xs text-gray-400">{emp.district}</span>
                                   </div>
                                </td>

                                {/* Rol */}
                                <td className="px-6 py-4">
                                   <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                      emp.role === 'Director' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                      emp.role === 'Coordinador' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                      'bg-gray-100 text-gray-600 border-gray-200'
                                   }`}>
                                      {emp.role}
                                   </span>
                                </td>

                                {/* INPUT DE DÍAS (Core Feature) */}
                                <td className="px-6 py-4 bg-red-50/30 border-l border-red-50">
                                   <div className="flex items-center justify-center">
                                      <div className="relative w-24">
                                         <input 
                                            type="number" 
                                            min="0" 
                                            max="30" 
                                            value={emp.daysWorked}
                                            onChange={(e) => handleDaysChange(emp.id, e.target.value)}
                                            className={`w-full text-center font-bold text-lg py-1.5 rounded-lg border-2 outline-none focus:ring-2 focus:ring-offset-1 transition-all ${
                                               emp.daysWorked === 30 ? 'border-emerald-200 text-emerald-700 focus:ring-emerald-500 bg-white' :
                                               emp.daysWorked === 0 ? 'border-red-200 text-red-700 focus:ring-red-500 bg-white' :
                                               'border-amber-200 text-amber-700 focus:ring-amber-500 bg-white'
                                            }`}
                                         />
                                         <span className="absolute right-2 top-2.5 text-[10px] text-gray-400 font-bold pointer-events-none">DÍAS</span>
                                      </div>
                                   </div>
                                </td>

                                {/* Estado Visual */}
                                <td className="px-6 py-4 text-center">
                                   <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(emp.daysWorked)}`}>
                                      {emp.daysWorked === 30 ? 'Completo' : emp.daysWorked === 0 ? 'Ausente' : 'Parcial'}
                                   </span>
                                </td>

                                {/* Proyección Salarial (Calculada) */}
                                <td className="px-6 py-4 text-right">
                                   <p className="text-xs text-gray-400 mb-0.5">Básico Devengado</p>
                                   <p className="font-mono font-bold text-slate-700">
                                      $ {Math.round((emp.baseSalary / 30) * emp.daysWorked).toLocaleString()}
                                   </p>
                                </td>

                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
                 
                 {/* Empty State */}
                 {filteredEmployees.length === 0 && (
                    <div className="p-10 text-center flex flex-col items-center">
                       <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                       </div>
                       <h3 className="text-lg font-bold text-slate-800">No se encontraron empleados</h3>
                       <p className="text-gray-500 text-sm max-w-xs mx-auto">
                          Intenta ajustar los filtros de búsqueda o el rol seleccionado.
                       </p>
                    </div>
                 )}

                 {/* Footer de Tabla */}
                 <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                    <p>Mostrando {filteredEmployees.length} registros</p>
                    <button className="flex items-center gap-1 hover:text-red-600 font-bold transition-colors">
                    </button>
                 </div>
              </div>

           </div>
        </main>
      </div>
    </div>
  );
};

export default WorkedDaysManager;