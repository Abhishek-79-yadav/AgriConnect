import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getSchemesApi,
} from "../../api/schemeApi";

export const fetchSchemesThunk =
  createAsyncThunk(
    "scheme/fetch",
    async (_, { rejectWithValue }) => {
      try {
        return await getSchemesApi();
      } catch (error) {
        return rejectWithValue(
          error.response?.data
        );
      }
    }
  );