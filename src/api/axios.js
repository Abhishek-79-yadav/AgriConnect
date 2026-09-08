import axios from "axios";
import { storage } from "../utils/storage";

// Fail loud, not silent: without this, a missing VITE_API_URL makes every
// request go to axios's default baseURL (none) and fail with a confusing
// "Network Error" that gives no hint what's actually wrong.
if (!import.meta.env.VITE_API_URL) {
  // eslint-disable-next-line no-console
  console.error(
    "VITE_API_URL is not set — copy .env.example to .env and set it, " +
      "or every API call will fail. See .env.example for the expected format."
  );
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ------------------------------------------------------------------
// 401 handling: try a silent token refresh before giving up.
//
// Access tokens expire every hour (see backend jwt.access.expiration).
// Without this, every user gets force-logged-out once an hour. Instead:
//   1. On a 401, if we haven't already retried this request, attempt
//      POST /auth/refresh with the stored refresh token.
//   2. If multiple requests 401 around the same time (e.g. a page that
//      fires several API calls at once), only one refresh call is made —
//      the rest wait on the same in-flight promise.
//   3. If refresh succeeds, store the new tokens and retry the original
//      request once with the new access token.
//   4. If refresh fails (refresh token itself expired/revoked/missing),
//      THEN clear storage and send the user to /login — this is the
//      only case that should actually log someone out.
// ------------------------------------------------------------------

let refreshPromise = null;

function clearSessionAndRedirect() {
  storage.clear();

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

async function refreshAccessToken() {
  const refreshToken = storage.getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  // Plain axios call (not the `api` instance) so this request never
  // goes through these same interceptors and can't recurse.
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/refresh`,
    { refreshToken }
  );

  const data = response.data;

  storage.setToken(data.token);
  storage.setRefreshToken(data.refreshToken);
  storage.setUser({
    id: data.id,
    email: data.email,
    role: data.role,
  });

  return data.token;
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const { config, response } = error;

    if (!response || response.status !== 401 || config?._retry) {
      return Promise.reject(error);
    }

    // Don't try to refresh when the failed call *was* the refresh/login
    // call itself, or we'll loop.
    if (
      config.url?.includes("/auth/refresh") ||
      config.url?.includes("/auth/login")
    ) {
      clearSessionAndRedirect();
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;

      config.headers.Authorization = `Bearer ${newToken}`;
      return api(config);
    } catch (refreshError) {
      clearSessionAndRedirect();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
