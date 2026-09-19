import { createSlice } from "@reduxjs/toolkit";

import {
  fetchMyCropHistoryThunk,
  addCropHistoryThunk,
  deleteCropHistoryThunk,
} from "../thunks/cropHistoryThunk";

const cropHistorySlice = createSlice({
  name: "cropHistory",

  initialState: {
    records: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyCropHistoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMyCropHistoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.records = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(fetchMyCropHistoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load records";
      })

      .addCase(addCropHistoryThunk.fulfilled, (state, action) => {
        state.records.unshift(action.payload);
      })

      .addCase(deleteCropHistoryThunk.fulfilled, (state, action) => {
        state.records = state.records.filter((r) => r.id !== action.payload);
      });
  },
});

export default cropHistorySlice.reducer;
