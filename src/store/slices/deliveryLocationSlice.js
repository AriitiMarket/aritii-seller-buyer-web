/**
 * Delivery-location slice — the buyer's selected city + delivery zone.
 *
 * This is the single source of truth for "where am I shopping?" across the
 * marketplace. It is persisted to localStorage so a guest's choice survives
 * page refreshes, and it drives:
 *   * marketplace discovery (only shops serving the selected zone are shown)
 * * cart validation (items from shops not serving the zone are flagged)
 *   * checkout gating (one order = one validated delivery zone)
 *
 * Shape: { cityId, cityName, zoneId, zoneName, loading, error }
 */
import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'aritii:deliveryLocation';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      (parsed.zoneId || parsed.cityId)
    ) {
      return parsed;
    }
  } catch {
    // ignore malformed storage
  }
  return null;
}

const saved = loadFromStorage();

const initialState = {
  cityId: saved ? saved.cityId : null,
  cityName: saved ? saved.cityName : null,
  zoneId: saved ? saved.zoneId : null,
  zoneName: saved ? saved.zoneName : null,
  loading: false,
  error: null,
};

export const deliveryLocationSlice = createSlice({
  name: 'deliveryLocation',
  initialState,
  reducers: {
    /** Persist the buyer's chosen city + zone. */
    setDeliveryLocation: (state, action) => {
      const { cityId, cityName, zoneId, zoneName } = action.payload;
      state.cityId = cityId;
      state.cityName = cityName;
      state.zoneId = zoneId;
      state.zoneName = zoneName;
      state.error = null;
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ cityId, cityName, zoneId, zoneName })
        );
      } catch {
        // storage unavailable — keep in memory only
      }
    },
    /** Clear the selected location (logout / user wants to re-pick). */
    clearDeliveryLocation: (state) => {
      state.cityId = null;
      state.cityName = null;
      state.zoneId = null;
      state.zoneName = null;
      state.error = null;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    },
    setDeliveryLocationLoading: (state, action) => {
      state.loading = action.payload;
    },
    setDeliveryLocationError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const deliveryLocationReducer = deliveryLocationSlice.reducer;
export const {
  setDeliveryLocation,
  clearDeliveryLocation,
  setDeliveryLocationLoading,
  setDeliveryLocationError,
} = deliveryLocationSlice.actions;

export default deliveryLocationReducer;
