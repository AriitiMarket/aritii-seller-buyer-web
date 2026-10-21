import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import authService from '@/services/auth.service';
import { toast } from 'react-toastify';
import { FiSettings } from 'react-icons/fi';
import { MdPerson, MdStore, MdNotifications, MdSecurity, MdChevronRight, MdAccountBalanceWallet } from 'react-icons/md';
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
        {activeSection === 'notifications' && <NotificationsSection />}
        {activeSection === 'security' && <SecuritySection />}
      </div>
    </div>
  );
};

const AccountSection = ({ user }) => (
  <div className="seller-form-section">
    <h2 className="seller-form-section-title">Personal Account</h2>
    <div className="space-y-4">
      <div className="seller-form-group">
        <label className="seller-form-label">Full Name</label>
        <input
          type="text"
          defaultValue={user?.name || ''}
          disabled
          className="seller-form-input bg-market-surface-container-low"
        />
      </div>
      <div className="seller-form-group">
        <label className="seller-form-label">Email Address</label>
        <input
          type="email"
          defaultValue={user?.email || ''}
          disabled
          className="seller-form-input bg-market-surface-container-low"
        />
      </div>
      <div className="seller-form-group">
        <label className="seller-form-label">Phone Number</label>
        <input
          type="tel"
          defaultValue={user?.phoneNumber || ''}
          disabled
          className="seller-form-input bg-market-surface-container-low"
        />
      </div>
      <p className="text-xs text-market-on-surface-variant mt-4">
        Account details are managed during registration. Contact support to request changes.
      </p>
    </div>
  </div>
);

const PaymentsSection = () => (
  <div className="seller-form-section">
    <h2 className="seller-form-section-title">Payment &amp; Payout Settings</h2>
    <p className="text-market-on-surface-variant text-sm mb-4">
      Configure your bank accounts (CBE, Telebirr, Dashen, Abyssinia, Awash, etc.) to receive your sales earnings and withdrawal payouts.
    </p>
    <Link
      to="/business/finance?tab=payment-accounts"
      className="seller-btn-primary inline-flex items-center gap-2"
    >
      <MdAccountBalanceWallet size={18} />
      <span>Manage Payment Accounts &amp; Payouts</span>
    </Link>
  </div>
);

const NotificationsSection = () => (
  <div className="seller-form-section">
    <h2 className="seller-form-section-title">Notifications</h2>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-lg border border-market-border bg-market-surface-container-low">
        <div>
          <p className="font-medium text-market-on-surface">Order notifications</p>
          <p className="text-xs text-market-on-surface-variant">Receive updates when customers place orders</p>
        </div>
        <input
          type="checkbox"
          defaultChecked
          className="w-4 h-4 rounded border-market-border text-market-primary focus:ring-market-primary bg-transparent"
        />
      </div>
      <div className="flex items-center justify-between p-4 rounded-lg border border-market-border bg-market-surface-container-low">
        <div>
          <p className="font-medium text-market-on-surface">Promotion notifications</p>
          <p className="text-xs text-market-on-surface-variant">Get alerts about your active promotions</p>
        </div>
        <input
          type="checkbox"
          defaultChecked
          className="w-4 h-4 rounded border-market-border text-market-primary focus:ring-market-primary bg-transparent"
        />
      </div>
    </div>
  </div>
);

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
