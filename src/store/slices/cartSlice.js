import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  isLoading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      if (!item || !(item.productId || item._id)) return;
      const key = item.productId || item._id;
      const isItemExist = state.cart.find((i) => (i.productId || i._id) === key);
      if (isItemExist) {
        state.cart = state.cart.map((i) => ((i.productId || i._id) === key ? item : i));
      } else {
        state.cart.push(item);
      }
      state.error = null;
    },
    setCart: (state, action) => {
      state.cart = action.payload || [];
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      state.cart = state.cart.map((item) =>
        (item.productId || item._id) === productId ? { ...item, quantity } : item
      );
      state.error = null;
    },
    removeFromCart: (state, action) => {
      const key = action.payload?.productId || action.payload;
      state.cart = state.cart.filter((i) => (i.productId || i._id) !== key);
      state.error = null;
    },
    clearCart: (state) => {
      state.cart = [];
      state.error = null;
    },
    setCartLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCartError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const cartReducer = cartSlice.reducer;
export const { addToCart, setCart, updateQuantity, removeFromCart, clearCart, setCartLoading, setCartError } = cartSlice.actions;
export default cartReducer;
