import axios from "./axios";
import { CART_ENDPOINTS } from "./endpoints";

/** GET /api/buyer/cart */
export const getCartItems = async () => {
  const res = await axios.get(CART_ENDPOINTS.GET_CART);
  return res.data;
};

/** POST /api/buyer/cart?productId=&qty= */
export const addCartItem = async (productId, qty = 1) => {
  const res = await axios.post(CART_ENDPOINTS.ADD_TO_CART, null, {
    params: { productId, qty },
  });
  return res.data;
};

/** PUT /api/buyer/cart?productId=&qty= */
export const updateCartItem = async (productId, qty) => {
  const res = await axios.put(CART_ENDPOINTS.UPDATE_CART, null, {
    params: { productId, qty },
  });
  return res.data;
};

/** DELETE /api/buyer/cart/{productId} */
export const removeCartItem = async (productId) => {
  await axios.delete(CART_ENDPOINTS.REMOVE_FROM_CART(productId));
};
