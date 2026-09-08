export default function DashboardCard({ title, value, icon: Icon, tone = "gold" }) {
  const TONE_BG = {
    gold: "bg-gold-light text-gold-dark",
    field: "bg-field-light text-field-dark",
    slate: "bg-slate-light text-slate-dark",
    rust: "bg-rust-light text-rust",
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border border-line bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      {Icon && (
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${TONE_BG[tone] || TONE_BG.gold}`}>
          <Icon className="h-5 w-5" />
        </span>
      )}
      <div>
        <p className="text-sm text-ink/60">{title}</p>
        <p className="font-display text-2xl text-ink">{value}</p>
      </div>
    </div>
  );
}
