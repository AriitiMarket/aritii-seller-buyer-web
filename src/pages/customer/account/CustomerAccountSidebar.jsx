import React from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../../store/redux/actions/user'
import { toast } from 'react-toastify'
import { MdDashboard, MdPerson, MdShoppingBag, MdLocationOn, MdFavoriteBorder, MdOutlineRateReview, MdSettings, MdLogout } from 'react-icons/md'

const items = [
  { to: '/my-dashboard', label: 'Dashboard', icon: MdDashboard, end: true },
  { to: '/my-dashboard/profile', label: 'Profile', icon: MdPerson, end: false },
  { to: '/my-dashboard/orders', label: 'My Orders', icon: MdShoppingBag, end: false },
  { to: '/my-dashboard/addresses', label: 'Address Book', icon: MdLocationOn, end: false },
  { to: '/my-dashboard/wishlist', label: 'Wishlist', icon: MdFavoriteBorder, end: false },
  { to: '/my-dashboard/reviews', label: 'My Reviews', icon: MdOutlineRateReview, end: false },
  { to: '/my-dashboard/settings', label: 'Settings', icon: MdSettings, end: false },
]

/**
 * Single source of truth for the buyer sidebar content.
 * Rendered in two places by CustomerAccountLayout:
 *   - Mobile: inside an off-canvas drawer (opened via hamburger in BuyerHeader)
 *   - Desktop: as a persistent fixed column
 * Modern design with icons, responsive layout, and professional styling.
 */
const CustomerAccountSidebar = ({ activePath, onClose }) => {
  const dispatch = useDispatch()
  const logoutHandler = async () => {
    try {
      const res = await dispatch(logoutUser())
      toast.success(res?.message || 'Logged out successfully')
      window.location.href = '/'
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Logout failed')
    }
  }

  return (
    <aside className="flex flex-col h-full">
      {/* Menu Section */}
      <div className="flex-1 space-y-1">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3 px-2">My Account</p>
        {items.map((it) => {
          const Icon = it.icon
          const isActive = (it.to === '/my-dashboard' && activePath === '/my-dashboard') ||
                           (it.to !== '/my-dashboard' && activePath?.startsWith(it.to))
          
          return (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                isActive
                  ? 'bg-teal-50 text-teal-700 font-semibold border border-teal-200'
                  : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
              }`}
            >
              <Icon className="text-lg flex-shrink-0" />
              <span className="hidden 800px:block text-sm">{it.label}</span>
            </NavLink>
          )
        })}
      </div>

      {/* Logout Button */}
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