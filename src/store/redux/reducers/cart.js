import { createReducer } from "@reduxjs/toolkit";

// INITIAL STATE
const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  isLoading: false,
  error: null,
  validationResult: null,
};

export const cartReducer = createReducer(initialState, (builder) => {
  builder
    // Add to cart
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
      state.error = null;
    })

    // Update quantity
    .addCase("updateQuantity", (state, action) => {
      const { productId, qty } = action.payload;
      state.cart = state.cart.map((item) =>
        item._id === productId ? { ...item, qty } : item
      );
      state.error = null;
    })

    // Set entire cart (for validation updates)
    .addCase("setCart", (state, action) => {
      state.cart = action.payload;
    })

    // Remove from cart
    .addCase("removeFromCart", (state, action) => {
      state.cart = state.cart.filter((i) => i._id !== action.payload);
      state.error = null;
    })

    // Clear cart
    .addCase("clearCart", (state) => {
      state.cart = [];
      state.error = null;
    })

    // Loading states
    .addCase("setCartLoading", (state, action) => {
      state.isLoading = action.payload;
    })

    // Error handling
    .addCase("setCartError", (state, action) => {
      state.error = action.payload;
    })

    // Validation result
    .addCase("setValidationResult", (state, action) => {
      state.validationResult = action.payload;
    });
});