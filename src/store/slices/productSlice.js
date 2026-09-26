import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
    shopProducts: [],
    allProducts: [],
    currentProduct: null,
}

export const productReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("productCreateRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("productCreateSuccess", (state, action) => {
            state.isLoading = false;
            state.currentProduct = action.payload;
            state.success = true;
        })
        // Consumed by the create page after it navigates: a stale `success`
        // would fire the "created" effect again on the NEXT visit to
        // /business/products/create and bounce the seller straight back out.
        .addCase("productCreateReset", (state) => {
            state.success = undefined;
            state.error = null;
        })
        .addCase("productCreateFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })
        // get all products of a single shop
        .addCase("getAllProductsShopRequest", (state) => {
            state.isLoading = true;
            // Clear the previous error so a retry doesn't keep showing a stale failure.
            state.error = null;
        })
        .addCase("getAllProductsShopSuccess", (state, action) => {
            state.isLoading = false;
            state.shopProducts = action.payload;
        })
        .addCase("getAllProductsShopFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })


// REDUCERS HELPFUL FOR DELETING A PRODUCT OF A SHOP
        .addCase("deleteProductRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("deleteProductSuccess", (state, action) => {
            state.isLoading = false;
            state.message = action.payload.message;
            state.shopProducts = state.shopProducts.filter(
                (product) => product._id !== action.payload.id
            );
        })
        .addCase("deleteProductFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        .addCase("clearError", (state) => {
            state.error = null;
        })
        // get all products
        .addCase("getAllProductsRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("getAllProductsSuccess", (state, action) => {
            state.isLoading = false;
            state.allProducts = action.payload;
        })
        .addCase("getAllProductsFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        // get one product detail
        .addCase("productDetailRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("productDetailSuccess", (state, action) => {
            state.isLoading = false;
            state.currentProduct = action.payload;
            state.error = null;
        })
        .addCase("productDetailFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        // update a product
        .addCase("productUpdateRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("productUpdateSuccess", (state, action) => {
            state.isLoading = false;
            state.currentProduct = action.payload;
            state.success = true;
        })
        .addCase("productUpdateFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })
        // lifecycle publish/draft — deliberately does NOT touch `success`
        .addCase("productTransitionRequest", (state) => {
            state.error = null;
        })
        .addCase("productTransitionSuccess", (state, action) => {
            state.error = null;
            // Reflect the change in the cached shop list without a refetch.
            const updated = action.payload && action.payload.product;
            if (updated && Array.isArray(state.shopProducts)) {
                state.shopProducts = state.shopProducts.map((p) =>
                    p._id === updated._id ? { ...p, ...updated } : p
                );
            }
            if (updated && state.currentProduct && state.currentProduct._id === updated._id) {
                state.currentProduct = { ...state.currentProduct, ...updated };
            }
        })
        .addCase("productTransitionFailed", (state, action) => {
            state.error = action.payload;
        })
        // Reset product state on logout so no stale data remains for guests
        .addCase("LogoutSuccess", (state) => {
            state.allProducts = [];
            state.shopProducts = [];
            state.currentProduct = null;
            state.isLoading = false;
            state.error = null;
            state.success = undefined;
        });
});