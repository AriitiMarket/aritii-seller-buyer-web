import React, { useEffect, useState } from 'react';
import { FiDollarSign, FiClock, FiTrendingUp, FiRefreshCw, FiCreditCard } from 'react-icons/fi';
import walletService from '@/business/services/wallet.service';
import { toast } from 'react-toastify';

/**
 * WalletCard - Seller wallet summary for dashboard
 * Shows: available balance, pending balance, total earned
 * Displays: recent transactions mini-list
 */
const WalletCard = ({ sellerId, onViewTransactions }) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('BANK_TRANSFER');
  const [payoutSubmitting, setPayoutSubmitting] = useState(false);

  const PAYOUT_METHODS = [
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'MOBILE_MONEY', label: 'Mobile Money (Telebirr/CBE Birr)' },
  ];

  useEffect(() => {
    if (!sellerId) return;

    const fetchWallet = async () => {
      setLoading(true);
      setError(null);
      try {
        const walletData = await walletService.getWalletDashboard(sellerId);
        if (walletData) {
          setWallet(walletData);
        }
      } catch (err) {
        setError(err.message);
        console.error('Wallet fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [sellerId]);

  const handleRequestPayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    const amount = parseFloat(payoutAmount);
    if (amount > walletData.availableBalance) {
      toast.error('Insufficient available balance');
      return;
    }

    setPayoutSubmitting(true);
    try {
      await walletService.requestPayout(sellerId, amount, payoutMethod, {});
      toast.success('Payout requested successfully');
      setPayoutModalOpen(false);
      setPayoutAmount('');
      // Refresh wallet data
      const updatedWallet = await walletService.getWalletDashboard(sellerId);
      if (updatedWallet) setWallet(updatedWallet);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to request payout');
    } finally {
      setPayoutSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/3" />
        <div className="h-8 bg-gray-200 rounded mb-6 w-1/2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-red-200">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!wallet) return null;

  const { wallet: walletData, recentTransactions, pendingTransactionCount } = wallet;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <FiDollarSign className="text-green-600" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Wallet</h3>
        </div>
        {pendingTransactionCount > 0 && (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
            {pendingTransactionCount} Pending
          </span>
        )}
      </div>

      {/* Main Balance Display */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <p className="text-xs text-green-700 font-medium mb-1">Available</p>
          <p className="text-2xl font-bold text-green-600">
            {walletData.availableBalance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
          <p className="text-xs text-green-600 mt-1">Ready to payout</p>
        </div>

        {/* Pending Balance */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
          <p className="text-xs text-amber-700 font-medium mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-600">
            {walletData.pendingBalance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
          <p className="text-xs text-amber-600 mt-1">Holding period</p>
        </div>
      </div>

      {/* Total Earned */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <p className="text-xs text-blue-700 font-medium mb-1">Total Earned</p>
          <p className="text-2xl font-bold text-blue-600">
            {walletData.totalEarned.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
          <p className="text-xs text-gray-700 font-medium mb-1">Commission Deducted</p>
          <p className="text-2xl font-bold text-gray-600">
            {walletData.totalCommissionDeducted.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setPayoutModalOpen(true)}
          disabled={walletData.availableBalance <= 0}
          className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          <FiCreditCard size={18} />
          Request Payout
        </button>
        <button
          onClick={() => onViewTransactions && onViewTransactions()}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <FiClock size={18} />
          Transactions
        </button>
      </div>

      {/* Payout Modal */}
      {payoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setPayoutModalOpen(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Request Payout</h3>
              <button onClick={() => setPayoutModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Balance</label>
                <p className="text-2xl font-bold text-green-600">
                  {walletData.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payout Method</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {PAYOUT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (ETB)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={walletData.availableBalance}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter amount"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setPayoutModalOpen(false); setPayoutAmount(''); }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestPayout}
                disabled={payoutSubmitting || !payoutAmount || parseFloat(payoutAmount) > walletData.availableBalance}
                className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {payoutSubmitting ? 'Processing...' : 'Confirm Payout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {recentTransactions && recentTransactions.length > 0 && (
        <div className="border-t pt-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">Recent Transactions</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {recentTransactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition cursor-pointer"
                onClick={() => onViewTransactions && onViewTransactions()}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`p-1.5 rounded ${
                    transaction.direction === 'CREDIT' 
                      ? 'bg-green-100' 
                      : 'bg-red-100'
                  }`}>
                    {transaction.direction === 'CREDIT' ? (
                      <FiTrendingUp size={14} className="text-green-600" />
                    ) : (
                      <FiRefreshCw size={14} className="text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {transaction.type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className={`text-xs font-semibold ml-2 ${
                  transaction.direction === 'CREDIT'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {transaction.direction === 'CREDIT' ? '+' : '-'}
                  {transaction.amount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => onViewTransactions && onViewTransactions()}
            className="w-full mt-3 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded transition"
          >
            View All Transactions →
          </button>
        </div>
      )}

      {/* Status */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">
            Status: <span className={`font-semibold ${
              walletData.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
            }`}>{walletData.status}</span>
          </span>
          <span className="text-xs text-gray-500">
            Updated {new Date(walletData.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
