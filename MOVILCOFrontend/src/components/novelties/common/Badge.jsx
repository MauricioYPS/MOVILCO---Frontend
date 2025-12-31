import React from "react";

const Badge = ({ type, size = "md" }) => {
  const styles = {
    INCAPACIDAD: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
    VACACIONES: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20",
    LICENCIA: "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20",
    PERMISO: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
    DEFAULT: "bg-slate-50 text-slate-600 ring-1 ring-slate-600/20"
  };

  const sizeClasses = size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center font-semibold rounded ${sizeClasses} ${styles[type] || styles.DEFAULT}`}>
      {type}
    </span>
  );
};

export default Badge;
