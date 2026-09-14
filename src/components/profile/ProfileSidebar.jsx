import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { RxPerson } from 'react-icons/rx'
import { HiOutlineShoppingBag, HiOutlineReceiptRefund } from 'react-icons/hi'
import { AiOutlineMessage, AiOutlineLogout } from 'react-icons/ai'
import { MdOutlineTrackChanges } from 'react-icons/md'
import { RiLockPasswordLine } from 'react-icons/ri'
import { TbAddressBook } from 'react-icons/tb'
import { logoutUser } from '../../store/redux/actions/user'
import './ProfileSidebar.css'

const ProfileSidebar = ({ active, setActive }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const menuItems = [
    { id: 1, label: 'Profile', icon: RxPerson, action: () => setActive(1) },
    { id: 2, label: 'My Orders', icon: HiOutlineShoppingBag, action: () => setActive(2) },
    { id: 3, label: 'Refunds', icon: HiOutlineReceiptRefund, action: () => setActive(3) },
    { id: 4, label: 'Inbox', icon: AiOutlineMessage, action: () => { setActive(4); navigate('/inbox') } },
    { id: 5, label: 'Track Order', icon: MdOutlineTrackChanges, action: () => setActive(5) },
    { id: 6, label: 'Change Password', icon: RiLockPasswordLine, action: () => setActive(6) },
    { id: 7, label: 'Addresses', icon: TbAddressBook, action: () => setActive(7) },
  ]

  const handleLogout = async () => {
    try {
      const res = await dispatch(logoutUser())
      const msg = res?.message || res?.data?.message || 'Logged out successfully'
      toast.success(msg)
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Logout failed')
    }
  }

  return (
    <div className="profile-sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.id}
              className={`sidebar-nav-item ${active === item.id ? 'active' : ''}`}
              onClick={item.action}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  item.action()
                }
              }}
            >
              <Icon />
              <span>{item.label}</span>
            </div>
          )
        })}

        <div
          className={`sidebar-nav-item logout ${active === 8 ? 'active' : ''}`}
          onClick={handleLogout}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleLogout()
            }
          }}
        >
          <AiOutlineLogout />
          <span>Logout</span>
        </div>
      </nav>
    </div>
  )
}

export default ProfileSidebar
