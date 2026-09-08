import axios from "./axios";
import { NOTIFICATION_ENDPOINTS } from "./endpoints";

/** GET /api/notifications */
export const getNotificationsApi = async () => {
  const res = await axios.get(NOTIFICATION_ENDPOINTS.ALL);
  return res.data;
};

/** PUT /api/notifications/{id}/read */
export const markNotificationReadApi = async (id) => {
  await axios.put(NOTIFICATION_ENDPOINTS.MARK_READ(id));
};
