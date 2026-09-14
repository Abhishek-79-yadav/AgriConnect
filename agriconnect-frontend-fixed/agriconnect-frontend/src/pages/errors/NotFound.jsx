import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Button from "../../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <Compass className="h-14 w-14 text-ink/30" />
      <h1 className="font-display text-5xl text-ink">404</h1>
      <h3 className="font-display text-lg text-ink">Page not found</h3>
      <p className="max-w-sm text-sm text-ink/60">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/" className="mt-2"><Button>Go home</Button></Link>
    </div>
  );
}
