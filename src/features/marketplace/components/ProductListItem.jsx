import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai'
import { ProductImage } from '@/components/common/ImageWithFallback'
import Ratings from '@/components/common/Ratings'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistThunks'
import { addTocart, updateCartQuantity } from '@/store/slices/cartThunks'
import { toast } from 'react-toastify'
import { useLayout } from '@/app/providers/LayoutContext'

const ProductListItem = ({ data, variant = 'default', basePath = '' }) => {
  const dispatch = useDispatch()
  const { wishlist } = useSelector((state) => state.wishlist || {})
  const { cart } = useSelector((state) => state.cart || {})
  const { isAuthenticated } = useSelector((state) => state.user || {})
  const [inWishlist, setInWishlist] = useState(false)
  const { openLoginModal } = useLayout()

  const isPublic = variant === 'public'

  const id = data?._id || data?.id
  const name = data?.name || 'Product'
  const shopName = data?.shop?.name || data?.shopName || ''

  const availableUnits =
    data?.available !== undefined && data?.available !== null
      ? Number(data.available)
      : data?.reserved !== undefined && data?.reserved !== null
        ? Math.max(0, Number(data?.stock ?? 0) - Number(data.reserved))
        : Number(data?.stock ?? 0)

  const displayPrice = data?.discountPrice ?? data?.price ?? 0
  const soldCount = data?.sold_out ?? data?.total_sell ?? 0
  const rating = data?.ratings ?? data?.rating ?? 0

  const productPath = basePath ? basePath + '/product/' + id : '/product/' + id
  const shopPath = data?.shop?._id
    ? (basePath ? basePath : '') + '/shops/' + data.shop._id
    : (basePath ? basePath : '') + '/shops'

  useEffect(() => {
    const item = wishlist && wishlist.find((i) => (i._id === id || i.productId === id))
    setInWishlist(Boolean(item))
  }, [wishlist, id])

  const AddToCartHandler = async () => {
    if (!cart) return
    const isItemExist = cart.find((i) => (i.productId || i._id) === id)
    if (isItemExist) {
      const nextQty = (isItemExist.quantity || 1) + 1
      if (nextQty > availableUnits) {
        toast.error('Only ' + availableUnits + ' available', { toastId: 'cart-stock-limit' })
        return
      }
      await dispatch(updateCartQuantity(id, nextQty))
    } else {
      if (availableUnits < 1) {
        toast.error('Out of stock', { toastId: 'cart-stock-limit' })
      } else {
        await dispatch(addTocart({ ...data, quantity: 1 }))
      }
    }
  }

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save items', { toastId: 'wishlist-action' })
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

  const inStock = availableUnits > 0

  return (
    <article className="market-list-item">
      <Link to={productPath} className="market-list-item-image flex-shrink-0">
        <ProductImage data={data} className="w-full h-full object-cover rounded-md" />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <Link to={shopPath} className="mb-1">
            <p className="market-body-sm text-market-on-surface-variant hover:text-market-secondary transition-colors line-clamp-1">{shopName}</p>
          </Link>

          <Link to={productPath} className="block">
            <h3 className="market-title-md text-market-on-surface line-clamp-2 mb-1">{name}</h3>
          </Link>

          <div className="flex items-center gap-2 mt-1">
            <Ratings rating={rating} />
            {soldCount > 0 && (
              <span className="market-body-sm text-market-on-surface-variant">({soldCount} bought)</span>
            )}
          </div>

          <p className={`market-body-sm mt-1 font-medium ${inStock ? "text-market-price" : "text-market-tertiary"}`}>
            {inStock ? "In Stock" + (availableUnits <= 10 ? " - only " + availableUnits + " left" : "") : "Currently unavailable"}
          </p>

          {data?.category && (
            <p className="market-body-sm text-market-on-surface-variant mt-1 capitalize">in {data.category}</p>
          )}

          {data?.description && (
            <p className="market-body-sm text-market-on-surface-variant mt-2 line-clamp-2 hidden sm:block">{String(data.description).slice(0, 160)}</p>
          )}

          {!isPublic && (
            <button
              type="button"
              onClick={toggleWishlist}
              className="mt-3 self-start inline-flex items-center gap-1.5 market-body-sm text-market-on-surface-variant hover:text-market-secondary transition-colors"
              aria-label={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
            >
              {inWishlist ? <AiFillHeart size={16} className="text-market-tertiary" /> : <AiOutlineHeart size={16} />}
              {inWishlist ? "Saved" : "Save"}
            </button>
          )}
        </div>

        <div className="flex-shrink-0 w-40 flex flex-col items-start">
          <div className="flex items-baseline gap-1">
            <span className="market-body-sm text-market-on-surface">ETB</span>
            <span className="market-price-lg">{Number(displayPrice).toLocaleString()}</span>
          </div>

          {data?.originalPrice && data?.originalPrice > displayPrice && (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="market-original-price">{Number(data.originalPrice).toLocaleString()} ETB</span>
              <span className="market-savings-badge">{Math.round(((data.originalPrice - displayPrice) / data.originalPrice) * 100)}%</span>
            </div>
          )}

          <p className="market-body-sm text-market-on-surface-variant mt-1">
            {displayPrice > 0 ? "ETB " + Math.round(displayPrice * 0.02) + " delivery" : "Delivery calculated at checkout"}
          </p>

          {isPublic ? (
            <button
              type="button"
              onClick={() => openLoginModal('BUYER')}
              className="mt-3 w-full text-center px-3 py-2 market-btn-primary text-market-on-primary"
            >
              Sign in to buy
            </button>
          ) : (
            <button
              type="button"
              onClick={AddToCartHandler}
              disabled={!inStock}
              className={`mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 market-btn-primary ${!inStock ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-label={inStock ? "Add " + name + " to cart" : name + " is out of stock"}
            >
              <AiOutlineShoppingCart size={16} />
              Add to cart
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProductListItem