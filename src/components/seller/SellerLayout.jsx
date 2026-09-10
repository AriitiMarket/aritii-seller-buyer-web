import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import DashboardHeader from './DashboardHeader'
import DashboardSideBar from './DashboardSideBar'

const sidebarWidth = 'w-[330px]'

/**
 * Seller Portal Layout — used by every seller dashboard page.
 *
 * Desktop:  persistent DashboardSideBar column on the left + content.
 * Mobile:   sidebar hidden by default; opened as an off-canvas drawer via the
 *           hamburger button in DashboardHeader. Closes after navigation.
 *
 * No public marketplace header/footer is rendered here — only the minimal
 * seller header + a tiny seller-footer line.
 */
const SellerLayout = ({ active = 1, children }) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="min-h-screen bg-brand-cream">
      <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Mobile drawer overlay + sidebar */}
      {sidebarOpen ? (
        <>
          <div
            className="fixed inset-0 z-[45] bg-black/40"
            onClick={closeSidebar}
            aria-hidden="true"
          />
          <div
            className={`fixed top-[80px] bottom-0 left-0 z-[46] ${sidebarWidth} bg-white shadow-xl overflow-y-auto transition-transform`}
            role="dialog"
            aria-label="Seller menu"
          >
            <DashboardSideBar
              active={active}
              footer
              onNavigate={closeSidebar}
            />
          </div>
        </>
      ) : null}

      <div className="flex w-full">
        {/* Desktop persistent sidebar */}
        <div className="shrink-0 800px:w-[330px] w-0 800px:block hidden">
          <DashboardSideBar active={active} />
        </div>

        <div className="flex-1 min-w-0 overflow-x-hidden">
          {children}
        </div>
      </div>

      {/* Minimal seller footer — not the public marketplace footer */}
      <footer className="py-3 px-4 text-center text-xs text-brand-muted border-t border-brand bg-white">
        <span>© Aritii Market Seller Portal.</span>{' '}
        <a className="hover:underline" href="/">Marketplace</a> ·{' '}
        <a className="hover:underline" href="/faq">Help</a> ·{' '}
        <a className="hover:underline" href="/settings">Support</a>
      </footer>
    </div>
  )
}

export default SellerLayout