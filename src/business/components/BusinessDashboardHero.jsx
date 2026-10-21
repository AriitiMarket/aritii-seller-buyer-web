import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProductsShop } from '@/store/slices/productThunks';
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';
import { getAllEventsShop } from '@/store/slices/eventThunks';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { MdShoppingBag, MdInventory2, MdEventNote, MdWarningAmber, MdTrendingUp } from 'react-icons/md';
import { FiPackage, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import { SellerStatCard, SellerStatusBadge, SellerEmptyState, WalletCard } from '@/business/components';
import { SalesOverviewChart } from '@/business/shared/charts';
import ReturnsDashboardCard from '@/business/components/ReturnsDashboardCard';
import SellerMetricsDisplay from '@/business/components/SellerMetricsDisplay';
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus';

const DashboardHero = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { seller } = useSelector((state) => state.seller);
  const { shops, activeShop, activeShopId, hasMultipleShops, selectShop } = useBusinessShops();
  const { shopProducts } = useSelector((state) => state.products);
  const { ShopOrders } = useSelector((state) => state.order);
  const [timeFilter] = useState('7D');

  const shopId = activeShopId || seller?._id;
  const userId = seller?.id || seller?._id;

  useEffect(() => {
    // Only load data if we have a valid shopId and it's not a draft
    if (shopId && activeShop && activeShop.status !== 'DRAFT' && activeShop.status !== 'PENDING_APPROVAL') {
      dispatch(getAllProductsShop(shopId));
      // Pass user ID for orders, not shop ID - backend validates seller ownership
      if (userId) {
        dispatch(getAllOrdersOfShop(userId));
        dispatch(getAllEventsShop(userId));
      }
    }
  }, [dispatch, shopId, activeShop, userId]);

  // Move all useMemo hooks before the early return to avoid hooks order issues
  const totalRevenue = useMemo(() =>
    String(
      ShopOrders
        ?.filter((order) => normalizeStatus(order.status) === ORDER_STATUSES.DELIVERED)
        .reduce((acc, order) => acc + (Number(order.totalPrice) || 0), 0) || 0
    ),
    [ShopOrders]
  );



  // Show empty state if no active shop or shop is pending approval
  if (!activeShop || activeShop.status === 'PENDING_APPROVAL') {
    return (
      <div className="space-y-6">
        <div className="seller-section-header">
          <h1 className="seller-section-header-title">
            {activeShop?.status === 'PENDING_APPROVAL' ? 'Shop Pending Approval' : 'No Active Shop'}
          </h1>
          <p className="seller-section-header-desc">
            {activeShop?.status === 'PENDING_APPROVAL'
              ? 'Your shop is under review. You will be able to manage it once approved.'
              : 'You need to create a shop to start selling on Aritii Marketplace.'}
          </p>
        </div>
        <SellerEmptyState
          title={activeShop?.status === 'PENDING_APPROVAL' ? 'Shop Under Review' : 'Create Your First Shop'}
          description={
            activeShop?.status === 'PENDING_APPROVAL'
              ? 'Your shop application is being reviewed by our team. This usually takes 1-3 business days.'
              : 'Your seller account is approved! Create your first shop to start selling.'
          }
          action={
            activeShop?.status === 'PENDING_APPROVAL'
              ? { to: '/seller-registration/status', label: 'Check Application Status' }
              : { to: '/business/shops', label: 'Create Shop' }
          }
          icon="🏪"
        />
      </div>
    );
  }

  const totalOrders = ShopOrders?.length || 0;
  const totalProducts = shopProducts?.length || 0;

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

  const shopName = activeShop?.name || 'your shop';

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="seller-section-header">
        <div className="flex items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="seller-section-header-title">{getGreeting()}, {seller?.name || 'Seller'}</h1>
            <p className="seller-section-header-desc">
              Welcome back to your seller dashboard. Here's how {shopName} is performing.
            </p>
          </div>
          {hasMultipleShops && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-market-on-surface-variant mb-0">Active shop:</label>
              <select
                value={activeShopId || ''}
                onChange={(e) => selectShop(e.target.value)}
                className="seller-form-select w-auto"
              >
                {shops.map((s) => (
                  <option key={s._id} value={s._id}>{s.name || 'Unnamed shop'}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SellerStatCard
          title="Total Products"
          value={totalProducts}
          icon={MdShoppingBag}
          color="blue"
          link="/business/products"
        />
        <SellerStatCard
          title="Total Orders"
          value={totalOrders}
          icon={FiPackage}
          color="green"
          link="/business/orders"
        />
        <SellerStatCard
          title="Revenue"
          value={`ETB ${totalRevenue}`}
          change={totalOrders > 0 ? '+' : undefined}
          isPositive
          icon={FiDollarSign}
          color="green"
          link="/business/revenue"
        />
        <SellerStatCard
          title="Pending Orders"
          value={pendingOrders}
          change={cancelledOrders > 0 ? cancelledOrders : undefined}
          isPositive={cancelledOrders === 0}
          icon={FiAlertCircle}
          color={pendingOrders > 0 ? 'yellow' : 'green'}
          link="/business/orders?tab=new"
        />
      </div>

      {/* Wallet Card */}
      <div className="mt-6">
        <WalletCard
          sellerId={userId}
          onViewTransactions={() => navigate('/business/wallet/transactions')}
        />
      </div>

      {/* Alerts Row */}
      {(outOfStock > 0 || lowStockProducts.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {outOfStock > 0 && (
            <div className="seller-stat-card border-red-50 bg-red-50">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-red-100 text-red-600">
                  <MdWarningAmber size={20} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-red-600">
                  ▲ {outOfStock}
                </div>
              </div>
              <p className="seller-stat-card-value text-red-700 font-bold">{outOfStock}</p>
              <p className="seller-stat-card-label">Out of stock</p>
            </div>
          )}
          {lowStockProducts.length > 0 && (
            <div className="seller-stat-card border-amber-50 bg-amber-50">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-amber-100 text-amber-600">
                  <MdWarningAmber size={20} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-amber-600">
                  ▲ {lowStockProducts.length}
                </div>
              </div>
              <p className="seller-stat-card-value text-amber-700 font-bold">{lowStockProducts.length}</p>
              <p className="seller-stat-card-label">Low stock</p>
            </div>
          )}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="seller-section-header">
          <h3 className="text-lg font-bold text-market-on-surface mb-4">Sales Trend</h3>
          <div className="h-[240px]">
            <SalesOverviewChart timeFilter={timeFilter} />
          </div>
        </div>
        <div className="seller-section-header">
          <h3 className="text-lg font-bold text-market-on-surface mb-4">Order Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-market-surface-container-low rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-100" />
                <span className="text-market-on-surface font-medium">Pending</span>
              </div>
              <span className="font-semibold text-market-on-surface">{pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-market-surface-container-low rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-100" />
                <span className="text-market-on-surface font-medium">Completed</span>
              </div>
              <span className="font-semibold text-market-on-surface">{completedOrders}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-market-surface-container-low rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-100" />
                <span className="text-market-on-surface font-medium">Cancelled</span>
              </div>
              <span className="font-semibold text-market-on-surface">{cancelledOrders}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
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

      {/* Quick Actions */}
      <div className="seller-section-header">
        <h3 className="text-lg font-bold text-market-on-surface mb-4">Phase 1 Operational Status</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-[#1a1f2a] p-4 rounded-lg border border-market-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <p className="text-xs font-medium text-market-on-surface-variant">Hold Orders</p>
            </div>
            <p className="text-2xl font-bold text-market-on-surface">—</p>
            <p className="text-xs text-market-on-surface-variant mt-1">View orders on hold</p>
          </div>
          <div className="bg-white dark:bg-[#1a1f2a] p-4 rounded-lg border border-market-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <p className="text-xs font-medium text-market-on-surface-variant">Priority Orders</p>
            </div>
            <p className="text-2xl font-bold text-market-on-surface">—</p>
            <p className="text-xs text-market-on-surface-variant mt-1">High priority orders</p>
          </div>
          <div className="bg-white dark:bg-[#1a1f2a] p-4 rounded-lg border border-market-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <p className="text-xs font-medium text-market-on-surface-variant">SLA Breaches</p>
            </div>
            <p className="text-2xl font-bold text-market-on-surface">—</p>
            <p className="text-xs text-market-on-surface-variant mt-1">Orders missing deadline</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="seller-section-header">
        <h3 className="text-lg font-bold text-market-on-surface mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/business/products/create"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-market-border bg-white dark:bg-[#1a1f2a] text-center transition-colors hover:border-market-primary hover:bg-market-surface-container-low"
          >
            <MdInventory2 size={24} className="text-market-primary mb-1" />
            <span className="text-sm font-medium text-market-on-surface">Add Product</span>
          </a>
          <a
            href="/business/orders"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-market-border bg-white dark:bg-[#1a1f2a] text-center transition-colors hover:border-market-primary hover:bg-market-surface-container-low"
          >
            <FiPackage size={24} className="text-market-primary mb-1" />
            <span className="text-sm font-medium text-market-on-surface">View Orders</span>
          </a>
          <a
            href="/business/promotions"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-market-border bg-white dark:bg-[#1a1f2a] text-center transition-colors hover:border-market-primary hover:bg-market-surface-container-low"
          >
            <MdEventNote size={24} className="text-market-primary mb-1" />
            <span className="text-sm font-medium text-market-on-surface">Create Promotion</span>
          </a>
          <a
            href="/business/analytics"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-market-border bg-white dark:bg-[#1a1f2a] text-center transition-colors hover:border-market-primary hover:bg-market-surface-container-low"
          >
            <MdTrendingUp size={24} className="text-market-primary mb-1" />
            <span className="text-sm font-medium text-market-on-surface">View Analytics</span>
          </a>
        </div>
      </div>

      {/* FIX #13: Seller Metrics Display */}
      <div className="seller-section">
        <h3 className="seller-section-title">Performance Metrics</h3>
        <SellerMetricsDisplay />
      </div>

      {/* FIX #15: Returns Dashboard Card */}
      <div className="seller-section">
        <ReturnsDashboardCard onNavigate={navigate} />
      </div>
    </div>
  );
};

export default DashboardHero;
