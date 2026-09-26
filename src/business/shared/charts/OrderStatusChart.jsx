import React from 'react';
import SafeChart from './SafeChart';
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus';

const OrderStatusChart = ({ ShopOrders = [] }) => {
  const byStatus = (status) =>
    ShopOrders.filter(o => normalizeStatus(o.status) === status).length;
  const orderStatusData = {
    labels: ['Delivered', 'Processing', 'Cancelled', 'Other'],
    datasets: [
      {
        data: [
          byStatus(ORDER_STATUSES.DELIVERED),
          byStatus(ORDER_STATUSES.PROCESSING),
          byStatus(ORDER_STATUSES.CANCELLED),
          ShopOrders.length
            - byStatus(ORDER_STATUSES.DELIVERED)
            - byStatus(ORDER_STATUSES.PROCESSING)
            - byStatus(ORDER_STATUSES.CANCELLED),
        ],
        backgroundColor: ['#75d04b', '#3b82f6', '#ef4444', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  const orderStatusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, usePointStyle: true },
      },
      tooltip: {
        backgroundColor: '#141414',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Order Status Distribution</h3>
      <SafeChart type="doughnut" data={orderStatusData} options={orderStatusOptions} height={300} />
    </div>
  );
};

export default OrderStatusChart;
