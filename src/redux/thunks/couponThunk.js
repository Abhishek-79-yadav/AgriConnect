import { createAsyncThunk } from "@reduxjs/toolkit";

import { applyCouponApi, validateCouponApi, createCouponApi } from "../../api/couponApi";

export const createCouponThunk = createAsyncThunk(
  "coupon/create",
  async (data, { rejectWithValue }) => {
    try {
      return await createCouponApi(data);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// NOTE: backend has no "list all coupons" route — only create/apply/validate.
export const fetchCouponsThunk = createAsyncThunk(
  "coupon/fetch",
  async (_, { rejectWithValue }) => {
    return rejectWithValue("Listing all coupons is not supported by the backend yet.");
  }
);

export const applyCouponThunk = createAsyncThunk(
  "coupon/apply",
  async ({ code, amount }, { rejectWithValue }) => {
    try {
      return await applyCouponApi(code, amount);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const validateCouponThunk = createAsyncThunk(
  "coupon/validate",
  async (code, { rejectWithValue }) => {
    try {
      return await validateCouponApi(code);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);