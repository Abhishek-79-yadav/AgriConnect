import Spinner from "./Spinner";

export default function Loader({ label = "Loading...", full = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-sm text-ink/60 ${
        full ? "min-h-[60vh]" : "py-12"
      }`}
    >
      <Spinner size="lg" />
      <span>{label}</span>
    </div>
  );
}
