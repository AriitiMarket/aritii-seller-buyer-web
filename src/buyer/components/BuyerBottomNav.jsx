import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  HiOutlineHome,
  HiOutlineShoppingCart,
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiOutlineTag,
} from 'react-icons/hi'

const BuyerBottomNav = () => {
  const location = useLocation()
  const [cartCount, setCartCount] = useState(0)

  // TODO: Replace with actual cart count from Redux/API
  useEffect(() => {
    // Placeholder: fetch cart count
    setCartCount(3) // Example count
  }, [])

  const navItems = [
    {
      label: 'Home',
      path: '/my-dashboard',
      icon: HiOutlineHome,
      badge: null,
    },
    {
      label: 'Products',
      path: '/my-dashboard/products',
      icon: HiOutlineTag,
      badge: null,
    },
    {
      label: 'Cart',
      path: '/my-dashboard/cart',
      icon: HiOutlineShoppingCart,
      badge: cartCount > 0 ? cartCount : null,
    },
    {
      label: 'Orders',
      path: '/my-dashboard/orders',
      icon: HiOutlineShoppingBag,
      badge: null,
    },
    {
      label: 'Account',
      path: '/my-dashboard/settings',
      icon: HiOutlineUser,
      badge: null,
    },
  ]

  const isActive = (path) => {
    if (path === '/my-dashboard') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  const handleNavClick = (item) => {
    // Show toast notification on navigation
    if (item.path !== location.pathname) {
      toast.info(`Navigating to ${item.label}`, {
        position: 'top-center',
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        className: 'text-sm',
      })
    }
  }

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#131921] border-t border-gray-200 dark:border-gray-800 safe-area-bottom"
      aria-label="Mobile bottom navigation"
    >
      <div className="flex items-center justify-around h-14 px-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => handleNavClick(item)}
              className={`
                flex flex-col items-center justify-center gap-1 
                w-14 h-full px-2 py-1 
                relative transition-colors duration-200
                ${
                  active
                    ? 'text-[#75d04b]'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
              aria-current={active ? 'page' : undefined}
            >
              {/* Icon Container */}
              <div className="flex items-center justify-center">
                <Icon
                  size={24}
                  className={`transition-all duration-200 ${
                    active ? 'font-semibold' : ''
                  }`}
                  aria-hidden="true"
                />

                {/* Cart Badge */}
                {item.badge && (
                  <span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold 
                      rounded-full w-5 h-5 flex items-center justify-center leading-none"
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className="text-[11px] font-medium whitespace-nowrap truncate w-full text-center"
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BuyerBottomNav
