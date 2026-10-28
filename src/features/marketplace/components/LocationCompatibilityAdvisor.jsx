import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiMapPin,
  FiAlertTriangle,
  FiRefreshCw,
  FiBookmark,
  FiTrash2,
  FiArrowRight,
  FiCheckCircle,
  FiShoppingBag,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiPlus,
} from 'react-icons/fi';
import { ProductImage } from '@/components/common/ImageWithFallback';
import { productService, shopService } from '@/services';
import { addTocart, removeFromCart } from '@/store/slices/cartThunks';
import { addToWishlist } from '@/store/slices/wishlistThunks';
import DeliveryZoneSelector from '@/features/marketplace/components/DeliveryZoneSelector';

const money = (val) =>
  `ETB ${Number(val || 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

/**
 * LocationCompatibilityAdvisor
 *
 * User-friendly advisory banner displayed when one or more items in the order
 * cannot be delivered to the currently selected delivery zone/address.
 *
 * It provides:
 * 1. Clear explanation of why the delivery cannot proceed for the current location.
 * 2. Exact locations/zones where the seller DOES deliver to.
 * 3. 1-click option to switch to a compatible saved address (if available) or change zone.
 * 4. Friendly recommendations of alternative products and shops that DO deliver to the current location.
 * 5. 1-click "Swap" (replaces the incompatible item with the alternative in the cart) or "Save for Later".
 */
export default function LocationCompatibilityAdvisor({
  validation,
  currentZoneId,
  currentZoneName = '',
  onRemoveItem,
  savedAddresses = [],
  onSelectAddress,
  onZoneSelect,
  className = '',
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showZonePicker, setShowZonePicker] = useState(false);
  const [shopDetails, setShopDetails] = useState({});
  const [recommendations, setRecommendations] = useState({});
  const [alternativeShops, setAlternativeShops] = useState([]);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);
  const [swappingId, setSwappingId] = useState(null);
  const [clearingAll, setClearingAll] = useState(false);
  const [activeShopId, setActiveShopId] = useState(null);
  const [activeShopName, setActiveShopName] = useState('');
  const [activeShopProducts, setActiveShopProducts] = useState([]);
  const [loadingShopProducts, setLoadingShopProducts] = useState(false);

  const fetchedShopsRef = React.useRef(new Set());
  const fetchedRecsRef = React.useRef(new Set());

  const incompatibleItems = useMemo(() => {
    if (!validation || validation.valid !== false) return [];
    return (validation.items || []).filter((i) => i.eligible === false);
  }, [validation]);

  const targetZoneName = currentZoneName || validation?.zone?.name || 'your selected location';
  const itemSignature = incompatibleItems.map((i) => i.productId || i._id).join(',');

  // Fetch shop delivery details (to get supported zones) for incompatible shops
  useEffect(() => {
    if (!incompatibleItems.length) return;
    let isMounted = true;
    const shopIds = [...new Set(incompatibleItems.map((i) => i.shopId).filter(Boolean))]
      .filter((id) => id !== ':id' && !fetchedShopsRef.current.has(id));

    if (!shopIds.length) return;
    shopIds.forEach((id) => fetchedShopsRef.current.add(id));

    shopIds.forEach((shopId) => {
      shopService
        .getPublicById(shopId)
        .then((shop) => {
          if (!isMounted) return;
          setShopDetails((prev) => ({
            ...prev,
            [shopId]: {
              name: shop?.name || shop?.shopName || 'Store',
              zones: shop?.delivery?.zoneNames || [],
              cityName: shop?.delivery?.cityName || shop?.address?.city || '',
              address: shop?.delivery?.address || shop?.address?.street || '',
              notFound: !shop,
            },
          }));
        })
        .catch(() => {
          if (!isMounted) return;
          setShopDetails((prev) => ({
            ...prev,
            [shopId]: {
              name: 'Store',
              zones: [],
              cityName: '',
              address: '',
              notFound: true,
            },
          }));
        });
    });

    return () => {
      isMounted = false;
    };
  }, [itemSignature]);

  // Fetch alternative products and shops delivering to currentZoneId
  useEffect(() => {
    if (!incompatibleItems.length || !currentZoneId) return;
    let isMounted = true;
    setLoadingAlternatives(true);

    const pending = [];

    // Fetch alternative shops delivering to this zone
    const shopPromise = shopService
      .getPublicAll({ zoneId: currentZoneId, limit: 4 })
      .then((shops) => {
        if (!isMounted) return;
        const filtered = (shops || []).filter(
          (s) => !incompatibleItems.some((item) => String(item.shopId) === String(s._id || s.id))
        );
        setAlternativeShops(filtered.slice(0, 3));
      })
      .catch(() => {});
    pending.push(shopPromise);

    // For each incompatible item, fetch alternative products in same category or popular products in currentZoneId
    incompatibleItems.forEach((item) => {
      const itemId = item.productId || item._id;
      if (!itemId || fetchedRecsRef.current.has(itemId)) return;
      fetchedRecsRef.current.add(itemId);

      const recPromise = productService
        .getPublicPage({
          zoneId: currentZoneId,
          category: item.category || undefined,
          limit: 6,
        })
        .then((page) => {
          if (!isMounted) return;
          const candidates = (page?.products || []).filter(
            (p) => String(p._id || p.id) !== String(itemId)
          );
          setRecommendations((prev) => ({
            ...prev,
            [itemId]: candidates.slice(0, 3),
          }));
        })
        .catch(() => {
          // Fallback to top products for zone
          return productService
            .getPublicPage({ zoneId: currentZoneId, limit: 4 })
            .then((fallback) => {
              if (!isMounted) return;
              const candidates = (fallback?.products || []).filter(
                (p) => String(p._id || p.id) !== String(itemId)
              );
              setRecommendations((prev) => ({
                ...prev,
                [itemId]: candidates.slice(0, 3),
              }));
            })
            .catch(() => {});
        });
      pending.push(recPromise);
    });

    Promise.allSettled(pending).finally(() => {
      if (isMounted) setLoadingAlternatives(false);
    });

    return () => {
      isMounted = false;
    };
  }, [itemSignature, currentZoneId]);

  if (!incompatibleItems.length) return null;

  // Extract supported locations for an incompatible item
  const getSupportedLocations = (item) => {
    const fromShop = shopDetails[item.shopId]?.zones?.map((z) => (typeof z === 'string' ? z : z.name)).filter(Boolean) || [];
    if (fromShop.length > 0) return fromShop;

    if (item.message) {
      const match = item.message.match(/it serves:\s*([^)]+)/i);
      if (match && match[1]) {
        return match[1].split(',').map((s) => s.trim()).filter(Boolean);
      }
    }
    return [];
  };

  // Find if user has a saved address that matches the item's supported zones
  const getMatchingSavedAddress = (supportedLocations) => {
    if (!savedAddresses || !savedAddresses.length || !supportedLocations.length) return null;
    return savedAddresses.find((addr) => {
      const zone = addr.deliveryZoneName || addr.cityName || '';
      return supportedLocations.some((loc) =>
        loc.toLowerCase().includes(zone.toLowerCase()) || zone.toLowerCase().includes(loc.toLowerCase())
      );
    });
  };

  // Handle 1-click Swap: removes incompatible item, adds recommended product
  const handleSwapItem = async (incompatibleItem, replacementProduct) => {
    const oldId = incompatibleItem.productId || incompatibleItem._id;
    setSwappingId(oldId);
    try {
      if (onRemoveItem) {
        onRemoveItem(oldId);
      } else {
        await dispatch(removeFromCart({ productId: oldId }));
      }
      await dispatch(addTocart(replacementProduct));
      toast.success(
        `Replaced "${incompatibleItem.name}" with "${replacementProduct.name}" from ${replacementProduct.shop?.name || replacementProduct.shopName || 'a local shop'}.`
      );
    } catch {
      toast.error('Failed to swap item. Please try again.');
    } finally {
      setSwappingId(null);
    }
  };

  // Handle Save for Later
  const handleSaveForLater = async (item) => {
    const id = item.productId || item._id;
    try {
      const res = await dispatch(addToWishlist(item));
      if (onRemoveItem) {
        onRemoveItem(id);
      } else {
        await dispatch(removeFromCart({ productId: id }));
      }
      if (res) {
        toast.info(`"${item.name}" saved to your wishlist. You can buy it later for a supported address.`);
      } else {
        toast.info(`"${item.name}" removed from cart.`);
      }
    } catch {
      if (onRemoveItem) {
        onRemoveItem(id);
      } else {
        dispatch(removeFromCart({ productId: id }));
      }
      toast.info(`"${item.name}" removed from cart.`);
    }
  };

  // Handle Remove Item
  const handleRemove = (item) => {
    const id = item.productId || item._id;
    if (onRemoveItem) {
      onRemoveItem(id);
    } else {
      dispatch(removeFromCart({ productId: id }));
    }
  };

  // 1-Click Clear All Incompatible Items from Order
  const handleClearAllIncompatible = async () => {
    setClearingAll(true);
    try {
      for (const item of incompatibleItems) {
        const id = item.productId || item._id;
        if (onRemoveItem) {
          onRemoveItem(id);
        } else {
          await dispatch(removeFromCart({ productId: id }));
        }
      }
      toast.success(`Removed ${incompatibleItems.length} incompatible item(s). Your order is now ready!`);
    } catch {
      toast.error('Failed to remove incompatible items.');
    } finally {
      setClearingAll(false);
    }
  };

  // 1-Click Save All Incompatible Items to Wishlist
  const handleSaveAllForLater = async () => {
    setClearingAll(true);
    try {
      for (const item of incompatibleItems) {
        const id = item.productId || item._id;
        try {
          await dispatch(addToWishlist(item));
        } catch {}
        if (onRemoveItem) {
          onRemoveItem(id);
        } else {
          await dispatch(removeFromCart({ productId: id }));
        }
      }
      toast.info(`Saved ${incompatibleItems.length} item(s) to wishlist for later.`);
    } catch {
      toast.error('Failed to save items to wishlist.');
    } finally {
      setClearingAll(false);
    }
  };

  // Toggle view products from a verified alternative shop inline
  const handleToggleShopProducts = async (shop) => {
    const shopId = shop._id || shop.id;
    if (activeShopId === shopId) {
      setActiveShopId(null);
      setActiveShopProducts([]);
      return;
    }
    setActiveShopId(shopId);
    setActiveShopName(shop.name || 'Store');
    setLoadingShopProducts(true);
    try {
      const prods = await productService.getByShop(shopId);
      setActiveShopProducts(prods || []);
    } catch {
      setActiveShopProducts([]);
    } finally {
      setLoadingShopProducts(false);
    }
  };

  // 1-Click Add product from verified shop
  const handleAddAlternativeProduct = async (product) => {
    try {
      await dispatch(addTocart(product));
      toast.success(`Added "${product.name}" to your cart!`);
    } catch {
      toast.error('Failed to add product.');
    }
  };

  return (
    <div
      role="region"
      aria-label="Delivery location compatibility advisor"
      className={`rounded-xl border border-amber-300 bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-amber-50/80 p-4 sm:p-5 shadow-sm text-gray-900 mb-6 transition-all ${className}`}
    >
      {/* Top Banner Header */}
      <div className="flex items-start gap-3.5 pb-3 border-b border-amber-200">
        <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
          <FiAlertTriangle className="w-5 h-5 text-amber-700" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-amber-950">
              Delivery Area Notice for Your Order
            </h2>
            <span className="px-2 py-0.5 bg-amber-200/80 text-amber-900 text-xs font-semibold rounded-full">
              {incompatibleItems.length} {incompatibleItems.length === 1 ? 'item' : 'items'} incompatible
            </span>
          </div>
          <p className="text-xs sm:text-sm text-amber-900/90 mt-1 leading-relaxed">
            The items below cannot be delivered to{' '}
            <strong className="font-bold underline decoration-amber-500">{targetZoneName}</strong> because their sellers
            currently only deliver to specific zones. You can switch your delivery location, or swap with recommended
            alternatives available right now in your area.
          </p>
        </div>
      </div>

      {/* Quick 1-Click Resolution Bar */}
      <div className="mt-3 p-3 bg-amber-100/90 border border-amber-300/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="text-xs text-amber-950 font-medium">
          <span className="font-bold">Fastest fix:</span> Clear the incompatible items to finish your order immediately, or save them for later.
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            disabled={clearingAll}
            onClick={handleClearAllIncompatible}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#b12704] hover:bg-[#8f1f03] text-white text-xs font-bold rounded-lg shadow-xs transition disabled:opacity-50 cursor-pointer"
            title="Remove incompatible items so you can complete checkout immediately"
          >
            <FiTrash2 size={12} />
            <span>Remove All Incompatible ({incompatibleItems.length})</span>
          </button>
          <button
            type="button"
            disabled={clearingAll}
            onClick={handleSaveAllForLater}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] text-xs font-bold rounded-lg border border-[#a88734] shadow-xs transition disabled:opacity-50 cursor-pointer"
            title="Save incompatible items to wishlist and clear them from order"
          >
            <FiBookmark size={12} />
            <span>Save All for Later ({incompatibleItems.length})</span>
          </button>
        </div>
      </div>

      {/* Incompatible Items List */}
      <div className="mt-4 space-y-4">
        {incompatibleItems.map((item, itemIdx) => {
          const itemId = item.productId || item._id || item.id || `incompatible-item-${itemIdx}`;
          const supportedLocations = getSupportedLocations(item);
          const matchingAddress = getMatchingSavedAddress(supportedLocations);
          const itemAlternatives = recommendations[itemId] || [];

          return (
            <div
              key={itemId}
              className="rounded-xl border border-amber-200/90 bg-white p-3.5 sm:p-4 shadow-sm space-y-3.5"
            >
              {/* Product Info Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                    <ProductImage data={item} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Shop: {item.shopName || shopDetails[item.shopId]?.name || 'Partner Seller'}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                    <p className="text-xs font-bold text-[#b12704] mt-0.5">
                      {money(item.price || item.discountPrice)}
                    </p>
                  </div>
                </div>

                {/* Direct Item Actions: Save for later & Remove */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleSaveForLater(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                    title="Save to Wishlist and remove from this order"
                  >
                    <FiBookmark size={13} className="text-amber-600" />
                    <span>Save for Later</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                    title="Remove from cart"
                  >
                    <FiTrash2 size={13} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Supported Locations Guidance */}
              <div className="rounded-lg bg-amber-50/70 border border-amber-200/80 p-3 text-xs text-amber-900">
                <div className="flex items-start gap-2">
                  <FiMapPin className="text-amber-700 flex-shrink-0 mt-0.5" size={15} />
                  <div className="flex-1 space-y-1.5">
                    <p>
                      <strong>{item.shopName || 'This seller'}</strong> does not deliver to{' '}
                      <strong>{targetZoneName}</strong>.
                    </p>
                    {supportedLocations.length > 0 ? (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-amber-950">Locations to use for this item:</span>
                        {supportedLocations.map((loc, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-amber-300 rounded font-medium text-amber-900 shadow-2xs"
                          >
                            📍 {loc}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-amber-800">
                        This seller is currently not delivering to this region.
                      </p>
                    )}

                    {/* Quick Saved Address Match Switcher */}
                    {matchingAddress && onSelectAddress && (
                      <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between gap-2 flex-wrap">
                        <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                          <FiCheckCircle className="text-emerald-600" />
                          You have a matching address: {matchingAddress.address1} ({matchingAddress.deliveryZoneName || matchingAddress.cityName})
                        </span>
                        <button
                          type="button"
                          onClick={() => onSelectAddress(matchingAddress._id)}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold transition shadow-xs"
                        >
                          Switch to this Address
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommended Product Alternatives */}
              {itemAlternatives.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <span className="text-amber-600 font-extrabold">💡</span> Recommended alternatives available in{' '}
                      <span className="underline decoration-amber-400">{targetZoneName}</span>:
                    </p>
                    <span className="text-[11px] text-gray-500 font-medium">1-click to swap</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {itemAlternatives.map((alt, altIdx) => (
                      <div
                        key={alt._id || alt.id || `alt-prod-${altIdx}`}
                        className="flex flex-col justify-between p-2.5 rounded-lg border border-gray-200 bg-gray-50/70 hover:bg-white hover:border-amber-300 hover:shadow-xs transition"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-12 h-12 rounded bg-white border border-gray-100 overflow-hidden flex-shrink-0">
                            <ProductImage data={alt} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-gray-900 line-clamp-1">{alt.name}</h4>
                            <p className="text-[11px] text-gray-500 line-clamp-1">
                              {alt.shop?.name || alt.shopName || 'Verified Shop'}
                            </p>
                            <p className="text-xs font-bold text-[#b12704] mt-0.5">
                              {money(alt.discountPrice || alt.price)}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={swappingId === itemId}
                          onClick={() => handleSwapItem(item, alt)}
                          className="w-full flex items-center justify-center gap-1 py-1.5 px-2 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] text-xs font-bold rounded border border-[#a88734] transition shadow-xs disabled:opacity-50"
                        >
                          <FiRefreshCw size={11} className={swappingId === itemId ? 'animate-spin' : ''} />
                          <span>Swap with this</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Alternative Shops Section (if any alternative shops serving zone) */}
      {alternativeShops.length > 0 && (
        <div className="mt-4 pt-3.5 border-t border-amber-200/70">
          <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
            <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <FiShoppingBag className="text-amber-700" />
              Verified shops delivering directly to {targetZoneName}:
            </p>
            <span className="text-[11px] text-amber-800">
              Click a shop to see available items in your zone
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {alternativeShops.map((shop, sIdx) => {
              const shopId = shop._id || shop.id || `alt-shop-${sIdx}`;
              const isSelected = activeShopId === shopId;
              return (
                <div
                  key={shopId}
                  className={`flex flex-col p-2.5 rounded-lg border transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-100/90 border-amber-500 shadow-sm'
                      : 'bg-white border-amber-200 hover:border-amber-400 hover:shadow-xs'
                  }`}
                  onClick={() => handleToggleShopProducts(shop)}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs flex-shrink-0 border border-amber-300">
                      {(shop.name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{shop.name}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                        <FiCheckCircle size={10} /> Delivers to {targetZoneName}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleShopProducts(shop);
                      }}
                      className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isSelected ? 'Hide Products' : 'View Products'}</span>
                      {isSelected ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/shops/${shopId}`);
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                      className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                      title="Open full shop page"
                    >
                      <span>Visit Store</span>
                      <FiArrowRight size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Shop Products Accordion */}
          {activeShopId && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-amber-300 shadow-sm animate-fadeIn">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <FiShoppingBag className="text-amber-600" />
                  Products from {activeShopName} delivering to {targetZoneName}:
                </span>
                <button
                  type="button"
                  onClick={() => setActiveShopId(null)}
                  className="text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  Close
                </button>
              </div>

              {loadingShopProducts ? (
                <div className="py-4 text-center text-xs text-gray-500">Loading products…</div>
              ) : activeShopProducts.length === 0 ? (
                <div className="py-3 text-center text-xs text-gray-500">
                  No active products found for this shop in this zone.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {activeShopProducts.slice(0, 6).map((prod) => (
                    <div
                      key={prod._id || prod.id}
                      className="p-2 border border-gray-200 rounded-lg flex items-center justify-between gap-2 bg-gray-50/50"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                          <ProductImage data={prod} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{prod.name}</p>
                          <p className="text-[11px] font-semibold text-[#b12704]">
                            {money(prod.price || prod.discountPrice)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddAlternativeProduct(prod)}
                        className="px-2.5 py-1 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] text-xs font-bold rounded border border-[#a88734] transition shadow-xs flex-shrink-0 cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Change Location Option */}
      <div className="mt-4 pt-3 border-t border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-amber-900">
          Want to change your delivery location for the whole order?
        </div>
        <button
          type="button"
          onClick={() => setShowZonePicker((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 rounded-lg border border-amber-300 transition w-fit"
        >
          <FiMapPin size={13} />
          <span>{showZonePicker ? 'Close Location Picker' : 'Change Delivery Area'}</span>
          {showZonePicker ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
      </div>

      {/* Expandable Location Selector */}
      {showZonePicker && (
        <div className="mt-3 p-3 bg-white rounded-lg border border-amber-300 shadow-sm animate-fadeIn">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            Select a new city or delivery zone:
          </p>
          <DeliveryZoneSelector
            mode="any"
            label="Select New Delivery Area"
            initialValues={{ zoneId: currentZoneId, zoneName: targetZoneName }}
            onSelect={(loc) => {
              if (onZoneSelect) {
                onZoneSelect(loc);
              }
              setShowZonePicker(false);
              toast.info(`Updated delivery location to ${loc.zoneName || loc.cityName || 'new zone'}`);
            }}
          />
        </div>
      )}
    </div>
  );
}
