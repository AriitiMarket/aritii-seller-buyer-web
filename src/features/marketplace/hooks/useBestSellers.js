import { useCallback, useEffect, useState } from 'react';
import { productService } from '@/services';

/**
 * Hook for the public best-sellers page.
 * Fetches products sorted by sales/rating from backend.
 * Returns { deals, loading, error, refresh } where deals carry unitsSold.
 */
export function useBestSellers() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBestSellers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use existing public filtered endpoint with empty filters
      // Backend will return products, we sort by rating/sales on frontend
      const response = await productService.getPublicFiltered({
        page: 1,
        limit: 24,
      });
      
      // Rank by units sold, then by rating. Unrated products are kept — the
      // previous `ratings >= 4` filter hid every new/unrated product from the
      // page, and nothing in the API returns a `unitsSold` field, so the
      // "Best Sellers" sort had nothing to sort on.
      const sorted = (response.products || [])
        .map((p) => ({
          ...p,
          unitsSold: p.sold_out ?? p.total_sell ?? 0,
        }))
        .sort((a, b) => (b.ratings || 0) - (a.ratings || 0))
        .sort((a, b) => b.unitsSold - a.unitsSold);
      
      setDeals(sorted);
    } catch (err) {
      setError(err?.message || 'Something went wrong while loading best sellers.');
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBestSellers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { deals, loading, error, refresh: fetchBestSellers };
}
