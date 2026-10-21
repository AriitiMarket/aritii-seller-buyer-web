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
      // Use existing public filtered endpoint
      // Filter for products with discounts
      const response = await productService.getPublicFiltered({
        page: 1,
        limit: 24,
      });
      
      // Filter and sort by discount percentage (discountPrice vs list price).
      const dealsWithDiscounts = (response.products || [])
        .filter(p => p.discountPrice && p.price && p.discountPrice < p.price)
        .map(p => ({
          ...p,
          discountPercent: productDiscountPercent(p),
        }))
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
