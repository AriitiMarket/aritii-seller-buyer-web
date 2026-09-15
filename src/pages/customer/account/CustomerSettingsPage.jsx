import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import api from '../../../services/api'
import { toast } from 'react-toastify'
import { MdLock, MdCheckCircle, MdPerson, MdBusiness, MdNotifications, MdSecurity, MdArrowForward } from 'react-icons/md'

const CustomerSettingsPage = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user?.user)
  const { isSeller, seller } = useSelector((state) => state.seller)
  const [activeSection, setActiveSection] = useState('account')

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-sm text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Settings Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          <SettingsNavItem
            icon={MdPerson}
            label="Personal Account"
            description="Name, email, phone"
            active={activeSection === 'account'}
            onClick={() => setActiveSection('account')}
          />
          {isSeller && (
            <SettingsNavItem
              icon={MdBusiness}
              label="Business Profile"
              description="Shop name, description, contact"
              active={activeSection === 'business'}
              onClick={() => setActiveSection('business')}
              badge="Seller"
            />
          )}
          <SettingsNavItem
            icon={MdNotifications}
            label="Notifications"
            description="Email and push notifications"
            active={activeSection === 'notifications'}
            onClick={() => setActiveSection('notifications')}
          />
          <SettingsNavItem
            icon={MdSecurity}
            label="Security"
            description="Password and security settings"
            active={activeSection === 'security'}
            onClick={() => setActiveSection('security')}
          />
        </div>
      </div>

      {/* Active Section Content */}
      {activeSection === 'account' && <AccountSection user={user} />}
      {activeSection === 'business' && isSeller && <BusinessSection seller={seller} />}
      {activeSection === 'notifications' && <NotificationsSection />}
      {activeSection === 'security' && <SecuritySection />}
    </div>
  )
}

const SettingsNavItem = ({ icon: Icon, label, description, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 text-left transition hover:bg-gray-50 ${active ? 'bg-teal-50 border-l-4 border-teal-600' : 'border-l-4 border-transparent'}`}
  >
    <div className={`p-2 rounded-lg ${active ? 'bg-teal-100' : 'bg-gray-100'}`}>
      <Icon className={`text-xl ${active ? 'text-teal-600' : 'text-gray-500'}`} />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className={`font-semibold text-sm ${active ? 'text-teal-700' : 'text-gray-900'}`}>{label}</span>
        {badge && (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">{badge}</span>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
    </div>
    <MdArrowForward className={`text-sm ${active ? 'text-teal-600' : 'text-gray-400'}`} />
  </button>
)

const AccountSection = ({ user }) => {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phoneNumber || '')

  const handleSave = async () => {
    try {
      await api.put('/user/update-user-info', { name, email, phoneNumber: phone })
      toast.success('Profile updated successfully')
      setEditing(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Account</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} disabled={!editing}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm disabled:bg-gray-50 focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editing} type="email"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm disabled:bg-gray-50 focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!editing}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm disabled:bg-gray-50 focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
        </div>
        <div className="flex gap-3 pt-2">
          {editing ? (
            <>
              <button onClick={handleSave} className="px-5 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition">Save Changes</button>
              <button onClick={() => setEditing(false)} className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  )
}

const BusinessSection = ({ seller }) => {
  const shopName = seller?.shopInformation?.shopName || seller?.name || ''
  const shopDescription = seller?.shopInformation?.description || ''
  const businessCategory = seller?.businessInformation?.businessCategory || ''

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Business Profile</h2>
          <p className="text-xs text-gray-500 mt-1">Your seller business information</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Approved Seller</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Shop Name</label>
            <div className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-900">{shopName || '—'}</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Business Category</label>
            <div className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-900">{businessCategory || '—'}</div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <div className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-900 min-h-[80px]">{shopDescription || '—'}</div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-800">
            To update your business profile, visit the{' '}
            <Link to="/my-dashboard/business/products" className="font-semibold underline">Business Products</Link>{' '}
            page or contact support.
          </p>
        </div>
      </div>
    </div>
  )
}

const NotificationsSection = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
    <h2 className="text-lg font-bold text-gray-900 mb-4">Notifications</h2>
    <div className="space-y-4">
      {[
        { label: 'Order updates', desc: 'Receive notifications about your orders', default: true },
        { label: 'Promotions', desc: 'Get notified about sales and deals', default: false },
        { label: 'New products', desc: 'Alerts when new products match your interests', default: false },
      ].map((item) => (
        <label key={item.label} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
          <div>
            <p className="text-sm font-semibold text-gray-900">{item.label}</p>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
          <input type="checkbox" defaultChecked={item.default} className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" />
        </label>
      ))}
    </div>
  </div>
)

const SecuritySection = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (!oldPassword || !newPassword || !confirmPassword) { toast.error('Please fill in all fields'); return }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return }

    try {
      setLoading(true)
      const res = await api.put('/user/update-user-password', { oldPassword, newPassword, confirmPassword })
      toast.success(res.data.message || 'Password changed successfully!')
      setOldPassword(''); setNewPassword(''); setConfirmPassword('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Security</h2>
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
          {confirmPassword && newPassword && confirmPassword !== newPassword && (
            <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
          )}
        </div>
        <button type="submit" disabled={loading}
          className="px-5 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition disabled:bg-gray-400">
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}

export default CustomerSettingsPage
