export default function Select({
  label,
  error,
  options = [],
  placeholder,
  className = "",
  id,
  ...props
}) {
  const inputId = id || props.name;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}

      <select
        id={inputId}
        className={`w-full rounded border bg-card px-3 py-2 text-sm text-ink
          focus:outline-none focus:ring-1
          ${error ? "border-rust focus:border-rust focus:ring-rust" : "border-line focus:border-gold focus:ring-gold"}
          ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      {error && <span className="text-xs text-rust">{error}</span>}
    </div>
  );
}
