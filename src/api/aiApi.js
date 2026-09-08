import axios from "./axios";
import { AI_ENDPOINTS } from "./endpoints";

/** GET /api/ai/recommend?farmerId=&temp=&humidity= */
export const aiRecommendationApi = async ({ farmerId, temp, humidity }) => {
  const res = await axios.get(AI_ENDPOINTS.RECOMMEND, {
    params: { farmerId, temp, humidity },
  });
  return res.data;
};