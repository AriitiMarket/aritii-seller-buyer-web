import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  shops: [],
  categories: [],
  error: null,
};

export const shopReducer = createReducer(initialState, (builder) => {
  builder
    // shops
    .addCase("getAllShopsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllShopsSuccess", (state, action) => {
      state.isLoading = false;
      state.shops = action.payload;
    })
    .addCase("getAllShopsFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // categories
    .addCase("getAllCategoriesRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllCategoriesSuccess", (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
    })
    .addCase("getAllCategoriesFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase("clearShopError", (state) => {
      state.error = null;
    });
});