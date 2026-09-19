import { createSlice } from "@reduxjs/toolkit";

import {
  fetchNotificationsThunk,
  markNotificationReadThunk,
} from "../thunks/notificationThunk";

const notificationSlice = createSlice({
  name: "notification",

  initialState: {
    notifications: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(fetchNotificationsThunk.rejected, (state) => {
        state.loading = false;
      })

      .addCase(markNotificationReadThunk.fulfilled, (state, action) => {
        const item = state.notifications.find((n) => n.id === action.payload);
        if (item) item.readStatus = true;
      });
  },
});

export default notificationSlice.reducer;
