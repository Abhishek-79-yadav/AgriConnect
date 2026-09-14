import axios from "./axios";
import { WAREHOUSE_LICENSE_ENDPOINTS } from "./endpoints";

/** POST /api/warehouse-licenses — farmer applies */
export const applyForLicenseApi = async (data) => {
  const res = await axios.post(WAREHOUSE_LICENSE_ENDPOINTS.APPLY, data);
  return res.data;
};

/** GET /api/warehouse-licenses/mine — farmer's own applications */
export const getMyLicensesApi = async () => {
  const res = await axios.get(WAREHOUSE_LICENSE_ENDPOINTS.MINE);
  return res.data;
};

/** GET /api/warehouse-licenses — government/admin, every application */
export const getAllLicensesApi = async () => {
  const res = await axios.get(WAREHOUSE_LICENSE_ENDPOINTS.ALL);
  return res.data;
};

/** PUT /api/warehouse-licenses/{id}/approve?expiryDate=YYYY-MM-DD */
export const approveLicenseApi = async (id, expiryDate) => {
  const res = await axios.put(WAREHOUSE_LICENSE_ENDPOINTS.APPROVE(id), null, {
    params: expiryDate ? { expiryDate } : {},
  });
  return res.data;
};

/** PUT /api/warehouse-licenses/{id}/reject?remarks=... */
export const rejectLicenseApi = async (id, remarks) => {
  const res = await axios.put(WAREHOUSE_LICENSE_ENDPOINTS.REJECT(id), null, {
    params: remarks ? { remarks } : {},
  });
  return res.data;
};

/** PUT /api/warehouse-licenses/{id}/cancel?remarks=... — check & cancel a license */
export const cancelLicenseApi = async (id, remarks) => {
  const res = await axios.put(WAREHOUSE_LICENSE_ENDPOINTS.CANCEL(id), null, {
    params: remarks ? { remarks } : {},
  });
  return res.data;
};

/** PUT /api/warehouse-licenses/{id}/suspend?remarks=... */
export const suspendLicenseApi = async (id, remarks) => {
  const res = await axios.put(WAREHOUSE_LICENSE_ENDPOINTS.SUSPEND(id), null, {
    params: remarks ? { remarks } : {},
  });
  return res.data;
};

/** PUT /api/warehouse-licenses/{id}/resume */
export const resumeLicenseApi = async (id) => {
  const res = await axios.put(WAREHOUSE_LICENSE_ENDPOINTS.RESUME(id));
  return res.data;
};

/** PUT /api/warehouse-licenses/{id}/renew?newExpiryDate=YYYY-MM-DD */
export const renewLicenseApi = async (id, newExpiryDate) => {
  const res = await axios.put(WAREHOUSE_LICENSE_ENDPOINTS.RENEW(id), null, {
    params: { newExpiryDate },
  });
  return res.data;
};
