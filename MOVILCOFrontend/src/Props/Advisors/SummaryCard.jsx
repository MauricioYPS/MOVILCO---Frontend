export default function SummaryCard({ title, value, color = "red", onClick }) {
  const map = {
    red:   { border: "border-red-500",   text: "text-red-600" },
    green: { border: "border-green-500", text: "text-green-600" },
    blue:  { border: "border-blue-500",  text: "text-blue-600" },
    gray:  { border: "border-gray-500",  text: "text-gray-600" },
  };
  const c = map[color] || map.gray;

  return (
    <div
      onClick={onClick}
      className={`bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:shadow-xl transition-shadow border-l-4 ${c.border}`}
    >
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className={`text-4xl font-bold ${c.text}`}>{value}</div>
      <p className="text-xs text-gray-400">Clic para filtrar lista</p>
    </div>
  );
}
