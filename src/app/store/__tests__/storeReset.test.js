import { describe, it, expect, beforeEach, vi } from 'vitest';
import Store, {
  resetStore,
  resetSellerState,
  resetBuyerState,
} from '@/app/store';
import { logoutUser, logoutSeller } from '@/store/slices/userThunks';
import { tokenStore } from '@/services/tokenStore';

vi.mock('@/services/auth.service', () => ({
  default: {
    logout: vi.fn().mockResolvedValue({ message: 'Logged out successfully' }),
  },
}));

vi.mock('@/services/realtime', () => ({
  disconnectRealtime: vi.fn(),
  subscribeToShopOrders: vi.fn(),
  subscribeToUserOrders: vi.fn(),
}));

describe('Redux Root Reducer & State Boundary Enforcement', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    tokenStore.clear();
    Store.dispatch(resetStore());
  });

  it('initializes store with all domain slices in clean states', () => {
    const state = Store.getState();
    expect(state.user).toBeDefined();
    expect(state.seller).toBeDefined();
    expect(state.cart).toBeDefined();
    expect(state.wishlist).toBeDefined();
    expect(state.order).toBeDefined();
    expect(state.products).toBeDefined();
    expect(state.deliveryLocation).toBeDefined();

    expect(state.user.isAuthenticated).toBe(false);
    expect(state.seller.isSeller).toBe(false);
    expect(state.cart.cart).toEqual([]);
    expect(state.wishlist.wishlist).toEqual([]);
    expect(state.order.orders).toEqual([]);
    expect(state.order.ShopOrders).toEqual([]);
  });

  it('resets all state slices on RESET_STORE or LogoutSuccess', () => {
    // Populate store with mock active session data
    Store.dispatch({
      type: 'LoadUserSuccess',
      payload: { _id: 'u1', name: 'Alice', email: 'alice@example.com' },
    });
    Store.dispatch({
      type: 'LoadSellerSuccess',
      payload: { _id: 's1', name: 'Alice Shop', status: 'approved' },
    });
    Store.dispatch({
      type: 'cart/addToCart',
      payload: { productId: 'p1', name: 'Product 1', price: 100, quantity: 2 },
    });
    Store.dispatch({
      type: 'wishlist/addToWishlist',
      payload: { _id: 'p2', name: 'Product 2' },
    });
    Store.dispatch({
      type: 'getAllOrdersUserSuccess',
      payload: [{ _id: 'o1', totalAmount: 200 }],
    });
    Store.dispatch({
      type: 'getAllOrdersShopSuccess',
      payload: [{ _id: 'so1', totalAmount: 500 }],
    });

    let populated = Store.getState();
    expect(populated.user.isAuthenticated).toBe(true);
    expect(populated.seller.isSeller).toBe(true);
    expect(populated.cart.cart.length).toBe(1);
    expect(populated.wishlist.wishlist.length).toBe(1);
    expect(populated.order.orders.length).toBe(1);
    expect(populated.order.ShopOrders.length).toBe(1);

    // Dispatch global RESET_STORE
    Store.dispatch(resetStore());

    const resetState = Store.getState();
    expect(resetState.user.isAuthenticated).toBe(false);
    expect(resetState.user.user).toBeNull();
    expect(resetState.seller.isSeller).toBe(false);
    expect(resetState.seller.seller).toBeNull();
    expect(resetState.cart.cart).toEqual([]);
    expect(resetState.wishlist.wishlist).toEqual([]);
    expect(resetState.order.orders).toEqual([]);
    expect(resetState.order.ShopOrders).toEqual([]);
  });

  it('isolates seller state reset without clearing buyer cart and profile', () => {
    Store.dispatch({
      type: 'LoadUserSuccess',
      payload: { _id: 'u1', name: 'Bob' },
    });
    Store.dispatch({
      type: 'LoadSellerSuccess',
      payload: { _id: 's1', name: 'Bob Store' },
    });
    Store.dispatch({
      type: 'cart/addToCart',
      payload: { productId: 'p1', name: 'Buyer Item', price: 50 },
    });
    Store.dispatch({
      type: 'getAllOrdersShopSuccess',
      payload: [{ _id: 'so1', totalAmount: 1000 }],
    });

    // Reset only seller state
    Store.dispatch(resetSellerState());

    const state = Store.getState();
    expect(state.seller.isSeller).toBe(false);
    expect(state.seller.seller).toBeNull();
    expect(state.order.ShopOrders).toEqual([]);

    // Buyer state remains untouched
    expect(state.user.isAuthenticated).toBe(true);
    expect(state.user.user.name).toBe('Bob');
    expect(state.cart.cart.length).toBe(1);
  });

  it('isolates buyer state reset without clearing seller store profile', () => {
    Store.dispatch({
      type: 'LoadSellerSuccess',
      payload: { _id: 's1', name: 'Merchant Pro' },
    });
    Store.dispatch({
      type: 'cart/addToCart',
      payload: { productId: 'p1', name: 'Cart Item' },
    });
    Store.dispatch({
      type: 'getAllOrdersUserSuccess',
      payload: [{ _id: 'o1', status: 'Delivered' }],
    });

    // Reset only buyer state
    Store.dispatch(resetBuyerState());

    const state = Store.getState();
    expect(state.cart.cart).toEqual([]);
    expect(state.order.orders).toEqual([]);

    // Seller state remains intact
    expect(state.seller.isSeller).toBe(true);
    expect(state.seller.seller.name).toBe('Merchant Pro');
  });

  it('logoutUser dispatches RESET_STORE and flushes localStorage caches', async () => {
    localStorage.setItem('cartItems', JSON.stringify([{ productId: 'p1' }]));
    localStorage.setItem('wishlistItems', JSON.stringify([{ _id: 'w1' }]));
    localStorage.setItem('aritii.business.selectedShopId', 'shop-123');

    await Store.dispatch(logoutUser());

    const state = Store.getState();
    expect(state.user.isAuthenticated).toBe(false);
    expect(state.cart.cart).toEqual([]);
    expect(state.wishlist.wishlist).toEqual([]);
    expect(localStorage.getItem('cartItems')).toBeNull();
    expect(localStorage.getItem('wishlistItems')).toBeNull();
    expect(localStorage.getItem('aritii.business.selectedShopId')).toBeNull();
  });

  it('logoutSeller dispatches RESET_SELLER_STATE and flushes selectedShopId', async () => {
    localStorage.setItem('aritii.business.selectedShopId', 'shop-456');

    await Store.dispatch(logoutSeller());

    const state = Store.getState();
    expect(state.seller.isSeller).toBe(false);
    expect(localStorage.getItem('aritii.business.selectedShopId')).toBeNull();
  });
});
