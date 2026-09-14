import axios from "./axios";
import { PAYMENT_ENDPOINTS } from "./endpoints";

/** POST /api/buyer/payment/create/{orderId} — returns { razorpayOrderId, amount, currency, razorpayKey } */
export const createPaymentApi = async (orderId) => {
  const res = await axios.post(PAYMENT_ENDPOINTS.CREATE_ORDER(orderId));
  return res.data;
};

/**
 * POST /api/buyer/payment/verify/{orderId}
 * Backend verifies the Razorpay signature server-side, so it needs all
 * three fields Razorpay's checkout handler returns — not just a payment id.
 */
export const verifyPaymentApi = async (orderId, { razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const res = await axios.post(PAYMENT_ENDPOINTS.VERIFY_PAYMENT(orderId), null, {
    params: { razorpayOrderId, razorpayPaymentId, razorpaySignature },
  });
  return res.data;
};

/** POST /api/buyer/payment/phonepe/initiate/{orderId} — returns { merchantTransactionId, redirectUrl } */
export const initiatePhonePeApi = async (orderId) => {
  const res = await axios.post(PAYMENT_ENDPOINTS.PHONEPE_INITIATE(orderId));
  return res.data;
};

/**
 * GET /api/buyer/payment/phonepe/confirm/{merchantTransactionId}
 * Called after PhonePe redirects the buyer back — re-checks status
 * server-side (never trust the redirect URL's query params alone).
 */
export const confirmPhonePeApi = async (merchantTransactionId) => {
  const res = await axios.get(PAYMENT_ENDPOINTS.PHONEPE_CONFIRM(merchantTransactionId));
  return res.data;
};
