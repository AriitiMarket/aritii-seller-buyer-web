import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { productService } from '@/services'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import { ProductImage } from '@/components/common/ImageWithFallback'
import { getImageGallery } from '@/shared/utils/image'
import Rating from '@/components/common/Ratings'
import { formatCurrency } from '@/features/marketplace/utils/format'
import Loading from '@/components/common/Loading'
import EmptyState from '@/components/common/EmptyState'
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineShareAlt,
  AiOutlineCheckCircle,
  AiOutlineSafety,
  AiOutlineEnvironment,
  AiOutlineShop,
  AiOutlineThunderbolt,
} from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistThunks'
import { addTocart } from '@/store/slices/cartThunks'
import { toast } from 'react-toastify'
import ProductCard from '@/shared/components/ProductCard'
import { useLayout } from '@/app/providers/LayoutContext'
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation'

const ProductDetailPage = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { openLoginModal } = useLayout()
  const { regionName, cityName, zoneName, hasLocation } = useDeliveryLocation()

  // Read-only peek at the shared catalogue
  const allProducts = useSelector((state) => state.products?.allProducts || [])
  const [data, setData] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inWishlist, setInWishlist] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [viewedId, setViewedId] = useState(id)
  const [quantity, setQuantity] = useState(1)
  const { isAuthenticated } = useSelector((state) => state.user || {})

  // Every stored image reference, resolved for the browser.
  const gallery = React.useMemo(() => getImageGallery(data), [data])

  if (viewedId !== id) {
    setViewedId(id)
    setActiveImage(0)
    setQuantity(1)
  }

  // Load the product: from the shared catalogue when available, otherwise fetch
  useEffect(() => {
    if (!id) return undefined;
    const fromStore = allProducts.find((item) => (item._id || item.id) === id);
    if (fromStore) {
      setData(fromStore);
      setLoading(false);
      return undefined;
    }
    let active = true;
    setLoading(true);
    productService.getPublicById(id).then((product) => {
      if (!active) return;
      setData(product);
      setLoading(false);
    }).catch((err) => {
      if (!active) return;
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id, allProducts]);

  // Related products query based on real category
  useEffect(() => {
    if (!data) return undefined;
    let active = true;
    const filters = { page: 1, limit: 12 };
    if (data.category) filters.category = data.category;
    productService.getPublicFiltered(filters)
      .then((res) => {
        if (active) setRelated(res?.products || []);
      })
      .catch(() => {
        if (active) setRelated([]);
      });
    return () => {
      active = false;
    };
  }, [data]);

  const sourcePath = location.state?.from;
  const productsLink = sourcePath?.startsWith('/') && !sourcePath.startsWith('/product/')
    ? sourcePath
    : '/products';
  const sourceLabel = productsLink.startsWith('/best-selling')
    ? 'Best Sellers'
    : productsLink.startsWith('/shops')
      ? 'Shops'
      : productsLink.startsWith('/deals')
        ? 'Deals'
        : productsLink.startsWith('/categories')
          ? 'Categories'
          : 'Products';

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      openLoginModal('BUYER')
      return
    }
    if (inWishlist) {
      await dispatch(removeFromWishlist(data))
      toast.success('Removed from wishlist', { toastId: 'wishlist-action' })
    } else {
      await dispatch(addToWishlist(data))
      toast.success('Saved to wishlist', { toastId: 'wishlist-action' })
    }
    setInWishlist(!inWishlist)
  }

  const handleAddToCart = async () => {
    if (!data) return
    await dispatch(addTocart({ ...data, quantity }))
  }

  const handleBuyNow = async () => {
    if (!data) return
    if (!isAuthenticated) {
      openLoginModal('BUYER')
      return
    }
    await dispatch(addTocart({ ...data, quantity }))
    navigate('/checkout')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data?.name || 'Aritii Product',
          url: window.location.href,
        })
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
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
  const deliveryLocationText = hasLocation
    ? [zoneName, cityName, regionName].filter(Boolean).join(', ')
    : 'Ethiopia (Nationwide)'

  const relatedProducts = React.useMemo(() => {
    if (!data) return []
    const currentId = data._id || data.id
    const candidates = related.filter((p) => (p._id || p.id) !== currentId)
    const fromSameShop = candidates.filter(
      (p) => shopId && (p.shop?._id || p.shopId) === shopId
    )
    const fromSameCategory = candidates.filter(
      (p) => category && p.category === category && !fromSameShop.includes(p)
    )
    const seen = new Set()
    return [...fromSameShop, ...fromSameCategory, ...candidates]
      .filter((p) => {
        const productId = p._id || p.id
        if (!productId || seen.has(productId)) return false
        seen.add(productId)
        return true
      })
      .slice(0, 12)
  }, [data, related, category, shopId])

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Home', to: '/' },
        { label: sourceLabel, to: productsLink },
        ...(category ? [{ label: category, to: `/products?category=${encodeURIComponent(category)}` }] : []),
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
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Left Column: Image Gallery (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-4">
                <div className="relative w-full aspect-square bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex items-center justify-center">
                  <ProductImage
                    src={gallery[activeImage] || undefined}
                    data={data}
                    objectFit="contain"
                    className="w-full h-full object-contain p-4 sm:p-8"
                  />
                  {availableUnits < 1 && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded-md shadow-sm">
                      Out of stock
                    </span>
                  )}
                  {lowStock && availableUnits >= 1 && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold uppercase rounded-md shadow-sm">
                      Only {availableUnits} left
                    </span>
                  )}
                  {data?.originalPrice && data?.originalPrice > displayPrice && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-[#cc0c39] text-white text-xs font-extrabold uppercase rounded-md shadow-sm">
                      {Math.round(((data.originalPrice - displayPrice) / data.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                {gallery.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {gallery.map((src, index) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        aria-label={`Show image ${index + 1}`}
                        aria-current={index === activeImage}
                        className={`aspect-square overflow-hidden rounded-lg border bg-white dark:bg-gray-800 transition-all ${
                          index === activeImage
                            ? 'border-[#75d04b] ring-2 ring-[#75d04b]/40 shadow-sm'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={src}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Secure Trust Highlights */}
                <div className="bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mt-2">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <AiOutlineSafety size={18} className="text-[#75d04b] flex-shrink-0" />
                      <span>Escrow Protection</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <AiOutlineThunderbolt size={18} className="text-[#FF9900] flex-shrink-0" />
                      <span>Direct Local Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <AiOutlineCheckCircle size={18} className="text-blue-500 flex-shrink-0" />
                      <span>Verified Merchant</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <AiOutlineCheckCircle size={18} className="text-green-500 flex-shrink-0" />
                      <span>Easy 7-Day Returns</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Column: Product Details & Shop Info (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                  {/* Shop header */}
                  {data?.shop && (
                    <div className="flex items-center gap-2 mb-2">
                      <AiOutlineShop size={16} className="text-gray-500" />
                      <Link
                        to={shopId ? `/shops/${shopId}` : '/shops'}
                        className="text-xs font-bold text-[#75d04b] hover:text-[#5ac12f] hover:underline"
                      >
                        Visit the {data.shop.name || 'Store'}
                      </Link>
                    </div>
                  )}

                  <h1 className="text-xl sm:text-2xl font-bold text-[#0F1111] dark:text-white leading-snug">
                    {data?.name || 'Product'}
                  </h1>

                  {/* Rating + Sold info */}
                  <div className="flex items-center gap-3 mt-2">
                    <Rating rating={rating} />
                    {soldCount > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({soldCount} verified purchases)
                      </span>
                    )}
                  </div>
                </div>

                {/* Price Display */}
                <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-gray-500">ETB</span>
                    <span className="text-3xl font-extrabold text-[#0F1111] dark:text-white">
                      {Number(displayPrice).toLocaleString()}
                    </span>
                    {data?.originalPrice && data.originalPrice > displayPrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        {Number(data.originalPrice).toLocaleString()} ETB
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    All prices inclusive of local VAT where applicable.
                  </p>
                </div>

                {/* Description */}
                {data?.description && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-[#0F1111] dark:text-white">About this item</h3>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {data.description}
                    </p>
                  </div>
                )}

                {/* Product Meta specs */}
                <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-800">
                  {category && (
                    <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                      <span className="font-medium text-gray-500">Category:</span>
                      <Link to={`/products?category=${encodeURIComponent(category)}`} className="text-[#75d04b] hover:underline font-semibold">
                        {category}
                      </Link>
                    </div>
                  )}
                  {data?.brand && (
                    <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                      <span className="font-medium text-gray-500">Brand:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{data.brand}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                    <span className="font-medium text-gray-500">Stock Availability:</span>
                    <span className={`font-bold ${inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600'}`}>
                      {inStock ? (lowStock ? `Only ${availableUnits} available` : 'In Stock') : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Buy Box (3 cols) */}
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-md space-y-4 sticky top-24">
                  {/* Price */}
                  <div>
                    <span className="text-2xl font-black text-[#0F1111] dark:text-white">
                      {formatCurrency(displayPrice)}
                    </span>
                  </div>

                  {/* Delivery Info */}
                  <div className="text-xs text-gray-700 dark:text-gray-300 space-y-2 bg-gray-50 dark:bg-gray-800/60 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-1.5">
                      <AiOutlineEnvironment size={16} className="text-[#75d04b] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Deliver to: </span>
                        <span className="font-bold text-gray-900 dark:text-white">{deliveryLocationText}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-green-700 dark:text-green-400 font-medium pl-5">
                      Fast local transit available
                    </p>
                  </div>

                  {/* Stock state */}
                  {inStock ? (
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">
                      In Stock
                    </p>
                  ) : (
                    <p className="text-sm font-bold text-red-600">
                      Currently Unavailable
                    </p>
                  )}

                  {/* Quantity Stepper */}
                  {inStock && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Quantity:</label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-bold text-sm text-[#0F1111] dark:text-white">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.min(availableUnits, q + 1))}
                          className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={!inStock}
                      className={`w-full py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                        inStock
                          ? 'bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] active:scale-98'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <AiOutlineShoppingCart size={18} />
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      onClick={handleBuyNow}
                      disabled={!inStock}
                      className={`w-full py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm shadow-sm transition-all ${
                        inStock
                          ? 'bg-[#FFA41C] hover:bg-[#FA8900] text-[#0F1111] active:scale-98'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Wishlist & Share controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
                    <button
                      type="button"
                      onClick={toggleWishlist}
                      className="flex items-center gap-1.5 hover:text-[#75d04b] transition-colors"
                    >
                      {inWishlist ? <AiFillHeart size={16} className="text-[#75d04b]" /> : <AiOutlineHeart size={16} />}
                      <span>{inWishlist ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="flex items-center gap-1 hover:text-[#75d04b] transition-colors"
                    >
                      <AiOutlineShareAlt size={16} />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Merchant & Security note */}
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 space-y-1 pt-2 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between">
                      <span>Ships from:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">Aritii Fleet</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sold by:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{data?.shop?.name || 'Local Seller'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Returns:</span>
                      <span className="text-[#007185] dark:text-[#42a2b3]">Eligible for return</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations / Related Products */}
            {relatedProducts.length > 0 && (
              <section className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8" aria-labelledby="related-products-heading">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 id="related-products-heading" className="text-xl sm:text-2xl font-bold text-[#0F1111] dark:text-white">
                      Customers also viewed
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {category ? `Related products in ${category}` : 'Recommended picks for you'}
                    </p>
                  </div>
                  {category && (
                    <Link
                      to={`/products?category=${encodeURIComponent(category)}`}
                      className="text-xs sm:text-sm text-[#007185] dark:text-[#42a2b3] font-bold hover:underline"
                    >
                      Explore more in {category} →
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {relatedProducts.map((p) => (
                    <ProductCard key={p._id || p.id} data={p} variant={isAuthenticated ? 'default' : 'public'} />
                  ))}
                </div>
              </section>
            )}
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
