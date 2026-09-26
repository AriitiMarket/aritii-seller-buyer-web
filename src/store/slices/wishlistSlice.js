import { createSlice } from '@reduxjs/toolkit';

// localStorage is only a cache/mirror of the server truth (written after each
// successful API response) so the badge can render instantly on reload. The
// server response always overwrites it via fetchWishlist.
const readCachedWishlist = () => {
  try {
    const raw = localStorage.getItem('wishlistItems');
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const initialState = {
  wishlist: readCachedWishlist(),
  isLoading: false,
  error: null,
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.wishlist = action.payload || [];
      state.error = null;
    },
    addToWishlist: (state, action) => {
      const item = action.payload;
      if (!item || !item._id) return;
      const exists = state.wishlist.find((i) => i._id === item._id);
      if (exists) {
        state.wishlist = state.wishlist.map((i) => (i._id === item._id ? item : i));
      } else {
        state.wishlist.push(item);
      }
      state.error = null;
    },
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter((i) => i._id !== action.payload);
      state.error = null;
    },
    clearWishlist: (state) => {
      state.wishlist = [];
      state.error = null;
    },
    setWishlistLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setWishlistError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Logout must never leak the previous account's wishlist into the next
    // login on the same browser.
    builder.addCase('LogoutSuccess', (state) => {
      state.wishlist = [];
      state.error = null;
      state.isLoading = false;
    });
  },
});

export const wishlistReducer = wishlistSlice.reducer;
export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlistLoading,
  setWishlistError,
} = wishlistSlice.actions;
export default wishlistReducer;
