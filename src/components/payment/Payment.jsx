import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../../styles/styles';
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { clearCart } from "../../store/redux/actions/cart";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);

    console.log(orderData);
  }, []);

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    order.paymentInfo = {
      type: "Cash On Delivery",
    };

    try {
      // Note: For payment, would need createOrder Redux action
      // For now, using direct order object for this demo
      // TODO: Create orderService.createOrder() and Redux action for Phase 4 continuation
      const res = await fetch('/api/order/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });
      
      if (!res.ok) throw new Error('Order creation failed');
      
      const data = await res.json();
      const orderId = data?.order?._id || 
                      data?.orders?.[0]?._id || 
                      data?._id;
      
      navigate(`/order/success?orderId=${orderId}`);
      toast.success("Order successful!");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      dispatch(clearCart());
    } catch (error) {
      toast.error(error?.message || "Failed to create order");
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Info */}
          <div className="lg:col-span-2">
            <PaymentInfo
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
  cashOnDeliveryHandler,
}) => {
  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      {/* Payment Method Card */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
        
        <div className="border border-green-200 bg-green-50 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <input
              type="radio"
              id="cod"
              name="payment"
              defaultChecked
              className="w-4 h-4 text-green-600 mt-1"
            />
            <label htmlFor="cod" className="ml-3 cursor-pointer flex-1">
              <h4 className="text-sm font-semibold text-gray-900">Cash on Delivery</h4>
              <p className="text-xs text-gray-600 mt-1">
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
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Confirm Order
          </button>
        </form>
        <p className="text-xs text-gray-500 text-center">
          By confirming, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2);
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3 pb-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Subtotal</span>
          <span className="text-sm font-semibold text-gray-900">${orderData?.subTotalPrice?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Shipping</span>
          <span className="text-sm font-semibold text-gray-900">${shipping}</span>
        </div>
        {orderData?.discountPrice && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Discount</span>
            <span className="text-sm font-semibold text-green-600">-${orderData.discountPrice.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-base font-bold text-gray-900">Total Amount</span>
        <span className="text-2xl font-bold text-green-600">${orderData?.totalPrice}</span>
      </div>

      {/* Order Items */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Items ({orderData?.cart?.length})</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {orderData?.cart?.map((item, index) => (
            <div key={index} className="flex justify-between text-xs text-gray-600">
              <span>{item.name} x {item.qty}</span>
              <span>${(item.discountPrice * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Payment;