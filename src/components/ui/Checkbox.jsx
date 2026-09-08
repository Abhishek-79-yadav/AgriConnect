export default function Checkbox({ label, className = "", id, ...props }) {
  const inputId = id || props.name;

  return (
    <label htmlFor={inputId} className={`flex items-center gap-2 text-sm text-ink ${className}`}>
      <input
        id={inputId}
        type="checkbox"
        className="h-4 w-4 rounded border-line text-gold focus:ring-gold"
        {...props}
      />
      {label}
    </label>
  );
}
