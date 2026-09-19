import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  requestReturnApi,
  getBuyerReturnsApi,
  getFarmerReturnsApi,
  getAllReturnsApi,
  updateReturnStatusApi,
} from "../../api/returnApi";

export const requestReturnThunk = createAsyncThunk(
  "returns/request",
  async (data, { rejectWithValue }) => {
    try {
      return await requestReturnApi(data);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

/** Pass "farmer" or "admin" to get that view; defaults to the buyer's own returns. */
export const fetchReturnsThunk = createAsyncThunk(
  "returns/fetch",
  async (role = "buyer") => {
    if (role === "farmer") return await getFarmerReturnsApi();
    if (role === "admin") return await getAllReturnsApi();
    return await getBuyerReturnsApi();
  }
);

export const updateReturnStatusThunk = createAsyncThunk(
  "returns/updateStatus",
  async ({ id, status, note }, { rejectWithValue }) => {
    try {
      return await updateReturnStatusApi(id, status, note);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
