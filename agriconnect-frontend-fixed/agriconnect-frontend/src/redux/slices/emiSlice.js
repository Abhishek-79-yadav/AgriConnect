import { createSlice } from "@reduxjs/toolkit";
import { createEmiPlanThunk, fetchEmiPlansThunk, payEmiInstallmentThunk } from "../thunks/emiThunk";

const emiSlice = createSlice({
  name: "emi",

  initialState: {
    plans: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchEmiPlansThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmiPlansThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchEmiPlansThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createEmiPlanThunk.fulfilled, (state, action) => {
        state.plans.unshift(action.payload);
      })
      .addCase(payEmiInstallmentThunk.fulfilled, (state, action) => {
        const installment = action.payload;
        state.plans.forEach((plan) => {
          const idx = plan.installments?.findIndex((i) => i.id === installment.id);
          if (idx !== -1 && idx !== undefined) plan.installments[idx] = installment;
        });
      });
  },
});

export default emiSlice.reducer;
