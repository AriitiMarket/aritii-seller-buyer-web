import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { useLayout } from '@/app/providers/LayoutContext';

/**
 * PortalHeader — the ONE header for every public portal.
 *
 * The Seller Center and the Delivery Center used to carry their own copy of
 * this header (dark slate bar, wordmark stack, section nav, "back to shop"
 * link, sign-in button, accent CTA, mobile menu). The copies drifted apart and
 * their section anchors pointed at ids that did not exist on the pages that
 * rendered them. This component is the single implementation; the portals pass
 * their own brand, accent, navigation and calls to action.
 *
 * Only the accent changes between portals:
 *   Seller   → #FF9900 (orange)
 *   Delivery → #00A8E1 (sky)
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
  accent = '#FF9900',
  accentHover = '#E68A00',
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
  const headerRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openLoginModal } = useLayout();
  const bp = BREAKPOINTS[breakpoint] || BREAKPOINTS.lg;

  useEffect(() => {
    if (!headerRef.current) return;
    const updateHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--market-header-height', `${height}px`);
      }
    };
    updateHeight();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateHeight) : null;
    if (observer && headerRef.current) {
      observer.observe(headerRef.current);
    }
    window.addEventListener('resize', updateHeight);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateHeight);
      document.documentElement.style.removeProperty('--market-header-height');
    };
  }, []);

  const handleSignIn = () => {
    setMobileMenuOpen(false);
    openLoginModal(signInRole);
  };

  return (
    <header
      ref={headerRef}
      className={`sticky ${stickyTop} ${zIndex} bg-[#131921] border-b border-[#232f3e] shadow-sm`}
    >
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-16">
        {/* Wordmark */}
        <Link
          to={homeTo}
          className="flex items-center gap-2 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 rounded"
          style={{ '--tw-ring-color': accent }}
          aria-label={homeLabel}
        >
          <div className="flex flex-col min-w-fit">
            <span className="text-xs font-bold text-white uppercase tracking-widest hidden sm:inline">
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
                  className="text-sm text-[#CCCCCB] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 rounded px-2 py-1"
                  style={{ '--tw-ring-color': accent }}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  to={to}
                  className="text-sm text-[#CCCCCB] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 rounded px-2 py-1"
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
              className="hidden sm:inline-flex px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-[#CCCCCB] hover:text-white transition-colors rounded hover:bg-[#232f3e]"
              title="Return to shopping"
            >
              {backLink.label}
            </Link>
          )}

          <button
            type="button"
            onClick={handleSignIn}
            className="hidden sm:inline-flex px-3 py-1.5 text-xs sm:text-sm font-medium text-[#CCCCCB] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 rounded"
            style={{ '--tw-ring-color': accent }}
          >
            {signInLabel}
          </button>

          {cta && (
            <Link
              to={cta.to}
              className="px-3 sm:px-6 py-1.5 sm:py-2 text-white text-xs sm:text-sm font-bold rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#131921] whitespace-nowrap"
              style={{
                backgroundColor: accent,
                '--tw-ring-color': accent,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = accentHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = accent)}
            >
              {cta.label}
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`${bp.menu} inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-[#CCCCCB] hover:text-white focus-visible:outline-none focus-visible:ring-2 rounded`}
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
        <div className={`${bp.mobileMenu} bg-[#232f3e] border-t border-[#131921] px-4 py-3 space-y-2`}>
          {navItems.map(({ label, to }) =>
            to.startsWith('#') ? (
              <a
                key={label}
                href={to}
                className="block py-2 text-sm text-[#CCCCCB] hover:text-white transition-colors rounded hover:bg-[#131921] px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                to={to}
                className="block py-2 text-sm text-[#CCCCCB] hover:text-white transition-colors rounded hover:bg-[#131921] px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            )
          )}
          <div className="pt-3 border-t border-[#131921] space-y-2">
            <button
              type="button"
              onClick={handleSignIn}
              className="block py-2 px-2 text-sm text-[#CCCCCB] hover:text-white transition-colors rounded hover:bg-[#131921]"
            >
              {signInLabel}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export { PortalHeader };
export default PortalHeader;
