import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { clearCart } from "@/store/slices/cartThunks";
import { orderService, paymentService } from "@/services";

const Payment = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Read the checkout hand-off once (lazy init) so there is no empty flash
  // before the effect runs.
  const [orderData] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("latestOrder"));
      return stored && !Array.isArray(stored) ? stored : null;
    } catch {
      return null;
    }
  });

  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('COD');
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // Synchronous duplicate-submit guard. `submitting` is React state, so it only
  // reaches the DOM on the next render — two clicks inside that window both
  // saw `submitting === false` and both went on to create an ORDER (and its
  // payment rows). A ref is updated in the same tick, so the second click is
  // rejected before any request is sent.
  const submitInFlight = useRef(false);
  useEffect(() => {
    let active = true;
    paymentService.getActiveMethods()
      .then((rows) => {
        if (!active) return;
        const orderTotal = Number(orderData?.totalPrice || 0);
        const sellers = new Set((orderData?.cart || []).map((item) =>
          item.sellerId || item.shopId || item.shop?._id || item.shop?.id
        ).filter(Boolean).map(String));
        const singleSellerCart = sellers.size <= 1;
        const usable = rows.filter((method) => {
          if (method.status !== 'ACTIVE') return false;
          if (!(method.availableFor || []).includes('BUYERS')) return false;
          if (method.minAmount && orderTotal < method.minAmount) return false;
          if (method.maxAmount && orderTotal > method.maxAmount) return false;
          if (method.key === 'CHAPA' && !singleSellerCart) return false;
          return true;
        });
        // Sort by sortOrder, then name
        usable.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name));
        setMethods(usable);
        setSelectedMethod(usable.length ? usable[0].key : '');
      })
      .catch(() => { if (active) setMethods([{ id: 'COD', key: 'COD', name: 'Cash on Delivery', description: 'Pay when your order arrives', availableFor: ['BUYERS'], status: 'ACTIVE', sortOrder: 1 }]); })
      .finally(() => { if (active) setLoadingMethods(false); });
    return () => { active = false; };
  }, [orderData]);

  // No checkout session → don't render a dead "Confirm" button.
  if (!orderData?.cart?.length) {
    return (
      <div className="w-full flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-lg bg-white rounded-lg border border-market-border shadow-sm p-8 text-center">
          <div className="text-4xl mb-4">🛒</div>
          <h2 className="text-lg font-bold text-market-on-surface mb-2">No checkout session</h2>
          <p className="text-sm text-market-on-surface-variant mb-6">
            Your cart is empty or the checkout session expired. Add items and try again.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/my-dashboard/cart")}
              className="px-5 py-2.5 bg-market-primary text-market-on-primary hover:bg-market-primary-hover rounded-lg text-sm font-semibold transition"
            >
              View cart
            </button>
            <button
              onClick={() => navigate("/my-dashboard/marketplace")}
              className="px-5 py-2.5 border border-market-border text-market-on-surface rounded-lg text-sm font-semibold hover:bg-market-surface-dim transition"
            >
              Browse products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    // Guard against a double click creating two orders (and two sets of
    // payment rows). The ref is set synchronously, before any await, so the
    // second click is dropped even though the button has not re-rendered yet.
    if (submitInFlight.current) return;

    if (
      !orderData?.cart?.length ||
      (orderData.fulfilmentType !== 'pickup' && (
        !orderData?.shippingAddress ||
        !orderData?.destination?.sectorId ||
        !orderData?.destination?.fullAddress ||
        !orderData?.destination?.phone
      ))
    ) {
      toast.error("Your checkout session is incomplete. Please return to checkout.");
      navigate("/checkout");
      return;
    }

    const order = {
      cart: orderData.cart,
      fulfilmentType: orderData.fulfilmentType || 'delivery',
      shippingAddress: orderData.shippingAddress,
      destination: orderData.destination,
      deliveryZoneId: orderData.deliveryZoneId,
      deliveryZoneName: orderData.deliveryZoneName,
      user: user,
      totalPrice: Number(orderData.totalPrice),
      promoCode: orderData.promoCode || null,
        paymentInfo: {
        type: methods.find((method) => method.key === selectedMethod)?.name || "Cash On Delivery",
        method: selectedMethod,
        // Honest COD label: the order is unpaid until the courier collects.
        // (Omitting status made seller/buyer UIs show a misleading "Not Paid"
        // with no method context.)
        status: "Pay on delivery",
      },
    };

    submitInFlight.current = true;
    setSubmitting(true);
    try {
      const createdOrder = await orderService.createOrder(order);
      const createdOrders = (Array.isArray(createdOrder) ? createdOrder : [createdOrder])
        .filter((row) => row?._id);
      const orderId = createdOrders[0]?._id;
      if (!orderId) throw new Error('Order creation returned no order');
      if (selectedMethod === 'CHAPA' && createdOrders.length !== 1) {
        throw new Error('Chapa checkout currently supports one seller per order. Please check out each seller separately.');
      }
      const pickupCodes = createdOrders.filter((row) => row.fulfilmentType === 'pickup' && row.pickupCode).map((row) => ({ orderId: row._id, code: row.pickupCode }));
      if (pickupCodes.length) sessionStorage.setItem('pendingPickupCodes', JSON.stringify(pickupCodes));

      // Checkout may be split into one order per seller. Keep a pending COD
      // payment row for every order so no seller shipment is left untracked.
      const paymentResults = await Promise.allSettled(
        createdOrders.map((created) => paymentService.createPayment(created._id, selectedMethod))
      );
      if (selectedMethod === 'CHAPA') {
        const result = paymentResults[0];
        const checkoutUrl = result.status === 'fulfilled' && (result.value?.checkoutUrl || result.value?.payment?.checkoutUrl);
        if (!checkoutUrl) throw new Error('Chapa did not provide a checkout link. Your order is still unpaid.');
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        dispatch(clearCart());
        window.location.assign(checkoutUrl);
        return;
      }
      const failedPayments = paymentResults
        .map((result, index) => ({ result, order: createdOrders[index] }))
        .filter(({ result }) => result.status === 'rejected');

      failedPayments.forEach(({ order: created, result }) => {
        console.error(`[Payment] createPayment skipped for ${created._id}:`, result.reason?.message);
      });

      const orderGroupId = createdOrders[0].orderGroupId;
      const successQuery = new URLSearchParams({
        orderId,
        sellerOrders: String(createdOrders.length),
      });
      if (orderGroupId) successQuery.set('orderGroupId', orderGroupId);
      navigate(`/order/success?${successQuery.toString()}`);

      // The order(s) exist, but an order without a payment row is NOT a paid
      // order and must not be reported as one. Say exactly what happened
      // instead of claiming success.
      if (failedPayments.length > 0) {
        toast.error(
          failedPayments.length === createdOrders.length
            ? "Your order was created, but its payment record could not be created. Please contact support before paying."
            : `Your order was created, but the payment record could not be created for ${failedPayments.length} of ${createdOrders.length} orders. Please contact support.`
        );
      } else {
        toast.success("Order successful!");
      }
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      dispatch(clearCart());
    } catch (error) {
      const msg =
        error?.response?.data?.errors?.join(', ') ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create order";
      toast.error(msg);
    } finally {
      submitInFlight.current = false;
      setSubmitting(false);
    }
  };

const canSubmit = methods.length > 0 && !!selectedMethod;

  return (
    <div className="w-full flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Info */}
          <div className="lg:col-span-2">
            <PaymentInfo
              methods={methods}
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              loadingMethods={loadingMethods}
              submitting={submitting}
              canSubmit={canSubmit}
              orderData={orderData}
              user={user}
              cashOnDeliveryHandler={cashOnDeliveryHandler}
            />
          </div>

          {/* Order Summary */}
          <div>
            <CartData orderData={orderData} />
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({
  user,
  methods,
  selectedMethod,
  setSelectedMethod,
  loadingMethods,
  submitting,
  canSubmit,
  orderData,
  cashOnDeliveryHandler,
}) => {
  const orderTotal = Number(orderData?.totalPrice || 0);

  return (
    <div className="w-full lg:w-[95%] bg-white rounded-lg shadow-sm border border-market-border p-6">
      {/* Payment Method Card */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-market-on-surface mb-4">Payment Method</h3>
        
        {loadingMethods ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-market-primary" />
            <span className="ml-3 text-sm text-market-on-surface-variant">Loading payment methods...</span>
          </div>
        ) : methods.length === 0 ? (
          <p className="text-xs text-amber-700 mt-2">No payment methods available for this order amount.</p>
        ) : (
          <div className="space-y-3">
            {methods.map((method) => {
              const fee = method.percentageFee ? (orderTotal * method.percentageFee / 100) : 0;
              const fixedFee = method.fixedFee || 0;
              const totalFee = fee + fixedFee;
              const totalWithFee = orderTotal + totalFee;
              const isSelected = selectedMethod === method.key;
              
              return (
                <div
                  key={method.key}
                  className={`border rounded-lg p-4 transition-all ${
                    isSelected
                      ? 'border-market-primary bg-market-primary/5 ring-2 ring-market-primary/20'
                      : 'border-market-border bg-white hover:border-market-primary/50'
                  }`}
                >
                  <label className="cursor-pointer flex items-start gap-3 w-full">
                    <input
                      type="radio"
                      name="payment"
                      checked={isSelected}
                      onChange={() => setSelectedMethod(method.key)}
                      className="w-4 h-4 text-market-secondary mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-market-on-surface truncate pr-2">
                          {method.name}
                        </h4>
                        {totalFee > 0 && (
                          <span className="text-xs text-market-secondary font-medium bg-market-secondary/10 px-2 py-0.5 rounded">
                            +{totalFee.toFixed(2)} ETB fee
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-market-on-surface-variant mt-1">
                        {method.description || `Pay with ${method.name}`}
                      </p>
                      {totalFee > 0 && (
                        <p className="text-xs text-market-on-surface-variant mt-1">
                          Total: <strong>{totalWithFee.toFixed(2)} ETB</strong> (including fee)
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Order Information</h4>
        <div className="space-y-1 text-xs text-blue-800">
          <p><span className="font-semibold">Delivery to:</span> {user?.name}</p>
          <p><span className="font-semibold">Contact:</span> {user?.phoneNumber}</p>
          <p><span className="font-semibold">Email:</span> {user?.email}</p>
        </div>
      </div>

      {/* Confirmation */}
      <div className="space-y-3">
        <form className="w-full" onSubmit={cashOnDeliveryHandler}>
          <button
            type="submit"
            disabled={submitting || loadingMethods || !canSubmit || !selectedMethod}
            className="w-full px-4 py-3 bg-market-primary text-market-on-primary hover:bg-market-primary-hover font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Confirm Order
          </button>
        </form>
        <p className="text-xs text-market-on-surface-variant text-center">
          By confirming, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-market-border p-6">
      <h3 className="text-lg font-bold text-market-on-surface mb-4">Order Summary</h3>
      
      <div className="space-y-3 pb-4 border-b border-market-border">
        <div className="flex justify-between items-center">
          <span className="text-sm text-market-on-surface-variant">Subtotal</span>
          <span className="text-sm font-semibold text-market-on-surface">{Number(orderData?.subTotalPrice || 0).toFixed(2)} ETB</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-market-on-surface-variant">Shipping</span>
          <span className="text-sm font-semibold text-market-on-surface">{Number(orderData?.shipping || 0).toFixed(2)} ETB</span>
        </div>
        {orderData?.discountPrice && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-market-on-surface-variant">Discount</span>
            <span className="text-sm font-semibold text-market-secondary">-{Number(orderData.discountPrice).toFixed(2)} ETB</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-base font-bold text-market-on-surface">Total Amount</span>
        <span className="text-2xl font-bold text-market-secondary">{Number(orderData?.totalPrice || 0).toFixed(2)} ETB</span>
      </div>

      {/* Order Items */}
      <div className="mt-6 pt-6 border-t border-market-border">
        <h4 className="text-sm font-semibold text-market-on-surface mb-3">Items ({orderData?.cart?.length})</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {orderData?.cart?.map((item, index) => {
            const qty = item.quantity ?? item.qty ?? 1;
            const unit = Number(item.price || item.discountPrice || 0);
            return (
              <div key={index} className="flex justify-between text-xs text-market-on-surface-variant">
                <span>{item.name} x {qty}</span>
                <span>{unit.toFixed(2)} ETB × {qty} = {(unit * qty).toFixed(2)} ETB</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Payment;
