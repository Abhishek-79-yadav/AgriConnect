import { createSlice } from "@reduxjs/toolkit";

import {
  getProfileThunk,
  updateProfileThunk,
} from "../thunks/userThunk";

const userSlice = createSlice({
  name: "user",

  initialState: {
    profile: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(
        getProfileThunk.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        getProfileThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )

      .addCase(
        getProfileThunk.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      .addCase(
        updateProfileThunk.fulfilled,
        (state, action) => {
          state.profile = action.payload;
        }
      )

      .addCase(
        updateProfileThunk.rejected,
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export default userSlice.reducer;