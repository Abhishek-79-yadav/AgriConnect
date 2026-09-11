import { createSlice } from "@reduxjs/toolkit";

import { fetchSchemesThunk } from "../thunks/schemeThunk";

const schemeSlice = createSlice({
  name: "scheme",

  initialState: {
    schemes: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchSchemesThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchSchemesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.schemes = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(fetchSchemesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default schemeSlice.reducer;
