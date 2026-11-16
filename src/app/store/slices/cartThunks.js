import { api } from '@/services';
import { toast } from 'react-toastify';
import {
  setCart,
  clearCart as clearCartAction,
  setCartLoading,
  setCartError,
} from './cartSlice';

const API_BASE = '/cart';

/**
 * Normalize a cart line to match the backend schema.
 * Backend expects: productId, shopId, name, price, quantity, _id
 */
function normalizeCartItem(data) {
  // Frontend cart lookups use `_id` as the product id (ProductCard finds
  // `i._id === productId`), and the backend also stores `productId`.
  // Keep both equal to the product id so quantity/remove/update all resolve.
  const productId = data._id || data.id || data.productId;
  return {
    productId,
    shopId: data.shop?._id || data.shopId || '',
    shopName: data.shop?.name || data.shopName || '',
    name: data.name,
    images: data.images || (data.image ? [data.image] : []),
    image: data.image || data.images?.[0] || null,
    price: Number(data.discountPrice || data.price || 0),
    discountPrice: data.discountPrice !== undefined ? Number(data.discountPrice) : undefined,
    originalPrice: data.originalPrice !== undefined ? Number(data.originalPrice) : undefined,
    stock: data.stock !== undefined ? Number(data.stock) : (data.available !== undefined ? Number(data.available) : 99),
    quantity: Number(data.quantity) || 1,
    _id: productId,
  };
}

/**
 * Add to cart — handles both guest mode (localStorage) and authenticated mode (backend API).
 *
 * If the item already exists in the cart, it increments quantity up to stock limit.
 */
export const addTocart = (data) => async (dispatch, getState) => {
  dispatch(setCartLoading(true));

  if (!data || !(data._id || data.id || data.productId)) {
    toast.error('Could not add product', { toastId: 'cart-action' });
    dispatch(setCartLoading(false));
    return null;
  }

  const cartData = normalizeCartItem(data);
  const { isAuthenticated } = getState().user || {};

  // Guest / Unauthenticated flow: Store entirely in localStorage & Redux
  if (!isAuthenticated) {
    try {
      const currentCart = getState().cart?.cart || [];
      const key = cartData.productId;
      const existingIndex = currentCart.findIndex((i) => (i.productId || i._id) === key);

      let updatedCart;
      if (existingIndex > -1) {
        const existing = currentCart[existingIndex];
        const nextQty = (Number(existing.quantity) || 1) + (Number(cartData.quantity) || 1);
        const maxStock = Number(existing.stock ?? cartData.stock ?? 99);
        if (maxStock > 0 && nextQty > maxStock) {
          toast.error(`Only ${maxStock} available in stock`, { toastId: 'cart-stock-limit' });
          dispatch(setCartLoading(false));
          return null;
        }
        updatedCart = currentCart.map((item, idx) =>
          idx === existingIndex ? { ...item, ...cartData, quantity: nextQty } : item
        );
      } else {
        const maxStock = Number(cartData.stock ?? 99);
        if (maxStock < (Number(cartData.quantity) || 1)) {
          toast.error(`Only ${maxStock} available in stock`, { toastId: 'cart-stock-limit' });
          dispatch(setCartLoading(false));
          return null;
        }
        updatedCart = [...currentCart, cartData];
      }

      dispatch(setCart(updatedCart));
      dispatch(setCartError(null));
      dispatch(setCartLoading(false));
      toast.success('Added to cart', { toastId: 'cart-action' });
      return { items: updatedCart };
    } catch (err) {
      toast.error('Failed to add item to cart', { toastId: 'cart-action' });
      dispatch(setCartError('Failed to add to cart'));
      dispatch(setCartLoading(false));
      return null;
    }
  }

  // Authenticated flow: Send to backend /cart
  try {
    const { data: response } = await api.post(API_BASE, cartData);
    const serverCart = response?.cart;
    if (serverCart) {
      dispatch(setCart(serverCart.items || []));
      dispatch(setCartError(null));
      dispatch(setCartLoading(false));
      toast.success('Added to cart', { toastId: 'cart-action' });
      return serverCart;
    }
    dispatch(setCartError('Failed to add item'));
    dispatch(setCartLoading(false));
    return null;
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Could not add to cart';
    toast.error(message, { toastId: 'cart-action' });
    dispatch(setCartError(message));
    dispatch(setCartLoading(false));
    return null;
  }
};

/**
 * Update cart item quantity via guest mode (localStorage) or backend.
 */
export const updateCartQuantity = (productId, newQuantity) => async (dispatch, getState) => {
  dispatch(setCartLoading(true));

  if (!productId || newQuantity < 1) {
    dispatch(setCartError('Quantity must be at least 1'));
    dispatch(setCartLoading(false));
    return null;
  }

  const { isAuthenticated } = getState().user || {};
  if (!isAuthenticated) {
    try {
      const currentCart = getState().cart?.cart || [];
      const updatedCart = currentCart.map((item) =>
        (item.productId || item._id) === productId ? { ...item, quantity: newQuantity } : item
      );
      dispatch(setCart(updatedCart));
      dispatch(setCartError(null));
      dispatch(setCartLoading(false));
      toast.success('Cart updated', { toastId: 'cart-action' });
      return { items: updatedCart };
    } catch (err) {
      dispatch(setCartError('Failed to update quantity'));
      dispatch(setCartLoading(false));
      return null;
    }
  }

  try {
    const { data: response } = await api.put(`${API_BASE}/${productId}`, { quantity: newQuantity });
    const serverCart = response?.cart;
    if (serverCart) {
      dispatch(setCart(serverCart.items || []));
      dispatch(setCartError(null));
      dispatch(setCartLoading(false));
      toast.success('Cart updated', { toastId: 'cart-action' });
      return serverCart;
    }
    dispatch(setCartError('Failed to update quantity'));
    dispatch(setCartLoading(false));
    return null;
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Failed to update quantity';
    toast.error(message, { toastId: 'cart-action' });
    dispatch(setCartError(message));
    dispatch(setCartLoading(false));
    return null;
  }
};

/**
 * Remove item from cart via guest mode (localStorage) or backend.
 */
export const removeFromCart = (data) => async (dispatch, getState) => {
  const productId = data.productId || data._id || data.id;
  if (!productId) return null;

  const { isAuthenticated } = getState().user || {};
  if (!isAuthenticated) {
    const currentCart = getState().cart?.cart || [];
    const updatedCart = currentCart.filter((item) => (item.productId || item._id) !== productId);
    dispatch(setCart(updatedCart));
    dispatch(setCartError(null));
    toast.success('Removed from cart', { toastId: 'cart-action' });
    return { success: true, items: updatedCart };
  }

  try {
    const { data: response } = await api.delete(`${API_BASE}/${productId}`);
    const serverCart = response?.cart;
    if (serverCart) {
      dispatch(setCart(serverCart.items || []));
      dispatch(setCartError(null));
      toast.success('Removed from cart', { toastId: 'cart-action' });
      return response;
    }
    dispatch(setCartError('Failed to remove item'));
    return null;
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Failed to remove item';
    toast.error(message, { toastId: 'cart-action' });
    dispatch(setCartError(message));
    return null;
  }
};

/**
 * Clear cart via guest mode (localStorage) or backend.
 */
export const clearCart = () => async (dispatch, getState) => {
  const { isAuthenticated } = getState().user || {};
  if (!isAuthenticated) {
    dispatch(clearCartAction());
    dispatch(setCartError(null));
    return { success: true };
  }

  try {
    const { data: response } = await api.delete(API_BASE);
    dispatch(clearCartAction());
    dispatch(setCartError(null));
    return response;
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Failed to clear cart';
    dispatch(setCartError(message));
    return null;
  }
};

/**
 * Synchronize guest cart items with the server cart on login.
 * Pushes any local guest items to the backend and returns the combined cart.
 */
export const syncGuestCart = () => async (dispatch) => {
  try {
    let localItems = [];
    try {
      const raw = localStorage.getItem('cartItems');
      localItems = raw ? JSON.parse(raw) : [];
    } catch (_e) {
      // Ignore read errors
    }

    if (Array.isArray(localItems) && localItems.length > 0) {
      for (const item of localItems) {
        try {
          const cartData = normalizeCartItem(item);
          await api.post(API_BASE, cartData);
        } catch (err) {
          // If the product doesn't exist on server (404), skip gracefully
          console.warn('Could not sync guest cart item to server:', item?.name, err?.response?.data?.message || err?.message);
        }
      }
      try {
        localStorage.removeItem('cartItems');
      } catch (_e) {
        // Ignore remove errors
      }
    }

    const { data: response } = await api.get(API_BASE);
    const serverCart = response?.cart;
    if (serverCart) {
      const items = serverCart.items || [];
      dispatch(setCart(items));
      return serverCart;
    }
    return null;
  } catch (error) {
    console.error('Failed to sync guest cart:', error);
    return null;
  }
};

/**
 * Validate entire cart against current product availability.
 * Returns validation result with any out-of-stock or unavailable items.
 * Runs non-blocking in background without locking or unmounting the UI.
 */
export const validateCart = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { cart } = state.cart;
    if (!cart || cart.length === 0) {
      return { isValid: true, invalidItems: [], validCart: [] };
    }

    const results = await Promise.all(
      cart.map(async (item) => {
        const productId = item.productId || item._id;
        if (!productId) {
          return { item: null, invalid: { id: null, name: item.name || 'Unknown', reason: 'Invalid product reference' } };
        }
        try {
          const { data: response } = await api.get(`/product/get-product/${productId}`, {
            timeout: 5000,
          });
          const product = response?.product || null;
          if (!product || (Number(product.stock) || 0) < 1) {
            return { item: null, invalid: { id: productId, name: item.name, reason: 'Product is no longer available' } };
          } else if ((Number(item.quantity) || 1) > (Number(product.stock) || 0)) {
            return {
              item: { ...item, quantity: Math.min(Number(item.quantity) || 1, Number(product.stock) || 0) },
              invalid: { id: productId, name: item.name, reason: `Only ${product.stock} items available (you have ${item.quantity})` },
            };
          }
          return { item, invalid: null };
        } catch (err) {
          if (err?.response?.status === 404) {
            return { item: null, invalid: { id: productId, name: item.name, reason: 'Product is no longer available' } };
          }
          return { item, invalid: null };
        }
      })
    );

    const invalidItems = results.filter((r) => r.invalid).map((r) => r.invalid);
    const validCart = results.map((r) => r.item).filter(Boolean);

    if (invalidItems.length > 0) {
      dispatch(setCart(validCart));
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('cartItems', JSON.stringify(validCart));
        }
      } catch (_e) {
        // Ignore localStorage error
      }
      const removedCount = invalidItems.filter((i) => i.reason.includes('no longer available')).length;
      if (removedCount > 0) {
        toast.warn(`${removedCount} unavailable item(s) were removed from your cart.`, { toastId: 'cart-stale-cleanup' });
      }
    }

    return { isValid: invalidItems.length === 0, invalidItems, validCart };
  } catch {
    return { isValid: false, invalidItems: [], validCart: getState().cart.cart };
  }
};

/**
 * Validate the cart against the buyer's selected delivery zone.
 * Calls POST /cart/validate with cart + zoneId in the body (backend contract).
 * Returns per-row eligibility results so the UI can show incompatible items.
 * Does not mutate global cart loading state to prevent unmount loops.
 */
export const validateCartForZone = (zoneId) => async (_dispatch, getState) => {
  try {
    const state = getState();
    const { cart } = state.cart;
    const { isAuthenticated } = state.user || {};

    if (!isAuthenticated) {
      // Guest users cannot call backend /cart/validate (requires auth)
      return null;
    }

    const { data } = await api.post(
      `${API_BASE}/validate`,
      { cart, zoneId }
    );

    return data;
  } catch {
    return null;
  }
};

/**
 * Fetch cart from backend on mount/login, or from localStorage for guest.
 */
export const fetchCart = () => async (dispatch, getState) => {
  const { isAuthenticated } = getState().user || {};
  if (!isAuthenticated) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem('cartItems');
        if (raw !== null && raw !== undefined) {
          const items = JSON.parse(raw);
          if (Array.isArray(items)) {
            dispatch(setCart(items));
          }
        }
      }
    } catch (e) {
      console.error('Failed to load guest cart from localStorage:', e);
    }
    dispatch(setCartLoading(false));
    return null;
  }

  dispatch(setCartLoading(true));
  try {
    const { data: response } = await api.get(API_BASE);
    const cart = response?.cart;
    if (cart) {
      const items = cart.items || [];
      dispatch(setCart(items));
      dispatch(setCartError(null));
      dispatch(setCartLoading(false));
      return cart;
    }
    dispatch(clearCartAction());
    dispatch(setCartError(null));
    dispatch(setCartLoading(false));
    return null;
  } catch (error) {
    try {
      const raw = localStorage.getItem('cartItems');
      if (raw) {
        const items = JSON.parse(raw);
        if (Array.isArray(items) && items.length > 0) {
          dispatch(setCart(items));
          dispatch(setCartError(null));
          dispatch(setCartLoading(false));
          return { items };
        }
      }
    } catch (_e) {
      // Ignore read errors
    }
    dispatch(setCartError('Failed to load cart'));
    dispatch(setCartLoading(false));
    return null;
  }
};
