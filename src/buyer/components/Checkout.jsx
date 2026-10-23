import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addressService, locationService } from "@/services";
import { toast } from "react-toastify";
import EmptyState from "@/components/common/EmptyState";
import { buildDestination, isUsableAddress } from "@/shared/utils/destination";
import { deliveryEta } from "@/shared/utils/deliveryPricing";
import { useDeliveryLocation } from "@/shared/hooks/useDeliveryLocation";
import { validateCartForZone } from "@/store/slices/cartThunks";
import { FiEdit2, FiCheck } from "react-icons/fi";
import PromoCodeInput from "./PromoCodeInput";

const money = (value) =>
  `${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`;

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
  const { zoneId, zoneName, hasZone } =
    useDeliveryLocation();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [zoneValidation, setZoneValidation] = useState(null);
  const [, setValidatingZone] = useState(false);
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [deliveryQuotes, setDeliveryQuotes] = useState({});
  const [loadingDeliveryQuote, setLoadingDeliveryQuote] = useState(false);
  const [deliveryQuoteError, setDeliveryQuoteError] = useState('');
  const [deliveryEtaText, setDeliveryEtaText] = useState('');
  const [fulfilmentType, setFulfilmentType] = useState('delivery');

  // Interactive Zone and Port selection during checkout
  const [orderZoneId, setOrderZoneId] = useState('');
  const [orderZoneName, setOrderZoneName] = useState('');
  const [orderPortId, setOrderPortId] = useState('');
  const [orderPortName, setOrderPortName] = useState('');
  const [availableZones, setAvailableZones] = useState([]);
  const [availablePorts, setAvailablePorts] = useState([]);
  const [loadingAddressZones, setLoadingAddressZones] = useState(false);
  const [loadingPorts, setLoadingPorts] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selectedAddressForQuote = addresses.find((address) => address._id === selectedAddressId) || null;
  const quoteZoneId = orderZoneId || selectedAddressForQuote?.deliveryZoneId || zoneId;

  // Whenever selected address changes, discover zones covering the address
  useEffect(() => {
    if (!selectedAddressForQuote) {
      setAvailableZones([]);
      setOrderZoneId('');
      setOrderZoneName('');
      setOrderPortId('');
      setOrderPortName('');
      return;
    }

    const locId = selectedAddressForQuote.sectorId || selectedAddressForQuote.cityId || selectedAddressForQuote.locationId;
    if (!locId) {
      if (selectedAddressForQuote.deliveryZoneId) {
        setOrderZoneId(selectedAddressForQuote.deliveryZoneId);
        setOrderZoneName(selectedAddressForQuote.deliveryZoneName || '');
      } else if (zoneId) {
        setOrderZoneId(zoneId);
        setOrderZoneName(zoneName || '');
      }
      if (selectedAddressForQuote.portId) {
        setOrderPortId(selectedAddressForQuote.portId);
        setOrderPortName(selectedAddressForQuote.portName || '');
      }
      return;
    }

    let active = true;
    setLoadingAddressZones(true);
    locationService.findZone(locId)
      .then((zones) => {
        if (!active) return;
        const list = Array.isArray(zones) ? zones : [];
        setAvailableZones(list);

        // Determine effective zone: preferred saved address zone, or store zone, or first available zone
        let targetZoneId = selectedAddressForQuote.deliveryZoneId;
        if (!targetZoneId || !list.some((z) => z._id === targetZoneId)) {
          if (zoneId && list.some((z) => z._id === zoneId)) {
            targetZoneId = zoneId;
          } else if (list.length > 0) {
            targetZoneId = list[0]._id;
          } else {
            targetZoneId = selectedAddressForQuote.deliveryZoneId || zoneId || '';
          }
        }
        const matchedZone = list.find((z) => z._id === targetZoneId);
        setOrderZoneId(targetZoneId);
        setOrderZoneName(matchedZone?.name || selectedAddressForQuote.deliveryZoneName || zoneName || '');

        if (selectedAddressForQuote.portId) {
          setOrderPortId(selectedAddressForQuote.portId);
          setOrderPortName(selectedAddressForQuote.portName || '');
        }
      })
      .catch(() => {
        if (!active) return;
        setAvailableZones([]);
        setOrderZoneId(selectedAddressForQuote.deliveryZoneId || zoneId || '');
        setOrderZoneName(selectedAddressForQuote.deliveryZoneName || zoneName || '');
      })
      .finally(() => {
        if (active) setLoadingAddressZones(false);
      });

    return () => { active = false; };
  }, [selectedAddressForQuote, zoneId, zoneName]);

  // Whenever orderZoneId changes, fetch ports for that zone
  useEffect(() => {
    const activeZone = orderZoneId || quoteZoneId;
    if (!activeZone) {
      setAvailablePorts([]);
      return;
    }
    let active = true;
    setLoadingPorts(true);
    locationService.getPortsByZone(activeZone)
      .then((ports) => {
        if (!active) return;
        const list = Array.isArray(ports) ? ports : [];
        setAvailablePorts(list);

        setOrderPortId((current) => {
          if (current && list.some((p) => p._id === current)) return current;
          if (selectedAddressForQuote?.portId && list.some((p) => p._id === selectedAddressForQuote.portId)) {
            return selectedAddressForQuote.portId;
          }
          const matchedZone = availableZones.find((z) => z._id === activeZone);
          if (matchedZone?.portId && list.some((p) => p._id === String(matchedZone.portId))) {
            return String(matchedZone.portId);
          }
          return list.length > 0 ? list[0]._id : '';
        });
      })
      .catch(() => {
        if (active) setAvailablePorts([]);
      })
      .finally(() => {
        if (active) setLoadingPorts(false);
      });
    return () => { active = false; };
  }, [orderZoneId, quoteZoneId, selectedAddressForQuote?.portId, availableZones]);

  // Keep orderPortName in sync with orderPortId
  useEffect(() => {
    if (!orderPortId) {
      setOrderPortName(selectedAddressForQuote?.portName || '');
      return;
    }
    const matched = availablePorts.find((p) => p._id === orderPortId);
    if (matched) {
      setOrderPortName(matched.name);
    }
  }, [orderPortId, availablePorts, selectedAddressForQuote?.portName]);

  const cartQuantityByShop = (cart || []).reduce((groups, item) => {
    const shopId = String(item.shopId || item.shop?._id || 'unknown');
    groups[shopId] = (groups[shopId] || 0) + Number(item.quantity ?? item.qty ?? 1);
    return groups;
  }, {});
  const quantitySignature = Object.entries(cartQuantityByShop).sort(([a], [b]) => a.localeCompare(b)).map(([shop, qty]) => `${shop}:${qty}`).join('|');

  useEffect(() => {
    if (!quoteZoneId || !Object.keys(cartQuantityByShop).length) {
      setDeliveryQuotes({});
      setDeliveryEtaText('');
      return undefined;
    }
    let active = true;
    setLoadingDeliveryQuote(true);
    setDeliveryQuoteError('');
    Promise.all(Object.entries(cartQuantityByShop).map(async ([shopId, quantity]) => {
      const quote = await locationService.quoteDeliveryFee(quoteZoneId, quantity, selectedAddressForQuote?.sectorId || selectedAddressForQuote?.locationId);
      return [shopId, Number(quote.fee) || 0, quote];
    }))
      .then((entries) => {
        if (!active) return;
        setDeliveryQuotes(Object.fromEntries(entries.map(([shopId, fee]) => [shopId, fee])));
        // Every quote is for the same zone, so they share one delivery-time rule.
        const eta = deliveryEta(entries[0]?.[2]?.estimatedDeliveryTime || null);
        setDeliveryEtaText(eta.text);
      })
      .catch((error) => {
        if (!active) return;
        setDeliveryQuotes({});
        setDeliveryEtaText('');
        setDeliveryQuoteError(error?.response?.data?.message || 'Delivery fee could not be calculated. Please check your delivery zone.');
      })
      .finally(() => { if (active) setLoadingDeliveryQuote(false); });
    return () => { active = false; };
  // quantitySignature captures quantity changes without depending on a new cart array identity.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteZoneId, selectedAddressForQuote?.sectorId, selectedAddressForQuote?.locationId, quantitySignature]);

  useEffect(() => {
    if (!cart || cart.length === 0 || !quoteZoneId) {
      setZoneValidation(null);
      return;
    }
    let active = true;
    setValidatingZone(true);
    dispatch(validateCartForZone(quoteZoneId))
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
  }, [cart, quoteZoneId, dispatch]);

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

  const moneyRound = (value) => Math.round(Number(value || 0) * 100) / 100;
  const subtotalByShop = new Map();
  for (const item of cart) {
    const shopId = String(item.shopId || item.shop?._id || 'unknown');
    const lineTotal = moneyRound((item.quantity ?? item.qty ?? 1) * Number(item.price || item.discountPrice || 0));
    subtotalByShop.set(shopId, moneyRound((subtotalByShop.get(shopId) || 0) + lineTotal));
  }
  const subTotalPrice = moneyRound([...subtotalByShop.values()].reduce((sum, amount) => sum + amount, 0));
  const shipping = fulfilmentType === 'pickup' ? 0 : moneyRound(Object.values(deliveryQuotes).reduce((sum, amount) => sum + Number(amount || 0), 0));
  const eligibleFreeDeliveryShops = new Map();
  if (appliedPromotion?.isFreeDelivery) {
    for (const item of cart) {
      const itemShopId = String(item.shopId || item.shop?._id || '');
      const promotion = appliedPromotion.promotion || {};
      if (!promotion.isPlatformWide && itemShopId !== String(promotion.shopId)) continue;
      if (appliedPromotion.eligibleProducts?.length && !appliedPromotion.eligibleProducts.includes(String(item.productId || item._id))) continue;
      if (appliedPromotion.eligibleCategories?.length && !appliedPromotion.eligibleCategories.includes(String(item.categoryId || ''))) continue;
      const lineTotal = moneyRound((item.quantity ?? item.qty ?? 1) * Number(item.price || item.discountPrice || 0));
      eligibleFreeDeliveryShops.set(itemShopId, moneyRound((eligibleFreeDeliveryShops.get(itemShopId) || 0) + lineTotal));
    }
  }
  const freeDeliverySavings = fulfilmentType === 'pickup' ? 0 : moneyRound([...eligibleFreeDeliveryShops.keys()].reduce((sum, shopId) => sum + Number(deliveryQuotes[shopId] || 0), 0));
  const discountAmount = appliedPromotion
    ? (appliedPromotion.isFreeDelivery ? freeDeliverySavings : Number(appliedPromotion.discountAmount) || 0)
    : 0;
  const totalPrice = (subTotalPrice + shipping - discountAmount).toFixed(2);

  const selectedAddress = selectedAddressForQuote;

  const paymentSubmit = () => {
    const finalZoneId = orderZoneId || quoteZoneId;
    const finalZoneName = orderZoneName || selectedAddress?.deliveryZoneName || zoneName;
    const finalPortId = orderPortId || selectedAddress?.portId || null;
    const finalPortName = orderPortName || selectedAddress?.portName || '';

    if (fulfilmentType === 'delivery' && !finalZoneId) {
      toast.error(
        "Please select your delivery zone before checking out."
      );
      return;
    }

    if (fulfilmentType === 'delivery' && zoneValidation && zoneValidation.valid === false) {
      const incompatible = zoneValidation.items?.filter(
        (i) => i.eligible === false
      );
      if (incompatible && incompatible.length > 0) {
        const names = incompatible
          .map((i) => i.name)
          .join(", ");
        toast.error(
          `These items cannot be delivered to ${finalZoneName || 'selected zone'}: ${names}. Remove them or change your delivery zone.`
        );
        return;
      }
    }

    if (fulfilmentType === 'delivery' && !selectedAddress) {
      toast.error("Please choose your delivery address!");
      return;
    }
    if (fulfilmentType === 'delivery' && !isUsableAddress(selectedAddress)) {
      toast.error(
        "That address has no delivery sector or contact phone. Please update it on your Addresses page."
      );
      return;
    }

    const orderData = {
      cart,
      fulfilmentType,
      totalPrice,
      subTotalPrice,
      shipping,
      discountAmount,
      promoCode: appliedPromotion ? appliedPromotion.promotion?.code : null,
      shippingAddress: fulfilmentType === 'delivery' ? {
        address1: selectedAddress.address1 || "",
        address2: selectedAddress.address2 || "",
        zipCode: selectedAddress.zipCode || "",
        country: selectedAddress.regionName || selectedAddress.country || "",
        city: selectedAddress.cityName || selectedAddress.city || "",
      } : {},
      destination: fulfilmentType === 'delivery' ? {
        ...buildDestination(selectedAddress),
        deliveryZoneId: finalZoneId,
        deliveryZoneName: finalZoneName,
        portId: finalPortId,
        portName: finalPortName,
      } : {},
      deliveryZoneId: fulfilmentType === 'delivery' ? finalZoneId : null,
      deliveryZoneName: fulfilmentType === 'delivery' ? finalZoneName : '',
      portId: fulfilmentType === 'delivery' ? finalPortId : null,
      portName: fulfilmentType === 'delivery' ? finalPortName : '',
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
            <section className="bg-white rounded-lg border border-market-border p-5">
              <h3 className="font-bold text-market-on-surface mb-3">How would you like to receive your order?</h3>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => setFulfilmentType('delivery')} className={`px-4 py-3 rounded-lg border ${fulfilmentType === 'delivery' ? 'border-market-primary bg-market-primary/5' : 'border-market-border'}`}>Deliver to my address</button>
                <button type="button" onClick={() => setFulfilmentType('pickup')} className={`px-4 py-3 rounded-lg border ${fulfilmentType === 'pickup' ? 'border-market-primary bg-market-primary/5' : 'border-market-border'}`}>Pickup from store</button>
              </div>
              {fulfilmentType === 'pickup' && <p className="text-sm text-gray-600 mt-3">Pickup is available only from shops that have enabled collection. The shop will provide its collection details with your order.</p>}
            </section>
            {/* Step 1: Delivery Address */}
            {fulfilmentType === 'delivery' && <>
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
                            {(item.deliveryZoneName || item.portName) && (
                              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                {item.deliveryZoneName && (
                                  <span className="text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                                    Zone: {item.deliveryZoneName}
                                  </span>
                                )}
                                {item.portName && (
                                  <span className="text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded">
                                    Port: {item.portName}
                                  </span>
                                )}
                              </div>
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

              {/* Step 1B: Clear Zone & Port Selection */}
              {selectedAddress && (
                <div className="mt-6 pt-6 border-t border-market-border space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-market-on-surface">Delivery Zone & Fulfillment Port</h4>
                      <p className="text-xs text-market-on-surface-variant mt-0.5">
                        Confirm or select the delivery zone and fulfillment port servicing your address
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Zone selector */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Delivery Zone <span className="text-red-500">*</span>
                      </label>
                      {loadingAddressZones ? (
                        <div className="p-2.5 bg-gray-50 border border-market-border rounded-lg text-xs text-gray-500 flex items-center gap-2">
                          <span className="animate-spin inline-block w-3 h-3 border-2 border-market-secondary border-t-transparent rounded-full" />
                          Checking available zones...
                        </div>
                      ) : availableZones.length > 1 ? (
                        <select
                          className="w-full px-3 py-2 border border-market-border rounded-lg text-sm bg-white focus:outline-none focus:border-market-secondary focus:ring-1 focus:ring-market-secondary"
                          value={orderZoneId}
                          onChange={(e) => {
                            const newZoneId = e.target.value;
                            setOrderZoneId(newZoneId);
                            const z = availableZones.find((item) => item._id === newZoneId);
                            setOrderZoneName(z?.name || '');
                          }}
                        >
                          <option value="">Select delivery zone</option>
                          {availableZones.map((z) => (
                            <option key={z._id} value={z._id}>
                              {z.name} {z.code ? `(${z.code})` : ''}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center justify-between p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900 font-medium">
                          <span>📍 {orderZoneName || availableZones[0]?.name || zoneName || 'Assigned Zone'}</span>
                          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded font-semibold">
                            Active Zone
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Port selector */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Fulfillment Port / Hub <span className="text-red-500">*</span>
                      </label>
                      {loadingPorts ? (
                        <div className="p-2.5 bg-gray-50 border border-market-border rounded-lg text-xs text-gray-500 flex items-center gap-2">
                          <span className="animate-spin inline-block w-3 h-3 border-2 border-market-secondary border-t-transparent rounded-full" />
                          Loading available ports...
                        </div>
                      ) : availablePorts.length > 1 ? (
                        <select
                          className="w-full px-3 py-2 border border-market-border rounded-lg text-sm bg-white focus:outline-none focus:border-market-secondary focus:ring-1 focus:ring-market-secondary"
                          value={orderPortId}
                          onChange={(e) => {
                            const newPortId = e.target.value;
                            setOrderPortId(newPortId);
                            const p = availablePorts.find((item) => item._id === newPortId);
                            setOrderPortName(p?.name || '');
                          }}
                        >
                          <option value="">Select delivery port / hub</option>
                          {availablePorts.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name} {p.description ? `— ${p.description}` : ''}
                            </option>
                          ))}
                        </select>
                      ) : availablePorts.length === 1 ? (
                        <div className="flex items-center justify-between p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-sm text-indigo-900 font-medium">
                          <span>⚓ {availablePorts[0].name}</span>
                          <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded font-semibold">
                            Serving Hub
                          </span>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center justify-between">
                          <span>⚓ {orderPortName || selectedAddress?.portName || 'Standard local dispatch hub'}</span>
                          <span className="text-xs text-gray-500 font-medium">Default Port</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Estimated Delivery */}
              {selectedAddress && (
                <div className="mt-6 pt-6 border-t border-market-border">
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-2xl">📦</span>
                    <div>
                      <p className="text-sm font-semibold text-green-900">Estimated Delivery</p>
                      <p className="text-sm text-green-700">
                        {loadingDeliveryQuote ? 'Calculating…' : deliveryEtaText || 'Delivery time confirmed at checkout'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            </>}

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
                shipping={shipping}
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
                <span className="text-sm text-market-on-surface-variant">{fulfilmentType === 'pickup' ? 'Pickup' : 'Shipping'}</span>
                <span className="text-sm font-semibold text-market-on-surface">{fulfilmentType === 'pickup' ? 'Free' : loadingDeliveryQuote ? 'Calculating…' : shipping === 0 ? 'Free' : money(shipping)}</span>
              </div>
              {deliveryQuoteError && <p role="alert" className="text-xs text-red-600">{deliveryQuoteError}</p>}
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
              disabled={(fulfilmentType === 'delivery' && (!selectedAddress || !quoteZoneId || loadingDeliveryQuote || Boolean(deliveryQuoteError)))}
              className={`mt-6 w-full h-11 rounded-lg text-sm font-semibold transition flex items-center justify-center ${
                fulfilmentType === 'pickup' || (selectedAddress && quoteZoneId && !loadingDeliveryQuote && !deliveryQuoteError)
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
