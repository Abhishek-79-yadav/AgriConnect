import axios from "./axios";
import { WISHLIST_ENDPOINTS } from "./endpoints";

export const getWishlistApi = async () => {
  const res = await axios.get(WISHLIST_ENDPOINTS.GET);
  return res.data;
};

export const addWishlistApi = async (productId) => {
  const res = await axios.post(WISHLIST_ENDPOINTS.ADD(productId));
  return res.data;
};

export const removeWishlistApi = async (productId) => {
  const res = await axios.delete(WISHLIST_ENDPOINTS.REMOVE(productId));
  return res.data;
};