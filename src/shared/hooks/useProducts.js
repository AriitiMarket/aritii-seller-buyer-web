import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicProducts } from '@/store/slices/productThunks';
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
  const { regionId, cityId, zoneId } = useDeliveryLocation();
  const { allProducts = [], isLoading: loading, error } = useSelector(
    (state) => state.products || {}
  );

  // Memoize filters to prevent unnecessary re-renders and infinite loops
  const memoizedFilters = useMemo(() => {
    return {
      ...filters,
      ...(!filters.regionId && regionId ? { regionId } : {}),
      ...(!filters.cityId && cityId ? { cityId } : {}),
      ...(!filters.zoneId && zoneId ? { zoneId } : {}),
    };
  }, [filters, regionId, cityId, zoneId]);

  // Refetch exactly when the filters CHANGE (e.g. a new ?search= term coming from
  // the URL), not on every render. The JSON signature absorbs the per-render
  // identity churn of the `filters` object while still detecting a real change —
  // so a new search term always triggers a fresh backend query.
  const filterSignature = JSON.stringify(memoizedFilters);
  const lastRequestedSignatureRef = useRef(null);

  const refresh = useCallback(() => {
    // Marketplace discovery always uses the public, server-filtered catalog.
    // It applies the same visibility rules to guests and signed-in buyers.
    dispatch(getPublicProducts(memoizedFilters));
  }, [dispatch, memoizedFilters]);

  useEffect(() => {
    if (!auto) return;
    // Already requested these exact filters — skip (dedupe per signature).
    if (lastRequestedSignatureRef.current === filterSignature) return;
    lastRequestedSignatureRef.current = filterSignature;
    refresh();
  }, [auto, filterSignature, refresh]);

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
