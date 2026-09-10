import React from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../../store/redux/actions/user'
import { toast } from 'react-toastify'

const items = [
  { to: '/my-dashboard', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/my-dashboard/profile', label: 'Profile', icon: '👤', end: false },
  { to: '/my-dashboard/orders', label: 'My Orders', icon: '🛍️', end: false },
  { to: '/my-dashboard/addresses', label: 'Address Book', icon: '📒', end: false },
  { to: '/my-dashboard/wishlist', label: 'Wishlist', icon: '❤️', end: false },
  { to: '/my-dashboard/reviews', label: 'My Reviews', icon: '⭐', end: false },
  { to: '/my-dashboard/settings', label: 'Settings', icon: '⚙️', end: false },
]

/**
 * Single source of truth for the buyer sidebar content.
 * Rendered in two place by CustomerAccountLayout:
 *   - Mobile: inside an off-canvas drawer (opened via hamburger in BuyerHeader)
 *   - Desktop: as a persistent fixed column
 * `onNavigate` closes the mobile drawer after a link is chosen.
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
    <aside className="flex flex-col gap-1 rounded-[12px] bg-white shadow-sm p-4 h-full">
      <p className="text-xs uppercase tracking-wide text-gray-400 mb-2 border-b pb-2">
        My Account
      </p>
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.end}
          onClick={onClose}
          className={({ isActive }) =>
            (isActive || (activePath?.startsWith(it.to) && it.to !== '/my-dashboard')) ||
            (it.to === '/my-dashboard' && activePath === '/my-dashboard')
              ? 'flex items-center gap-2 px-3 py-2 my-1 rounded-md bg-[#0B6E4F] text-white font-[500] text-sm'
              : 'flex items-center gap-2 px-3 py-2 my-1 rounded-md hover:bg-[#0B6E4F]/10 text-gray-700 text-sm'
          }
        >
          <span aria-hidden="true">{it.icon}</span>
          <span className="ml-2 hidden 800px:block">{it.label}</span>
        </NavLink>
      ))}

      <button
        onClick={() => { logoutHandler(); onClose && onClose(); }}
        className="mt-auto flex items-center gap-2 px-3 py-2 my-1 rounded-md bg-red-50 hover:bg-red-600 text-white text-sm"
      >
        <span aria-hidden="true">🚪</span>
        <span className="ml-2 hidden 800px:block">Log out</span>
      </button>
    </aside>
  )
}

export default CustomerAccountSidebar