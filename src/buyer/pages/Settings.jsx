import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import authService from '@/services/auth.service'
import { toast } from 'react-toastify'
import { MdPerson, MdBusiness, MdNotifications, MdSecurity, MdChevronRight } from 'react-icons/md'

const BuyerSettingsPage = () => {
  const user = useSelector((state) => state.user?.user)
  const { isSeller, seller } = useSelector((state) => state.seller)
  const [activeSection, setActiveSection] = useState('account')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-market-on-surface">Settings</h1>
        <p className="text-sm text-market-on-surface-variant mt-1">Manage your account and preferences</p>
      </div>

      <div className="max-w-2xl space-y-4">
        {/* Settings Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-market-border overflow-hidden divide-y divide-market-border">
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

        {/* Active Section */}
        {activeSection === 'account' && <AccountSection user={user} />}
        {activeSection === 'business' && isSeller && <BusinessSection seller={seller} />}
        {activeSection === 'notifications' && <NotificationsSection />}
        {activeSection === 'security' && <SecuritySection />}
      </div>
    </div>
  )
}

const SettingsNavItem = ({ icon: Icon, label, description, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 text-left transition hover:bg-market-surface-dim ${active ? 'bg-market-primary-container' : ''}`}
  >
    <div className={`p-2 rounded-full ${active ? 'bg-market-primary-container' : 'bg-market-surface-dim'}`}>
      <Icon className={`text-lg ${active ? 'text-market-secondary' : 'text-market-on-surface-variant'}`} />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className={`font-semibold text-sm ${active ? 'text-market-secondary' : 'text-market-on-surface'}`}>{label}</span>
        {badge && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">{badge}</span>
        )}
      </div>
      <p className="text-xs text-market-on-surface-variant mt-0.5">{description}</p>
    </div>
    <MdChevronRight className={`text-lg transition ${active ? 'text-market-secondary' : 'text-market-on-surface-variant'}`} />
  </button>
)

const AccountSection = ({ user }) => {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phoneNumber || '')

  const handleSave = async () => {
    try {
      await authService.updateProfile({ name, email, phoneNumber: phone })
      toast.success('Profile updated successfully')
      setEditing(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-market-border p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-market-on-surface">Personal Account</h2>
        {!editing && (
          <button onClick={() => setEditing(true)} className="text-sm font-semibold text-market-secondary hover:text-market-secondary-hover transition px-3 py-1.5 rounded-full ">
            Edit
          </button>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-market-on-surface mb-1.5">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} disabled={!editing}
            className="w-full px-4 py-2.5 border border-market-border rounded-xl text-sm disabled:bg-market-surface-dim focus:border-market-secondary focus:ring-2 focus:ring-market-secondary/20 transition" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-market-on-surface mb-1.5">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editing} type="email"
            className="w-full px-4 py-2.5 border border-market-border rounded-xl text-sm disabled:bg-market-surface-dim focus:border-market-secondary focus:ring-2 focus:ring-market-secondary/20 transition" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-market-on-surface mb-1.5">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!editing}
            className="w-full px-4 py-2.5 border border-market-border rounded-xl text-sm disabled:bg-market-surface-dim focus:border-market-secondary focus:ring-2 focus:ring-market-secondary/20 transition" />
        </div>
        {editing && (
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="px-5 py-2.5 bg-market-primary text-market-on-primary rounded text-sm font-semibold hover:bg-market-primary-hover transition">Save Changes</button>
            <button onClick={() => setEditing(false)} className="px-5 py-2.5 border border-market-border text-market-on-surface rounded-xl text-sm font-semibold hover:bg-market-surface-dim transition">Cancel</button>
          </div>
        )}
      </div>
    </div>
  )
}

const BusinessSection = ({ seller }) => {
  const shopName = seller?.shopInformation?.shopName || seller?.name || ''
  const shopDescription = seller?.shopInformation?.description || ''
  const businessCategory = seller?.businessInformation?.businessCategory || ''

  return (
    <div className="bg-white rounded-lg shadow-sm border border-market-border p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-market-on-surface">Business Profile</h2>
          <p className="text-xs text-market-on-surface-variant mt-0.5">Your seller business information</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Approved Seller</span>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-market-on-surface mb-1.5">Shop Name</label>
            <div className="px-4 py-2.5 border border-market-border rounded-xl text-sm bg-market-surface-dim text-market-on-surface">{shopName || '—'}</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-market-on-surface mb-1.5">Category</label>
            <div className="px-4 py-2.5 border border-market-border rounded-xl text-sm bg-market-surface-dim text-market-on-surface">{businessCategory || '—'}</div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-market-on-surface mb-1.5">Description</label>
          <div className="px-4 py-2.5 border border-market-border rounded-xl text-sm bg-market-surface-dim text-market-on-surface min-h-[80px]">{shopDescription || '—'}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-700">
            To update your business profile, visit the{' '}
            <Link to="/business/products" className="font-semibold underline">Business Products</Link>{' '}
            page or contact support.
          </p>
        </div>
      </div>
    </div>
  )
}

const NotificationsSection = () => (
  <div className="bg-white rounded-lg shadow-sm border border-market-border p-6">
    <h2 className="text-base font-bold text-market-on-surface mb-5">Notifications</h2>
    <div className="space-y-1">
      {[
        { label: 'Order updates', desc: 'Receive notifications about your orders', default: true },
        { label: 'Promotions', desc: 'Get notified about sales and deals', default: false },
        { label: 'New products', desc: 'Alerts when new products match your interests', default: false },
      ].map((item) => (
        <label key={item.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-market-surface-dim transition cursor-pointer">
          <div>
            <p className="text-sm font-semibold text-market-on-surface">{item.label}</p>
            <p className="text-xs text-market-on-surface-variant">{item.desc}</p>
          </div>
          <input type="checkbox" defaultChecked={item.default} className="w-4 h-4 text-market-secondary rounded border-market-border focus:ring-market-secondary" />
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
      const res = await authService.changePassword({ oldPassword, newPassword, confirmPassword })
      toast.success(res?.message || 'Password changed successfully!')
      setOldPassword(''); setNewPassword(''); setConfirmPassword('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-market-border p-6">
      <h2 className="text-base font-bold text-market-on-surface mb-5">Security</h2>
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-market-on-surface mb-1.5">Current Password</label>
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-market-border rounded-xl text-sm focus:border-market-secondary focus:ring-2 focus:ring-market-secondary/20" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-market-on-surface mb-1.5">New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-market-border rounded-xl text-sm focus:border-market-secondary focus:ring-2 focus:ring-market-secondary/20" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-market-on-surface mb-1.5">Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-market-border rounded-xl text-sm focus:border-market-secondary focus:ring-2 focus:ring-market-secondary/20" />
          {confirmPassword && newPassword && confirmPassword !== newPassword && (
            <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
          )}
        </div>
        <button type="submit" disabled={loading}
          className="px-5 py-2.5 bg-market-primary text-market-on-primary rounded text-sm font-semibold hover:bg-market-primary-hover transition disabled:opacity-50">
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}

export default BuyerSettingsPage
