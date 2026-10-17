import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts, getPublicProducts } from '@/store/slices/productThunks';
import { useAuth } from '@/auth/hooks/useAuth';
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation';

/**
 * useProducts - the single way screens read the catalog.
 *
 * Canonical source of truth: `state.products.allProducts` (store/slices/productSlice).
 * The hook is the access layer:
 *   page -> useProducts -> slice (read) + productThunks (write) -> feature service -> API client
 *
 * Seeds the store on first use. Dispatches the public thunk for guests and the
 * authenticated thunk for logged-in users, so guests never receive private fields.
 *
 * Location-aware: when the buyer has a delivery zone selected, products are
 * fetched scoped to that zone so only shops serving it appear in the catalog.
 */
export function useProducts({ auto = true } = {}) {
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { zoneId, cityId, hasZone } = useDeliveryLocation();
  const { allProducts = [], isLoading: loading, error } = useSelector(
    (state) => state.products || {}
  );

  const refresh = useCallback(() => {
    const options = hasZone ? { zoneId, cityId } : {};
    if (isAuthenticated) {
      dispatch(getAllProducts(options));
    } else {
      dispatch(getPublicProducts(options));
    }
  }, [dispatch, isAuthenticated, hasZone, zoneId, cityId]);

  useEffect(() => {
    if (!auto || authLoading) return;
    if (allProducts.length === 0) {
      const options = hasZone ? { zoneId, cityId } : {};
      if (isAuthenticated) {
        dispatch(getAllProducts(options));
      } else {
        dispatch(getPublicProducts(options));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, authLoading, isAuthenticated, dispatch, hasZone, zoneId, cityId]);

  return { products: allProducts, loading, error, refresh };
}

/**
 * useFilteredProducts - filters that come from the URL
 * (`category`, `shop`, `search`) applied to a product list. One implementation
 * instead of one per page.
 */
export function useFilteredProducts(products, { category, shop, search } = {}) {
  return useMemo(() => {
    let filtered = Array.isArray(products) ? [...products] : [];

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

    // Default relevance: best sellers first when no explicit filter is applied.
    if (!search && !category && !shop) {
      filtered.sort(
        (a, b) => (b.sold_out ?? b.total_sell ?? 0) - (a.sold_out ?? a.total_sell ?? 0)
      );
    }

    return filtered;
  }, [products, category, shop, search]);
}

export default useProducts;
