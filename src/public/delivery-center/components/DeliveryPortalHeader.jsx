import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowLeft, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { useLayout } from '@/app/providers/LayoutContext';
import { useAuth } from '@/features/auth/hooks/useAuth';

/**
 * DeliveryPortalHeader — the Delivery Center portal header.
 *
 * Modernized with #141414 dark surface, sky-cyan Delivery Partner badge,
 * pill-shaped #75d04b CTA, and "Back to Shopping" pathway.
 */
const DeliveryPortalHeader = ({ navItems = [] }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openLoginModal } = useLayout();
  const { isAuthenticated, isProvider } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#141414] border-b border-gray-800 shadow-sm transition-colors text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-16">
        {/* Brand + Workspace Badge */}
        <div className="flex items-center gap-3">
          <Link
            to="/delivery-center"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b] rounded-full px-2 py-1"
            aria-label="Aritii Delivery Center home"
          >
            <span className="text-xl font-extrabold tracking-tight text-white">aritii</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
              Delivery Partner
            </span>
          </Link>
        </div>

        {/* Center Nav items for sections */}
        {navItems.length > 0 && (
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(({ label, to }) =>
              to.startsWith('#') ? (
                <a
                  key={label}
                  href={to}
                  className="text-sm font-medium text-gray-300 hover:text-[#75d04b] transition-colors"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  to={to}
                  className="text-sm font-medium text-gray-300 hover:text-[#75d04b] transition-colors"
                >
                  {label}
                </Link>
              )
            )}
          </nav>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Back to Shopping return link */}
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-300 hover:text-[#75d04b] transition-colors"
            title="Return to shopping"
          >
            <AiOutlineArrowLeft size={14} />
            <span className="hidden sm:inline">Back to Shopping</span>
            <span className="sm:hidden">Shop</span>
          </Link>

          {/* Auth / Dashboard link or Sign In */}
          {isAuthenticated && isProvider ? (
            <Link
              to="/provider"
              className="hidden sm:inline-flex px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-200 hover:text-[#75d04b] transition-colors"
            >
              Driver Dashboard
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openLoginModal('PROVIDER')}
              className="hidden sm:inline-flex px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Primary CTA */}
          <Link
            to={isAuthenticated && isProvider ? '/provider' : '/delivery-sign-up'}
            className="px-4 sm:px-6 py-2 bg-[#75d04b] hover:brightness-95 text-gray-900 font-semibold text-xs sm:text-sm rounded-full transition-all duration-150 shadow-sm whitespace-nowrap"
          >
            {isAuthenticated && isProvider ? 'Driver Dashboard' : 'Start Delivering'}
          </Link>

          {/* Mobile menu toggle */}
          {navItems.length > 0 && (
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#181818] border-b border-gray-800 px-4 py-4 space-y-3">
          {navItems.map(({ label, to }) =>
            to.startsWith('#') ? (
              <a
                key={label}
                href={to}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-300 hover:text-[#75d04b] py-1"
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-300 hover:text-[#75d04b] py-1"
              >
                {label}
              </Link>
            )
          )}
          {!isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openLoginModal('PROVIDER');
              }}
              className="block w-full text-left text-sm font-medium text-gray-300 hover:text-white py-1 cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default DeliveryPortalHeader;
