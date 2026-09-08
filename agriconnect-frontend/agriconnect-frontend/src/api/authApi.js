import axiosInstance from "./axios";
import { AUTH_ENDPOINTS } from "./endpoints";

/** Login User — POST /api/auth/login */
export const login = async (credentials) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, credentials);
  return response.data;
};

/** Register User — POST /api/auth/register */
export const register = async (userData) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, userData);
  return response.data;
};

/** Register a company (BRAND) — POST /api/auth/register-brand. Doesn't log
 * the user in — the account is pending admin approval. Returns a plain
 * string message, not an AuthResponse. */
export const registerBrand = async (data) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER_BRAND, data);
  return response.data;
};

export const registerAdmin = async (data) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER_ADMIN, data);
  return response.data;
};

/** Logout User — POST /api/auth/logout */
export const logout = async (refreshToken) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT, { refreshToken });
  return response.data;
};

/** Refresh Access Token — POST /api/auth/refresh */
export const refreshToken = async (refreshTokenValue) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.REFRESH, {
    refreshToken: refreshTokenValue,
  });
  return response.data;
};

/** Get Logged In User Profile — GET /api/auth/profile */
export const getProfile = async () => {
  const response = await axiosInstance.get(AUTH_ENDPOINTS.PROFILE);
  return response.data;
};

/** Forgot Password — POST /api/auth/forgot-password */
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  return response.data;
};

/**
 * Reset Password — POST /api/auth/reset-password
 * Backend expects { email, otp, newPassword } together, in one call
 * (there is no separate verify-otp step on the server).
 */
export const resetPassword = async ({ email, otp, newPassword }) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
    email,
    otp,
    newPassword,
  });
  return response.data;
};

/** GET /api/auth/verify-email?token=... — public */
export const verifyEmail = async (token) => {
  const response = await axiosInstance.get(AUTH_ENDPOINTS.VERIFY_EMAIL, { params: { token } });
  return response.data;
};

/** POST /api/auth/resend-verification — authenticated */
export const resendVerification = async () => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.RESEND_VERIFICATION);
  return response.data;
};