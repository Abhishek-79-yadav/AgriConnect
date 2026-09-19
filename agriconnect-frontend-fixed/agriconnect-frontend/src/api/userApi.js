import axios from "./axios";
import { USER_ENDPOINTS } from "./endpoints";

/** GET /api/users/{id} */
export const getUserById = async (id) => {
  const res = await axios.get(USER_ENDPOINTS.BY_ID(id));
  return res.data;
};

/**
 * PUT /api/users/profile
 * Backend's UpdateProfileRequest only accepts: name, mobile, address,
 * city, state — email is not editable through this endpoint.
 */
export const updateProfileApi = async ({ name, mobile, address, city, state }) => {
  const res = await axios.put(USER_ENDPOINTS.UPDATE_PROFILE, {
    name,
    mobile,
    address,
    city,
    state,
  });
  return res.data;
};

/**
 * PUT /api/users/change-password
 * Backend's ChangePasswordRequest expects { currentPassword, newPassword }
 * and requires newPassword to be at least 8 characters.
 */
export const changePasswordApi = async ({ currentPassword, newPassword }) => {
  await axios.put(USER_ENDPOINTS.CHANGE_PASSWORD, {
    currentPassword,
    newPassword,
  });
};
