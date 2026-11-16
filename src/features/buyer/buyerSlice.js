/**
 * Buyer Slice Surface (features/buyer/buyerSlice.js)
 *
 * Domain-scoped Redux state API for the authenticated buyer workspace
 * and retail customer operations (Cart, Wishlist, Buyer Orders).
 */
export { cartReducer } from '@/store/slices/cartSlice';
export { wishlistReducer } from '@/store/slices/wishlistSlice';
export { orderReducer } from '@/store/slices/orderSlice';

export {
  addToCart,
  setCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setCartLoading,
  setCartError,
} from '@/store/slices/cartSlice';

export {
  addTocart,
  updateCartQuantity,
  removeFromCart as removeCartItem,
  clearCart as clearAllCart,
  fetchCart,
  syncGuestCart,
} from '@/store/slices/cartThunks';

export {
  setWishlist,
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
  clearWishlist,
} from '@/store/slices/wishlistSlice';

export {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from '@/store/slices/wishlistThunks';

/* Canonical Selectors for Buyer State */
export const selectCart = (state) => state.cart?.cart || [];
export const selectCartLoading = (state) => Boolean(state.cart?.isLoading);
export const selectCartError = (state) => state.cart?.error;
export const selectCartItemsCount = (state) =>
  (state.cart?.cart || []).reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0);

export const selectWishlist = (state) => state.wishlist?.wishlist || [];
export const selectWishlistLoading = (state) => Boolean(state.wishlist?.isLoading);
export const selectWishlistError = (state) => state.wishlist?.error;

export const selectBuyerOrders = (state) => state.order?.orders || [];
export const selectBuyerOrdersLoading = (state) => Boolean(state.order?.buyerOrdersLoading);
export const selectBuyerOrderError = (state) => state.order?.error;
