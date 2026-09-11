import axios from "./axios";
import { SUPPORT_ENDPOINTS } from "./endpoints";

export const createSupportTicketApi = async (data) => {
  const res = await axios.post(SUPPORT_ENDPOINTS.CREATE_TICKET, data);
  return res.data;
};

export const getMySupportTicketsApi = async () => {
  const res = await axios.get(SUPPORT_ENDPOINTS.MY_TICKETS);
  return res.data;
};
