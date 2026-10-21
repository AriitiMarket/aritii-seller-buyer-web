import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { paymentService } from '@/services';

/**
 * CUSTOMER TRANSACTIONS PAGE - View transaction history and details
 *
 * Requests go through the shared `paymentService`, so the gateway base URL and
 * the Authorization header are applied by the shared axios client.
 */
export function CustomerTransactionsPage() {
  const { user } = useSelector((state) => state.user || {});
  const userId = user?.id || user?._id;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('30d');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // The backend exposes the buyer's transaction list at
      // GET /payment/get-user-payments/:buyerId. There is no unfiltered
      // `/payment-ledger` list route — the ledger is only addressable per
      // payment id — so the filters below are applied client-side.
      const rows = await paymentService.getBuyerPayments(userId);
      setTransactions(Array.isArray(rows) ? rows : rows?.payments || []);
    } catch (err) {
      setError(err?.message || 'Failed to load transactions');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    loadTransactions();
  }, [loadTransactions]);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'PAYMENT':
        return '💳';
      case 'REFUND':
        return '↩️';
      default:
        return '📝';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const filteredTransactions = transactions.filter((txn) => {
    const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
    const matchesType = filterType === 'all' || txn.type === filterType;
    const matchesSearch =
      searchTerm === '' ||
      txn.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  const stats = {
    total: transactions.length,
    completed: transactions.filter((t) => t.status === 'COMPLETED').length,
    pending: transactions.filter((t) => t.status === 'PENDING').length,
    failed: transactions.filter((t) => t.status === 'FAILED').length,
    totalAmount: transactions
      .filter((t) => t.status === 'COMPLETED' && t.type === 'PAYMENT')
      .reduce((sum, t) => sum + t.amount, 0),
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div>
          <h1>Transaction History</h1>
          <p>View all your payments, refunds, and transaction details</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" onClick={() => setError(null)}>
          {error} ✕
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <p>Loading transactions...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-grid">
            <StatCard label="Total Transactions" value={stats.total} icon="📊" />
            <StatCard label="Completed" value={stats.completed} icon="✓" />
            <StatCard label="Pending" value={stats.pending} icon="⏱️" />
            <StatCard label="Failed" value={stats.failed} icon="✗" />
            <StatCard
              label="Total Spent"
              value={`${stats.totalAmount.toLocaleString()} ETB`}
              icon="💰"
            />
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by order ID or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="PAYMENT">Payments</option>
                <option value="REFUND">Refunds</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Date Range:</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
          </div>

          {/* Transactions List */}
          {filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions found</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterType('all');
                }}
                className="btn btn-primary btn-sm"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="transactions-list">
              {filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onSelect={() => setSelectedTransaction(transaction)}
                  icon={getTransactionIcon(transaction.type)}
                  statusColor={getStatusColor(transaction.status)}
                />
              ))}
            </div>
          )}

          {/* Transaction Details Modal */}
          {selectedTransaction && (
            <div
              className="modal-overlay"
              onClick={() => setSelectedTransaction(null)}
            >
              <div
                className="modal-content transaction-details-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="modal-close"
                  onClick={() => setSelectedTransaction(null)}
                >
                  ✕
                </button>

                <div className="modal-header">
                  <h2>Transaction Details</h2>
                </div>

                <div className="modal-body">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Transaction ID</label>
                      <span className="monospace">{selectedTransaction.id}</span>
                    </div>
                    <div className="detail-item">
                      <label>Order ID</label>
                      <span>{selectedTransaction.orderId}</span>
                    </div>
                    <div className="detail-item">
                      <label>Type</label>
                      <span>
                        {selectedTransaction.type === 'PAYMENT'
                          ? 'Payment'
                          : 'Refund'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Status</label>
                      <span
                        className={`status-badge status-${getStatusColor(
                          selectedTransaction.status
                        )}`}
                      >
                        {selectedTransaction.status}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Amount</label>
                      <span className="amount">
                        {selectedTransaction.amount.toLocaleString()} {selectedTransaction.currency}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Payment Method</label>
                      <span>{selectedTransaction.methodDetails}</span>
                    </div>
                    <div className="detail-item">
                      <label>Description</label>
                      <span>{selectedTransaction.description}</span>
                    </div>
                    <div className="detail-item">
                      <label>Date</label>
                      <span>{new Date(selectedTransaction.createdAt).toLocaleString()}</span>
                    </div>

                    {selectedTransaction.completedAt && (
                      <div className="detail-item">
                        <label>Completed</label>
                        <span>
                          {new Date(selectedTransaction.completedAt).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {selectedTransaction.failureReason && (
                      <div className="detail-item error">
                        <label>Failure Reason</label>
                        <span>{selectedTransaction.failureReason}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-actions">
                  {selectedTransaction.status === 'FAILED' && (
                    <button className="btn btn-primary">Retry Payment</button>
                  )}
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="btn btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Stats Card Component
 */
function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}

/**
 * Transaction Item Component
 */
function TransactionItem({
  transaction,
  onSelect,
  icon,
  statusColor,
}) {
  return (
    <div className="transaction-item" onClick={onSelect}>
      <div className="transaction-icon">{icon}</div>

      <div className="transaction-info">
        <div className="transaction-header">
          <h3 className="transaction-title">{transaction.description}</h3>
          <span className={`status-badge status-${statusColor}`}>
            {transaction.status}
          </span>
        </div>

        <div className="transaction-meta">
          <span>Order: {transaction.orderId}</span>
          <span>•</span>
          <span>{transaction.methodDetails}</span>
          <span>•</span>
          <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="transaction-amount">
        <span
          className={`amount ${
            transaction.type === 'REFUND' ? 'refund' : 'payment'
          }`}
        >
          {transaction.type === 'REFUND' ? '+' : '-'}
          {transaction.amount.toLocaleString()} {transaction.currency}
        </span>
      </div>

      <button className="transaction-expand">→</button>
    </div>
  );
}

export default CustomerTransactionsPage;
