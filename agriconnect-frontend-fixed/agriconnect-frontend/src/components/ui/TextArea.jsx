export default function TextArea({
  label,
  error,
  hint,
  rows = 4,
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

      <textarea
        id={inputId}
        rows={rows}
        className={`w-full resize-y rounded border bg-card px-3 py-2 text-sm text-ink placeholder:text-ink/40
          focus:outline-none focus:ring-1
          ${error ? "border-rust focus:border-rust focus:ring-rust" : "border-line focus:border-gold focus:ring-gold"}
          ${className}`}
        {...props}
      />

      {error ? (
        <span className="text-xs text-rust">{error}</span>
      ) : hint ? (
        <span className="text-xs text-ink/50">{hint}</span>
      ) : null}
    </div>
  );
}
