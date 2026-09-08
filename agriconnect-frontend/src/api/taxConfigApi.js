import axios from "./axios";
import { TAX_CONFIG_ENDPOINTS } from "./endpoints";

export const getActiveTaxConfigApi = async () => {
  const res = await axios.get(TAX_CONFIG_ENDPOINTS.ACTIVE);
  return res.data;
};

export const getAllTaxConfigApi = async () => {
  const res = await axios.get(TAX_CONFIG_ENDPOINTS.ALL);
  return res.data;
};

export const createTaxConfigApi = async (data) => {
  const res = await axios.post(TAX_CONFIG_ENDPOINTS.CREATE, data);
  return res.data;
};

export const updateTaxConfigApi = async (id, data) => {
  const res = await axios.put(TAX_CONFIG_ENDPOINTS.UPDATE(id), data);
  return res.data;
};

export const setTaxConfigStatusApi = async (id, active) => {
  await axios.put(TAX_CONFIG_ENDPOINTS.SET_STATUS(id), null, { params: { active } });
};
