import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProduct } from '@/store/slices/productThunks'
import { AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";
import Loader from '@/components/common/Loading';
import { toast } from 'react-toastify';
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';  
import { FiShoppingCart, FiDollarSign, FiCalendar, FiUser } from 'react-icons/fi';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { StatusBadge } from '@/business/pages/Dashboard/components';
import orderService from '@/business/services/orderService';
import { ORDER_STATUSES, normalizeStatus } from '@/shared/utils/orderStatus';
import { getDeliveryStatus } from '@/shared/utils/deliveryStatus';


const customerName = (order) =>
  order.user?.name ||
  order.shippingAddress?.name ||
  order.user?.email ||
  (order.userId ? `#${String(order.userId).slice(-6)}` : 'Unknown');

const AllOrdersOfASingleShop = () => {

 const { ShopOrders=[], isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { shops, activeShop, activeShopId, hasMultipleShops, selectShop } = useBusinessShops();

  const dispatch = useDispatch();

  const shopId = activeShopId || seller?._id;

  useEffect(() => {
  if (shopId) {
    dispatch(getAllOrdersOfShop(shopId));
  }
}, [dispatch, shopId]);

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [acceptingId, setAcceptingId] = useState(null);

  // Seller accepts an order: Processing -> Confirmed. This is the ONLY legal
  // "accept" transition, and it is what unlocks Shipped/In Transit/Delivered.
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

  // Statuses are canonical (Processing/Confirmed/Shipped/In Transit/...) — the
  // old tab checks compared lowercase legacy values and never matched, so every
  // tab except "All" showed 0 orders. Legacy rows ('PENDING'/'CONFIRMED') are
  // normalized first.
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

  const filteredOrders = ShopOrders?.filter((order) => {
    const matchesTab = matchesTabStatus(order.status, activeTab);
    const matchesSearch = !searchTerm || order._id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  }) || [];

  /**
   * The shipment state of a row, from the ORDER ↔ DELIVERY bridge. The backend
   * attaches `deliveryStatus` to every order in this list (one batched lookup),
   * so the column costs no extra request. Orders that were never handed to a
   * courier have `null` — that is a real state, not a missing value.
   */
  const renderDelivery = (order) => {
    if (!order.deliveryStatus) {
      return <span className="text-xs text-gray-400">Not handed over</span>;
    }
    const { label, tone } = getDeliveryStatus(order.deliveryStatus);
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${tone}`}>
        {label}
      </span>
    );
  };

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'new', label: 'Needs Action' },
    { id: 'confirmed', label: 'Accepted' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'refund', label: 'Refunds' },
  ].map((t) => ({
    ...t,
    count: (ShopOrders || []).filter((o) => matchesTabStatus(o.status, t.id)).length,
  }));



    
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary-dark mb-1">
                  {activeShop?.name || 'Your store'}
                </p>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Orders</h1>
                <p className="text-sm text-gray-600">Manage and track your orders</p>
              </div>
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
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                      activeTab === tab.id
                        ? 'border-brand-primary text-brand-primary-dark'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                </div>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <FiShoppingCart className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">No orders found</p>
                <p className="text-gray-500 text-sm">Orders will appear here once customers place them</p>
              </div>
            ) : (
              <>
                {/* Desktop: table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Items</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Delivery</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm text-gray-900">#{order._id.slice(-8)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <FiUser className="text-gray-400" size={16} />
                              <span className="text-gray-700">{customerName(order)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <FiCalendar size={16} />
                              <span className="text-sm">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {order.cart?.length || 0} items
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <FiDollarSign className="text-gray-400" size={16} />
                              <span className="font-semibold text-gray-900">
                                {Number(order.totalPrice || 0).toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-6 py-4">{renderDelivery(order)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {normalizeStatus(order.status) === ORDER_STATUSES.PROCESSING && (
                                <button
                                  onClick={() => handleAccept(order)}
                                  disabled={acceptingId === order._id}
                                  className="px-3 py-1.5 text-xs font-semibold text-white bg-brand-primary-dark rounded-lg hover:opacity-90 disabled:opacity-50 transition"
                                  title="Accept this order"
                                >
                                  {acceptingId === order._id ? 'Accepting…' : 'Accept'}
                                </button>
                              )}
                              <Link
                                to={`/business/orders/${order._id}`}
                                className="p-2 text-gray-500 hover:text-brand-primary-dark hover:bg-brand-primary-light rounded-lg transition"
                                title="View Order"
                              >
                                <AiOutlineEye size={18} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: stacked section cards — no horizontal scroll */}
                <div className="md:hidden divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <div key={order._id} className="p-4 space-y-3">
                      {/* Section: id + status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-mono text-sm font-semibold text-gray-900">#{order._id.slice(-8)}</p>
                          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <FiCalendar size={12} />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>

                      {/* Section: details */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                          <p className="text-xs text-gray-400">Customer</p>
                          <p className="text-gray-900 truncate">{customerName(order)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Items</p>
                          <p className="text-gray-900">{order.cart?.length || 0} items</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Total</p>
                          <p className="font-semibold text-gray-900">
                            {Number(order.totalPrice || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Delivery</p>
                          <div className="mt-0.5">{renderDelivery(order)}</div>
                        </div>
                      </div>

                      {/* Section: actions */}
                      <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
                        {normalizeStatus(order.status) === ORDER_STATUSES.PROCESSING && (
                          <button
                            onClick={() => handleAccept(order)}
                            disabled={acceptingId === order._id}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-brand-primary-dark rounded-lg hover:opacity-90 disabled:opacity-50 transition"
                          >
                            {acceptingId === order._id ? 'Accepting…' : 'Accept order'}
                          </button>
                        )}
                        <Link
                          to={`/business/orders/${order._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-primary-dark bg-brand-primary-light rounded-lg hover:opacity-90 transition"
                        >
                          <AiOutlineEye size={16} />
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>Showing {filteredOrders.length} of {ShopOrders?.length || 0} orders</p>
          </div>
        </div>
      )}
    </>
  )
}

export default AllOrdersOfASingleShop