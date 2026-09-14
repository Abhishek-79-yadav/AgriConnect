import { createAsyncThunk } from "@reduxjs/toolkit";
import * as authApi from "../../api/authApi";
import { storage } from "../../utils/storage";

// ================= LOGIN =================
// Backend's AuthResponse is { token, refreshToken, email, role, id } —
// there is no nested "user" object, so the slice builds one from these fields.
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await authApi.login(credentials);
      storage.setToken(response.token);
      storage.setRefreshToken(response.refreshToken);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login Failed"
      );
    }
  }
);

// ================= REGISTER =================

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration Failed"
      );
    }
  }
);

// ================= PROFILE =================

export const fetchProfileThunk = createAsyncThunk(
  "auth/profile",
  async (_, thunkAPI) => {
    try {
      const response = await authApi.getProfile();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to Fetch Profile"
      );
    }
  }
);

// ================= LOGOUT =================

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await authApi.logout(storage.getRefreshToken());
      storage.clear();
      return true;
    } catch (error) {
      storage.clear();
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Logout Failed"
      );
    }
  }
);