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
      
      // Sort by rating descending to get "best sellers"
      const sorted = (response.products || [])
        .filter(p => p.ratings >= 4) // Only highly rated products
        .sort((a, b) => (b.ratings || 0) - (a.ratings || 0))
        .sort((a, b) => (b.sold_out || b.total_sell || 0) - (a.sold_out || a.total_sell || 0));
      
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
