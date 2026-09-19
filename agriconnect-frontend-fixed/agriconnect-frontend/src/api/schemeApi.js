import axios from "./axios";
import { SCHEME_ENDPOINTS } from "./endpoints";

/** GET /api/schemes — public/active schemes list (used by schemeThunk) */
export const getSchemesApi = async () => {
  const res = await axios.get(SCHEME_ENDPOINTS.ALL);
  return res.data?.data ?? res.data;
};

/** GET /api/schemes/state/{state} */
export const getSchemesByStateApi = async (state) => {
  const res = await axios.get(SCHEME_ENDPOINTS.STATE(state));
  return res.data?.data ?? res.data;
};

/** POST /api/schemes/admin */
export const addSchemeApi = async (data) => {
  const res = await axios.post(SCHEME_ENDPOINTS.ADD, data);
  return res.data?.data ?? res.data;
};

/** POST /api/schemes/admin — alias used by the government Schemes page */
export const createSchemeApi = addSchemeApi;

/** DELETE /api/schemes/admin/{id} — deactivates the scheme */
export const deleteSchemeApi = async (id) => {
  const res = await axios.delete(SCHEME_ENDPOINTS.DELETE(id));
  return res.data?.data ?? res.data;
};

// ---------------- Government management extras ----------------

/** GET /api/schemes/admin — every scheme including inactive ones */
export const getManagedSchemesApi = async () => {
  const res = await axios.get(SCHEME_ENDPOINTS.MANAGE_LIST);
  return res.data?.data ?? res.data;
};

/** PUT /api/schemes/admin/{id} */
export const updateSchemeApi = async (id, data) => {
  const res = await axios.put(SCHEME_ENDPOINTS.UPDATE(id), data);
  return res.data?.data ?? res.data;
};

/** PUT /api/schemes/admin/{id}/reactivate */
export const reactivateSchemeApi = async (id) => {
  await axios.put(SCHEME_ENDPOINTS.REACTIVATE(id));
};

/** DELETE /api/schemes/admin/{id} */
export const deactivateSchemeApi = async (id) => {
  await axios.delete(SCHEME_ENDPOINTS.DELETE(id));
};