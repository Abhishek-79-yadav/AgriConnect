import { createAsyncThunk } from "@reduxjs/toolkit";

import { getWeatherApi } from "../../api/weatherApi";

export const fetchWeatherThunk = createAsyncThunk("weather/current", async (city) => {
  return await getWeatherApi(city);
});