import { useState, useEffect, useCallback } from 'react';
import { providerDeliveryApi } from '../services/providerDeliveryApi';
import { apiErrorMessage } from '../utils/providerDeliveryHelpers';

/**
 * useProviderAvailability — single source of truth for the rider's online state.
 *
 * Fetches the caller's own provider record (`GET /delivery/provider/me`) and
 * exposes `isOnline` plus a `toggleAvailability` that calls
 * `PUT /delivery/provider/:id/online`. Used by the header toggle, the overview
 * page, and the profile page so all three stay in sync.
 */
export const useProviderAvailability = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    providerDeliveryApi
      .getProviderProfile()
      .then(({ profile, supported, message }) => {
        if (cancelled) return;
        setIsOnline(profile?.availability?.isOnline ?? false);
        if (!supported) setError(message || 'Provider availability is not available for this account.');
      })
      .catch((err) => {
        if (!cancelled) setError(apiErrorMessage(err, 'Could not load provider availability'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Header and overview mount separate hook instances; publish successful
  // updates so both status controls stay in step with the same backend value.
  useEffect(() => {
    const handleAvailabilityChange = (event) => setIsOnline(Boolean(event.detail?.isOnline));
    window.addEventListener('provider-availability-change', handleAvailabilityChange);
    return () => window.removeEventListener('provider-availability-change', handleAvailabilityChange);
  }, []);

  const toggleAvailability = useCallback(async () => {
    setToggling(true);
    setError(null);
    try {
      const { profile } = await providerDeliveryApi.getProviderProfile();
      const providerId = profile?._id;
      if (!providerId) {
        setError('This account is not a delivery provider');
        return;
      }
      const next = !isOnline;
      const result = await providerDeliveryApi.updateAvailability(providerId, next);
      if (result?.success) {
        const online = result.provider?.availability?.isOnline ?? next;
        setIsOnline(online);
        window.dispatchEvent(new CustomEvent('provider-availability-change', { detail: { isOnline: online } }));
      } else {
        setError(apiErrorMessage(result.error, 'Failed to update availability'));
      }
    } catch (err) {
      setError(apiErrorMessage(err, 'Failed to update availability'));
    } finally {
      setToggling(false);
    }
  }, [isOnline]);

  return { isOnline, loading, toggling, error, toggleAvailability };
};

export default useProviderAvailability;
