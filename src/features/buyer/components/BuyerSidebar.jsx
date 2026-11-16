import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdShoppingBag,
  MdFavoriteBorder,
  MdLocationOn,
  MdPayment,
  MdRateReview,
  MdSettings,
  MdShoppingCart,
  MdOutlineAssignment,
} from 'react-icons/md';

const navItems = [
  { label: 'Dashboard', to: '/my-dashboard', icon: MdDashboard, end: true },
  { label: 'My Orders', to: '/my-dashboard/orders', icon: MdShoppingBag },
  { label: 'Saved Items', to: '/my-dashboard/wishlist', icon: MdFavoriteBorder },
  { label: 'Cart', to: '/my-dashboard/cart', icon: MdShoppingCart },
  { label: 'Product Requests', to: '/my-dashboard/requests', icon: MdOutlineAssignment },
  { label: 'Saved Addresses', to: '/my-dashboard/addresses', icon: MdLocationOn },
  { label: 'Payment Methods', to: '/my-dashboard/payment-methods', icon: MdPayment },
  { label: 'My Reviews', to: '/my-dashboard/reviews', icon: MdRateReview },
  { label: 'Account Settings', to: '/my-dashboard/settings', icon: MdSettings },
];

export const BuyerSidebar = ({ className = '' }) => {
  return (
    <aside
      className={`w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col py-4 ${className}`}
      aria-label="Buyer account navigation"
    >
      <div className="px-4 mb-3">
        <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Buyer Account
        </h2>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-[#f3ffee] dark:bg-[#75d04b]/15 text-[#75d04b] font-semibold border-l-4 border-[#75d04b]'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent'
                }`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default BuyerSidebar;
