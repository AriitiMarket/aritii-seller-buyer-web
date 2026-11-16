import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BaseLayout from '@/components/layout/BaseLayout';
import ModernSellerHeader from '@/features/seller/components/SellerHeader/ModernSellerHeader';
import ModernSellerSidebar from '@/features/seller/components/SellerSidebar/ModernSellerSidebar';
import ModernSellerMobileDrawer from '@/features/seller/components/SellerMobileDrawer/ModernSellerMobileDrawer';

/**
 * BusinessLayout - Unified layout for all /business/* Seller Central routes.
 *
 * Extends BaseLayout with:
 * - Header: ModernSellerHeader (store switcher, search, metrics, sidebar toggle)
 * - Sidebar: ModernSellerSidebar (collapsible navigation)
 * - Drawer: ModernSellerMobileDrawer (mobile responsive navigation drawer)
 * - BottomNav: Mobile bottom navigation bar (Home, Products, Orders, Store, Account)
 * - Surfaces: Consistent dark-mode/light-mode backgrounds (`bg-[#f8f9fa] dark:bg-[#0f1419]`)
 * - ErrorBoundary: Crash containment isolating seller portal operations
 */
const BusinessLayout = ({ flushFooter = false, children }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const closeMobileDrawer = () => setMobileDrawerOpen(false);

  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  const sellerHeader = (
    <ModernSellerHeader 
      onMenuClick={() => setMobileDrawerOpen(true)}
      onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      sidebarCollapsed={sidebarCollapsed}
    />
  );

  const sellerDrawer = (
    <ModernSellerMobileDrawer
      isOpen={mobileDrawerOpen}
      onClose={closeMobileDrawer}
    />
  );

  const sellerSidebar = (
    <aside className="hidden lg:block border-r border-gray-200 dark:border-gray-800 h-full transition-all duration-300">
      <ModernSellerSidebar isCollapsed={sidebarCollapsed} />
    </aside>
  );

  const sellerFooter = !flushFooter ? (
    <footer className="mt-12 py-5 px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <span>© Aritii Market Seller Central.</span>{' '}
      <Link className="hover:text-[#75d04b] dark:hover:text-[#75d04b] transition-colors font-medium ml-2" to="/business/products">Products</Link> ·{' '}
      <Link className="hover:text-[#75d04b] dark:hover:text-[#75d04b] transition-colors font-medium" to="/help">Help</Link> ·{' '}
      <Link className="hover:text-[#75d04b] dark:hover:text-[#75d04b] transition-colors font-medium" to="/business/settings">Settings</Link>
    </footer>
  ) : null;

  const sellerBottomNav = (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
      <div className="flex items-center justify-around h-14 px-1">
        <Link
          to="/business"
          className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition ${location.pathname === '/business' ? 'text-[#75d04b] font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          aria-current={location.pathname === '/business' ? 'page' : undefined}
        >
          <span className="text-[20px]">🏠</span>
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link
          to="/business/products"
          className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition ${location.pathname === '/business/products' ? 'text-[#75d04b] font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          aria-current={location.pathname === '/business/products' ? 'page' : undefined}
        >
          <span className="text-[20px]">📦</span>
          <span className="text-[10px] font-medium">Products</span>
        </Link>
        <Link
          to="/business/orders"
          className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition ${location.pathname === '/business/orders' ? 'text-[#75d04b] font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          aria-current={location.pathname === '/business/orders' ? 'page' : undefined}
        >
          <span className="text-[20px]">📋</span>
          <span className="text-[10px] font-medium">Orders</span>
        </Link>
        <Link
          to="/business/shops"
          className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition ${location.pathname === '/business/shops' ? 'text-[#75d04b] font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          aria-current={location.pathname === '/business/shops' ? 'page' : undefined}
        >
          <span className="text-[20px]">🏪</span>
          <span className="text-[10px] font-medium">Store</span>
        </Link>
        <Link
          to="/business/settings"
          className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition ${location.pathname === '/business/settings' ? 'text-[#75d04b] font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          aria-current={location.pathname === '/business/settings' ? 'page' : undefined}
        >
          <span className="text-[20px]">👤</span>
          <span className="text-[10px] font-medium">Account</span>
        </Link>
      </div>
    </nav>
  );

  return (
    <BaseLayout
      portalName="Seller Central"
      layoutMode="viewport"
      className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
      header={sellerHeader}
      drawer={sellerDrawer}
      sidebar={sellerSidebar}
      sidebarDirect={true}
      bottomNav={sellerBottomNav}
      footer={sellerFooter}
      footerPlacement="inside-main"
      mainClassName="flex-1 min-w-0 min-h-0 overflow-y-auto outline-none bg-gray-50 bg-[#f8f9fa] dark:bg-gray-900 dark:bg-[#0f1419] text-gray-900 dark:text-white"
      contentWrapperClassName="max-w-7xl mx-auto p-4 md:p-6 lg:px-12 pb-24 lg:pb-8"
      dataTestId="business-content"
      withErrorBoundary={true}
    >
      {children}
    </BaseLayout>
  );
};

export { BusinessLayout };
export default BusinessLayout;
