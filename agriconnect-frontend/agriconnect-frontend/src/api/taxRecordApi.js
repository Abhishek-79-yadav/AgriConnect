import axios from "./axios";
import { TAX_RECORD_ENDPOINTS } from "./endpoints";

/** POST /api/tax-records — government creates a record against a farmer/brand */
export const createTaxRecordApi = async (data) => {
  const res = await axios.post(TAX_RECORD_ENDPOINTS.CREATE, data);
  return res.data;
};

/** GET /api/tax-records — government, every record */
export const getAllTaxRecordsApi = async () => {
  const res = await axios.get(TAX_RECORD_ENDPOINTS.ALL);
  return res.data;
};

/** GET /api/tax-records/mine — farmer/brand, their own records */
export const getMyTaxRecordsApi = async () => {
  const res = await axios.get(TAX_RECORD_ENDPOINTS.MINE);
  return res.data;
};

/** PUT /api/tax-records/{id}/status?status=PAID&remarks=... */
export const updateTaxRecordStatusApi = async (id, status, remarks) => {
  const res = await axios.put(TAX_RECORD_ENDPOINTS.UPDATE_STATUS(id), null, {
    params: remarks ? { status, remarks } : { status },
  });
  return res.data;
};
