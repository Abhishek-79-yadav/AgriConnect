import { createSlice } from "@reduxjs/toolkit";

import {
  fetchWishlistThunk,
  addWishlistThunk,
  removeWishlistThunk,
} from "../thunks/wishlistThunk";

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState: {
    items: [],
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchWishlistThunk.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(addWishlistThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(removeWishlistThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;
