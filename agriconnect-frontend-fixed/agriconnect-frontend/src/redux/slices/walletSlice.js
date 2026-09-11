import { createSlice } from "@reduxjs/toolkit";
import { fetchWalletThunk, fetchWalletTransactionsThunk } from "../thunks/walletThunk";

const walletSlice = createSlice({
  name: "wallet",

  initialState: {
    balance: 0,
    transactions: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWalletThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload?.balance ?? 0;
      })
      .addCase(fetchWalletThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchWalletTransactionsThunk.fulfilled, (state, action) => {
        state.transactions = Array.isArray(action.payload) ? action.payload : [];
      });
  },
});

export default walletSlice.reducer;
