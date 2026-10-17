import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts, getPublicProducts } from '@/store/slices/productThunks';
import { useAuth } from '@/auth/hooks/useAuth';
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation';

/**
 * useProducts - the single way screens read the catalog.
 *
 * Now supports backend filtering: category, price range, rating, zone, city, search.
 * Canonical source of truth: `state.products.allProducts` (store/slices/productSlice).
 *
 * When filters are provided, they are passed to the backend API for server-side
 * filtering, aggregation, and accurate product counts.
 * 
 * Features:
 * - Auto-load on mount (controlled by `auto` flag)
 * - Memoized filters to prevent infinite reloads
 * - Timeout protection (30s max for initial load)
 * - Prevents duplicate simultaneous requests
 */
export function useProducts({ auto = true, filters = {} } = {}) {
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { zoneId, cityId, hasZone } = useDeliveryLocation();
  const { allProducts = [], isLoading: loading, error } = useSelector(
    (state) => state.products || {}
  );

  // Memoize filters to prevent unnecessary re-renders and infinite loops
  const memoizedFilters = useMemo(() => {
    return {
      ...filters,
      ...(hasZone ? { zoneId, cityId } : {}),
    };
  }, [filters, hasZone, zoneId, cityId]);

  // Track if we've already initiated a request to prevent duplicates
  const hasInitiatedRef = useRef(false);

  const refresh = useCallback(() => {
    if (isAuthenticated) {
      dispatch(getAllProducts(memoizedFilters));
    } else {
      dispatch(getPublicProducts(memoizedFilters));
    }
  }, [dispatch, isAuthenticated, memoizedFilters]);

  useEffect(() => {
    if (!auto || authLoading) return;
    
    // Prevent duplicate requests if already initiated or if products exist
    if (hasInitiatedRef.current || allProducts.length > 0) {
      return;
    }

    hasInitiatedRef.current = true;
    refresh();

    // Reset the ref after a short delay to allow manual refresh
    const timeoutId = setTimeout(() => {
      hasInitiatedRef.current = false;
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [auto, authLoading, allProducts.length, refresh]);

  return { products: allProducts, loading, error, refresh };
}

/**
 * useFilteredProducts - DEPRECATED: filtering now happens on the backend
 * 
 * This is kept for backward compatibility but should no longer be used.
 * Instead, pass filters to useProducts() which sends them to the backend.
 * 
 * For client-side searching/filtering that happens after products are loaded,
 * this can still be used, but primary filtering should always be done server-side.
 */
export function useFilteredProducts(products, { category, shop, search } = {}) {
  return useMemo(() => {
    // If filters are empty, return products as-is (backend already applied filters)
    if (!category && !shop && !search) {
      return products;
    }

    let filtered = Array.isArray(products) ? [...products] : [];

    // Only apply client-side filtering if needed (e.g., for instant search)
    if (search?.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((product) => {
        const name = (product.name || '').toLowerCase();
        const productCategory = (product.category || '').toLowerCase();
        const shopName = (product?.shop?.name || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        return (
          name.includes(q) ||
          productCategory.includes(q) ||
          shopName.includes(q) ||
          description.includes(q)
        );
      });
    }

    if (category) {
      filtered = filtered.filter(
        (product) => (product.category || '').toLowerCase() === category.toLowerCase()
      );
    }

    if (shop) {
      filtered = filtered.filter((product) => {
        const shopName = product?.shop?.name || '';
        return String(shopName).toLowerCase() === shop.toLowerCase();
      });
    }

    return filtered;
  }, [products, category, shop, search]);
}

export default useProducts;
