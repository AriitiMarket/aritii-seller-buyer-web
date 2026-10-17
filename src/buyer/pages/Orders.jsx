import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { getAllOrdersOfUser, cancelOrder } from '@/store/slices/orderThunks'
import { ProductImage } from '@/components/common/ImageWithFallback'
import { MdShoppingBag, MdSearch, MdLocalShipping } from 'react-icons/md'
import { AiOutlineClose } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { getOrderStatus, isOrderDelivered, isOrderCancelled, isOrderInProgress, isOrderCancellable, isOrderTrackable, formatPrice, formatDate } from '@/buyer/utils/orderUtils'
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus'
import { getDeliveryStatus } from '@/shared/utils/deliveryStatus'

const ORDER_FILTERS = [
  { key: 'all', label: 'All Orders' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
]

const BuyerOrdersPage = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user?.user)
  // Identity users carry `id` (UUID from the Identity Service); `_id` is the
  // Mongo-style fallback. Using only `_id` meant the fetch NEVER fired for
  // real accounts — the list stayed on "No orders yet" forever.
  const userId = user?.id || user?._id
  const buyerOrders = useSelector((state) => state.order?.orders || [])
  const loading = useSelector((state) => state.order?.buyerOrdersLoading || false)
  const error = useSelector((state) => state.order?.error || null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [cancelingId, setCancelingId] = useState(null)
  const [showCancelReason, setShowCancelReason] = useState(null)
  const [cancelReason, setCancelReason] = useState('')

  useEffect(() => {
    if (userId) dispatch(getAllOrdersOfUser(userId))
  }, [userId, dispatch])

  const filterCounts = useMemo(() => {
    const counts = { all: buyerOrders.length, in_progress: 0, delivered: 0, cancelled: 0 }
    buyerOrders.forEach(o => {
      const s = o.orderStatus || o.status || ''
      if (isOrderDelivered(s)) counts.delivered++
      else if (isOrderCancelled(s)) counts.cancelled++
      else counts.in_progress++
    })
    return counts
  }, [buyerOrders])

  const filteredOrders = useMemo(() => {
    let result = [...buyerOrders]

    if (activeFilter !== 'all') {
      result = result.filter(o => {
        const s = o.orderStatus || o.status || ''
        if (activeFilter === 'delivered') return isOrderDelivered(s)
        if (activeFilter === 'cancelled') return isOrderCancelled(s)
        if (activeFilter === 'in_progress') return isOrderInProgress(s)
        return true
      })
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(o => {
        const id = (o._id || '').toLowerCase()
        // Orders store line items on `cart` (products/items are legacy aliases)
        const items = (o.cart || o.products || o.items || [])
        const names = items.map(i => (i.name || '').toLowerCase()).join(' ')
        return id.includes(q) || names.includes(q)
      })
    }

    return result
  }, [buyerOrders, activeFilter, searchQuery])

  const handleCancelOrder = async (orderId) => {
    if (!cancelReason.trim()) { alert('Please provide a reason'); return }
    setCancelingId(orderId)
    try {
      await dispatch(cancelOrder(orderId, cancelReason))
      setShowCancelReason(null)
      setCancelReason('')
    } catch (err) {
      // The thunk rethrows on API failure — surface it instead of closing
      // the modal as if the cancel had succeeded.
      const msg = err?.response?.data?.message || err.message || 'Failed to cancel order'
      toast.error(msg)
    } finally {
      setCancelingId(null)
    }
  }

  const getStatusConfig = (status) => getOrderStatus(status)

  const isCancellable = (status) => isOrderCancellable(status)

  const isTrackable = (status) => isOrderTrackable(status)

  const getStatusBadge = (status) => {
    // Legacy rows store 'PENDING'/'CONFIRMED' — normalize before matching keys.
    const s = String(normalizeStatus(status) || '').toLowerCase()
    const config = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: '⏳' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: '⚙️' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: '✅' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', icon: '🚚' },
      'in transit': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', icon: '🚚' },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: '✅' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: '❌' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: '✅' },
      failed: { bg: 'bg-gray-100', text: 'text-market-on-surface', border: 'border-market-border', icon: '⚠️' },
      // Backend order state machine (orders/constants/orderStatuses.js)
      'refund requested': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: '↩️' },
      'refund approved': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: '↩️' },
      'refund success': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: '↩️' },
      'refund rejected': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: '⛔' },
    }
    return config[s] || { bg: 'bg-gray-100', text: 'text-market-on-surface', border: 'border-market-border', icon: '📦' }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-market-on-surface">My Orders</h1>
        <p className="text-sm text-market-on-surface-variant mt-1">Track purchases, review details, and order your favorites again.</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {ORDER_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition border ${
                activeFilter === f.key
                  ? 'bg-market-primary text-market-on-primary border-[#2162a1]'
                  : 'bg-white text-market-on-surface-variant border-market-border hover:border-market-border'
              }`}
            >
              {f.label} <span className="ml-1 opacity-80">{filterCounts[f.key]}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search your orders"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-market-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-market-secondary focus:border-transparent"
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2162a1] mx-auto"></div>
          <p className="text-market-on-surface-variant text-sm mt-4">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => userId && dispatch(getAllOrdersOfUser(userId))}
            className="px-5 py-2.5 bg-market-primary text-market-on-primary rounded text-sm font-semibold hover:bg-market-primary-hover"
          >
            Try Again
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-market-border">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MdShoppingBag className="text-3xl text-gray-300" />
          </div>
          <p className="text-market-on-surface-variant font-medium mb-1">
            {searchQuery ? 'No orders match your search' : activeFilter !== 'all' ? 'No orders in this category' : 'No orders yet'}
          </p>
          <p className="text-market-on-surface-variant text-sm mb-5">
            {searchQuery ? 'Try different keywords' : 'Start shopping to see your orders here'}
          </p>
          {!searchQuery && (
            <Link
              to="/my-dashboard/marketplace"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-market-primary text-market-on-primary rounded text-sm font-semibold hover:bg-market-primary-hover transition"
            >
              Start Shopping
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const items = order.cart || order.products || order.items || []
            const firstItem = items[0]
            const statusConfig = getStatusConfig(order.orderStatus || order.status)
            const orderIdShort = order._id?.slice?.(-8)?.toUpperCase()

            return (
              <div
                key={order._id}
                className="bg-white rounded-lg border border-market-border overflow-hidden hover:shadow-md transition-all"
              >
                {/* Order Header — 3-column info bar */}
                <div className="bg-market-surface-dim px-5 py-3 border-b border-market-border grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[11px] text-market-on-surface-variant">Order placed</p>
                    <p className="text-xs font-bold text-market-on-surface">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-market-on-surface-variant">Total</p>
                    <p className="text-xs font-bold text-market-on-surface">{Number(order.totalPrice || 0).toLocaleString()} ETB</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-market-on-surface-variant">Order</p>
                    <p className="text-xs font-bold text-market-secondary">#{orderIdShort}</p>
                  </div>
                </div>

                {/* Status row */}
                <div className="px-5 pt-3 flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(order.orderStatus || order.status).bg} ${getStatusBadge(order.orderStatus || order.status).text} ${getStatusBadge(order.orderStatus || order.status).border}`}>
                    <span>{getStatusBadge(order.orderStatus || order.status).icon}</span>
                    {statusConfig.label}
                  </span>
                  {/* Shipment progress comes from the ORDER ↔ DELIVERY bridge
                      (attached to every row by the backend). Absent means the
                      order was never handed to a courier — show nothing rather
                      than a fabricated state. */}
                  {order.deliveryStatus ? (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getDeliveryStatus(order.deliveryStatus).tone}`}>
                      <MdLocalShipping size={14} />
                      {getDeliveryStatus(order.deliveryStatus).label}
                    </span>
                  ) : null}
                </div>

                {/* Order Items */}
                <div className="p-5">
                  {items.length === 0 ? (
                    <p className="text-sm text-market-on-surface-variant">No items in this order</p>
                  ) : (
                    <div className="space-y-4">
                      {items.slice(0, 2).map((item, idx) => {
                        const qty = item.quantity ?? item.qty ?? 1
                        const lineTotal = Number(item.discountPrice || item.price || 0) * qty
                        // `shop` may be an embedded object OR a legacy string —
                        // never render an object as a React child (it crashes).
                        const shopName = typeof item.shop === 'string'
                          ? item.shop
                          : (item.shop?.name || item.shopName || '')
                        return (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                            <ProductImage data={item} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-market-on-surface line-clamp-1">
                              {item.name}{qty > 1 ? ` × ${qty}` : ''}
                            </p>
                            {shopName && (
                              <p className="text-xs text-market-on-surface-variant mt-0.5">Sold by {shopName}</p>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-market-on-surface shrink-0">
                            {lineTotal.toLocaleString()} ETB
                          </div>
                        </div>
                        )
                      })}
                      {items.length > 2 && (
                        <p className="text-xs text-market-on-surface-variant">+ {items.length - 2} more item{items.length - 2 > 1 ? 's' : ''}</p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons — pill style */}
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-market-border flex-wrap">
                    {isTrackable(order.orderStatus || order.status) && (
                      <Link
                        to={`/user/track/order/${order._id}`}
                        className="px-6 py-2 bg-market-primary text-market-on-primary rounded-full text-xs font-medium hover:bg-market-primary-hover active:bg-market-primary-pressed transition shadow-sm"
                      >
                        Track package
                      </Link>
                    )}
                    <Link
                      to={`/user/order/${order._id}`}
                      className="px-6 py-2 bg-market-primary text-market-on-primary rounded-full text-xs font-medium hover:bg-market-primary-hover active:bg-market-primary-pressed transition shadow-sm"
                    >
                      View order details
                    </Link>
                    {isCancellable(order.orderStatus || order.status) && (
                      <button
                        onClick={() => setShowCancelReason(order._id)}
                        disabled={cancelingId === order._id}
                        className="text-xs text-market-secondary hover:text-market-secondary-hover hover:underline transition disabled:opacity-50"
                      >
                        Cancel order
                      </button>
                    )}
                    {normalizeStatus(order.orderStatus || order.status) === ORDER_STATUSES.DELIVERED && (
                      <button className="px-6 py-2 bg-market-primary text-market-on-primary rounded-full text-xs font-medium hover:bg-market-primary-hover active:bg-market-primary-pressed transition shadow-sm">
                        Buy again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelReason && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-market-on-surface">Cancel Order</h3>
              <button
                onClick={() => { setShowCancelReason(null); setCancelReason('') }}
                className="p-1 rounded-lg hover:bg-gray-100 transition"
              >
                <AiOutlineClose size={20} className="text-market-on-surface-variant" />
              </button>
            </div>
            <p className="text-market-on-surface-variant text-sm mb-4">Please provide a reason for cancellation.</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Cancellation reason..."
              className="w-full border border-market-border rounded-xl p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-market-secondary focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowCancelReason(null); setCancelReason('') }}
                className="flex-1 px-4 py-2.5 border border-market-border text-market-on-surface rounded-xl font-semibold hover:bg-market-surface-dim transition"
              >
                Keep Order
              </button>
              <button
                onClick={() => handleCancelOrder(showCancelReason)}
                disabled={!cancelReason.trim() || cancelingId}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 transition"
              >
                {cancelingId ? 'Processing...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BuyerOrdersPage
