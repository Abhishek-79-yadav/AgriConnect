import axios from "./axios";
import { COUPON_ENDPOINTS } from "./endpoints";

/** POST /api/coupon (admin only) */
export const createCouponApi = async (data) => {
  const res = await axios.post(COUPON_ENDPOINTS.CREATE, data);
  return res.data;
};

/** POST /api/coupon/apply?code=&amount= */
export const applyCouponApi = async (code, amount) => {
  const res = await axios.post(COUPON_ENDPOINTS.APPLY, null, {
    params: { code, amount },
  });
  return res.data;
};

/** GET /api/coupon/validate/{code} */
export const validateCouponApi = async (code) => {
  const res = await axios.get(COUPON_ENDPOINTS.VALIDATE(code));
  return res.data;
};