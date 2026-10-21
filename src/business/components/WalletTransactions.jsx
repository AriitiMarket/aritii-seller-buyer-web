import React, { useEffect, useState } from 'react';
import { FiDollarSign, FiDownload, FiFilter, FiSearch, FiArrowUpRight, FiArrowDownLeft, FiX, FiClock } from 'react-icons/fi';
import walletService from '@/business/services/wallet.service';
import { toast } from 'react-toastify';

/**
 * WalletTransactions - Full wallet transaction history page
 * Shows: all transactions with filtering, pagination, export
 * Features: type filtering, date range, search, pagination, detail modal
 */
const WalletTransactions = ({ sellerId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [typeFilter, setTypeFilter] = useState('all');
  const [directionFilter, setDirectionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // Pagination
  const [page, setPage] = useState(0);
  const [limit] = useState(25);

  // Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const TRANSACTION_TYPES = [
    'ORDER_ALLOCATION',
    'COMMISSION_DEDUCTED',
    'PENDING_RELEASE',
    'REFUND_CREDITED',
    'ADJUSTMENT',
    'PAYOUT_REQUESTED',
    'PAYOUT_COMPLETED',
    'PAYOUT_FAILED'
  ];

  const STATUSES = ['PENDING', 'COMPLETED', 'FAILED', 'REVERSED'];

  useEffect(() => {
    if (!sellerId) return;

    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await walletService.getTransactionHistory(sellerId, {
          limit,
          offset: page * limit,
          startDate: dateRange.start?.toISOString(),
          endDate: dateRange.end?.toISOString(),
          type: typeFilter === 'all' ? undefined : typeFilter,
          status: statusFilter === 'all' ? undefined : statusFilter,
          direction: directionFilter === 'all' ? undefined : directionFilter,
          search: searchTerm || undefined,
        });
        // API returns array directly or { data, pagination, total }
        const transactionArray = Array.isArray(data) ? data : (data.data || data.transactions || []);
        const pagination = data.pagination || {};
        setTransactions(transactionArray);
        setTotalCount(pagination.total || transactionArray.length);
      } catch (err) {
        setError(err.message);
        console.error('Transaction fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [sellerId, page, limit, dateRange, typeFilter, directionFilter, statusFilter, searchTerm]);

  const totalPages = Math.ceil(totalCount / limit);

  const handleExport = async () => {
    try {
      // Export all transactions (fetch without pagination)
      const allData = await walletService.getTransactionHistory(sellerId, {
        limit: 10000,
        offset: 0,
        startDate: dateRange.start?.toISOString(),
        endDate: dateRange.end?.toISOString(),
        type: typeFilter === 'all' ? undefined : typeFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        direction: directionFilter === 'all' ? undefined : directionFilter,
        search: searchTerm || undefined,
      });
      const allTransactions = Array.isArray(allData) ? allData : (allData.data || allData.transactions || []);
      
      const csv = [
        ['Date', 'Type', 'Direction', 'Amount', 'Status', 'Reason', 'Balance After'],
        ...allTransactions.map(t => [
          new Date(t.timestamp).toLocaleString(),
          t.type,
          t.direction,
          t.amount,
          t.status,
          t.reason || '',
          t.balanceAfter
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wallet-transactions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Transactions exported successfully');
    } catch (err) {
      toast.error('Failed to export transactions');
    }
  };

  const money = (amount) =>
    Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-amber-100 text-amber-700';
      case 'FAILED': return 'bg-red-100 text-red-700';
      case 'REVERSED': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'ORDER_ALLOCATION': return <FiArrowUpRight className="text-green-500" size={16} />;
      case 'COMMISSION_DEDUCTED': return <FiDollarSign className="text-amber-500" size={16} />;
      case 'PENDING_RELEASE': return <FiClock className="text-blue-500" size={16} />;
      case 'REFUND_CREDITED': return <FiArrowDownLeft className="text-green-500" size={16} />;
      case 'ADJUSTMENT': return <FiFilter className="text-purple-500" size={16} />;
      case 'PAYOUT_REQUESTED':
      case 'PAYOUT_COMPLETED':
      case 'PAYOUT_FAILED': return <FiDollarSign className="text-indigo-500" size={16} />;
      default: return <FiDollarSign className="text-gray-500" size={16} />;
    }
  };

  const openDetailModal = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedTransaction(null);
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center animate-pulse">
        <FiDollarSign size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-red-200">
        <p className="text-red-600 text-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Retry</button>
      </div>
    );
  }

  return (
    <>
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Wallet Transactions</h1>
            <p className="text-gray-600 mt-1">View and manage your wallet transaction history</p>
          </div>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            <FiDownload size={18} />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by reason, order ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Types</option>
              {TRANSACTION_TYPES.map(type => (
                <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
            <select
              value={directionFilter}
              onChange={(e) => { setDirectionFilter(e.target.value); setPage(0); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All</option>
              <option value="CREDIT">Credit (+)</option>
              <option value="DEBIT">Debit (-)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All</option>
              {STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start ? dateRange.start.toISOString().split('T')[0] : ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value ? new Date(e.target.value) : null }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Start"
              />
              <input
                type="date"
                value={dateRange.end ? dateRange.end.toISOString().split('T')[0] : ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value ? new Date(e.target.value) : null }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="End"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance After</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map(transaction => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getTransactionIcon(transaction.type)}
                    <span className="text-sm font-medium text-gray-900">
                      {transaction.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-semibold ${
                    transaction.direction === 'CREDIT'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {transaction.direction === 'CREDIT' ? '+' : '-'}
                    {money(transaction.amount)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {transaction.reason || '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(transaction.timestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {money(transaction.balanceAfter)}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openDetailModal(transaction)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Page {page + 1} of {totalPages || 1} ({totalCount} total)
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 transition text-sm"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 transition text-sm"
          >
            Next
          </button>
        </div>
      </div>

      {/* Empty State */}
      {!loading && transactions.length === 0 && (
        <div className="p-12 text-center">
          <FiDollarSign size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">No transactions found</p>
          <p className="text-sm text-gray-500">Try adjusting your filters or date range</p>
        </div>
      )}
    </div>

    {/* Detail Modal */}
    {detailModalOpen && selectedTransaction && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeDetailModal}>
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Transaction Details</h3>
            <button onClick={closeDetailModal} className="text-gray-400 hover:text-gray-600">
              <FiX size={24} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Transaction ID</label>
              <p className="font-mono text-sm text-gray-900 break-all">{selectedTransaction.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
              <p className="text-sm font-medium text-gray-900">{selectedTransaction.type.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Direction</label>
              <p className={`text-sm font-semibold ${selectedTransaction.direction === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                {selectedTransaction.direction === 'CREDIT' ? '+' : '-'}
                {money(selectedTransaction.amount)} ETB
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(selectedTransaction.status)}`}>
                {selectedTransaction.status}
              </span>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">Reason</label>
              <p className="text-sm text-gray-900">{selectedTransaction.reason || '—'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Related Order</label>
              <p className="text-sm text-gray-900">{selectedTransaction.relatedOrderId || '—'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Balance After</label>
              <p className="text-sm font-medium text-gray-900">{money(selectedTransaction.balanceAfter)} ETB</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Timestamp</label>
              <p className="text-sm text-gray-900">{new Date(selectedTransaction.timestamp).toLocaleString()}</p>
            </div>
            {selectedTransaction.metadata && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Metadata</label>
                <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(selectedTransaction.metadata, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default WalletTransactions;
