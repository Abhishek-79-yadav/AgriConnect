import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import Button from "../../components/ui/Button";

export default function Unauthorized() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <ShieldAlert className="h-14 w-14 text-gold-dark" />
      <h1 className="font-display text-5xl text-ink">403</h1>
      <h3 className="font-display text-lg text-ink">You don't have access to this page</h3>
      <p className="max-w-sm text-sm text-ink/60">If you think this is a mistake, contact support.</p>
      <Link to="/" className="mt-2"><Button>Go home</Button></Link>
    </div>
  );
}
