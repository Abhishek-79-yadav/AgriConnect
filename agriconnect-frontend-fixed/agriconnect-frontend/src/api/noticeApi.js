import axios from "./axios";
import { NOTICE_ENDPOINTS } from "./endpoints";

export const getActiveNoticesApi = async () => {
  const res = await axios.get(NOTICE_ENDPOINTS.ACTIVE);
  return res.data;
};

export const getAllNoticesApi = async () => {
  const res = await axios.get(NOTICE_ENDPOINTS.ALL);
  return res.data;
};

export const createNoticeApi = async (data) => {
  const res = await axios.post(NOTICE_ENDPOINTS.CREATE, data);
  return res.data;
};

export const setNoticeStatusApi = async (id, active) => {
  await axios.put(NOTICE_ENDPOINTS.SET_STATUS(id), null, { params: { active } });
};
