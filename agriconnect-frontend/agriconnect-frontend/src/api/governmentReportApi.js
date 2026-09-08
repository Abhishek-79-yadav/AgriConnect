import axios from "./axios";
import { GOVERNMENT_REPORT_ENDPOINTS } from "./endpoints";

export const getGovernmentReportSummaryApi = async () => {
  const res = await axios.get(GOVERNMENT_REPORT_ENDPOINTS.SUMMARY);
  return res.data;
};

export const getGovernmentAuditLogsApi = async () => {
  const res = await axios.get(GOVERNMENT_REPORT_ENDPOINTS.AUDIT_LOGS);
  return res.data;
};
