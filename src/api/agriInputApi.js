import axios from "./axios";
import { PLAN_ENDPOINTS, SUBSCRIPTION_ENDPOINTS, AGRI_INPUT_ENDPOINTS } from "./endpoints";

export const getPlansApi = async () => {
  const res = await axios.get(PLAN_ENDPOINTS.LIST);
  return res.data;
};

export const subscribeApi = async (planId) => {
  const res = await axios.post(SUBSCRIPTION_ENDPOINTS.SUBSCRIBE(planId));
  return res.data;
};

export const getMySubscriptionsApi = async () => {
  const res = await axios.get(SUBSCRIPTION_ENDPOINTS.MINE);
  return res.data;
};

export const getMyAgriInputsApi = async () => {
  const res = await axios.get(AGRI_INPUT_ENDPOINTS.BRAND_LIST);
  return res.data;
};

export const createAgriInputApi = async (data) => {
  const res = await axios.post(AGRI_INPUT_ENDPOINTS.BRAND_CREATE, data);
  return res.data;
};

export const deleteAgriInputApi = async (id) => {
  const res = await axios.delete(AGRI_INPUT_ENDPOINTS.BRAND_DELETE(id));
  return res.data;
};

export const browseAgriInputsApi = async () => {
  const res = await axios.get(AGRI_INPUT_ENDPOINTS.BUYER_BROWSE);
  return res.data;
};

export const getFarmerAgriInputAdsApi = async () => {
  const res = await axios.get(AGRI_INPUT_ENDPOINTS.FARMER_ADS);
  return res.data;
};
