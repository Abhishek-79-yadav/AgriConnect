import { createSlice }
from "@reduxjs/toolkit";

import {
  fetchWeatherThunk,
} from "../thunks/weatherThunk";

const weatherSlice = createSlice({
  name: "weather",

  initialState: {
    data: null,
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchWeatherThunk.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        fetchWeatherThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.data =
            action.payload;
        }
      );
  },
});

export default weatherSlice.reducer;