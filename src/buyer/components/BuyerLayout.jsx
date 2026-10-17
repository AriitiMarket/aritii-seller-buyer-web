import React, { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import SkipToContent from '@/shared/components/SkipToContent'
import MarketplaceHeader from '@/public/components/MarketplaceHeader'
import SubNavBar from '@/features/marketplace/components/SubNavBar'

const BuyerLayout = () => {
  const location = useLocation()

  // Close any open mobile drawer on route change
  useEffect(() => {
    document.body.style.overflow = ''
  }, [location.pathname])

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-950">
      <SkipToContent />

      {/* ===== Marketplace header — same as shopping pages (includes mobile drawer) ===== */}
      <MarketplaceHeader />

      {/* ===== Marketplace subnav — department rail below header ===== */}
      <SubNavBar />

      <div className="flex-1 overflow-y-auto">
        <main id="main-content" tabIndex={-1} className="outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav — buyer quick actions */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-200/60 safe-area-bottom">
        <div className="flex items-center justify-around h-14 px-1">
          <Link
            to="/my-dashboard"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition ${location.pathname === '/my-dashboard' ? 'text-green-500' : 'text-gray-500'}`}
            aria-current={location.pathname === '/my-dashboard' ? 'page' : undefined}
          >
            <span className="text-[20px]">🏠</span>
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link
            to="/my-dashboard/orders"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition ${location.pathname === '/my-dashboard/orders' ? 'text-green-500' : 'text-gray-500'}`}
            aria-current={location.pathname === '/my-dashboard/orders' ? 'page' : undefined}
          >
            <span className="text-[20px]">📦</span>
            <span className="text-[10px] font-medium">Orders</span>
          </Link>
          <Link
            to="/my-dashboard/cart"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition relative ${location.pathname === '/my-dashboard/cart' ? 'text-green-500' : 'text-gray-500'}`}
            aria-current={location.pathname === '/my-dashboard/cart' ? 'page' : undefined}
          >
            <span className="text-[20px]">🛒</span>
            <span className="text-[10px] font-medium">Cart</span>
          </Link>
          <Link
            to="/my-dashboard/wishlist"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition ${location.pathname === '/my-dashboard/wishlist' ? 'text-green-500' : 'text-gray-500'}`}
            aria-current={location.pathname === '/my-dashboard/wishlist' ? 'page' : undefined}
          >
            <span className="text-[20px]">❤</span>
            <span className="text-[10px] font-medium">Saved</span>
          </Link>
          <Link
            to="/my-dashboard/requests"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition ${location.pathname.startsWith('/my-dashboard/requests') ? 'text-green-500' : 'text-gray-500'}`}
            aria-current={location.pathname.startsWith('/my-dashboard/requests') ? 'page' : undefined}
          >
            <span className="text-[20px]">💬</span>
            <span className="text-[10px] font-medium">Requests</span>
          </Link>
          <Link
            to="/my-dashboard/settings"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition ${location.pathname === '/my-dashboard/settings' ? 'text-green-500' : 'text-gray-500'}`}
            aria-current={location.pathname === '/my-dashboard/settings' ? 'page' : undefined}
          >
            <span className="text-[20px]">👤</span>
            <span className="text-[10px] font-medium">Account</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default BuyerLayout
