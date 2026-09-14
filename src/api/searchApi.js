import axios from "./axios";
import { SEARCH_ENDPOINTS } from "./endpoints";

export const searchByNameApi = async (keyword) => {
  const res = await axios.get(SEARCH_ENDPOINTS.BY_NAME, { params: { keyword } });
  return res.data;
};

export const searchByCategoryApi = async (category) => {
  const res = await axios.get(SEARCH_ENDPOINTS.BY_CATEGORY, { params: { category } });
  return res.data;
};

export const searchByCityApi = async (city) => {
  const res = await axios.get(SEARCH_ENDPOINTS.BY_CITY, { params: { city } });
  return res.data;
};

export const searchByStateApi = async (state) => {
  const res = await axios.get(SEARCH_ENDPOINTS.BY_STATE, { params: { state } });
  return res.data;
};

export const searchByPriceApi = async (min, max) => {
  const res = await axios.get(SEARCH_ENDPOINTS.BY_PRICE, { params: { min, max } });
  return res.data;
};