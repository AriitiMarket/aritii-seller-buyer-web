import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  shopsLoading: false,
  shops: [],
  // Categories are stored PER TYPE ('product' | 'business' | 'shop' | 'event').
  // A single shared array let one surface's list leak into another: opening
  // /shops after /products showed product categories and never refetched.
  categoriesByType: {},
  categoriesLoadingByType: {},
  categoriesLoadedByType: {},
  categoriesErrorByType: {},
  error: null,
};

export const shopReducer = createReducer(initialState, (builder) => {
  builder
    // shops
    .addCase("getAllShopsRequest", (state) => {
      state.shopsLoading = true;
    })
    .addCase("getAllShopsSuccess", (state, action) => {
      state.shopsLoading = false;
      state.shops = action.payload;
    })
    .addCase("getAllShopsFailed", (state, action) => {
      state.shopsLoading = false;
      state.error = action.payload;
    })
    // categories (keyed by type)
    .addCase("getAllCategoriesRequest", (state, action) => {
      const type = action.payload || "product";
      state.categoriesLoadingByType = { ...state.categoriesLoadingByType, [type]: true };
      state.categoriesErrorByType = { ...state.categoriesErrorByType, [type]: null };
    })
    .addCase("getAllCategoriesSuccess", (state, action) => {
      const { type = "product", categories = [] } = action.payload || {};
      state.categoriesLoadingByType = { ...state.categoriesLoadingByType, [type]: false };
      state.categoriesLoadedByType = { ...state.categoriesLoadedByType, [type]: true };
      state.categoriesErrorByType = { ...state.categoriesErrorByType, [type]: null };
      state.categoriesByType = { ...state.categoriesByType, [type]: categories };
    })
    .addCase("getAllCategoriesFailed", (state, action) => {
      const { type = "product", error = null } = action.payload || {};
      state.categoriesLoadingByType = { ...state.categoriesLoadingByType, [type]: false };
      // Marked loaded so a failing endpoint does not refetch on every render;
      // `refresh()` is the explicit retry path.
      state.categoriesLoadedByType = { ...state.categoriesLoadedByType, [type]: true };
      state.categoriesErrorByType = { ...state.categoriesErrorByType, [type]: error };
    })
    .addCase("clearShopError", (state) => {
      state.error = null;
    })
    // Reset shop state on logout so no stale data remains for guests.
    // Category lists are public catalog data and intentionally survive.
    .addCase("LogoutSuccess", (state) => {
      state.shops = [];
      state.shopsLoading = false;
      state.error = null;
    });
});
