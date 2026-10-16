import { useCallback, useEffect, useState } from 'react';

/**
 * Hook for the public deals page.
 *
 * Fetches GET /product/public/deals (no auth required).
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
      const res = await fetch('/api/product/public/deals');
      if (!res.ok) {
        let detail = 'Failed to load deals';
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
      setError(err?.message || 'Something went wrong while loading deals.');
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
