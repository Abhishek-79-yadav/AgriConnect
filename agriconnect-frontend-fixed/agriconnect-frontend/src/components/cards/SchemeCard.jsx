import { Landmark } from "lucide-react";

export default function SchemeCard({ scheme, onApply, applied }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-line bg-card p-5">
      <div className="flex items-center gap-2">
        <Landmark className="h-5 w-5 text-slate" />
        <h3 className="font-display text-ink">{scheme.title || scheme.name}</h3>
      </div>

      <p className="line-clamp-3 text-sm text-ink/60">{scheme.description}</p>

      {scheme.eligibilityCriteria && (
        <p className="text-xs text-ink/50">
          <span className="font-medium text-ink/70">Eligibility:</span> {scheme.eligibilityCriteria}
        </p>
      )}

      <div className="mt-1 flex items-center gap-3">
        {(scheme.applyLink || scheme.link) && (
          <a
            href={scheme.applyLink || scheme.link}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-slate hover:underline"
          >
            Apply now →
          </a>
        )}
        {onApply && (
          applied ? (
            <span className="text-sm font-medium text-field-dark">Already applied</span>
          ) : (
            <button onClick={() => onApply(scheme)} className="text-sm font-medium text-gold-dark hover:underline">
              Apply on AgriConnect
            </button>
          )
        )}
      </div>
    </div>
  );
}
