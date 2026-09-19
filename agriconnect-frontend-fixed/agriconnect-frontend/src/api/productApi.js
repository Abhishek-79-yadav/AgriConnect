import axios from "./axios";
import { BUYER_ENDPOINTS, FARMER_ENDPOINTS } from "./endpoints";

/** All products visible to a buyer — GET /api/buyer/products */
export const getProducts = async () => {
  const res = await axios.get(BUYER_ENDPOINTS.PRODUCTS);
  return res.data;
};

/** Backend has no GET-single-product-by-id route; filter client side for now. */
export const getProductById = async (id) => {
  const products = await getProducts();
  return products.find((p) => String(p.id) === String(id));
};

/** Create a product as a farmer — POST /api/farmer/products */
export const createProduct = async (data) => {
  const res = await axios.post(FARMER_ENDPOINTS.PRODUCTS, data);
  return res.data;
};