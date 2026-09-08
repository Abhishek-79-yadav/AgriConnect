export default function Skeleton({ height = 16, width = "100%", rounded = "rounded", className = "" }) {
  return (
    <div
      className={`animate-pulse bg-line/60 ${rounded} ${className}`}
      style={{ height, width }}
    />
  );
}
