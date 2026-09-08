const TONES = {
  neutral: "bg-line/60 text-ink",
  gold: "bg-gold-light text-gold-dark",
  field: "bg-field-light text-field-dark",
  slate: "bg-slate-light text-slate-dark",
  rust: "bg-rust-light text-rust",
  success: "bg-field-light text-field-dark",
  warning: "bg-gold-light text-gold-dark",
  danger: "bg-rust-light text-rust",
};

export default function Badge({ text, children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
        ${TONES[tone] || TONES.neutral} ${className}`}
    >
      {text ?? children}
    </span>
  );
}
