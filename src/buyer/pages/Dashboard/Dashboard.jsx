import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { ProductImage } from '@/components/common/ImageWithFallback'
import { useProducts } from '@/shared/hooks/useProducts'
import { useShops } from '@/shared/hooks/useShops'
import { getAllOrdersOfUser } from '@/store/slices/orderThunks'
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus'
import { MdShoppingBag, MdLocalShipping, MdOutlineArrowForward, MdShoppingCart } from 'react-icons/md'

const BuyerOverviewPage = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user?.user)
  const { products: allProducts = [] } = useProducts()
  const { shops = [] } = useShops()
  const orders = useSelector((state) => state.order?.orders || [])
  const cart = useSelector((state) => state.cart?.cart || [])

  const userId = user?._id || user?.id
  useEffect(() => {
    if (userId) dispatch(getAllOrdersOfUser(userId))
  }, [dispatch, userId])

  const recommendedProducts = allProducts.slice(0, 8)
  const newArrivals = [...allProducts].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 8)
  const topShops = shops.slice(0, 4)

  // Active orders (not delivered, cancelled, completed, refunded, or failed)
  const activeOrders = orders.filter(o => {
    const s = normalizeStatus(o.orderStatus || o.status)
    return s !== ORDER_STATUSES.DELIVERED
      && s !== ORDER_STATUSES.CANCELLED
      && s !== 'Refund Success'
      && s !== 'Refund Rejected';
  }).slice(0, 3)

  const inTransitCount = orders.filter(o => {
    const s = normalizeStatus(o.orderStatus || o.status)
    return s === ORDER_STATUSES.SHIPPED || s === ORDER_STATUSES.IN_TRANSIT || s === ORDER_STATUSES.CONFIRMED;
  }).length

  const cartCount = cart?.reduce((t, i) => t + Number(i.quantity ?? 1), 0) || 0

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#75d04b] to-[#5ac12f] rounded-2xl p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome'}
        </h1>
        <p className="text-white/80 text-sm md:text-base">
          Discover products from trusted Ethiopian shops
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link
            to="/my-dashboard/marketplace"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#75d04b] rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
          >
            Browse Products <MdOutlineArrowForward size={16} />
          </Link>
          <Link
            to="/my-dashboard/shops"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/30 transition"
          >
            Explore Shops
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/my-dashboard/orders" className="bg-white rounded-xl border border-gray-100 p-4 hover:border-[#75d04b]/30 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <MdShoppingBag className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              <p className="text-xs text-gray-500">Total Orders</p>
            </div>
          </div>
        </Link>
        <Link to="/my-dashboard/orders" className="bg-white rounded-xl border border-gray-100 p-4 hover:border-[#75d04b]/30 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <MdLocalShipping className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{inTransitCount}</p>
              <p className="text-xs text-gray-500">In Transit</p>
            </div>
          </div>
        </Link>
        <Link to="/checkout" className="bg-white rounded-xl border border-gray-100 p-4 hover:border-[#75d04b]/30 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#75d04b]/10 flex items-center justify-center">
              <MdShoppingCart className="text-[#75d04b]" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{cartCount}</p>
              <p className="text-xs text-gray-500">Cart Items</p>
            </div>
          </div>
        </Link>
        <Link to="/my-dashboard/shops" className="bg-white rounded-xl border border-gray-100 p-4 hover:border-[#75d04b]/30 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">🏪</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{shops.length}</p>
              <p className="text-xs text-gray-500">Shops</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Active Orders</h2>
            <Link to="/my-dashboard/orders" className="text-sm font-semibold text-[#75d04b] hover:text-[#5ac12f] transition">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {activeOrders.map((order) => {
              const items = order.cart || order.products || order.items || []
              const firstItem = items[0]
              const status = normalizeStatus(order.orderStatus || order.status)
              const orderIdShort = order._id?.slice?.(-8)?.toUpperCase()
              
              return (
                <Link
                  key={order._id}
                  to={`/user/order/${order._id}`}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#75d04b]/30 hover:shadow-md transition"
                >
                  {firstItem && (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <ProductImage data={firstItem} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-900">#{orderIdShort}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        status === 'Pending' || status === 'Refund Requested' ? 'bg-yellow-100 text-yellow-700' :
                        status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        status === 'Confirmed' ? 'bg-indigo-100 text-indigo-700' :
                        status === 'Shipped' || status === 'In Transit' ? 'bg-purple-100 text-purple-700' :
                        status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {items.length} item{items.length > 1 ? 's' : ''} • {Number(order.totalPrice || 0).toLocaleString()} ETB
                    </p>
                  </div>
                  <MdOutlineArrowForward className="text-gray-400" size={20} />
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recommended For You</h2>
            <Link to="/my-dashboard/marketplace" className="text-sm font-semibold text-[#75d04b] hover:text-[#5ac12f] transition">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendedProducts.map((p) => (
              <Link
                key={p._id}
                to={`/my-dashboard/marketplace/product/${p._id}`}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all"
              >
                <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                  <ProductImage data={p} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-xs text-gray-900 line-clamp-2 mb-1.5 leading-snug">{p.name}</p>
                                     <p className="font-bold text-sm text-[#75d04b]">
                    {Number(p.discountPrice || 0).toLocaleString()} <span className="text-[10px] font-medium text-gray-500">ETB</span>
                  </p>
                  {p.discountPrice && p.originalPrice && p.discountPrice < p.originalPrice && (
                    <p className="text-[10px] text-gray-400 line-through mt-0.5">{Number(p.originalPrice || 0).toLocaleString()} ETB</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">New Arrivals</h2>
            <Link to="/my-dashboard/marketplace" className="text-sm font-semibold text-[#75d04b] hover:text-[#5ac12f] transition">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.map((p) => (
              <Link
                key={p._id}
                to={`/my-dashboard/marketplace/product/${p._id}`}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all"
              >
                <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                  <ProductImage data={p} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-xs text-gray-900 line-clamp-2 mb-1.5 leading-snug">{p.name}</p>
                  <p className="font-bold text-sm text-[#75d04b]">
                                        {Number(p.discountPrice || 0).toLocaleString()} <span className="text-[10px] font-medium text-gray-500">ETB</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Shops */}
      {topShops.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Popular Shops</h2>
            <Link to="/my-dashboard/shops" className="text-sm font-semibold text-[#75d04b] hover:text-[#5ac12f] transition">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topShops.map((shop) => (
              <Link
                key={shop._id}
                to={`/my-dashboard/shops/${shop._id || shop.slug}`}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#75d04b]/30 hover:shadow-md transition"
              >
                <div className="w-12 h-12 rounded-xl bg-[#75d04b]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {shop.avatar ? (
                                        <img src={shop.avatar} alt={shop.name || 'Shop'} className="w-full h-full object-cover" />
                  ) : (
                                        <span className="text-lg font-bold text-[#75d04b]">{(shop.name || 'S').charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{shop.name || 'Shop'}</p>
                  <p className="text-xs text-gray-500">{shop.productCount || shop.products?.length || 0} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {recommendedProducts.length === 0 && activeOrders.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-sm">Products will appear here once available.</p>
        </div>
      )}
    </div>
  )
}

export default BuyerOverviewPage
