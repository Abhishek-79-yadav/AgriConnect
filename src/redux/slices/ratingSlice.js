import { createSlice } from "@reduxjs/toolkit";

import {
  submitRatingThunk,
  fetchFarmerRatingsThunk,
  fetchFarmerRatingAverageThunk,
} from "../thunks/ratingThunk";

const ratingSlice = createSlice({
  name: "rating",

  initialState: {
    ratings: [],
    averageRating: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchFarmerRatingsThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchFarmerRatingsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.ratings = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(fetchFarmerRatingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchFarmerRatingAverageThunk.fulfilled, (state, action) => {
        state.averageRating = action.payload.averageRating;
      })

      .addCase(submitRatingThunk.fulfilled, (state, action) => {
        state.ratings.push(action.payload);
      });
  },
});

export default ratingSlice.reducer;
