import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import ModernSellerHeader from '@/business/components/SellerHeader/ModernSellerHeader';
import ModernSellerSidebar from '@/business/components/SellerSidebar/ModernSellerSidebar';
import ModernSellerMobileDrawer from '@/business/components/SellerMobileDrawer/ModernSellerMobileDrawer';
import SkipToContent from '@/shared/components/SkipToContent';

/**
 * BusinessLayout - the single layout for every /business/* route.
 *
 * Desktop shell:
 *   ┌────────────────────────────────────────┐
 *   │ ModernSellerHeader (sticky)            │
 *   │ - Store switcher, search, metrics bar  │
 *   │ - Collapse/Expand sidebar toggle       │
 *   ├──────────┬─────────────────────────────┤
 *   │ Sidebar  │ main (ONLY scrollable)      │
 *   │ (fixed)  │ page content                │
 *   │ (full-ht)│ (transitions on collapse)   │
 *   └──────────┴─────────────────────────────┘
 *
 * Mobile: off-canvas drawer + bottom nav bar.
 * Sidebar collapses to minimize icon strip on desktop.
 */
const BusinessLayout = ({ flushFooter = false }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const closeMobileDrawer = () => setMobileDrawerOpen(false);

  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-[#0f1419]">
      <SkipToContent />

      {/* Header — sticky row with metrics + sidebar toggle */}
      <ModernSellerHeader 
        onMenuClick={() => setMobileDrawerOpen(true)}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Mobile Drawer */}
      <ModernSellerMobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={closeMobileDrawer}
      />

      {/* Body: fixed sidebar + independently scrollable content */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar — full height, collapsible */}
        <aside className="hidden lg:block border-r border-gray-200 dark:border-gray-800 h-full transition-all duration-300">
          <ModernSellerSidebar isCollapsed={sidebarCollapsed} />
        </aside>

        {/* Page Content */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 min-w-0 min-h-0 overflow-y-auto outline-none bg-[#f8f9fa] dark:bg-[#0f1419]"
          data-testid="business-content"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 lg:pb-8">
            <Outlet />
          </div>

          {!flushFooter && (
            <footer className="mt-12 py-5 px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#131921]">
              <span>© Aritii Market Seller Central.</span>{' '}
              <Link className="hover:text-[#e77600] dark:hover:text-[#febd69] transition-colors font-medium ml-2" to="/business/products">Products</Link> ·{' '}
              <Link className="hover:text-[#e77600] dark:hover:text-[#febd69] transition-colors font-medium" to="/help">Help</Link> ·{' '}
              <Link className="hover:text-[#e77600] dark:hover:text-[#febd69] transition-colors font-medium" to="/business/settings">Settings</Link>
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
