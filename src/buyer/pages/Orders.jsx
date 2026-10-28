import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { getAllOrdersOfUser, cancelOrder } from '@/store/slices/orderThunks'
import { ProductImage } from '@/components/common/ImageWithFallback'
import { MdShoppingBag, MdSearch, MdSwapVert } from 'react-icons/md'
import { AiOutlineClose } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { getOrderStatus, isOrderDelivered, isOrderCancelled, isOrderInProgress, isOrderTrackable } from '@/buyer/utils/orderUtils'
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus'

// Aritii Marketplace Theme Colors
const ARITII_AMBER = '#febd69'
const ARITII_AMBER_HOVER = '#f3a847'
const ARITII_DARK = '#131921'

const ORDER_FILTERS = [
  { key: 'all', label: 'All Orders' },
  { key: 'in_progress', label: 'Pending' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
]

const SORT_OPTIONS = [
  { key: 'latest', label: 'Latest', fn: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
  { key: 'oldest', label: 'Oldest', fn: (a, b) => new Date(a.createdAt) - new Date(b.createdAt) },
  { key: 'by_status', label: 'By Status', fn: (a, b) => String(a.orderStatus || '').localeCompare(String(b.orderStatus || '')) },
]

const EMPTY_ORDERS = Object.freeze([])

const BuyerOrdersPage = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user?.user)
  const userId = user?.id || user?._id
  const buyerOrders = useSelector((state) => state.order?.orders ?? EMPTY_ORDERS)
  const loading = useSelector((state) => state.order?.buyerOrdersLoading || false)
  const error = useSelector((state) => state.order?.error || null)
  
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest')
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
        const items = (o.cart || o.products || o.items || [])
        const names = items.map(i => (i.name || '').toLowerCase()).join(' ')
        return id.includes(q) || names.includes(q)
      })
    }

    const sortFn = SORT_OPTIONS.find(s => s.key === sortBy)?.fn || SORT_OPTIONS[0].fn
    result.sort(sortFn)

    return result
  }, [buyerOrders, activeFilter, searchQuery, sortBy])

  const handleCancelOrder = async (orderId) => {
    if (!cancelReason.trim()) { alert('Please provide a reason'); return }
    setCancelingId(orderId)
    try {
      await dispatch(cancelOrder(orderId, cancelReason))
      setShowCancelReason(null)
      setCancelReason('')
      toast.success('Order cancelled successfully')
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to cancel order'
      toast.error(msg)
    } finally {
      setCancelingId(null)
    }
  }

  const getStatusBadge = (status) => {
    const s = String(normalizeStatus(status) || '').toLowerCase()
    const config = {
      pending: { bg: '#FEF3C7', text: '#92400E', icon: '⏳' },
      processing: { bg: '#DBEAFE', text: '#1E40AF', icon: '⚙️' },
      confirmed: { bg: '#DBEAFE', text: '#1E40AF', icon: '✅' },
      shipped: { bg: '#E9D5FF', text: '#6B21A8', icon: '🚚' },
      'in transit': { bg: '#E9D5FF', text: '#6B21A8', icon: '🚚' },
      delivered: { bg: '#DCFCE7', text: '#15803D', icon: '✅' },
      cancelled: { bg: '#FEE2E2', text: '#991B1B', icon: '❌' },
      completed: { bg: '#DCFCE7', text: '#15803D', icon: '✅' },
      failed: { bg: '#F3F4F6', text: '#374151', icon: '⚠️' },
      'refund requested': { bg: '#FED7AA', text: '#92400E', icon: '↩️' },
      'refund approved': { bg: '#DBEAFE', text: '#1E40AF', icon: '↩️' },
      'refund success': { bg: '#DCFCE7', text: '#15803D', icon: '↩️' },
      'refund rejected': { bg: '#FEE2E2', text: '#991B1B', icon: '⛔' },
    }
    return config[s] || { bg: '#F3F4F6', text: '#374151', icon: '📦' }
  }

  return (
    <div className="space-y-6 px-4 md:px-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold" style={{ color: ARITII_DARK }}>
          Your Orders
        </h1>
        <p className="text-sm text-market-on-surface-variant mt-2">
          Track purchases, manage returns, and reorder favorites
        </p>
      </div>

      {/* Search + Filters + Sort */}
      <div className="space-y-4">
        {/* Filter Tabs - Full Width Mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {ORDER_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2.5 rounded-full text-sm font-semibold transition border whitespace-nowrap h-11 flex items-center justify-center ${
                activeFilter === f.key
                  ? 'border-[#131921] bg-[#131921] text-white shadow-sm'
                  : 'bg-white text-market-on-surface-variant border-market-border hover:border-[#131921]'
              }`}
            >
              {f.label} <span className="ml-1 opacity-80">({filterCounts[f.key]})</span>
            </button>
          ))}
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search - Full width mobile */}
          <div className="relative flex-1">
            <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Order ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-market-border rounded-xl text-sm focus:outline-none focus:ring-2 transition h-11"
              style={{ '--tw-ring-color': ARITII_AMBER }}
            />
          </div>

          {/* Sort Dropdown - Full width mobile */}
          <div className="relative flex-1 sm:flex-none sm:w-40">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-market-border rounded-xl text-sm focus:outline-none focus:ring-2 appearance-none pr-10 cursor-pointer h-11 transition"
              style={{ '--tw-ring-color': ARITII_AMBER }}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
            <MdSwapVert className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders Grid - Full width cards mobile */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 mx-auto" style={{ borderTopColor: ARITII_AMBER }} />
          <p className="text-market-on-surface-variant text-sm mt-6">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-white rounded-lg border border-market-border p-6">
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => userId && dispatch(getAllOrdersOfUser(userId))}
            className="px-5 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] border border-[#a88734] rounded-lg text-sm font-bold transition shadow-sm"
          >
            Try Again
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-market-border p-6">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MdShoppingBag className="text-3xl text-gray-300" />
          </div>
          <p className="text-market-on-surface font-medium mb-1 text-lg">
            {searchQuery ? 'No orders match your search' : activeFilter !== 'all' ? 'No orders in this category' : 'No orders yet'}
          </p>
          <p className="text-market-on-surface-variant text-sm mb-6">
            {searchQuery ? 'Try different keywords' : 'Start shopping to see your orders here'}
          </p>
          {!searchQuery && (
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] border border-[#a88734] rounded-lg text-sm font-bold transition shadow-sm"
            >
              Start Shopping
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          {filteredOrders.map((order) => {
            const items = order.cart || order.products || order.items || []
            const statusConfig = getOrderStatus(order.orderStatus || order.status)
            const orderIdShort = order._id?.slice?.(-8)?.toUpperCase()
            const estimatedDelivery = order.estimatedDeliveryDate
              ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
              : 'TBD'
            const statusBadge = getStatusBadge(order.orderStatus || order.status)

            return (
              <div
                key={order._id}
                className="bg-white rounded-lg border border-market-border overflow-hidden hover:shadow-md transition-all"
              >
                {/* Order Header */}
                <div className="px-4 py-4 md:px-6 md:py-5 border-b border-market-border" style={{ backgroundColor: '#F5F5F5' }}>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-market-on-surface-variant uppercase tracking-wide">ORDER ID</p>
                      <p className="text-lg font-bold" style={{ color: ARITII_DARK }}>#{orderIdShort}</p>
                    </div>
                    <div
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0"
                      style={{ backgroundColor: statusBadge.bg, color: statusBadge.text }}
                    >
                      {statusBadge.icon} {statusConfig.label}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-market-on-surface-variant font-medium">Order Placed</p>
                      <p className="font-semibold text-market-on-surface mt-0.5">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-market-on-surface-variant font-medium">Estimate Delivery</p>
                      <p className="font-semibold text-market-on-surface mt-0.5">{estimatedDelivery}</p>
                    </div>
                    <div>
                      <p className="text-market-on-surface-variant font-medium">Total</p>
                      <p className="font-bold text-[#b12704]">
                        ETB {Number(order.totalPrice ?? order.total ?? order.amount ?? 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-4 py-4 md:px-6 border-b border-market-border">
                  {items.length === 0 ? (
                    <p className="text-sm text-market-on-surface-variant">No items in this order</p>
                  ) : (
                    <div className="space-y-3">
                      {items.slice(0, 2).map((item, idx) => {
                        const qty = item.quantity ?? item.qty ?? 1
                        return (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-16 h-16 md:w-18 md:h-18 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <ProductImage data={item} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-market-on-surface line-clamp-2">
                                {item.name}
                              </p>
                              {qty > 1 && (
                                <p className="text-xs text-market-on-surface-variant mt-0.5">Qty: {qty}</p>
                              )}
                              <p className="text-sm font-bold mt-1 text-[#b12704]">
                                ETB {Number(item.discountPrice || item.price || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                      {items.length > 2 && (
                        <div className="p-3 rounded-lg bg-[#febd69]/15">
                          <p className="text-xs font-semibold text-[#131921]">
                            +{items.length - 2} more item{items.length - 2 > 1 ? 's' : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Actions - Stacked buttons for mobile */}
                <div className="px-4 py-4 md:px-6 space-y-2.5">
                  {isOrderTrackable(order.orderStatus || order.status) && (
                    <Link
                      to={`/user/track/order/${order._id}`}
                      className="w-full inline-flex items-center justify-center h-12 px-4 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] border border-[#a88734] rounded-lg text-sm font-bold shadow-sm transition"
                    >
                      Track Package
                    </Link>
                  )}
                  <Link
                    to={`/user/order/${order._id}`}
                    className="w-full inline-flex items-center justify-center h-12 px-4 border border-[#d5d9d9] hover:bg-gray-50 text-[#0f1111] rounded-lg text-sm font-semibold shadow-sm transition"
                  >
                    View Details
                  </Link>
                  <div className="flex gap-2 pt-1">
                    {isCancellable(order.orderStatus || order.status) && (
                      <button
                        onClick={() => setShowCancelReason(order._id)}
                        disabled={cancelingId === order._id}
                        className="flex-1 h-11 px-3 border-2 border-red-300 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                    {normalizeStatus(order.orderStatus || order.status) === ORDER_STATUSES.DELIVERED && (
                      <button className="flex-1 h-11 px-3 border border-market-border text-market-on-surface rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
                        Buy Again
                      </button>
                    )}
                  </div>
                </div>

                {/* Return/Refund Link */}
                {normalizeStatus(order.orderStatus || order.status) === ORDER_STATUSES.DELIVERED && (
                  <div className="px-4 py-3 md:px-6 border-t border-market-border bg-[#febd69]/10">
                    <Link
                      to={`/user/order/${order._id}#refund`}
                      className="text-sm font-semibold text-[#007185] hover:text-[#c7511f] hover:underline"
                    >
                      Return or refund items →
                    </Link>
                  </div>
                )}
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
              <h3 className="text-lg font-bold" style={{ color: ARITII_DARK }}>
                Cancel Order
              </h3>
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
              className="w-full border border-market-border rounded-lg p-3 text-sm mb-4 focus:outline-none resize-none"
              style={{ '--tw-ring-color': ARITII_AMBER }}
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowCancelReason(null); setCancelReason('') }}
                className="flex-1 h-11 px-4 border border-market-border text-market-on-surface rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Keep Order
              </button>
              <button
                onClick={() => handleCancelOrder(showCancelReason)}
                disabled={!cancelReason.trim() || cancelingId}
                className="flex-1 h-11 px-4 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition"
                style={{ backgroundColor: '#ef4444' }}
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

const isCancellable = (status) => {
  const normalized = String(normalizeStatus(status) || '').toLowerCase()
  return normalized === 'pending' || normalized === 'processing' || normalized === 'confirmed'
}

export default BuyerOrdersPage
