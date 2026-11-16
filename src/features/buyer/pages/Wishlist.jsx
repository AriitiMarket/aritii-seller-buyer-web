import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { ProductImage } from '@/components/common/ImageWithFallback'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { MdShoppingCart } from 'react-icons/md'
import { toast } from 'react-toastify'
import { addTocart } from '@/store/slices/cartThunks'
import { fetchWishlist, removeFromWishlist } from '@/store/slices/wishlistThunks'

const BuyerWishlistPage = () => {
  const dispatch = useDispatch()
  const { wishlist = [], isLoading, error } = useSelector((state) => state.wishlist || {})

  // Server is the source of truth — re-sync on every visit.
  useEffect(() => {
    dispatch(fetchWishlist())
  }, [dispatch])

  const handleRemoveFromWishlist = async (product) => {
    const removed = await dispatch(removeFromWishlist(product))
    if (removed) toast.success('Removed from wishlist', { toastId: 'wishlist-action' })
  }

  const handleAddToCart = async (product) => {
    if (!product?._id) return
    if (product.stock <= 0) {
      toast.error('Product is out of stock', { toastId: 'cart-stock-limit' })
      return
    }
    const cartData = {
      _id: product._id,
      name: product.name,
      price: product.price,
      discountPrice: product.price,
      image: product.image || product.images?.[0],
      shopId: product.shopId,
      quantity: 1,
    }
    await dispatch(addTocart(cartData))
  }

  if (isLoading && wishlist.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Saved Items</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your favorite products in one place</p>
        </div>
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#75d04b] mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading your saved items...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && wishlist.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Saved Items</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your favorite products in one place</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AiOutlineHeart className="text-3xl text-red-400" />
          </div>
          <p className="text-gray-900 dark:text-white font-medium mb-1">Could not load your wishlist</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => dispatch(fetchWishlist())}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#75d04b] text-white rounded-full text-sm font-semibold hover:brightness-95 transition"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Saved Items</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your favorite products in one place</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AiOutlineHeart className="text-3xl text-red-400" />
          </div>
          <p className="text-gray-900 dark:text-white font-medium mb-1">Your wishlist is empty</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Save items you love to your wishlist</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#75d04b] hover:brightness-95 text-white rounded-full text-sm font-semibold transition shadow-sm"
          >
            Discover Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Saved Items</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f3ffee] dark:bg-[#75d04b]/15 text-[#75d04b] border border-[#75d04b]/30">
              {wishlist.length} item{wishlist.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your saved wishlist — add items directly to your cart or track availability
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition w-fit shadow-sm"
        >
          Continue Shopping →
        </Link>
      </div>

      {error && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            onClick={() => dispatch(fetchWishlist())}
            className="text-amber-900 dark:text-amber-100 font-semibold underline shrink-0"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Wishlist Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {wishlist.map((w) => {
          const p = w.product || w
          const price = Number(p.discountPrice ?? p.price ?? 0)
          const originalPrice = Number(p.originalPrice || 0)
          const outOfStock = typeof p.stock === 'number' && p.stock <= 0
          const shopName = p.shop?.name || p.shopName
          const discountPercent =
            originalPrice > 0 && originalPrice > price
              ? Math.round(((originalPrice - price) / originalPrice) * 100)
              : 0
          return (
            <div key={p._id || w._id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-[#75d04b]/50 transition-all group">
              {/* Image */}
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-900 overflow-hidden">
                <Link to={`/product/${p._id}`}>
                  <ProductImage data={p} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </Link>
                <button
                  onClick={() => handleRemoveFromWishlist(p)}
                  className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                  aria-label="Remove from wishlist"
                >
                  <AiFillHeart size={18} className="text-red-500" />
                </button>
                {discountPercent > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                    -{discountPercent}%
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <Link to={`/product/${p._id}`}>
                  <h3 className="font-semibold text-xs text-gray-900 dark:text-white line-clamp-2 hover:text-[#75d04b] transition leading-snug">
                    {p.name}
                  </h3>
                </Link>
                {shopName && (
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{shopName}</p>
                )}
                {p.unavailable && <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-2">No longer available</p>}
                {p.ratings > 0 && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="text-yellow-500 text-[10px]">★</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{Number(p.ratings || 0).toFixed(1)}</span>
                  </div>
                )}
                <div className="mt-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {price.toLocaleString()} <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">ETB</span>
                  </span>
                  {originalPrice > 0 && originalPrice > price && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 line-through ml-1">{originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(p)}
                  disabled={outOfStock || p.unavailable}
                  className="w-full mt-3 px-3 py-2 bg-[#75d04b] hover:brightness-95 text-white rounded-full text-xs font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <MdShoppingCart size={15} />
                  {p.unavailable ? 'Unavailable' : p.inCart ? 'In Your Cart' : outOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BuyerWishlistPage
