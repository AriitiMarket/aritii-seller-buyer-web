import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addressService } from "@/services";
import { toast } from "react-toastify";
import EmptyState from "@/components/common/EmptyState";
import { buildDestination, isUsableAddress } from "@/shared/utils/destination";
import { useDeliveryLocation } from "@/shared/hooks/useDeliveryLocation";
import { validateCartForZone } from "@/store/slices/cartThunks";

/**
 * Checkout - the buyer chooses one of their SAVED delivery addresses.
 *
 * Why saved addresses only: placing an order requires a delivery destination
 * (`destination.sectorId`, `destination.fullAddress`, `destination.phone`) and
 * only a saved address carries the Delivery-hierarchy sector captured by
 * /my-dashboard/addresses. Free-text input can never produce a `sectorId`, so it
 * is no longer collected here.
 *
 * Coupons are out of the MVP (see FEATURES.coupons in @/app/config) and are not
 * offered at checkout.
 */
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0); // move to top of the page when component is mounted
  }, []);

  // Validate cart against the selected delivery zone whenever the cart or zone changes.
  // This runs BEFORE checkout so incompatible items are explained to the buyer.
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

  // Saved addresses are the only source of a valid delivery destination.
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

  // Empty cart → checkout cannot proceed (the backend rejects empty carts).
  // All hooks above stay unconditional (rules of hooks).
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

  // Subtotal: quantity x unit price, summed over the cart.
  // Cart lines store the selling price as `price` (backend mirrors discountPrice
  // into price). `discountPrice` is kept as a fallback for legacy lines.
  // Canonical line quantity is `quantity`; `qty` is the legacy alias.
  const subTotalPrice = cart.reduce(
    (acc, item) => acc + (item.quantity ?? item.qty ?? 1) * Number(item.price || item.discountPrice || 0),
    0
  );

  // Shipping cost (3% of the subtotal price).
  const shipping = subTotalPrice * 0.03;

  const totalPrice = (subTotalPrice + shipping).toFixed(2);

  const selectedAddress =
    addresses.find((address) => address._id === selectedAddressId) || null;

  /**
   * Flattening a saved address into `destination` lives in
   * @/shared/utils/destination so checkout and request → order conversion
   * cannot drift apart.
   */

  const paymentSubmit = () => {
    // Zone gating: a delivery zone must be selected before checkout.
    if (!hasZone) {
      toast.error(
        "Please select your delivery city and zone before checking out."
      );
      return;
    }

    // If we have zone validation results and there are incompatible items,
    // block checkout and explain which items are the problem.
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
      shippingAddress: {
        address1: selectedAddress.address1 || "",
        address2: selectedAddress.address2 || "",
        zipCode: selectedAddress.zipCode || "",
        country: selectedAddress.regionName || selectedAddress.country || "",
        city: selectedAddress.cityName || selectedAddress.city || "",
      },
      // Required by POST /order/create-order (Commerce Service).
      destination: buildDestination(selectedAddress),
      // Delivery zone — the order's ONE validated delivery zone.
      deliveryZoneId: zoneId,
      deliveryZoneName: zoneName,
      user,
    };

    // Ensure every line carries a stable product id for order creation
    // (backend re-prices from productId / _id).
    orderData.cart = cart.map((item) => ({
      ...item,
      _id: item.productId || item._id,
      productId: item.productId || item._id,
      price: Number(item.price || item.discountPrice || 0),
      quantity: item.quantity ?? item.qty ?? 1,
    }));

    // The Payment step reads this back to place the order.
    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    navigate("/payment");
  };

  return (
    <div className="w-full flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-6xl">
        {/* Zone validation banner — shown when cart items don't serve the selected zone */}
        {zoneValidation && zoneValidation.valid === false && (
          <ZoneValidationBanner validation={zoneValidation} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Delivery Address */}
          <div className="lg:col-span-2">
            <DeliveryAddress
              user={user}
              addresses={addresses}
              loading={loadingAddresses}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
            />
          </div>

          {/* Order Summary */}
          <div>
            <CartData
              totalPrice={totalPrice}
              shipping={shipping}
              subTotalPrice={subTotalPrice}
            />
          </div>
        </div>

        {/* Proceed Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={paymentSubmit}
            className="px-8 py-3 bg-market-primary text-market-on-primary hover:bg-market-primary-hover font-semibold rounded-lg transition flex items-center gap-2"
          >
            Proceed to Payment
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const DeliveryAddress = ({
  user,
  addresses,
  loading,
  selectedAddressId,
  setSelectedAddressId,
}) => {
  return (
    <div className="w-full lg:w-[95%] bg-white rounded-lg shadow-sm border border-market-border p-6">
      <h5 className="text-lg font-bold text-market-on-surface mb-6">Delivery Address</h5>

      {/* Customer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-market-on-surface mb-2">Full Name</label>
          <input
            type="text"
            value={(user && user.name) || ""}
            readOnly
            className="w-full px-4 py-2 border border-market-border rounded-lg bg-market-surface-dim text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-market-on-surface mb-2">Email</label>
          <input
            type="text"
            value={(user && user.email) || ""}
            readOnly
            className="w-full px-4 py-2 border border-market-border rounded-lg bg-market-surface-dim text-sm"
          />
        </div>
      </div>

      {/* Saved addresses - the only addresses that carry a delivery sector. */}
      <div className="mt-6 pt-6 border-t border-market-border">
        <div className="flex items-center justify-between mb-3">
          <h6 className="text-sm font-semibold text-market-on-surface">Choose a saved address</h6>
          <Link
            to="/my-dashboard/addresses"
            className="text-xs font-semibold text-market-secondary hover:text-market-secondary-hover"
          >
            Manage addresses
          </Link>
        </div>

        {loading && <p className="text-sm text-market-on-surface-variant">Loading your addresses...</p>}

        {!loading && addresses.length === 0 && (
          <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              You have no saved delivery address yet. An order needs a delivery
              location, so add one before checking out.
            </p>
            <Link
              to="/my-dashboard/addresses"
              className="inline-block mt-3 text-sm font-semibold text-market-secondary hover:text-market-secondary-hover"
            >
              Add a delivery address
            </Link>
          </div>
        )}

        {!loading && addresses.length > 0 && (
          <div className="space-y-2">
            {addresses.map((item) => {
              const selectable = Boolean(item.sectorId && item.phone);
              return (
                <label
                  key={item._id}
                  className={
                    selectable
                      ? "flex items-start p-3 border border-market-border rounded-lg hover:bg-market-surface-dim cursor-pointer"
                      : "flex items-start p-3 border border-amber-200 bg-amber-50 rounded-lg"
                  }
                >
                  <input
                    type="radio"
                    name="saved-address"
                    className="w-4 h-4 text-market-secondary mt-1"
                    checked={selectedAddressId === item._id}
                    disabled={!selectable}
                    onChange={() => setSelectedAddressId(item._id)}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-market-on-surface">
                      {item.addressType || "Address"}
                    </p>
                    <p className="text-xs text-market-on-surface-variant">{item.address1}</p>
                    <p className="text-xs text-market-on-surface-variant">
                      {[
                        item.sectorName,
                        item.cityName || item.city,
                        item.regionName || item.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {item.phone && (
                      <p className="text-xs text-market-on-surface-variant">Phone: {item.phone}</p>
                    )}
                    {!selectable && (
                      <p className="text-xs text-amber-700 mt-1">
                        Missing a delivery sector or phone - update this address to use it.
                      </p>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const CartData = ({ totalPrice, shipping, subTotalPrice }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-market-border p-6">
      <h3 className="text-lg font-bold text-market-on-surface mb-4">Order Summary</h3>

      {/* Price Breakdown — ETB, the marketplace currency (matches ProductCard) */}
      <div className="space-y-3 pb-4 border-b border-market-border">
        <div className="flex justify-between items-center">
          <span className="text-sm text-market-on-surface-variant">Subtotal</span>
          <span className="text-sm font-semibold text-market-on-surface">
            {Number(subTotalPrice).toFixed(2)} ETB
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-market-on-surface-variant">Shipping</span>
          <span className="text-sm font-semibold text-market-on-surface">
            {Number(shipping).toFixed(2)} ETB
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-base font-bold text-market-on-surface">Total</span>
        <span className="text-2xl font-bold text-market-secondary">
          {Number(totalPrice).toFixed(2)} ETB
        </span>
      </div>
    </div>
  );
};

export default Checkout;
