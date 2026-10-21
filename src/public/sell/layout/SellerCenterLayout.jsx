import React from 'react';
import SkipToContent from '@/shared/components/SkipToContent';
import PublicScrollToTop from '@/public/components/PublicScrollToTop';
import SellerUtilityBar from '@/public/seller-central/components/SellerUtilityBar';
import SellerCentralHeader from '@/public/seller-central/components/SellerCentralHeader';
import SellerCentralFooter, {
  SELLER_FOOTER_COLUMNS,
} from '@/public/seller-central/components/SellerCentralFooter';

/**
 * SellerCenterLayout - the ONE layout for the public Seller Center pages
 * (/sell-on-aritii, /seller-center and its sub-pages).
 *
 * The pages used to be split across two near-identical layouts that each
 * carried their own copy of the navigation table, and the two tables
 * disagreed about what the entries pointed at. There is now one navigation
 * table (below) and one layout.
 *
 * Structure:
 *   ┌─────────────────────────────────────┐
 *   │ SellerUtilityBar (sellers only)     │ ← shop selector + stats
 *   ├─────────────────────────────────────┤
 *   │ SellerCentralHeader (sticky, h-16)  │ ← Logo + nav + actions
 *   ├─────────────────────────────────────┤
 *   │ main (scrollable content)           │
 *   ├─────────────────────────────────────┤
 *   │ SellerCentralFooter                 │
 *   └─────────────────────────────────────┘
 */
export const SELLER_CENTER_NAV = [
  { label: 'Overview', to: '/seller-center/overview' },
  { label: 'Benefits', to: '/seller-center/benefits' },
  { label: 'How It Works', to: '/seller-center/how-it-works' },
  { label: 'Workspace Preview', to: '/seller-center/workspace' },
  { label: 'Seller Center Home', to: '/seller-center' },
];

const SellerCenterLayout = ({
  children,
  hideFooter = false,
  navItems = SELLER_CENTER_NAV,
  footerColumns = SELLER_FOOTER_COLUMNS,
  background = 'bg-[#EAEDED] dark:bg-[#0f1419]',
}) => {
  return (
    <div className={`min-h-screen flex flex-col ${background}`}>
      <PublicScrollToTop />
      <SkipToContent />

      {/* Seller Utility Bar with shop selector (hidden for non-sellers) */}
      <SellerUtilityBar />

      {/* Seller Central Header */}
      <SellerCentralHeader navItems={navItems} />

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>

      {!hideFooter && <SellerCentralFooter columns={footerColumns} />}
    </div>
  );
};

export { SellerCenterLayout };
export default SellerCenterLayout;
