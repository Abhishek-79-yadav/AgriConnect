export default function SectionTitle({ title, action }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="font-display text-lg text-ink">{title}</h2>
      {action}
    </div>
  );
}
