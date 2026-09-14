import { createAsyncThunk } from "@reduxjs/toolkit";

import { placeOrderApi, getBuyerOrdersApi, getFarmerOrdersApi, updateOrderStatusApi, updateOrderShipmentApi } from "../../api/orderApi";

export const placeOrderThunk = createAsyncThunk("orders/place", async (data, { rejectWithValue }) => {
  try {
    return await placeOrderApi(data);
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

/** Pass "farmer" to get the farmer's orders; defaults to the buyer's orders. */
export const fetchOrdersThunk = createAsyncThunk(
  "orders/fetch",
  async (role = "buyer") => {
    return role === "farmer" ? await getFarmerOrdersApi() : await getBuyerOrdersApi();
  }
);

export const updateOrderStatusThunk = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await updateOrderStatusApi(id, status);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

/** Farmer sets/updates carrier + tracking number + expected delivery date. */
export const updateOrderShipmentThunk = createAsyncThunk(
  "orders/updateShipment",
  async ({ id, shipmentData }, { rejectWithValue }) => {
    try {
      return await updateOrderShipmentApi(id, shipmentData);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);