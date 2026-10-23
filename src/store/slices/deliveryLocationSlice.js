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
 * Shape: { regionId, regionName, cityId, cityName, zoneId, zoneName, loading, error }
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
      (parsed.zoneId || parsed.cityId || parsed.regionId || parsed.portId)
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
  regionId: saved ? saved.regionId : null,
  regionName: saved ? saved.regionName : null,
  cityId: saved ? saved.cityId : null,
  cityName: saved ? saved.cityName : null,
  zoneId: saved ? saved.zoneId : null,
  zoneName: saved ? saved.zoneName : null,
  portId: saved ? saved.portId : null,
  portName: saved ? saved.portName : null,
  loading: false,
  error: null,
};

export const deliveryLocationSlice = createSlice({
  name: 'deliveryLocation',
  initialState,
  reducers: {
    /** Persist the buyer's chosen city + zone + port. */
    setDeliveryLocation: (state, action) => {
      const next = { ...state, ...action.payload };
      for (const key of ['regionId', 'regionName', 'cityId', 'cityName', 'zoneId', 'zoneName', 'portId', 'portName']) {
        next[key] = next[key] || null;
      }
      state.regionId = next.regionId;
      state.regionName = next.regionName;
      state.cityId = next.cityId;
      state.cityName = next.cityName;
      state.zoneId = next.zoneId;
      state.zoneName = next.zoneName;
      state.portId = next.portId;
      state.portName = next.portName;
      state.error = null;
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            regionId: next.regionId,
            regionName: next.regionName,
            cityId: next.cityId,
            cityName: next.cityName,
            zoneId: next.zoneId,
            zoneName: next.zoneName,
            portId: next.portId,
            portName: next.portName,
          })
        );
      } catch {
        // storage unavailable — keep in memory only
      }
    },
    /** Clear the selected location (logout / user wants to re-pick). */
    clearDeliveryLocation: (state) => {
      state.regionId = null;
      state.regionName = null;
      state.cityId = null;
      state.cityName = null;
      state.zoneId = null;
      state.zoneName = null;
      state.portId = null;
      state.portName = null;
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
