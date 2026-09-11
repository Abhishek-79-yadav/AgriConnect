import { createSlice } from "@reduxjs/toolkit";

import { searchThunk } from "../thunks/searchThunk";

const searchSlice = createSlice({
  name: "search",

  initialState: {
    results: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearResults: (state) => {
      state.results = [];
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(searchThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(searchThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.results = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(searchThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearResults } = searchSlice.actions;

export default searchSlice.reducer;
