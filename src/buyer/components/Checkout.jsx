import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addressService } from "@/services";
import { toast } from "react-toastify";
import EmptyState from "@/components/common/EmptyState";
import { buildDestination, isUsableAddress } from "@/shared/utils/destination";
import { useDeliveryLocation } from "@/shared/hooks/useDeliveryLocation";
import { validateCartForZone } from "@/store/slices/cartThunks";
import { FiEdit2, FiCheck } from "react-icons/fi";
import PromoCodeInput from "./PromoCodeInput";

const money = (value) =>
  `${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`;

const getEstimatedDeliveryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

/**
 * ZoneValidationBanner — explains which cart items cannot be delivered to
 * the selected zone, and lets the buyer remove them or change location.
 */
const ZoneValidationBanner = ({ validation, onRemoveItem }) => {
  if (!validation || validation.valid !== false) return null;

  const incompatible = (validation.items || []).filter((i) => i.eligible === false);
  if (!incompatible || incompatible.length === 0) return null;

  return (
    <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-amber-600">⚠</span>
        <div>
          <p className="text-sm font-semibold text-amber-800">
            Some items cannot be delivered to your selected zone
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Remove incompatible items or change your delivery zone to continue.
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {incompatible.map((item) => (
          <div
            key={item.productId || item._id}
            className="flex items-center gap-3 p-3 bg-white rounded border border-amber-100"
          >
            <div className="text-amber-500">✕</div>
            <div className="flex-1">
              <p className="text-sm text-amber-800 font-medium">
                {item.name}
              </p>
              <p className="text-xs text-amber-600">
                {item.code || 'SHOP_NOT_SERVING_ZONE'}
                {item.shopName ? ` — ${item.shopName}` : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemoveItem?.(item.productId || item._id)}
              className="text-xs font-semibold text-amber-600 hover:underline px-2 py-1"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const { zoneId, zoneName, cityId, cityName, hasZone, isSelected } =
    useDeliveryLocation();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [zoneValidation, setZoneValidation] = useState(null);
  const [validatingZone, setValidatingZone] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!cart || cart.length === 0 || !hasZone) {
      setZoneValidation(null);
      return;
    }
    let active = true;
    setValidatingZone(true);
    dispatch(validateCartForZone(zoneId))
      .then((result) => {
        if (!active) return;
        setZoneValidation(result);
      })
      .catch(() => {
        if (!active) return;
        setZoneValidation(null);
      })
      .finally(() => {
        if (active) setValidatingZone(false);
      });
    return () => {
      active = false;
    };
  }, [cart, zoneId, hasZone, dispatch]);

  useEffect(() => {
    let active = true;
    addressService
      .getAll()
      .then((list) => {
        if (!active) return;
        setAddresses(list);
        if (list.length === 1) setSelectedAddressId(list[0]._id);
      })
      .catch(() => {
        if (active) setAddresses([]);
      })
      .finally(() => {
        if (active) setLoadingAddresses(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4">
        <EmptyState
          title="Your cart is empty"
          description="Add items to your cart before checking out."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/my-dashboard/marketplace"
                className="inline-block px-5 py-2.5 bg-market-primary text-market-on-primary rounded-lg font-semibold hover:opacity-90 transition"
              >
                Browse products
              </Link>
              <Link
                to="/my-dashboard/cart"
                className="inline-block px-5 py-2.5 border border-market-border text-market-on-surface rounded-lg font-semibold hover:bg-market-surface-dim transition"
              >
                View cart
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + (item.quantity ?? item.qty ?? 1) * Number(item.price || item.discountPrice || 0),
    0
  );

  const shipping = subTotalPrice * 0.03;
  const discountAmount = appliedPromotion ? appliedPromotion.discountAmount : 0;
  const totalPrice = (subTotalPrice + shipping - discountAmount).toFixed(2);

  const selectedAddress =
    addresses.find((address) => address._id === selectedAddressId) || null;

  const paymentSubmit = () => {
    if (!hasZone) {
      toast.error(
        "Please select your delivery city and zone before checking out."
      );
      return;
    }

    if (zoneValidation && zoneValidation.valid === false) {
      const incompatible = zoneValidation.items?.filter(
        (i) => i.eligible === false
      );
      if (incompatible && incompatible.length > 0) {
        const names = incompatible
          .map((i) => i.name)
          .join(", ");
        toast.error(
          `These items cannot be delivered to ${zoneName}: ${names}. Remove them or change your delivery zone.`
        );
        return;
      }
    }

    if (!selectedAddress) {
      toast.error("Please choose your delivery address!");
      return;
    }
    if (!isUsableAddress(selectedAddress)) {
      toast.error(
        "That address has no delivery sector or contact phone. Please update it on your Addresses page."
      );
      return;
    }

    const orderData = {
      cart,
      totalPrice,
      subTotalPrice,
      shipping,
      discountAmount,
      promoCode: appliedPromotion ? appliedPromotion.promotion?.code : null,
      shippingAddress: {
        address1: selectedAddress.address1 || "",
        address2: selectedAddress.address2 || "",
        zipCode: selectedAddress.zipCode || "",
        country: selectedAddress.regionName || selectedAddress.country || "",
        city: selectedAddress.cityName || selectedAddress.city || "",
      },
      destination: buildDestination(selectedAddress),
      deliveryZoneId: zoneId,
      deliveryZoneName: zoneName,
      user,
    };

    orderData.cart = cart.map((item) => ({
      ...item,
      _id: item.productId || item._id,
      productId: item.productId || item._id,
      price: Number(item.price || item.discountPrice || 0),
      quantity: item.quantity ?? item.qty ?? 1,
    }));

    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    navigate("/payment");
  };

  return (
    <div className="w-full flex flex-col items-center py-8 px-4 bg-market-surface-dim min-h-screen">
      <div className="w-full max-w-6xl">
        {/* Zone validation banner */}
        {zoneValidation && zoneValidation.valid === false && (
          <ZoneValidationBanner validation={zoneValidation} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="bg-white rounded-lg border border-market-border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-market-primary text-market-on-primary flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-lg font-bold text-market-on-surface">Delivery Address</h3>
              </div>

              {/* Customer Info - Read Only */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-market-border">
                <div>
                  <label className="block text-xs font-semibold text-market-on-surface-variant mb-1">Full Name</label>
                  <div className="px-4 py-2.5 bg-market-surface-dim text-sm text-market-on-surface border border-market-border rounded-lg">
                    {(user && user.name) || "—"}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-market-on-surface-variant mb-1">Email</label>
                  <div className="px-4 py-2.5 bg-market-surface-dim text-sm text-market-on-surface border border-market-border rounded-lg">
                    {(user && user.email) || "—"}
                  </div>
                </div>
              </div>

              {/* Saved Addresses */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-market-on-surface">Select Delivery Address</h4>
                  <Link
                    to="/my-dashboard/addresses"
                    className="text-xs font-semibold text-market-secondary hover:text-market-secondary-hover flex items-center gap-1"
                  >
                    <FiEdit2 size={14} /> Add new address
                  </Link>
                </div>

                {loadingAddresses && (
                  <p className="text-sm text-market-on-surface-variant">Loading your addresses...</p>
                )}

                {!loadingAddresses && addresses.length === 0 && (
                  <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                    <p className="text-sm text-amber-800">
                      You have no saved delivery address. Add one to continue checkout.
                    </p>
                    <Link
                      to="/my-dashboard/addresses"
                      className="inline-block mt-3 text-sm font-semibold text-market-secondary hover:text-market-secondary-hover"
                    >
                      Add a delivery address
                    </Link>
                  </div>
                )}

                {!loadingAddresses && addresses.length > 0 && (
                  <div className="space-y-3">
                    {addresses.map((item) => {
                      const selectable = Boolean(item.sectorId && item.phone);
                      return (
                        <label
                          key={item._id}
                          className={`flex items-start p-4 border rounded-lg cursor-pointer transition ${
                            selectedAddressId === item._id
                              ? 'border-market-secondary bg-market-secondary/5'
                              : selectable
                              ? 'border-market-border hover:bg-market-surface-dim'
                              : 'border-amber-200 bg-amber-50'
                          }`}
                        >
                          <div className="mt-1">
                            <input
                              type="radio"
                              name="saved-address"
                              className="w-5 h-5 text-market-secondary"
                              checked={selectedAddressId === item._id}
                              disabled={!selectable}
                              onChange={() => setSelectedAddressId(item._id)}
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <p className="text-sm font-semibold text-market-on-surface">
                              {item.addressType || "Delivery Address"}
                            </p>
                            <p className="text-sm text-market-on-surface-variant mt-1">{item.address1}</p>
                            <p className="text-xs text-market-on-surface-variant mt-1">
                              {[
                                item.sectorName,
                                item.cityName || item.city,
                                item.regionName || item.country,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                            {item.phone && (
                              <p className="text-xs text-market-on-surface-variant mt-1">
                                Phone: {item.phone}
                              </p>
                            )}
                            {!selectable && (
                              <p className="text-xs text-amber-700 mt-2 font-medium">
                                ⚠ Missing delivery sector or phone - please update
                              </p>
                            )}
                          </div>
                          {selectedAddressId === item._id && selectable && (
                            <FiCheck className="w-5 h-5 text-market-secondary flex-shrink-0 mt-1" />
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Estimated Delivery */}
              {selectedAddress && (
                <div className="mt-6 pt-6 border-t border-market-border">
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-2xl">📦</span>
                    <div>
                      <p className="text-sm font-semibold text-green-900">Estimated Delivery</p>
                      <p className="text-sm text-green-700">{getEstimatedDeliveryDate()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Order Review */}
            <div className="bg-white rounded-lg border border-market-border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-market-primary/20 text-market-primary flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="text-lg font-bold text-market-on-surface">Order Review</h3>
                <button className="ml-auto text-xs font-semibold text-market-secondary hover:underline">
                  Edit items
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cart.map((item, idx) => {
                  const qty = item.quantity ?? item.qty ?? 1;
                  const unit = Number(item.price || item.discountPrice || 0);
                  return (
                    <div key={idx} className="flex items-start gap-4 pb-4 border-b border-market-border last:border-0">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-500">
                        [Image]
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-market-on-surface line-clamp-2">{item.name}</p>
                        <p className="text-xs text-market-on-surface-variant mt-1">Qty: {qty}</p>
                        <p className="text-sm font-semibold text-market-on-surface mt-2">{money(unit * qty)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Payment (Placeholder) */}
            <div className="bg-white rounded-lg border border-market-border p-6 shadow-sm opacity-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="text-lg font-bold text-market-on-surface">Payment Method</h3>
              </div>
              <p className="text-sm text-market-on-surface-variant">Available on next step</p>
            </div>
          </div>

          {/* Right Sidebar - Order Summary */}
          <div className="bg-white rounded-lg border border-market-border p-6 shadow-sm h-fit">
            <h3 className="text-lg font-bold text-market-on-surface mb-6">Order Summary</h3>

            {/* Promo Code Input */}
            <div className="mb-6">
              <PromoCodeInput
                cartItems={cart}
                subtotal={subTotalPrice}
                onApply={setAppliedPromotion}
                onRemove={() => setAppliedPromotion(null)}
                appliedPromotion={appliedPromotion}
              />
            </div>

            <div className="space-y-3 pb-4 border-b border-market-border">
              <div className="flex justify-between">
                <span className="text-sm text-market-on-surface-variant">Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
                <span className="text-sm font-semibold text-market-on-surface">{money(subTotalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-market-on-surface-variant">Shipping</span>
                <span className="text-sm font-semibold text-market-on-surface">{money(shipping)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="text-sm font-medium">Discount</span>
                  <span className="text-sm font-semibold">-{money(discountAmount)}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-b border-market-border pb-4">
              <div className="flex justify-between">
                <span className="text-base font-bold text-market-on-surface">Total</span>
                <span className="text-xl font-bold text-market-secondary">{money(totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={paymentSubmit}
              disabled={!selectedAddress}
              className={`mt-6 w-full h-11 rounded-lg text-sm font-semibold transition flex items-center justify-center ${
                selectedAddress
                  ? 'bg-market-primary text-market-on-primary hover:bg-market-primary-hover shadow-sm'
                  : 'bg-market-surface-container-low text-market-on-surface-variant cursor-not-allowed'
              }`}
            >
              Continue to Payment
            </button>

            <Link
              to="/my-dashboard/cart"
              className="mt-4 block w-full text-center text-sm text-market-secondary hover:text-market-secondary-hover transition"
            >
              Back to cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
