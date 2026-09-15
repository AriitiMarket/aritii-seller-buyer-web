import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { getAllOrdersOfUser, cancelOrder, getAllOrdersOfShop } from '../../../store/redux/actions/order'
import { MdShoppingBag, MdArrowForward } from 'react-icons/md'
import { AiOutlineClose } from 'react-icons/ai'

const CustomerOrdersPage = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user?.user)
  const { isSeller, seller } = useSelector((state) => state.seller)
  const buyerOrders = useSelector((state) => state.order?.orders || [])
  const loading = useSelector((state) => state.order?.isLoading || false)
  const error = useSelector((state) => state.order?.error || null)
  const [activeTab, setActiveTab] = useState('purchases')
  const [cancelingId, setCancelingId] = useState(null)
  const [showCancelReason, setShowCancelReason] = useState(null)
  const [cancelReason, setCancelReason] = useState('')

  useEffect(() => {
    if (user?._id) dispatch(getAllOrdersOfUser(user._id))
    if (isSeller && seller?._id) dispatch(getAllOrdersOfShop(seller._id))
  }, [user?._id, isSeller, seller?._id, dispatch])

  const orders = activeTab === 'purchases' ? buyerOrders : buyerOrders // Business orders loaded separately

  const handleCancelOrder = async (orderId) => {
    if (!cancelReason.trim()) { alert('Please provide a reason'); return }
    setCancelingId(orderId)
    try { await dispatch(cancelOrder(orderId, cancelReason)); setShowCancelReason(null); setCancelReason('') }
    finally { setCancelingId(null) }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-sm text-gray-600">Track and manage your purchases{isSeller ? ' and business orders' : ''}</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('purchases')}
            className={`flex-1 px-6 py-3 text-sm font-semibold transition ${activeTab === 'purchases' ? 'text-teal-700 border-b-2 border-teal-600 bg-teal-50' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            My Purchases
          </button>
          {isSeller && (
            <button
              onClick={() => setActiveTab('business')}
              className={`flex-1 px-6 py-3 text-sm font-semibold transition ${activeTab === 'business' ? 'text-orange-700 border-b-2 border-orange-600 bg-orange-50' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Business Orders
            </button>
          )}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto"></div>
              <p className="text-gray-500 text-sm mt-4">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button onClick={() => dispatch(getAllOrdersOfUser(user._id))} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700">Try Again</button>
            </div>
          ) : activeTab === 'purchases' ? (
            <PurchasesTab orders={buyerOrders} cancelingId={cancelingId} showCancelReason={showCancelReason} setShowCancelReason={setShowCancelReason} cancelReason={cancelReason} setCancelReason={setCancelReason} handleCancelOrder={handleCancelOrder} />
          ) : (
            <BusinessTab />
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelReason && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Cancel Order</h3>
              <button onClick={() => { setShowCancelReason(null); setCancelReason('') }} className="text-gray-500 hover:text-gray-700">
                <AiOutlineClose className="text-xl" />
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-4">Please provide a reason for cancellation.</p>
            <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Cancellation reason..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500" rows={3} />
            <div className="flex gap-3">
              <button onClick={() => { setShowCancelReason(null); setCancelReason('') }} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50">Keep Order</button>
              <button onClick={() => handleCancelOrder(showCancelReason)} disabled={!cancelReason.trim() || cancelingId}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50">
                {cancelingId ? 'Processing...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const PurchasesTab = ({ orders, cancelingId, showCancelReason, setShowCancelReason, cancelReason, setCancelReason, handleCancelOrder }) => {
  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase()
    if (s.includes('delivered')) return 'bg-green-100 text-green-700'
    if (s.includes('shipped')) return 'bg-blue-100 text-blue-700'
    if (s.includes('processing')) return 'bg-yellow-100 text-yellow-700'
    if (s.includes('cancelled')) return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-700'
  }

  const isCancellable = (status) => {
    const s = (status || '').toLowerCase()
    return !s.includes('cancelled') && !s.includes('shipped') && !s.includes('delivered')
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <MdShoppingBag className="text-5xl text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 font-medium mb-2">No purchases yet</p>
        <p className="text-gray-500 text-sm mb-4">Start shopping to see your orders here</p>
        <Link to="/products" className="px-5 py-2.5 bg-teal-600 text-white rounded-lg font-semibold text-sm hover:bg-teal-700 transition inline-block">Start Shopping</Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o._id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100 transition">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">#{o._id?.slice?.(-8)?.toUpperCase()}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(o.orderStatus || o.status)}`}>
                  {(o.orderStatus || o.status || 'Pending').charAt(0).toUpperCase() + (o.orderStatus || o.status || 'Pending').slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600">{o.products?.length || o.items?.length || 0} items</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{Number(o.totalPrice || 0).toLocaleString()} ETB</p>
              <p className="text-xs text-gray-500">{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <Link to={`/user/order/${o._id}`} className="text-teal-600 hover:text-teal-700 font-semibold text-sm flex items-center gap-1">
              View <MdArrowForward className="text-sm" />
            </Link>
            {isCancellable(o.orderStatus || o.status) && (
              <button onClick={() => setShowCancelReason(o._id)} disabled={cancelingId === o._id}
                className="text-red-600 hover:text-red-700 font-semibold text-sm disabled:opacity-50">
                Cancel
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const BusinessTab = () => (
  <div className="text-center py-16">
    <MdShoppingBag className="text-5xl text-gray-300 mx-auto mb-3" />
    <p className="text-gray-600 font-medium mb-2">Business Orders</p>
    <p className="text-gray-500 text-sm mb-4">Orders placed by customers for your products will appear here.</p>
    <Link to="/my-dashboard/business/orders" className="px-5 py-2.5 bg-orange-600 text-white rounded-lg font-semibold text-sm hover:bg-orange-700 transition inline-block">
      View Full Business Orders
    </Link>
  </div>
)

export default CustomerOrdersPage
