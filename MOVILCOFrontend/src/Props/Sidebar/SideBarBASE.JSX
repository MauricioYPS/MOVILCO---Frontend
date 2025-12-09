import React from 'react';
import { 
  LogOut, 
  MapPin, 
  Mail, 
  Phone, 
  DollarSign, 
  Briefcase,
  UserCheck,
  Building2,
  BadgeCheck
} from 'lucide-react';

function CoordinatorSidebar() {
    // Datos simulados
    const userInfo = {
        name: "Carlos Pérez",
        role: "Coordinador Comercial",
        email: "carlos.perez@movilco.com",
        phone: "310 123 4567",
        district: "Norte de Santander",
        budget: "$ 15,000,000"
    };

    const bossInfo = {
        role: "Director Regional",
        name: "Nency Galindo",
        email: "nency@movilco.com",
        district: "Regional Norte"
    };

    return (
        <aside className="hidden lg:flex w-80 bg-gradient-to-b from-red-700 to-red-800 text-white flex-col h-screen sticky top-0 border-r border-red-900 shadow-2xl z-50 font-sans overflow-hidden">
            
            {/* 1. ZONA DEL USUARIO (Protagonista) */}
            <div className="flex-1 flex flex-col p-8 overflow-y-auto">
                
                {/* Avatar y Nombre */}
                <div className="flex flex-col items-center text-center mb-8 animate-in fade-in zoom-in duration-500">
                    <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-full bg-white text-red-700 flex items-center justify-center font-bold text-3xl shadow-xl border-4 border-red-100/20">
                            {userInfo.name.charAt(0)}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-red-700 shadow-sm" title="Activo"></div>
                    </div>
                    <h2 className="text-2xl font-bold leading-tight mb-1">{userInfo.name}</h2>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-900/40 rounded-full border border-red-400/30">
                        <BadgeCheck size={14} className="text-yellow-400" />
                        <span className="text-xs font-medium tracking-wide uppercase">{userInfo.role}</span>
                    </div>
                </div>

                {/* Detalles del Usuario (Lista Espaciada) */}
                <div className="space-y-4 w-full">
                    <InfoCard 
                        icon={MapPin} 
                        label="Distrito Asignado" 
                        value={userInfo.district} 
                    />
                    <InfoCard 
                        icon={DollarSign} 
                        label="Presupuesto Mensual" 
                        value={userInfo.budget} 
                        highlight
                    />
                    <div className="h-px bg-red-500/30 my-4 mx-2"></div>
                    <InfoCard 
                        icon={Mail} 
                        label="Correo Corporativo" 
                        value={userInfo.email} 
                        isEmail
                    />
                    <InfoCard 
                        icon={Phone} 
                        label="Teléfono de Contacto" 
                        value={userInfo.phone} 
                    />
                </div>
            </div>

            {/* 2. ZONA DEL JEFE (Línea de Reporte) */}
            <div className="p-6 bg-red-900/40 backdrop-blur-sm border-t border-red-500/30">
                <div className="mb-4">
                    <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <UserCheck size={14}/> Líder Inmediato
                    </p>
                    
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 text-red-800 flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                                {bossInfo.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-sm truncate text-white group-hover:text-red-100 transition-colors">
                                    {bossInfo.name}
                                </p>
                                <p className="text-xs text-red-200 truncate">{bossInfo.role}</p>
                            </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs text-red-100/80">
                                <Building2 size={12} className="opacity-70"/> 
                                <span className="truncate">{bossInfo.district}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-red-100/80">
                                <Mail size={12} className="opacity-70"/> 
                                <span className="truncate">{bossInfo.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón Cerrar Sesión */}
                <button className="w-full flex items-center justify-center gap-2 bg-red-950/50 hover:bg-red-950 text-red-100 py-3 rounded-xl transition-all border border-red-900 shadow-lg group">
                    <LogOut size={18} className="group-hover:text-red-400 transition-colors"/>
                    <span className="font-medium text-sm">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}

// Componente auxiliar para tarjetas de info
function InfoCard({ icon: Icon, label, value, highlight = false, isEmail = false }) {
    return (
        <div className={`flex items-start gap-4 p-3 rounded-xl transition-colors ${highlight ? 'bg-white/10 border border-white/20' : 'hover:bg-red-800/30'}`}>
            <div className={`p-2 rounded-lg ${highlight ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-900/30 text-red-200'}`}>
                <Icon size={18} />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] text-red-300 font-medium uppercase tracking-wide mb-0.5">{label}</p>
                <p className={`font-semibold text-sm truncate ${highlight ? 'text-white text-lg' : 'text-red-50'} ${isEmail ? 'text-xs' : ''}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}

export default CoordinatorSidebar;