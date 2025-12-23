import React from "react"

export const IconBase = ({ size = 20, className = "", children }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        width={size}
        height={size}
        className={className}
    >
        {children}
    </svg>
)

export const Icon = ({ path, size = 20, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        width={size}
        height={size}
        className={className}
    >
        <path d={path} />
    </svg>
)

export const CircularProgress = ({ value, size = 50, strokeWidth = 4, colorClass = "text-red-600", trackClass = "text-gray-200" }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (Math.min(value, 100) / 100) * circumference

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="h-full w-full -rotate-90 transform">
                <circle className={trackClass} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
                <circle
                    className={`${colorClass} transition-all duration-700 ease-out`}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <div className="absolute text-[10px] font-bold text-slate-700">{Math.round(value)}%</div>
        </div>
    )
}

export const ProgressBar = ({ value, colorClass = "bg-blue-600" }) => (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
)

export const getGapColor = (gap) => (gap >= 0 ? "text-emerald-600" : "text-rose-600")

export const getProgressBarColor = (val) => {
    if (val >= 100) return "bg-emerald-500"
    if (val >= 90) return "bg-amber-500"
    return "bg-rose-500"
}
