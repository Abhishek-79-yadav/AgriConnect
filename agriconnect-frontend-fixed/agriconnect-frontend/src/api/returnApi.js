import axios from "./axios";
import { RETURN_ENDPOINTS } from "./endpoints";

/** POST /api/returns */
export const requestReturnApi = async (data) => {
  const res = await axios.post(RETURN_ENDPOINTS.CREATE, data);
  return res.data;
};

/** GET /api/returns/buyer */
export const getBuyerReturnsApi = async () => {
  const res = await axios.get(RETURN_ENDPOINTS.BUYER_RETURNS);
  return res.data;
};

/** GET /api/returns/farmer */
export const getFarmerReturnsApi = async () => {
  const res = await axios.get(RETURN_ENDPOINTS.FARMER_RETURNS);
  return res.data;
};

/** GET /api/returns/admin */
export const getAllReturnsApi = async () => {
  const res = await axios.get(RETURN_ENDPOINTS.ADMIN_RETURNS);
  return res.data;
};

/** PUT /api/returns/{id}/status?status=APPROVED&note=... */
export const updateReturnStatusApi = async (id, status, note) => {
  const res = await axios.put(RETURN_ENDPOINTS.UPDATE_STATUS(id), null, {
    params: note ? { status, note } : { status },
  });
  return res.data;
};
