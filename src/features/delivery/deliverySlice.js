/**
 * Delivery Slice Surface (features/delivery/deliverySlice.js)
 *
 * Domain-scoped Redux state API for the delivery provider operations
 * and regional delivery location routing.
 */
export { deliveryLocationReducer } from '@/store/slices/deliveryLocationSlice';
export {
  setDeliveryLocation,
  clearDeliveryLocation,
  setDeliveryLocationLoading,
  setDeliveryLocationError,
} from '@/store/slices/deliveryLocationSlice';

/* Canonical Selectors for Delivery State */
export const selectDeliveryLocation = (state) => state.deliveryLocation;
export const selectDeliveryZone = (state) => state.deliveryLocation?.zoneName;
export const selectDeliveryZoneId = (state) => state.deliveryLocation?.zoneId;
export const selectDeliveryCity = (state) => state.deliveryLocation?.cityName;
export const selectDeliveryLocationLoading = (state) => Boolean(state.deliveryLocation?.loading);
export const selectDeliveryLocationError = (state) => state.deliveryLocation?.error;
