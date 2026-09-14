import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Store from '../../../store/redux/store'
import { getAllOrdersOfUser } from '../../../store/redux/actions/order'
import { MdShoppingBag, MdArrowForward } from 'react-icons/md'
import { BiPackage } from 'react-icons/bi'

// Buyer Account: My Orders with modern card design
// Shows ONLY the logged-in buyer's own orders
const CustomerOrdersPage = () => {
  const user = useSelector((state) => state.user?.user)
  const orders = useSelector((state) => state.order?.orders || [])
  const loading = useSelector((state) => state.order?.loading || false)

  useEffect(() => {
    if (user?._id) Store.dispatch(getAllOrdersOfUser(user._id))
    // eslint-disable-next-line
  }, [user?._id])

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <BiPackage className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Loading your orders…</p>
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
                        <Link to={`/user/order/${o._id}`} className="text-teal-600 hover:text-teal-700 font-semibold flex items-center justify-center gap-1 group">
                          View <MdArrowForward className="text-sm group-hover:translate-x-1 transition" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-3 p-4">
              {orders.map((o, idx) => (
                <Link key={o._id} to={`/user/order/${o._id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition bg-gray-50">
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
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-teal-600 font-semibold text-sm flex items-center gap-1">
                      View details <MdArrowForward className="text-sm" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerOrdersPage
