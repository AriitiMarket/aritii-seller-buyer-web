import React, { useState, useEffect, useCallback } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import BuyerHeader from '@/buyer/components/BuyerHeader'
import BuyerSidebar from '@/buyer/components/BuyerSidebar'
import MobileNav from '@/buyer/components/MobileNav'
import CategoryNav from '@/shared/categories/CategoryNav'
import SkipToContent from '@/shared/components/SkipToContent'
import { BUYER_SIDEBAR } from '@/config/navigation'
import { getNavIcon } from '@/config/navIcons'
import { MdClose } from 'react-icons/md'

const BuyerLayout = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false)

  // Sidebar collapse: persist to localStorage
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('buyer-sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      try { localStorage.setItem('buyer-sidebar-collapsed', String(next)); } catch {}
      return next;
    });
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawers open
  useEffect(() => {
    const locked = mobileMenuOpen || moreDrawerOpen;
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen, moreDrawerOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const closeMoreDrawer = () => setMoreDrawerOpen(false);

  // One horizontal category rail (the same component the public catalog
  // uses) — product categories on the marketplace, SHOP categories on shops.
  const categoryRail =
    location.pathname === '/my-dashboard/marketplace'
      ? { basePath: '/my-dashboard/marketplace', type: 'product', allLabel: 'All' }
      : location.pathname === '/my-dashboard/shops'
        ? { basePath: '/my-dashboard/shops', type: 'business', allLabel: 'All Shops' }
        : null

  // Remaining sidebar items not in bottom nav (for the "More" drawer)
  const moreItems = BUYER_SIDEBAR.filter(it => {
    if (it.section || it.type) return false;
    const bottomPaths = ['/my-dashboard', '/my-dashboard/marketplace', '/my-dashboard/shops', '/my-dashboard/orders'];
    return !bottomPaths.includes(it.to);
  });

  return (
    <div className="flex flex-col h-screen bg-[#F7F8FA]">
      <SkipToContent />

      {/* Header */}
      <BuyerHeader onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* ═══════ Desktop Sidebar ═══════ */}
        <div className="hidden lg:block flex-shrink-0 h-full overflow-y-auto">
          <BuyerSidebar collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
        </div>

        {/* ═══════ Tablet/Mobile Sidebar Drawer ═══════ */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-[45] bg-black/40 lg:hidden transition-opacity"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
            <div
              className="fixed top-0 bottom-0 left-0 z-[46] lg:hidden shadow-2xl overflow-y-auto transition-transform duration-300 ease-out w-72 max-w-full"
              style={{ transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)' }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <BuyerSidebar onClose={closeMobileMenu} />
            </div>
          </>
        )}

        {/* ═══════ Main Content ═══════ */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

          {/* Category rail */}
          {categoryRail && (
            <div className="bg-white border-b border-[#E5E7EB] w-full">
              <div className="max-w-7xl mx-auto px-4 xl:px-6 py-2">
                <CategoryNav variant="rail" {...categoryRail} />
              </div>
            </div>
          )}

          {/* Page Content */}
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 overflow-y-auto"
            data-testid="buyer-account-content"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-6 py-6 md:py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* ═══════ Mobile Bottom Nav ═══════ */}
      <MobileNav onMoreClick={() => setMoreDrawerOpen(true)} />

      {/* ═══════ Mobile "More" Drawer ═══════ */}
      {moreDrawerOpen && (
        <>
          <div
            className="fixed inset-0 z-[45] bg-black/40 lg:hidden"
            onClick={closeMoreDrawer}
            aria-hidden="true"
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-[46] lg:hidden bg-white rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto animate-slide-up"
            role="dialog"
            aria-modal="true"
            aria-label="More navigation"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
              <h2 className="text-sm font-bold text-[#171A21]">More</h2>
              <button onClick={closeMoreDrawer} className="p-1 rounded-lg hover:bg-gray-100 transition" aria-label="Close">
                <MdClose size={20} className="text-[#667085]" />
              </button>
            </div>
            <nav className="p-2" aria-label="More navigation items">
              {moreItems.map((it) => {
                const Icon = getNavIcon(it.icon);
                const active = isActiveTab(it.to, it.end);
                return (
                  <Link
                    key={it.to}
                    to={it.to}
                    onClick={closeMoreDrawer}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                      active ? 'bg-[#E9ECF5] text-[#20305C] font-semibold' : 'text-[#667085] hover:bg-[#F7F8FA]'
                    }`}
                  >
                    {Icon && <Icon size={20} />}
                    <span className="text-sm font-medium">{it.label}</span>
                  </Link>
                );
              })}

              {/* Account items in More drawer */}
              <div className="border-t border-[#E5E7EB] mt-2 pt-2">
                <p className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account</p>
                <Link
                  to="/my-dashboard/profile"
                  onClick={closeMoreDrawer}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#171A21] hover:bg-[#F7F8FA] transition"
                >
                  <span className="text-sm font-medium">My Profile</span>
                </Link>
                <Link
                  to="/my-dashboard/settings"
                  onClick={closeMoreDrawer}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#171A21] hover:bg-[#F7F8FA] transition"
                >
                  <span className="text-sm font-medium">Settings</span>
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}

export default BuyerLayout
