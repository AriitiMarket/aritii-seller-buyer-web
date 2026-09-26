import { useCallback, useEffect, useState } from 'react';
import promotionService from '@/services/promotion.service';

/**
 * usePromotions — commercial offers (their own feature, separate from the
 * catalog and from events).
 *
 * The backend promotions endpoint is not part of the current gateway surface, so
 * the service returns `supported: false` on 404/501 and the UI shows a clear
 * empty state instead of fabricated offers.
 */
export function usePromotions({ auto = true } = {}) {
  const [promotions, setPromotions] = useState([]);
  const [supported, setSupported] = useState(true);
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState(null);

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await promotionService.getAll();
      setPromotions(result.promotions || []);
      setSupported(result.supported !== false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not load promotions');
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!auto) return;
    let active = true;
    (async () => {
      if (active) await fetchPromotions();
    })();
    return () => {
      active = false;
    };
  }, [auto, fetchPromotions]);

  return { promotions, supported, loading, error, refresh: fetchPromotions };
}

export default usePromotions;
