import { createSlice } from "@reduxjs/toolkit";

import {
  fetchMyProductsThunk,
  addProductThunk,
  updateProductThunk,
  deleteProductThunk,
} from "../thunks/farmerThunk";

const farmerSlice = createSlice({
  name: "farmer",

  initialState: {
    products: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchMyProductsThunk.fulfilled, (state, action) => {
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(addProductThunk.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })

      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);

        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })

      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      });
  },
});

export default farmerSlice.reducer;
