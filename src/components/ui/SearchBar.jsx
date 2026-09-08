import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, onSubmit, placeholder = "Search...", className = "" }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
      className={`flex items-center gap-2 rounded border border-line bg-card px-3 py-2 ${className}`}
    >
      <Search className="h-4 w-4 shrink-0 text-ink/40" />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
      />
    </form>
  );
}
