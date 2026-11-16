import React from 'react';
import { FiX } from 'react-icons/fi';
import ModernSellerSidebar from '@/features/seller/components/SellerSidebar/ModernSellerSidebar';

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
          inert
          aria-hidden="true"
        />
      </div>

      {/* Drawer */}
      <div
        className="fixed inset-y-0 left-0 z-[70] w-72 flex flex-col bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-800 lg:hidden transform transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-gray-900 dark:text-white text-sm">Seller Central</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <FiX size={20} />
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
