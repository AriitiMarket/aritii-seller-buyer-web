import React, { useMemo } from 'react';
import SafeChart from './SafeChart';
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus';

/**
 * Weekly sales overview from the caller's real delivered orders — never
 * hardcoded daily figures. Pass ShopOrders; shows an empty state otherwise.
 */
const SalesOverviewChart = ({ timeFilter, setTimeFilter, ShopOrders = [] }) => {
  const salesData = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const buckets = dayNames.map(() => 0);

    // Last 7 days including today
    for (let i = 0; i < 7; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const idx = d.getDay();
      const key = d.toISOString().split('T')[0];
      (ShopOrders || []).forEach((o) => {
        if (normalizeStatus(o.status) !== ORDER_STATUSES.DELIVERED) return;
        const created = o.createdAt ? new Date(o.createdAt) : null;
        if (!created || Number.isNaN(created.getTime())) return;
        if (created.toISOString().split('T')[0] === key) {
          buckets[idx] += Number(o.totalPrice) || 0;
        }
      });
    }

    // Reorder so the week starts Monday-ish for display: keep JS day order
    // but rotate so today is last: Sat..Sun order of last 7 days is fine as-is.
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return {
      labels,
      datasets: [{
        label: 'Revenue (ETB)',
        data: buckets,
        borderColor: '#75d04b',
        backgroundColor: 'rgba(117, 208, 75, 0.1)',
        tension: 0.4,
        fill: true,
      }],
      hasData: buckets.some((v) => v > 0),
    };
  }, [ShopOrders]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#141414',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `ETB ${context.raw.toLocaleString()}`
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { callback: (value) => `ETB ${value.toLocaleString()}` },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
        <div className="flex gap-2">
          {['7D', '30D', '90D'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter && setTimeFilter(filter)}
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
      {salesData.hasData ? (
        <SafeChart type="line" data={salesData} options={chartOptions} height={300} />
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500 text-sm">
          No sales in the last 7 days — the overview fills in as orders deliver.
        </div>
      )}
    </div>
  );
};

export default SalesOverviewChart;
