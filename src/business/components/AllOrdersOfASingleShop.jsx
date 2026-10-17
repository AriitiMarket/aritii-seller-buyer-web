import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineEye, AiOutlineSearch } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Loader from '@/components/common/Loading';
import { toast } from 'react-toastify';
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';
import { FiShoppingCart, FiDollarSign, FiCalendar, FiUser } from 'react-icons/fi';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { SellerStatusBadge, SellerSearchAndFilters, SellerEmptyState, SellerDataTable } from '@/business/components';
import orderService from '@/business/services/orderService';
import { ORDER_STATUSES, normalizeStatus } from '@/shared/utils/orderStatus';

const customerName = (order) =>
  order.user?.name ||
  order.shippingAddress?.name ||
  order.user?.email ||
  (order.userId ? `#${String(order.userId).slice(-6)}` : 'Unknown');

const ORDER_TABS = [
  { key: 'all', label: 'All Orders' },
  { key: 'new', label: 'New Orders' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

const matchesTabStatus = (status, tab) => {
  const s = normalizeStatus(status) || '';
  if (tab === 'all') return true;
  if (tab === 'new') return s === ORDER_STATUSES.PROCESSING;
  if (tab === 'confirmed') return s === ORDER_STATUSES.CONFIRMED;
  if (tab === 'shipped') return s === ORDER_STATUSES.SHIPPED || s === ORDER_STATUSES.IN_TRANSIT;
  if (tab === 'delivered') return s === ORDER_STATUSES.DELIVERED;
  if (tab === 'cancelled') return s === ORDER_STATUSES.CANCELLED;
  if (tab === 'refund') return s.toLowerCase().includes('refund');
  return true;
};

const AllOrdersOfASingleShop = () => {
  const { ShopOrders = [], isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { shops, activeShop, activeShopId, hasMultipleShops, selectShop } = useBusinessShops();

  const dispatch = useDispatch();
  const shopId = activeShopId || seller?._id;
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [acceptingId, setAcceptingId] = useState(null);

  useEffect(() => {
    if (shopId) {
      dispatch(getAllOrdersOfShop(shopId));
    }
  }, [dispatch, shopId]);

  const handleAccept = async (order) => {
    setAcceptingId(order._id);
    try {
      await orderService.updateOrderStatus(order._id, ORDER_STATUSES.CONFIRMED);
      toast.success('Order accepted');
      if (shopId) dispatch(getAllOrdersOfShop(shopId));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to accept order');
    } finally {
      setAcceptingId(null);
    }
  };

  const filteredOrders = ShopOrders?.filter((order) => {
    const matchesTab = matchesTabStatus(order.status, activeTab);
    const matchesSearch = !searchTerm || order._id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  }) || [];

  if (isLoading) return <Loader />;
  if (ShopOrders.length === 0 && !isLoading) {
    return (
      <SellerEmptyState
        title="No orders yet"
        description="Your orders will appear here once customers start buying from your shop."
        action={{ to: '/business/products', label: 'Manage Products' }}
        icon="📦"
      />
    );
  }

  const columns = [
    { key: 'id', label: 'Order ID', render: (o) => (
      <Link to={`/business/orders/${o._id}`} className="font-semibold text-market-on-surface hover:text-market-primary">
        #{o._id?.slice(-8)}
      </Link>
    )},
    { key: 'customer', label: 'Customer', render: (o) => customerName(o) },
    { key: 'items', label: 'Items', render: (o) => (
      <span className="text-market-on-surface">{o.cart?.length ?? 0} item{(o.cart?.length ?? 0) !== 1 ? 's' : ''}</span>
    )},
    { key: 'amount', label: 'Amount', render: (o) => (
      <span className="font-semibold text-market-on-surface">ETB {Number(o.totalPrice || 0).toLocaleString()}</span>
    )},
    { key: 'status', label: 'Status', render: (o) => <SellerStatusBadge status={o.status} /> },
    { key: 'date', label: 'Date', render: (o) => (
      <span className="text-market-on-surface-variant text-sm">
        {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}
      </span>
    )},
    { key: 'actions', label: 'Actions', render: (o) => (
      <div className="flex items-center gap-2">
        {normalizeStatus(o.status) === ORDER_STATUSES.PROCESSING && (
          <button
            onClick={() => handleAccept(o)}
            disabled={acceptingId === o._id}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-market-primary rounded-lg hover:bg-market-primary-hover disabled:opacity-50 transition"
          >
            {acceptingId === o._id ? 'Accepting…' : 'Accept order'}
          </button>
        )}
        <Link
          to={`/business/orders/${o._id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-market-primary bg-market-surface-container-low rounded-lg hover:bg-market-surface-container-high transition"
        >
          <AiOutlineEye size={16} />
          View
        </Link>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <SellerSearchAndFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={ORDER_TABS}
        onFilterChange={setActiveTab}
        activeFilter={activeTab}
        placeholder="Search orders…"
      />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-market-on-surface">Orders</h2>
          <p className="text-sm text-market-on-surface-variant">Manage orders for your shop</p>
        </div>
      </div>

      <SellerDataTable
        columns={columns}
        rows={filteredOrders}
        emptyMessage="No orders match your filters"
        emptyAction={{ to: '/business/orders', label: 'Reset filters' }}
      />

      <div className="flex items-center justify-between text-sm text-market-on-surface-variant">
        <p>Showing {filteredOrders.length} of {ShopOrders.length} orders</p>
      </div>
    </div>
  );
};

export default AllOrdersOfASingleShop;
