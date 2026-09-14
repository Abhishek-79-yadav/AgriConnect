import axios from "./axios";
import { REFUND_ENDPOINTS } from "./endpoints";

/** GET /api/refunds/buyer */
export const getBuyerRefundsApi = async () => {
  const res = await axios.get(REFUND_ENDPOINTS.BUYER_REFUNDS);
  return res.data;
};

/** GET /api/refunds/admin */
export const getAllRefundsApi = async () => {
  const res = await axios.get(REFUND_ENDPOINTS.ADMIN_REFUNDS);
  return res.data;
};
