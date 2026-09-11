import axios from "./axios";
import { CROP_ENDPOINTS } from "./endpoints";

/** GET /api/crops */
export const getAllCropsApi = async () => {
  const res = await axios.get(CROP_ENDPOINTS.ALL);
  return res.data;
};

/** GET /api/crop-info/{cropId} */
export const getCropInfoApi = async (cropId) => {
  const res = await axios.get(CROP_ENDPOINTS.INFO(cropId));
  return res.data;
};

/** POST /api/crop/suggest */
export const cropRecommendationApi = async (data) => {
  const res = await axios.post(CROP_ENDPOINTS.SUGGEST, data);
  return res.data;
};

/** POST /api/crops — name, season, description */
export const createCropApi = async (data) => {
  const res = await axios.post(CROP_ENDPOINTS.CREATE, data);
  return res.data;
};

/** GET /api/smart-crop/{city} */
export const smartCropApi = async (city) => {
  const res = await axios.get(CROP_ENDPOINTS.SMART_CROP(city));
  return res.data;
};