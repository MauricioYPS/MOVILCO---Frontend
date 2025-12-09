export default function Icon({ path, size = 20, className = "" }) {
    return (
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
}
