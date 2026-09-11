import axios from "./axios";
import { GOVERNMENT_OFFICIAL_ENDPOINTS } from "./endpoints";

/** GET /api/super-admin/government-officials */
export const getGovernmentOfficialsApi = async () => {
  const res = await axios.get(GOVERNMENT_OFFICIAL_ENDPOINTS.LIST);
  return res.data;
};

/** POST /api/super-admin/government-officials */
export const createGovernmentOfficialApi = async (data) => {
  const res = await axios.post(GOVERNMENT_OFFICIAL_ENDPOINTS.CREATE, data);
  return res.data;
};

/** DELETE /api/super-admin/government-officials/{id} */
export const deleteGovernmentOfficialApi = async (id) => {
  await axios.delete(GOVERNMENT_OFFICIAL_ENDPOINTS.DELETE(id));
};
