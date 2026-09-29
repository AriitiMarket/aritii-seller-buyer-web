import React, { useEffect, useState } from "react";
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
  useEffect(() => {
    let active = true;
    paymentService.getActiveMethods()
      .then((rows) => {
        if (!active) return;
        const usable = rows.filter((method) => method.status === 'ACTIVE' && (method.availableFor || []).includes('BUYERS'));
        setMethods(usable);
        if (usable[0]?.key) setSelectedMethod(usable[0].key);
      })
      .catch(() => { if (active) setMethods([{ id: 'COD', key: 'COD', name: 'Cash on Delivery', description: 'Pay when your order arrives', availableFor: ['BUYERS'], status: 'ACTIVE' }]); })
      .finally(() => { if (active) setLoadingMethods(false); });
    return () => { active = false; };
  }, []);

  // No checkout session → don't render a dead "Confirm" button.
  if (!orderData?.cart?.length) {
    return (
      <div className="w-full flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 text-center">
          <div className="text-4xl mb-4">🛒</div>
          <h2 className="text-lg font-bold text-[#171A21] mb-2">No checkout session</h2>
          <p className="text-sm text-[#667085] mb-6">
            Your cart is empty or the checkout session expired. Add items and try again.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/my-dashboard/cart")}
              className="px-5 py-2.5 bg-[#20305C] hover:bg-[#2C3F6E] text-white rounded-lg text-sm font-semibold transition"
            >
              View cart
            </button>
            <button
              onClick={() => navigate("/my-dashboard/marketplace")}
              className="px-5 py-2.5 border border-[#E5E7EB] text-[#171A21] rounded-lg text-sm font-semibold hover:bg-[#F7F8FA] transition"
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

    if (
      !orderData?.cart?.length ||
      !orderData?.shippingAddress ||
      !orderData?.destination?.sectorId ||
      !orderData?.destination?.fullAddress ||
      !orderData?.destination?.phone
    ) {
      toast.error("Your checkout session is incomplete. Please return to checkout.");
      navigate("/checkout");
      return;
    }

    const order = {
      cart: orderData.cart,
      shippingAddress: orderData.shippingAddress,
      destination: orderData.destination,
      user: user,
      totalPrice: Number(orderData.totalPrice),
      paymentInfo: {
        type: methods.find((method) => method.key === selectedMethod)?.name || "Cash On Delivery",
        method: selectedMethod,
        // Honest COD label: the order is unpaid until the courier collects.
        // (Omitting status made seller/buyer UIs show a misleading "Not Paid"
        // with no method context.)
        status: "Pay on delivery",
      },
    };

    setSubmitting(true);
    try {
      const createdOrder = await orderService.createOrder(order);
      const orderId = Array.isArray(createdOrder)
        ? createdOrder[0]?._id
        : createdOrder?._id;

      navigate(`/order/success?orderId=${orderId}`);
      toast.success("Order successful!");
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
      setSubmitting(false);
    }
  };

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
  cashOnDeliveryHandler,
}) => {
  return (
    <div className="w-full lg:w-[95%] bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
      {/* Payment Method Card */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#171A21] mb-4">Payment Method</h3>
        
        <div className="border border-green-200 bg-green-50 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <input
              type="radio"
              id="cod"
              name="payment"
              defaultChecked
              className="w-4 h-4 text-[#20305C] mt-1"
            />
            <label htmlFor="cod" className="ml-3 cursor-pointer flex-1">
              <h4 className="text-sm font-semibold text-[#171A21]">Cash on Delivery</h4>
              <p className="text-xs text-[#667085] mt-1">
                Pay directly to the delivery agent when your order arrives
              </p>
            </label>
          </div>
        </div>
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
            className="w-full px-4 py-3 bg-[#20305C] hover:bg-[#2C3F6E] text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Confirm Order
          </button>
        </form>
        <p className="text-xs text-[#667085] text-center">
          By confirming, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
      <h3 className="text-lg font-bold text-[#171A21] mb-4">Order Summary</h3>
      
      <div className="space-y-3 pb-4 border-b border-[#E5E7EB]">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#667085]">Subtotal</span>
          <span className="text-sm font-semibold text-[#171A21]">{Number(orderData?.subTotalPrice || 0).toFixed(2)} ETB</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#667085]">Shipping</span>
          <span className="text-sm font-semibold text-[#171A21]">{Number(orderData?.shipping || 0).toFixed(2)} ETB</span>
        </div>
        {orderData?.discountPrice && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#667085]">Discount</span>
            <span className="text-sm font-semibold text-[#20305C]">-{Number(orderData.discountPrice).toFixed(2)} ETB</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-base font-bold text-[#171A21]">Total Amount</span>
        <span className="text-2xl font-bold text-[#20305C]">{Number(orderData?.totalPrice || 0).toFixed(2)} ETB</span>
      </div>

      {/* Order Items */}
      <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
        <h4 className="text-sm font-semibold text-[#171A21] mb-3">Items ({orderData?.cart?.length})</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {orderData?.cart?.map((item, index) => {
            const qty = item.quantity ?? item.qty ?? 1;
            const unit = Number(item.price || item.discountPrice || 0);
            return (
              <div key={index} className="flex justify-between text-xs text-[#667085]">
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