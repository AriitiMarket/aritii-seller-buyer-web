/**
 * useDeliveryLocation — the single way components read the buyer's selected
 * delivery city + zone.
 *
 * Reads from `state.deliveryLocation` (persisted to localStorage) and exposes
 * a setter. Components that need to react to location changes (marketplace
 * filtering, cart validation, checkout gating) should use this hook rather
 * than reading localStorage directly.
 */
import { useSelector, useDispatch } from 'react-redux';
import {
  setDeliveryLocation,
  clearDeliveryLocation,
} from '@/store/slices/deliveryLocationSlice';

export function useDeliveryLocation() {
  const dispatch = useDispatch();
  const { cityId, cityName, zoneId, zoneName, loading, error } = useSelector(
    (state) => state.deliveryLocation || {}
  );

  const setLocation = (location) => {
    dispatch(setDeliveryLocation(location));
  };

  const clearLocation = () => {
    dispatch(clearDeliveryLocation());
  };

  const hasZone = Boolean(zoneId);
  const isSelected = Boolean(cityId || zoneId);

  return {
    cityId,
    cityName,
    zoneId,
    zoneName,
    loading,
    error,
    hasZone,
    isSelected,
    setLocation,
    clearLocation,
  };
}

export default useDeliveryLocation;
