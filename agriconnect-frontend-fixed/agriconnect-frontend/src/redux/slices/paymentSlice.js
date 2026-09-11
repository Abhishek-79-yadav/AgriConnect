import { createSlice } from "@reduxjs/toolkit";

import {
  createPaymentThunk,
  verifyPaymentThunk,
} from "../thunks/paymentThunk";

const paymentSlice = createSlice({
  name: "payment",

  initialState: {
    payment: null,
    verified: false,
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(
        createPaymentThunk.fulfilled,
        (state, action) => {
          state.payment =
            action.payload;
        }
      )

      .addCase(
        verifyPaymentThunk.fulfilled,
        (state) => {
          state.verified = true;
        }
      );
  },
});

export default paymentSlice.reducer;