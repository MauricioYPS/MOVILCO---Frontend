export default function StatCard({ title, value, subtitle, iconName, color = "text-gray-500", trend = "neutral" }) {
  const trendIcon =
    trend === "up" ? "arrow-up-outline" : trend === "down" ? "arrow-down-outline" : "remove-outline";
  const trendColor =
    trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500";

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-gray-500">{title}</div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {subtitle && (
          <div className={`text-sm font-medium flex items-center ${trendColor}`}>
            <ion-icon name={trendIcon} className="mr-1"></ion-icon>
            {subtitle}
          </div>
        )}
      </div>
      <div className={color}>
        <ion-icon name={iconName} className="text-5xl"></ion-icon>
      </div>
    </div>
  );
}
