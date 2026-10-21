import React from 'react';
import { FiX } from 'react-icons/fi';
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
          inert
          aria-hidden="true"
        />
      </div>

      {/* Drawer */}
      <div
        className="fixed inset-y-0 left-0 z-[70] w-72 flex flex-col bg-[#131921] shadow-2xl border-r border-[#232f3e] lg:hidden transform transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-[#232f3e] bg-[#0c1015] flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-white text-sm">Seller Central</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-[#232f3e] transition-colors"
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
