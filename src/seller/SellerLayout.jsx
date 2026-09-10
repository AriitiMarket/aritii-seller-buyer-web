import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import SellerSidebar from './sidebar/SellerSidebar.jsx'
import DashboardHeader from '../components/seller/DashboardHeader.jsx'

/**
 * Shared layout for all seller portal pages.
 *
 * Desktop:  persistent SellerSidebar column + content.
 * Mobile:   sidebar hidden by default; opened as an off-canvas drawer via the
 *           hamburger button in DashboardHeader (closed after navigating).
 * Footer:   a MINIMAL seller footer — the large public marketplace footer is
 *           intentionally NOT rendered here (keeps the dashboard a focused
 *           business workspace and fixes the previous layout mixing).
 */
const SellerLayout = ({ sidebarActive = 1, children, flushHeader = false }) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const close = () => setSidebarOpen(false)

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Mobile drawer overlay + sidebar */}
      {sidebarOpen ? (
        <>
          <div className="fixed inset-0 z-[45] bg-black/40" onClick={close} aria-hidden="true" />
          <div
            className="fixed top-[80px] bottom-0 left-0 z-[46] w-[330px] bg-white shadow-xl overflow-y-auto transition-transform"
            role="dialog"
            aria-label="Seller menu"
          >
            <SellerSidebar active={sidebarActive} onNavigate={close} />
          </div>
        </>
      ) : null}

      <div className="flex w-full">
        {/* Desktop persistent sidebar */}
        <div className="shrink-0 800px:w-[330px] w-0 800px:block hidden">
          <SellerSidebar active={sidebarActive} />
        </div>
        <div className="flex-1 min-w-0 overflow-x-hidden px-2 py-2">{children}</div>
      </div>

      {/* Minimal seller footer — NOT the public marketplace footer */}
      {!flushHeader ? (
        <footer className="py-3 px-4 text-center text-xs text-brand-muted border-t border-brand bg-white">
          <span>© Aritii Market Seller Portal.</span>{' '}
          <a className="hover:underline" href="/">Marketplace</a> ·{' '}
          <a className="hover:underline" href="/faq">Help</a> ·{' '}
          <a className="hover:underline" href="/settings">Support</a>
        </footer>
      ) : null}
    </div>
  )
}

export default SellerLayout