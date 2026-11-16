import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  MdPerson,
  MdLocationOn,
  MdPayment,
  MdSettings,
  MdOutlineSecurity,
  MdArrowBack,
} from 'react-icons/md';

const accountNavItems = [
  { label: 'Profile Overview', to: '/my-dashboard/profile', icon: MdPerson },
  { label: 'Saved Addresses', to: '/my-dashboard/addresses', icon: MdLocationOn },
  { label: 'Payment Methods', to: '/my-dashboard/payment-methods', icon: MdPayment },
  { label: 'Preferences & Notifications', to: '/my-dashboard/settings', icon: MdSettings },
  { label: 'Security & Password', to: '/my-dashboard/settings#security', icon: MdOutlineSecurity },
];

export const BuyerAccountSidebar = ({ className = '' }) => {
  return (
    <aside
      className={`w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col py-4 ${className}`}
      aria-label="Account settings navigation"
    >
      <div className="px-4 mb-3">
        <NavLink
          to="/my-dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#75d04b] dark:text-gray-400 dark:hover:text-[#75d04b] mb-3 transition-colors"
        >
          <MdArrowBack size={14} />
          <span>Back to Dashboard</span>
        </NavLink>
        <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Account Settings
        </h2>
      </div>
      <nav className="flex-1 space-y-1">
        {accountNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
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

export default BuyerAccountSidebar;
