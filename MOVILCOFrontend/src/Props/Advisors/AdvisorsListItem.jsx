// Item de la lista con borde de color según estado/cumplimiento
function colorByStatus({ status, cumplimiento }) {
  if (status === "incumplimiento" || cumplimiento < 80) return "border-red-500";
  if (status === "completas" || cumplimiento === 100) return "border-green-500";
  if (status === "novedades") return "border-blue-500";
  if (status === "fin_contrato") return "border-gray-400";
  return "border-amber-500"; // en_progreso
}

function textColorByCumplimiento(c) {
  if (c === 100) return "text-green-600";
  if (c >= 80) return "text-emerald-600";
  if (c >= 60) return "text-amber-600";
  return "text-red-600";
}

export default function AsesorListItem({ asesor, onClick }) {
  return (
    <button
      onClick={() => onClick?.(asesor)}
      className={`w-full text-left rounded-xl border ${colorByStatus(asesor)} border-l-4 border-gray-200 p-4 hover:bg-gray-50 shadow-sm`}
    >
      <div className="font-semibold text-gray-900">{asesor.nombre}</div>
      <div className="text-sm text-gray-500">{asesor.distrito} - {asesor.regional}</div>
      <div className={`text-sm mt-1 ${textColorByCumplimiento(asesor.cumplimiento)}`}>
        Cumplimiento: {asesor.cumplimiento}%
      </div>
    </button>
  );
}
