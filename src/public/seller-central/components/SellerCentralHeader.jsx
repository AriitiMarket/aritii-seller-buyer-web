import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'

/**
 * SellerCentralHeader - Independent Seller Navigation
 *
 * Amazon-inspired design system:
 * - Dark slate header (#131921)
 * - Amazon orange CTAs (#FF9900)
 * - Professional typography
 * - Complete isolation from marketplace header
 */
const SellerCentralHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { label: 'How to Sell', to: '#how-to-sell' },
    { label: 'Pricing', to: '#pricing' },
    { label: 'Resources', to: '#resources' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 bg-[#131921] border-b border-[#232f3e] shadow-sm">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900]"
          aria-label="Aritii Seller Central home"
        >
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white uppercase tracking-widest">Aritii</span>
            <span className="text-sm font-semibold text-[#FF9900]">Seller Central</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 ml-8 flex-1">
          {navItems.map(({ label, to }) => (
            <a
              key={label}
              href={to}
              className="text-sm text-[#CCCCCB] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900]"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Return to Marketplace */}
          <Link
            to="/marketplace"
            className="hidden sm:inline-flex px-3 py-2 text-xs font-medium text-[#CCCCCB] hover:text-white transition-colors rounded hover:bg-[#232f3e]"
            title="Return to shopping"
          >
            ← Shopping
          </Link>

          {/* Sign In Button */}
          <Link
            to="/login"
            className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-[#CCCCCB] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900]"
          >
            Sign In
          </Link>

          {/* Start Selling CTA */}
          <Link
            to="/seller-sign-up"
            className="px-6 py-2 bg-[#FF9900] hover:bg-[#E68A00] text-white text-sm font-bold rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:ring-offset-2 focus-visible:ring-offset-[#131921]"
          >
            Start Selling
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 text-[#CCCCCB] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900]"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <AiOutlineClose size={24} />
            ) : (
              <AiOutlineMenu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#232f3e] border-t border-[#131921] px-4 py-3 space-y-3">
          {navItems.map(({ label, to }) => (
            <a
              key={label}
              href={to}
              className="block py-2 text-sm text-[#CCCCCB] hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <div className="pt-3 border-t border-[#131921] space-y-2">
            <Link
              to="/login"
              className="block py-2 text-sm text-[#CCCCCB] hover:text-white transition-colors"
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
