import React from 'react';
import { Link } from 'react-router-dom';
import { MdShoppingBag, MdLocalShipping, MdShoppingCart } from 'react-icons/md';
import { AiOutlineHeart } from 'react-icons/ai';

export const BuyerQuickStats = ({
  totalOrders = 0,
  inTransitCount = 0,
  cartCount = 0,
  savedItemsCount = 0,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <Link to="/my-dashboard/orders" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:border-[#75d04b]/50 hover:shadow-md transition">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#75d04b]/10 dark:bg-[#75d04b]/20 flex items-center justify-center">
            <MdShoppingBag className="text-[#75d04b]" size={16} />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{totalOrders}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Orders</p>
          </div>
        </div>
      </Link>
      <Link to="/my-dashboard/orders" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:border-[#75d04b]/50 hover:shadow-md transition">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#75d04b]/10 dark:bg-[#75d04b]/20 flex items-center justify-center">
            <MdLocalShipping className="text-[#75d04b]" size={16} />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{inTransitCount}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">In Transit</p>
          </div>
        </div>
      </Link>
      <Link to="/my-dashboard/cart" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:border-[#75d04b]/50 hover:shadow-md transition">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#75d04b]/10 dark:bg-[#75d04b]/20 flex items-center justify-center">
            <MdShoppingCart className="text-[#75d04b]" size={16} />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{cartCount}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Cart Items</p>
          </div>
        </div>
      </Link>
      <Link to="/my-dashboard/wishlist" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 hover:border-[#75d04b]/50 hover:shadow-md transition">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#75d04b]/10 dark:bg-[#75d04b]/20 flex items-center justify-center">
            <AiOutlineHeart className="text-[#75d04b]" size={16} />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{savedItemsCount}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Saved Items</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BuyerQuickStats;
