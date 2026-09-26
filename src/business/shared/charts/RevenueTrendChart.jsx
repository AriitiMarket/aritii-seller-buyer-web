import React, { useMemo } from 'react';
import SafeChart from './SafeChart';
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus';

/**
 * Revenue trend from the caller's real delivered orders — never hardcoded.
 * Pass `ShopOrders`; renders an empty state when there is no delivered data.
 */
const RevenueTrendChart = ({ timeFilter, setTimeFilter, ShopOrders = [] }) => {
  const revenueTrendData = useMemo(() => {
    const buckets = {};
    const now = new Date();
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.push(d.toLocaleString('en', { month: 'short' }));
      buckets[key] = 0;
    }
    (ShopOrders || []).forEach((o) => {
      if (normalizeStatus(o.status) !== ORDER_STATUSES.DELIVERED) return;
      const created = o.createdAt ? new Date(o.createdAt) : null;
      if (!created || Number.isNaN(created.getTime())) return;
      const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}`;
      if (key in buckets) buckets[key] += Number(o.totalPrice) || 0;
    });
    const data = months.map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return buckets[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`] || 0;
    });
    return {
      labels: months,
      datasets: [{
        label: 'Revenue',
        data,
        borderColor: '#75d04b',
        backgroundColor: 'rgba(117, 208, 75, 0.1)',
        tension: 0.4,
        fill: true,
      }],
    };
  }, [ShopOrders]);

  const hasData = (ShopOrders || []).some(
    (o) => normalizeStatus(o.status) === ORDER_STATUSES.DELIVERED
  );

  const revenueChartOptions = {
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
        ticks: { callback: (value) => `ETB ${(value / 1000)}k` }
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
        <div className="flex gap-2">
          {['7D', '30D', '90D', '1Y'].map((filter) => (
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
      {hasData ? (
        <SafeChart type="line" data={revenueTrendData} options={revenueChartOptions} height={350} />
      ) : (
        <div className="h-[350px] flex items-center justify-center text-gray-500 text-sm">
          No delivered-order revenue yet — the trend appears once orders complete.
        </div>
      )}
    </div>
  );
};

export default RevenueTrendChart;
