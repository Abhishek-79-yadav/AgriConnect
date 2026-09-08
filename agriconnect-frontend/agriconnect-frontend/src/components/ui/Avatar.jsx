export default function Avatar({ src, name = "", size = 36, className = "" }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      style={{ width: size, height: size }}
      className={`flex items-center justify-center rounded-full bg-gold-light text-xs font-semibold text-gold-dark ${className}`}
    >
      {initials || "?"}
    </span>
  );
}
