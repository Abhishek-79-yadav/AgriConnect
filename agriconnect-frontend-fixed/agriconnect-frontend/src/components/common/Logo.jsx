import { Link } from "react-router-dom";

const SIZES = {
  sm: { mark: "h-8 w-8", text: "text-base" },
  md: { mark: "h-11 w-11", text: "text-xl" },
  lg: { mark: "h-16 w-16", text: "text-2xl" },
};

/** Brand mark + wordmark, used in the navbar, footer and auth pages. */
export default function Logo({ size = "md", to = "/", withText = true, className = "" }) {
  const s = SIZES[size] || SIZES.md;

  const content = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src="/logo.png"
        alt="AgriConnect"
        className={`${s.mark} shrink-0 rounded-full object-cover`}
      />
      {withText && (
        <span className={`font-display ${s.text} font-medium text-ink`}>AgriConnect</span>
      )}
    </span>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}
