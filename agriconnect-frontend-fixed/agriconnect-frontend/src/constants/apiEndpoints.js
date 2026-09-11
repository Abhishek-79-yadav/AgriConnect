const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN:
      "/auth/refresh-token",
    FORGOT_PASSWORD:
      "/auth/forgot-password",
    RESET_PASSWORD:
      "/auth/reset-password",
    VERIFY_OTP:
      "/auth/verify-otp",
  },

  USER: {
    PROFILE:
      "/users/profile",
    UPDATE_PROFILE:
      "/users/profile",
    CHANGE_PASSWORD:
      "/users/change-password",
  },

  PRODUCT: {
    GET_ALL:
      "/products",
    GET_BY_ID:
      "/products",
    CREATE:
      "/products",
    UPDATE:
      "/products",
    DELETE:
      "/products",
  },

  CART: {
    GET:
      "/cart",
    ADD:
      "/cart/add",
    UPDATE:
      "/cart/update",
    REMOVE:
      "/cart/remove",
  },

  WISHLIST: {
    GET:
      "/wishlist",
    ADD:
      "/wishlist/add",
    REMOVE:
      "/wishlist/remove",
  },

  ORDER: {
    GET_ALL:
      "/orders",
    CREATE:
      "/orders",
    DETAILS:
      "/orders",
  },

  PAYMENT: {
    CREATE:
      "/payment/create",
    VERIFY:
      "/payment/verify",
  },

  WEATHER: {
    CURRENT:
      "/weather/current",
    FORECAST:
      "/weather/forecast",
  },

  CROP: {
    RECOMMEND:
      "/crop/recommend",
  },

  AI: {
    ASK:
      "/ai/recommend",
  },

  NOTIFICATION: {
    GET:
      "/notifications",
    READ:
      "/notifications/read",
  },

  COUPON: {
    GET:
      "/coupons",
    APPLY:
      "/coupons/apply",
  },

  SCHEME: {
    GET:
      "/schemes",
  },

  RATING: {
    GET:
      "/ratings",
    CREATE:
      "/ratings",
  },

  SEARCH: {
    GLOBAL:
      "/search",
  },

  UPLOAD: {
    FILE:
      "/upload",
  },

  DASHBOARD: {
    BUYER:
      "/dashboard/buyer",
    FARMER:
      "/dashboard/farmer",
    ADMIN:
      "/dashboard/admin",
  },
};

export default API_ENDPOINTS;