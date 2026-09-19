import axios from "./axios";
import { REVIEW_ENDPOINTS } from "./endpoints";

export const createReviewApi = async (data) => {
  const res = await axios.post(REVIEW_ENDPOINTS.CREATE, data);
  return res.data;
};

export const updateReviewApi = async (id, data) => {
  const res = await axios.put(REVIEW_ENDPOINTS.UPDATE(id), data);
  return res.data;
};

export const deleteReviewApi = async (id) => {
  await axios.delete(REVIEW_ENDPOINTS.DELETE(id));
};

export const replyToReviewApi = async (id, reply) => {
  const res = await axios.put(REVIEW_ENDPOINTS.REPLY(id), null, { params: { reply } });
  return res.data;
};

export const getReviewsForProductApi = async (productId) => {
  const res = await axios.get(REVIEW_ENDPOINTS.FOR_PRODUCT(productId));
  return res.data;
};

export const getMyReviewsApi = async () => {
  const res = await axios.get(REVIEW_ENDPOINTS.MINE);
  return res.data;
};

export const getReviewableOrderItemIdsApi = async () => {
  const res = await axios.get(REVIEW_ENDPOINTS.REVIEWABLE);
  return res.data;
};

export const getReviewsForFarmerApi = async () => {
  const res = await axios.get(REVIEW_ENDPOINTS.FOR_FARMER);
  return res.data;
};
