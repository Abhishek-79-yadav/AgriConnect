import axios from "./axios";
import { CLOUDINARY_ENDPOINTS } from "./endpoints";

/** POST /api/cloudinary/image (multipart) */
export const uploadImageApi = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(CLOUDINARY_ENDPOINTS.UPLOAD_IMAGE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/** POST /api/cloudinary/video (multipart) */
export const uploadVideoApi = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(CLOUDINARY_ENDPOINTS.UPLOAD_VIDEO, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteCloudinaryAssetApi = async (publicId) => {
  const res = await axios.delete(CLOUDINARY_ENDPOINTS.DELETE(publicId));
  return res.data;
};