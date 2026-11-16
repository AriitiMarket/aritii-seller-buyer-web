import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { useLayout } from '@/app/providers/LayoutContext';
import { useAuth } from '@/features/auth/hooks/useAuth';

/**
 * PortalHeader — The consolidated header for public portals (Seller Central, Delivery Center).
 */
const BREAKPOINTS = {
  md: {
    nav: 'md:flex',
    menu: 'md:hidden',
    mobileMenu: 'md:hidden',
    navGap: 'gap-8',
  },
  lg: {
    nav: 'lg:flex',
    menu: 'lg:hidden',
    mobileMenu: 'lg:hidden',
    navGap: 'gap-6',
  },
};

const PortalHeader = ({
  accent = '#f59e0b',
  accentHover = '#d97706',
  brandTop = 'Aritii',
  brandBottom = 'Seller Central',
  homeTo = '/',
  homeLabel = 'Aritii Seller Central',
  navItems = [],
  backLink = { label: '← Shop', to: '/products' },
  signInRole = 'SELLER',
  signInLabel = 'Sign In',
  cta = { label: 'Start Selling', to: '/seller-sign-up' },
  breakpoint = 'lg',
  stickyTop = 'top-0',
  zIndex = 'z-[70]',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const { openLoginModal } = useLayout();
  const { isAuthenticated, isSeller, isProvider } = useAuth();

  const isSellerPortal = signInRole === 'SELLER';
  const isDeliveryPortal = signInRole === 'DELIVERY' || signInRole === 'PROVIDER';
  const userWorkspaceLink = isSellerPortal && isSeller ? '/business' : isDeliveryPortal && isProvider ? '/provider' : null;
  const userWorkspaceLabel = isSellerPortal ? 'Seller Central' : isDeliveryPortal ? 'Driver Portal' : 'My Dashboard';
  const userCtaLabel = isSellerPortal ? 'Open Seller Central' : isDeliveryPortal ? 'Open Driver Portal' : 'Open Dashboard';

  useEffect(() => {
    if (!headerRef.current) return;
    const updateHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--portal-header-height', `${height}px`);
      }
    };
    updateHeight();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateHeight) : null;
    if (observer && headerRef.current) observer.observe(headerRef.current);
    window.addEventListener('resize', updateHeight);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateHeight);
      document.documentElement.style.removeProperty('--portal-header-height');
    };
  }, []);

  const handleSignIn = () => {
    openLoginModal(signInRole);
  };

  const bp = BREAKPOINTS[breakpoint] || BREAKPOINTS.lg;

  return (
    <header
      ref={headerRef}
      className={`sticky ${stickyTop} ${zIndex} bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xs transition-colors`}
    >
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-16">
        {/* Wordmark */}
        <Link
          to={homeTo}
          className="flex items-center gap-2 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 rounded-full px-2 py-1"
          style={{ '--tw-ring-color': accent }}
          aria-label={homeLabel}
        >
          <div className="flex flex-col min-w-fit">
            <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest hidden sm:inline">
              {brandTop}
            </span>
            <span className="text-xs sm:text-sm font-semibold" style={{ color: accent }}>
              {brandBottom}
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        {navItems.length > 0 && (
          <nav className={`hidden ${bp.nav} items-center ${bp.navGap} ml-8 flex-1`}>
            {navItems.map(({ label, to }) =>
              to.startsWith('#') ? (
                <a
                  key={label}
                  href={to}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 rounded-full px-3 py-1"
                  style={{ '--tw-ring-color': accent }}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  to={to}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 rounded-full px-3 py-1"
                  style={{ '--tw-ring-color': accent }}
                >
                  {label}
                </Link>
              )
            )}
          </nav>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {backLink && (
            <Link
              to={backLink.to}
              className="hidden sm:inline-flex px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Return to shopping"
            >
              {backLink.label}
            </Link>
          )}

          {isAuthenticated && userWorkspaceLink ? (
            <Link
              to={userWorkspaceLink}
              className="hidden sm:inline-flex px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 rounded-full hover:underline"
              style={{ '--tw-ring-color': accent }}
            >
              {userWorkspaceLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleSignIn}
              className="hidden sm:inline-flex px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 rounded-full cursor-pointer"
              style={{ '--tw-ring-color': accent }}
            >
              {signInLabel}
            </button>
          )}

          {cta && (
            <Link
              to={isAuthenticated && userWorkspaceLink ? userWorkspaceLink : cta.to}
              className="px-4 sm:px-6 py-2 text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-150 shadow-xs hover:shadow-sm whitespace-nowrap"
              style={{
                backgroundColor: accent,
                '--tw-ring-color': accent,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = accentHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = accent)}
            >
              {isAuthenticated && userWorkspaceLink ? userCtaLabel : cta.label}
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`${bp.menu} inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 rounded-full`}
            style={{ '--tw-ring-color': accent }}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={`${bp.mobileMenu} bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 space-y-2 shadow-lg`}>
          {navItems.map(({ label, to }) =>
            to.startsWith('#') ? (
              <a
                key={label}
                href={to}
                className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 px-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                to={to}
                className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 px-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            )
          )}

          <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
            {backLink && (
              <Link
                to={backLink.to}
                className="block py-2 px-3 text-sm font-semibold transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ color: accent }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {backLink.label}
              </Link>
            )}

            {isAuthenticated && userWorkspaceLink ? (
              <Link
                to={userWorkspaceLink}
                className="block py-2 px-3 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {userWorkspaceLabel}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignIn();
                }}
                className="w-full text-left py-2 px-3 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                {signInLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export { PortalHeader };
export default PortalHeader;
