import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSellerAllocations } from '@/services';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import Loader from '@/components/common/Loading';
import { FiDollarSign, FiDownload, FiFilter, FiCalendar, FiTrendingUp, FiCreditCard, FiArrowUpRight, FiArrowDownRight, FiMinus } from 'react-icons/fi';
import SafeChart from '@/business/shared/charts/SafeChart';

const money = (value) => Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Revenue = () => {
  const { seller } = useSelector((state) => state.seller);
  const { activeShopId } = useBusinessShops();
  const [timeFilter, setTimeFilter] = useState('30D');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const shopId = activeShopId || seller?._id;

  useEffect(() => {
    if (!shopId) return;
    let active = true;
    setLoading(true);
    getSellerAllocations(shopId)
      .then((rows) => { if (active) setAllocations(rows || []); })
      .catch(() => { if (active) setAllocations([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [shopId, getSellerAllocations]);

  const summary = useMemo(() => {
    const settled = allocations.filter((a) => a.status === 'SETTLED');
    const pending = allocations.filter((a) => a.status === 'PENDING' || a.status === 'PARTIALLY_SETTLED');
    const refunded = allocations.filter((a) => a.status === 'REFUNDED');
    const sum = (rows, key) => rows.reduce((acc, row) => acc + Number(row[key] || 0), 0);
    return {
      totalGross: sum(allocations, 'grossSubtotal'),
      totalCommission: sum(allocations, 'platformCommission'),
      totalNet: sum(allocations, 'netPayable'),
      settledTotal: sum(settled, 'netPayable'),
      pendingTotal: sum(pending, 'pendingAmount'),
      refundedTotal: sum(refunded, 'refundAmount'),
      settledCount: settled.length,
      pendingCount: pending.length,
      refundedCount: refunded.length,
    };
  }, [allocations]);

  // Monthly revenue trend from allocation creation dates.
  const monthlyRevenue = useMemo(() => {
    const m = {};
    allocations.forEach((a) => {
      const month = new Date(a.createdAt || a.updatedAt).toLocaleString('default', { month: 'short' });
      m[month] = (m[month] || 0) + Number(a.netPayable || 0);
    });
    return m;
  }, [allocations]);

  const recentTransactions = useMemo(() => {
    return [...allocations]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 10)
      .map((a) => ({
        id: a._id || a.orderId,
        type: a.status === 'REFUNDED' ? 'refund' : 'sale',
        amount: Number(a.netPayable || 0),
        status: a.status.toLowerCase(),
        date: a.createdAt || a.updatedAt,
        description: `Order #${String(a.orderId || '').slice(-8)}`,
      }));
  }, [allocations]);

  if (loading && allocations.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="seller-section-header">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="seller-section-header-title">Revenue & Payouts</h1>
            <p className="seller-section-header-desc">Track your earnings and manage payouts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="seller-stat-card border-green-50">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-green-100 text-green-600">
              <FiDollarSign size={20} />
            </div>
          </div>
          <p className="seller-stat-card-value text-green-700 font-bold">ETB {money(summary.totalNet)}</p>
          <p className="seller-stat-card-label">Net earnings</p>
        </div>
        <div className="seller-stat-card border-amber-50">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-amber-100 text-amber-600">
              <FiDownload size={20} />
            </div>
          </div>
          <p className="seller-stat-card-value text-amber-700 font-bold">ETB {money(summary.pendingTotal)}</p>
          <p className="seller-stat-card-label">{summary.pendingCount} pending payout</p>
        </div>
        <div className="seller-stat-card border-green-50">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-green-100 text-green-600">
              <FiCreditCard size={20} />
            </div>
          </div>
          <p className="seller-stat-card-value text-green-700 font-bold">ETB {money(summary.settledTotal)}</p>
          <p className="seller-stat-card-label">{summary.settledCount} settled</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="seller-form-section">
          <h3 className="text-lg font-bold text-market-on-surface mb-4">Revenue Trend</h3>
          <div className="h-[300px]">
            <SafeChart
              type="line"
              data={{
                labels: Object.keys(monthlyRevenue).length ? Object.keys(monthlyRevenue) : ['No data'],
                datasets: [{
                  label: 'Net Revenue (ETB)',
                  data: Object.values(monthlyRevenue).length ? Object.values(monthlyRevenue) : [0],
                  borderColor: '#75d04b',
                  backgroundColor: 'rgba(117, 208, 75, 0.1)',
                  tension: 0.4,
                  fill: true,
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
              height={300}
            />
          </div>
        </div>
        <div className="seller-form-section">
          <h3 className="text-lg font-bold text-market-on-surface mb-4">Recent Transactions</h3>
          <div className="flex gap-2 mb-4">
            <select
              value={transactionFilter}
              onChange={(e) => setTransactionFilter(e.target.value)}
              className="seller-form-select w-auto"
            >
              <option value="all">All Transactions</option>
              <option value="sale">Sales</option>
              <option value="refund">Refunds</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="seller-data-table">
              <thead>
                <tr>
                  <th scope="col">Transaction</th>
                  <th scope="col">Date</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.filter((t) => transactionFilter === 'all' || t.type === transactionFilter).map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${transaction.type === 'sale' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {transaction.type === 'sale' ? <FiArrowUpRight className="text-green-600" size={16} /> : <FiMinus className="text-red-600" size={16} />}
                        </div>
                        <div>
                          <p className="font-medium text-market-on-surface">{transaction.description}</p>
                          <p className="text-xs text-market-on-surface-variant">ID: {transaction.id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-market-on-surface-variant text-sm">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="font-semibold text-market-on-surface">
                      {transaction.type === 'sale' ? '+' : '-'}ETB {money(transaction.amount)}
                    </td>
                    <td>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${transaction.status === 'settled' ? 'bg-green-100 text-green-700' : transaction.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="seller-form-section mt-6">
        <h3 className="text-lg font-bold text-market-on-surface mb-4">Financial Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="seller-form-section">
            <p className="text-sm text-market-on-surface-variant">Gross sales</p>
            <p className="text-lg font-bold text-market-on-surface">ETB {money(summary.totalGross)}</p>
          </div>
          <div className="seller-form-section">
            <p className="text-sm text-market-on-surface-variant">Platform commission</p>
            <p className="text-lg font-bold text-market-on-surface">ETB {money(summary.totalCommission)}</p>
          </div>
          <div className="seller-form-section">
            <p className="text-sm text-market-on-surface-variant">Refunds</p>
            <p className="text-lg font-bold text-market-on-surface">ETB {money(summary.refundedTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
