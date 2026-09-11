import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, className = "" }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-ink/40 sm:items-center sm:justify-center sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className={`w-full rounded-t-2xl border border-line bg-card p-5 shadow-lg
          max-h-[88vh] overflow-y-auto
          sm:max-w-md sm:rounded-lg sm:p-6
          ${className}`}
      >
        {/* Drag handle — thumb-friendly visual cue that this sheet can be
            dismissed, desktop doesn't need it since it's not a sheet there. */}
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line sm:hidden" />

        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="font-display text-lg text-ink">{title}</h3>}
          <button
            onClick={onClose}
            className="ml-auto rounded p-1 text-ink/50 hover:bg-paper hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
