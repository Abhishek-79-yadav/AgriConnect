import { Leaf, Sun, CloudSun } from "lucide-react";

/** Decorative side panel for the auth pages (login/register/etc). Hidden on small screens. */
export default function AuthIllustration() {
  return (
    <div className="relative hidden w-full max-w-md flex-col justify-between overflow-hidden rounded-lg bg-field p-10 text-card lg:flex">
      <Sun className="absolute -right-6 -top-6 h-32 w-32 text-field-light/30" />
      <CloudSun className="absolute right-10 top-16 h-10 w-10 text-card/40" />

      <div className="relative z-10">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-field">
          <Leaf className="h-6 w-6" />
        </span>

        <h2 className="mt-8 font-display text-3xl leading-snug">
          Fresh from the farm, straight to you.
        </h2>
        <p className="mt-3 max-w-xs text-sm text-card/80">
          AgriConnect connects farmers directly with buyers — fair prices,
          fresh produce, no middlemen.
        </p>
      </div>

      <div className="relative z-10 flex items-end gap-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <Leaf
            key={i}
            className="text-card/25"
            style={{ height: 18 + i * 8, width: 18 + i * 8 }}
          />
        ))}
      </div>
    </div>
  );
}
