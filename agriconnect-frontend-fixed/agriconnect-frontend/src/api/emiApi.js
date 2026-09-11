import axios from "./axios";
import { EMI_ENDPOINTS } from "./endpoints";

/** POST /api/emi/orders/{orderId} */
export const createEmiPlanApi = async (orderId, numberOfInstallments) => {
  const res = await axios.post(EMI_ENDPOINTS.CREATE_PLAN(orderId), { numberOfInstallments });
  return res.data;
};

/** GET /api/emi/buyer */
export const getBuyerEmiPlansApi = async () => {
  const res = await axios.get(EMI_ENDPOINTS.BUYER_PLANS);
  return res.data;
};

/** POST /api/emi/installments/{installmentId}/pay */
export const payEmiInstallmentApi = async (installmentId) => {
  const res = await axios.post(EMI_ENDPOINTS.PAY_INSTALLMENT(installmentId));
  return res.data;
};
