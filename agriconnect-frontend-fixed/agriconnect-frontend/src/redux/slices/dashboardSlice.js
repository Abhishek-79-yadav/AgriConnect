import { createSlice } from "@reduxjs/toolkit";

import {
  buyerDashboardThunk,
  farmerDashboardThunk,
  adminDashboardThunk,
  revenueDashboardThunk,
  analyticsDashboardThunk,
} from "../thunks/dashboardThunk";

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState: {
    buyer: null,
    farmer: null,
    admin: null,
    revenue: [],
    analytics: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(
        buyerDashboardThunk.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        buyerDashboardThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.buyer = action.payload;
        }
      )

      .addCase(
        farmerDashboardThunk.fulfilled,
        (state, action) => {
          state.farmer = action.payload;
        }
      )

      .addCase(
        adminDashboardThunk.fulfilled,
        (state, action) => {
          state.admin = action.payload;
        }
      )

      .addCase(
        revenueDashboardThunk.fulfilled,
        (state, action) => {
          state.revenue = action.payload;
        }
      )

      .addCase(
        analyticsDashboardThunk.fulfilled,
        (state, action) => {
          state.analytics = action.payload;
        }
      );
  },
});

export default dashboardSlice.reducer;