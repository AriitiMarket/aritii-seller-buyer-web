import React from 'react';
import SkipToContent from '@/shared/components/SkipToContent';
import PublicScrollToTop from '@/public/components/PublicScrollToTop';
import DeliveryPortalHeader from '../components/DeliveryPortalHeader';
import DeliveryPortalFooter from '../components/DeliveryPortalFooter';
import ErrorBoundary from '@/components/layout/ErrorBoundary';

/**
 * DeliveryPortalLayout - the ONE layout for the public delivery pages
 * (/delivery and /delivery-center).
 *
 * Structure:
 *   ┌─────────────────────────────────────┐
 *   │ DeliveryPortalHeader (sticky)       │
 *   ├─────────────────────────────────────┤
 *   │ main (scrollable content)           │
 *   ├─────────────────────────────────────┤
 *   │ DeliveryPortalFooter                │
 *   └─────────────────────────────────────┘
 */
const DeliveryPortalLayout = ({
  children,
  hideFooter = false,
  navItems = [],
  footerColumns = undefined,
}) => {
  return (
    <ErrorBoundary portalName="Delivery Center">
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <PublicScrollToTop />
        <SkipToContent />

        {/* Independent Delivery Header */}
        <DeliveryPortalHeader navItems={navItems} />

        {/* Main Content */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 outline-none bg-gray-50 dark:bg-gray-900"
        >
          {children}
        </main>

        {/* Independent Delivery Footer */}
        {!hideFooter && <DeliveryPortalFooter columns={footerColumns} />}
      </div>
    </ErrorBoundary>
  );
};

export { DeliveryPortalLayout };
export default DeliveryPortalLayout;
