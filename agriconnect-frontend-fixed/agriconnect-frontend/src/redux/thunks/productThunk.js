import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProducts,
  getProductById,
} from "../../api/productApi";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getProducts();
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to load products"
      );
    }
  }
);

export const fetchProductDetails =
  createAsyncThunk(
    "products/details",
    async (id, { rejectWithValue }) => {
      try {
        return await getProductById(id);
      } catch (error) {
        return rejectWithValue(
          error.response?.data ||
            "Failed to load product"
        );
      }
    }
  );