import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import ProviderHeader from './ProviderHeader';
import ProviderSidebar from './ProviderSidebar';
import ProviderMobileDrawer from './ProviderMobileDrawer';
import SkipToContent from '@/shared/components/SkipToContent';

/**
 * ProviderLayout - the single layout for every /provider/* route.
 *
 * Desktop shell (viewport-locked):
 *   ┌────────────────────────────────────┐
 *   │ ProviderHeader (fixed height)       │
 *   ├──────────┬─────────────────────────┤
 *   │ Sidebar  │ main (ONLY scrollable)  │
 *   │ (fixed)  │  page content + footer  │
 *   └──────────┴─────────────────────────┘
 *
 * The page itself does not scroll — only <main> scrolls vertically.
 * The sidebar stays pinned for the full height of the viewport.
 *
 * Mobile: off-canvas drawer opened from the header's hamburger button.
 */
const ProviderLayout = ({ flushFooter = false }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const closeMobileDrawer = () => setMobileDrawerOpen(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <SkipToContent />

      {/* Header — fixed row, does not scroll away */}
      <ProviderHeader onMenuClick={() => setMobileDrawerOpen(true)} />

      {/* Mobile Drawer */}
      <ProviderMobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={closeMobileDrawer}
      />

      {/* Body: fixed sidebar + independently scrollable content */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar — full remaining height, does not scroll with content */}
        <aside className="hidden lg:flex lg:flex-col flex-shrink-0 h-full">
          <ProviderSidebar />
        </aside>

        {/* Page Content — the ONLY vertical scroll container */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 min-w-0 min-h-0 overflow-y-auto px-4 py-6 lg:px-6 lg:py-6 outline-none"
          data-testid="provider-content"
        >
          <Outlet />

          {/* Footer lives inside the scroll area so it never clips */}
          {!flushFooter ? (
            <footer className="mt-8 py-4 px-6 text-center text-xs text-gray-500 border-t border-gray-200 bg-white">
              <span>© Aritii Market Provider Portal.</span>{' '}
              <Link className="hover:underline text-[#75d04b]" to="/provider/available-work">Available Work</Link> ·{' '}
              <Link className="hover:underline text-[#75d04b]" to="/provider/deliveries">My Deliveries</Link>
            </footer>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout;
