import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { CreditCard, Smartphone } from "lucide-react";

import { createPaymentApi, initiatePhonePeApi } from "../../api/paymentApi";
import { verifyPaymentThunk } from "../../redux/thunks/paymentThunk";
import Button from "../../components/ui/Button";

export default function Payment({ orderId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadingRazorpay, setLoadingRazorpay] = useState(false);
  const [loadingPhonePe, setLoadingPhonePe] = useState(false);

  const handleRazorpay = async () => {
    setLoadingRazorpay(true);

    try {
      // Backend returns { razorpayOrderId, amount, currency, razorpayKey }
      const order = await createPaymentApi(orderId);

      if (!window.Razorpay) {
        toast.error("Payment SDK failed to load — check your connection and try again");
        setLoadingRazorpay(false);
        return;
      }

      const options = {
        key: order.razorpayKey,
        amount: order.amount,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: "AgriConnect",

        // Razorpay only confirms the payment happened on ITS side here.
        // The order isn't actually paid until our backend verifies the
        // signature — that needs all three fields below, not just a
        // payment id, or the server-side check will always fail.
        handler: async (response) => {
          const result = await dispatch(
            verifyPaymentThunk({
              orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
          );

          if (verifyPaymentThunk.fulfilled.match(result)) {
            navigate("/buyer/payment/success");
          } else {
            navigate("/buyer/payment/failed");
          }
        },

        modal: {
          ondismiss: () => setLoadingRazorpay(false),
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", () => {
        setLoadingRazorpay(false);
        navigate("/buyer/payment/failed");
      });

      rzp.open();
    } catch (error) {
      setLoadingRazorpay(false);
      toast.error(error.response?.data?.message || "Could not start payment");
    }
  };

  // PhonePe is a full-page redirect flow, not a popup — there's nothing to
  // "open" here. The buyer's browser leaves this site entirely, pays on
  // PhonePe's hosted page, then PhonePe redirects back to
  // /buyer/payment/phonepe/callback (see PhonePeCallback.jsx), which is
  // where verification actually happens.
  const handlePhonePe = async () => {
    setLoadingPhonePe(true);
    try {
      const { redirectUrl } = await initiatePhonePeApi(orderId);
      window.location.href = redirectUrl;
    } catch (error) {
      setLoadingPhonePe(false);
      toast.error(error.response?.data?.message || "Could not start PhonePe payment");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Button onClick={handleRazorpay} loading={loadingRazorpay} disabled={loadingPhonePe} className="w-full">
        <CreditCard className="h-4 w-4" /> Pay with Card / UPI / Netbanking
      </Button>

      <Button
        onClick={handlePhonePe}
        loading={loadingPhonePe}
        disabled={loadingRazorpay}
        variant="outline"
        className="w-full"
      >
        <Smartphone className="h-4 w-4" /> Pay with PhonePe
      </Button>
    </div>
  );
}
