import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import SellerHeader from '@/business/components/SellerHeader/SellerHeader';
import SellerSidebar from '@/business/components/SellerSidebar/SellerSidebar';
import SellerMobileDrawer from '@/business/components/SellerMobileDrawer/SellerMobileDrawer';
import SkipToContent from '@/shared/components/SkipToContent';

/**
 * BusinessLayout - the single layout for every /business/* route.
 *
 * Desktop shell:
 *   ┌────────────────────────────────────┐
 *   │ SellerHeader (fixed height)        │
 *   ├──────────┬─────────────────────────┤
 *   │ Sidebar  │ main (ONLY scrollable)  │
 *   │ (fixed)  │  page content           │
 *   └──────────┴─────────────────────────┘
 *
 * Mobile: off-canvas drawer opened from header hamburger + bottom nav bar.
 */
const BusinessLayout = ({ flushFooter = false }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();
  const closeMobileDrawer = () => setMobileDrawerOpen(false);

  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  return (
    <div className="seller-shell-bg flex flex-col h-screen overflow-hidden">
      <SkipToContent />

      {/* Header — fixed row */}
      <SellerHeader onMenuClick={() => setMobileDrawerOpen(true)} />

      {/* Mobile Drawer */}
      <SellerMobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={closeMobileDrawer}
      />

      {/* Body: fixed sidebar + independently scrollable content */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar */}
        <aside className="seller-sidebar">
          <SellerSidebar />
        </aside>

        {/* Page Content */}
        <main
          id="main-content"
          tabIndex={-1}
          className="seller-content-enter flex-1 min-w-0 min-h-0 overflow-y-auto outline-none"
          data-testid="business-content"
        >
          <Outlet />

          {!flushFooter && (
            <footer className="mt-8 py-4 px-6 text-center text-xs text-market-on-surface-variant border-t border-market-border bg-white dark:bg-[#1a1f2a]">
              <span>© Aritii Market Seller Portal.</span>{' '}
              <Link className="hover:underline text-market-primary" to="/business/products">Products</Link> ·{' '}
              <Link className="hover:underline text-market-primary" to="/faq">Help</Link>
            </footer>
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-market-border/60 safe-area-bottom">
        <div className="flex items-center justify-around h-14 px-1">
          <Link
            to="/business"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition ${location.pathname === '/business' ? 'text-market-primary' : 'text-market-on-surface-variant'}`}
            aria-current={location.pathname === '/business' ? 'page' : undefined}
          >
            <span className="text-[20px]">🏠</span>
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link
            to="/business/products"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition ${location.pathname === '/business/products' ? 'text-market-primary' : 'text-market-on-surface-variant'}`}
            aria-current={location.pathname === '/business/products' ? 'page' : undefined}
          >
            <span className="text-[20px]">📦</span>
            <span className="text-[10px] font-medium">Products</span>
          </Link>
          <Link
            to="/business/orders"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition ${location.pathname === '/business/orders' ? 'text-market-primary' : 'text-market-on-surface-variant'}`}
            aria-current={location.pathname === '/business/orders' ? 'page' : undefined}
          >
            <span className="text-[20px]">📋</span>
            <span className="text-[10px] font-medium">Orders</span>
          </Link>
          <Link
            to="/business/shops"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition ${location.pathname === '/business/shops' ? 'text-market-primary' : 'text-market-on-surface-variant'}`}
            aria-current={location.pathname === '/business/shops' ? 'page' : undefined}
          >
            <span className="text-[20px]">🏪</span>
            <span className="text-[10px] font-medium">Store</span>
          </Link>
          <Link
            to="/business/settings"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition ${location.pathname === '/business/settings' ? 'text-market-primary' : 'text-market-on-surface-variant'}`}
            aria-current={location.pathname === '/business/settings' ? 'page' : undefined}
          >
            <span className="text-[20px]">👤</span>
            <span className="text-[10px] font-medium">Account</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default BusinessLayout;
