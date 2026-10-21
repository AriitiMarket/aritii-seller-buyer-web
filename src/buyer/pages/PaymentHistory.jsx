import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FiDownload, FiSearch, FiFilter, FiCalendar, FiCheckCircle, FiClock, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import { paymentService } from '@/services';

const PaymentHistory = () => {
  // The store slice is `user`, not `auth` — `state.auth` never existed, so
  // `user` was always undefined and the page never fetched anything.
  const { user } = useSelector((state) => state.user || {});
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [page, setPage] = useState(0);
  const [limit] = useState(25);

  useEffect(() => {
    if (!user?.id) return;

    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = await paymentService.getBuyerPayments(user.id);
        setPayments(Array.isArray(rows) ? rows : rows?.payments || []);
      } catch (err) {
        setError(err.message);
        console.error('Payment history fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user?.id]);

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const searchMatch = searchTerm === '' ||
        p.orderId?.toString().includes(searchTerm) ||
        p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'all' || p.status === statusFilter;
      const createdAt = p.createdAt ? new Date(p.createdAt) : null;
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;
      if (endDate) endDate.setHours(23, 59, 59, 999);
      const startMatch = !startDate || (createdAt && createdAt >= startDate);
      const endMatch = !endDate || (createdAt && createdAt <= endDate);
      return searchMatch && statusMatch && startMatch && endMatch;
    });
  }, [payments, searchTerm, statusFilter, dateRange]);

  const pageCount = Math.ceil(filteredPayments.length / limit);
  const pagePayments = filteredPayments.slice(page * limit, (page + 1) * limit);

  const handleExport = async () => {
    try {
      const csv = [
        ['Date', 'Order ID', 'Amount', 'Status', 'Payment Method', 'Transaction ID'],
        ...filteredPayments.map(p => [
          new Date(p.createdAt).toLocaleString(),
          p.orderId,
          p.amount,
          p.status,
          p.paymentMethod,
          p.transactionId || 'N/A'
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <FiCheckCircle className="text-green-600" size={16} />;
      case 'PENDING':
        return <FiClock className="text-amber-600" size={16} />;
      case 'FAILED':
        return <FiXCircle className="text-red-600" size={16} />;
      case 'REFUNDED':
        return <FiRefreshCw className="text-blue-600" size={16} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'COMPLETED': 'bg-green-100 text-green-800',
      'PENDING': 'bg-amber-100 text-amber-800',
      'FAILED': 'bg-red-100 text-red-800',
      'REFUNDED': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const money = (value) => {
    return Number(value || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
        <button
          onClick={handleExport}
          disabled={filteredPayments.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          <FiDownload size={16} />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 mb-4">
          <FiFilter size={18} className="text-gray-600" />
          <span className="font-semibold text-gray-900">Filters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by order or transaction ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          {/* Date Range */}
          <div className="relative">
            <FiCalendar className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="date"
              value={dateRange.start || ''}
              onChange={(e) => {
                setDateRange({ ...dateRange, start: e.target.value });
                setPage(0);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div className="relative">
            <FiCalendar className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="date"
              value={dateRange.end || ''}
              onChange={(e) => {
                setDateRange({ ...dateRange, end: e.target.value });
                setPage(0);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin text-blue-600">
            <FiRefreshCw size={32} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Payments Table */}
      {!loading && filteredPayments.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pagePayments.map(payment => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        #{payment.orderId.toString().slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {money(payment.amount)} {payment.currency}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {payment.transactionId ? payment.transactionId.slice(-8) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Showing {filteredPayments.length === 0 ? 0 : page * limit + 1}
              {'–'}{Math.min((page + 1) * limit, filteredPayments.length)} of {filteredPayments.length} payments
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
                onClick={() => setPage(p => p + 1)}
                disabled={page + 1 >= pageCount}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 transition text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredPayments.length === 0 && !error && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FiRefreshCw size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">No payments found</p>
          <p className="text-sm text-gray-500">Try adjusting your filters or date range</p>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
