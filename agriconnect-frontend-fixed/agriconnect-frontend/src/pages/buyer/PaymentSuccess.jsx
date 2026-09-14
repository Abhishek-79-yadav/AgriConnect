import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Button from "../../components/ui/Button";

export default function PaymentSuccess() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <CheckCircle2 className="h-14 w-14 text-field" />
      <h1 className="font-display text-2xl text-ink">Payment successful</h1>
      <p className="text-sm text-ink/60">Your order has been placed successfully.</p>
      <Link to="/buyer/orders" className="mt-2">
        <Button>View my orders</Button>
      </Link>
    </div>
  );
}
