import React from 'react';
import { Outlet } from 'react-router-dom';
import DeliveryPortalHeader from './DeliveryPortalHeader';
import SkipToContent from '@/shared/components/SkipToContent';

/**
 * DeliveryLayout - the shared layout for all Delivery Portal pages.
 *
 * Guarantees the marketplace header never appears on delivery routes.
 * Every delivery page (public landing, delivery information, delivery auth,
 * and any future delivery subpage) should render inside this layout.
 *
 * Structure:
 *   ┌─────────────────────────────────────┐
 *   │ DeliveryPortalHeader (sticky)       │
 *   ├─────────────────────────────────────┤
 *   │ main (scrollable page content)      │
 *   └─────────────────────────────────────┘
 *
 * Mobile: off-canvas drawer opened from the header's hamburger button.
 * The drawer is rendered inside DeliveryPortalHeader.
 */
const DeliveryLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <SkipToContent />

      {/* Delivery Portal Header — replaces MarketplaceHeader on delivery routes.
          Includes the mobile drawer internally. */}
      <DeliveryPortalHeader />

      {/* Page Content */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 outline-none bg-white dark:bg-gray-950"
      >
        {children}
      </main>
    </div>
  );
};

export default DeliveryLayout;
