import axios from "./axios";
import { WEATHER_ENDPOINTS } from "./endpoints";

/** GET /api/weather/{city} */
export const getWeatherApi = async (city) => {
  const res = await axios.get(WEATHER_ENDPOINTS.BY_CITY(city));
  return res.data;
};