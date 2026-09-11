import { createSlice } from "@reduxjs/toolkit";

import {
  placeOrderThunk,
  fetchOrdersThunk,
  updateOrderStatusThunk,
  updateOrderShipmentThunk,
} from "../thunks/orderThunk";

const orderSlice = createSlice({
  name: "orders",

  initialState: {
    orders: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Defensive: only ever accept a real array here. If the backend
        // ever returns something else (an error body that slipped through
        // as 200, a wrapped/paginated response, etc.) this keeps the UI
        // from crashing on `.map` instead of silently corrupting state.
        state.orders = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to load orders";
      })

      .addCase(placeOrderThunk.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })

      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) state.orders[index] = action.payload;
      })

      .addCase(updateOrderShipmentThunk.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) state.orders[index] = action.payload;
      });
  },
});

export default orderSlice.reducer;
