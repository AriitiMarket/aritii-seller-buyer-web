import React, { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { useProducts, useFilteredProducts } from '@/features/marketplace/hooks/useProducts'
import { productService } from '@/services'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import ProductImage from '@/features/marketplace/components/common/ProductImage'
import Rating from '@/features/marketplace/components/common/Ratings'
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

  const relatedProducts = React.useMemo(() => {
    if (!data) return []
    const category = data.category
    const shopId = data.shop?._id || data.shopId
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
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: image gallery (Amazon-style) */}
            <div className="lg:sticky lg:top-24 flex flex-col gap-4">
              <div className="relative w-full aspect-square lg:aspect-auto min-h-[500px] bg-market-surface-container-low rounded-lg border border-market-border overflow-hidden">
                <ProductImage data={data} className="w-full h-full object-contain p-6 lg:p-12" />
                {availableUnits < 1 && (
                  <span className="absolute top-3 left-3 market-stock-tag market-stock-tag-low">Out of stock</span>
                )}
                {lowStock && (
                  <span className="absolute top-3 left-3 market-stock-tag market-stock-tag-low">Only {availableUnits} left</span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2 lg:hidden">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-market-surface-container-low rounded-md border border-market-border" />
                ))}
              </div>
            </div>

            {/* Right: buy box */}
            <div className="flex flex-col lg:flex-col">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Link to={productsLink} className="market-link market-body-sm mb-2 inline-block">← Back to results</Link>
                  <h1 className="market-buy-box-title">{data?.name || 'Product'}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleWishlist}
                    className="w-10 h-10 rounded-full border border-market-border flex items-center justify-center hover:bg-market-surface-container-high transition-colors"
                    aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {inWishlist ? <AiFillHeart size={20} className="text-market-tertiary" /> : <AiOutlineHeart size={20} />}
                  </button>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full border border-market-border flex items-center justify-center hover:bg-market-surface-container-high transition-colors"
                    aria-label="Share product"
                  >
                    <AiOutlineShareAlt size={20} />
                  </button>
                </div>
              </div>

              <div className="market-buy-box">
                <div className="market-buy-box-rating">
                  <Rating rating={rating} />
                  <span className="text-body-sm text-market-on-surface-variant">{soldCount > 0 ? `(${soldCount} bought)` : ''}</span>
                </div>

                <div className="market-buy-box-row">
                  <span className="w-10">Shop:</span>
                  {data?.shop?._id ? (
                    <Link
                      to={`/shops/${data.shop._id}`}
                      className="text-market-primary font-semibold hover:underline transition-colors"
                    >
                      {data.shop.name || 'Unknown shop'}
                    </Link>
                  ) : (
                    <span>{data?.shop?.name || 'Unknown shop'}</span>
                  )}
                </div>

                {data?.category && (
                  <div className="market-buy-box-row">
                    <span className="w-10">Category:</span>
                    <Link to={`/products?category=${encodeURIComponent(data.category)}`} className="text-market-secondary hover:underline">{data.category}</Link>
                  </div>
                )}

                <div className="market-buy-box-divider" />

                <div className="mb-3">
                  <span className="text-body-sm font-semibold text-market-on-surface-variant">Price:</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="market-buy-box-price">{formatCurrency(displayPrice) || 'Contact seller'} ETB</span>
                    {data?.originalPrice && data.originalPrice > data.discountPrice && (
                      <>
                        <span className="market-buy-box-list-price">{formatCurrency(data.originalPrice)} ETB</span>
                        <span className="market-buy-box-saving">{Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)}% off</span>
                      </>
                    )}
                  </div>
                </div>

                {lowStock && (
                  <div className="mb-3">
                    <span className="market-stock-tag market-stock-tag-low">Only {availableUnits} left in stock</span>
                  </div>
                )}

                <div className="market-buy-box-row mb-3">
                  <span className="w-10">
                    <AiOutlineCheckCircle size={16} className="text-green-500" aria-hidden="true" />
                  </span>
                  <span>Fast delivery</span>
                </div>

                <div className="market-buy-box-row mb-3">
                  <span className="w-10">
                    <AiOutlineCheckCircle size={16} className="text-green-500" aria-hidden="true" />
                  </span>
                  <span>30-day return policy</span>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`market-buy-box-cta ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label={!inStock ? data.name + ' is out of stock' : 'Add ' + data.name + ' to cart'}
                >
                  <AiOutlineShoppingCart size={20} className="mr-2" />
                  {inStock ? 'Add to Cart' : 'Out of stock'}
                </button>

                <button
                  type="button"
                  className="market-buy-box-cta secondary"
                  disabled={!inStock}
                >
                  Buy Now
                </button>

                <div className="market-buy-box-divider" />
                <p className="market-body-sm text-market-on-surface-variant">
                  <span className="font-medium text-market-on-surface">Delivery:</span> Estimated 2-5 business days
                </p>
                <p className="market-body-sm text-market-on-surface-variant mt-1">
                  <span className="font-medium text-market-on-surface">Returns:</span> 30-day return policy
                </p>
              </div>

              {data?.description && (
                <div className="mt-6 pt-6 border-t border-market-border">
                  <h3 className="market-title-md text-market-on-surface mb-3">Product Description</h3>
                  <p className="market-body-md text-market-on-surface-variant leading-relaxed whitespace-pre-wrap">{data.description}</p>
                </div>
              )}

              {/* Related products — items from the same category or shop */}
              {data && (
                <div className="mt-10 pt-6 border-t border-market-border">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="market-title-md text-market-on-surface">Related products</h3>
                    <Link
                      to={`/products?category=${encodeURIComponent(data.category || '')}`}
                      className="market-body-sm text-market-primary font-semibold hover:underline"
                    >
                      View all in {data.category || 'this category'} →
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6 overflow-x-auto pb-4 no-scrollbar">
                    {relatedProducts.map((p) => (
                      <ProductCard
                        key={p._id || p.id}
                        data={p}
                        variant="public"
                        basePath=""
                      />
                    ))}
                  </div>
                </div>
              )}
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
