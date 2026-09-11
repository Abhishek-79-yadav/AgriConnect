import axios from "./axios";
import { ORDER_ENDPOINTS, BUYER_DISPUTE_ENDPOINTS } from "./endpoints";

/** POST /api/orders/checkout */
export const placeOrderApi = async (checkoutData) => {
  const res = await axios.post(ORDER_ENDPOINTS.CHECKOUT, checkoutData);
  return res.data;
};

/** GET /api/orders/buyer */
export const getBuyerOrdersApi = async () => {
  const res = await axios.get(ORDER_ENDPOINTS.BUYER_ORDERS);
  return res.data;
};

/** GET /api/orders/farmer */
export const getFarmerOrdersApi = async () => {
  const res = await axios.get(ORDER_ENDPOINTS.FARMER_ORDERS);
  return res.data;
};

/** PUT /api/orders/{id}/status?status=CONFIRMED */
export const updateOrderStatusApi = async (id, status) => {
  const res = await axios.put(ORDER_ENDPOINTS.UPDATE_STATUS(id), null, {
    params: { status },
  });
  return res.data;
};

/** PUT /api/orders/{id}/shipment — farmer sets carrier + tracking info */
export const updateOrderShipmentApi = async (id, shipmentData) => {
  const res = await axios.put(ORDER_ENDPOINTS.UPDATE_SHIPMENT(id), shipmentData);
  return res.data;
};

export const fileDisputeApi = async (data) => {
  const res = await axios.post(BUYER_DISPUTE_ENDPOINTS.FILE, data);
  return res.data;
};

export const getMyDisputesApi = async () => {
  const res = await axios.get(BUYER_DISPUTE_ENDPOINTS.MINE);
  return res.data;
};