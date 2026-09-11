import { createSlice } from "@reduxjs/toolkit";

import {
  fetchUsersThunk,
  fetchAdminProductsThunk,
  fetchAdminOrdersThunk,
  deleteUserThunk,
} from "../thunks/adminThunk";

const asArray = (payload) => (Array.isArray(payload) ? payload : []);

const adminSlice = createSlice({
  name: "admin",

  initialState: {
    users: [],
    products: [],
    orders: [],
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.users = asArray(action.payload);
      })

      .addCase(fetchAdminProductsThunk.fulfilled, (state, action) => {
        state.products = asArray(action.payload);
      })

      .addCase(fetchAdminOrdersThunk.fulfilled, (state, action) => {
        state.orders = asArray(action.payload);
      })

      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export default adminSlice.reducer;
