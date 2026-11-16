import React, { useMemo } from 'react';
import SafeChart from './SafeChart';

/**
 * Monthly order counts derived from the caller's real orders (ShopOrders).
 * Renders an honest empty state when there is no data — never hardcoded numbers.
 */
const MonthlyOrdersChart = ({ ShopOrders = [] }) => {
  const { labels, thisYear, lastYear, hasData } = useMemo(() => {
    const now = new Date();
    const thisYearBuckets = {};
    const lastYearBuckets = {};
    const monthLabels = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthLabels.push(d.toLocaleString('en', { month: 'short' }));
      thisYearBuckets[key] = 0;
      lastYearBuckets[key] = 0;
    }

    (ShopOrders || []).forEach((o) => {
      const created = o.createdAt ? new Date(o.createdAt) : null;
      if (!created || Number.isNaN(created.getTime())) return;
      const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}`;
      if (key in thisYearBuckets) thisYearBuckets[key] += 1;
      else if (key in lastYearBuckets) lastYearBuckets[key] += 1;
    });

    const t = monthLabels.map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return thisYearBuckets[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`] || 0;
    });
    const l = monthLabels.map((_, i) => {
      const d = new Date(now.getFullYear() - 1, now.getMonth() - (11 - i), 1);
      return lastYearBuckets[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`] || 0;
    });

    return {
      labels: monthLabels,
      thisYear: t,
      lastYear: l,
      hasData: (ShopOrders || []).length > 0,
    };
  }, [ShopOrders]);

  const monthlyOrdersData = {
    labels,
    datasets: [
      { label: 'This Year', data: thisYear, backgroundColor: '#75d04b', borderRadius: 4 },
      { label: 'Last Year', data: lastYear, backgroundColor: '#e5e7eb', borderRadius: 4 },
    ],
  };

  const monthlyOrdersOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true } },
      tooltip: {
        backgroundColor: '#141414',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Orders</h3>
      {hasData ? (
        <SafeChart type="bar" data={monthlyOrdersData} options={monthlyOrdersOptions} height={300} />
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500 text-sm">
          No orders yet — the chart will populate once sales come in.
        </div>
      )}
    </div>
  );
};

export default MonthlyOrdersChart;
