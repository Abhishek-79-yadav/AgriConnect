import { createAsyncThunk }
from "@reduxjs/toolkit";

import {
  getWishlistApi,
  addWishlistApi,
  removeWishlistApi,
} from "../../api/wishlistApi";

export const fetchWishlistThunk =
  createAsyncThunk(
    "wishlist/fetch",
    async () => {
      return await getWishlistApi();
    }
  );

export const addWishlistThunk =
  createAsyncThunk(
    "wishlist/add",
    async (productId) => {
      return await addWishlistApi(
        productId
      );
    }
  );

export const removeWishlistThunk =
  createAsyncThunk(
    "wishlist/remove",
    async (productId) => {
      await removeWishlistApi(
        productId
      );
      return productId;
    }
  );