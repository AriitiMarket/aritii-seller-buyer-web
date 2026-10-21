import React from 'react';
import SkipToContent from '@/shared/components/SkipToContent';
import PublicScrollToTop from '@/public/components/PublicScrollToTop';
import DeliveryPortalHeader from '../components/DeliveryPortalHeader';
import DeliveryPortalFooter from '../components/DeliveryPortalFooter';

/**
 * DeliveryPortalLayout - the ONE layout for the public delivery pages
 * (/delivery and /delivery-center).
 *
 * The two pages used to render two byte-equivalent layouts. This one owns
 * the chrome; each page supplies the section navigation and the footer
 * anchors it needs, so no link can point at a section that page does not
 * render.
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <PublicScrollToTop />
      <SkipToContent />

      {/* Independent Delivery Header */}
      <DeliveryPortalHeader navItems={navItems} />

      {/* Main Content */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 outline-none bg-white dark:bg-gray-950"
      >
        {children}
      </main>

      {/* Independent Delivery Footer */}
      {!hideFooter && <DeliveryPortalFooter columns={footerColumns} />}
    </div>
  );
};

export { DeliveryPortalLayout };
export default DeliveryPortalLayout;
