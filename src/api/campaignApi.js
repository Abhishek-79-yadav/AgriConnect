import axios from "./axios";
import { CAMPAIGN_ENDPOINTS } from "./endpoints";

/** GET /api/campaigns/live?role=ALL|BUYER|FARMER — public */
export const getLiveCampaignsApi = async (role = "ALL") => {
  const res = await axios.get(CAMPAIGN_ENDPOINTS.LIVE, { params: { role } });
  return res.data;
};

/** Fire-and-forget tracking calls — never let a tracking failure disrupt the page. */
export const recordCampaignImpressionApi = async (id) => {
  try {
    await axios.post(CAMPAIGN_ENDPOINTS.IMPRESSION(id));
  } catch {
    // ignored — tracking is best-effort
  }
};

export const recordCampaignClickApi = async (id) => {
  try {
    await axios.post(CAMPAIGN_ENDPOINTS.CLICK(id));
  } catch {
    // ignored — tracking is best-effort
  }
};

// ---------------- Admin ----------------

export const getAllCampaignsApi = async () => {
  const res = await axios.get(CAMPAIGN_ENDPOINTS.ADMIN_LIST);
  return res.data;
};

export const createCampaignApi = async (data) => {
  const res = await axios.post(CAMPAIGN_ENDPOINTS.ADMIN_CREATE, data);
  return res.data;
};

export const updateCampaignApi = async (id, data) => {
  const res = await axios.put(CAMPAIGN_ENDPOINTS.ADMIN_UPDATE(id), data);
  return res.data;
};

export const setCampaignStatusApi = async (id, status) => {
  const res = await axios.put(CAMPAIGN_ENDPOINTS.ADMIN_SET_STATUS(id), null, { params: { status } });
  return res.data;
};

export const deleteCampaignApi = async (id) => {
  await axios.delete(CAMPAIGN_ENDPOINTS.ADMIN_DELETE(id));
};
