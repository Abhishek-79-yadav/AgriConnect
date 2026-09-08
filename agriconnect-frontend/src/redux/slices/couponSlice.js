import { createSlice } from "@reduxjs/toolkit";

import {
  fetchCouponsThunk,
  applyCouponThunk,
  createCouponThunk,
} from "../thunks/couponThunk";

const couponSlice = createSlice({
  name: "coupon",

  initialState: {
    coupons: [],
    appliedCoupon: null,
    discount: 0,
    loading: false,
    error: null,
  },

  reducers: {
    clearCoupon: (state) => {
      state.appliedCoupon = null;
      state.discount = 0;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchCouponsThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCouponsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(applyCouponThunk.fulfilled, (state, action) => {
        state.appliedCoupon = action.payload.code;
        state.discount = action.payload.discount || 0;
      })

      .addCase(applyCouponThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Backend has no "list all coupons" route, so there's nowhere to
      // re-fetch from after creating one — append it locally instead so
      // it shows up immediately in the admin list.
      .addCase(createCouponThunk.fulfilled, (state, action) => {
        state.coupons.push(action.payload);
      })

      .addCase(createCouponThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCoupon } = couponSlice.actions;

export default couponSlice.reducer;
