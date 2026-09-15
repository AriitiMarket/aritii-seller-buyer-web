import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { ProductImage } from '../../../components/common/ImageWithFallback'
import { getAllOrdersOfUser } from '../../../store/redux/actions/order'
import { getAllProductsShop } from '../../../store/redux/actions/product'
import { MdShoppingBag, MdArrowForward, MdTrendingUp, MdLocationOn, MdInventory, MdShoppingCart } from 'react-icons/md'

const CustomerOverviewPage = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user?.user)
  const { isSeller, seller } = useSelector((state) => state.seller)
  const orders = useSelector((state) => state.order?.orders || [])
  const isLoading = useSelector((state) => state.order?.isLoading || false)
  const error = useSelector((state) => state.order?.error || null)
  const allProducts = useSelector((state) => state.product?.allProducts || [])
  const sellerProducts = useSelector((state) => state.product?.sellerProducts || state.product?.products || [])

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id))
    }
    if (isSeller && seller?._id) {
      dispatch(getAllProductsShop(seller._id))
    }
  }, [user?._id, isSeller, seller?._id, dispatch])

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0)
  const recentOrders = orders.slice(0, 5)
  const explore = allProducts.slice(0, 6)
  const addresses = user?.addresses || []

  const getStatusColor = (status) => {
    const s = (status || 'pending').toLowerCase()
    const map = {
      succeeded: 'bg-green-100 text-green-700', completed: 'bg-green-100 text-green-700',
      delivered: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700', cancelled: 'bg-red-100 text-red-700',
      failed: 'bg-red-100 text-red-700',
    }
    return map[s] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex-shrink-0 flex items-center justify-center text-2xl font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {user?.name}</h1>
            <p className="text-sm text-gray-600">
              {isSeller
                ? 'Manage your shopping and business from one place.'
                : 'Manage orders, addresses, and profile — all in one place.'}
            </p>
            {isSeller && (
              <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                Seller Account Approved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Shopping Stats */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Shopping</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            <Link to="/my-dashboard/profile" className="text-xs font-semibold text-yellow-600 hover:text-yellow-700">Manage →</Link>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Quick Action</p>
                <p className="text-lg font-bold text-gray-900 mt-1">Browse</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <MdArrowForward className="text-xl text-purple-600" />
              </div>
            </div>
            <Link to="/products" className="text-xs font-semibold text-purple-600 hover:text-purple-700">Marketplace →</Link>
          </div>
        </div>
      </div>

      {/* Business Stats — approved sellers only */}
      {isSeller && (
        <div>
          <h2 className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-3">My Business</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/my-dashboard/business/analytics" className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Products</p>
                  <p className="text-3xl font-bold text-gray-900">{sellerProducts.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-50">
                  <MdInventory className="text-xl text-orange-600" />
                </div>
              </div>
              <span className="text-xs font-semibold text-orange-600 group-hover:text-orange-700">Manage →</span>
            </Link>

            <Link to="/my-dashboard/business/orders" className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Business Orders</p>
                  <p className="text-3xl font-bold text-gray-900">—</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <MdShoppingCart className="text-xl text-blue-600" />
                </div>
              </div>
              <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-700">View all →</span>
            </Link>

            <Link to="/my-dashboard/business/products" className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Add Product</p>
                  <p className="text-lg font-bold text-teal-600 mt-1">+ New</p>
                </div>
                <div className="p-3 rounded-lg bg-teal-50">
                  <MdArrowForward className="text-xl text-teal-600" />
                </div>
              </div>
              <span className="text-xs font-semibold text-teal-600 group-hover:text-teal-700">Create →</span>
            </Link>

            <Link to="/my-dashboard/settings" className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Business Profile</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">Settings</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-100">
                  <MdTrendingUp className="text-xl text-gray-600" />
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-700">Edit →</span>
            </Link>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          {!isLoading && orders.length > 0 && (
            <Link to="/my-dashboard/orders" className="text-sm font-semibold text-teal-600 hover:text-teal-700">View all →</Link>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto"></div>
            <p className="text-gray-600 text-sm mt-4">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button onClick={() => dispatch(getAllOrdersOfUser(user._id))} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition">Try Again</button>
          </div>
        ) : recentOrders.length === 0 ? (
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

      {/* Recommended Products */}
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
