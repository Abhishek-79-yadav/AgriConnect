import { createAsyncThunk } from "@reduxjs/toolkit";

import { getNotificationsApi, markNotificationReadApi } from "../../api/notificationApi";

export const fetchNotificationsThunk = createAsyncThunk(
  "notification/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await getNotificationsApi();
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const markNotificationReadThunk = createAsyncThunk(
  "notification/markRead",
  async (id, { rejectWithValue }) => {
    try {
      await markNotificationReadApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
