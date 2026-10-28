import { createSlice } from '@reduxjs/toolkit';

/**
 * Cart slice — unified cart for the marketplace.
 *
 * - Guest cart: persisted to localStorage, survives page refreshes.
 * - Server cart: fetched on login, merged into guest cart automatically.
 * - Both render from the same state; the view layer decides which data to show.
 */
function getInitialCart() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('cartItems');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load cart from localStorage:', err);
  }
  return [];
}

const initialState = {
  cart: getInitialCart(),
  isLoading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /** Add an item (called by public addToCart flow). */
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
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('cartItems', JSON.stringify(state.cart));
        }
      } catch (_e) {
        // Ignore localStorage write failures
      }
    },
    /** Replace the entire cart (server response or guest restore). */
    setCart: (state, action) => {
      state.cart = action.payload || [];
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('cartItems', JSON.stringify(state.cart));
        }
      } catch (_e) {
        // Ignore localStorage write failures
      }
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      state.cart = state.cart.map((item) =>
        (item.productId || item._id) === productId ? { ...item, quantity } : item
      );
      state.error = null;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('cartItems', JSON.stringify(state.cart));
        }
      } catch (_e) {
        // Ignore localStorage write failures
      }
    },
    removeFromCart: (state, action) => {
      const key = action.payload?.productId || action.payload;
      state.cart = state.cart.filter((i) => (i.productId || i._id) !== key);
      state.error = null;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('cartItems', JSON.stringify(state.cart));
        }
      } catch (_e) {
        // Ignore localStorage write failures
      }
    },
    clearCart: (state) => {
      state.cart = [];
      state.error = null;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('cartItems', JSON.stringify([]));
        }
      } catch (_e) {
        // Ignore localStorage write failures
      }
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
