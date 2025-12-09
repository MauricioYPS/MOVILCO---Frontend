import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex bg-white text-slate-800 overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-700 to-red-900 relative text-white items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 max-w-md space-y-6">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
            <span className="text-2xl font-bold tracking-tight">M</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold leading-tight">
              Gestiona tu red comercial<br />
              <span className="text-red-200">con control total.</span>
            </h1>
            <p className="text-lg text-red-100 leading-relaxed opacity-90">
              Monitorea KPIs, coordina equipos y centraliza la comunicación de manera segura.
            </p>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-200" />
              Seguimiento de metas en tiempo real
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-200" />
              Gestión de nómina y comisiones
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-200" />
              Alertas y comunicación centralizada
            </li>
          </ul>
          <div className="pt-4 text-xs text-red-200 font-medium tracking-widest uppercase">
            © 2025 Movilco Enterprise
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white relative">
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2 text-red-700 font-bold text-xl">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-700">M</span>
          MOVILCO
        </div>
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          {children}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center lg:hidden">
            <p className="text-xs text-gray-400">© 2025 Movilco. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
