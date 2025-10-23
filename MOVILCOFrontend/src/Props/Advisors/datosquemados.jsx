// Datos quemados (puedes ajustar libremente)
export const mockAsesores = [
  { id: 1, nombre: 'Carlos Mendoza', cargo: 'Asesor Comercial Calle', cedula: '1.123.456.789', distrito: 'Comuneros', regional: 'Regional Meta', contrato_inicio: '2023-01-15', contrato_fin: null, novedades: 'Sin novedades', presupuesto: 5000000, capacidad: 'N/A', telefono: '3101234567', correo: 'c.mendoza@movilco.com.co', cumplimiento: 65, vencidas: 3, insumos: 12, status: 'incumplimiento' },
  { id: 2, nombre: 'Ana Gutierrez', cargo: 'Asesor Comercial Calle', cedula: '1.098.765.432', distrito: 'Llanos 1.1', regional: 'Regional Meta', contrato_inicio: '2022-06-01', contrato_fin: null, novedades: 'Licencia médica (2 días)', presupuesto: 4500000, capacidad: 'N/A', telefono: '3119876543', correo: 'a.gutierrez@movilco.com.co', cumplimiento: 100, vencidas: 0, insumos: 20, status: 'completas' },
  { id: 3, nombre: 'Luis Jimenez', cargo: 'Asesor Comercial Calle', cedula: '1.111.222.333', distrito: 'Bello Norte', regional: 'Regional Cundinamarca', contrato_inicio: '2023-03-10', contrato_fin: null, novedades: 'Sin novedades', presupuesto: 4800000, capacidad: 'N/A', telefono: '3121112233', correo: 'l.jimenez@movilco.com.co', cumplimiento: 92, vencidas: 1, insumos: 18, status: 'en_progreso' },
  { id: 4, nombre: 'Sofia Vargas', cargo: 'Asesor Comercial Calle', cedula: '1.222.333.444', distrito: 'Comuneros', regional: 'Regional Meta', contrato_inicio: '2021-11-05', contrato_fin: null, novedades: 'Capacitación SerPrinter', presupuesto: 5200000, capacidad: 'N/A', telefono: '3132223344', correo: 's.vargas@movilco.com.co', cumplimiento: 88, vencidas: 2, insumos: 15, status: 'novedades' },
  { id: 5, nombre: 'Pedro Ramirez', cargo: 'Asesor Comercial Calle', cedula: '1.333.444.555', distrito: 'Llanos 1.1', regional: 'Regional Meta', contrato_inicio: '2023-10-01', contrato_fin: '2025-10-31', novedades: 'Sin novedades', presupuesto: 4000000, capacidad: 'N/A', telefono: '3143334455', correo: 'p.ramirez@movilco.com.co', cumplimiento: 75, vencidas: 2, insumos: 10, status: 'fin_contrato' },
  { id: 6, nombre: 'Maria Fernanda Rojas', cargo: 'Asesor Comercial Calle', cedula: '1.444.555.666', distrito: 'Bello Norte', regional: 'Regional Cundinamarca', contrato_inicio: '2022-02-20', contrato_fin: null, novedades: 'Vacaciones', presupuesto: 4800000, capacidad: 'N/A', telefono: '3154445566', correo: 'mf.rojas@movilco.com.co', cumplimiento: 45, vencidas: 5, insumos: 8, status: 'incumplimiento' },
  { id: 7, nombre: 'David Silva', cargo: 'Asesor Comercial Calle', cedula: '1.555.666.777', distrito: 'Comuneros', regional: 'Regional Meta', contrato_inicio: '2023-08-01', contrato_fin: null, novedades: 'Sin novedades', presupuesto: 5000000, capacidad: 'N/A', telefono: '3165556677', correo: 'd.silva@movilco.com.co', cumplimiento: 100, vencidas: 0, insumos: 22, status: 'completas' },
  { id: 8, nombre: 'Laura Gonzalez', cargo: 'Asesor Comercial Calle', cedula: '1.666.777.888', distrito: 'Llanos 1.1', regional: 'Regional Meta', contrato_inicio: '2023-05-15', contrato_fin: null, novedades: 'Sin novedades', presupuesto: 4600000, capacidad: 'N/A', telefono: '3176667788', correo: 'l.gonzalez@movilco.com.co', cumplimiento: 81, vencidas: 1, insumos: 14, status: 'en_progreso' },
  { id: 9, nombre: 'Javier Torres', cargo: 'Asesor Comercial Calle', cedula: '1.777.888.999', distrito: 'Bello Norte', regional: 'Regional Cundinamarca', contrato_inicio: '2022-09-01', contrato_fin: null, novedades: 'Reunión SiApp', presupuesto: 4700000, capacidad: 'N/A', telefono: '3187778899', correo: 'j.torres@movilco.com.co', cumplimiento: 95, vencidas: 0, insumos: 19, status: 'novedades' }
];

export const mockNotificationHistory = [
  { asesorId: 1, asesorNombre: 'Carlos Mendoza', asunto: 'Incumplimiento de Presupuesto', fecha: '2025-10-22 10:30', estado: 'visto' },
  { asesorId: 2, asesorNombre: 'Ana Gutierrez', asunto: 'Asignación de Presupuesto', fecha: '2025-10-01 09:00', estado: 'visto' },
  { asesorId: 1, asesorNombre: 'Carlos Mendoza', asunto: 'Recordatorio Capacitación', fecha: '2025-10-15 14:00', estado: 'recibido' },
  { asesorId: 4, asesorNombre: 'Sofia Vargas', asunto: 'Asignación de Presupuesto', fecha: '2025-10-01 09:01', estado: 'visto' },
  { asesorId: 6, asesorNombre: 'Maria Fernanda Rojas', asunto: 'Incumplimiento de Presupuesto', fecha: '2025-10-22 10:31', estado: 'recibido' }
];

export const mockStatsHistory = [
  { asesorId: 1, asesorNombre: 'Carlos Mendoza', mes: 'Septiembre 2025', cumplimiento: 80, insumos: 15 },
  { asesorId: 1, asesorNombre: 'Carlos Mendoza', mes: 'Agosto 2025', cumplimiento: 75, insumos: 14 },
  { asesorId: 2, asesorNombre: 'Ana Gutierrez', mes: 'Septiembre 2025', cumplimiento: 95, insumos: 19 },
  { asesorId: 6, asesorNombre: 'Maria Fernanda Rojas', mes: 'Septiembre 2025', cumplimiento: 55, insumos: 10 }
];
