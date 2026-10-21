import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';
import api from '@/services/api';
import { toast } from 'react-toastify';
import {
  normalizeStatus,
  nextStatusesFor,
  isRefundStatus,
} from '@/shared/utils/orderStatus';
import { ProductImage } from '@/components/common/ImageWithFallback';
import { 
  SellerStatusBadge,
  OrderNotesTab,
  OrderHoldBadge,
  OrderPriorityBadge,
  OrderSLAStatus
} from '@/business/components';

const OrderDetails = () => {
  const { ShopOrders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller || {});
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [allocation, setAllocation] = useState(null);
  const [allocLoading, setAllocLoading] = useState(false);

  const { id } = useParams();
  // Scope orders to the seller's user UUID (identity ID), not a shop ObjectId,
  // so the backend's seller-ownership check (sellerId === req.user.id) passes.
  const sellerUserId = seller?.id || seller?._id;

  useEffect(() => {
    if (sellerUserId) dispatch(getAllOrdersOfShop(sellerUserId));
  }, [dispatch, sellerUserId]);

  // Seller-scoped financial allocation: this seller's row within the buyer order.
  // Backend enforces ownership — a seller can only ever read their own rows.
  const allocationSellerId = sellerUserId;

  // Fetch this seller's allocation for the displayed order. Idempotent and
  // scoped to the seller — never reveals another seller's financials.
  useEffect(() => {
    if (!id || !allocationSellerId) return;
    setAllocLoading(true);
    api
      .get(`/payment/seller-allocations/${allocationSellerId}`, { params: { orderId: id } })
      .then((res) => {
        const rows = res.data?.allocations || [];
        setAllocation(rows.find((a) => String(a.orderId) === String(id)) || null);
      })
      .catch((err) => {
        // Allocations are additive enrichment; never block the order view.
        console.warn("[OrderDetails] allocation lookup failed:", err.message);
        setAllocation(null);
      })
      .finally(() => setAllocLoading(false));
  }, [id, allocationSellerId]);

  const data = ShopOrders && ShopOrders.find((item) => item._id === id);
  const currentStatus = normalizeStatus(data?.status) || 'Processing';
  const isRefund = isRefundStatus(currentStatus);
  const nextStatuses = nextStatusesFor(currentStatus);

  const applyStatus = async (next) => {
    if (!next) {
      toast.error('Pick a status first');
      return;
    }
    setSubmitting(true);
    try {
      if (isRefund) {
        await api.put(`/order/order-refund-success/${id}`, { status: next });
      } else if (next === 'Confirmed') {
        await api.post(`/order/${id}/confirm`);
      } else {
        await api.patch(`/order/${id}/status`, { status: next });
      }
      toast.success(next === 'Confirmed' ? 'Order accepted!' : 'Order updated!');
      if (sellerUserId) dispatch(getAllOrdersOfShop(sellerUserId));
      setStatus('');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update order');
    } finally {
      setSubmitting(false);
    }
  };

  const orderUpdateHandler = (e) => {
    if (e?.preventDefault) e.preventDefault();
    applyStatus(status || nextStatuses[0]);
  };

  if (!data) {
    return (
      <div className="seller-shell-bg min-h-screen flex items-center justify-center">
        <div className="seller-empty-state">
          <span className="seller-empty-state-icon">📦</span>
          <h3 className="seller-empty-state-title">Order not found</h3>
          <p className="seller-empty-state-desc">The order you're looking for might be unavailable.</p>
          <Link to="/business/orders" className="seller-btn-primary">
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="seller-loading-state">Loading order…</div>;

  return (
    <div className="seller-shell-bg min-h-screen space-y-6">
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a222d] p-5 shadow-xs">
        <div className="flex items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link to="/business/orders" className="inline-flex items-center gap-1 text-sm text-market-primary hover:underline">
              ← Back to orders
            </Link>
            <h1 className="seller-section-header-title mt-2">Order #{data._id?.slice(-8)}</h1>
            <p className="text-sm text-market-on-surface-variant">
              {new Date(data.createdAt).toLocaleDateString()} · {customerName(data)}
            </p>
          </div>
          <SellerStatusBadge status={data.status} />
        </div>
      </div>

      {/* New Phase 1 Indicators */}
      <div className="max-w-3xl space-y-4">
        <OrderHoldBadge orderId={id} />
        <OrderPriorityBadge orderId={id} />
        <OrderSLAStatus orderId={id} />
      </div>

      <div className="max-w-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a222d] p-5 shadow-xs">
              <h3 className="text-lg font-bold text-market-on-surface mb-4">Order Items</h3>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {(data.cart || data.products || data.items || []).map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded overflow-hidden bg-market-surface-container-low shrink-0 border border-gray-200 dark:border-gray-700">
                      <ProductImage data={item} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-market-on-surface">{item.name}</p>
                      <p className="text-xs text-market-on-surface-variant">{item.sku || '—'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-market-on-surface">
                        {Number(item.discountPrice ?? item.price).toLocaleString()} ETB
                      </p>
                      <p className="text-xs text-market-on-surface-variant">Qty: {item.quantity ?? item.qty ?? 1}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 flex justify-end">
                <p className="font-bold text-market-on-surface">
                  Total: ETB {Number(data.totalPrice || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a222d] p-5 shadow-xs">
              <h3 className="text-lg font-bold text-market-on-surface mb-4">Order Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-market-surface-container-low rounded-lg border border-gray-100 dark:border-gray-800">
                  <span className="text-sm text-market-on-surface-variant">Current status</span>
                  <SellerStatusBadge status={data.status} />
                </div>
                {nextStatuses.length > 0 ? (
                  <div>
                    <label className="seller-form-label">Update to</label>
                    <select
                      value={status || nextStatuses[0]}
                      onChange={(e) => setStatus(e.target.value)}
                      className="seller-form-input"
                    >
                      {nextStatuses.map((option) => (
                        <option value={option} key={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p className="text-sm text-market-on-surface-variant">
                    This order has reached a final state — no further status changes allowed.
                  </p>
                )}
                <div className="flex gap-3 mt-4">
                  {currentStatus === 'Processing' && (
                    <button
                      onClick={() => applyStatus('Confirmed')}
                      disabled={submitting}
                      className="seller-btn-primary"
                    >
                      {submitting ? 'Accepting…' : 'Accept Order'}
                    </button>
                  )}
                  {nextStatuses.length > 0 && (
                    <button
                      onClick={orderUpdateHandler}
                      disabled={submitting}
                      className="seller-btn-secondary"
                    >
                      Update Status
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Seller payout — this seller's allocation within the buyer order. Never exposes
                 another seller's financials; backend enforces ownership per sellerId. */}
            {allocation || allocLoading ? (
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a222d] p-5 shadow-xs mt-6">
                <h3 className="text-lg font-bold text-market-on-surface mb-4">Seller Payout</h3>
                {allocLoading ? (
                  <p className="text-sm text-market-on-surface-variant">Calculating your share…</p>
                ) : allocation ? (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-market-border pb-2">
                      <span className="text-market-on-surface-variant">Gross subtotal</span>
                      <span className="font-medium text-market-on-surface">ETB {Number(allocation.grossSubtotal || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-market-border pb-2">
                      <span className="text-market-on-surface-variant">Shipping</span>
                      <span className="font-medium text-market-on-surface">ETB {Number(allocation.shippingFee || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-market-border pb-2">
                      <span className="text-market-on-surface-variant">Platform commission</span>
                      <span className="text-market-error">− ETB {Number(allocation.platformCommission || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-market-border pb-2">
                      <span className="text-market-on-surface-variant">Refunds / adjustments</span>
                      <span className="text-market-error">
                        − ETB {Number((allocation.refundAmount || 0) - (allocation.adjustmentAmount || 0)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-market-border pb-2">
                      <span className="font-semibold text-market-on-surface">Net payable</span>
                      <span className="font-bold text-market-on-surface">ETB {Number(allocation.netPayable || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-xs text-market-on-surface-variant">Settled</span>
                      <span className="text-xs font-semibold">
                        {Number(allocation.settledAmount || 0).toLocaleString()} ETB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-market-on-surface-variant">Pending</span>
                      <span className={`text-xs font-semibold ${Number(allocation.pendingAmount || 0) > 0 ? 'text-market-warning' : 'text-market-success'}`}>
                        {Number(allocation.pendingAmount || 0).toLocaleString()} ETB
                      </span>
                    </div>
                    <p className="text-xs text-market-on-surface-variant">
                      Status: {allocation.status}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-market-on-surface-variant">No payout record yet.</p>
                )}
              </div>
            ) : null}

            <div className="seller-form-section mt-6">
              <h3 className="text-lg font-bold text-market-on-surface mb-4">Customer Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 text-market-on-surface-variant">👤</span>
                  <div>
                    <p className="font-medium text-market-on-surface">{customerName(data)}</p>
                    <p className="text-xs text-market-on-surface-variant">{data.user?.email || data.shippingAddress?.email || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-10 text-market-on-surface-variant">📍</span>
                  <div>
                    <p className="font-medium text-market-on-surface">Shipping Address</p>
                    <p className="text-sm text-market-on-surface-variant">
                      {[data?.shippingAddress?.address1, data?.shippingAddress?.address2, data?.shippingAddress?.city, data?.shippingAddress?.country]
                        .filter(Boolean)
                        .join(', ')} || '—'
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-10 text-market-on-surface-variant">📞</span>
                  <p className="font-medium text-market-on-surface">{data?.user?.phoneNumber || data?.shippingAddress?.phone || '—'}</p>
                </div>
              </div>
            </div>

            {/* Order Notes - Phase 1 */}
            <OrderNotesTab orderId={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

const customerName = (order) =>
  order.user?.name ||
  order.shippingAddress?.name ||
  order.user?.email ||
  (order.userId ? `#${String(order.userId).slice(-6)}` : 'Customer');

export default OrderDetails;
