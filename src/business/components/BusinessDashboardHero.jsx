import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsShop } from '@/store/slices/productThunks';
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';
import { getAllEventsShop } from '@/store/slices/eventThunks';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { MdShoppingBag, MdInventory2, MdEventNote, MdTrendingUp, MdStorefront, MdWarningAmber } from "react-icons/md";
import { FiPackage, FiDollarSign, FiUsers } from "react-icons/fi";
import { KPICard, StatusRow, StatusBadge, QuickActionButton } from '@/business/pages/Dashboard/components';
import { SalesOverviewChart } from '@/business/shared/charts';
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus';

const DashboardHero = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { seller } = useSelector((state) => state.seller);
  const { shops, activeShop, activeShopId, hasMultipleShops, selectShop } = useBusinessShops();
  const { shopProducts } = useSelector((state) => state.products);
  const { ShopOrders } = useSelector((state) => state.order);
  const { events } = useSelector((state) => state.events);
  const [timeFilter, setTimeFilter] = useState('7D');

  const shopId = activeShopId || seller?._id;

  useEffect(() => {
    if (shopId) {
      dispatch(getAllProductsShop(shopId));
      dispatch(getAllOrdersOfShop(shopId));
      dispatch(getAllEventsShop(shopId));
    }
  }, [dispatch, shopId]);

  const isSuspendedShop =
    activeShop?.status === 'SUSPENDED' || activeShop?.status === 'INACTIVE' || activeShop?.status === 'PENDING_APPROVAL';

  const totalRevenue = String(
    ShopOrders
      ?.filter((order) => normalizeStatus(order.status) === ORDER_STATUSES.DELIVERED)
      .reduce((acc, order) => acc + (Number(order.totalPrice) || 0), 0) || 0
  );

  const totalOrders = ShopOrders?.length || 0;
  const totalProducts = shopProducts?.length || 0;
  const totalEvents = events?.length || 0;

  const uniqueCustomers = new Set(ShopOrders?.map(o => o.userId || o.user?._id || o.buyerId).filter(Boolean)).size;
  const pendingOrders = ShopOrders?.filter(o => normalizeStatus(o.status) === ORDER_STATUSES.PROCESSING).length || 0;
  const completedOrders = ShopOrders?.filter(o => normalizeStatus(o.status) === ORDER_STATUSES.DELIVERED).length || 0;
  const cancelledOrders = ShopOrders?.filter(o => normalizeStatus(o.status) === ORDER_STATUSES.CANCELLED).length || 0;
  const outOfStock = shopProducts?.filter(p => Number(p.stock ?? 0) <= 0).length || 0;
  const lowStockProducts = shopProducts?.filter(p => {
    const a = Math.max(0, Number(p.stock ?? 0) - Number(p.reserved ?? 0));
    return a > 0 && a <= 5;
  }) || [];

  const recentOrders = ShopOrders ? [...ShopOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5) : [];

  const customerLabel = (order) =>
    order.user?.name ||
    order.shippingAddress?.name ||
    order.user?.email ||
    (order.userId ? `#${String(order.userId).slice(-6)}` : 'Customer');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const topProducts = [...(shopProducts || [])]
    .sort((a, b) => (b.sold_out || 0) - (a.sold_out || 0))
    .slice(0, 5);

  const shopName = activeShop?.name || 'your store';

  return (
    <div className="w-full space-y-6">

      {/* Welcome Header + shop context */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary-dark mb-1 flex items-center gap-1.5">
              <MdStorefront size={14} />
              {shopName}
              {activeShop?.status ? (
                <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  activeShop.status === 'ACTIVE' || activeShop.status === 'APPROVED'
                    ? 'bg-green-50 text-green-700'
                    : activeShop.status === 'SUSPENDED'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-700'
                }`}>
                  {activeShop.status === 'PENDING_APPROVAL' ? 'Pending approval' : activeShop.status}
                </span>
              ) : null}
            </p>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {getGreeting()}, {seller?.name || 'Seller'}
            </h1>
            <p className="text-sm text-gray-600">
              Here's what's happening with {shopName} today.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {hasMultipleShops && (
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Shop:</span>
                <select
                  value={activeShopId || ''}
                  onChange={(e) => selectShop(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-brand-primary focus:outline-none"
                  aria-label="Select active shop"
                >
                  {shops.map((s) => (
                    <option key={s._id} value={s._id}>{s.name || 'Unnamed shop'}</option>
                  ))}
                </select>
              </label>
            )}
            <Link
              to="/business/products/create"
              className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-dark transition flex items-center gap-2"
            >
              <MdShoppingBag size={18} />
              Add Product
            </Link>
          </div>
        </div>
      </div>

      {isSuspendedShop && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <MdWarningAmber className="mt-0.5 flex-shrink-0" size={18} />
          <div>
            <p className="font-semibold">
              {activeShop?.status === 'PENDING_APPROVAL'
                ? 'This shop is pending approval'
                : 'This shop is not currently active'}
            </p>
            <p className="mt-0.5 text-amber-700">
              Some actions may be limited until an admin reviews or reactivates it.{' '}
              <Link to="/business/shops" className="font-medium underline">Manage shops</Link>
            </p>
          </div>
        </div>
      )}

      {lowStockProducts.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex flex-wrap items-start gap-2">
          <MdWarningAmber className="mt-0.5 flex-shrink-0" size={18} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              {lowStockProducts.length} product{lowStockProducts.length === 1 ? '' : 's'} running low on stock
            </p>
            <p className="mt-0.5 text-red-700 truncate">
              {lowStockProducts.slice(0, 4).map(p => p.name).join(', ')}
              {lowStockProducts.length > 4 ? ` +${lowStockProducts.length - 4} more` : ''}
            </p>
          </div>
          <Link
            to="/business/inventory"
            className="font-semibold underline whitespace-nowrap text-red-900"
          >
            Restock
          </Link>
        </div>
      )}

      {outOfStock > 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 flex items-center justify-between gap-3">
          <span>
            <strong>{outOfStock}</strong> product{outOfStock === 1 ? '' : 's'} out of stock
          </span>
          <Link to="/business/inventory" className="font-semibold text-brand-primary-dark hover:underline">
            Manage inventory
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Revenue"
          value={`ETB ${Number(totalRevenue).toLocaleString()}`}
          icon={FiDollarSign}
          color="green"
          link="/business/revenue"
        />
        <KPICard
          title="Orders"
          value={totalOrders}
          icon={FiPackage}
          color="blue"
          link="/business/orders"
        />
        <KPICard
          title="Products"
          value={totalProducts}
          icon={MdInventory2}
          color="yellow"
          link="/business/products"
        />
        <KPICard
          title="Customers"
          value={uniqueCustomers}
          icon={FiUsers}
          color="purple"
          link="/business/customers"
        />
      </div>

      {/* Sales Overview Chart */}
      <SalesOverviewChart timeFilter={timeFilter} setTimeFilter={setTimeFilter} ShopOrders={ShopOrders} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
            <Link to="/business/products" className="text-sm text-brand-primary-dark hover:text-brand-primary font-medium">
              View all
            </Link>
          </div>
          {topProducts.length === 0 ? (
            <div className="text-center py-8">
              <MdInventory2 className="text-4xl text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No products yet</p>
              <Link
                to="/business/products/create"
                className="mt-3 inline-block px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold"
              >
                Add your first product
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="w-10 h-10 bg-brand-primary-light rounded-lg flex items-center justify-center text-brand-primary-dark font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sold_out || 0} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ETB {Number(product.discountPrice || 0).toLocaleString()}
                    </p>
                    <p className={`text-xs ${(Number(product.stock ?? 0) <= 5) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                      {product.stock} in stock
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
            <Link to="/business/orders" className="text-sm text-brand-primary-dark hover:text-brand-primary font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            <StatusRow label="Completed" count={completedOrders} color="green" />
            <StatusRow label="Processing" count={pendingOrders} color="blue" />
            <StatusRow label="Cancelled" count={cancelledOrders} color="red" />
          </div>
          {totalEvents > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <Link to="/business/events" className="text-sm text-brand-primary-dark hover:text-brand-primary font-medium flex items-center gap-1.5">
                <MdEventNote size={16} /> {totalEvents} active event{totalEvents === 1 ? '' : 's'}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/business/orders" className="text-sm text-brand-primary-dark hover:text-brand-primary font-medium">
            View all orders
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-10">
            <FiPackage className="text-5xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 text-sm mb-2">You have no orders yet.</p>
            <p className="text-gray-500 text-xs">Share your shop link to start receiving orders.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  <th className="pb-3 px-2">Order ID</th>
                  <th className="pb-3 px-2">Customer</th>
                  <th className="pb-3 px-2">Items</th>
                  <th className="pb-3 px-2">Amount</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-2">
                      <Link to={`/business/orders/${order._id}`} className="font-semibold text-gray-900 hover:text-brand-primary-dark">
                        #{order._id?.slice(-8)}
                      </Link>
                    </td>
                    <td className="py-3 px-2 text-gray-700">
                      {customerLabel(order)}
                    </td>
                    <td className="py-3 px-2 text-gray-700">
                      {order.cart?.length ?? 0} item{(order.cart?.length ?? 0) !== 1 ? 's' : ''}
                    </td>
                    <td className="py-3 px-2 font-semibold text-gray-900">
                      ETB {Number(order.totalPrice || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-2">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3 px-2 text-gray-500 text-sm">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton to="/business/products/create" label="Add Product" icon={MdInventory2} color="green" />
          <QuickActionButton to="/business/orders" label="View Orders" icon={FiPackage} color="blue" />
          <QuickActionButton to="/business/promotions" label="Create Promotion" icon={MdEventNote} color="purple" />
          <QuickActionButton to="/business/analytics" label="View Analytics" icon={MdTrendingUp} color="yellow" />
        </div>
      </div>

    </div>
  );
};

export default DashboardHero;
