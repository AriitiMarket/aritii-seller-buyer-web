import { useCallback, useEffect, useState } from 'react';

/**
 * Hook for the public best-sellers page.
 * Fetches GET /product/public/best-selling (no auth required).
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
      const res = await fetch('/api/product/public/best-selling');
      if (!res.ok) {
        let detail = 'Failed to load best sellers';
        try {
          const body = await res.json();
          if (body?.error) detail = body.error;
        } catch {
          /* ignore JSON parse failure */
        }
        throw new Error(detail);
      }
      const json = await res.json();
      setDeals(json.products || []);
    } catch (err) {
      setError(err?.message || 'Something went wrong while loading best sellers.');
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
