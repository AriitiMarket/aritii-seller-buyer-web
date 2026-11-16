import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userReducer } from '@/store/slices/userSlice';
import { sellerReducer } from '@/store/slices/sellerSlice';
import { productReducer } from '@/store/slices/productSlice';
import { eventReducer } from '@/store/slices/eventSlice';
import { shopReducer } from '@/store/slices/shopSlice';
import { cartReducer } from '@/store/slices/cartSlice';
import { wishlistReducer } from '@/store/slices/wishlistSlice';
import { orderReducer } from '@/store/slices/orderSlice';
import { deliveryLocationReducer } from '@/store/slices/deliveryLocationSlice';

// Global action types for session & domain cache resetting
export const RESET_STORE = 'RESET_STORE';
export const RESET_SELLER_STATE = 'RESET_SELLER_STATE';
export const RESET_BUYER_STATE = 'RESET_BUYER_STATE';
export const RESET_DELIVERY_STATE = 'RESET_DELIVERY_STATE';

export const resetStore = () => ({ type: RESET_STORE });
export const resetSellerState = () => ({ type: RESET_SELLER_STATE });
export const resetBuyerState = () => ({ type: RESET_BUYER_STATE });
export const resetDeliveryState = () => ({ type: RESET_DELIVERY_STATE });

export const appReducer = combineReducers({
  user: userReducer,
  seller: sellerReducer,
  products: productReducer,
  events: eventReducer,
  shop: shopReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  order: orderReducer,
  deliveryLocation: deliveryLocationReducer,
});

/**
 * Root Reducer with Scoped State Boundary Enforcement:
 *
 * Intercepts full session terminations (RESET_STORE, LogoutSuccess, auth/logout, LOGOUT)
 * and resets all domain state slices back to their clean initial state.
 * Prevents seller store metrics or buyer cart/order caches from leaking
 * across different user sessions or portal switches.
 */
export const rootReducer = (state, action) => {
  if (
    action.type === RESET_STORE ||
    action.type === 'LogoutSuccess' ||
    action.type === 'auth/logout' ||
    action.type === 'LOGOUT'
  ) {
    // When state is undefined, Redux initializes every slice to its clean initialState
    state = undefined;
  } else if (action.type === RESET_SELLER_STATE || action.type === 'SellerLogoutSuccess') {
    // Reset seller-specific slice and seller orders cache
    state = {
      ...state,
      seller: undefined,
      order: state?.order
        ? { ...state.order, ShopOrders: [], sellerOrdersLoading: false }
        : undefined,
    };
  } else if (action.type === RESET_BUYER_STATE) {
    // Reset buyer-specific slices: cart, wishlist, and buyer orders cache
    state = {
      ...state,
      cart: undefined,
      wishlist: undefined,
      order: state?.order
        ? { ...state.order, orders: [], buyerOrdersLoading: false }
        : undefined,
    };
  } else if (action.type === RESET_DELIVERY_STATE) {
    state = {
      ...state,
      deliveryLocation: undefined,
    };
  }

  return appReducer(state, action);
};

export const Store = configureStore({
  reducer: rootReducer,
});

export default Store;
