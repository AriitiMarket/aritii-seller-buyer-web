import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineMenu, AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'

/**
 * SellerCentralHeader - Seller Center Navigation Header
 *
 * Amazon-inspired design:
 * - Dark slate background (#131921)
 * - Orange accent color (#FF9900)
 * - Responsive logo (text-based for simplicity)
 * - Clean, minimal layout
 * - Mobile-optimized menu
 */
const SellerCentralHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { label: 'Overview', to: '#overview' },
    { label: 'Inventory', to: '#inventory' },
    { label: 'Orders', to: '#orders' },
    { label: 'Analytics', to: '#analytics' },
    { label: 'Help', to: '#help' },
  ]

  return (
    <header className="sticky top-10 z-40 bg-[#131921] border-b border-[#232f3e] shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-16">
        {/* Logo - Responsive */}
        <Link
          to="/seller"
          className="flex items-center gap-2 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] rounded"
          aria-label="Aritii Seller Central"
        >
          <div className="flex flex-col min-w-fit">
            <span className="text-xs font-bold text-white uppercase tracking-widest hidden sm:inline">Aritii</span>
            <span className="text-xs sm:text-sm font-semibold text-[#FF9900]">Seller Central</span>
          </div>
        </Link>

        {/* Desktop Navigation - Hidden on small screens */}
        <nav className="hidden lg:flex items-center gap-6 ml-8 flex-1">
          {navItems.map(({ label, to }) => (
            <a
              key={label}
              href={to}
              className="text-sm text-[#CCCCCB] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] rounded px-2 py-1"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Return to Marketplace */}
          <Link
            to="/products"
            className="hidden sm:inline-flex px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-[#CCCCCB] hover:text-white transition-colors rounded hover:bg-[#232f3e]"
            title="Return to shopping"
          >
            ← Shop
          </Link>

          {/* Sign In Button */}
          <Link
            to="/login"
            className="hidden sm:inline-flex px-3 py-1.5 text-xs sm:text-sm font-medium text-[#CCCCCB] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] rounded"
          >
            Sign In
          </Link>

          {/* Start Selling CTA */}
          <Link
            to="/seller-sign-up"
            className="px-3 sm:px-6 py-1.5 sm:py-2 bg-[#FF9900] hover:bg-[#E68A00] text-white text-xs sm:text-sm font-bold rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:ring-offset-2 focus-visible:ring-offset-[#131921] whitespace-nowrap"
          >
            Start Selling
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-[#CCCCCB] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] rounded"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <AiOutlineClose size={20} />
            ) : (
              <AiOutlineMenu size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#232f3e] border-t border-[#131921] px-4 py-3 space-y-2">
          {navItems.map(({ label, to }) => (
            <a
              key={label}
              href={to}
              className="block py-2 text-sm text-[#CCCCCB] hover:text-white transition-colors rounded hover:bg-[#131921] px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <div className="pt-3 border-t border-[#131921] space-y-2">
            <Link
              to="/login"
              className="block py-2 px-2 text-sm text-[#CCCCCB] hover:text-white transition-colors rounded hover:bg-[#131921]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default SellerCentralHeader
