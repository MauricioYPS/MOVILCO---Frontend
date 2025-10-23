import StatCard from "./StatCard";

export default function Body() {
  return (
    <>
    <div className="w-full flex justify-center">
    <div id="view-dashboard" className="view-content w-[95%] min-h-screen h-auto mt-10" >
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard Gerencial</h1>

      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Cumplimiento General"
          value="78.5%"
          subtitle="+3.2% vs. Mes Anterior"
          iconName="checkmark-circle-outline"
          color="text-green-500"
          trend="up"
        />
        <StatCard
          title="Metas Vencidas"
          value="42"
          subtitle="+5 vs. Mes Anterior"
          iconName="alert-circle-outline"
          color="text-red-500"
          trend="down"
        />
        <StatCard
          title="Nuevos Insumos"
          value="1,204"
          subtitle="Presupuesto: $5.2M"
          iconName="cube-outline"
          color="text-blue-500"
          trend="neutral"
        />
        <StatCard
          title="Asesores Activos"
          value="189"
          subtitle="Nómina: $250M"
          iconName="people-circle-outline"
          color="text-gray-500"
          trend="neutral"
        />
      </div>

      {/* Gráficos y Reportes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Cumplimiento */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Cumplimiento por Regional</h2>
            <button
              type="button"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
              onClick={() => alert("Exportación simulada")}
            >
              Exportar Excel
            </button>
          </div>

          {/* Placeholder para gráfico */}
          <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">[Simulación de Gráfico de Barras]</span>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Actividad Reciente</h2>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <div className="bg-green-100 text-green-600 p-2 rounded-full">
                <ion-icon name="cloud-upload-outline"></ion-icon>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Gerencia cargó metas de Octubre.</p>
                <p className="text-xs text-gray-500">Hace 30 minutos</p>
              </div>
            </li>
            <li className="flex items-center space-x-3">
              <div className="bg-red-100 text-red-600 p-2 rounded-full">
                <ion-icon name="mail-unread-outline"></ion-icon>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Se envió notificación de incumplimiento a C. Mendoza.
                </p>
                <p className="text-xs text-gray-500">Hace 1 hora</p>
              </div>
            </li>
            <li className="flex items-center space-x-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                <ion-icon name="person-add-outline"></ion-icon>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Nuevo asesor: L. Jimenez (Regional Meta).
                </p>
                <p className="text-xs text-gray-500">Hace 4 horas</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  </>);
}
