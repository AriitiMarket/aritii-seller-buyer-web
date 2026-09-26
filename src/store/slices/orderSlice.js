import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    buyerOrdersLoading: false,
    sellerOrdersLoading: false,
    // Aggregate flag: many seller pages destructure `isLoading` from state.order
    // (it never existed before, so their spinners were permanently hidden).
    isLoading: false,
    ShopOrders: [],
    orders: [],
    error: null,
}

export const orderReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("getAllOrdersUserRequest", (state) => {
            state.buyerOrdersLoading = true;
            state.isLoading = true;
        })
        .addCase("getAllOrdersUserSuccess", (state, action) => {
            state.buyerOrdersLoading = false;
            state.isLoading = false;
            state.orders = action.payload;
        })
        .addCase("getAllOrdersUserFailed", (state, action) => {
            state.buyerOrdersLoading = false;
            state.isLoading = false;
            state.error = action.payload;
        })
        .addCase("getAllOrdersShopRequest",(state)=>{
            state.sellerOrdersLoading=true;
            state.isLoading = true;
        })
        .addCase("getAllOrdersShopSuccess",(state,action)=>{
            state.sellerOrdersLoading=false;
            state.isLoading = false;
            state.ShopOrders=action.payload;
        })
        .addCase("getAllOrdersShopFailed",(state,action)=>{
            state.sellerOrdersLoading=false;
            state.isLoading = false;
            state.error=action.payload;
        })
        .addCase("cancelOrderRequest", (state) => {
            state.buyerOrdersLoading = true;
        })
        .addCase("cancelOrderSuccess", (state, action) => {
            state.buyerOrdersLoading = false;
            // The service can return null (unexpected response shape) — guard
            // before reading payload._id so the reducer never throws.
            const updated = action.payload;
            if (!updated || !updated._id) return;
            const index = state.orders.findIndex(o => o._id === updated._id);
            if (index !== -1) {
              state.orders[index] = updated;
            }
        })
        .addCase("cancelOrderFailed", (state, action) => {
            state.buyerOrdersLoading = false;
            state.error = action.payload;
        })
        .addCase("clearError", (state) => {
            state.error = null;
        });
});
