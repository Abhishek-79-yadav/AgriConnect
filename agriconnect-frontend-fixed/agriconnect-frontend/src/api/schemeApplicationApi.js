import axios from "./axios";
import { SCHEME_APPLICATION_ENDPOINTS } from "./endpoints";

export const applyToSchemeApi = async (data) => {
  const res = await axios.post(SCHEME_APPLICATION_ENDPOINTS.APPLY, data);
  return res.data;
};

export const getMyApplicationsApi = async () => {
  const res = await axios.get(SCHEME_APPLICATION_ENDPOINTS.MINE);
  return res.data;
};

export const getAllApplicationsApi = async () => {
  const res = await axios.get(SCHEME_APPLICATION_ENDPOINTS.ALL);
  return res.data;
};

export const verifyApplicationDocumentsApi = async (id, verified, remarks) => {
  const res = await axios.put(SCHEME_APPLICATION_ENDPOINTS.VERIFY_DOCUMENTS(id), null, {
    params: remarks ? { verified, remarks } : { verified },
  });
  return res.data;
};

export const decideApplicationApi = async (id, status, remarks) => {
  const res = await axios.put(SCHEME_APPLICATION_ENDPOINTS.DECISION(id), null, {
    params: remarks ? { status, remarks } : { status },
  });
  return res.data;
};
