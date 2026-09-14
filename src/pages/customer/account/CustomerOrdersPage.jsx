import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { getAllOrdersOfUser, cancelOrder } from '../../../store/redux/actions/order'
import { MdShoppingBag, MdArrowForward } from 'react-icons/md'
import { BiPackage } from 'react-icons/bi'
import { AiOutlineClose } from 'react-icons/ai'

// Buyer Account: My Orders with modern card design
// Shows ONLY the logged-in buyer's own orders
const CustomerOrdersPage = () => {
  const dispatch = useDispatch()
  const [cancelingId, setCancelingId] = useState(null)
  const [showCancelReason, setShowCancelReason] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const user = useSelector((state) => state.user?.user)
  const orders = useSelector((state) => state.order?.orders || [])
  const loading = useSelector((state) => state.order?.isLoading || false)
  const error = useSelector((state) => state.order?.error || null)

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id))
    }
    // eslint-disable-next-line
  }, [user?._id, dispatch])

  if (loading) {
    return (
      <div className="w-full bg-gray-50 min-h-screen py-6 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-600 mt-1">Track and manage your orders from Aritii Market</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <BiPackage className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Loading your orders…</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full bg-gray-50 min-h-screen py-6 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-600 mt-1">Track and manage your orders from Aritii Market</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
            <div className="text-center">
              <p className="text-red-700 font-medium mb-2">Error loading orders</p>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button 
                onClick={() => dispatch(getAllOrdersOfUser(user._id))}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || ''
    if (s.includes('delivered')) return 'bg-green-50 text-green-700 border-green-200'
    if (s.includes('processing')) return 'bg-blue-50 text-blue-700 border-blue-200'
    if (s.includes('shipped')) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    if (s.includes('pending')) return 'bg-gray-50 text-gray-700 border-gray-200'
    if (s.includes('cancelled') || s.includes('cancel')) return 'bg-red-50 text-red-700 border-red-200'
    return 'bg-teal-50 text-teal-700 border-teal-200'
  }

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase() || ''
    if (s.includes('delivered')) return '✓'
    if (s.includes('shipped')) return '📦'
    if (s.includes('processing')) return '⏳'
    if (s.includes('cancelled')) return '✕'
    return '→'
  }

  const isCancellable = (status) => {
    const s = status?.toLowerCase() || ''
    // Only allow cancellation for pending and processing orders
    return !s.includes('cancelled') && !s.includes('shipped') && !s.includes('delivered')
  }

  const handleCancelOrder = async (orderId) => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation')
      return
    }
    setCancelingId(orderId)
    try {
      await dispatch(cancelOrder(orderId, cancelReason))
      setShowCancelReason(null)
      setCancelReason('')
    } finally {
      setCancelingId(null)
    }
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen py-6 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-600 mt-1">Track and manage your orders from Aritii Market</p>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdShoppingBag className="text-4xl text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium mb-2">No orders yet</p>
            <p className="text-gray-500 text-sm mb-6">Start shopping to see your orders here</p>
            <Link to="/products" className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {/* Desktop View - Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Order ID</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Items</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Total</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((o, idx) => (
                    <tr key={o._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded">
                          #{o._id?.slice?.(-8) || idx}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700 font-medium">{o.products?.length || o.items?.length || 0} item(s)</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900 font-bold">{Number(o.totalPrice || 0).toLocaleString()} ETB</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border font-medium text-xs ${getStatusColor(o.orderStatus || o.status)}`}>
                          <span>{getStatusIcon(o.orderStatus || o.status)}</span>
                          <span className="capitalize">{o.orderStatus || o.status || 'Pending'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link to={`/user/order/${o._id}`} className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 group">
                            View <MdArrowForward className="text-sm group-hover:translate-x-1 transition" />
                          </Link>
                          {isCancellable(o.orderStatus || o.status) && (
                            <button
                              onClick={() => setShowCancelReason(o._id)}
                              disabled={cancelingId === o._id}
                              className="text-red-600 hover:text-red-700 font-semibold text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {cancelingId === o._id ? 'Cancelling...' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-3 p-4">
              {orders.map((o, idx) => (
                <div key={o._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-mono text-xs font-semibold text-gray-700 bg-white px-2 py-1 rounded border border-gray-200">
                      #{o._id?.slice?.(-8) || idx}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border font-medium text-xs ${getStatusColor(o.orderStatus || o.status)}`}>
                      <span>{getStatusIcon(o.orderStatus || o.status)}</span>
                      <span className="capitalize">{o.orderStatus || o.status || 'Pending'}</span>
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items:</span>
                      <span className="font-medium text-gray-900">{o.products?.length || o.items?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold text-gray-900">{Number(o.totalPrice || 0).toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Date:</span>
                      <span className="text-gray-600">{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                    <Link to={`/user/order/${o._id}`} className="flex-1 text-teal-600 font-semibold text-sm flex items-center gap-1">
                      View details <MdArrowForward className="text-sm" />
                    </Link>
                    {isCancellable(o.orderStatus || o.status) && (
                      <button
                        onClick={() => setShowCancelReason(o._id)}
                        disabled={cancelingId === o._id}
                        className="text-red-600 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancelingId === o._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cancel Order Modal */}
        {showCancelReason && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Cancel Order</h3>
                <button
                  onClick={() => {
                    setShowCancelReason(null)
                    setCancelReason('')
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <AiOutlineClose className="text-xl" />
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Please provide a reason for cancellation. Your order will be cancelled and inventory will be released.
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter cancellation reason..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={4}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelReason(null)
                    setCancelReason('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Keep Order
                </button>
                <button
                  onClick={() => handleCancelOrder(showCancelReason)}
                  disabled={!cancelReason.trim() || cancelingId}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelingId ? 'Processing...' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerOrdersPage
