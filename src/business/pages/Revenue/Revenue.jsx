import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';
import Loader from '@/components/common/Loading';
import { FiDollarSign, FiDownload, FiFilter, FiCalendar, FiTrendingUp, FiCreditCard, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import SafeChart from '@/business/shared/charts/SafeChart';
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus';

const PLATFORM_FEE_RATE = 0.1; // 10% platform fee

const Revenue = () => {
  const { ShopOrders = [], isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { activeShopId } = useBusinessShops();
  const dispatch = useDispatch();

  const [timeFilter, setTimeFilter] = useState('30D');
  const [transactionFilter, setTransactionFilter] = useState('all');

  const shopId = activeShopId || seller?._id;

  useEffect(() => {
    if (shopId) {
      dispatch(getAllOrdersOfShop(shopId));
    }
  }, [dispatch, shopId]);

  // Calculate revenue data
  const revenueData = React.useMemo(() => {
    const succeededOrders = ShopOrders.filter(o => normalizeStatus(o.status) === ORDER_STATUSES.DELIVERED);
    const totalRevenue = succeededOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
    // 10% of REVENUE (not order count) withheld for platform fee / pending payout.
    const pendingPayouts = Math.round(totalRevenue * PLATFORM_FEE_RATE * 100) / 100;
    const availableBalance = totalRevenue - pendingPayouts;

    // Revenue trend from real delivered orders
    const monthlyRevenue = {};
    succeededOrders.forEach(order => {
      const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(order.totalPrice || 0);
    });

    const transactions = succeededOrders.slice(0, 10).map(order => ({
      id: order._id,
      type: 'sale',
      amount: Number(order.totalPrice || 0),
      status: 'completed',
      date: order.createdAt,
      description: `Order #${order._id.slice(-8)}`,
    }));

    return {
      totalRevenue,
      pendingPayouts,
      availableBalance,
      monthlyRevenue,
      transactions,
    };
  }, [ShopOrders]);

  const revenueChart = React.useMemo(() => {
    const labels = Object.keys(revenueData.monthlyRevenue);
    const data = Object.values(revenueData.monthlyRevenue);
    return {
      labels: labels.length ? labels : ['No data'],
      datasets: [{
        label: 'Revenue (ETB)',
        data: data.length ? data : [0],
        borderColor: '#75d04b',
        backgroundColor: 'rgba(117, 208, 75, 0.1)',
        tension: 0.4,
        fill: true,
      }],
    };
  }, [revenueData.monthlyRevenue]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Revenue & Payouts</h1>
                <p className="text-sm text-gray-600">Track your earnings and manage payouts</p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-dark transition">
                <FiDownload size={18} />
                Download Statement
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiDollarSign className="text-green-600" size={20} />
                </div>
                <span className="text-sm text-gray-600">Total Revenue</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">ETB {revenueData.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">From delivered orders</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FiCreditCard className="text-yellow-600" size={20} />
                </div>
                <span className="text-sm text-gray-600">Pending Payouts</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">ETB {revenueData.pendingPayouts.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">10% platform fee withheld</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiArrowUpRight className="text-blue-600" size={20} />
                </div>
                <span className="text-sm text-gray-600">Available Balance</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">ETB {revenueData.availableBalance.toLocaleString()}</p>
              <button className="text-xs text-brand-primary-dark mt-1 font-medium hover:underline">
                Request Payout
              </button>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
              <div className="flex gap-2">
                {['7D', '30D', '90D', '1Y'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      timeFilter === filter
                        ? 'bg-brand-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[300px]">
              <SafeChart type="line" data={revenueChart} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }} height={300} />
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
                <div className="flex gap-2">
                  <select
                    value={transactionFilter}
                    onChange={(e) => setTransactionFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-sm"
                  >
                    <option value="all">All Transactions</option>
                    <option value="sales">Sales</option>
                    <option value="payouts">Payouts</option>
                    <option value="refunds">Refunds</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="px-6 py-4">Transaction</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {revenueData.transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${transaction.type === 'sale' ? 'bg-green-100' : 'bg-blue-100'}`}>
                            {transaction.type === 'sale' ? (
                              <FiArrowUpRight className="text-green-600" size={16} />
                            ) : (
                              <FiArrowDownRight className="text-blue-600" size={16} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-xs text-gray-500">ID: {transaction.id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${transaction.type === 'sale' ? 'text-green-600' : 'text-blue-600'}`}>
                          {transaction.type === 'sale' ? '+' : '-'}ETB {transaction.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
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
      )}
    </>
  );
};

export default Revenue;
