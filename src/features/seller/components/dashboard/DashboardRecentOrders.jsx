import React from 'react';
import { Link } from 'react-router-dom';
import { SellerStatusBadge, SellerEmptyState } from '@/features/seller/components';

export const DashboardRecentOrders = ({ recentOrders = [] }) => {
  const customerLabel = (order) =>
    order.user?.name ||
    order.shippingAddress?.name ||
    order.user?.email ||
    (order.userId ? `#${String(order.userId).slice(-6)}` : 'Customer');

  return (
    <div className="seller-section-header">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-market-on-surface">Recent Orders</h3>
        <Link to="/business/orders" className="text-sm text-market-primary hover:underline font-medium">
          View all orders
        </Link>
      </div>
      {recentOrders.length === 0 ? (
        <SellerEmptyState
          title="No orders yet"
          description="You have no orders yet. Share your shop link to start receiving orders."
          action={{ to: '/business/products/create', label: 'Add Product' }}
          icon="📦"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="seller-data-table">
            <thead>
              <tr>
                <th scope="col">Order ID</th>
                <th scope="col">Customer</th>
                <th scope="col">Items</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <Link to={`/business/orders/${order._id}`} className="font-semibold text-market-on-surface hover:text-market-primary">
                      #{order._id?.slice(-8)}
                    </Link>
                  </td>
                  <td className="text-market-on-surface">{customerLabel(order)}</td>
                  <td className="text-market-on-surface">
                    {order.cart?.length ?? 0} item{(order.cart?.length ?? 0) !== 1 ? 's' : ''}
                  </td>
                  <td className="font-semibold text-market-on-surface">
                    ETB {Number(order.totalPrice || 0).toLocaleString()}
                  </td>
                  <td>
                    <SellerStatusBadge status={order.status} />
                  </td>
                  <td className="text-market-on-surface-variant text-sm">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardRecentOrders;
