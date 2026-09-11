import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import Button from "../../components/ui/Button";

export default function PaymentFailed() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <XCircle className="h-14 w-14 text-rust" />
      <h1 className="font-display text-2xl text-ink">Payment failed</h1>
      <p className="text-sm text-ink/60">The transaction could not be completed.</p>
      <Link to="/buyer/cart" className="mt-2">
        <Button variant="outline">Try again</Button>
      </Link>
    </div>
  );
}
