import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import authService from '@/services/auth.service';
import { toast } from 'react-toastify';
import { MdPerson, MdBusiness, MdNotifications, MdSecurity, MdEdit } from 'react-icons/md';
import { AiOutlineCamera } from 'react-icons/ai';
import { Avatar } from '@/components/common/ImageWithFallback';
import { updateUserInformation, updateUserAvatar } from '@/store/slices/userThunks';
import TwoFactorSettings from '@/shared/components/TwoFactorSettings';

/**
 * Buyer Settings & Profile Page
 *
 * Merged Settings & Profile experience:
 * - Centered layout with borderless modern cards (block border: none)
 * - Profile avatar upload and personal details editing
 * - Security (password update & two-factor authentication)
 * - Seller business console shortcuts
 * - Notification preferences
 */
const BuyerSettingsPage = ({ initialSection = 'account' }) => {
  const { user, loading: userLoading } = useSelector((state) => state.user || {});
  const { isSeller, seller } = useSelector((state) => state.seller || {});
  const hasSeller = Boolean(
    isSeller ||
    user?.capabilities?.includes('SELLER') ||
    user?.role === 'SELLER' ||
    user?.activeRole === 'SELLER' ||
    (Array.isArray(user?.roles) && user.roles.includes('SELLER'))
  );

  const [activeSection, setActiveSection] = useState(initialSection);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 flex flex-col items-center">
      {/* Header — Centered */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-market-on-surface dark:text-white">
          Settings & Profile
        </h1>
        <p className="text-sm text-market-on-surface-variant dark:text-gray-400 mt-1">
          Manage your personal profile, security, and account preferences
        </p>
      </div>

      {/* Navigation Segmented Control — Centered & Borderless */}
      <div className="w-full bg-white dark:bg-[#1a222d] rounded-2xl shadow-sm border-0 border-none p-1.5 flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSection('account')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeSection === 'account'
              ? 'bg-[#131921] dark:bg-gray-800 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
          }`}
        >
          <MdPerson size={17} />
          <span>Profile & Account</span>
        </button>

        {hasSeller && (
          <button
            type="button"
            onClick={() => setActiveSection('business')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeSection === 'business'
                ? 'bg-[#131921] dark:bg-gray-800 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
            }`}
          >
            <MdBusiness size={17} />
            <span>Store Profile</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">
              Seller
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveSection('security')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeSection === 'security'
              ? 'bg-[#131921] dark:bg-gray-800 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
          }`}
        >
          <MdSecurity size={17} />
          <span>Security</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('notifications')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeSection === 'notifications'
              ? 'bg-[#131921] dark:bg-gray-800 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
          }`}
        >
          <MdNotifications size={17} />
          <span>Notifications</span>
        </button>
      </div>

      {/* Active Section — Centered Card with Border None */}
      <div className="w-full">
        {activeSection === 'account' && <MergedProfileAccountSection user={user} loading={userLoading} />}
        {activeSection === 'business' && hasSeller && <BusinessSection seller={seller || user} />}
        {activeSection === 'notifications' && <NotificationsSection user={user} />}
        {activeSection === 'security' && <SecuritySection />}
      </div>
    </div>
  );
};

/**
 * Merged Profile & Account Section
 * Includes avatar photo upload, member since badge, and personal information editor.
 */
const MergedProfileAccountSection = ({ user, loading }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [password, setPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phoneNumber || '');
    }
  }, [user]);

  const handleAvatarChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('image', file);
      await dispatch(updateUserAvatar(formData));
      toast.success('Avatar updated successfully!');
    } catch (err) {
      toast.error(err?.message || 'Failed to update avatar');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phoneNumber) {
      toast.error('Please fill in all fields');
      return;
    }
    dispatch(updateUserInformation(name, email, phoneNumber, password))
      .then(() => {
        setIsEditing(false);
        setPassword('');
        toast.success('Profile updated successfully!');
      })
      .catch((err) => {
        toast.error(err?.message || 'Failed to update profile');
      });
  };

  return (
    <div className="w-full bg-white dark:bg-[#1a222d] rounded-2xl shadow-sm border-0 border-none overflow-hidden">
      {/* Avatar & Identity Banner — Centered & Border None */}
      <div className="bg-gradient-to-r from-market-surface-container-low to-market-surface-container dark:from-[#131921] dark:to-[#1a222d] px-8 py-10 flex flex-col items-center border-none text-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#2162a1] to-[#0064f9] overflow-hidden flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-[#2162a1]/20">
            <Avatar
              data={user}
              fallback={user?.name?.charAt(0)?.toUpperCase() || 'U'}
              className="w-full h-full object-cover"
            />
          </div>
          <label
            htmlFor="settings-avatar"
            className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 text-market-secondary p-2 rounded-xl cursor-pointer hover:bg-market-surface-dim transition shadow-md border-0 border-none"
            style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.5 : 1 }}
          >
            <AiOutlineCamera className="text-lg" />
            <input
              type="file"
              id="settings-avatar"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={loading}
            />
          </label>
        </div>
        <h2 className="text-lg font-bold text-market-on-surface dark:text-white">{user?.name || 'User'}</h2>
        <p className="text-sm text-market-on-surface-variant dark:text-gray-400 mt-0.5">{user?.email}</p>
        <p className="text-xs text-gray-400 mt-1">
          Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'recently'}
        </p>
      </div>

      {/* Form Content — Border None */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-market-on-surface dark:text-white">Personal Information</h3>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-market-secondary hover:bg-market-surface-container dark:hover:bg-gray-800 rounded-full transition"
          >
            <MdEdit size={14} />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-market-on-surface dark:text-gray-200 mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition ${
                isEditing
                  ? 'border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-market-secondary focus:ring-2 focus:ring-market-secondary/20'
                  : 'border-0 border-none bg-market-surface-dim dark:bg-gray-800/60 text-market-on-surface-variant dark:text-gray-300 cursor-not-allowed'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-market-on-surface dark:text-gray-200 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition ${
                isEditing
                  ? 'border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-market-secondary focus:ring-2 focus:ring-market-secondary/20'
                  : 'border-0 border-none bg-market-surface-dim dark:bg-gray-800/60 text-market-on-surface-variant dark:text-gray-300 cursor-not-allowed'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-market-on-surface dark:text-gray-200 mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition ${
                isEditing
                  ? 'border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-market-secondary focus:ring-2 focus:ring-market-secondary/20'
                  : 'border-0 border-none bg-market-surface-dim dark:bg-gray-800/60 text-market-on-surface-variant dark:text-gray-300 cursor-not-allowed'
              }`}
            />
          </div>

          {isEditing && (
            <div>
              <label className="block text-sm font-semibold text-market-on-surface dark:text-gray-200 mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Required to confirm profile updates"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl text-sm focus:border-market-secondary focus:ring-2 focus:ring-market-secondary/20"
              />
              <p className="text-xs text-gray-400 mt-1">Enter your password to save your profile changes</p>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="flex gap-3 mt-6 pt-6 border-0 border-none">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-5 py-2.5 bg-market-primary text-market-on-primary rounded-xl text-sm font-semibold hover:bg-market-primary-hover transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setName(user?.name || '');
                setEmail(user?.email || '');
                setPhoneNumber(user?.phoneNumber || '');
                setPassword('');
                setIsEditing(false);
              }}
              className="flex-1 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-market-on-surface dark:text-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition border-0 border-none"
            >
              Discard
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

const BusinessSection = ({ seller }) => {
  const shopName = seller?.shopInformation?.shopName || seller?.name || '';
  const shopDescription = seller?.shopInformation?.description || '';
  const businessCategory = seller?.businessInformation?.businessCategory || '';

  return (
    <div className="w-full bg-white dark:bg-[#1a222d] rounded-2xl shadow-sm border-0 border-none p-6 sm:p-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-market-on-surface dark:text-white">Business Profile</h2>
          <p className="text-xs text-market-on-surface-variant dark:text-gray-400 mt-0.5">Your seller business information</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Approved Seller</span>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-market-on-surface dark:text-gray-200 mb-1.5">Shop Name</label>
            <div className="px-4 py-2.5 rounded-xl text-sm bg-market-surface-dim dark:bg-gray-800/60 text-market-on-surface dark:text-white font-medium border-0 border-none">
              {shopName || '—'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-market-on-surface dark:text-gray-200 mb-1.5">Category</label>
            <div className="px-4 py-2.5 rounded-xl text-sm bg-market-surface-dim dark:bg-gray-800/60 text-market-on-surface dark:text-white font-medium border-0 border-none">
              {businessCategory || '—'}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-market-on-surface dark:text-gray-200 mb-1.5">Description</label>
          <div className="px-4 py-2.5 rounded-xl text-sm bg-market-surface-dim dark:bg-gray-800/60 text-market-on-surface dark:text-white min-h-[80px] border-0 border-none">
            {shopDescription || '—'}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/business"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold text-xs hover:bg-orange-700 transition shadow-sm"
          >
            Manage Business Console →
          </Link>
          <Link
            to="/business/shops"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700 transition shadow-sm"
          >
            Manage Stores
          </Link>
          <Link
            to="/business/settings"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-market-on-surface dark:text-gray-200 font-semibold text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition border-0 border-none"
          >
            Store Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

const NotificationsSection = ({ user }) => {
  const storageKey = `aritii_buyer_notifs_${user?._id || user?.id || 'default'}`;
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      orderUpdates: true,
      promotions: false,
      newProducts: true,
      securityAlerts: true,
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

  const items = [
    { key: 'orderUpdates', label: 'Order updates', desc: 'Receive notifications about your orders and delivery tracking' },
    { key: 'promotions', label: 'Promotions & Deals', desc: 'Get notified about flash discounts and community merchant sales' },
    { key: 'newProducts', label: 'New products', desc: 'Alerts when new items match your wishlist and browsing history' },
    { key: 'securityAlerts', label: 'Account security alerts', desc: 'Important notifications about logins and security changes' },
  ];

  return (
    <div className="w-full bg-white dark:bg-[#1a222d] rounded-2xl shadow-sm border-0 border-none p-6 sm:p-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-market-on-surface dark:text-white">Notifications</h2>
          <p className="text-xs text-market-on-surface-variant dark:text-gray-400 mt-0.5">Choose which notifications you wish to receive</p>
        </div>
        <span className="text-[11px] font-semibold text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
          Saved locally
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item.key} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-market-surface-dim dark:hover:bg-gray-800/50 transition cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-market-on-surface dark:text-white">{item.label}</p>
              <p className="text-xs text-market-on-surface-variant dark:text-gray-400 mt-0.5">{item.desc}</p>
            </div>
            <input
              type="checkbox"
              checked={Boolean(preferences[item.key])}
              onChange={() => togglePreference(item.key)}
              className="w-4 h-4 text-market-secondary rounded border-gray-300 dark:border-gray-700 focus:ring-market-secondary cursor-pointer"
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
      const res = await authService.changePassword({ oldPassword, newPassword, confirmPassword });
      toast.success(res?.message || 'Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="w-full bg-white dark:bg-[#1a222d] rounded-2xl shadow-sm border-0 border-none p-6 sm:p-8">
        <h2 className="text-base font-bold text-market-on-surface dark:text-white mb-5">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-market-on-surface dark:text-gray-200 mb-1.5">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl text-sm focus:border-market-secondary focus:ring-2 focus:ring-market-secondary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-market-on-surface dark:text-gray-200 mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl text-sm focus:border-market-secondary focus:ring-2 focus:ring-market-secondary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-market-on-surface dark:text-gray-200 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl text-sm focus:border-market-secondary focus:ring-2 focus:ring-market-secondary/20"
            />
            {confirmPassword && newPassword && confirmPassword !== newPassword && (
              <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-market-primary text-market-on-primary rounded-xl text-sm font-semibold hover:bg-market-primary-hover transition disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      <div className="w-full bg-white dark:bg-[#1a222d] rounded-2xl shadow-sm border-0 border-none p-6 sm:p-8">
        <h2 className="text-base font-bold text-market-on-surface dark:text-white mb-4">Account Security & Two-Factor Authentication</h2>
        <TwoFactorSettings />
      </div>
    </div>
  );
};

export default BuyerSettingsPage;
export { BuyerSettingsPage };
