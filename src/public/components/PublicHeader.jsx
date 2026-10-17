import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineMenu, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai'
import BrandLogo from '@/components/common/BrandLogo'
import HeaderShell from '@/shared/components/header/HeaderShell'
import HeaderSearch from '@/shared/components/header/HeaderSearch'
import MobileDrawer from '@/shared/components/header/MobileDrawer'
import { categoryHref } from '@/shared/categories/categoryHref'
import { useAuth } from '@/auth/hooks/useAuth'
import { useSelector } from 'react-redux'
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories'
import { EXPERIENCE_SUBNAV } from '@/public/experiences'
import { experienceForPath, BRAND, MOBILE_NAV_PRIMARY } from '@/public/experiences'

/**
 * PublicHeader — the ONE shared header for every public experience
 * (homepage, marketplace, seller, delivery, catalog, info pages).
 *
 * Design standard:
 *  - One structure everywhere: logo → experience nav → search → cart → auth.
 *  - Experience nav: Home | Marketplace | Sell on Aritii | Delivery. The active
 *    experience is marked with a pill + underline bar in that experience's
 *    accent (Marketplace green, Seller forest, Delivery slate blue).
 *  - A sub-brand chip under/beside the logo names the current experience.
 *  - Typography, radii, focus rings and hover patterns are identical across
 *    experiences — only the accent changes.
 *  - Authentication reuses the existing flows (/login, /sign-up).
 */

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/marketplace', label: 'Marketplace', experienceKey: 'marketplace', match: ['/marketplace', '/products', '/product/', '/categories', '/category/', '/shops', '/shop/', '/deals', '/best-selling', '/search'] },
  { to: '/sell-on-aritii', label: 'Sell on Aritii', experienceKey: 'seller', match: ['/sell-on-aritii', '/become-a-seller'] },
  { to: '/delivery', label: 'Delivery', experienceKey: 'delivery', match: ['/delivery'] },
]

const PublicHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  const { cart } = useSelector((state) => state.cart || {})
  const cartItemCount = cart ? cart.length : 0
  const { categories } = useCatalogCategories()

  const experience = experienceForPath(location.pathname)
  const createAccountPath = experience.key === 'seller'
    ? '/seller-sign-up'
    : experience.key === 'delivery' ? '/delivery-sign-up' : '/sign-up'

  // Get first 5 categories for mobile quick links
  const quickCategories = categories.slice(0, 5)

  // Accent-follows-experience nav pill. Structure identical for all items.
  // NOTE: the absolute underline bar lives ONLY in the desktop nav — in the
  // mobile drawer the same class renders inside a vertical list, where an
  // absolutely-positioned bar would float into the next item. NavLink children
  // render relative to the header only on lg+, and the drawer never shows the
  // bar because it wraps its labels in a plain span (no absolute child).
  const navLinkClass = ({ isActive }) =>
    `relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 ${experience.ring} ${
      isActive
        ? 'text-white font-semibold'
        : 'text-white/85 hover:text-white'
    }`

  // Drawer variant: same tokens, vertical layout, no absolute bar.
  const drawerLinkClass = ({ isActive }) =>
    `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b] ${
      isActive
        ? 'text-gray-900 dark:text-white font-semibold'
        : 'text-gray-700 dark:text-gray-300 hover:text-[#75d04b] hover:bg-gray-50 dark:hover:bg-gray-800'
    }`

  // Mobile drawer: primary rows only (Home + the three experiences). Tapping
  // an experience row expands its sub-menu (sourced from EXPERIENCE_SUBNAV so
  // mobile mirrors the desktop sub-header exactly). Sign In / Create Account
  // are appended as plain rows below.
  const drawerGroups = [
    ...MOBILE_NAV_PRIMARY.map((item) =>
      item.experienceKey
        ? {
            to: item.to,
            label: item.label,
            expandable: true,
            experienceKey: item.experienceKey,
            active: experience.key === item.experienceKey,
            items: [
              { to: EXPERIENCE_SUBNAV[item.experienceKey][0].to, label: 'Overview' },
              ...EXPERIENCE_SUBNAV[item.experienceKey].filter((s) => !s.cta && s.label !== 'Overview').map((s) => ({
                to: s.to,
                label: s.label,
                hash: s.hash,
              })),
            ],
          }
        : { to: item.to, label: item.label, end: true }
    ),
  ];

  return (
    <>
      <HeaderShell height="h-16" bg="bg-[#20305C]" position="fixed" zIndex="z-[70]">
        {/* Logo + current-experience sub-brand */}
        <Link
          to="/"
            className="flex items-center gap-3 flex-shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2"
            style={{ '--tw-ring-color': experience.accent }}
          aria-label="Aritii Market home"
        >
          <BrandLogo size="sm" showText showTagline={false} linked={false} tone="light" />
          <span
            className="hidden xl:flex items-center gap-1.5 pl-3 border-l border-gray-200 dark:border-gray-700 text-xs font-semibold uppercase tracking-wider"
            style={{ color: experience.accent }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: experience.accent }} aria-hidden="true" />
            {experience.label}
          </span>
        </Link>

        {/* Desktop Nav — one shared experience navigation */}
        <nav className="hidden lg:flex items-center gap-1 ml-6" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, match, experienceKey }) => {
            const isActive = match
              ? match.some((m) => location.pathname.startsWith(m))
              : location.pathname === to;
            const subItems = experienceKey ? EXPERIENCE_SUBNAV[experienceKey] || [] : [];
            return (
              <div key={to} className="relative group">
                <Link
                  to={to}
                  className={navLinkClass({ isActive })}
                  aria-current={isActive ? 'page' : undefined}
                  aria-haspopup={subItems.length ? 'true' : undefined}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="hidden lg:block absolute left-3 right-3 -bottom-[13px] h-[3px] rounded-full"
                      style={{ backgroundColor: experience.accent }}
                    />
                  )}
                  <span className="relative whitespace-nowrap">{label}</span>
                  {subItems.length > 0 && <span className="ml-0.5 text-[10px] transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true">⌄</span>}
                </Link>
                {subItems.length > 0 && (
                  <div className="invisible absolute left-0 top-full z-[60] w-60 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                      {subItems.map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors duration-150 hover:bg-[#f2f1f8] hover:text-[#5e5a8b] focus-visible:bg-[#f2f1f8] focus-visible:text-[#5e5a8b] focus-visible:outline-none dark:text-gray-200 dark:hover:bg-gray-800"
                          onClick={item.hash ? (event) => {
                            const target = document.getElementById(item.hash);
                            if (!target) return;
                            event.preventDefault();
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            window.history.replaceState(null, '', `#${item.hash}`);
                          } : undefined}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Search — in-header from lg up; below the header on smaller screens */}
          <div className="hidden lg:block w-40 xl:w-72">
            <HeaderSearch
              variant="inline"
              destination={(term) => `/products?search=${encodeURIComponent(term)}`}
              placeholder="Search products, shops…"
              ariaLabel="Search products and shops"
              className="w-full"
            />
          </div>

          {/* Cart icon — the dedicated cart page */}
          <Link
            to="/my-dashboard/cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2"
            style={{ '--tw-ring-color': experience.accent }}
            aria-label="Shopping cart"
          >
            <AiOutlineShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-white text-xs font-bold rounded-full"
                style={{ backgroundColor: BRAND.primary }}
              >
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </Link>

          {/* Authentication actions — reuse the existing auth flow */}
          {isAuthenticated ? (
            <Link
              to="/my-dashboard"
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2"
              style={{ '--tw-ring-color': experience.accent }}
              aria-label="My account"
            >
              <AiOutlineUser size={20} />
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              {/* Sign In label only where there is room for it (xl+) */}
              <Link
                to="/login"
                className="hidden sm:block px-3 xl:px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2"
                style={{ '--tw-ring-color': experience.accent }}
              >
                Sign In
              </Link>
              <Link
                to={createAccountPath}
              className="px-4 py-2 text-sm font-semibold text-white rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2"
                style={{ backgroundColor: BRAND.primary }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.primaryDark)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.primary)}
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2"
            style={{ '--tw-ring-color': experience.accent }}
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="public-mobile-drawer"
          >
            <AiOutlineMenu size={21} />
          </button>
        </div>
      </HeaderShell>

      {/* Keep the fixed header's height in document flow so page content begins below it. */}
      <div aria-hidden="true" className="h-16" />

      {/* Search Bar below the header on <lg screens (in-header search takes over from lg) */}
      <div className="lg:hidden sticky top-16 z-40 self-start w-full bg-[#20305C] dark:bg-[#20305C]/95 border-b border-white/15 px-4 py-3">
        <HeaderSearch
          variant="inline"
          destination={(term) => `/products?search=${encodeURIComponent(term)}`}
          placeholder="Search products, shops…"
          ariaLabel="Search products and shops"
          className="w-full"
        />
      </div>

      {/* Mobile Drawer — grouped like the desktop header + subnav */}
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        groups={drawerGroups}
        navLinkClass={drawerLinkClass}
        id="public-mobile-drawer"
      >
        {/* Quick Categories */}
        {quickCategories.length > 0 && (
          <>
            <div className="h-px bg-gray-200 dark:bg-gray-800 my-4 mx-2" />
            <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Quick Categories
            </p>
            <div className="px-3 py-2 space-y-1">
              {quickCategories.map((cat) => {
                const name = cat.title || cat;
                return (
                  <Link
                    key={cat._id || name}
                    to={categoryHref(name, '/products')}
                    className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[#75d04b] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          </>
        )}

        <div className="h-px bg-gray-200 dark:bg-gray-800 my-4 mx-2" />
        {isAuthenticated ? (
          <Link
            to="/my-dashboard"
            className="px-3 py-2.5 text-center text-gray-700 dark:text-gray-300 font-medium hover:text-[#75d04b]"
            onClick={() => setMobileMenuOpen(false)}
          >
            My Account
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#75d04b] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to={createAccountPath}
              className="mt-1 mx-1 px-4 py-2.5 text-white text-sm font-semibold text-center rounded-full transition-colors"
              style={{ backgroundColor: BRAND.primary }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Create Account
            </Link>
          </>
        )}
      </MobileDrawer>
    </>
  )
}

export default PublicHeader
