import { Check, X } from "lucide-react";

// Mirrors the backend's @StrongPassword rule exactly (see
// StrongPasswordValidator on the backend) — length >= 8, at least one
// letter, one digit, one special character. Shown live so someone finds
// out what's missing while typing, not after a 400 comes back.
export const PASSWORD_RULES = [
  { key: "length", label: "At least 8 characters", test: (v) => v.length >= 8 },
  { key: "letter", label: "One letter", test: (v) => /[A-Za-z]/.test(v) },
  { key: "digit", label: "One number", test: (v) => /\d/.test(v) },
  {
    key: "special",
    label: "One special character (e.g. @ # $ !)",
    test: (v) => /[@#$%^&+=!*_\-.?/(){}[\]:;,<>~`|]/.test(v),
  },
];

export const isStrongPassword = (value) => PASSWORD_RULES.every((r) => r.test(value || ""));

export default function PasswordStrengthHint({ password }) {
  if (!password) return null;

  return (
    <ul className="mt-1.5 flex flex-col gap-0.5">
      {PASSWORD_RULES.map((rule) => {
        const passed = rule.test(password);
        return (
          <li
            key={rule.key}
            className={`flex items-center gap-1.5 text-xs ${passed ? "text-field-dark" : "text-ink/40"}`}
          >
            {passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
