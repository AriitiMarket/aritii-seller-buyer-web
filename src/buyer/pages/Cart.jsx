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

const BuyerCartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart = [], isLoading } = useSelector((state) => state.cart);
  const { zoneId, zoneName, cityName, hasZone, isSelected } = useDeliveryLocation();
  const [zoneValidation, setZoneValidation] = useState(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Zone validation — revalidate whenever cart or zone changes
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

  // Group cart items by shop for clear seller separation
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
    <div className="space-y-4">
      {/* Delivery zone banner */}
      {hasZone && (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#75d04b]/10 border border-[#75d04b]/20 rounded-lg">
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
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
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

      {/* Zone validation loading */}
      {validating && !zoneValidation && (
        <div className="px-4 py-3 text-center text-xs text-market-on-surface-variant">
          Validating cart for your delivery zone…
        </div>
      )}

      {/* Zone validation warning */}
      {zoneValidation && zoneValidation.valid === false && (
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 mb-4">
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

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Shop-grouped cart items */}

        {/* Shop-grouped cart items */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-market-border divide-y divide-market-border flex-1">
          {shopEntries.map(([shopId, group]) => (
            <div key={shopId} className="p-4 border-b border-market-border last:border-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-market-on-surface">{group.shopName}</span>
                  <span className="text-xs text-market-on-surface-variant">{group.items.length} item{group.items.length !== 1 ? 's' : ''}</span>
                </div>
                <span className="text-sm font-semibold text-market-on-surface">{money(group.shopSubtotal)}</span>
              </div>
              {group.items.map((item) => {
                const qty = Number(item.quantity) || 1;
                const unit = Number(item.price || item.discountPrice || 0);
                const stock = Number(item.stock) || Infinity;
                const isIncompatible = zoneValidation?.items?.some(
                  (i) => (i.productId || i._id) === (item.productId || item._id) && i.eligible === false
                );

                return (
                  <div key={item.productId || item._id} className="flex items-start gap-4 p-3 hover:bg-market-surface-container-low transition group">
                    <Link to={`/product/${item.productId || item._id}`} className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                      <ProductImage data={item} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <Link to={`/product/${item.productId || item._id}`} className="text-sm font-medium text-market-on-surface line-clamp-1 hover:text-market-primary transition group-hover:text-market-primary">
                          {item.name}
                        </Link>
                        {isIncompatible && (
                          <span className="text-xs text-amber-600 font-medium bg-amber-50/50 px-1.5 py-0.5 rounded">
                            Not eligible
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-market-on-surface-variant mb-2">
                        {typeof item.shop === 'string' ? item.shop : item.shop?.name || item.shopName || 'Shop'}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQty(item, qty - 1)}
                          disabled={qty <= 1 || isIncompatible}
                          className="w-7 h-7 rounded border border-market-border bg-market-surface-container-low flex items-center justify-center text-market-on-surface hover:bg-market-surface-container disabled:opacity-40 transition"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                        <button
                          onClick={() => setQty(item, qty + 1)}
                          disabled={qty >= stock || isIncompatible}
                          className="w-7 h-7 rounded border border-market-border bg-market-surface-container-low flex items-center justify-center text-market-on-surface hover:bg-market-surface-container disabled:opacity-40 transition"
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={12} />
                        </button>
                        <span className="text-market-border mx-1">|</span>
                        <button
                          onClick={() => dispatch(removeFromCart({ productId: item.productId || item._id }))}
                          className="text-xs text-market-on-surface-variant hover:text-market-tertiary-hover hover:underline transition"
                          aria-label={`Remove ${item.name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="w-24 text-right shrink-0">
                      <p className={`font-bold text-market-on-surface ${isIncompatible ? 'text-amber-600' : ''}`}>
                        {money(unit * qty)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-market-border p-5 sticky top-24 w-full lg:w-80 shrink-0">
          <p className="text-base text-market-on-surface">
            Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''}):
            <span className="text-lg font-bold">{money(subtotal)}</span>
          </p>
          {hasIncompatibleItems && (
            <p className="text-xs text-amber-600 mt-1">
              {incompatibleCount} item{incompatibleCount !== 1 ? 's' : ''} not eligible for {zoneName}. Remove them before checkout.
            </p>
          )}
          <p className="text-xs text-market-secondary mt-1 flex items-center gap-1">
            <input type="checkbox" className="w-3.5 h-3.5 rounded accent-market-secondary" readOnly checked aria-label="This order contains a gift" />
            This order contains a gift
          </p>
          <button
            onClick={() => navigate('/checkout')}
            disabled={!hasZone || hasIncompatibleItems}
            className={`mt-4 w-full px-5 py-2.5 rounded-full text-sm font-medium transition shadow-sm ${
              !hasZone || hasIncompatibleItems
                ? 'bg-market-surface-container-low text-market-on-surface-variant cursor-not-allowed'
                : 'bg-market-primary text-market-on-primary hover:bg-market-primary-hover active:bg-market-primary-pressed'
            }`}
          >
            {hasIncompatibleItems ? 'Fix items before checkout' : !hasZone ? 'Select zone to checkout' : 'Proceed to checkout'}
          </button>
          <div className="mt-4 pt-4 border-t border-market-border space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-market-on-surface-variant">Subtotal</span>
              <span className="text-market-on-surface">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-market-on-surface-variant">Shipping (3%)</span>
              <span className="text-market-on-surface">{money(shipping)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-market-border">
              <span>Order total</span>
              <span className="text-market-price">{money(total)}</span>
            </div>
          </div>
          <Link
            to="/my-dashboard/marketplace"
            className="mt-4 block w-full text-center text-sm text-market-secondary hover:text-market-secondary-hover hover:underline transition"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyerCartPage;
