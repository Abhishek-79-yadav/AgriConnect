import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  submitRatingApi,
  getFarmerRatingsApi,
  getFarmerRatingAverageApi,
} from "../../api/ratingApi";

export const submitRatingThunk = createAsyncThunk(
  "rating/submit",
  async (data, { rejectWithValue }) => {
    try {
      return await submitRatingApi(data);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Ratings are scoped to a farmer (GET /api/farmer/{farmerId}/ratings),
// not a global list — callers must pass the farmerId whose ratings
// they want to view (e.g. a farmer's public profile / product page).
export const fetchFarmerRatingsThunk = createAsyncThunk(
  "rating/fetchByFarmer",
  async (farmerId, { rejectWithValue }) => {
    try {
      return await getFarmerRatingsApi(farmerId);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchFarmerRatingAverageThunk = createAsyncThunk(
  "rating/fetchAverage",
  async (farmerId, { rejectWithValue }) => {
    try {
      return await getFarmerRatingAverageApi(farmerId);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
