import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import authService from '@/services/auth.service';
import { toast } from 'react-toastify';
import { FiSettings } from 'react-icons/fi';
import { MdPerson, MdStore, MdNotifications, MdSecurity, MdChevronRight, MdAccountBalanceWallet, MdCheckCircle } from 'react-icons/md';
import ShopSettings from '@/business/components/ShopSettings';
import TwoFactorSettings from '@/shared/components/TwoFactorSettings';

const BusinessSettingsPage = () => {
  const user = useSelector((state) => state.user?.user);
  const [activeSection, setActiveSection] = useState('account');
  const [searchParams] = useSearchParams();
  useEffect(() => { if (searchParams.get('section') === 'payments') setActiveSection('payments') }, [searchParams]);

  const sections = [
    { key: 'account', label: 'Personal Account', icon: MdPerson, desc: 'Name, email, phone' },
    { key: 'store', label: 'Store Profile', icon: MdStore, desc: 'Shop name, logo, description, contact' },
    { key: 'payments', label: 'Payment Settings', icon: MdAccountBalanceWallet, desc: 'Payout methods and verification' },
    { key: 'notifications', label: 'Notifications', icon: MdNotifications, desc: 'Order and promotion notifications' },
    { key: 'security', label: 'Security', icon: MdSecurity, desc: 'Change your password' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="seller-section-header">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-market-primary/10 text-market-primary">
            <FiSettings size={24} />
          </div>
          <div>
            <h1 className="seller-section-header-title">Settings</h1>
            <p className="seller-section-header-desc">Manage your account, store profile and preferences</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-[#1a1f2a] rounded-xl border border-market-border shadow-sm overflow-hidden divide-y divide-market-border">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-colors ${activeSection === section.key
                ? 'bg-market-primary/10 text-market-primary border-r-4 border-market-primary'
                : 'text-market-on-surface-variant hover:bg-market-surface-container-high hover:text-market-primary'
              }`}
            >
              <section.icon size={20} className={`flex-shrink-0 ${activeSection === section.key ? 'text-market-primary' : 'text-market-on-surface-variant'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-sm ${activeSection === section.key ? 'text-market-primary' : 'text-market-on-surface'}`}>
                    {section.label}
                  </span>
                </div>
                <p className="text-xs text-market-on-surface-variant">{section.desc}</p>
              </div>
              <MdChevronRight size={14} className="text-market-on-surface-variant flex-shrink-0" />
            </button>
          ))}
        </div>

        {activeSection === 'account' && <AccountSection user={user} />}
        {activeSection === 'store' && <ShopSettings />}
        {activeSection === 'payments' && <PaymentsSection />}
        {activeSection === 'notifications' && <NotificationsSection user={user} />}
        {activeSection === 'security' && <SecuritySection />}
      </div>
    </div>
  );
};

const AccountSection = ({ user }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phoneNumber || '');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Full name is required');
      return;
    }
    setSaving(true);
    try {
      const updatedUser = await authService.updateProfile({
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phone.trim(),
      });
      const mergedUser = { ...user, ...(updatedUser || {}), name: name.trim(), email: email.trim(), phoneNumber: phone.trim() };
      dispatch({ type: 'updateUserInfoSuccess', payload: mergedUser });
      dispatch({ type: 'LoadUserSuccess', payload: mergedUser });
      toast.success('Account profile updated successfully');
      setEditing(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phoneNumber || '');
    setEditing(false);
  };

  return (
    <div className="seller-form-section">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="seller-form-section-title">Personal Account</h2>
          <p className="text-xs text-market-on-surface-variant mt-0.5">Manage your merchant personal credentials</p>
        </div>
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="seller-btn-secondary text-xs px-3 py-1.5"
          >
            Edit Profile
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="text-xs text-market-on-surface-variant hover:text-market-on-surface transition px-2 py-1"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="seller-form-group">
          <label className="seller-form-label">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!editing}
            className={`seller-form-input ${!editing ? 'bg-market-surface-container-low cursor-not-allowed opacity-80' : ''}`}
            required
          />
        </div>
        <div className="seller-form-group">
          <label className="seller-form-label">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!editing}
            className={`seller-form-input ${!editing ? 'bg-market-surface-container-low cursor-not-allowed opacity-80' : ''}`}
            required
          />
        </div>
        <div className="seller-form-group">
          <label className="seller-form-label">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!editing}
            placeholder="+251..."
            className={`seller-form-input ${!editing ? 'bg-market-surface-container-low cursor-not-allowed opacity-80' : ''}`}
          />
        </div>

        {editing && (
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="seller-btn-primary"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="seller-btn-secondary"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

const PaymentsSection = () => (
  <div className="seller-form-section space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="seller-form-section-title">Payment &amp; Payout Settings</h2>
        <p className="text-xs text-market-on-surface-variant mt-0.5">
          Configure bank and mobile money accounts to receive your store sales earnings.
        </p>
      </div>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        <MdCheckCircle size={14} />
        Ethiopian Gateways
      </span>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-market-surface-container-low border border-market-border">
      <div className="p-3 rounded-lg bg-white dark:bg-[#1f2633] border border-market-border">
        <p className="text-xs font-semibold text-market-on-surface">Telebirr</p>
        <p className="text-[11px] text-market-on-surface-variant mt-0.5">Mobile Wallet</p>
      </div>
      <div className="p-3 rounded-lg bg-white dark:bg-[#1f2633] border border-market-border">
        <p className="text-xs font-semibold text-market-on-surface">CBE (Commercial Bank)</p>
        <p className="text-[11px] text-market-on-surface-variant mt-0.5">Bank Transfer</p>
      </div>
      <div className="p-3 rounded-lg bg-white dark:bg-[#1f2633] border border-market-border">
        <p className="text-xs font-semibold text-market-on-surface">Bank of Abyssinia</p>
        <p className="text-[11px] text-market-on-surface-variant mt-0.5">Bank Transfer</p>
      </div>
      <div className="p-3 rounded-lg bg-white dark:bg-[#1f2633] border border-market-border">
        <p className="text-xs font-semibold text-market-on-surface">Awash Bank</p>
        <p className="text-[11px] text-market-on-surface-variant mt-0.5">Bank Transfer</p>
      </div>
      <div className="p-3 rounded-lg bg-white dark:bg-[#1f2633] border border-market-border">
        <p className="text-xs font-semibold text-market-on-surface">Dashen Bank / Amole</p>
        <p className="text-[11px] text-market-on-surface-variant mt-0.5">Bank Transfer</p>
      </div>
      <div className="p-3 rounded-lg bg-white dark:bg-[#1f2633] border border-market-border">
        <p className="text-xs font-semibold text-market-on-surface">CBE Birr</p>
        <p className="text-[11px] text-market-on-surface-variant mt-0.5">Mobile Wallet</p>
      </div>
    </div>

    <div className="pt-2">
      <Link
        to="/business/finance?tab=payment-accounts"
        className="seller-btn-primary inline-flex items-center gap-2"
      >
        <MdAccountBalanceWallet size={18} />
        <span>Manage Bank Accounts &amp; Payout Methods</span>
      </Link>
    </div>
  </div>
);

const NotificationsSection = ({ user }) => {
  const storageKey = `aritii_seller_notifs_${user?.id || 'default'}`;
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      orderAlerts: true,
      lowStockAlerts: true,
      payoutUpdates: true,
      promotions: false,
    };
  });

  const togglePreference = (key) => {
    const next = { ...preferences, [key]: !preferences[key] };
    setPreferences(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      toast.success('Notification preferences updated', { autoClose: 1500 });
    } catch (_) {}
  };

  const notificationItems = [
    {
      key: 'orderAlerts',
      title: 'Order notifications',
      description: 'Receive real-time alerts when customers place new orders with your stores',
    },
    {
      key: 'lowStockAlerts',
      title: 'Low stock alerts',
      description: 'Get notified when any product in your inventory drops below the restock threshold',
    },
    {
      key: 'payoutUpdates',
      title: 'Payout & financial updates',
      description: 'Receive confirmations when sales balances and payout withdrawals are processed',
    },
    {
      key: 'promotions',
      title: 'Marketing & platform promotions',
      description: 'Alerts about promotional campaigns, discounts, and marketplace feature updates',
    },
  ];

  return (
    <div className="seller-form-section">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="seller-form-section-title">Notifications</h2>
          <p className="text-xs text-market-on-surface-variant mt-0.5">Control how and when you get merchant alerts</p>
        </div>
        <span className="text-[11px] font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2.5 py-0.5 rounded-full border border-green-200 dark:border-green-800">
          Auto-saved
        </span>
      </div>

      <div className="space-y-3">
        {notificationItems.map((item) => (
          <label
            key={item.key}
            className="flex items-center justify-between p-4 rounded-xl border border-market-border bg-market-surface-container-low hover:bg-market-surface-container-high transition cursor-pointer"
          >
            <div className="pr-4">
              <p className="font-medium text-sm text-market-on-surface">{item.title}</p>
              <p className="text-xs text-market-on-surface-variant mt-0.5">{item.description}</p>
            </div>
            <input
              type="checkbox"
              checked={Boolean(preferences[item.key])}
              onChange={() => togglePreference(item.key)}
              className="w-4 h-4 rounded border-market-border text-market-primary focus:ring-market-primary bg-transparent cursor-pointer"
            />
          </label>
        ))}
      </div>
    </div>
  );
};

const SecuritySection = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      await authService.changePassword({ oldPassword, newPassword, confirmPassword });
      toast.success('Password changed successfully');
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="seller-form-section">
        <h2 className="seller-form-section-title">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="seller-form-group">
            <label className="seller-form-label">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="seller-form-input"
            />
          </div>
          <div className="seller-form-group">
            <label className="seller-form-label">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="seller-form-input"
            />
          </div>
          <div className="seller-form-group">
            <label className="seller-form-label">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="seller-form-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="seller-btn-primary"
          >
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>

      <div className="seller-form-section">
        <h2 className="seller-form-section-title">Two-Factor Authentication (2FA)</h2>
        <TwoFactorSettings />
      </div>
    </div>
  );
};

export default BusinessSettingsPage;
