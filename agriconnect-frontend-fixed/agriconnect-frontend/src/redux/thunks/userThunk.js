import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProfile } from "../../api/authApi";
import { updateProfileApi } from "../../api/userApi";

/** "My profile" lives at GET /api/auth/profile, not a /users route. */
export const getProfileThunk = createAsyncThunk(
  "user/profile",
  async (_, { rejectWithValue }) => {
    try {
      return await getProfile();
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  "user/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      return await updateProfileApi(data);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
