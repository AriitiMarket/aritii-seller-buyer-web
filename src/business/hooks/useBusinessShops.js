import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import shopService from '@/services/shop.service';

const SELECTED_SHOP_KEY = 'aritii.business.selectedShopId';

/** Module-level cache: prevents repeated 404s from /shop/getseller across remounts */
let _ownerShopsCache = null;
let _ownerShopsFetched = false;
let _ownerShopsPromise = null;

/**
 * useBusinessShops — the business domain's shop list and active shop.
 *
 * CRITICAL BUSINESS RULE: one business may own MULTIPLE shops. Nothing in the
 * business UI may assume `business === one shop`, so this hook:
 *   1. loads every shop that belongs to the approved business account,
 *   2. tracks which shop is currently being managed (persisted per browser),
 *   3. exposes `hasMultipleShops` so the UI can show/hide the shop switcher.
 */
export function useBusinessShops() {
  const { seller, isSeller, isLoading: sellerLoading } = useSelector((state) => state.seller || {});
  const [shops, setShops] = useState(() => _ownerShopsCache || []);
  const [loading, setLoading] = useState(!_ownerShopsFetched);
  const [error, setError] = useState(null);
  const [selectedShopId, setSelectedShopId] = useState(
    () => (typeof window !== 'undefined' ? window.localStorage.getItem(SELECTED_SHOP_KEY) : null)
  );

  const load = useCallback(async (force = false) => {
    // Seller-only endpoint: a buyer/customer account must never call it (the
    // backend answers "no shop" for them). Wait for the capability check, then
    // resolve to an empty list without a request when the account is not a
    // seller — this is what used to produce a 404 on every business page load.
    if (sellerLoading) return;
    if (isSeller === false) {
      _ownerShopsFetched = true;
      _ownerShopsCache = [];
      setShops([]);
      setError(null);
      setLoading(false);
      return;
    }

    // Cached list is reused across remounts; `refresh()` (force) always
    // re-reads, so an edit made elsewhere is never masked by a stale cache.
    if (_ownerShopsFetched && !force) {
      setShops(_ownerShopsCache || []);
      setLoading(false);
      return;
    }

    // If a fetch is already in progress, wait for it instead of starting another.
    if (_ownerShopsPromise) {
      await _ownerShopsPromise;
      setShops(_ownerShopsCache || []);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    _ownerShopsPromise = (async () => {
      try {
        const ownedFromProfile = seller?.shops || (seller?.shop ? [seller.shop] : []);
        if (ownedFromProfile.length > 0) {
          _ownerShopsCache = ownedFromProfile;
          _ownerShopsFetched = true;
          setShops(ownedFromProfile);
          return;
        }

        const owned = await shopService.getByOwner();
        const list = Array.isArray(owned) ? owned : owned ? [owned] : [];
        _ownerShopsCache = list;
        _ownerShopsFetched = true;
        setShops(list);
      } catch (err) {
        _ownerShopsFetched = true;
        _ownerShopsCache = [];
        setError(err.response?.data?.message || err.message || 'Could not load your shops');
        setShops([]);
      } finally {
        setLoading(false);
        _ownerShopsPromise = null;
      }
    })();
    await _ownerShopsPromise;
  }, [seller, isSeller, sellerLoading]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (shops.length === 0) return;
    const stillExists = shops.some((shop) => shop._id === selectedShopId);
    if (!stillExists) {
      const first = shops[0]._id;
      setSelectedShopId(first);
      if (typeof window !== 'undefined') window.localStorage.setItem(SELECTED_SHOP_KEY, first);
    }
  }, [shops, selectedShopId]);

  const selectShop = useCallback((shopId) => {
    setSelectedShopId(shopId);
    if (typeof window !== 'undefined') window.localStorage.setItem(SELECTED_SHOP_KEY, shopId);
  }, []);

  const activeShop = useMemo(
    () => shops.find((shop) => shop._id === selectedShopId) || shops[0] || null,
    [shops, selectedShopId]
  );

  return {
    shops,
    activeShop,
    activeShopId: activeShop?._id || null,
    hasMultipleShops: shops.length > 1,
    loading,
    error,
    selectShop,
    refresh: () => load(true),
  };
}

export default useBusinessShops;
