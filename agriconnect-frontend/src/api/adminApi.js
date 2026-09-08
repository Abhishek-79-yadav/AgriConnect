import axios from "./axios";
import { ADMIN_ENDPOINTS } from "./endpoints";

export const getUsersApi = async () => {
  const res = await axios.get(ADMIN_ENDPOINTS.USERS);
  return res.data;
};

export const getAdminProductsApi = async () => {
  const res = await axios.get(ADMIN_ENDPOINTS.PRODUCTS);
  return res.data;
};

export const deleteUserApi = async (id) => {
  const res = await axios.delete(ADMIN_ENDPOINTS.DELETE_USER(id));
  return res.data;
};

export const deleteAdminProductApi = async (id) => {
  const res = await axios.delete(ADMIN_ENDPOINTS.DELETE_PRODUCT(id));
  return res.data;
};

export const getAdminOrdersApi = async () => {
  const res = await axios.get(ADMIN_ENDPOINTS.ORDERS);
  return res.data;
};

export const getPayoutsApi = async () => {
  const res = await axios.get(ADMIN_ENDPOINTS.PAYOUTS);
  return res.data;
};

export const markPayoutPaidApi = async (orderItemId) => {
  const res = await axios.put(ADMIN_ENDPOINTS.MARK_PAID(orderItemId));
  return res.data;
};

export const getPendingBrandsApi = async () => {
  const res = await axios.get(ADMIN_ENDPOINTS.PENDING_BRANDS);
  return res.data;
};

export const approveBrandApi = async (id) => {
  const res = await axios.put(ADMIN_ENDPOINTS.APPROVE_BRAND(id));
  return res.data;
};

export const getAdminsApi = async () => {
  const res = await axios.get(ADMIN_ENDPOINTS.ADMINS);
  return res.data;
};

export const createAdminApi = async (data) => {
  const res = await axios.post(ADMIN_ENDPOINTS.ADMINS, data);
  return res.data;
};

export const deleteAdminApi = async (id) => {
  const res = await axios.delete(ADMIN_ENDPOINTS.DELETE_ADMIN(id));
  return res.data;
};

export const getPendingAdminsApi = async () => {
  const res = await axios.get(ADMIN_ENDPOINTS.PENDING_ADMINS);
  return res.data;
};

export const approveAdminApi = async (id) => {
  const res = await axios.put(ADMIN_ENDPOINTS.APPROVE_ADMIN(id));
  return res.data;
};

export const rejectAdminApi = async (id) => {
  const res = await axios.put(ADMIN_ENDPOINTS.REJECT_ADMIN(id));
  return res.data;
};

export const suspendUserApi = async (id, reason) => {
  const res = await axios.put(ADMIN_ENDPOINTS.SUSPEND_USER(id), null, { params: { reason } });
  return res.data;
};

export const unsuspendUserApi = async (id) => {
  const res = await axios.put(ADMIN_ENDPOINTS.UNSUSPEND_USER(id));
  return res.data;
};

export const getSuspendedUsersApi = async () => {
  const res = await axios.get(ADMIN_ENDPOINTS.SUSPENDED_USERS);
  return res.data;
};

export const getPendingProductsApi = async () => {
  const res = await axios.get(ADMIN_ENDPOINTS.PENDING_PRODUCTS);
  return res.data;
};

export const approveProductApi = async (id) => {
  const res = await axios.put(ADMIN_ENDPOINTS.APPROVE_PRODUCT(id));
  return res.data;
};

export const getPendingAgriInputsApi = async () => {
  const res = await axios.get(ADMIN_ENDPOINTS.PENDING_AGRI_INPUTS);
  return res.data;
};

export const approveAgriInputApi = async (id) => {
  const res = await axios.put(ADMIN_ENDPOINTS.APPROVE_AGRI_INPUT(id));
  return res.data;
};

export const getRiskFlagsApi = async () => {
  const res = await axios.get(ADMIN_ENDPOINTS.RISK_FLAGS);
  return res.data;
};

export const getAuditLogsApi = async () => {
  const res = await axios.get(ADMIN_ENDPOINTS.AUDIT_LOGS);
  return res.data;
};

export const getAllDisputesApi = async () => {
  const res = await axios.get(ADMIN_ENDPOINTS.DISPUTES);
  return res.data;
};

export const resolveDisputeApi = async (id, status, response) => {
  const res = await axios.put(ADMIN_ENDPOINTS.RESOLVE_DISPUTE(id), null, { params: { status, response } });
  return res.data;
};

export const getSupportTicketsApi = async () => {
  const res = await axios.get(ADMIN_ENDPOINTS.SUPPORT_TICKETS);
  return res.data;
};

export const resolveSupportTicketApi = async (id, response) => {
  const res = await axios.put(ADMIN_ENDPOINTS.RESOLVE_SUPPORT_TICKET(id), null, { params: { response } });
  return res.data;
};