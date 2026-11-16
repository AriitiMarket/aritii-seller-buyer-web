import React from 'react';
import { Link } from 'react-router-dom';
import { MdShoppingBag, MdOutlineArrowForward } from 'react-icons/md';

export const BuyerDashboardEmptyState = () => {
  return (
    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <MdShoppingBag className="text-3xl text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-gray-900 dark:text-white font-medium mb-1">No activity yet</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Start shopping to see your orders and recommendations here</p>
      <Link
        to="/my-dashboard/marketplace"
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#75d04b] text-white rounded-full text-sm font-semibold hover:brightness-95 transition"
      >
        Browse Products <MdOutlineArrowForward size={16} />
      </Link>
    </div>
  );
};

export default BuyerDashboardEmptyState;
