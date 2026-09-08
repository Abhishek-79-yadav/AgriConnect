import { X } from "lucide-react";

export default function Drawer({ open, onClose, title, children, side = "right" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-ink/40" onClick={onClose} />

      <div
        className={`h-full w-full max-w-sm overflow-y-auto bg-card p-6 shadow-xl
          ${side === "right" ? "order-2" : "order-1"}`}
      >
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
