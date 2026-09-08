export default function Switch({ checked, onChange, label, className = "" }) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
      <span
        onClick={() => onChange?.(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition
          ${checked ? "bg-gold" : "bg-line"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition
            ${checked ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </span>
      {label && <span className="text-sm text-ink">{label}</span>}
    </label>
  );
}
