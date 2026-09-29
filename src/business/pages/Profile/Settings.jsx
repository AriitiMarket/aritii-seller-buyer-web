import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import authService from '@/services/auth.service'
import { toast } from 'react-toastify'
import { FiSettings } from 'react-icons/fi'
import { MdPerson, MdStore, MdNotifications, MdSecurity, MdChevronRight } from 'react-icons/md'
import { paymentService } from '@/services'
import { MdAccountBalanceWallet } from 'react-icons/md'
import ShopSettings from '@/business/components/ShopSettings'

/**
 * Business Settings — the single settings destination for sellers.
 *
 * Sections:
 *   Personal Account  — identity user (name, email, phone)
 *   Store Profile     — public shop info (embeds ShopSettings; was /business/profile)
 *   Notifications     — preference toggles
 *   Security          — password change
 *
 * The former standalone Store Profile page and sidebar entry were removed;
 * /business/profile redirects here.
 */
const BusinessSettingsPage = () => {
  const user = useSelector((state) => state.user?.user)
  const [activeSection, setActiveSection] = useState('account')
  const [searchParams] = useSearchParams()
  useEffect(() => { if (searchParams.get('section') === 'payments') setActiveSection('payments') }, [searchParams])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-primary-light rounded-lg">
            <FiSettings className="text-brand-primary-dark" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-600">Manage your account, store profile and preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          <SettingsNavItem
            icon={MdPerson}
            label="Personal Account"
            description="Name, email, phone"
            active={activeSection === 'account'}
            onClick={() => setActiveSection('account')}
          />
          <SettingsNavItem
            icon={MdStore}
            label="Store Profile"
            description="Shop name, logo, description, contact"
            active={activeSection === 'store'}
            onClick={() => setActiveSection('store')}
          />
          <SettingsNavItem
            icon={MdAccountBalanceWallet}
            label="Payment Settings"
            description="Payout methods and account verification"
            active={activeSection === 'payments'}
            onClick={() => setActiveSection('payments')}
          />
          <SettingsNavItem
            icon={MdNotifications}
            label="Notifications"
            description="Order and promotion notifications"
            active={activeSection === 'notifications'}
            onClick={() => setActiveSection('notifications')}
          />
          <SettingsNavItem
            icon={MdSecurity}
            label="Security"
            description="Change your password"
            active={activeSection === 'security'}
            onClick={() => setActiveSection('security')}
          />
        </div>

        {activeSection === 'account' && <AccountSection user={user} />}
        {activeSection === 'store' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-1">Store Profile</h2>
            <p className="text-xs text-gray-500 mb-5">Public shop information buyers see on your shop page</p>
            <ShopSettings />
          </div>
        )}
        {activeSection === 'notifications' && <NotificationsSection />}
        {activeSection === 'payments' && <PaymentSettingsSection sellerId={user?.id || user?._id} />}
        {activeSection === 'security' && <SecuritySection />}
      </div>
    </div>
  )
}

const SettingsNavItem = ({ icon: Icon, label, description, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 text-left transition hover:bg-gray-50 ${
      active ? 'bg-brand-primary-light/40' : ''
    }`}
  >
    <div className={`p-2.5 rounded-xl ${active ? 'bg-brand-primary-light' : 'bg-gray-100'}`}>
      <Icon className={`text-lg ${active ? 'text-brand-primary-dark' : 'text-gray-500'}`} />
    </div>
    <div className="flex-1">
      <span className={`font-semibold text-sm ${active ? 'text-brand-primary-dark' : 'text-gray-900'}`}>
        {label}
      </span>
      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
    </div>
    <MdChevronRight className={`text-lg ${active ? 'text-brand-primary-dark' : 'text-gray-300'}`} />
  </button>
)

const AccountSection = ({ user }) => {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phoneNumber || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    try {
      setSaving(true)
      await authService.updateProfile({ name, email, phoneNumber: phone })
      toast.success('Profile updated successfully')
      setEditing(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900">Personal Account</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-sm font-semibold text-brand-primary hover:opacity-80 transition"
          >
            Edit
          </button>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!editing}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm disabled:bg-gray-50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!editing}
            type="email"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm disabled:bg-gray-50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!editing}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm disabled:bg-gray-50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
          />
        </div>
        {editing && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const PaymentSettingsSection = ({ sellerId }) => {
  const [methods, setMethods] = useState([])
  const [accounts, setAccounts] = useState([])
  const [methodId, setMethodId] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [saving, setSaving] = useState(false)
  const load = async () => {
    try {
      const [available, existing] = await Promise.all([paymentService.getActiveMethods(), paymentService.getSellerAccounts()])
      setMethods(available); setAccounts(existing)
      if (!methodId && available[0]) setMethodId(available[0].id)
    } catch (error) { toast.error(error.response?.data?.message || 'Could not load payment settings') }
  }
  useEffect(() => { load() }, [sellerId])
  const submit = async (event) => {
    event.preventDefault()
    if (!sellerId || !methodId || !accountNumber) return toast.error('Choose a method and enter account details')
    setSaving(true)
    try { await paymentService.addSellerAccount(sellerId, { methodId, accountNumber, accountLabel: methods.find(m => m.id === methodId)?.name }); toast.success('Payment account submitted for verification'); setAccountNumber(''); await load() }
    catch (error) { toast.error(error.response?.data?.message || 'Could not submit payment account') }
    finally { setSaving(false) }
  }
  return <div className="space-y-4"><div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"><h2 className="text-base font-bold text-gray-900">Payment accounts</h2><p className="text-xs text-gray-500 mt-1">Only active methods configured by Aritii are available.</p><div className="mt-4 space-y-3">{accounts.length === 0 ? <p className="text-sm text-gray-500">No payout accounts yet.</p> : accounts.map(account => <div key={account.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-3"><div><p className="text-sm font-semibold text-gray-900">{account.methodName}</p><p className="text-xs text-gray-500">{account.accountLabel} {account.accountHint}</p></div><span className="text-xs font-medium text-gray-600">{account.status}</span></div>)}</div></div><form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"><h3 className="text-sm font-bold text-gray-900">Add payout account</h3><select value={methodId} onChange={e => setMethodId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option value="">Select an active method</option>{methods.map(method => <option key={method.id} value={method.id}>{method.name}</option>)}</select><input type="password" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="Account number or identifier" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"/><button disabled={saving || !methods.length} className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-semibold disabled:opacity-50">{saving ? 'Submitting…' : 'Submit for verification'}</button></form></div>
}

const NotificationsSection = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h2 className="text-base font-bold text-gray-900 mb-5">Notifications</h2>
    <div className="space-y-1">
      {[
        { label: 'Order updates', desc: 'New orders and status changes', default: true },
        { label: 'Refund requests', desc: 'Alerts when buyers request refunds', default: true },
        { label: 'Promotions', desc: 'Tips and marketplace campaigns', default: false },
      ].map((item) => (
        <label
          key={item.label}
          className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer"
        >
          <div>
            <p className="text-sm font-semibold text-gray-900">{item.label}</p>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
          <input
            type="checkbox"
            defaultChecked={item.default}
            className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
          />
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
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      const res = await authService.changePassword({ oldPassword, newPassword, confirmPassword })
      toast.success(res?.message || 'Password changed successfully!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-base font-bold text-gray-900 mb-5">Security</h2>
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          />
          {confirmPassword && newPassword && confirmPassword !== newPassword && (
            <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}

export default BusinessSettingsPage
