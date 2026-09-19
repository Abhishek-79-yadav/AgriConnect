// ===============================
// Single source of truth for all backend routes.
// Base URL (VITE_API_URL) already includes "/api", so paths below
// start after that prefix. Verified directly against each
// @RequestMapping/@GetMapping/@PostMapping in the Spring Boot backend.
// ===============================

export const AUTH_ENDPOINTS = {
  REGISTER: "/auth/register",
  REGISTER_BRAND: "/auth/register-brand",
  REGISTER_ADMIN: "/auth/register-admin",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  PROFILE: "/auth/profile",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFICATION: "/auth/resend-verification",
  // NOTE: no /auth/verify-otp route exists on the backend yet.
  // resetPassword() takes the OTP directly (email + otp + newPassword).
};

export const USER_ENDPOINTS = {
  BY_ID: (id) => `/users/${id}`,
  UPDATE_PROFILE: "/users/profile",
  CHANGE_PASSWORD: "/users/change-password",
};

export const FARMER_ENDPOINTS = {
  PROFILE: "/farmer/profile",
  DASHBOARD: "/farmer/dashboard",
  PRODUCTS: "/farmer/products",
  PRODUCT_BY_ID: (id) => `/farmer/products/${id}`,
  DELETE_PRODUCT: (id) => `/farmer/products/${id}`,
  UPDATE_PRICE: (id) => `/farmer/products/${id}/price`,
  FARM_PROFILE: "/farmer/farm-profile",
};

export const BUYER_ENDPOINTS = {
  PRODUCTS: "/buyer/products",
};

export const CART_ENDPOINTS = {
  GET_CART: "/buyer/cart",
  ADD_TO_CART: "/buyer/cart",
  UPDATE_CART: "/buyer/cart",
  REMOVE_FROM_CART: (productId) => `/buyer/cart/${productId}`,
};

export const WISHLIST_ENDPOINTS = {
  GET: "/wishlist",
  ADD: (productId) => `/wishlist/${productId}`,
  REMOVE: (productId) => `/wishlist/${productId}`,
};

export const ORDER_ENDPOINTS = {
  CHECKOUT: "/orders/checkout",
  BUYER_ORDERS: "/orders/buyer",
  FARMER_ORDERS: "/orders/farmer",
  UPDATE_STATUS: (id) => `/orders/${id}/status`,
  UPDATE_SHIPMENT: (id) => `/orders/${id}/shipment`,
};

export const RETURN_ENDPOINTS = {
  CREATE: "/returns",
  BUYER_RETURNS: "/returns/buyer",
  FARMER_RETURNS: "/returns/farmer",
  ADMIN_RETURNS: "/returns/admin",
  UPDATE_STATUS: (id) => `/returns/${id}/status`,
};

export const PAYMENT_ENDPOINTS = {
  CREATE_ORDER: (orderId) => `/buyer/payment/create/${orderId}`,
  VERIFY_PAYMENT: (orderId) => `/buyer/payment/verify/${orderId}`,
  PHONEPE_INITIATE: (orderId) => `/buyer/payment/phonepe/initiate/${orderId}`,
  PHONEPE_CONFIRM: (merchantTransactionId) => `/buyer/payment/phonepe/confirm/${merchantTransactionId}`,
};

export const WALLET_ENDPOINTS = {
  GET: "/wallet",
  TRANSACTIONS: "/wallet/transactions",
};

export const REFUND_ENDPOINTS = {
  BUYER_REFUNDS: "/refunds/buyer",
  ADMIN_REFUNDS: "/refunds/admin",
};

export const EMI_ENDPOINTS = {
  CREATE_PLAN: (orderId) => `/emi/orders/${orderId}`,
  BUYER_PLANS: "/emi/buyer",
  PAY_INSTALLMENT: (installmentId) => `/emi/installments/${installmentId}/pay`,
};

export const COUPON_ENDPOINTS = {
  CREATE: "/coupon",
  APPLY: "/coupon/apply",
  VALIDATE: (code) => `/coupon/validate/${code}`,
};

export const CROP_ENDPOINTS = {
  ALL: "/crops",
  CREATE: "/crops",
  INFO: (cropId) => `/crop-info/${cropId}`,
  SUGGEST: "/crop/suggest",
  SMART_CROP: (city) => `/smart-crop/${encodeURIComponent(city)}`,
};

export const AI_ENDPOINTS = {
  RECOMMEND: "/ai/recommend",
};

export const SCHEME_ENDPOINTS = {
  ALL: "/schemes",
  ADD: "/schemes/admin",
  MANAGE_LIST: "/schemes/admin",
  UPDATE: (id) => `/schemes/admin/${id}`,
  REACTIVATE: (id) => `/schemes/admin/${id}/reactivate`,
  STATE: (state) => `/schemes/state/${encodeURIComponent(state)}`,
  DELETE: (id) => `/schemes/admin/${id}`,
};

export const NOTIFICATION_ENDPOINTS = {
  ALL: "/notifications",
  MARK_READ: (id) => `/notifications/${id}/read`,
};

export const RATING_ENDPOINTS = {
  RATE: "/buyer/rate",
  BY_FARMER: (farmerId) => `/farmer/${farmerId}/ratings`,
  FARMER_AVERAGE: (farmerId) => `/farmer/${farmerId}/rating-average`,
};

export const SEARCH_ENDPOINTS = {
  BY_NAME: "/search/name",
  BY_CATEGORY: "/search/category",
  BY_CITY: "/search/city",
  BY_STATE: "/search/state",
  BY_PRICE: "/search/price",
};

export const CROP_HISTORY_ENDPOINTS = {
  ALL: "/farmer/crop-history",
  ADD: "/farmer/crop-history",
  DELETE: (id) => `/farmer/crop-history/${id}`,
};

export const VIDEO_ENDPOINTS = {
  UPLOAD: "/videos/upload",
  BY_PRODUCT: (productId) => `/videos/product/${productId}`,
  BY_FARMER: (farmerId) => `/videos/farmer/${farmerId}`,
};

export const CLOUDINARY_ENDPOINTS = {
  UPLOAD_IMAGE: "/cloudinary/image",
  UPLOAD_VIDEO: "/cloudinary/video",
  DELETE: (publicId) => `/cloudinary/${publicId}`,
};

export const ADMIN_ENDPOINTS = {
  USERS: "/admin/users",
  PRODUCTS: "/admin/products",
  ORDERS: "/admin/orders",
  DELETE_USER: (id) => `/admin/user/${id}`,
  DELETE_PRODUCT: (id) => `/admin/product/${id}`,
  PAYOUTS: "/admin/payouts",
  MARK_PAID: (orderItemId) => `/admin/payouts/${orderItemId}/mark-paid`,
  PENDING_BRANDS: "/admin/brands/pending",
  APPROVE_BRAND: (id) => `/admin/brands/${id}/approve`,
  ADMINS: "/super-admin/admins",
  DELETE_ADMIN: (id) => `/super-admin/admins/${id}`,
  PENDING_ADMINS: "/super-admin/admins/pending",
  APPROVE_ADMIN: (id) => `/super-admin/admins/${id}/approve`,
  REJECT_ADMIN: (id) => `/super-admin/admins/${id}/reject`,
  SUSPEND_USER: (id) => `/admin/users/${id}/suspend`,
  UNSUSPEND_USER: (id) => `/admin/users/${id}/unsuspend`,
  SUSPENDED_USERS: "/admin/users/suspended",
  PENDING_PRODUCTS: "/admin/products/pending",
  APPROVE_PRODUCT: (id) => `/admin/products/${id}/approve`,
  PENDING_AGRI_INPUTS: "/admin/agri-inputs/pending",
  APPROVE_AGRI_INPUT: (id) => `/admin/agri-inputs/${id}/approve`,
  RISK_FLAGS: "/admin/risk-flags",
  AUDIT_LOGS: "/admin/audit-logs",
  DISPUTES: "/admin/disputes",
  RESOLVE_DISPUTE: (id) => `/admin/disputes/${id}/resolve`,
  SUPPORT_TICKETS: "/admin/support/tickets",
  RESOLVE_SUPPORT_TICKET: (id) => `/admin/support/tickets/${id}/resolve`,
};

export const BUYER_DISPUTE_ENDPOINTS = {
  FILE: "/buyer/disputes",
  MINE: "/buyer/disputes",
};

export const WEATHER_ENDPOINTS = {
  BY_CITY: (city) => `/weather/${encodeURIComponent(city)}`,
};

export const PLAN_ENDPOINTS = {
  LIST: "/plans",
};

export const SUBSCRIPTION_ENDPOINTS = {
  SUBSCRIBE: (planId) => `/subscriptions/subscribe/${planId}`,
  MINE: "/subscriptions/me",
};

export const AGRI_INPUT_ENDPOINTS = {
  BRAND_LIST: "/brand/agri-inputs",
  BRAND_CREATE: "/brand/agri-inputs",
  BRAND_DELETE: (id) => `/brand/agri-inputs/${id}`,
  BUYER_BROWSE: "/buyer/agri-inputs",
  FARMER_ADS: "/farmer/agri-input-ads",
};

export const HEALTH_ENDPOINT = "/health";

export const REVIEW_ENDPOINTS = {
  CREATE: "/reviews",
  UPDATE: (id) => `/reviews/${id}`,
  DELETE: (id) => `/reviews/${id}`,
  REPLY: (id) => `/reviews/${id}/reply`,
  FOR_PRODUCT: (productId) => `/reviews/product/${productId}`,
  MINE: "/reviews/buyer",
  REVIEWABLE: "/reviews/buyer/reviewable",
  FOR_FARMER: "/reviews/farmer",
};

export const SUPPORT_ENDPOINTS = {
  CREATE_TICKET: "/support/tickets",
  MY_TICKETS: "/support/tickets/mine",
};

export const ACCOUNT_ENDPOINTS = {
  DEACTIVATE: "/users/deactivate",
  DELETE: "/users/account",
};

export const CAMPAIGN_ENDPOINTS = {
  LIVE: "/campaigns/live",
  IMPRESSION: (id) => `/campaigns/${id}/impression`,
  CLICK: (id) => `/campaigns/${id}/click`,
  ADMIN_LIST: "/admin/campaigns",
  ADMIN_CREATE: "/admin/campaigns",
  ADMIN_UPDATE: (id) => `/admin/campaigns/${id}`,
  ADMIN_SET_STATUS: (id) => `/admin/campaigns/${id}/status`,
  ADMIN_DELETE: (id) => `/admin/campaigns/${id}`,
};

export const WAREHOUSE_LICENSE_ENDPOINTS = {
  APPLY: "/warehouse-licenses",
  MINE: "/warehouse-licenses/mine",
  ALL: "/warehouse-licenses",
  APPROVE: (id) => `/warehouse-licenses/${id}/approve`,
  REJECT: (id) => `/warehouse-licenses/${id}/reject`,
  CANCEL: (id) => `/warehouse-licenses/${id}/cancel`,
  SUSPEND: (id) => `/warehouse-licenses/${id}/suspend`,
  RESUME: (id) => `/warehouse-licenses/${id}/resume`,
  RENEW: (id) => `/warehouse-licenses/${id}/renew`,
};

export const TAX_RECORD_ENDPOINTS = {
  CREATE: "/tax-records",
  ALL: "/tax-records",
  MINE: "/tax-records/mine",
  UPDATE_STATUS: (id) => `/tax-records/${id}/status`,
};

export const GOVERNMENT_OFFICIAL_ENDPOINTS = {
  LIST: "/super-admin/government-officials",
  CREATE: "/super-admin/government-officials",
  DELETE: (id) => `/super-admin/government-officials/${id}`,
};

export const DEPARTMENT_ENDPOINTS = {
  ACTIVE: "/departments/active",
  ALL: "/government/departments",
  CREATE: "/government/departments",
  UPDATE: (id) => `/government/departments/${id}`,
  SET_STATUS: (id) => `/government/departments/${id}/status`,
};

export const NOTICE_ENDPOINTS = {
  ACTIVE: "/notices/active",
  ALL: "/government/notices",
  CREATE: "/government/notices",
  SET_STATUS: (id) => `/government/notices/${id}/status`,
};

export const TAX_CONFIG_ENDPOINTS = {
  ACTIVE: "/tax-config/active",
  ALL: "/government/tax-config",
  CREATE: "/government/tax-config",
  UPDATE: (id) => `/government/tax-config/${id}`,
  SET_STATUS: (id) => `/government/tax-config/${id}/status`,
};

export const SCHEME_APPLICATION_ENDPOINTS = {
  APPLY: "/scheme-applications",
  MINE: "/scheme-applications/mine",
  ALL: "/scheme-applications",
  VERIFY_DOCUMENTS: (id) => `/scheme-applications/${id}/verify-documents`,
  DECISION: (id) => `/scheme-applications/${id}/decision`,
};

export const GOVERNMENT_REPORT_ENDPOINTS = {
  SUMMARY: "/government/reports/summary",
  AUDIT_LOGS: "/government/audit-logs",
};