import axios from "./axios";
import { FARMER_ENDPOINTS } from "./endpoints";

/** GET /api/farmer/dashboard — the only dashboard route the backend exposes. */
export const getFarmerDashboardApi = async () => {
  const res = await axios.get(FARMER_ENDPOINTS.DASHBOARD);
  return res.data;
};

// NOTE: there is no buyer, admin, revenue, or analytics dashboard route
// on the backend yet — only the farmer dashboard exists
// (DashboardController maps just GET /api/farmer/dashboard).