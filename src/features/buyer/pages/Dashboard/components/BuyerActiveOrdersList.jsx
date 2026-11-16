import React from 'react';
import { Link } from 'react-router-dom';
import { normalizeStatus } from '@/shared/utils/orderStatus';

export const BuyerActiveOrdersList = ({ activeOrders = [] }) => {
  if (activeOrders.length === 0) return null;

  const getProgressStep = (s) => {
    if (s === 'Pending') return 1;
    if (s === 'Processing' || s === 'Confirmed') return 2;
    if (s === 'Shipped' || s === 'In Transit') return 3;
    if (s === 'Delivered') return 4;
    return 1;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Orders</h2>
        <Link to="/my-dashboard/orders" className="text-sm font-semibold text-[#75d04b] hover:underline transition">
          View all →
        </Link>
      </div>
      <div className="space-y-4">
        {activeOrders.map((order) => {
          const items = order.cart || order.products || order.items || [];
          const firstItem = items[0];
          const status = normalizeStatus(order.orderStatus || order.status);
          const orderIdShort = order._id?.slice?.(-8)?.toUpperCase();
          const shopName = typeof firstItem?.shop === 'string' ? firstItem.shop : firstItem?.shop?.name || firstItem?.shopName || 'Shop';
          const currentStep = getProgressStep(status);
          const progressPercent = (currentStep / 4) * 100;

          return (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:border-[#75d04b]/50 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">Order #{orderIdShort}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      status === 'Pending' || status === 'Refund Requested' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                      status === 'Processing' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                      status === 'Confirmed' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300' :
                      status === 'Shipped' || status === 'In Transit' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
                      status === 'Delivered' ? 'bg-[#f3ffee] dark:bg-[#75d04b]/20 text-[#75d04b]' :
                      status === 'Cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">Vendor:</span> {shopName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">Product:</span> {firstItem?.name || 'Product'} × {firstItem?.quantity || 1}
                  </p>
                </div>
                <div className="text-right sm:text-left">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{Number(order.totalPrice || 0).toLocaleString()} ETB</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{items.length} item{items.length > 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`w-2 h-2 rounded-full ${
                          step <= currentStep ? 'bg-[#75d04b]' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">{progressPercent}% Complete</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#75d04b] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Confirmed</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Packed</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">In Transit</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Delivered</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link
                  to={`/user/order/${order._id}`}
                  className="flex-1 w-full text-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                >
                  View Details
                </Link>
                {status === 'Shipped' || status === 'In Transit' ? (
                  <Link
                    to={`/user/track/order/${order._id}`}
                    className="flex-1 w-full text-center px-4 py-2 bg-[#75d04b] text-white rounded-full text-xs font-semibold hover:brightness-95 transition"
                  >
                    Track Order
                  </Link>
                ) : (
                  <Link
                    to={`/user/order/${order._id}`}
                    className="flex-1 w-full text-center px-4 py-2 bg-[#75d04b] text-white rounded-full text-xs font-semibold hover:brightness-95 transition"
                  >
                    View Order
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BuyerActiveOrdersList;
