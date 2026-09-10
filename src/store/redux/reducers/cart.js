import { createReducer } from "@reduxjs/toolkit";

//INITIAL STATE: 
// This decides what the cart looks like the very first time your app loads. It checks localStorage (the browser's permanent storage that survives page refreshes):
// If "cartItems" exists in localStorage (meaning the user added stuff to their cart before, in a previous visit) → parse that saved JSON string back into a real array, and use it as the starting cart.
// If nothing's saved yet → start with an empty array [].
const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

export const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToCart", (state, action) => {
      const item = action.payload;
      const isItemExist = state.cart.find((i) => i._id === item._id);

      if (isItemExist) {
        state.cart = state.cart.map((i) =>
          i._id === isItemExist._id ? item : i
        );
      } else {
        state.cart.push(item);
      }
    })

    .addCase("removeFromCart", (state, action) => {
      state.cart = state.cart.filter((i) => i._id !== action.payload);
    })

    .addCase("clearCart", (state) => {
      state.cart = [];
    });
});