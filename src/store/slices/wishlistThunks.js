import { api } from '@/services';
import { toast } from 'react-toastify';
import { tokenStore } from '@/services/tokenStore';
import {
  setWishlist,
  clearWishlist,
  setWishlistLoading,
  setWishlistError,
} from './wishlistSlice';

const API_BASE = '/wishlist';
let wishlistFetchPromise = null;

/**
 * Normalize a backend wishlist item so client code can match on the product id
 * (`_id`), the same way full product objects do.
 */
export function normalizeWishlistItem(item) {
  const productId = String(item?.productId || item?._id || '');
  return {
    ...item,
    _id: productId,
    productId,
    name: item?.name || '',
    price: Number(item?.price) || 0,
  };
}

function itemsFromResponse(response) {
  const wishlist = response?.wishlist;
  const items = Array.isArray(wishlist?.items) ? wishlist.items : [];
  return items.map(normalizeWishlistItem);
}

function persist(items) {
  localStorage.setItem('wishlistItems', JSON.stringify(items));
}

/**
 * Fetch the logged-in user's wishlist from the backend (source of truth).
 * 401 (guest) clears local state silently instead of surfacing an error.
 */
export const fetchWishlist = () => async (dispatch) => {
  // Wishlist is private. Do not issue a guaranteed 401 for guests, and collapse
  // simultaneous bootstrap/page requests into one network call.
  if (!tokenStore.getAccessToken() && !tokenStore.getRefreshToken()) {
    dispatch(clearWishlist());
    localStorage.removeItem('wishlistItems');
    dispatch(setWishlistError(null));
    dispatch(setWishlistLoading(false));
    return null;
  }
  if (wishlistFetchPromise) return wishlistFetchPromise;

  dispatch(setWishlistLoading(true));
  wishlistFetchPromise = (async () => {
    try {
      const { data: response } = await api.get(API_BASE);
      const items = itemsFromResponse(response);
      dispatch(setWishlist(items));
      persist(items);
      dispatch(setWishlistError(null));
      return response?.wishlist || null;
    } catch (error) {
      if (error?.response?.status === 401) {
        dispatch(clearWishlist());
        localStorage.removeItem('wishlistItems');
        dispatch(setWishlistError(null));
      } else {
        dispatch(
          setWishlistError(error?.response?.data?.message || 'Failed to load wishlist')
        );
      }
      return null;
    } finally {
      wishlistFetchPromise = null;
      dispatch(setWishlistLoading(false));
    }
  })();
  return wishlistFetchPromise;
};

/**
 * Add a product to the wishlist — the backend validates the product and
 * returns the authoritative name/price snapshot.
 * Returns the wishlist on success, null on failure (failure is toasted here).
 */
export const addToWishlist = (data) => async (dispatch) => {
  const productId = data?._id || data?.productId || data?.id;
  if (!productId) {
    toast.error('Could not save product', { toastId: 'wishlist-action' });
    return null;
  }

  dispatch(setWishlistLoading(true));
  try {
    const { data: response } = await api.post(API_BASE, {
      productId: String(productId),
      name: data?.name,
      price: Number(data?.discountPrice ?? data?.price ?? 0),
    });
    const items = itemsFromResponse(response);
    dispatch(setWishlist(items));
    persist(items);
    dispatch(setWishlistError(null));
    return response?.wishlist || null;
  } catch (error) {
    const message = error?.response?.data?.message || 'Could not add to wishlist';
    dispatch(setWishlistError(message));
    toast.error(message, { toastId: 'wishlist-action' });
    return null;
  } finally {
    dispatch(setWishlistLoading(false));
  }
};

/**
 * Remove a product from the wishlist via backend.
 * Returns the wishlist on success, null on failure (failure is toasted here).
 */
export const removeFromWishlist = (data) => async (dispatch) => {
  const productId = data?._id || data?.productId || data?.id;
  if (!productId) return null;

  dispatch(setWishlistLoading(true));
  try {
    const { data: response } = await api.delete(`${API_BASE}/${productId}`);
    const items = itemsFromResponse(response);
    dispatch(setWishlist(items));
    persist(items);
    dispatch(setWishlistError(null));
    return response?.wishlist || null;
  } catch (error) {
    const status = error?.response?.status;
    if (status === 404) {
      // Already removed (e.g. from another tab/device) — resync and report
      // success, since the item is gone as requested.
      dispatch(fetchWishlist());
      return { resynced: true };
    }
    const message = error?.response?.data?.message || 'Could not remove from wishlist';
    dispatch(setWishlistError(message));
    toast.error(message, { toastId: 'wishlist-action' });
    return null;
  } finally {
    dispatch(setWishlistLoading(false));
  }
};

/**
 * Clear the entire wishlist via backend (DELETE /wishlist).
 */
export const clearWishlistRequest = () => async (dispatch) => {
  try {
    const { data: response } = await api.delete(API_BASE);
    const items = itemsFromResponse(response);
    dispatch(setWishlist(items));
    persist(items);
    dispatch(setWishlistError(null));
    return response?.wishlist || null;
  } catch (error) {
    const message = error?.response?.data?.message || 'Could not clear wishlist';
    dispatch(setWishlistError(message));
    toast.error(message, { toastId: 'wishlist-action' });
    return null;
  }
};
