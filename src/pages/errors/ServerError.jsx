import { Link } from "react-router-dom";
import { ServerCrash } from "lucide-react";
import Button from "../../components/ui/Button";

export default function ServerError() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <ServerCrash className="h-14 w-14 text-rust" />
      <h1 className="font-display text-5xl text-ink">500</h1>
      <h3 className="font-display text-lg text-ink">Something went wrong on our end</h3>
      <p className="max-w-sm text-sm text-ink/60">Please try again in a moment.</p>
      <Link to="/" className="mt-2"><Button>Go home</Button></Link>
    </div>
  );
}
