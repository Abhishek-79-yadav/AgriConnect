import { AlertTriangle } from "lucide-react";
import Button from "./Button";

export default function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-rust-light bg-rust-light/40 py-14 text-center">
      <AlertTriangle className="h-9 w-9 text-rust" />
      <h3 className="font-display text-lg text-ink">{title}</h3>
      {message && <p className="max-w-sm text-sm text-ink/60">{message}</p>}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
          Try again
        </Button>
      )}
    </div>
  );
}
