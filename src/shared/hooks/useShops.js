import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllShops, getPublicShops } from '@/store/slices/shopThunks';
import { useAuth } from '@/auth/hooks/useAuth';

/**
 * useShops - the single way screens read shops.
 *
 * Canonical source of truth: `state.shop.shops` (store/slices/shopSlice); the
 * hook seeds it through shopThunks -> shop service -> API client. Dispatches the
 * public thunk for guests and the authenticated thunk for logged-in users.
 */
export function useShops({ auto = true } = {}) {
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { shops = [], shopsLoading: loading, error } = useSelector(
    (state) => state.shop || {}
  );

  const refresh = useCallback(() => {
    if (isAuthenticated) {
      dispatch(getAllShops());
    } else {
      dispatch(getPublicShops());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!auto || authLoading) return;
    if (shops.length === 0) {
      if (isAuthenticated) {
        dispatch(getAllShops());
      } else {
        dispatch(getPublicShops());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, authLoading, isAuthenticated, dispatch]);

  return { shops, loading, error, refresh };
}

/** Filter shops by search text and/or a shop category (type 'business'). */
export function filterShops(shops, { search, category } = {}) {
  let filtered = Array.isArray(shops) ? [...shops] : [];

  if (search?.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter((shop) => {
      const name = (shop.name || '').toLowerCase();
      const description = (shop.description || '').toLowerCase();
      const type = (shop.category || '').toLowerCase();
      return name.includes(q) || description.includes(q) || type.includes(q);
    });
  }

  if (category) {
    filtered = filtered.filter(
      (shop) => String(shop.category || '').trim().toLowerCase() === category.trim().toLowerCase()
    );
  }

  return filtered;
}

export default useShops;
