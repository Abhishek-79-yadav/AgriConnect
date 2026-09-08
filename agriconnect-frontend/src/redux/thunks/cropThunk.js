import { createAsyncThunk }
from "@reduxjs/toolkit";

import {
  cropRecommendationApi,
} from "../../api/cropApi";

export const recommendCropThunk =
  createAsyncThunk(
    "crop/recommend",
    async (data) => {
      return await cropRecommendationApi(
        data
      );
    }
  );