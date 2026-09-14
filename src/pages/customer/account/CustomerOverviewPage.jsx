import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, ProductImage } from '../../../components/common/ImageWithFallback'
import { getAllOrdersOfUser } from '../../../store/redux/actions/order'
import Store from '../../../store/redux/store'
import { MdShoppingBag, MdArrowForward, MdFavoriteBorder, MdLocationOn, MdTrendingUp } from 'react-icons/md'
import { BiPackage, BiStore } from 'react-icons/bi'

// Buyer Dashboard — the customer's own overview.
// Modern card-based design with responsive layout
const CustomerOverviewPage = () => {
  const user = useSelector((state) => state.user?.user)
  const { isSeller } = useSelector((state) => state.seller)
  const orders = useSelector((state) => state.order?.orders || [])
  const wishlist = useSelector((state) => state.wishlist?.wishlist || [])
  const addresses = user?.addresses || []
  const allProducts = useSelector((state) => state.product?.allProducts || [])

  useEffect(() => {
    if (user?._id) Store.dispatch(getAllOrdersOfUser(user._id))
    // eslint-disable-next-line
  }, [user?._id])

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0)
  const recentOrders = orders.slice(0, 5)
  const explore = allProducts.slice(0, 5)

  const getStatusColor = (status) => {
    const statusLower = (status || 'pending').toLowerCase()
    const statusMap = {
      'succeeded': 'bg-green-100 text-green-700',
      'completed': 'bg-green-100 text-green-700',
      'delivered': 'bg-green-100 text-green-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'processing': 'bg-blue-100 text-blue-700',
      'cancelled': 'bg-red-100 text-red-700',
      'failed': 'bg-red-100 text-red-700',
    }
    return statusMap[statusLower] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4 mb-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex-shrink-0 flex items-center justify-center text-2xl font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || 'Y'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {user?.name}</h1>
            <p className="text-sm text-gray-600 mb-1">Manage orders, addresses, wishlist and profile — all in one place.</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <MdShoppingBag className="text-xl text-blue-600" />
            </div>
          </div>
          <Link to="/my-dashboard/orders" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View all →</Link>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900">{Number(totalSpent).toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-1">ETB</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <MdTrendingUp className="text-xl text-green-600" />
            </div>
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Saved Addresses</p>
              <p className="text-3xl font-bold text-gray-900">{addresses.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <MdLocationOn className="text-xl text-yellow-600" />
            </div>
          </div>
          <Link to="/my-dashboard/addresses" className="text-xs font-semibold text-yellow-600 hover:text-yellow-700">Manage →</Link>
        </div>

        {/* Wishlist Items */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Wishlist Items</p>
              <p className="text-3xl font-bold text-gray-900">{wishlist.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <MdFavoriteBorder className="text-xl text-red-600" />
            </div>
          </div>
          <Link to="/my-dashboard/wishlist" className="text-xs font-semibold text-red-600 hover:text-red-700">View all →</Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            {totalSpent > 0 && <p className="text-xs text-gray-600 mt-1">Total value: <span className="font-semibold text-teal-600">{Number(totalSpent).toLocaleString()} ETB</span></p>}
          </div>
          <Link to="/my-dashboard/orders" className="text-sm font-semibold text-teal-600 hover:text-teal-700">View all →</Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10">
            <MdShoppingBag className="text-5xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 text-sm mb-4">You have not placed any orders yet.</p>
            <Link to="/products" className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition">
              Start shopping <MdArrowForward />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link key={order._id} to={`/user/order/${order._id}`} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100 transition group">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">#{order._id?.slice?.(-8)?.toUpperCase()}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus || order.status)}`}>
                        {(order.orderStatus || order.status || 'Pending').charAt(0).toUpperCase() + (order.orderStatus || order.status || 'Pending').slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.products?.length || order.items?.length || 0} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{Number(order.totalPrice || 0).toLocaleString()} ETB</p>
                    <p className="text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</p>
                  </div>
                </div>
                <MdArrowForward className="text-gray-400 group-hover:text-teal-600 transition ml-2" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/products" className="px-4 py-3 rounded-lg bg-teal-50 text-teal-700 text-sm font-semibold text-center hover:bg-teal-100 transition border border-teal-200">
            Continue Shopping
          </Link>
          <Link to="/my-dashboard/wishlist" className="px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm font-semibold text-center hover:bg-red-100 transition border border-red-200">
            My Wishlist
          </Link>
          <Link to="/my-dashboard/addresses" className="px-4 py-3 rounded-lg bg-yellow-50 text-yellow-700 text-sm font-semibold text-center hover:bg-yellow-100 transition border border-yellow-200">
            Address Book
          </Link>
          <Link to="/my-dashboard/settings" className="px-4 py-3 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold text-center hover:bg-gray-200 transition border border-gray-200">
            Settings
          </Link>
        </div>
      </div>

      {/* Seller Status Banner */}
      {isSeller && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-base mb-1">🏪 You are an Approved Seller</p>
              <p className="text-sm text-gray-700 mb-3">Manage your storefront, products, and orders from your seller dashboard.</p>
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold text-sm hover:bg-teal-700 transition">
                Go to Seller Center <MdArrowForward />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Explore Products */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recommended For You</h2>
          <Link to="/products" className="text-sm font-semibold text-teal-600 hover:text-teal-700">View all →</Link>
        </div>

        {explore.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 text-sm">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {explore.map((p) => (
              <Link key={p._id} to={`/product/${p.name?.toLowerCase().replace(/ /g, '-')}`}
                className="group rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition bg-white">
                <div className="w-full h-28 bg-gray-100 overflow-hidden">
                  <ProductImage data={p} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="p-2">
                  <p className="font-semibold text-xs text-gray-900 line-clamp-1">{p.name}</p>
                  <p className="text-teal-600 font-bold text-xs mt-1">{Number(p.discountPrice || p.price || 0).toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerOverviewPage