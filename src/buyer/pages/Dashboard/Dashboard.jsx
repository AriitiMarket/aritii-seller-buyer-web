import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { ProductImage } from '@/components/common/ImageWithFallback'
import { useProducts } from '@/shared/hooks/useProducts'
import { useShops } from '@/shared/hooks/useShops'
import { getAllOrdersOfUser } from '@/store/slices/orderThunks'
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus'
import { MdShoppingBag, MdLocalShipping, MdOutlineArrowForward, MdShoppingCart } from 'react-icons/md'
import { AiOutlineHeart } from 'react-icons/ai'

const BuyerOverviewPage = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user?.user)
  const { products: allProducts = [] } = useProducts()
  const { shops = [] } = useShops()
  const orders = useSelector((state) => state.order?.orders || [])
  const cart = useSelector((state) => state.cart?.cart || [])
  const wishlist = useSelector((state) => state.wishlist?.wishlist || [])

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
      && s !== 'Refund Rejected'
      && s !== 'Completed';
  }).slice(0, 3)

  const inTransitCount = orders.filter(o => {
    const s = normalizeStatus(o.orderStatus || o.status)
    return s === ORDER_STATUSES.SHIPPED || s === ORDER_STATUSES.IN_TRANSIT || s === ORDER_STATUSES.CONFIRMED;
  }).length

  const cartCount = cart?.reduce((t, i) => t + Number(i.quantity ?? 1), 0) || 0

  return (
    <div className="space-y-8">
      {/* Welcome - Dynamic based on user state */}
      {activeOrders.length > 0 ? (
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-[#20305c] via-[#20305c] to-[#141414] rounded-3xl p-6 md:p-9 text-white shadow-lg shadow-[#20305c]/15">
          <div aria-hidden="true" className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[28px] border-white/5" />
          <h1 className="relative text-2xl md:text-3xl font-bold tracking-tight mb-1">
            {user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome back'}
          </h1>
          <p className="relative text-white/75 text-sm md:text-base">
            You have {activeOrders.length} active order{activeOrders.length > 1 ? 's' : ''} in progress
          </p>
          <div className="relative flex flex-wrap gap-3 mt-5">
            <Link
              to="/my-dashboard/orders"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#20305C] text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-[#2C3F6E] transition"
            >
              View Orders <MdOutlineArrowForward size={16} />
            </Link>
            <Link
              to="/my-dashboard/marketplace"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/15 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-[#20305c] via-[#20305c] to-[#141414] rounded-3xl p-6 md:p-9 text-white shadow-lg shadow-[#20305c]/15">
          <div aria-hidden="true" className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[28px] border-white/5" />
          <h1 className="relative text-2xl md:text-3xl font-bold tracking-tight mb-1">
            {user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome to Aritii'}
          </h1>
          <p className="relative text-white/75 text-sm md:text-base">
            Discover products from trusted Ethiopian shops
          </p>
          <div className="relative flex flex-wrap gap-3 mt-5">
            <Link
              to="/my-dashboard/marketplace"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#20305C] text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-[#2C3F6E] transition"
            >
              Browse Products <MdOutlineArrowForward size={16} />
            </Link>
            <Link
              to="/my-dashboard/shops"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/15 transition"
            >
              Explore Shops
            </Link>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Link to="/my-dashboard/orders" className="bg-white rounded-2xl border border-[#E5E7EB] p-3 sm:p-4 hover:border-[#20305C]/30 hover:shadow-md transition">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#20305C]/10 flex items-center justify-center">
              <MdShoppingBag className="text-[#2C3F6E]" size={16} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-[#171A21]">{orders.length}</p>
              <p className="text-[10px] sm:text-xs text-[#667085]">Total Orders</p>
            </div>
          </div>
        </Link>
        <Link to="/my-dashboard/orders" className="bg-white rounded-2xl border border-[#E5E7EB] p-3 sm:p-4 hover:border-[#20305C]/30 hover:shadow-md transition">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#20305C]/10 flex items-center justify-center">
              <MdLocalShipping className="text-[#2C3F6E]" size={16} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-[#171A21]">{inTransitCount}</p>
              <p className="text-[10px] sm:text-xs text-[#667085]">In Transit</p>
            </div>
          </div>
        </Link>
        <Link to="/my-dashboard/cart" className="bg-white rounded-2xl border border-[#E5E7EB] p-3 sm:p-4 hover:border-[#20305C]/30 hover:shadow-md transition">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#20305C]/10 flex items-center justify-center">
              <MdShoppingCart className="text-[#20305C]" size={16} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-[#171A21]">{cartCount}</p>
              <p className="text-[10px] sm:text-xs text-[#667085]">Cart Items</p>
            </div>
          </div>
        </Link>
        <Link to="/my-dashboard/wishlist" className="bg-white rounded-2xl border border-[#E5E7EB] p-3 sm:p-4 hover:border-[#20305C]/30 hover:shadow-md transition">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#20305C]/10 flex items-center justify-center">
              <AiOutlineHeart className="text-[#2C3F6E]" size={16} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-[#171A21]">{wishlist?.length || 0}</p>
              <p className="text-[10px] sm:text-xs text-[#667085]">Saved Items</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#171A21]">Active Orders</h2>
            <Link to="/my-dashboard/orders" className="text-sm font-semibold text-[#20305C] hover:text-[#2C3F6E] transition">
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {activeOrders.map((order) => {
              const items = order.cart || order.products || order.items || []
              const firstItem = items[0]
              const status = normalizeStatus(order.orderStatus || order.status)
              const orderIdShort = order._id?.slice?.(-8)?.toUpperCase()
              const shopName = typeof firstItem?.shop === 'string' ? firstItem.shop : firstItem?.shop?.name || firstItem?.shopName || 'Shop'

              // Progress calculation based on status
              const getProgressStep = (s) => {
                if (s === 'Pending') return 1
                if (s === 'Processing' || s === 'Confirmed') return 2
                if (s === 'Shipped' || s === 'In Transit') return 3
                if (s === 'Delivered') return 4
                return 1
              }
              const currentStep = getProgressStep(status)
              const progressPercent = (currentStep / 4) * 100

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 hover:border-[#20305C]/30 hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                        <span className="font-bold text-sm text-[#171A21]">Order #{orderIdShort}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          status === 'Pending' || status === 'Refund Requested' ? 'bg-yellow-100 text-yellow-700' :
                          status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                          status === 'Confirmed' ? 'bg-indigo-100 text-indigo-700' :
                          status === 'Shipped' || status === 'In Transit' ? 'bg-purple-100 text-purple-700' :
                          status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-[#171A21]'
                        }`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-xs text-[#667085] mb-1">
                        <span className="font-medium text-[#171A21]">Vendor:</span> {shopName}
                      </p>
                      <p className="text-xs text-[#667085]">
                        <span className="font-medium text-[#171A21]">Product:</span> {firstItem?.name || 'Product'} × {firstItem?.quantity || 1}
                      </p>
                    </div>
                    <div className="text-right sm:text-left">
                      <p className="text-sm font-bold text-[#171A21]">{Number(order.totalPrice || 0).toLocaleString()} ETB</p>
                      <p className="text-[10px] text-[#667085]">{items.length} item{items.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`w-2 h-2 rounded-full ${
                              step <= currentStep ? 'bg-[#20305C]' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#667085]">{progressPercent}% Complete</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#20305C] transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[10px] text-[#667085]">Confirmed</span>
                      <span className="text-[10px] text-[#667085]">Packed</span>
                      <span className="text-[10px] text-[#667085]">In Transit</span>
                      <span className="text-[10px] text-[#667085]">Delivered</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Link
                      to={`/user/order/${order._id}`}
                      className="flex-1 w-full text-center px-4 py-2 bg-white border border-[#E5E7EB] text-[#171A21] rounded-lg text-xs font-semibold hover:bg-[#F7F8FA] transition"
                    >
                      View Details
                    </Link>
                    {status === 'Shipped' || status === 'In Transit' ? (
                      <Link
                        to={`/user/track/order/${order._id}`}
                        className="flex-1 w-full text-center px-4 py-2 bg-[#20305C] text-white rounded-lg text-xs font-semibold hover:bg-[#2C3F6E] transition"
                      >
                        Track Order
                      </Link>
                    ) : (
                      <Link
                        to={`/user/order/${order._id}`}
                        className="flex-1 w-full text-center px-4 py-2 bg-[#20305C] text-white rounded-lg text-xs font-semibold hover:bg-[#2C3F6E] transition"
                      >
                        View Order
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#171A21]">Recommended For You</h2>
            <Link to="/my-dashboard/marketplace" className="text-sm font-semibold text-[#20305C] hover:text-[#2C3F6E] transition">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {recommendedProducts.map((p) => {
              const shopName = typeof p.shop === 'string' ? p.shop : p.shop?.name || p.shopName || 'Shop'
              const discountPercent = p.discountPrice && p.originalPrice && p.discountPrice < p.originalPrice
                ? Math.round(((p.originalPrice - p.discountPrice) / p.originalPrice) * 100)
                : 0

              return (
                <Link
                  key={p._id}
                  to={`/my-dashboard/marketplace/product/${p._id}`}
                  className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-lg hover:border-[#20305C]/30 transition-all"
                >
                  <div className="relative w-full aspect-square bg-[#F7F8FA] overflow-hidden">
                    <ProductImage data={p} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    {discountPercent > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        -{discountPercent}%
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-xs text-[#171A21] line-clamp-2 mb-1.5 leading-snug">{p.name}</p>
                    <p className="text-[10px] text-[#667085] mb-1.5">{shopName}</p>
                    <div className="flex items-center gap-1 mb-1">
                      {p.ratings > 0 && (
                        <>
                          <span className="text-yellow-500 text-[10px]">★</span>
                          <span className="text-[10px] text-[#667085] font-medium">{Number(p.ratings || 0).toFixed(1)}</span>
                        </>
                      )}
                    </div>
                    <p className="font-bold text-sm text-[#20305C]">
                      {Number(p.discountPrice || 0).toLocaleString()} <span className="text-[10px] font-medium text-[#667085]">ETB</span>
                    </p>
                    {p.discountPrice && p.originalPrice && p.discountPrice < p.originalPrice && (
                      <p className="text-[10px] text-gray-400 line-through mt-0.5">{Number(p.originalPrice || 0).toLocaleString()} ETB</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#171A21]">New Arrivals</h2>
            <Link to="/my-dashboard/marketplace" className="text-sm font-semibold text-[#20305C] hover:text-[#2C3F6E] transition">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {newArrivals.map((p) => {
              const shopName = typeof p.shop === 'string' ? p.shop : p.shop?.name || p.shopName || 'Shop'
              const discountPercent = p.discountPrice && p.originalPrice && p.discountPrice < p.originalPrice
                ? Math.round(((p.originalPrice - p.discountPrice) / p.originalPrice) * 100)
                : 0

              return (
                <Link
                  key={p._id}
                  to={`/my-dashboard/marketplace/product/${p._id}`}
                  className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-lg hover:border-[#20305C]/30 transition-all"
                >
                  <div className="relative w-full aspect-square bg-[#F7F8FA] overflow-hidden">
                    <ProductImage data={p} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    {discountPercent > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        -{discountPercent}%
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-xs text-[#171A21] line-clamp-2 mb-1.5 leading-snug">{p.name}</p>
                    <p className="text-[10px] text-[#667085] mb-1.5">{shopName}</p>
                    <div className="flex items-center gap-1 mb-1">
                      {p.ratings > 0 && (
                        <>
                          <span className="text-yellow-500 text-[10px]">★</span>
                          <span className="text-[10px] text-[#667085] font-medium">{Number(p.ratings || 0).toFixed(1)}</span>
                        </>
                      )}
                    </div>
                    <p className="font-bold text-sm text-[#20305C]">
                      {Number(p.discountPrice || 0).toLocaleString()} <span className="text-[10px] font-medium text-[#667085]">ETB</span>
                    </p>
                    {p.discountPrice && p.originalPrice && p.discountPrice < p.originalPrice && (
                      <p className="text-[10px] text-gray-400 line-through mt-0.5">{Number(p.originalPrice || 0).toLocaleString()} ETB</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Shops */}
      {topShops.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#171A21]">Popular Shops</h2>
            <Link to="/my-dashboard/shops" className="text-sm font-semibold text-[#20305C] hover:text-[#2C3F6E] transition">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {topShops.map((shop) => (
              <Link
                key={shop._id}
                to={`/my-dashboard/shops/${shop._id || shop.slug}`}
                className="flex items-center gap-3 p-3 sm:p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#20305C]/30 hover:shadow-md transition"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#20305C]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {shop.avatar ? (
                    <img src={shop.avatar} alt={shop.name || 'Shop'} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm sm:text-lg font-bold text-[#20305C]">{(shop.name || 'S').charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-[#171A21] truncate">{shop.name || 'Shop'}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {shop.ratings > 0 && (
                      <>
                        <span className="text-yellow-500 text-[10px]">★</span>
                        <span className="text-[10px] text-[#667085] font-medium">{Number(shop.ratings || 0).toFixed(1)}</span>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#667085]">{shop.productCount || shop.products?.length || 0} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {recommendedProducts.length === 0 && activeOrders.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB]">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MdShoppingBag className="text-3xl text-gray-300" />
          </div>
          <p className="text-[#667085] font-medium mb-1">No activity yet</p>
          <p className="text-[#667085] text-sm mb-5">Start shopping to see your orders and recommendations here</p>
          <Link
            to="/my-dashboard/marketplace"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#20305C] text-white rounded-xl text-sm font-semibold hover:bg-[#2C3F6E] transition"
          >
            Browse Products <MdOutlineArrowForward size={16} />
          </Link>
        </div>
      )}
    </div>
  )
}

export default BuyerOverviewPage
