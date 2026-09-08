import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getMyCropHistoryApi,
  addCropHistoryApi,
  deleteCropHistoryApi,
} from "../../api/cropHistoryApi";

export const fetchMyCropHistoryThunk = createAsyncThunk(
  "cropHistory/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      return await getMyCropHistoryApi();
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const addCropHistoryThunk = createAsyncThunk(
  "cropHistory/add",
  async (data, { rejectWithValue }) => {
    try {
      return await addCropHistoryApi(data);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteCropHistoryThunk = createAsyncThunk(
  "cropHistory/delete",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteCropHistoryApi(id);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
