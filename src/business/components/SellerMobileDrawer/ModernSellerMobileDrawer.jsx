import React, { useState } from 'react';
import { FiX, FiChevronDown } from 'react-icons/fi';
import ModernSellerSidebar from '@/business/components/SellerSidebar/ModernSellerSidebar';

/**
 * SellerMobileDrawer - Responsive mobile navigation drawer
 *
 * Displays the sidebar content in a left-slide drawer on mobile/tablet.
 * - Overlay backdrop for dismissal
 * - Close button in header
 * - Full navigation structure
 */
const SellerMobileDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[60] lg:hidden"
        onClick={onClose}
      >
        {/* Backdrop overlay — inert attribute prevents focus on main page */}
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          inert=""
          aria-hidden="true"
        />
      </div>

      {/* Drawer */}
      <div
        className="fixed inset-y-0 left-0 z-[70] w-72 flex flex-col bg-white dark:bg-[#1a1f2a] shadow-2xl border-r border-gray-200 dark:border-gray-800 lg:hidden transform transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <h2 className="font-bold text-gray-900 dark:text-white text-lg">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Sidebar Content (without collapse on mobile) */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <ModernSellerSidebar onClose={onClose} className="w-full border-r-0" />
        </div>
      </div>
    </>
  );
};

export default SellerMobileDrawer;
