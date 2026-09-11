import { createAsyncThunk } from "@reduxjs/toolkit";
import { createEmiPlanApi, getBuyerEmiPlansApi, payEmiInstallmentApi } from "../../api/emiApi";

export const createEmiPlanThunk = createAsyncThunk(
  "emi/createPlan",
  async ({ orderId, numberOfInstallments }, { rejectWithValue }) => {
    try {
      return await createEmiPlanApi(orderId, numberOfInstallments);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchEmiPlansThunk = createAsyncThunk("emi/fetchPlans", async () => {
  return await getBuyerEmiPlansApi();
});

export const payEmiInstallmentThunk = createAsyncThunk(
  "emi/payInstallment",
  async (installmentId, { rejectWithValue }) => {
    try {
      return await payEmiInstallmentApi(installmentId);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
