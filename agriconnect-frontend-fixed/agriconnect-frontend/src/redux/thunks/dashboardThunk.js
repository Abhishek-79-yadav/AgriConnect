import { createAsyncThunk } from "@reduxjs/toolkit";

import { getFarmerDashboardApi } from "../../api/dashboardApi";

export const farmerDashboardThunk = createAsyncThunk("dashboard/farmer", async () => {
  return await getFarmerDashboardApi();
});

// NOTE: the backend's DashboardController only exposes GET /api/farmer/dashboard.
// There is no buyer/admin dashboard, revenue, or analytics route yet, so these
// reject immediately with a clear message instead of calling a route that
// doesn't exist.
const notImplemented = (message) =>
  createAsyncThunk(message.action, async (_, { rejectWithValue }) =>
    rejectWithValue(message.text)
  );

export const buyerDashboardThunk = notImplemented({
  action: "dashboard/buyer",
  text: "Buyer dashboard endpoint is not available on the backend yet.",
});

export const adminDashboardThunk = notImplemented({
  action: "dashboard/admin",
  text: "Admin dashboard endpoint is not available on the backend yet.",
});

export const revenueDashboardThunk = notImplemented({
  action: "dashboard/revenue",
  text: "Revenue dashboard endpoint is not available on the backend yet.",
});

export const analyticsDashboardThunk = notImplemented({
  action: "dashboard/analytics",
  text: "Analytics dashboard endpoint is not available on the backend yet.",
});