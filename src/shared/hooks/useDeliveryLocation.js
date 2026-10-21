/**
 * useDeliveryLocation — the single way components read the buyer's selected
 * delivery city + zone.
 *
 * Reads from `state.deliveryLocation` (persisted to localStorage) and exposes
 * a setter. Components that need to react to location changes (marketplace
 * filtering, cart validation, checkout gating) should use this hook rather
 * than reading localStorage directly.
 */
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setDeliveryLocation,
  clearDeliveryLocation,
} from '@/store/slices/deliveryLocationSlice';

export function useDeliveryLocation() {
  const dispatch = useDispatch();
  const { regionId, regionName, cityId, cityName, zoneId, zoneName, loading, error } = useSelector(
    (state) => state.deliveryLocation || {}
  );

  const setLocation = useCallback((location) => {
    dispatch(setDeliveryLocation(location));
  }, [dispatch]);

  const clearLocation = useCallback(() => {
    dispatch(clearDeliveryLocation());
  }, [dispatch]);

  const hasZone = Boolean(zoneId);
  const hasLocation = Boolean(regionId || cityId || zoneId);
  const isSelected = hasLocation;

  return {
    regionId,
    regionName,
    cityId,
    cityName,
    zoneId,
    zoneName,
    loading,
    error,
    hasZone,
    hasLocation,
    isSelected,
    setLocation,
    clearLocation,
  };
}

export default useDeliveryLocation;
