import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getUsersApi,
  getAdminProductsApi,
  getAdminOrdersApi,
  deleteUserApi,
} from "../../api/adminApi";

export const fetchUsersThunk = createAsyncThunk("admin/users", async () => {
  return await getUsersApi();
});

export const fetchAdminProductsThunk = createAsyncThunk("admin/products", async () => {
  return await getAdminProductsApi();
});

export const fetchAdminOrdersThunk = createAsyncThunk(
  "admin/orders",
  async (_, { rejectWithValue }) => {
    try {
      return await getAdminOrdersApi();
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteUserThunk = createAsyncThunk("admin/deleteUser", async (id) => {
  await deleteUserApi(id);
  return id;
});