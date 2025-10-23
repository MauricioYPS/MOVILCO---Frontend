export default function MetricCard({ label, value, accent = false }) {
  return (
    <div className={`bg-white shadow-lg rounded-xl p-6 ${accent ? "border-l-4 border-[#cc0000]" : ""}`}>
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}
