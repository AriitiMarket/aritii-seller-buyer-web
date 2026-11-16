import React, { useMemo } from 'react';
import SafeChart from './SafeChart';
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus';

/**
 * Sales by product category derived from the caller's real delivered orders
 * joined against product category names. Empty state when no data — never
 * hardcoded category figures.
 *
 * @param {object} props
 * @param {Array}  props.ShopOrders - seller's orders
 * @param {Array}  [props.products] - optional product docs for category lookup
 */
const CategoryChart = ({ ShopOrders = [], products = [] }) => {
  const categoryData = useMemo(() => {
    const categoryById = new Map();
    const categoryByName = new Map();
    (products || []).forEach((p) => {
      const cat = p.category || p.categoryName || 'Uncategorized';
      if (p._id) categoryById.set(String(p._id), cat);
      if (p.name) categoryByName.set(String(p.name), cat);
    });

    const sales = {};
    (ShopOrders || []).forEach((o) => {
      if (normalizeStatus(o.status) !== ORDER_STATUSES.DELIVERED) return;
      (o.cart || []).forEach((li) => {
        const productId = String(li._id || li.productId || li.product || '');
        const name = String(li.name || '');
        const cat = categoryById.get(productId) || categoryByName.get(name) || 'Uncategorized';
        const qty = Number(li.quantity ?? li.qty) || 1;
        const price = Number(li.discountPrice ?? li.price) || 0;
        sales[cat] = (sales[cat] || 0) + qty * price;
      });
    });

    const labels = Object.keys(sales);
    const data = labels.map((l) => sales[l]);
    return {
      labels,
      datasets: [{
        label: 'Sales',
        data,
        backgroundColor: ['#75d04b', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'],
        borderWidth: 0,
      }],
      hasData: labels.length > 0 && data.some((v) => v > 0),
    };
  }, [ShopOrders, products]);

  const categoryChartOptions = {
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
        callbacks: {
          label: (context) => `ETB ${context.raw.toLocaleString()}`
        }
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Sales by Category</h3>
      {categoryData.hasData ? (
        <SafeChart type="doughnut" data={categoryData} options={categoryChartOptions} height={300} />
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500 text-sm">
          No category sales yet — appears once delivered orders have line items.
        </div>
      )}
    </div>
  );
};

export default CategoryChart;
