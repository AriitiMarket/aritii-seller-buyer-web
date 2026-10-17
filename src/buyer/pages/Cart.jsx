import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { ProductImage } from '@/components/common/ImageWithFallback';
import EmptyState from '@/components/common/EmptyState';
import { removeFromCart, updateCartQuantity, clearCart, fetchCart, validateCartForZone } from '@/store/slices/cartThunks';
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation';
import { toast } from 'react-toastify';

const money = (value) =>
  `${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`;

const getEstimatedDeliveryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const BuyerCartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart = [], isLoading } = useSelector((state) => state.cart);
  const { zoneId, zoneName, cityName, hasZone, isSelected } = useDeliveryLocation();
  const [zoneValidation, setZoneValidation] = useState(null);
  const [validating, setValidating] = useState(false);
  const [saveForLaterItems, setSaveForLaterItems] = useState({});

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

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
  }, [cart, zoneId, hasZone, dispatch]);

  const subtotal = cart.reduce(
    (acc, item) => acc + (Number(item.quantity) || 1) * Number(item.price || item.discountPrice || 0),
    0
  );
  const shipping = Math.round(subtotal * 0.03 * 100) / 100;
  const total = Math.round((subtotal + shipping) * 100) / 100;

  const shopGroups = cart.reduce((groups, item) => {
    const shopId = item.shopId || item.shop?._id || 'unknown';
    const shopName = typeof item.shop === 'string' ? item.shop : item.shop?.name || item.shopName || 'Unknown Shop';
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2162a1] mx-auto mb-4"></div>
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
            to="/my-dashboard/marketplace"
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
            to="/my-dashboard/marketplace"
            className="text-market-secondary hover:text-market-secondary-hover font-medium transition"
          >
            Continue shopping
          </Link>
        </div>

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
          <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg mb-6">
            <span className="text-amber-600 font-medium">⚠</span>
            <span className="text-sm text-amber-800">
              Select a delivery zone to see eligible items and proceed to checkout.
            </span>
            <Link
              to="/my-dashboard/marketplace"
              className="ml-auto text-xs text-market-primary font-medium hover:underline"
            >
              Choose location
            </Link>
          </div>
        )}

        {/* Zone validation warning */}
        {zoneValidation && zoneValidation.valid === false && (
          <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-amber-600">⚠</span>
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Some items cannot be delivered to {zoneName}
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Remove them or change your delivery zone before checkout.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {zoneValidation.items
                ?.filter((i) => i.eligible === false)
                .map((item) => (
                  <div key={item.productId || item._id} className="flex items-center gap-3 p-3 bg-white rounded border border-amber-100">
                    <div className="text-amber-500">✕</div>
                    <div className="flex-1">
                      <p className="text-sm text-amber-800 font-medium">{item.name}</p>
                      <p className="text-xs text-amber-600">
                        {item.code || 'SHOP_NOT_SERVING_ZONE'}
                        {item.shopName ? ` — ${item.shopName}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => dispatch(removeFromCart({ productId: item.productId || item._id }))}
                      className="text-xs font-semibold text-amber-600 hover:underline px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
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
                    <span className="text-base font-semibold text-market-on-surface">Delivery by {getEstimatedDeliveryDate()}</span>
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
                              {typeof item.shop === 'string' ? item.shop : item.shop?.name || item.shopName || 'Shop'}
                            </p>

                            {/* Quantity Controls & Price */}
                            <div className="flex items-center gap-4 mt-3">
                              {/* Larger 44px Quantity Buttons */}
                              <div className="flex items-center border border-market-border rounded-md bg-white">
                                <button
                                  onClick={() => setQty(item, qty - 1)}
                                  disabled={qty <= 1 || isIncompatible}
                                  className="w-11 h-11 rounded-l flex items-center justify-center text-market-on-surface hover:bg-market-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition font-semibold"
                                  aria-label="Decrease quantity"
                                >
                                  −
                                </button>
                                <span className="w-12 text-center text-sm font-semibold text-market-on-surface border-l border-r border-market-border">{qty}</span>
                                <button
                                  onClick={() => setQty(item, qty + 1)}
                                  disabled={qty >= stock || isIncompatible}
                                  className="w-11 h-11 rounded-r flex items-center justify-center text-market-on-surface hover:bg-market-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition font-semibold"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <p className={`text-lg font-bold ${isIncompatible ? 'text-amber-600' : 'text-market-on-surface'}`}>
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

            {/* Promo Code Section */}
            <div className="mt-6 bg-white rounded-lg border border-market-border p-5">
              <label className="block text-sm font-medium text-market-on-surface mb-2">Promo code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 px-3 py-2.5 border border-market-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-market-primary/50"
                />
                <button className="px-6 py-2.5 bg-market-surface-container hover:bg-market-surface-container-high text-market-on-surface font-medium rounded-md transition">
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Summary - Desktop Sticky, Mobile Below */}
          <div className="lg:sticky lg:top-6 lg:h-fit w-full lg:w-80">
            <div className="bg-white rounded-lg border border-market-border p-6">
              <h3 className="text-lg font-bold text-market-on-surface mb-4">Order Summary</h3>

              <div className="space-y-3 pb-4 border-b border-market-border">
                <div className="flex justify-between">
                  <span className="text-sm text-market-on-surface-variant">Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
                  <span className="text-sm font-semibold text-market-on-surface">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-market-on-surface-variant">Shipping</span>
                  <span className="text-sm font-semibold text-market-on-surface">{money(shipping)}</span>
                </div>
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
                onClick={() => navigate('/checkout')}
                disabled={!hasZone || hasIncompatibleItems}
                className={`mt-6 w-full h-11 rounded-lg text-sm font-semibold transition flex items-center justify-center ${
                  !hasZone || hasIncompatibleItems
                    ? 'bg-market-surface-container-low text-market-on-surface-variant cursor-not-allowed'
                    : 'bg-market-primary text-market-on-primary hover:bg-market-primary-hover active:bg-market-primary-pressed shadow-sm'
                }`}
              >
                {hasIncompatibleItems ? 'Fix items before checkout' : !hasZone ? 'Select zone to checkout' : 'Proceed to checkout'}
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
