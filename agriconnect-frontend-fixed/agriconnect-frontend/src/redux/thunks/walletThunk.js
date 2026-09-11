import { createAsyncThunk } from "@reduxjs/toolkit";
import { getWalletApi, getWalletTransactionsApi } from "../../api/walletApi";

export const fetchWalletThunk = createAsyncThunk("wallet/fetch", async () => {
  return await getWalletApi();
});

export const fetchWalletTransactionsThunk = createAsyncThunk(
  "wallet/fetchTransactions",
  async () => {
    return await getWalletTransactionsApi();
  }
);
