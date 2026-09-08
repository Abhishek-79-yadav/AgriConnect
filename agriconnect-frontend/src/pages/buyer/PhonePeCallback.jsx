import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";

import { confirmPhonePeApi } from "../../api/paymentApi";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";

// PhonePe redirects here after the buyer pays (or cancels). The redirect
// itself proves nothing — we always re-check status with our backend
// (which re-checks with PhonePe directly) before treating this as paid.
export default function PhonePeCallback() {
  const [searchParams] = useSearchParams();
  const txnId = searchParams.get("txnId");

  const [status, setStatus] = useState(txnId ? "checking" : "failed"); // checking | success | failed
  const [order, setOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState(txnId ? "" : "Missing transaction reference.");

  useEffect(() => {
    if (!txnId) return;

    confirmPhonePeApi(txnId)
      .then((data) => {
        setOrder(data);
        setStatus(data.paid ? "success" : "failed");
      })
      .catch((error) => {
        setStatus("failed");
        setErrorMessage(error.response?.data?.message || "Could not confirm payment status.");
      });
  }, [txnId]);

  if (status === "checking") {
    return <Loader label="Confirming your payment with PhonePe..." full />;
  }

  if (status === "success") {
    return (
      <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 rounded-lg border border-field/30 bg-field-light/40 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-field-dark" />
        <p className="font-display text-xl text-ink">Payment successful!</p>
        {order && <p className="text-sm text-ink/60">Order #{order.id} · ₹{order.totalPrice}</p>}
        <Link to="/buyer/orders">
          <Button>View my orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 rounded-lg border border-rust/30 bg-rust-light/40 p-8 text-center">
      <XCircle className="h-12 w-12 text-rust" />
      <p className="font-display text-xl text-ink">Payment not completed</p>
      <p className="text-sm text-ink/60">{errorMessage || "The payment was cancelled or didn't go through."}</p>
      <Link to="/buyer/checkout">
        <Button variant="outline">Try again</Button>
      </Link>
    </div>
  );
}
