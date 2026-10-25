import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import authService from '@/services/auth.service'
import { toast } from 'react-toastify'
import { MdPerson, MdBusiness, MdNotifications, MdSecurity, MdChevronRight } from 'react-icons/md'
import TwoFactorSettings from '@/shared/components/TwoFactorSettings'

const BuyerSettingsPage = () => {
  const user = useSelector((state) => state.user?.user)
  const { isSeller, seller } = useSelector((state) => state.seller)
  const hasSeller = Boolean(
    isSeller ||
    user?.capabilities?.includes('SELLER') ||
    user?.role === 'SELLER' ||
    user?.activeRole === 'SELLER' ||
    (Array.isArray(user?.roles) && user.roles.includes('SELLER'))
  )
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
          {hasSeller && (
            <SettingsNavItem
              icon={MdBusiness}
              label="Business Profile & Stores"
              description="Shop name, description, manage stores"
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
        {activeSection === 'business' && hasSeller && <BusinessSection seller={seller || user} />}
        {activeSection === 'notifications' && <NotificationsSection user={user} />}
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
  const dispatch = useDispatch()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phoneNumber || '')

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setPhone(user.phoneNumber || '')
    }
  }, [user])

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty')
      return
    }
    setSaving(true)
    try {
      const updatedUser = await authService.updateProfile({ name: name.trim(), email: email.trim(), phoneNumber: phone.trim() })
      const mergedUser = { ...user, ...(updatedUser || {}), name: name.trim(), email: email.trim(), phoneNumber: phone.trim() }
      dispatch({ type: 'updateUserInfoSuccess', payload: mergedUser })
      dispatch({ type: 'LoadUserSuccess', payload: mergedUser })
      toast.success('Profile updated successfully')
      setEditing(false)
    } catch (err) {
      toast.error(err.response?.data?.message || err?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setName(user?.name || '')
    setEmail(user?.email || '')
    setPhone(user?.phoneNumber || '')
    setEditing(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-market-border p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-market-on-surface">Personal Account</h2>
          <p className="text-xs text-market-on-surface-variant mt-0.5">Manage your personal details</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="text-sm font-semibold text-market-secondary hover:text-market-secondary-hover transition px-3 py-1.5 rounded-full hover:bg-market-surface-dim">
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
            <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 bg-market-primary text-market-on-primary rounded text-sm font-semibold hover:bg-market-primary-hover transition disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={handleCancel} disabled={saving} className="px-5 py-2.5 border border-market-border text-market-on-surface rounded-xl text-sm font-semibold hover:bg-market-surface-dim transition">
              Cancel
            </button>
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
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/business"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-orange-600 text-white font-medium text-xs hover:bg-orange-700 transition"
          >
            Manage My Business Console →
          </Link>
          <Link
            to="/business/shops"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-800 text-white font-medium text-xs hover:bg-slate-700 transition"
          >
            Manage Stores
          </Link>
          <Link
            to="/business/settings"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-market-border bg-white text-market-on-surface font-medium text-xs hover:bg-gray-50 transition"
          >
            Business & Store Settings
          </Link>
        </div>
      </div>
    </div>
  )
}

const NotificationsSection = ({ user }) => {
  const storageKey = `aritii_buyer_notifs_${user?.id || 'default'}`
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) return JSON.parse(saved)
    } catch (_) {}
    return {
      orderUpdates: true,
      promotions: false,
      newProducts: true,
      securityAlerts: true,
    }
  })

  const togglePreference = (key) => {
    const next = { ...preferences, [key]: !preferences[key] }
    setPreferences(next)
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
      toast.success('Notification preferences updated', { autoClose: 1500 })
    } catch (_) {}
  }

  const items = [
    { key: 'orderUpdates', label: 'Order updates', desc: 'Receive real-time notifications about your orders and delivery tracking' },
    { key: 'promotions', label: 'Promotions & Deals', desc: 'Get notified about limited-time sales, vouchers, and discounts' },
    { key: 'newProducts', label: 'New products', desc: 'Alerts when newly arrived products match your interests' },
    { key: 'securityAlerts', label: 'Account security alerts', desc: 'Important notifications about logins and security changes' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-market-border p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-market-on-surface">Notifications</h2>
          <p className="text-xs text-market-on-surface-variant mt-0.5">Choose which notifications you wish to receive</p>
        </div>
        <span className="text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
          Saved locally
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item.key} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-market-surface-dim transition cursor-pointer border border-transparent hover:border-market-border">
            <div className="pr-4">
              <p className="text-sm font-semibold text-market-on-surface">{item.label}</p>
              <p className="text-xs text-market-on-surface-variant mt-0.5">{item.desc}</p>
            </div>
            <input
              type="checkbox"
              checked={Boolean(preferences[item.key])}
              onChange={() => togglePreference(item.key)}
              className="w-4 h-4 text-market-secondary rounded border-market-border focus:ring-market-secondary cursor-pointer"
            />
          </label>
        ))}
      </div>
    </div>
  )
}

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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-market-border p-6">
        <h2 className="text-base font-bold text-market-on-surface mb-5">Change Password</h2>
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

      <div className="bg-white rounded-lg shadow-sm border border-market-border p-6">
        <h2 className="text-base font-bold text-market-on-surface mb-4">Account Security</h2>
        <TwoFactorSettings />
      </div>
    </div>
  )
}

export default BuyerSettingsPage
