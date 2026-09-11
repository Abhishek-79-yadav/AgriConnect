import { createSlice } from "@reduxjs/toolkit";

import {
  requestReturnThunk,
  fetchReturnsThunk,
  updateReturnStatusThunk,
} from "../thunks/returnThunk";

const returnSlice = createSlice({
  name: "returns",

  initialState: {
    returns: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchReturnsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchReturnsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.returns = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(fetchReturnsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to load returns";
      })

      .addCase(requestReturnThunk.fulfilled, (state, action) => {
        state.returns.unshift(action.payload);
      })

      .addCase(updateReturnStatusThunk.fulfilled, (state, action) => {
        const index = state.returns.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) state.returns[index] = action.payload;
      });
  },
});

export default returnSlice.reducer;
