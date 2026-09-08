import axios from "./axios";
import { RATING_ENDPOINTS } from "./endpoints";

/** POST /api/buyer/rate — body: { farmerId, stars (1-5), comment } */
export const submitRatingApi = async (data) => {
  const res = await axios.post(RATING_ENDPOINTS.RATE, data);
  return res.data;
};

/** GET /api/farmer/{farmerId}/ratings */
export const getFarmerRatingsApi = async (farmerId) => {
  const res = await axios.get(RATING_ENDPOINTS.BY_FARMER(farmerId));
  return res.data;
};

/** GET /api/farmer/{farmerId}/rating-average -> { farmerId, averageRating } */
export const getFarmerRatingAverageApi = async (farmerId) => {
  const res = await axios.get(RATING_ENDPOINTS.FARMER_AVERAGE(farmerId));
  return res.data;
};
