import { useEffect, useState } from 'react';
import locationService from '@/services/location.service';

/**
 * useDeliveryZones — fetch all public delivery zones from the backend.
 * Used by location selectors, headers, and filter components.
 *
 * Returns zones with name, id, and coverage info.
 * Caches results to avoid repeated API calls.
 */
export function useDeliveryZones() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchZones = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await locationService.listZones();
        if (isMounted) {
          setZones(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch delivery zones:', err);
          setError(err?.message || 'Failed to fetch delivery zones');
          setZones([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchZones();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    zones,
    loading,
    error,
  };
}

export default useDeliveryZones;
