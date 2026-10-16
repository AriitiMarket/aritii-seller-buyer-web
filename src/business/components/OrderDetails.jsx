import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';
import api from '@/services/api';
import { toast } from 'react-toastify';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Link as RouterLink } from 'react-router-dom';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import {
  ALLOWED_TRANSITIONS,
  normalizeStatus,
  nextStatusesFor,
  isRefundStatus,
} from '@/shared/utils/orderStatus';
import OrderDeliveryCard from '@/shared/components/OrderDeliveryCard';
import { SellerStatusBadge } from '@/business/components';

const OrderDetails = () => {
  const { ShopOrders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller || {});
  const { activeShopId } = useBusinessShops();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { id } = useParams();
  // Scope orders to the active shop (multi-shop aware); fall back to the
  // seller's identity id so the backend's order.sellerId ownership check passes.
  const shopId = activeShopId || seller?._id;

  useEffect(() => {
    if (shopId) dispatch(getAllOrdersOfShop(shopId));
  }, [dispatch, shopId]);

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
      } else {
        await api.put(`/order/update-order-status/${id}`, { status: next });
      }
      toast.success(next === 'Confirmed' ? 'Order accepted!' : 'Order updated!');
      if (shopId) dispatch(getAllOrdersOfShop(shopId));
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
      <div className="seller-section-header">
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

      <div className="max-w-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="seller-form-section">
              <h3 className="text-lg font-bold text-market-on-surface mb-4">Order Items</h3>
              <div className="divide-y divide-market-border">
                {(data.cart || data.products || data.items || []).map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded overflow-hidden bg-market-surface-container-low shrink-0">
                      <img
                        src={Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : (item.image || '/assets/images/placeholders/product-placeholder.svg')}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
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
              <div className="border-t border-market-border pt-4 mt-4 flex justify-end">
                <p className="font-bold text-market-on-surface">
                  Total: ETB {Number(data.totalPrice || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="seller-form-section">
              <h3 className="text-lg font-bold text-market-on-surface mb-4">Order Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-market-surface-container-low rounded-lg">
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
