import axios from "./axios";
import { DEPARTMENT_ENDPOINTS } from "./endpoints";

export const getActiveDepartmentsApi = async () => {
  const res = await axios.get(DEPARTMENT_ENDPOINTS.ACTIVE);
  return res.data;
};

export const getAllDepartmentsApi = async () => {
  const res = await axios.get(DEPARTMENT_ENDPOINTS.ALL);
  return res.data;
};

export const createDepartmentApi = async (data) => {
  const res = await axios.post(DEPARTMENT_ENDPOINTS.CREATE, data);
  return res.data;
};

export const updateDepartmentApi = async (id, data) => {
  const res = await axios.put(DEPARTMENT_ENDPOINTS.UPDATE(id), data);
  return res.data;
};

export const setDepartmentStatusApi = async (id, active) => {
  await axios.put(DEPARTMENT_ENDPOINTS.SET_STATUS(id), null, { params: { active } });
};
