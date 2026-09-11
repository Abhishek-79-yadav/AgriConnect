import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getMyProductsApi,
  addProductApi,
  updateProductPriceApi,
  deleteProductApi,
} from "../../api/farmerApi";

export const fetchMyProductsThunk = createAsyncThunk("farmer/products", async () => {
  return await getMyProductsApi();
});

export const addProductThunk = createAsyncThunk("farmer/addProduct", async (data) => {
  return await addProductApi(data);
});

// NOTE: the backend only supports updating a product's price
// (PUT /api/farmer/products/{id}/price?price=), not a full product update.
export const updateProductThunk = createAsyncThunk(
  "farmer/updateProduct",
  async ({ id, price }) => {
    return await updateProductPriceApi(id, price);
  }
);

export const deleteProductThunk = createAsyncThunk("farmer/deleteProduct", async (id) => {
  await deleteProductApi(id);
  return id;
});