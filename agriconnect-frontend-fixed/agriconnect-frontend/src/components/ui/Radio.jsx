export default function Radio({ label, className = "", id, ...props }) {
  const inputId = id || `${props.name}-${props.value}`;

  return (
    <label htmlFor={inputId} className={`flex items-center gap-2 text-sm text-ink ${className}`}>
      <input
        id={inputId}
        type="radio"
        className="h-4 w-4 border-line text-gold focus:ring-gold"
        {...props}
      />
      {label}
    </label>
  );
}
