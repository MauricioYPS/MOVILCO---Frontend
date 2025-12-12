import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Smartphone, 
  LogIn, 
  LayoutDashboard, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck
} from 'lucide-react';

const HomePage = () => {
  // Simulación de estado de sesión (En tu app real, esto vendría de tu Contexto de Auth)
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col relative overflow-hidden">
      
      {/* Botón Flotante para probar estados (Solo para desarrollo) */}
      <button 
        onClick={() => setIsLoggedIn(!isLoggedIn)}
        className="fixed top-4 right-4 z-50 px-3 py-1 bg-gray-200 text-xs rounded-full opacity-50 hover:opacity-100 transition-opacity"
      >
        Simular: {isLoggedIn ? 'Usuario Logueado' : 'Usuario Visitante'}
      </button>

      {/* Navbar Minimalista */}
      <nav className="w-full px-8 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200">
            <Smartphone size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">MOVILCO</span>
        </div>
        {/* Enlace secundario si no está logueado */}
        {!isLoggedIn && (
          <a href="#" className="text-sm font-bold text-slate-500 hover:text-red-600 transition-colors hidden sm:block">
            Soporte Técnico
          </a>
        )}
      </nav>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6 text-center z-10">
        
        {/* Fondo Decorativo Sutil */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        
        {/* Robot Animado (CSS Puro) */}
        <div className={`mb-10 transition-all duration-1000 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
           <div className="w-48 h-48 mx-auto relative">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
                  <style>
                    {`
                      @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
                      @keyframes blink { 0%, 96%, 100% { transform: scaleY(1); } 98% { transform: scaleY(0.1); } }
                      @keyframes pulse-red { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }
                      @keyframes scan { 0% { transform: translateX(-20px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateX(20px); opacity: 0; } }
                      .robot-body { animation: float 4s ease-in-out infinite; }
                      .eye { animation: blink 3s infinite; transform-origin: center; }
                      .antenna-light { animation: pulse-red 2s infinite; transform-origin: center; }
                    `}
                  </style>
                  
                  <g className="robot-body">
                    {/* Antena */}
                    <line x1="100" y1="40" x2="100" y2="20" stroke="#1e293b" strokeWidth="4" />
                    <circle cx="100" cy="20" r="6" fill="#dc2626" className="antenna-light" />
                    
                    {/* Cabeza */}
                    <rect x="60" y="40" width="80" height="70" rx="20" fill="white" stroke="#1e293b" strokeWidth="4" />
                    
                    {/* Pantalla Cara */}
                    <rect x="70" y="55" width="60" height="40" rx="10" fill="#1e293b" />
                    
                    {/* Ojos */}
                    <g className="eye">
                      {isLoggedIn ? (
                        /* Ojos Felices (Logueado) */
                        <>
                          <path d="M78 75 Q 83 70 88 75" stroke="#4ade80" strokeWidth="3" fill="none" strokeLinecap="round" />
                          <path d="M112 75 Q 117 70 122 75" stroke="#4ade80" strokeWidth="3" fill="none" strokeLinecap="round" />
                        </>
                      ) : (
                        /* Ojos Normales (Esperando) */
                        <>
                          <circle cx="83" cy="75" r="4" fill="#60a5fa" />
                          <circle cx="117" cy="75" r="4" fill="#60a5fa" />
                        </>
                      )}
                    </g>

                    {/* Cuerpo */}
                    <path d="M50 120 Q 100 120 150 120 L 140 170 Q 100 180 60 170 Z" fill="#dc2626" stroke="#b91c1c" strokeWidth="4" />
                    
                    {/* Detalles Cuerpo */}
                    <circle cx="100" cy="145" r="12" fill="white" opacity="0.9" />
                    <path d="M95 145 L105 145 M100 140 L100 150" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
                  </g>
              </svg>
           </div>
        </div>

        {/* Textos Dinámicos */}
        <div className={`max-w-2xl mx-auto transition-all duration-1000 delay-300 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
            {isLoggedIn ? (
              <>
                ¡Qué bueno verte, <span className="text-red-600">Compañero!</span>
              </>
            ) : (
              <>
                Gestión Comercial <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">
                  Sin Límites.
                </span>
              </>
            )}
          </h1>

          <p className="text-lg md:text-xl text-slate-500 mb-10 font-medium max-w-xl mx-auto leading-relaxed">
            {isLoggedIn 
              ? "Tus indicadores están listos y actualizados. Es un gran momento para seguir construyendo resultados."
              : "La plataforma integral para asesores, coordinadores y directores. Conecta, gestiona y cumple tus metas en tiempo real."
            }
          </p>

          {/* Botón de Acción Principal (Call to Action) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {isLoggedIn ? (
              <button className="group relative inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-full shadow-xl shadow-red-200 hover:bg-red-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <LayoutDashboard size={20} />
                  Ir a mi Panel
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ) : (
              <button className="group relative inline-flex items-center justify-center px-10 py-4 bg-slate-900 text-white font-bold text-lg rounded-full shadow-xl hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <span className="relative z-10 flex items-center gap-2">
                  Iniciar Sesión
                  <LogIn size={20} className="group-hover:translate-x-1 transition-transform"/>
                </span>
              </button>
            )}

            {/* Enlace secundario (Solo si no está logueado) */}
            {!isLoggedIn && (
              <button className="px-8 py-4 text-slate-600 font-bold hover:text-red-600 transition-colors flex items-center gap-2">
                Solicitar Acceso <ArrowRight size={18} />
              </button>
            )}
          </div>

        </div>

        {/* Feature Pills (Solo visible si NO está logueado para vender la plataforma) */}
        {!isLoggedIn && (
          <div className="mt-16 flex flex-wrap justify-center gap-4 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 fill-mode-forwards">
             <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm text-sm font-semibold text-slate-600">
                <CheckCircle2 size={16} className="text-green-500"/> Tiempo Real
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm text-sm font-semibold text-slate-600">
                <TrendingUp size={16} className="text-blue-500"/> Métricas KPI
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm text-sm font-semibold text-slate-600">
                <ShieldCheck size={16} className="text-red-500"/> Seguro
             </div>
          </div>
        )}

      </main>

      {/* Footer Simple integrado */}
      <footer className="w-full py-6 text-center text-xs text-slate-400 font-medium">
        © 2025 Movilco S.A.S. — Todos los derechos reservados.
      </footer>

    </div>
  );
};

export default HomePage;