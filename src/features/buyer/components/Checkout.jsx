import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addressService, locationService } from "@/services";
import { toast } from "react-toastify";
import EmptyState from "@/components/common/EmptyState";
import { buildDestination, isUsableAddress } from "@/shared/utils/destination";
import { deliveryEta } from "@/shared/utils/deliveryPricing";
import { useDeliveryLocation } from "@/shared/hooks/useDeliveryLocation";
import { validateCartForZone, removeFromCart } from "@/store/slices/cartThunks";
import { FiEdit2, FiCheck, FiPlus, FiMapPin, FiX } from "react-icons/fi";
import LocationSelector from "@/components/common/LocationSelector";
import LocationCompatibilityAdvisor from "@/features/marketplace/components/LocationCompatibilityAdvisor";
import PromoCodeInput from "./PromoCodeInput";

const money = (value) =>
  `${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`;

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const { zoneId, zoneName } =
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

  // Address selection mode: 'saved' (use existing) or 'new' (create/edit)
  const [addressMode, setAddressMode] = useState('saved');
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(true);

  // Form fields for new / edited address
  const [newLocationData, setNewLocationData] = useState({
    regionId: null,
    regionName: null,
    cityId: null,
    cityName: null,
    areaId: null,
    areaName: null,
    sectorId: null,
    sectorName: null,
    deliveryZoneId: null,
    deliveryZoneName: null,
    portId: null,
    portName: null,
  });
  const [newHouseBuilding, setNewHouseBuilding] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPhone, setNewPhone] = useState(user?.phone || '');
  const [newAddressType, setNewAddressType] = useState('Home');
  const [addressFormErrors, setAddressFormErrors] = useState({});

  const resetAddressForm = () => {
    setEditingAddressId(null);
    setNewLocationData({
      regionId: null,
      regionName: null,
      cityId: null,
      cityName: null,
      areaId: null,
      areaName: null,
      sectorId: null,
      sectorName: null,
      deliveryZoneId: null,
      deliveryZoneName: null,
      portId: null,
      portName: null,
    });
    setNewHouseBuilding('');
    setNewLandmark('');
    setNewDescription('');
    setNewPhone(user?.phone || '');
    setNewAddressType('Home');
    setAddressFormErrors({});
  };

  const handleStartCreateNew = () => {
    resetAddressForm();
    setAddressMode('new');
  };

  const handleStartEdit = (address) => {
    setEditingAddressId(address._id);
    setNewLocationData({
      regionId: address.regionId || null,
      regionName: address.regionName || address.country || null,
      cityId: address.cityId || null,
      cityName: address.cityName || address.city || null,
      areaId: address.areaId || null,
      areaName: address.areaName || null,
      sectorId: address.sectorId || null,
      sectorName: address.sectorName || null,
      deliveryZoneId: address.deliveryZoneId || null,
      deliveryZoneName: address.deliveryZoneName || null,
      portId: address.portId || null,
      portName: address.portName || null,
    });
    setNewHouseBuilding(address.houseBuilding || '');
    setNewLandmark(address.landmark || '');
    setNewDescription(address.description || address.address1 || '');
    setNewPhone(address.phone || user?.phone || '');
    setNewAddressType(address.addressType || address.label || 'Home');
    setAddressFormErrors({});
    setAddressMode('new');
  };

  const handleCancelNewAddress = () => {
    resetAddressForm();
    if (addresses.length > 0) {
      setAddressMode('saved');
    }
  };

  const handleSaveAddressForm = async (e) => {
    if (e) e.preventDefault();
    const errors = {};
    if (!newLocationData.sectorId && !newLocationData.cityId) {
      errors.location = "Please select your location (City/Area/Sector)";
    }
    const digits = String(newPhone || '').replace(/[^\d]/g, '');
    if (!digits) {
      errors.phone = "Phone number is required for the delivery rider";
    } else if (digits.length < 9 || digits.length > 15) {
      errors.phone = "Please enter a valid phone number (9-15 digits)";
    }
    if (!newHouseBuilding?.trim() && !newLandmark?.trim() && !newDescription?.trim()) {
      errors.address = "Please provide house/building number or street address";
    }

    if (Object.keys(errors).length > 0) {
      setAddressFormErrors(errors);
      toast.error("Please fill in the required address fields");
      return;
    }

    setAddressFormErrors({});
    setSavingAddress(true);

    const effectiveSectorId = newLocationData.sectorId || newLocationData.cityId || null;
    const effectiveSectorName = newLocationData.sectorName || newLocationData.cityName || '';
    const fullAddress1 = [newHouseBuilding, newLandmark, newDescription].filter(Boolean).join(', ');

    const addressPayload = {
      regionId: newLocationData.regionId,
      regionName: newLocationData.regionName,
      cityId: newLocationData.cityId,
      cityName: newLocationData.cityName,
      areaId: newLocationData.areaId,
      areaName: newLocationData.areaName,
      sectorId: effectiveSectorId,
      sectorName: effectiveSectorName,
      deliveryZoneId: newLocationData.deliveryZoneId || orderZoneId,
      deliveryZoneName: newLocationData.deliveryZoneName || orderZoneName,
      portId: newLocationData.portId || orderPortId || null,
      portName: newLocationData.portName || orderPortName || '',
      houseBuilding: newHouseBuilding.trim(),
      landmark: newLandmark.trim(),
      description: newDescription.trim(),
      phone: newPhone.trim(),
      country: newLocationData.regionName || '',
      city: newLocationData.cityName || '',
      address1: fullAddress1,
      address2: '',
      zipCode: '',
      addressType: newAddressType,
      label: newAddressType,
      isDefault: addresses.length === 0,
    };

    try {
      let saved = null;
      if (saveToProfile) {
        if (editingAddressId) {
          await addressService.update(editingAddressId, addressPayload);
          saved = { ...addressPayload, _id: editingAddressId };
          setAddresses((prev) => prev.map((a) => (a._id === editingAddressId ? saved : a)));
          toast.success("Delivery address updated successfully!");
        } else {
          const created = await addressService.add(addressPayload);
          saved = created || { ...addressPayload, _id: `addr_${Date.now()}` };
          setAddresses((prev) => [...prev, saved]);
          toast.success("New address added and selected!");
        }
      } else {
        saved = { ...addressPayload, _id: `temp_${Date.now()}` };
        setAddresses((prev) => [...prev, saved]);
        toast.success("Address configured for this order!");
      }

      if (saved && saved._id) {
        setSelectedAddressId(saved._id);
      }
      if (saved.deliveryZoneId) {
        setOrderZoneId(saved.deliveryZoneId);
        setOrderZoneName(saved.deliveryZoneName || '');
      }
      if (saved.portId) {
        setOrderPortId(saved.portId);
        setOrderPortName(saved.portName || '');
      }
      resetAddressForm();
      setAddressMode('saved');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantitySignature, quoteZoneId, dispatch]);

  useEffect(() => {
    let active = true;
    addressService
      .getAll()
      .then((list) => {
        if (!active) return;
        const validList = Array.isArray(list) ? list : [];
        setAddresses(validList);
        if (validList.length === 0) {
          setAddressMode('new');
        } else {
          setAddressMode('saved');
          const defaultAddr = validList.find((a) => a.isDefault && isUsableAddress(a)) || validList.find(isUsableAddress) || validList[0];
          if (defaultAddr) setSelectedAddressId(defaultAddr._id);
        }
      })
      .catch(() => {
        if (active) {
          setAddresses([]);
          setAddressMode('new');
        }
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
                className="inline-block px-5 py-2.5 bg-[#75d04b] text-white rounded-full font-semibold hover:brightness-95 transition shadow-xs"
              >
                Browse products
              </Link>
              <Link
                to="/my-dashboard/cart"
                className="inline-block px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
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
  const finalZoneId = orderZoneId || quoteZoneId || '';
  const finalZoneName = orderZoneName || selectedAddress?.deliveryZoneName || zoneName || '';
  const finalPortId = orderPortId || selectedAddress?.portId || null;
  const finalPortName = orderPortName || selectedAddress?.portName || '';

  const paymentSubmit = () => {
    if (fulfilmentType === 'delivery' && loadingDeliveryQuote) {
      toast.info("Calculating delivery fee, please wait a moment...");
      return;
    }

    if (fulfilmentType === 'delivery' && deliveryQuoteError) {
      toast.error(deliveryQuoteError || "Delivery fee could not be calculated. Please check your delivery address and zone.");
      return;
    }

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

    if (fulfilmentType === 'delivery' && addressMode === 'new') {
      toast.error("Please click 'Save & Use This Address' to confirm your delivery address before proceeding.");
      return;
    }

    if (fulfilmentType === 'delivery' && !selectedAddress) {
      toast.error("Please choose or add your delivery address!");
      return;
    }
    if (fulfilmentType === 'delivery' && !isUsableAddress(selectedAddress)) {
      toast.error(
        "That address has no delivery sector or contact phone. Click 'Edit' to update it, or add a new address."
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
    <div className="w-full flex flex-col items-center py-8 px-4 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors">
      <div className="w-full max-w-6xl">
        {/* Zone validation & Location Compatibility Advisor */}
        {zoneValidation && zoneValidation.valid === false && (
          <LocationCompatibilityAdvisor
            validation={zoneValidation}
            currentZoneId={quoteZoneId}
            currentZoneName={finalZoneName || orderZoneName || zoneName}
            onRemoveItem={(productId) => dispatch(removeFromCart({ productId }))}
            savedAddresses={addresses}
            onSelectAddress={(addressId) => setSelectedAddressId(addressId)}
            onZoneSelect={(loc) => {
              if (loc.zoneId) setOrderZoneId(loc.zoneId);
              if (loc.zoneName) setOrderZoneName(loc.zoneName);
            }}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">How would you like to receive your order?</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setFulfilmentType('delivery')}
                  className={`px-4 py-3 rounded-md border font-medium text-sm transition-colors ${
                    fulfilmentType === 'delivery'
                      ? 'border-[#75d04b] bg-[#f3ffee] dark:bg-[#75d04b]/10 text-[#75d04b] ring-1 ring-[#75d04b]'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  Deliver to my address
                </button>
                <button
                  type="button"
                  onClick={() => setFulfilmentType('pickup')}
                  className={`px-4 py-3 rounded-md border font-medium text-sm transition-colors ${
                    fulfilmentType === 'pickup'
                      ? 'border-[#75d04b] bg-[#f3ffee] dark:bg-[#75d04b]/10 text-[#75d04b] ring-1 ring-[#75d04b]'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  Pickup from store
                </button>
              </div>
              {fulfilmentType === 'pickup' && <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Pickup is available only from shops that have enabled collection. The shop will provide its collection details with your order.</p>}
            </section>
            {/* Step 1: Delivery Address */}
            {fulfilmentType === 'delivery' && (
              <div key="delivery-flow-container" className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#75d04b] text-white flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delivery Address</h3>
              </div>

              {/* Customer Info - Read Only */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                  <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-md">
                    {(user && user.name) || "—"}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Email</label>
                  <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-md">
                    {(user && user.email) || "—"}
                  </div>
                </div>
              </div>

              {/* Address Selection: Use Existing Address vs Create New Address */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <button
                      type="button"
                      onClick={() => {
                        if (addresses.length > 0) {
                          setAddressMode('saved');
                          setEditingAddressId(null);
                        } else {
                          toast.info("No saved addresses yet. Please create one below.");
                        }
                      }}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition ${
                        addressMode === 'saved'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <FiMapPin size={14} className={addressMode === 'saved' ? 'text-[#75d04b]' : ''} />
                      <span>Use Existing Address</span>
                      {addresses.length > 0 && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                          addressMode === 'saved'
                            ? 'bg-[#75d04b]/15 text-[#75d04b]'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}>
                          {addresses.length}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleStartCreateNew}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition ${
                        addressMode === 'new' && !editingAddressId
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <FiPlus size={14} className={addressMode === 'new' && !editingAddressId ? 'text-[#75d04b]' : ''} />
                      <span>Create New Address</span>
                    </button>
                  </div>

                  {addressMode === 'saved' && addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={handleStartCreateNew}
                      className="text-xs font-semibold text-[#75d04b] hover:underline flex items-center gap-1"
                    >
                      <FiPlus size={14} /> Add new address
                    </button>
                  )}
                </div>

                {loadingAddresses && (
                  <div className="py-6 text-center">
                    <div className="animate-spin inline-block w-6 h-6 border-2 border-[#75d04b] border-t-transparent rounded-full mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading your addresses...</p>
                  </div>
                )}

                {/* MODE 1: Use Existing Address */}
                {!loadingAddresses && addressMode === 'saved' && (
                  <div>
                    {addresses.length === 0 ? (
                      <div className="border border-blue-200 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/20 rounded-xl p-5 text-center">
                        <FiMapPin className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                        <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">No Saved Delivery Address</h4>
                        <p className="text-xs text-blue-700 dark:text-blue-400 max-w-sm mx-auto mb-4">
                          You haven't saved any delivery address yet. Create a new address below to continue your order.
                        </p>
                        <button
                          type="button"
                          onClick={handleStartCreateNew}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#75d04b] text-white rounded-full text-xs font-semibold hover:brightness-95 transition shadow-sm"
                        >
                          <FiPlus size={14} /> Create Delivery Address
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {addresses.map((item, index) => {
                          const selectable = Boolean(item.sectorId && item.phone);
                          const isSelected = selectedAddressId === item._id;
                          return (
                            <div
                              key={item._id || item.id || `saved-addr-${index}`}
                              onClick={() => {
                                if (selectable) setSelectedAddressId(item._id);
                              }}
                              className={`flex items-start p-4 border rounded-md cursor-pointer transition ${
                                isSelected
                                  ? 'border-[#75d04b] bg-[#f3ffee] dark:bg-[#75d04b]/10 ring-1 ring-[#75d04b]'
                                  : selectable
                                  ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#75d04b]/50'
                                  : 'border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/20'
                              }`}
                            >
                              <div className="mt-1">
                                <input
                                  type="radio"
                                  name="saved-address"
                                  className="w-5 h-5 text-[#75d04b] accent-[#75d04b] cursor-pointer"
                                  checked={isSelected}
                                  disabled={!selectable}
                                  onChange={() => setSelectedAddressId(item._id)}
                                />
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                      {item.addressType || item.label || "Address"}
                                    </span>
                                    {item.isDefault && (
                                      <span className="text-[10px] font-semibold text-[#75d04b] bg-[#75d04b]/15 border border-[#75d04b]/30 px-1.5 py-0.5 rounded">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartEdit(item);
                                    }}
                                    className="p-1.5 text-gray-500 hover:text-[#75d04b] hover:bg-[#75d04b]/10 rounded-lg transition text-xs font-medium flex items-center gap-1"
                                    title="Edit Address"
                                  >
                                    <FiEdit2 size={13} />
                                    <span>Edit</span>
                                  </button>
                                </div>

                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1.5">
                                  {item.address1 || item.houseBuilding || "Street address"}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  {[
                                    item.sectorName,
                                    item.areaName,
                                    item.cityName || item.city,
                                    item.regionName || item.country,
                                  ]
                                    .filter(Boolean)
                                    .join(", ")}
                                </p>
                                {item.phone && (
                                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 font-mono">
                                    📞 {item.phone}
                                  </p>
                                )}

                                {(item.deliveryZoneName || item.portName) && (
                                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                    {item.deliveryZoneName && (
                                      <span className="text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded">
                                        📍 Zone: {item.deliveryZoneName}
                                      </span>
                                    )}
                                    {item.portName && (
                                      <span className="text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                                        ⚓ Port: {item.portName}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {!selectable && (
                                  <div className="mt-2 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/40 px-2.5 py-1.5 rounded-lg">
                                    <span>⚠ Missing delivery sector or phone number</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStartEdit(item);
                                      }}
                                      className="font-bold underline text-amber-900 dark:text-amber-200 ml-2"
                                    >
                                      Fix now
                                    </button>
                                  </div>
                                )}
                              </div>

                              {isSelected && selectable && (
                                <FiCheck className="w-5 h-5 text-[#75d04b] flex-shrink-0 mt-1 ml-2" />
                              )}
                            </div>
                          );
                        })}

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={handleStartCreateNew}
                            className="w-full py-2.5 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-[#75d04b] hover:border-[#75d04b] hover:bg-[#75d04b]/5 transition flex items-center justify-center gap-2"
                          >
                            <FiPlus size={16} /> Deliver to a new address
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* MODE 2: Create New / Edit Address Form */}
                {!loadingAddresses && addressMode === 'new' && (
                  <form onSubmit={handleSaveAddressForm} className="border border-gray-200 dark:border-gray-700 rounded-md p-5 bg-gray-50/50 dark:bg-gray-800/50 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                          {editingAddressId ? 'Edit Delivery Address' : 'Create New Delivery Address'}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Enter your delivery location and contact phone number.
                        </p>
                      </div>
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={handleCancelNewAddress}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          title="Cancel"
                        >
                          <FiX size={18} />
                        </button>
                      )}
                    </div>

                    {/* Geographic Location Selector */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                        Location / Administrative Area <span className="text-red-500">*</span>
                      </label>
                      <LocationSelector
                        initialSelection={newLocationData}
                        onSelect={(loc) => {
                          setNewLocationData((prev) => ({
                            ...prev,
                            ...loc,
                          }));
                          if (loc.deliveryZoneId) {
                            setOrderZoneId(loc.deliveryZoneId);
                            setOrderZoneName(loc.deliveryZoneName || '');
                          }
                          if (loc.portId) {
                            setOrderPortId(loc.portId);
                            setOrderPortName(loc.portName || '');
                          }
                        }}
                        required
                      />
                      {addressFormErrors.location && (
                        <p className="text-xs text-red-600 mt-1">{addressFormErrors.location}</p>
                      )}
                    </div>

                    {/* House / Building & Landmark */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                          House / Building / Apartment <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newHouseBuilding}
                          onChange={(e) => setNewHouseBuilding(e.target.value)}
                          placeholder="e.g. House No. 24, Apt 3B"
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                          Street / Landmark
                        </label>
                        <input
                          type="text"
                          value={newLandmark}
                          onChange={(e) => setNewLandmark(e.target.value)}
                          placeholder="e.g. Behind Edna Mall, near CBE"
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b]"
                        />
                      </div>
                    </div>

                    {/* Additional Delivery Notes */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                        Directions / Address Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="e.g. Blue gate on the left corner"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b]"
                      />
                      {addressFormErrors.address && (
                        <p className="text-xs text-red-600 mt-1">{addressFormErrors.address}</p>
                      )}
                    </div>

                    {/* Contact Phone & Address Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                          Rider Contact Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          placeholder="e.g. +251 91 123 4567"
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b] font-mono"
                        />
                        {addressFormErrors.phone && (
                          <p className="text-xs text-red-600 mt-1">{addressFormErrors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                          Address Label
                        </label>
                        <div className="flex gap-2">
                          {['Home', 'Office', 'Other'].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setNewAddressType(type)}
                              className={`flex-1 py-2 text-xs font-semibold rounded-md border transition ${
                                newAddressType === type
                                  ? 'border-[#75d04b] bg-[#f3ffee] dark:bg-[#75d04b]/15 text-[#75d04b]'
                                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              {type === 'Home' ? '🏠 Home' : type === 'Office' ? '🏢 Office' : '📍 Other'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Save to Profile Checkbox */}
                    <div className="pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300 select-none">
                        <input
                          type="checkbox"
                          checked={saveToProfile}
                          onChange={(e) => setSaveToProfile(e.target.checked)}
                          className="rounded text-[#75d04b] accent-[#75d04b] focus:ring-[#75d04b] w-4 h-4"
                        />
                        <span>Save this address to my profile for future orders</span>
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={handleCancelNewAddress}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={savingAddress}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#75d04b] text-white rounded-full text-xs font-bold hover:brightness-95 transition shadow-sm disabled:opacity-50"
                      >
                        {savingAddress ? (
                          <>
                            <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                            <span>Saving address...</span>
                          </>
                        ) : (
                          <>
                            <FiCheck size={14} />
                            <span>{editingAddressId ? 'Save & Update Address' : 'Save & Use This Address'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Step 1B: Clear Zone & Port Selection */}
              {selectedAddress && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Delivery Zone & Fulfillment Port</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Confirm or select the delivery zone and fulfillment port servicing your address
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Zone selector */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                        Delivery Zone <span className="text-red-500">*</span>
                      </label>
                      {loadingAddressZones ? (
                        <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-md text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <span className="animate-spin inline-block w-3 h-3 border-2 border-[#75d04b] border-t-transparent rounded-full" />
                          Checking available zones...
                        </div>
                      ) : availableZones.length > 1 ? (
                        <select
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b]"
                          value={orderZoneId}
                          onChange={(e) => {
                            const newZoneId = e.target.value;
                            setOrderZoneId(newZoneId);
                            const z = availableZones.find((item) => item._id === newZoneId);
                            setOrderZoneName(z?.name || '');
                          }}
                        >
                          <option value="">Select delivery zone</option>
                          {availableZones.map((z, idx) => (
                            <option key={z._id || z.id || `zone-${idx}`} value={z._id || z.id}>
                              {z.name} {z.code ? `(${z.code})` : ''}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center justify-between p-2.5 bg-[#f3ffee] dark:bg-[#75d04b]/10 border border-[#75d04b]/30 rounded-md text-sm text-[#75d04b] font-medium">
                          <span>📍 {orderZoneName || availableZones[0]?.name || zoneName || 'Assigned Zone'}</span>
                          <span className="text-xs bg-[#75d04b] text-white px-2 py-0.5 rounded-full font-semibold">
                            Active Zone
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Port selector */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                        Fulfillment Port / Hub <span className="text-red-500">*</span>
                      </label>
                      {loadingPorts ? (
                        <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-md text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <span className="animate-spin inline-block w-3 h-3 border-2 border-[#75d04b] border-t-transparent rounded-full" />
                          Loading available ports...
                        </div>
                      ) : availablePorts.length > 1 ? (
                        <select
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b]"
                          value={orderPortId}
                          onChange={(e) => {
                            const newPortId = e.target.value;
                            setOrderPortId(newPortId);
                            const p = availablePorts.find((item) => item._id === newPortId);
                            setOrderPortName(p?.name || '');
                          }}
                        >
                          <option value="">Select delivery port / hub</option>
                          {availablePorts.map((p, idx) => (
                            <option key={p._id || p.id || `port-${idx}`} value={p._id || p.id}>
                              {p.name} {p.description ? `— ${p.description}` : ''}
                            </option>
                          ))}
                        </select>
                      ) : availablePorts.length === 1 ? (
                        <div className="flex items-center justify-between p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-md text-sm text-blue-900 dark:text-blue-300 font-medium">
                          <span>⚓ {availablePorts[0].name}</span>
                          <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full font-semibold">
                            Serving Hub
                          </span>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between">
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
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 p-4 bg-[#f3ffee] dark:bg-[#75d04b]/10 border border-[#75d04b]/30 rounded-md">
                    <span className="text-2xl">📦</span>
                    <div>
                      <p className="text-sm font-semibold text-[#75d04b]">Estimated Delivery</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {loadingDeliveryQuote ? 'Calculating…' : deliveryEtaText || 'Delivery time confirmed at checkout'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

            {/* Step 2: Order Review */}
            <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#75d04b]/20 text-[#75d04b] flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order Review</h3>
                <button className="ml-auto text-xs font-semibold text-[#75d04b] hover:underline">
                  Edit items
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cart.map((item, idx) => {
                  const qty = item.quantity ?? item.qty ?? 1;
                  const unit = Number(item.price || item.discountPrice || 0);
                  const itemId = item.productId || item._id || `cart-item-${idx}`;
                  return (
                    <div key={itemId} className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                        [Image]
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{item.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Qty: {qty}</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">{money(unit * qty)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Payment (Placeholder) */}
            <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-6 shadow-sm opacity-60">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Payment Method</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Available on next step</p>
            </div>
          </div>

          {/* Right Sidebar - Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-6 shadow-sm h-fit">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Summary</h3>

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

            <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{money(subTotalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">{fulfilmentType === 'pickup' ? 'Pickup' : 'Shipping'}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{fulfilmentType === 'pickup' ? 'Free' : loadingDeliveryQuote ? 'Calculating…' : shipping === 0 ? 'Free' : money(shipping)}</span>
              </div>
              {deliveryQuoteError && <p role="alert" className="text-xs text-red-600">{deliveryQuoteError}</p>}
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#75d04b]">
                  <span className="text-sm font-medium">Discount</span>
                  <span className="text-sm font-semibold">-{money(discountAmount)}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex justify-between">
                <span className="text-base font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-xl font-bold text-[#75d04b]">{money(totalPrice)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={paymentSubmit}
              disabled={loadingDeliveryQuote}
              className={`mt-6 w-full h-11 rounded-full text-sm font-semibold transition flex items-center justify-center ${
                loadingDeliveryQuote
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-wait'
                  : 'bg-[#75d04b] text-white hover:brightness-95 shadow-sm'
              }`}
            >
              {loadingDeliveryQuote ? 'Calculating delivery fee…' : 'Continue to Payment'}
            </button>

            <Link
              to="/my-dashboard/cart"
              className="mt-4 block w-full text-center text-sm text-[#75d04b] hover:underline transition"
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
