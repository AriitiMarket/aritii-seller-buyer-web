import React, { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import SkipToContent from '@/shared/components/SkipToContent'
import BuyerHeader from '@/buyer/components/BuyerHeader'
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

      {/* ===== Buyer header — same as marketplace header (dark, centered search) ===== */}
      <BuyerHeader />

      {/* ===== Marketplace subnav — department rail below header ===== */}
      <SubNavBar stickyTopClass="top-16" />

      <div className="flex-1 overflow-y-auto pb-16 lg:pb-0">
        <main id="main-content" tabIndex={-1} className="outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav — buyer quick actions (5 items) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 safe-area-bottom">
        <div className="flex items-center justify-around h-14 px-1">
          {/* Dashboard */}
          <Link
            to="/my-dashboard"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition-colors ${
              location.pathname === '/my-dashboard'
                ? 'text-[#75d04b]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-current={location.pathname === '/my-dashboard' ? 'page' : undefined}
            aria-label="Dashboard"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4" />
            </svg>
            <span className="text-[10px] font-medium whitespace-nowrap">Dashboard</span>
          </Link>

          {/* Products */}
          <Link
            to="/products"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition-colors ${
              location.pathname === '/products'
                ? 'text-[#75d04b]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-current={location.pathname === '/products' ? 'page' : undefined}
            aria-label="Products"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-[10px] font-medium whitespace-nowrap">Products</span>
          </Link>

          {/* Cart */}
          <Link
            to="/my-dashboard/cart"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition-colors relative ${
              location.pathname === '/my-dashboard/cart'
                ? 'text-[#75d04b]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-current={location.pathname === '/my-dashboard/cart' ? 'page' : undefined}
            aria-label="Cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-[10px] font-medium whitespace-nowrap">Cart</span>
          </Link>

          {/* Orders */}
          <Link
            to="/my-dashboard/orders"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition-colors ${
              location.pathname === '/my-dashboard/orders'
                ? 'text-[#75d04b]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-current={location.pathname === '/my-dashboard/orders' ? 'page' : undefined}
            aria-label="Orders"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span className="text-[10px] font-medium whitespace-nowrap">Orders</span>
          </Link>

          {/* Account */}
          <Link
            to="/my-dashboard/profile"
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition-colors ${
              location.pathname === '/my-dashboard/profile'
                ? 'text-[#75d04b]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-current={location.pathname === '/my-dashboard/profile' ? 'page' : undefined}
            aria-label="Account"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium whitespace-nowrap">Account</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default BuyerLayout
