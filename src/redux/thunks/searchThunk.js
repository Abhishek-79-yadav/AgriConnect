import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  searchByNameApi,
  searchByCategoryApi,
  searchByCityApi,
  searchByStateApi,
  searchByPriceApi,
} from "../../api/searchApi";

/** Defaults to name search, matching the old single-thunk shape. */
export const searchThunk = createAsyncThunk(
  "search/query",
  async (keyword, { rejectWithValue }) => {
    try {
      return await searchByNameApi(keyword);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const searchByCategoryThunk = createAsyncThunk(
  "search/category",
  async (category, { rejectWithValue }) => {
    try {
      return await searchByCategoryApi(category);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const searchByCityThunk = createAsyncThunk(
  "search/city",
  async (city, { rejectWithValue }) => {
    try {
      return await searchByCityApi(city);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const searchByStateThunk = createAsyncThunk(
  "search/state",
  async (state, { rejectWithValue }) => {
    try {
      return await searchByStateApi(state);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const searchByPriceThunk = createAsyncThunk(
  "search/price",
  async ({ min, max }, { rejectWithValue }) => {
    try {
      return await searchByPriceApi(min, max);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);