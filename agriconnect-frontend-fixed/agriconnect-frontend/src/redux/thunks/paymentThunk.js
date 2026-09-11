import { createAsyncThunk } from "@reduxjs/toolkit";

import { createPaymentApi, verifyPaymentApi } from "../../api/paymentApi";

/** payload: orderId */
export const createPaymentThunk = createAsyncThunk(
  "payment/create",
  async (orderId, { rejectWithValue }) => {
    try {
      return await createPaymentApi(orderId);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

/** payload: { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } */
export const verifyPaymentThunk = createAsyncThunk(
  "payment/verify",
  async ({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }, { rejectWithValue }) => {
    try {
      return await verifyPaymentApi(orderId, { razorpayOrderId, razorpayPaymentId, razorpaySignature });
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
