import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AiOutlineMenu, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai'
import BrandLogo from '@/components/common/BrandLogo'
import HeaderShell from '@/shared/components/header/HeaderShell'
import HeaderSearch from '@/shared/components/header/HeaderSearch'
import MobileDrawer from '@/shared/components/header/MobileDrawer'
import { categoryHref } from '@/shared/categories/categoryHref'
import { useSelector } from 'react-redux'
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories'

const PublicHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { cart } = useSelector((state) => state.cart || {})
  const cartItemCount = cart ? cart.length : 0
  const { categories } = useCatalogCategories()

  // Get first 5 categories for mobile quick links
  const quickCategories = categories.slice(0, 5)

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'text-[#75d04b] bg-[#f3ffee] dark:bg-gray-800'
        : 'text-gray-700 dark:text-gray-300 hover:text-[#75d04b] hover:bg-gray-50 dark:hover:bg-gray-800'
    }`

  const drawerNavItems = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'All Products' },
    { to: '/categories', label: 'Categories' },
    { to: '/shops', label: 'Shops' },
    { to: '/deals', label: 'Today\'s Deals' },
    { to: '/events', label: 'Events' },
    { to: '/best-selling', label: 'Best Selling' },
    { to: '/about', label: 'About' },
    { to: '/become-a-seller', label: 'Sell on Ariiti' },
  ]

  return (
    <>
      <HeaderShell height="h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <BrandLogo size="sm" showText showTagline={false} linked={false} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-6" aria-label="Main navigation">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>

          <NavLink to="/products" className={navLinkClass}>Products</NavLink>
          <NavLink to="/categories" className={navLinkClass}>Categories</NavLink>
          <NavLink to="/shops" className={navLinkClass}>Shops</NavLink>
          <NavLink to="/deals" className={navLinkClass}>Deals</NavLink>
          <NavLink to="/events" className={navLinkClass}>Events</NavLink>
          <NavLink to="/become-a-seller" className={navLinkClass}>Sell on Ariiti</NavLink>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Prominent Search Bar */}
          <div className="hidden md:block flex-1 max-w-md">
            <HeaderSearch
              variant="inline"
              placeholder="Search products, shops, categories..."
              ariaLabel="Search products and shops"
              className="w-full"
            />
          </div>

          {/* Cart Icon — the dedicated cart page (both headers agree) */}
          <Link
            to="/my-dashboard/cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
            aria-label="Shopping cart"
          >
            <AiOutlineShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-[#75d04b] text-white text-xs font-bold rounded-full">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </Link>

          {/* Account Icon */}
          <Link
            to="/login"
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
            aria-label="Account"
          >
            <AiOutlineUser size={20} />
          </Link>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="public-mobile-drawer"
          >
            <AiOutlineMenu size={21} />
          </button>
        </div>
      </HeaderShell>

      {/* Mobile Search Bar (visible below header on mobile) */}
      <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <HeaderSearch
          variant="inline"
          placeholder="Search products, shops..."
          ariaLabel="Search products and shops"
          className="w-full"
        />
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={drawerNavItems}
        navLinkClass={navLinkClass}
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
        <Link
          to="/login"
          className="px-3 py-2.5 text-center text-gray-700 dark:text-gray-300 font-medium hover:text-[#75d04b]"
          onClick={() => setMobileMenuOpen(false)}
        >
          Login
        </Link>
        <Link
          to="/sign-up"
          className="mt-2 mx-2 px-4 py-2.5 bg-[#75d04b] hover:bg-[#5ac12f] text-white text-sm font-semibold text-center rounded-full transition-colors"
          onClick={() => setMobileMenuOpen(false)}
        >
          Sign Up — It's Free
        </Link>
      </MobileDrawer>
    </>
  )
}

export default PublicHeader
