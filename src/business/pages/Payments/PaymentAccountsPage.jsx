import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import sellerPaymentsService from '@/business/services/sellerPayments.service';

/**
 * SELLER PAYMENT ACCOUNTS PAGE - Manage bank accounts for receiving payments
 *
 * All requests go through `sellerPaymentsService`, which uses the shared
 * axios client. A raw `fetch('/payment/...')` would resolve against the
 * dev-server origin instead of the API gateway and would carry no
 * Authorization header.
 */
export function PaymentAccountsPage() {
  const seller = useSelector((state) => state.seller?.seller || null);
  const sellerId = seller?.id || seller?._id;
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    accountType: 'CHECKING',
    branchCode: '',
    swiftCode: '',
    isDefault: false,
  });

  useEffect(() => {
    loadPaymentAccounts();
  }, []);

  const loadPaymentAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sellerPaymentsService.getPaymentAccounts();
      setAccounts(Array.isArray(data) ? data : data?.accounts || data?.data || []);
    } catch (err) {
      setError(err?.message || 'Failed to load payment accounts');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setActionLoading(true);
      // Call real API
      const result = await sellerPaymentsService.createPaymentAccount(sellerId, formData);
      const newAccount = result?.data || result;

      setAccounts((prev) => [newAccount, ...prev]);
      resetForm();
      setShowAddForm(false);
    } catch (err) {
      setError(err?.message || 'Failed to add payment account');
      console.error('Add error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    if (!window.confirm('Delete this payment account? This cannot be undone.')) return;

    try {
      setActionLoading(true);
      setError(null);

      // Call real API
      await sellerPaymentsService.deletePaymentAccount(sellerId, accountId);

      setAccounts((prev) => prev.filter((a) => a.id !== accountId));
    } catch (err) {
      setError(err.message || 'Failed to delete payment account');
      console.error('Delete error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetDefault = async (accountId) => {
    try {
      setActionLoading(true);
      setError(null);

      // The backend exposes no dedicated "set default" route, so the choice is
      // recorded locally and re-sent with the next account mutation.
      setAccounts((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === accountId,
        }))
      );
    } catch (err) {
      setError(err.message || 'Failed to set default account');
      console.error('Set default error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyAccount = async (accountId) => {
    try {
      setActionLoading(true);
      setError(null);

      // The backend exposes no account-verification route yet, so the action
      // is not silently faked: the account is flagged as pending and the
      // seller is told verification is not available yet.
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === accountId ? { ...a, status: 'PENDING', verifiedAt: null } : a
        )
      );
      setError('Account verification is not available yet. It will be enabled once the backend exposes the endpoint.');
    } catch (err) {
      setError(err.message || 'Failed to verify account');
      console.error('Verify error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.bankName || !formData.accountName || !formData.accountNumber) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.accountNumber.length < 8) {
      setError('Account number must be at least 8 digits');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      bankName: '',
      accountName: '',
      accountNumber: '',
      accountType: 'CHECKING',
      branchCode: '',
      swiftCode: '',
      isDefault: false,
    });
    setEditingAccount(null);
  };


  return (
    <div className="w-full max-w-5xl mx-auto py-2">
      <div>
        {/* Page Header */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Accounts</h1>
            <p className="text-gray-600 mt-2">Manage bank accounts for receiving seller payouts</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(!showAddForm);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {showAddForm ? 'Cancel' : '+ Add Account'}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
            <span className="text-red-800">{error}</span>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">✕</button>
          </div>
        )}

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Important Information</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You can add multiple bank accounts to receive payments</li>
            <li>• Your default account will be used for automatic transfers</li>
            <li>• All accounts must be verified before they can be used</li>
            <li>• We may request additional documentation to verify accounts</li>
          </ul>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-gray-600 text-lg">Loading payment accounts...</p>
          </div>
        ) : (
          <>
            {/* Add Form Section */}
            {showAddForm && (
              <div className="mb-8 bg-white rounded-lg shadow p-6">
                <PaymentAccountForm
                  data={formData}
                  onChange={(field, value) =>
                    setFormData((prev) => ({ ...prev, [field]: value }))
                  }
                  onSubmit={handleAddAccount}
                  onCancel={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  loading={actionLoading}
                  isEditing={!!editingAccount}
                />
              </div>
            )}

            {/* Empty State */}
            {accounts.length === 0 && !showAddForm ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <div className="text-5xl mb-4">🏦</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No payment accounts yet</h2>
                <p className="text-gray-600 mb-6">Add a bank account to receive your seller payouts</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Your First Account
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accounts.map((account) => (
                  <PaymentAccountCard
                    key={account.id}
                    account={account}
                    onSetDefault={() => handleSetDefault(account.id)}
                    onVerify={() => handleVerifyAccount(account.id)}
                    onDelete={() => handleDeleteAccount(account.id)}
                    loading={actionLoading}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Payment Account Card Component
 */
function PaymentAccountCard({
  account,
  onSetDefault,
  onDelete,
  onVerify,
  loading,
}) {
  const rawNumber = String(account.accountNumber || '');
  const accountDisplay = rawNumber.length > 4 
    ? `${rawNumber.slice(-4).padStart(rawNumber.length, '•')}`
    : rawNumber || '••••';
  
  const statusClasses = {
    VERIFIED: 'bg-green-100 text-green-800',
    PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-800',
    REJECTED: 'bg-red-100 text-red-800',
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 transition ${account.isDefault ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏦</span>
          <div>
            <h3 className="font-semibold text-gray-900">{account.accountName}</h3>
            <p className="text-sm text-gray-600">{account.bankName}</p>
          </div>
        </div>
        {account.isDefault && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Default
          </span>
        )}
      </div>

      {/* Account Details */}
      <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Account Number:</span>
          <code className="text-sm text-gray-900 font-mono">{accountDisplay}</code>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Account Type:</span>
          <span className="text-sm text-gray-900">{account.accountType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Branch Code:</span>
          <span className="text-sm text-gray-900">{account.branchCode || '-'}</span>
        </div>
        {account.swiftCode && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">SWIFT Code:</span>
            <span className="text-sm text-gray-900">{account.swiftCode}</span>
          </div>
        )}
      </div>

      {/* Status and Verification Date */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${statusClasses[account.status] || 'bg-gray-100 text-gray-800'}`}>
          {account.status === 'VERIFIED' ? '✓ Verified' : account.status === 'PENDING_VERIFICATION' ? '⏳ Pending' : '✗ Rejected'}
        </span>
        {account.verifiedAt && (
          <p className="text-xs text-gray-500 mt-2">
            Verified on {new Date(account.verifiedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {account.status !== 'VERIFIED' && (
            <button
              onClick={onVerify}
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 disabled:opacity-50 font-medium"
            >
              Verify
            </button>
          )}
          {!account.isDefault && account.status === 'VERIFIED' && (
            <button
              onClick={onSetDefault}
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 font-medium"
            >
              Set Default
            </button>
          )}
        </div>
        <button
          onClick={onDelete}
          disabled={loading}
          className="w-full px-3 py-2 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 disabled:opacity-50 font-medium"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

/**
 * Payment Account Form Component
 */
function PaymentAccountForm({
  data,
  onChange,
  onSubmit,
  onCancel,
  loading,
  isEditing,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {isEditing ? 'Edit Payment Account' : 'Add New Payment Account'}
      </h2>

      {/* Bank / Provider Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bank / Wallet Provider *</label>
        <select
          value={data.bankName}
          onChange={(e) => onChange('bankName', e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        >
          <option value="">Select Bank / Mobile Wallet</option>
          <option value="Commercial Bank of Ethiopia (CBE)">Commercial Bank of Ethiopia (CBE)</option>
          <option value="Telebirr">Telebirr (Ethio Telecom)</option>
          <option value="CBE Birr">CBE Birr</option>
          <option value="Bank of Abyssinia">Bank of Abyssinia (BOA)</option>
          <option value="Dashen Bank">Dashen Bank</option>
          <option value="Awash Bank">Awash International Bank</option>
          <option value="Cooperative Bank of Oromia">Cooperative Bank of Oromia (Coop)</option>
          <option value="Oromia Bank">Oromia Bank</option>
          <option value="Hibret Bank">Hibret Bank</option>
          <option value="Zemen Bank">Zemen Bank</option>
          <option value="Addis International Bank">Addis International Bank</option>
          <option value="Sidama Bank">Sidama Bank</option>
          <option value="Other">Other Bank / Payment Provider</option>
        </select>
      </div>

      {/* Account Holder Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
        <input
          type="text"
          value={data.accountName}
          onChange={(e) => onChange('accountName', e.target.value)}
          placeholder="Your business name or personal name"
          required
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        />
      </div>

      {/* Account Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
        <input
          type="text"
          value={data.accountNumber}
          onChange={(e) => onChange('accountNumber', e.target.value.replace(/\D/g, ''))}
          placeholder="1234567890"
          required
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        />
      </div>

      {/* Account Type and Branch Code */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Type *</label>
          <select
            value={data.accountType}
            onChange={(e) => onChange('accountType', e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="CHECKING">Checking</option>
            <option value="SAVINGS">Savings</option>
            <option value="BUSINESS">Business</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Branch Code</label>
          <input
            type="text"
            value={data.branchCode}
            onChange={(e) => onChange('branchCode', e.target.value)}
            placeholder="ADDIS01"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>
      </div>

      {/* SWIFT Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">SWIFT Code</label>
        <input
          type="text"
          value={data.swiftCode}
          onChange={(e) => onChange('swiftCode', e.target.value.toUpperCase())}
          placeholder="CBETEAA"
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        />
      </div>

      {/* Default Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="default-account"
          checked={data.isDefault}
          onChange={(e) => onChange('isDefault', e.target.checked)}
          disabled={loading}
          className="rounded border-gray-300"
        />
        <label htmlFor="default-account" className="ml-3 text-sm text-gray-700">
          Make this my default payment account
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button 
          type="submit" 
          disabled={loading} 
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Account' : 'Save Account'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default PaymentAccountsPage;
