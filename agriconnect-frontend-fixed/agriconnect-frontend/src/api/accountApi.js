import axios from "./axios";
import { ACCOUNT_ENDPOINTS } from "./endpoints";

export const deactivateAccountApi = async () => {
  await axios.put(ACCOUNT_ENDPOINTS.DEACTIVATE);
};

export const deleteAccountApi = async (password) => {
  await axios.delete(ACCOUNT_ENDPOINTS.DELETE, { data: { password } });
};
