import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import SellerCentralHeader from '@/public/seller-central/components/SellerCentralHeader'
import SellerCentralFooter from '@/public/seller-central/components/SellerCentralFooter'
import SkipToContent from '@/shared/components/SkipToContent'
import PublicScrollToTop from '@/public/components/PublicScrollToTop'

/**
 * SellerCenterLayout — shared layout for Seller Center pages.
 *
 * Provides:
 *   - SellerCentralHeader (independent seller branding)
 *   - SellerCenter sub-navigation (Overview, Benefits, How-It-Works, Workspace)
 *   - Content area
 *   - SellerCentralFooter
 *
 * Each sub-section is a separate route, so users can navigate directly
 * to /seller-center/overview, /seller-center/benefits, etc.
 *
 * IMPORTANT: Uses INDEPENDENT header/footer, NOT the shared PublicHeader.
 * This ensures Seller Center has complete visual isolation from marketplace.
 */

const SELLER_CENTER_SECTIONS = [
  { label: 'Overview', to: '/seller-center/overview', match: ['/seller-center/overview', '/sell-on-aritii'] },
  { label: 'Benefits', to: '/seller-center/benefits', match: ['/seller-center/benefits'] },
  { label: 'How It Works', to: '/seller-center/how-it-works', match: ['/seller-center/how-it-works'] },
  { label: 'Workspace', to: '/seller-center/workspace', match: ['/seller-center/workspace'] },
]

const SellerCenterLayout = ({ children, hideFooter = false }) => {
  const location = useLocation()

  const isActive = (paths) =>
    paths.some((p) => location.pathname.startsWith(p))

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <PublicScrollToTop />
      <SkipToContent />
      
      {/* Independent Seller Central Header - NOT the shared PublicHeader */}
      <SellerCentralHeader />

      {/* Seller Center Sub-Navigation */}
      <nav
        className="sticky top-16 z-40 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800"
        aria-label="Seller Center sections"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 h-14">
            {SELLER_CENTER_SECTIONS.map(({ label, to, match }) => {
              const active = isActive(match)
              return (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors relative ${
                    active
                      ? `text-white bg-[#FF9900]`
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-[3px] rounded-full bg-[#FF9900]"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile Navigation - Dropdown */}
          <div className="md:hidden flex items-center justify-between h-14">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {SELLER_CENTER_SECTIONS.find((s) => isActive(s.match))?.label || 'Seller Center'}
            </span>
            <div className="flex gap-1">
              {SELLER_CENTER_SECTIONS.map(({ label, to, match }) => {
                const active = isActive(match)
                if (!active) return null
                return (
                  <Link
                    key={to}
                    to={to}
                    className="p-1"
                    aria-label={`Go to ${label}`}
                  >
                    <span className="sr-only">You are on: {label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none bg-white dark:bg-gray-950">
        {children}
      </main>

      {!hideFooter && <SellerCentralFooter />}
    </div>
  )
}

export { SellerCenterLayout }
export default SellerCenterLayout
