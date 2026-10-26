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
    name: data.name,
    price: Number(data.discountPrice || data.price || 0),
    quantity: Number(data.quantity) || 1,
    _id: productId,
  };
}

/**
 * Add to cart — calls the backend API.
 *
 * If the item already exists in the cart, the backend merges quantities.
 * The frontend prevents the duplicate add UI-side and instead increments.
 */
export const addTocart = (data) => async (dispatch, _getState) => {
  dispatch(setCartLoading(true));

  if (!data || !(data._id || data.id || data.productId)) {
    toast.error('Could not add product', { toastId: 'cart-action' });
    dispatch(setCartLoading(false));
    return null;
  }

  const cartData = normalizeCartItem(data);
  try {
    const { data: response } = await api.post(API_BASE, cartData);
    const serverCart = response?.cart;
    if (serverCart) {
      dispatch(setCart(serverCart.items || []));
      dispatch(setCartError(null));
      dispatch(setCartLoading(false));
      localStorage.setItem('cartItems', JSON.stringify(serverCart.items || []));
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
 * Update cart item quantity via backend.
 */
export const updateCartQuantity = (productId, newQuantity) => async (dispatch, _getState) => {
  dispatch(setCartLoading(true));

  if (!productId || newQuantity < 1) {
    dispatch(setCartError('Quantity must be at least 1'));
    dispatch(setCartLoading(false));
    return null;
  }

  try {
    const { data: response } = await api.put(`${API_BASE}/${productId}`, { quantity: newQuantity });
    const serverCart = response?.cart;
    if (serverCart) {
      dispatch(setCart(serverCart.items || []));
      dispatch(setCartError(null));
      dispatch(setCartLoading(false));
      localStorage.setItem('cartItems', JSON.stringify(serverCart.items || []));
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
 * Remove item from cart via backend.
 */
export const removeFromCart = (data) => async (dispatch) => {
  const productId = data.productId || data._id || data.id;
  if (!productId) return null;

  try {
    const { data: response } = await api.delete(`${API_BASE}/${productId}`);
    const serverCart = response?.cart;
    if (serverCart) {
      dispatch(setCart(serverCart.items || []));
      dispatch(setCartError(null));
      localStorage.setItem('cartItems', JSON.stringify(serverCart.items || []));
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
 * Clear cart via backend.
 */
export const clearCart = () => async (dispatch) => {
  try {
    const { data: response } = await api.delete(API_BASE);
    dispatch(clearCartAction());
    localStorage.setItem('cartItems', JSON.stringify([]));
    dispatch(setCartError(null));
    return response;
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Failed to clear cart';
    dispatch(setCartError(message));
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
          return { item, invalid: { id: null, name: item.name || 'Unknown', reason: 'Invalid product reference' } };
        }
        try {
          const { data: response } = await api.get(`/product/get-product/${productId}`, {
            timeout: 5000,
          });
          const product = response?.product || null;
          if (!product || (Number(product.stock) || 0) < 1) {
            return { item, invalid: { id: productId, name: item.name, reason: 'Product is no longer available' } };
          } else if ((Number(item.quantity) || 1) > (Number(product.stock) || 0)) {
            return {
              item: { ...item, quantity: Math.min(Number(item.quantity) || 1, Number(product.stock) || 0) },
              invalid: { id: productId, name: item.name, reason: `Only ${product.stock} items available (you have ${item.quantity})` },
            };
          }
          return { item, invalid: null };
        } catch {
          return { item, invalid: null };
        }
      })
    );

    const invalidItems = results.filter((r) => r.invalid).map((r) => r.invalid);
    const updatedCart = results.map((r) => r.item);

    if (invalidItems.length > 0) {
      dispatch(setCart(updatedCart));
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    }

    return { isValid: invalidItems.length === 0, invalidItems, validCart: updatedCart };
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
 * Fetch cart from backend on mount/login.
 */
export const fetchCart = () => async (dispatch) => {
  dispatch(setCartLoading(true));
  try {
    const { data: response } = await api.get(API_BASE);
    const cart = response?.cart;
    if (cart) {
      const items = cart.items || [];
      dispatch(setCart(items));
      localStorage.setItem('cartItems', JSON.stringify(items));
      dispatch(setCartError(null));
      dispatch(setCartLoading(false));
      return cart;
    }
    dispatch(clearCartAction());
    dispatch(setCartError(null));
    dispatch(setCartLoading(false));
    return null;
  } catch (error) {
    dispatch(setCartError('Failed to load cart'));
    dispatch(setCartLoading(false));
    return null;
  }
};
