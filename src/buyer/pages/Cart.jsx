import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ProductImage } from '@/components/common/ImageWithFallback';
import EmptyState from '@/components/common/EmptyState';
import { removeFromCart, updateCartQuantity, fetchCart, validateCartForZone } from '@/store/slices/cartThunks';
import { setCartError } from '@/store/slices/cartSlice';
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation';
import DeliveryZoneSelector from '@/features/marketplace/components/DeliveryZoneSelector';
import LocationCompatibilityAdvisor from '@/features/marketplace/components/LocationCompatibilityAdvisor';
import { shopService } from '@/services';
import { toast } from 'react-toastify';
import { money2, quoteCartDelivery } from '@/shared/utils/deliveryPricing';

const money = (value) =>
  `${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`;

const BuyerCartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart = [], isLoading, error: cartError } = useSelector((state) => state.cart || {});
  const { isAuthenticated } = useSelector((state) => state.user || {});
  const { zoneId, zoneName, cityName, regionId, regionName, cityId, hasZone, setLocation } = useDeliveryLocation();
  const [zoneValidation, setZoneValidation] = useState(null);
  const [validating, setValidating] = useState(false);
  const [saveForLaterItems, setSaveForLaterItems] = useState({});
  const [shopNames, setShopNames] = useState({});
  // The shipping fee and the ETA are the Delivery Service's answer, not a
  // guess made in the storefront — the cart and the checkout quote the same
  // way, so the buyer never sees two different totals for one basket.
  const [deliveryQuote, setDeliveryQuote] = useState({ quotes: {}, total: 0, error: '', eta: null });
  const [loadingQuote, setLoadingQuote] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    let active = true;
    const ids = [...new Set(cart.map((item) => item.shopId || item.shop?._id)
      .filter((id) => id && id !== ':id' && !shopNames[id] && !cart.some((item) => String(item.shopId || item.shop?._id) === String(id) && (item.shop?.name || item.shopName))))];
    if (!ids.length) return undefined;
    Promise.all(ids.map(async (id) => {
      try {
        const shop = await shopService.getPublicById(id);
        return [id, shop?.name || shop?.shopName || 'Store'];
      } catch {
        return [id, 'Store'];
      }
    })).then((entries) => {
      if (active) setShopNames((previous) => ({ ...previous, ...Object.fromEntries(entries) }));
    });
    return () => { active = false; };
  }, [cart, shopNames]);

  const cartSignature = (cart || []).map((i) => `${i.productId || i._id}:${i.quantity || 1}`).join('|');

  useEffect(() => {
    if (!cart.length || !hasZone) {
      setZoneValidation(null);
      return;
    }
    setValidating(true);
    dispatch(validateCartForZone(zoneId))
      .then((result) => {
        setZoneValidation(result);
      })
      .catch(() => setZoneValidation(null))
      .finally(() => setValidating(false));
  }, [cartSignature, zoneId, hasZone, dispatch]);

  useEffect(() => {
    if (!cart.length || !hasZone) {
      setDeliveryQuote({ quotes: {}, total: 0, error: '', eta: null });
      return undefined;
    }
    let active = true;
    setLoadingQuote(true);
    quoteCartDelivery({ cart, zoneId })
      .then((quote) => {
        if (!active) return;
        setDeliveryQuote(quote);
      })
      .catch((error) => {
        if (!active) return;
        setDeliveryQuote({
          quotes: {},
          total: 0,
          error: error?.response?.data?.message || 'Delivery fee could not be calculated. Please check your delivery zone.',
          eta: null,
        });
      })
      .finally(() => {
        if (active) setLoadingQuote(false);
      });
    return () => {
      active = false;
    };
  }, [cartSignature, zoneId, hasZone]);

  const subtotal = cart.reduce(
    (acc, item) => acc + (Number(item.quantity) || 1) * Number(item.price || item.discountPrice || 0),
    0
  );
  // Shipping is the Delivery Service's quote for this zone and these
  // quantities. It used to be `subtotal * 3%` guessed in the storefront, which
  // disagreed with the checkout's server quote for the same basket.
  const shipping = money2(deliveryQuote.total);
  const total = money2(subtotal + shipping);
  const etaText = deliveryQuote.eta?.text || 'Delivery time confirmed at checkout';

  const shopGroups = cart.reduce((groups, item) => {
    const shopId = item.shopId || item.shop?._id || 'unknown';
    const shopName = item.shop?.name || item.shopName || shopNames[shopId] || (typeof item.shop === 'string' && item.shop !== shopId ? item.shop : 'Shop');
    if (!groups[shopId]) {
      groups[shopId] = { shopName, items: [], shopSubtotal: 0 };
    }
    groups[shopId].items.push(item);
    groups[shopId].shopSubtotal += (Number(item.quantity) || 1) * Number(item.price || item.discountPrice || 0);
    return groups;
  }, {});

  const shopEntries = Object.entries(shopGroups);

  const setQty = (item, next) => {
    const productId = item.productId || item._id;
    if (next < 1) {
      dispatch(removeFromCart({ productId }));
    } else {
      dispatch(updateCartQuantity(productId, next));
    }
  };

  const handleSaveForLater = (itemId) => {
    setSaveForLaterItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
    toast.info('Item saved for later');
  };

  const hasIncompatibleItems = zoneValidation && zoneValidation.valid === false;
  const incompatibleCount = zoneValidation?.items?.filter((i) => i.eligible === false).length || 0;

  if (isLoading && cart.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2162a1] mx-auto mb-4" />
          <p className="text-market-on-surface-variant text-sm">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse the marketplace and add items to your cart."
        action={
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 bg-market-primary text-market-on-primary rounded font-semibold hover:bg-market-primary-hover transition"
          >
            Browse products
          </Link>
        }
      />
    );
  }

  return (
    <div className="bg-market-surface-dim min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-market-on-surface">Shopping Cart</h1>
          <Link
            to="/products"
            className="text-market-secondary hover:text-market-secondary-hover font-medium transition"
          >
            Continue shopping
          </Link>
        </div>

        {/* Responsive Cart Error Banner */}
        {cartError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between gap-3 shadow-sm" role="alert">
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-bold">⚠️</span>
              <span>{cartError}</span>
            </div>
            <button
              type="button"
              onClick={() => dispatch(setCartError(null))}
              className="text-red-600 hover:text-red-800 font-bold text-xs uppercase px-2 py-1 rounded hover:bg-red-100 transition"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Delivery zone banner */}
        {hasZone && (
          <div className="flex items-center gap-3 px-4 py-3 bg-[#75d04b]/10 border border-[#75d04b]/20 rounded-lg mb-6">
            <span className="text-[#75d04b] font-medium">📍</span>
            <span className="text-sm text-market-on-surface">
              Delivering to <span className="font-medium text-market-secondary">{zoneName}</span>{cityName ? `, ${cityName}` : ''}
            </span>
            {hasIncompatibleItems && (
              <span className="ml-auto text-amber-600 font-medium">
                ⚠ {incompatibleCount} item{incompatibleCount !== 1 ? 's' : ''} not eligible for this zone
              </span>
            )}
          </div>
        )}

        {!hasZone && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
            <div className="mb-3">
              <p className="text-sm font-semibold text-amber-900">Choose a delivery area to check availability</p>
              <p className="mt-1 text-sm text-amber-800">We use your zone to confirm each shop can deliver there and calculate delivery costs before you place the order.</p>
            </div>
            <DeliveryZoneSelector
              mode="any"
              label="Delivery area"
              initialValues={{ regionId, regionName, cityId, cityName, zoneId, zoneName }}
              onSelect={setLocation}
            />
          </div>
        )}

        {/* Zone validation & Location Compatibility Advisor */}
        {zoneValidation && zoneValidation.valid === false && (
          <LocationCompatibilityAdvisor
            validation={zoneValidation}
            currentZoneId={zoneId}
            currentZoneName={zoneName}
            onRemoveItem={(productId) => dispatch(removeFromCart({ productId }))}
            onZoneSelect={setLocation}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-5 lg:gap-7 items-start">
          {/* Main Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-market-border divide-y divide-market-border">
              {shopEntries.map(([shopId, group]) => (
                <div key={shopId} className="p-5">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-market-border">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-market-on-surface">{group.shopName}</span>
                      <span className="text-xs text-market-on-surface-variant">({group.items.length} item{group.items.length !== 1 ? 's' : ''})</span>
                    </div>
                    <span className="text-base font-semibold text-market-on-surface">{etaText}</span>
                  </div>
                  <div className="space-y-5">
                    {group.items.map((item) => {
                      const qty = Number(item.quantity) || 1;
                      const unit = Number(item.price || item.discountPrice || 0);
                      const stock = Number(item.stock) || Infinity;
                      const isIncompatible = zoneValidation?.items?.some(
                        (i) => (i.productId || i._id) === (item.productId || item._id) && i.eligible === false
                      );
                      const itemId = item.productId || item._id;

                      return (
                        <div key={itemId} className="flex gap-4 pb-5 border-b border-market-border last:border-0">
                          {/* Product Image */}
                          <Link to={`/product/${itemId}`} className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden bg-gray-100">
                            <ProductImage data={item} className="w-full h-full object-cover" />
                          </Link>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${itemId}`} className="text-sm font-medium text-market-on-surface hover:text-market-primary line-clamp-2">
                              {item.name}
                            </Link>
                            <p className="text-xs text-market-on-surface-variant mt-1">
                              {item.shop?.name || item.shopName || shopNames[item.shopId || item.shop?._id] || 'Shop'}
                            </p>

                            {/* Quantity Controls & Price */}
                            <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                              {/* Larger 44px Quantity Buttons */}
                              <div className="flex items-center border border-market-border rounded-md bg-white">
                                <button
                                  onClick={() => setQty(item, qty - 1)}
                                  disabled={qty <= 1 || isIncompatible}
                                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-l flex items-center justify-center text-market-on-surface hover:bg-market-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition font-semibold"
                                  aria-label="Decrease quantity"
                                >
                                  −
                                </button>
                                <span className="w-10 sm:w-12 text-center text-sm font-semibold text-market-on-surface border-l border-r border-market-border">{qty}</span>
                                <button
                                  onClick={() => setQty(item, qty + 1)}
                                  disabled={qty >= stock || isIncompatible}
                                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-r flex items-center justify-center text-market-on-surface hover:bg-market-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition font-semibold"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>

                              {/* Price */}
                              <div className="text-right ml-auto sm:ml-0">
                                <p className={`text-base sm:text-lg font-bold ${isIncompatible ? 'text-amber-600' : 'text-market-on-surface'}`}>
                                  {money(unit * qty)}
                                </p>
                                {unit && <p className="text-xs text-market-on-surface-variant">{money(unit)} each</p>}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 mt-3">
                              <button
                                onClick={() => dispatch(removeFromCart({ productId: itemId }))}
                                className="text-xs text-market-on-surface-variant hover:text-market-tertiary transition"
                                aria-label={`Delete ${item.name}`}
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => handleSaveForLater(itemId)}
                                className="text-xs text-market-secondary hover:text-market-secondary-hover transition"
                                aria-label={`Save ${item.name} for later`}
                              >
                                {saveForLaterItems[itemId] ? 'Saved' : 'Save for later'}
                              </button>
                              {isIncompatible && (
                                <span className="text-xs text-amber-600 font-medium ml-auto">Not eligible for zone</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Promo codes are applied in Checkout, where the order total is calculated. */}
            <div className="mt-6 rounded-lg border border-market-border bg-white p-5">
              <p className="text-sm text-market-on-surface-variant">
                Have a promo code? Apply it in the order summary during checkout.
              </p>
            </div>
          </div>

          {/* Summary - Desktop Sticky, Mobile Below */}
          <div className="w-full lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-xl border border-market-border p-5 shadow-sm sm:p-6">
              <h3 className="text-lg font-bold text-market-on-surface mb-4">Order Summary</h3>

              <div className="space-y-3 pb-4 border-b border-market-border">
                <div className="flex justify-between">
                  <span className="text-sm text-market-on-surface-variant">Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
                  <span className="text-sm font-semibold text-market-on-surface">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-market-on-surface-variant">Shipping</span>
                  <span className="text-sm font-semibold text-market-on-surface">
                    {loadingQuote ? 'Calculating…' : money(shipping)}
                  </span>
                </div>
                {deliveryQuote.error && (
                  <p className="text-xs text-red-600" role="alert">{deliveryQuote.error}</p>
                )}
                {!loadingQuote && !deliveryQuote.error && deliveryQuote.eta?.text && (
                  <p className="text-xs text-market-on-surface-variant">{deliveryQuote.eta.text}</p>
                )}
              </div>

              <div className="mt-4 pt-4 border-b border-market-border pb-4">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-market-on-surface">Order total</span>
                  <span className="text-xl font-bold text-market-secondary">{money(total)}</span>
                </div>
              </div>

              {hasIncompatibleItems && (
                <p className="text-xs text-amber-600 mt-3 p-2 bg-amber-50 rounded">
                  {incompatibleCount} item{incompatibleCount !== 1 ? 's' : ''} not eligible. Remove before checkout.
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  if (hasIncompatibleItems) {
                    toast.error('Please remove items not eligible for delivery before checkout.');
                    return;
                  }
                  if (!isAuthenticated) {
                    toast.info('Please sign in to complete your order.');
                    navigate('/login', { state: { from: '/checkout' } });
                    return;
                  }
                  navigate('/checkout');
                }}
                disabled={hasIncompatibleItems}
                className={`mt-6 w-full h-11 rounded-lg text-sm font-semibold transition flex items-center justify-center ${
                  hasIncompatibleItems
                    ? 'bg-market-surface-container-low text-market-on-surface-variant cursor-not-allowed'
                    : 'bg-market-primary text-market-on-primary hover:bg-market-primary-hover active:bg-market-primary-pressed shadow-sm'
                }`}
              >
                {hasIncompatibleItems
                  ? 'Fix items before checkout'
                  : !isAuthenticated
                  ? 'Sign in to checkout'
                  : 'Proceed to checkout'}
              </button>

              <p className="text-xs text-market-secondary mt-3 flex items-center gap-1">
                <input type="checkbox" className="w-3.5 h-3.5 rounded accent-market-secondary" readOnly checked aria-label="This order contains a gift" />
                This order contains a gift
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerCartPage;
