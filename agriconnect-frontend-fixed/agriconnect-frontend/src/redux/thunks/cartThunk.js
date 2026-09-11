import { createAsyncThunk } from "@reduxjs/toolkit";

import { getCartItems, addCartItem, updateCartItem, removeCartItem } from "../../api/cartApi";

export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
  try {
    return await getCartItems();
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch cart");
  }
});

export const addToCartThunk = createAsyncThunk(
  "cart/add",
  async ({ productId, qty = 1 } = {}, { rejectWithValue }) => {
    try {
      return await addCartItem(productId, qty);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateCartThunk = createAsyncThunk(
  "cart/update",
  async ({ productId, qty }, { rejectWithValue }) => {
    try {
      return await updateCartItem(productId, qty);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const removeCartThunk = createAsyncThunk(
  "cart/remove",
  async (productId, { rejectWithValue }) => {
    try {
      await removeCartItem(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
