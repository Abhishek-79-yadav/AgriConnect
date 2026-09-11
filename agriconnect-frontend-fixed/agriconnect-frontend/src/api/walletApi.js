import axios from "./axios";
import { WALLET_ENDPOINTS } from "./endpoints";

/** GET /api/wallet */
export const getWalletApi = async () => {
  const res = await axios.get(WALLET_ENDPOINTS.GET);
  return res.data;
};

/** GET /api/wallet/transactions */
export const getWalletTransactionsApi = async () => {
  const res = await axios.get(WALLET_ENDPOINTS.TRANSACTIONS);
  return res.data;
};
