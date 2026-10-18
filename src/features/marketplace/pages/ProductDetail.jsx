import React, { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { useProducts, useFilteredProducts } from '@/features/marketplace/hooks/useProducts'
import { productService } from '@/services'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import ProductImage from '@/features/marketplace/components/common/ProductImage'
import Rating from '@/components/common/Ratings'
import { formatCurrency } from '@/features/marketplace/utils/format'
import Loading from '@/components/common/Loading'
import EmptyState from '@/components/common/EmptyState'
import { AiFillHeart, AiOutlineHeart, AiOutlineShoppingCart, AiOutlineShareAlt, AiOutlineCheckCircle } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistThunks'
import { addTocart } from '@/store/slices/cartThunks'
import { toast } from 'react-toastify'
import ProductCard from '@/shared/components/ProductCard'

const ProductDetailPage = () => {
  const { id } = useParams()
  const location = useLocation()
  const { products: allProducts = [], loading: productsLoading, error: productsError } = useProducts()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(productsError || null)
  const [inWishlist, setInWishlist] = useState(false)
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.user || {})

  useEffect(() => {
    if (id) {
      const fromStore = allProducts.find(
        (item) => (item._id || item.id) === id
      )
      if (fromStore) {
        setData(fromStore)
        setLoading(false)
        return
      }
    }
    setLoading(false)
  }, [id, allProducts])

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productService.getPublicById(id).then((product) => {
      setData(product);
      setLoading(false);
    }).catch((err) => {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    });
  }, [id]);

  const referrer = location.state?.from || document.referrer
  const productsLink = referrer && referrer.includes('/products')
    ? '/products'
    : '/'

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save items to your wishlist')
      return
    }
    if (inWishlist) {
      await dispatch(removeFromWishlist(data))
      toast.success('Removed from wishlist')
    } else {
      await dispatch(addToWishlist(data))
      toast.success('Saved to wishlist')
    }
    setInWishlist(!inWishlist)
  }

  const handleAddToCart = async () => {
    if (!data) return
    await dispatch(addTocart({ ...data, quantity: 1 }))
    toast.success('Added to cart')
  }

  const displayPrice = data?.discountPrice ?? data?.price ?? 0
  const soldCount = data?.sold_out ?? data?.total_sell ?? 0
  const rating = data?.ratings ?? data?.rating ?? 0
  const availableUnits =
    data?.available !== undefined && data?.available !== null
      ? Number(data.available)
      : data?.reserved !== undefined && data?.reserved !== null
        ? Math.max(0, Number(data?.stock ?? 0) - Number(data.reserved))
        : Number(data?.stock ?? 0)
  const inStock = availableUnits > 0
  const lowStock = inStock && availableUnits <= 8

  const category = data?.category
  const shopId = data?.shop?._id || data?.shopId
  const relatedProducts = React.useMemo(() => {
    if (!data) return []
    return allProducts
      .filter((p) => (p._id || p.id) !== (data._id || data.id))
      .filter(
        (p) =>
          (category && p.category === category) ||
          (shopId && (p.shop?._id || p.shopId) === shopId)
      )
      .slice(0, 8)
  }, [data, allProducts, category, shopId])

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Home', to: '/' },
        { label: 'Products', to: '/products' },
      ]} />

      {loading ? (
        <Loading variant="inline" label="Loading product details…" />
      ) : error ? (
        <EmptyState
          title="Could not load product"
          description={error}
          action={
            <Link to="/products" className="market-btn-primary">
              Browse products
            </Link>
          }
        />
      ) : data ? (
        <div className="w-full py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-0">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Left: image gallery */}
              <div className="lg:sticky lg:top-24 flex flex-col gap-3 sm:gap-4">
                <div className="relative w-full aspect-square bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <ProductImage data={data} className="w-full h-full object-contain p-4 sm:p-6 lg:p-12" />
                  {availableUnits < 1 && (
                    <span className="absolute top-3 left-3 inline-block px-3 py-1.5 bg-red-100 text-red-700 text-xs sm:text-sm font-bold rounded">Out of stock</span>
                  )}
                  {lowStock && availableUnits >= 1 && (
                    <span className="absolute top-3 left-3 inline-block px-3 py-1.5 bg-orange-100 text-orange-700 text-xs sm:text-sm font-bold rounded">Only {availableUnits} left</span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2 lg:hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600" />
                  ))}
                </div>
              </div>

              {/* Right: buy box */}
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                  <div className="min-w-0">
                    <Link to={productsLink} className="text-sm text-[#75d04b] hover:text-[#5ac12f] mb-2 inline-block">← Back to results</Link>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#131921] dark:text-white break-words">{data?.name || 'Product'}</h1>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={toggleWishlist}
                      className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] min-w-[44px]"
                      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      {inWishlist ? <AiFillHeart size={20} className="text-[#75d04b]" /> : <AiOutlineHeart size={20} />}
                    </button>
                    <button
                      type="button"
                      className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] min-w-[44px]"
                      aria-label="Share product"
                    >
                      <AiOutlineShareAlt size={20} />
                    </button>
                  </div>
                </div>

                {/* Buy Box Card */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 space-y-4">
                  {/* Rating */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Rating rating={rating} />
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{soldCount > 0 ? `(${soldCount} bought)` : ''}</span>
                  </div>

                  {/* Shop */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Shop:</span>
                    {data?.shop?._id ? (
                      <Link
                        to={`/shops/${data.shop._id}`}
                        className="text-[#75d04b] font-semibold hover:text-[#5ac12f] transition-colors break-words"
                      >
                        {data.shop.name || 'Unknown shop'}
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-700 dark:text-gray-300">{data?.shop?.name || 'Unknown shop'}</span>
                    )}
                  </div>

                  {/* Category */}
                  {data?.category && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Category:</span>
                      <Link to={`/products?category=${encodeURIComponent(data.category)}`} className="text-[#75d04b] hover:text-[#5ac12f] hover:underline text-sm break-words">{data.category}</Link>
                    </div>
                  )}

                  <hr className="border-gray-200 dark:border-gray-700" />

                  {/* Price */}
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Price:</span>
                    <div className="flex flex-wrap items-baseline gap-2 mt-2">
                      <span className="text-2xl sm:text-3xl font-bold text-[#131921] dark:text-white">{formatCurrency(displayPrice) || 'Contact seller'} ETB</span>
                      {data?.originalPrice && data.originalPrice > data.discountPrice && (
                        <>
                          <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 line-through">{formatCurrency(data.originalPrice)} ETB</span>
                          <span className="text-xs sm:text-sm font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">{Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)}% off</span>
                        </>
                      )}
                    </div>
                  </div>

                  {lowStock && availableUnits >= 1 && (
                    <div className="inline-block px-3 py-1.5 bg-orange-100 text-orange-700 text-xs sm:text-sm font-bold rounded">
                      Only {availableUnits} left in stock
                    </div>
                  )}

                  {/* Benefits */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <AiOutlineCheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Fast delivery</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <AiOutlineCheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">30-day return policy</span>
                    </div>
                  </div>

                  <hr className="border-gray-200 dark:border-gray-700" />

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    className={`w-full px-4 py-3 sm:py-4 rounded-lg font-bold text-white text-sm sm:text-base flex items-center justify-center gap-2 transition-colors min-h-[44px] ${
                      inStock
                        ? 'bg-[#75d04b] hover:bg-[#5ac12f] active:bg-[#4ab01f]'
                        : 'bg-gray-400 cursor-not-allowed opacity-60'
                    }`}
                    aria-label={!inStock ? data.name + ' is out of stock' : 'Add ' + data.name + ' to cart'}
                  >
                    <AiOutlineShoppingCart size={20} />
                    {inStock ? 'Add to Cart' : 'Out of stock'}
                  </button>

                  {/* Buy Now Button */}
                  <button
                    type="button"
                    className="w-full px-4 py-3 sm:py-4 rounded-lg font-bold text-[#75d04b] border-2 border-[#75d04b] hover:bg-[#75d04b]/10 transition-colors text-sm sm:text-base min-h-[44px]"
                    disabled={!inStock}
                  >
                    Buy Now
                  </button>
                </div>

                {/* Description */}
                {data?.description && (
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-[#131921] dark:text-white mb-3">Product Description</h3>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{data.description}</p>
                  </div>
                )}

                {/* Related products */}
                {relatedProducts.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-[#131921] dark:text-white">Related Products</h3>
                      <Link
                        to={`/products?category=${encodeURIComponent(data.category || '')}`}
                        className="text-xs sm:text-sm text-[#75d04b] font-semibold hover:text-[#5ac12f]"
                      >
                        View all in {data.category || 'this category'} →
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                      {relatedProducts.map((p) => (
                        <ProductCard
                          key={p._id || p.id}
                          data={p}
                          variant="public"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="Product not found"
          description="The product you're looking for might be unavailable or the link might be broken."
          action={
            <Link to="/products" className="market-btn-primary">
              Go to products
            </Link>
          }
        />
      )}
    </>
  )
}

export default ProductDetailPage
