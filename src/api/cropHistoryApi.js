import axios from "./axios";
import { CROP_HISTORY_ENDPOINTS } from "./endpoints";

/** GET /api/farmer/crop-history — the logged-in farmer's own records */
export const getMyCropHistoryApi = async () => {
  const res = await axios.get(CROP_HISTORY_ENDPOINTS.ALL);
  return res.data;
};

/** POST /api/farmer/crop-history */
export const addCropHistoryApi = async (data) => {
  const res = await axios.post(CROP_HISTORY_ENDPOINTS.ADD, data);
  return res.data;
};

/** DELETE /api/farmer/crop-history/{id} */
export const deleteCropHistoryApi = async (id) => {
  await axios.delete(CROP_HISTORY_ENDPOINTS.DELETE(id));
  return id;
};
