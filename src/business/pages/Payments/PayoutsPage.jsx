import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import sellerPaymentsService from '@/business/services/sellerPayments.service';
import './SellerFinancePages.css';

/**
 * SELLER PAYOUTS PAGE - Request and track payouts
 *
 * All requests go through `sellerPaymentsService` so the gateway base URL and
 * the Authorization header are applied by the shared axios client.
 */
export function PayoutsPage() {
  const seller = useSelector((state) => state.seller?.seller || null);
  const sellerId = seller?.id || seller?._id;
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [formData, setFormData] = useState({
    amount: '',
    payoutMethod: 'BANK_TRANSFER',
    notes: '',
  });

  const loadPayouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await sellerPaymentsService.getPayouts();
      setPayouts(Array.isArray(data) ? data : data?.payouts || data?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load payouts');
      console.error('Load payouts error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWalletBalance = useCallback(async () => {
    if (!sellerId) return;

    try {
      setError(null);

      const data = await sellerPaymentsService.getWalletDashboard(sellerId);
      const walletData = data?.data || data;
      setWalletBalance(walletData?.availableBalance || walletData?.balance || 0);
    } catch (err) {
      console.error('Load wallet balance error:', err);
      // Keep the current balance on error
    }
  }, [sellerId]);

  useEffect(() => {
    loadPayouts();
    loadWalletBalance();
  }, [loadPayouts, loadWalletBalance]);

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setActionLoading(true);
      setError(null);

      // Send payout request to backend. The endpoint expects
      // `{ amount, payoutMethod, payoutDetails }` and derives the seller
      // from the authenticated session.
      const data = await sellerPaymentsService.requestPayout({
        amount: parseFloat(formData.amount),
        payoutMethod: formData.payoutMethod,
        payoutDetails: { notes: formData.notes },
      });
      const payoutResult = data?.data || data;
      const newPayout = {
        id: payoutResult?.payoutRequestId || payoutResult?.id,
        amount: Number(payoutResult?.amount || formData.amount),
        payoutMethod: formData.payoutMethod,
        status: payoutResult?.status || 'PENDING',
        requestedAt: new Date().toISOString(),
      };

      // Update local state
      setPayouts((prev) => [newPayout, ...prev]);
      setWalletBalance((prev) => prev - parseFloat(formData.amount));
      resetForm();
      setShowRequestForm(false);
    } catch (err) {
      setError(err.message || 'Failed to request payout');
      console.error('Request payout error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.amount) {
      setError('Amount is required');
      return false;
    }
    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }
    if (amount > walletBalance) {
      setError('Insufficient balance');
      return false;
    }
    if (amount < 500) {
      setError('Minimum payout amount is 500 ETB');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      payoutMethod: 'BANK_TRANSFER',
      notes: '',
    });
  };

  const stats = {
    pending: payouts.filter((p) => ['PENDING', 'PENDING_APPROVAL', 'PROCESSING'].includes(p.status)).length,
    completed: payouts.filter((p) => p.status === 'COMPLETED').length,
    totalCompleted: payouts
      .filter((p) => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <div className="seller-payouts-page">
      <div className="page-header">
        <h1>Payouts</h1>
        <p>Request and track payouts from your wallet</p>
      </div>

      {error && (
        <div className="alert alert-error" onClick={() => setError(null)}>
          {error} ✕
        </div>
      )}

      {loading ? (
        <div className="loading-state"><p>Loading payouts...</p></div>
      ) : (
        <>
          {/* Wallet Balance */}
          <div className="wallet-section">
            <div className="wallet-card">
              <div className="wallet-header">
                <h2>Available Balance</h2>
              </div>
              <div className="wallet-amount">
                <span className="currency">ETB</span>
                <span className="amount">{walletBalance.toLocaleString()}</span>
              </div>
              <button
                onClick={() => setShowRequestForm(!showRequestForm)}
                className="btn btn-primary btn-full"
              >
                {showRequestForm ? 'Cancel' : '+ Request Payout'}
              </button>
            </div>
          </div>

          {showRequestForm && (
            <PayoutRequestForm
              data={formData}
              maxAmount={walletBalance}
              onChange={(field, value) =>
                setFormData((prev) => ({ ...prev, [field]: value }))
              }
              onSubmit={handleRequestPayout}
              onCancel={() => {
                setShowRequestForm(false);
                resetForm();
              }}
              loading={actionLoading}
            />
          )}

          {/* Stats */}
          <div className="stats-grid">
            <StatCard
              label="Pending Requests"
              value={stats.pending}
              icon="⏱️"
            />
            <StatCard
              label="Completed Payouts"
              value={stats.completed}
              icon="✓"
            />
            <StatCard
              label="Total Paid Out"
              value={`${stats.totalCompleted.toLocaleString()} ETB`}
              icon="💰"
            />
          </div>

          {/* Payouts List */}
          {payouts.length === 0 ? (
            <div className="empty-state">
              <p>No payouts yet</p>
            </div>
          ) : (
            <div className="payouts-list">
              {payouts.map((payout) => (
                <PayoutCard key={payout.id} payout={payout} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}

function PayoutRequestForm({
  data,
  maxAmount,
  onChange,
  onSubmit,
  onCancel,
  loading,
}) {
  return (
    <div className="form-card payout-request-form">
      <h2>Request Payout</h2>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Amount (ETB) *</label>
          <input
            type="number"
            value={data.amount}
            onChange={(e) => onChange('amount', e.target.value)}
            placeholder="5000"
            min="500"
            max={maxAmount}
            step="100"
            required
            disabled={loading}
          />
          <small>Min: 500 ETB | Max: {maxAmount.toLocaleString()} ETB</small>
        </div>

        <div className="form-group">
          <label>Payout Method *</label>
          <select
            value={data.payoutMethod}
            onChange={(e) => onChange('payoutMethod', e.target.value)}
            required
            disabled={loading}
          >
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="MOBILE_MONEY">Mobile Money</option>
            <option value="WALLET">Wallet Transfer</option>
          </select>
        </div>

        <div className="form-group">
          <label>Additional Notes</label>
          <textarea
            value={data.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Any additional information about this payout request..."
            rows="3"
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Processing...' : 'Request Payout'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function PayoutCard({ payout }) {
  const statusColors = {
    COMPLETED: 'success',
    PENDING_APPROVAL: 'warning',
    REJECTED: 'error',
    IN_PROGRESS: 'info',
  };

  const statusLabels = {
    COMPLETED: 'Completed',
    PENDING: 'Pending review',
    PENDING_APPROVAL: 'Pending Approval',
    APPROVED: 'Approved',
    PROCESSING: 'Processing',
    REJECTED: 'Rejected',
    FAILED: 'Failed',
    IN_PROGRESS: 'In Progress',
  };

  return (
    <div className="payout-card">
      <div className="payout-header">
        <div>
          <h3>{payout.amount.toLocaleString()} ETB</h3>
        <p>{payout.payoutMethod || payout.method || 'Payout'}</p>
        </div>
        <span className={`badge status-${statusColors[payout.status]}`}>
          {statusLabels[payout.status]}
        </span>
      </div>

      <div className="payout-details">
        <div className="detail">
          <span>Request ID:</span>
          <span className="monospace">{payout.id}</span>
        </div>
        <div className="detail">
          <span>Requested:</span>
          <span>{new Date(payout.requestedAt).toLocaleDateString()}</span>
        </div>
        {payout.approvedAt && (
          <div className="detail">
            <span>Approved:</span>
            <span>{new Date(payout.approvedAt).toLocaleDateString()}</span>
          </div>
        )}
        {payout.completedAt && (
          <div className="detail">
            <span>Completed:</span>
            <span>{new Date(payout.completedAt).toLocaleDateString()}</span>
          </div>
        )}
        {payout.rejectionReason && (
          <div className="detail error">
            <span>Rejection Reason:</span>
            <span>{payout.rejectionReason}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PayoutsPage;
