import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = jwtDecode(token);
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const getRole = (token) => {
  if (!token) return null;

  try {
    return jwtDecode(token).role;
  } catch {
    return null;
  }
};
