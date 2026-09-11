import { createSlice }
from "@reduxjs/toolkit";

import {
  recommendCropThunk,
} from "../thunks/cropThunk";

const cropSlice = createSlice({
  name: "crop",

  initialState: {
    recommendation:
      null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(
      recommendCropThunk.fulfilled,
      (state, action) => {
        state.recommendation =
          action.payload;
      }
    );
  },
});

export default cropSlice.reducer;