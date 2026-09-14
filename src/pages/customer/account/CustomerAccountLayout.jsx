import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BuyerHeader from '../../../components/layout/BuyerHeader'
import CustomerAccountSidebar from './CustomerAccountSidebar'

const drawerWidth = 'w-[60%] sm:w-[50%] md:w-[40%] lg:w-[264px]'

/**
 * Buyer-only account layout — the customer's private dashboard.
 *
 * This is intentionally SEPARATE from the public marketplace layout:
 *  - Uses a dedicated BuyerHeader (no marketplace search/categories/cart).
 *  - Purchases sidebar is a persistent fixed column on desktop and a
 *    slide-out drawer (opened via the mobile hamburger) on small screens.
 *  - No large public marketplace footer; only a tiny account footer.
 *
 * Auth is enforced by wrapping this layout in ProtectedRoute (customer login).
 */
const CustomerAccountLayout = () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF6EC]">
      <BuyerHeader onMenuClick={() => setMenuOpen(!menuOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile drawer overlay */}
        {menuOpen ? (
          <>
            <div
              className="fixed inset-0 z-[45] bg-black/40 lg:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />
            <div
              className={`fixed top-[72px] bottom-0 left-0 z-[46] ${drawerWidth} bg-white overflow-y-auto transition-transform lg:hidden`}
              role="dialog"
              aria-label="Account menu"
            >
              <div className="overflow-y-auto max-h-[calc(100vh-72px)]">
                <CustomerAccountSidebar activePath={location.pathname} onClose={closeMenu} />
              </div>
            </div>
          </>
        ) : null}

        {/* Desktop persistent sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-[264px] bg-white shadow-sm rounded-[12px] m-4 sticky top-[88px] max-h-[calc(100vh-104px)] overflow-y-auto flex-shrink-0">
          <CustomerAccountSidebar activePath={location.pathname} />
        </aside>

        <main className="flex-1 min-w-0 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6" data-testid="buyer-account-content">
          <Outlet />
        </main>
      </div>

      {/* Minimal account footer — NOT the large public marketplace footer */}
      <footer className="py-3 px-4 text-center text-xs sm:text-sm text-brand-muted border-t border-brand bg-white">
        <span>© Aritii Market.</span>{' '}
        <a className="hover:underline" href="/">Privacy</a> ·{' '}
        <a className="hover:underline" href="/faq">Help &amp; Support</a>
      </footer>
    </div>
  )
}

export default CustomerAccountLayout