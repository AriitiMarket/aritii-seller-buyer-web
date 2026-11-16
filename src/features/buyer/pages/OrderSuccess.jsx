import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiArrowRight, FiHelpCircle } from "react-icons/fi";
import Footer from '@/shared/components/Footer';
import BuyerHeader from '@/features/buyer/components/BuyerHeader';
import CheckoutSteps from '@/features/buyer/components/CheckoutSteps';

const OrderSuccessPage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col transition-colors">
      <BuyerHeader hideSubNav={true} onMenuClick={() => {}} />

      {/* Same step indicator as Checkout (1) and Payment (2). */}
      <div className="w-full py-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CheckoutSteps active={3} />
        </div>
      </div>

      <div className="flex-1">
        <Success />
      </div>
      <Footer />
    </div>
  );
};

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'N/A';
  const orderGroupId = searchParams.get('orderGroupId');
  const sellerOrderCount = Math.max(1, Number(searchParams.get('sellerOrders')) || 1);
  const pickupCodes = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('pendingPickupCodes') || '[]'); }
    catch { return []; }
  })[0];

  return (
    <div className="w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* Main Success Card */}
        <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center mb-6 transition-colors">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-[#75d04b]/15 rounded-full flex items-center justify-center">
              <FiCheckCircle className="w-12 h-12 text-[#75d04b]" strokeWidth={1.5} />
            </div>
          </div>

          {pickupCodes.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-5 mb-8 text-left">
              <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">Your pickup code</h3>
              <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">Show the code for your order when collecting it from the shop.</p>
              {pickupCodes.map((entry) => (
                <p key={entry.orderId} className="text-sm text-amber-900 dark:text-amber-200">Order #{entry.orderId}: <strong className="font-mono text-lg tracking-widest">{entry.code}</strong></p>
              ))}
            </div>
          )}

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Order placed successfully
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            Thank you for your purchase.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Your order is waiting for seller confirmation. You can follow its progress from My Orders.
          </p>

          {/* Order Info Card - WITH REAL ORDER ID */}
          <div className="bg-[#f3ffee] dark:bg-[#75d04b]/10 rounded-md p-6 mb-8 border border-[#75d04b]/30">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#75d04b] rounded-full flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Checkout received</h3>
            </div>
            {orderGroupId ? (
              <>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <span className="font-semibold">Checkout ID:</span> #{orderGroupId}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {sellerOrderCount} seller {sellerOrderCount === 1 ? 'order' : 'orders'} created
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">First order ID: #{orderId}</p>
              </>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-semibold">Order ID:</span> #{orderId}
              </p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You can view every seller order from My Orders.
            </p>
          </div>

          {/* Next Steps Card */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-6 mb-8 border border-gray-200 dark:border-gray-700 text-left">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-[#75d04b] rounded-full flex items-center justify-center text-white text-sm font-bold">📋</span>
              What Happens Next?
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-6 h-6 bg-[#75d04b] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span><strong>Order Processing:</strong> The seller will confirm and prepare your order</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-6 h-6 bg-[#75d04b] text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span><strong>Shipping:</strong> You'll receive tracking updates once the item ships</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-6 h-6 bg-[#75d04b] text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span><strong>Delivery:</strong> Track your order from your dashboard in real-time</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-6 h-6 bg-[#75d04b] text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <span><strong>Review:</strong> Leave a review after receiving your order</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-3 sm:justify-center">
            <button
              onClick={() => navigate('/my-dashboard/orders')}
              className="w-full sm:flex-1 px-6 py-3 bg-[#75d04b] text-white hover:brightness-95 font-semibold rounded-full transition duration-200 flex items-center justify-center gap-2 shadow-xs"
            >
              View My Orders
              <FiArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:flex-1 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-full transition duration-200 shadow-xs"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Help Card */}
        <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <div className="flex gap-3">
            <FiHelpCircle className="w-6 h-6 text-[#75d04b] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Need Help?</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                If you have any questions about your order, check your email for the order confirmation or visit our help center.
              </p>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="text-sm text-[#75d04b] hover:underline font-semibold"
              >
                Contact Support →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
