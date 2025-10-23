export default function InfoField({ label, value, copyable }) {
  const copy = async () => {
    try { await navigator.clipboard.writeText(value ?? ""); } catch {}
  };
  return (
    <div>
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <div className={`mt-1 bg-gray-50 p-3 rounded-lg border border-gray-200 ${copyable ? "flex justify-between items-center" : ""}`}>
        <p className="text-base font-semibold text-gray-900 break-all">{value ?? "N/A"}</p>
        {copyable && (
          <button
            onClick={copy}
            className="text-gray-400 hover:text-[#cc0000]" title="Copiar"
          >
            <ion-icon name="copy-outline" class="text-lg"></ion-icon>
          </button>
        )}
      </div>
    </div>
  );
}
