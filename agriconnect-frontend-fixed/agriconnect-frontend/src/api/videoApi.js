import axios from "./axios";
import { VIDEO_ENDPOINTS } from "./endpoints";

/** POST /api/videos/upload — multipart: productId, title, file */
export const uploadProductVideoApi = async ({ productId, title, file }) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(VIDEO_ENDPOINTS.UPLOAD, formData, {
    params: { productId, title },
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/** GET /api/videos/product/{productId} */
export const getVideosByProductApi = async (productId) => {
  const res = await axios.get(VIDEO_ENDPOINTS.BY_PRODUCT(productId));
  return res.data;
};

/** GET /api/videos/farmer/{farmerId} */
export const getVideosByFarmerApi = async (farmerId) => {
  const res = await axios.get(VIDEO_ENDPOINTS.BY_FARMER(farmerId));
  return res.data;
};
