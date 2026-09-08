import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  error,
  hint,
  className = "",
  id,
  type,
  ...props
}) {
  const inputId = id || props.name;
  const isPassword = type === "password";
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={isPassword && visible ? "text" : type}
          className={`w-full rounded border bg-card px-3 py-2 text-sm text-ink placeholder:text-ink/40
            focus:outline-none focus:ring-1
            ${isPassword ? "pr-10" : ""}
            ${error ? "border-rust focus:border-rust focus:ring-rust" : "border-line focus:border-gold focus:ring-gold"}
            ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-ink/40 hover:text-ink"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>

      {error ? (
        <span className="text-xs text-rust">{error}</span>
      ) : hint ? (
        <span className="text-xs text-ink/50">{hint}</span>
      ) : null}
    </div>
  );
}
