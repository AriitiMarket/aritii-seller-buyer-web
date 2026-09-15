import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../../store/redux/actions/user'
import { toast } from 'react-toastify'
import {
  MdDashboard, MdPerson, MdShoppingBag, MdStorefront, MdAddBox,
  MdInventory, MdAnalytics, MdShoppingCart, MdPending, MdSettings,
  MdLogout, MdOutlineStorefront, MdFavoriteBorder,
} from 'react-icons/md'

const buyerItems = [
  { to: '/my-dashboard', label: 'Dashboard', icon: MdDashboard, end: true },
  { to: '/products', label: 'Marketplace', icon: MdOutlineStorefront, end: false, external: false },
  { to: '/my-dashboard/orders', label: 'Orders', icon: MdShoppingBag, end: false },
  { to: '/my-dashboard/profile', label: 'Profile', icon: MdPerson, end: false },
]

const sellerItems = [
  { to: '/my-dashboard/business/products', label: 'Products', icon: MdInventory, end: false },
  { to: '/my-dashboard/business/products/create', label: 'Add Product', icon: MdAddBox, end: false },
  { to: '/my-dashboard/business/orders', label: 'Business Orders', icon: MdShoppingCart, end: false },
  { to: '/my-dashboard/business/analytics', label: 'Analytics', icon: MdAnalytics, end: false },
]

/**
 * Unified sidebar for the single-account dashboard.
 * Shows buyer features for all users. Shows "MY BUSINESS" section
 * only when the user is an approved seller. Shows "Become a Seller"
 * or application status for non-sellers.
 */
const CustomerAccountSidebar = ({ activePath, onClose }) => {
  const dispatch = useDispatch()
  const { isSeller, seller } = useSelector((state) => state.seller)
  const applicationStatus = seller?.application?.status

  const logoutHandler = async () => {
    try {
      const res = await dispatch(logoutUser())
      toast.success(res?.message || 'Logged out successfully')
      window.location.href = '/'
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Logout failed')
    }
  }

  const isActive = (to, end) => {
    if (end) return activePath === to
    return activePath?.startsWith(to)
  }

  return (
    <aside className="flex flex-col h-full">
      <div className="flex-1 space-y-1">
        {/* Main Navigation */}
        {buyerItems.map((it) => {
          const Icon = it.icon
          const active = isActive(it.to, it.end)
          return (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                active
                  ? 'bg-teal-50 text-teal-700 font-semibold border border-teal-200'
                  : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
              }`}
            >
              <Icon className="text-lg flex-shrink-0" />
              <span className="hidden 800px:block text-sm">{it.label}</span>
            </NavLink>
          )
        })}

        {/* MY BUSINESS — approved sellers only */}
        {isSeller && (
          <>
            <div className="border-t border-gray-200 my-3" />
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-3 px-2">My Business</p>
            {sellerItems.map((it) => {
              const Icon = it.icon
              const active = isActive(it.to, it.end)
              return (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.end}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                    active
                      ? 'bg-orange-50 text-orange-700 font-semibold border border-orange-200'
                      : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                  }`}
                >
                  <Icon className="text-lg flex-shrink-0" />
                  <span className="hidden 800px:block text-sm">{it.label}</span>
                </NavLink>
              )
            })}
          </>
        )}

        {/* Not a seller — show CTA */}
        {!isSeller && !applicationStatus && (
          <>
            <div className="border-t border-gray-200 my-3" />
            <Link
              to="/sell"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition bg-gradient-to-r from-teal-50 to-orange-50 text-teal-700 font-semibold border border-teal-200 hover:from-teal-100 hover:to-orange-100"
            >
              <MdStorefront className="text-lg flex-shrink-0" />
              <span className="hidden 800px:block text-sm">Become a Seller</span>
            </Link>
          </>
        )}

        {/* Application pending */}
        {!isSeller && applicationStatus === 'PENDING_REVIEW' && (
          <>
            <div className="border-t border-gray-200 my-3" />
            <Link
              to="/sell"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition"
            >
              <MdPending className="text-lg flex-shrink-0 text-yellow-600" />
              <span className="hidden 800px:block text-sm text-yellow-700 font-semibold">Application Under Review</span>
            </Link>
          </>
        )}

        {/* Application rejected */}
        {!isSeller && applicationStatus === 'REJECTED' && (
          <>
            <div className="border-t border-gray-200 my-3" />
            <Link
              to="/sell"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition bg-red-50 text-red-600 font-semibold border border-red-200 hover:bg-red-100"
            >
              <MdStorefront className="text-lg flex-shrink-0" />
              <span className="hidden 800px:block text-sm">Reapply to Sell</span>
            </Link>
          </>
        )}

        {/* Settings — always at bottom */}
        <div className="border-t border-gray-200 my-3" />
        <NavLink
          to="/my-dashboard/settings"
          onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
            isActive('/my-dashboard/settings', false)
              ? 'bg-gray-100 text-gray-900 font-semibold border border-gray-200'
              : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
          }`}
        >
          <MdSettings className="text-lg flex-shrink-0" />
          <span className="hidden 800px:block text-sm">Settings</span>
        </NavLink>
      </div>

      {/* Logout */}
      <button
        onClick={() => { logoutHandler(); onClose && onClose(); }}
        className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded-lg w-full bg-red-50 text-red-600 hover:bg-red-100 font-semibold border border-red-200 transition"
      >
        <MdLogout className="text-lg flex-shrink-0" />
        <span className="hidden 800px:block text-sm">Log out</span>
      </button>
    </aside>
  )
}

export default CustomerAccountSidebar