import axios from "./axios";
import { FARMER_ENDPOINTS, ORDER_ENDPOINTS } from "./endpoints";

export const getFarmerProfileApi = async () => {
  const res = await axios.get(FARMER_ENDPOINTS.PROFILE);
  return res.data;
};

export const getMyProductsApi = async () => {
  const res = await axios.get(FARMER_ENDPOINTS.PRODUCTS);
  return res.data;
};

export const addProductApi = async (data) => {
  const res = await axios.post(FARMER_ENDPOINTS.PRODUCTS, data);
  return res.data;
};

/** Backend only supports updating price, via query param, not a full update. */
export const updateProductPriceApi = async (id, price) => {
  const res = await axios.put(FARMER_ENDPOINTS.UPDATE_PRICE(id), null, {
    params: { price },
  });
  return res.data;
};

export const deleteProductApi = async (id) => {
  const res = await axios.delete(FARMER_ENDPOINTS.DELETE_PRODUCT(id));
  return res.data;
};

/** Farmer's own orders — GET /api/orders/farmer (lives on OrderController, not FarmerController) */
export const farmerOrdersApi = async () => {
  const res = await axios.get(ORDER_ENDPOINTS.FARMER_ORDERS);
  return res.data;
};

export const getFarmProfileApi = async () => {
  const res = await axios.get(FARMER_ENDPOINTS.FARM_PROFILE);
  return res.data;
};

export const updateFarmProfileApi = async (data) => {
  const res = await axios.put(FARMER_ENDPOINTS.FARM_PROFILE, data);
  return res.data;
};