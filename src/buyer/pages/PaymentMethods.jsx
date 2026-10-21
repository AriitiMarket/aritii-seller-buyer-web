import React, { useState, useEffect } from 'react';
import { paymentService } from '@/services';

/**
 * CUSTOMER PAYMENT METHODS PAGE - Add and manage payment methods for checkout
 *
 * Requests go through the shared `paymentService`, so the gateway base URL and
 * the Authorization header are applied by the shared axios client.
 */
export function CustomerPaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [sellerPaymentAccounts, setSellerPaymentAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [linkFromSellerAccounts, setLinkFromSellerAccounts] = useState(false);
  const [formData, setFormData] = useState({
    type: 'CARD',
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    bankName: '',
    accountNumber: '',
    isDefault: false,
    linkedSellerAccountId: null,
  });

  useEffect(() => {
    loadPaymentMethods();
    loadSellerPaymentAccounts();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      const rows = await paymentService.getActiveMethods();
      setPaymentMethods(Array.isArray(rows) ? rows : rows?.methods || []);
    } catch (err) {
      setError(err?.message || 'Failed to load payment methods. Please try again.');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSellerPaymentAccounts = async () => {
    try {
      setError(null);
      // Load seller payment accounts so a buyer can reuse one at checkout.
      const rows = await paymentService.getSellerAccounts();
      setSellerPaymentAccounts(Array.isArray(rows) ? rows : rows?.accounts || []);
    } catch (err) {
      console.error('Load seller accounts error:', err);
      // Don't show error for this optional feature
    }
  };

  const handleAddMethod = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setActionLoading(true);
      setError(null);

      // If linking from seller account, use that data
      let paymentData = formData;
      if (linkFromSellerAccounts && formData.linkedSellerAccountId) {
        const selectedAccount = sellerPaymentAccounts.find(
          (acc) => acc.id === formData.linkedSellerAccountId
        );
        if (!selectedAccount) {
          setError('Selected seller account not found');
          return;
        }
        paymentData = {
          type: 'BANK_TRANSFER',
          bankName: selectedAccount.bankName,
          accountNumber: selectedAccount.accountNumber,
          accountName: selectedAccount.accountName,
          isDefault: formData.isDefault,
          linkedSellerAccountId: selectedAccount.id,
        };
      }

      // Call real API
      const result = await paymentService.saveMethod(paymentData);
      const newMethod = result?.method || result;

      setPaymentMethods((prev) => [newMethod, ...prev]);
      resetForm();
      setShowAddForm(false);
      setLinkFromSellerAccounts(false);
    } catch (err) {
      setError(err?.message || 'Failed to add payment method');
      console.error('Add error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetDefault = async (methodId) => {
    try {
      setActionLoading(true);
      setError(null);
      // The backend exposes no "set default" route, so the choice is kept
      // client-side and re-sent with the next mutation.
      setPaymentMethods((prev) =>
        prev.map((m) => ({
          ...m,
          isDefault: m.id === methodId,
        }))
      );
    } catch (err) {
      setError(err?.message || 'Failed to set default payment method');
      console.error('Set default error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const validateForm = () => {
    if (linkFromSellerAccounts) {
      if (!formData.linkedSellerAccountId) {
        setError('Please select a seller payment account');
        return false;
      }
      return true;
    }

    if (!formData.type) {
      setError('Payment method type is required');
      return false;
    }

    if (formData.type === 'CARD') {
      if (!formData.cardName || !formData.cardNumber || !formData.expiryMonth || !formData.expiryYear || !formData.cvv) {
        setError('Please fill in all card details');
        return false;
      }
      if (formData.cardNumber.length < 13) {
        setError('Card number must be at least 13 digits');
        return false;
      }
    } else if (formData.type === 'BANK_TRANSFER') {
      if (!formData.bankName || !formData.accountNumber) {
        setError('Please fill in bank details');
        return false;
      }
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      type: 'CARD',
      cardName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      bankName: '',
      accountNumber: '',
      isDefault: false,
      linkedSellerAccountId: null,
    });
    setEditingMethod(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
            <p className="text-gray-600 mt-2">Add and manage your payment methods for faster checkout</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(!showAddForm);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {showAddForm ? 'Cancel' : '+ Add Payment Method'}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
            <span className="text-red-800">{error}</span>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">✕</button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-gray-600 text-lg">Loading payment methods...</p>
          </div>
        ) : (
          <>
            {/* Add Form Section */}
            {showAddForm && (
              <div className="mb-8 bg-white rounded-lg shadow p-6">
                {sellerPaymentAccounts.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Add payment method:</label>
                    <div className="flex gap-3">
                      <button
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                          !linkFromSellerAccounts
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => {
                          setLinkFromSellerAccounts(false);
                          resetForm();
                        }}
                        disabled={actionLoading}
                      >
                        ➕ Add New
                      </button>
                      <button
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                          linkFromSellerAccounts
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => {
                          setLinkFromSellerAccounts(true);
                          resetForm();
                        }}
                        disabled={actionLoading}
                      >
                        🔗 Link Existing Account ({sellerPaymentAccounts.length})
                      </button>
                    </div>
                  </div>
                )}

                {linkFromSellerAccounts ? (
                  <SellerAccountLinkForm
                    accounts={sellerPaymentAccounts}
                    selectedAccountId={formData.linkedSellerAccountId}
                    isDefault={formData.isDefault}
                    onAccountChange={(accountId) =>
                      setFormData((prev) => ({ ...prev, linkedSellerAccountId: accountId }))
                    }
                    onDefaultChange={(isDefault) =>
                      setFormData((prev) => ({ ...prev, isDefault }))
                    }
                    onSubmit={handleAddMethod}
                    onCancel={() => {
                      setShowAddForm(false);
                      resetForm();
                      setLinkFromSellerAccounts(false);
                    }}
                    loading={actionLoading}
                  />
                ) : (
                  <PaymentMethodForm
                    data={formData}
                    onChange={(field, value) =>
                      setFormData((prev) => ({ ...prev, [field]: value }))
                    }
                    onSubmit={handleAddMethod}
                    onCancel={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    loading={actionLoading}
                    isEditing={!!editingMethod}
                  />
                )}
              </div>
            )}

            {/* Empty State */}
            {paymentMethods.length === 0 && !showAddForm ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <div className="text-5xl mb-4">💳</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No payment methods yet</h2>
                <p className="text-gray-600 mb-6">Add a payment method to make purchases faster and easier</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Your First Payment Method
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    onSetDefault={() => handleSetDefault(method.id)}
                    onEdit={(m) => {
                      setEditingMethod(m);
                      setFormData(m);
                      setShowAddForm(true);
                    }}
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
 * Payment Method Card Component
 */
function PaymentMethodCard({
  method,
  onSetDefault,
  onEdit,
  loading,
}) {
  const displayName =
    method.type === 'CARD'
      ? `${method.cardName} •••• ${method.cardLast4}`
      : `${method.bankName} •••• ${method.accountLast4}`;

  return (
    <div className={`bg-white rounded-lg shadow p-6 transition ${method.isDefault ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{method.type === 'CARD' ? '💳' : '🏦'}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{displayName}</h3>
            <p className="text-sm text-gray-600">{method.type === 'CARD' ? 'Credit/Debit Card' : 'Bank Account'}</p>
          </div>
        </div>
        {method.isDefault && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Default
          </span>
        )}
      </div>

      {method.type === 'CARD' && (
        <div className="text-sm text-gray-600 mb-4">
          <p>Expires: {method.expiryMonth}/{method.expiryYear}</p>
        </div>
      )}

      {method.type === 'BANK_TRANSFER' && (
        <div className="text-sm text-gray-600 mb-4">
          <p>{method.bankName}</p>
          <p>Account Type: {method.accountType}</p>
        </div>
      )}

      <div className="flex gap-2">
        {!method.isDefault && (
          <button
            onClick={onSetDefault}
            disabled={loading}
            className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Set Default
          </button>
        )}
        <button
          onClick={onEdit}
          disabled={loading}
          className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 disabled:opacity-50"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

/**
 * Payment Method Form Component
 */
function PaymentMethodForm({
  data,
  onChange,
  onSubmit,
  onCancel,
  loading,
  isEditing,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Payment Method Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method Type *</label>
        <select
          value={data.type}
          onChange={(e) => onChange('type', e.target.value)}
          disabled={loading}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        >
          <option value="CARD">Credit/Debit Card</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
        </select>
      </div>

      {data.type === 'CARD' ? (
        <>
          {/* Card Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Name *</label>
            <input
              type="text"
              value={data.cardName}
              onChange={(e) => onChange('cardName', e.target.value)}
              placeholder="My Visa Card"
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
            <input
              type="text"
              value={data.cardNumber}
              onChange={(e) => onChange('cardNumber', e.target.value.replace(/\D/g, ''))}
              placeholder="1234 5678 9012 3456"
              required
              disabled={loading}
              maxLength="19"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Month *</label>
              <select
                value={data.expiryMonth}
                onChange={(e) => onChange('expiryMonth', e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m.toString().padStart(2, '0')}>
                    {m.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Year *</label>
              <select
                value={data.expiryYear}
                onChange={(e) => onChange('expiryYear', e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">Year</option>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((y) => (
                  <option key={y} value={y.toString()}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
              <input
                type="text"
                value={data.cvv}
                onChange={(e) => onChange('cvv', e.target.value.replace(/\D/g, ''))}
                placeholder="123"
                required
                disabled={loading}
                maxLength="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Bank Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
            <select
              value={data.bankName}
              onChange={(e) => onChange('bankName', e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="">Select Bank</option>
              <option value="CBE">Commercial Bank of Ethiopia</option>
              <option value="ABE">Addis Bank</option>
              <option value="DBE">Dashen Bank</option>
              <option value="OIB">Oromia International Bank</option>
              <option value="OTHER">Other Bank</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
            <input
              type="text"
              value={data.accountNumber}
              onChange={(e) => onChange('accountNumber', e.target.value)}
              placeholder="1234567890123"
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>
        </>
      )}

      {/* Default Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="default-method"
          checked={data.isDefault}
          onChange={(e) => onChange('isDefault', e.target.checked)}
          disabled={loading}
          className="rounded border-gray-300"
        />
        <label htmlFor="default-method" className="ml-3 text-sm text-gray-700">
          Make this my default payment method
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button 
          type="submit" 
          disabled={loading} 
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Payment Method' : 'Save Payment Method'}
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

/**
 * Seller Account Link Form Component
 * Allows users to link existing seller payment accounts as payment methods
 */
function SellerAccountLinkForm({
  accounts,
  selectedAccountId,
  isDefault,
  onAccountChange,
  onDefaultChange,
  onSubmit,
  onCancel,
  loading,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Link Seller Payment Account</h3>
      <p className="text-sm text-gray-600">Select one of your existing seller payment accounts to add as a payment method for checkout.</p>

      {/* Account Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Select Account *</label>
        {accounts.length === 0 ? (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">No seller payment accounts found. Please create one first.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <label key={account.id} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                <input
                  type="radio"
                  name="account"
                  value={account.id}
                  checked={selectedAccountId === account.id}
                  onChange={(e) => onAccountChange(e.target.value)}
                  disabled={loading}
                  className="mt-1"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="text-gray-900">{account.accountName}</strong>
                    {account.isDefault && <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">Default</span>}
                    {account.status === 'VERIFIED' && <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Verified</span>}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>{account.bankName}</span>
                    <span className="mx-2">•</span>
                    <span>•••• {account.accountNumber.slice(-4)}</span>
                    <span className="mx-2">•</span>
                    <span>{account.accountType}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Default Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="link-default"
          checked={isDefault}
          onChange={(e) => onDefaultChange(e.target.checked)}
          disabled={loading}
          className="rounded border-gray-300"
        />
        <label htmlFor="link-default" className="ml-3 text-sm text-gray-700">
          Make this my default payment method
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button 
          type="submit" 
          disabled={loading || !selectedAccountId} 
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Linking...' : 'Link Account'}
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

export default CustomerPaymentMethodsPage;
