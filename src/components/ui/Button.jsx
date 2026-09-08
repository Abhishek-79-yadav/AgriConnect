const VARIANTS = {
  primary: "bg-gold text-white hover:bg-gold-dark focus-visible:ring-gold",
  field: "bg-field text-white hover:bg-field-dark focus-visible:ring-field",
  slate: "bg-slate text-white hover:bg-slate-dark focus-visible:ring-slate",
  outline: "border border-line bg-card text-ink hover:bg-paper focus-visible:ring-gold",
  ghost: "text-ink/70 hover:bg-paper hover:text-ink focus-visible:ring-gold",
  danger: "bg-rust text-white hover:bg-rust/90 focus-visible:ring-rust",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded font-medium shadow-sm transition
        hover:shadow active:scale-[0.97]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-paper
        disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100
        ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
}
