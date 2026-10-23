import { useCallback, useEffect, useState } from 'react';
import { productService } from '@/services';
import { productDiscountPercent } from '@/features/marketplace/utils/sortProducts';

/**
 * Hook for the public deals page.
 *
 * Fetches discounted products from backend using the filtered endpoint.
 * Returns { deals, loading, error, refresh }.
 */
export function useDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch deals directly from the backend public deals endpoint
      const response = await productService.getPublicDeals({ limit: 50 });
      const rawProducts = response.products || [];

      // Ensure discountPercent is computed and products have a genuine discount
      const dealsWithDiscounts = rawProducts
        .map((p) => {
          const discountPercent = p.discountPercent ?? productDiscountPercent(p);
          return {
            ...p,
            discountPercent,
          };
        })
        .filter((p) => {
          const original = Number(p.originalPrice || 0);
          const selling = Number(p.discountPrice ?? p.price ?? 0);
          return (p.discountPercent > 0) || (original > 0 && selling > 0 && original > selling);
        })
        .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));

      setDeals(dealsWithDiscounts);
    } catch (err) {
      setError(err?.message || 'Something went wrong while loading deals.');
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { deals, loading, error, refresh: fetchDeals };
}
