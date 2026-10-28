import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiFillHeart, AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai'
import { ProductImage } from '@/components/common/ImageWithFallback'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistThunks'
import { addTocart, updateCartQuantity } from '@/store/slices/cartThunks'
import { toast } from 'react-toastify'
import Ratings from '@/components/common/Ratings'
import { useLayout } from '@/app/providers/LayoutContext'

const ProductCard = ({ data, variant = 'default', basePath = '' }) => {
  const [click, setClick] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Navigate to the product detail page immediately, remembering where the
  // user came from so the detail page can offer a "back" link. (The card used
  // to wait 800ms and flash a loading placeholder before navigating, which
  // made the grid feel broken and differed from ProductListItem.)
  const handleProductClick = (event, path) => {
    event.preventDefault()
    navigate(path, { state: { from: `${location.pathname}${location.search}` } })
  }
  const { wishlist } = useSelector((state) => state.wishlist || {})
  const { cart } = useSelector((state) => state.cart || {})
  const { isAuthenticated } = useSelector((state) => state.user || {})
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
  const originalPrice = data?.originalPrice ?? data?.price
  const soldCount = data?.sold_out ?? data?.total_sell ?? 0
  const reviewCount = data?.review_count ?? data?.reviewCount ?? 0
  const rating = data?.ratings ?? data?.rating ?? 0
  const isOnSale = originalPrice > displayPrice

  const productPath = basePath ? basePath + '/product/' + id : '/product/' + id
  const shopPath = data?.shop?._id
    ? (basePath ? basePath : '') + '/shops/' + data.shop._id
    : (basePath ? basePath : '') + '/shops'

  useEffect(() => {
    const item = wishlist && wishlist.find((i) => (i._id === id || i.productId === id))
    setClick(Boolean(item))
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
    if (click) {
      await dispatch(removeFromWishlist(data))
      toast.success('Removed from wishlist', { toastId: 'wishlist-action' })
    } else {
      await dispatch(addToWishlist(data))
      toast.success('Saved to wishlist', { toastId: 'wishlist-action' })
    }
  }

  const inStock = availableUnits > 0
  const lowStock = inStock && availableUnits <= 8
  const bestSeller = soldCount > 10

  // Format rating display: "4.5★ (234 reviews)"

  return (
    <article className='market-aritii-product-card group'>
      {/* Wishlist button - top right with 44px touch target */}
      {(!isPublic || isAuthenticated) && (
        <button
          type='button'
          onClick={toggleWishlist}
          className={`absolute top-2 right-2 h-11 w-11 rounded-full shadow-md flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#75d04b]/30 transition-all z-10 min-h-[44px] min-w-[44px] ${
            click 
              ? 'bg-[#75d04b] text-white' 
              : 'bg-white/95 text-[#131921] hover:bg-white hover:shadow-lg'
          }`}
          aria-label={click ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          {click ? <AiFillHeart size={20} className='text-white' /> : <AiOutlineHeart size={20} />}
        </button>
      )}

      {/* Image section: 100% width, 1:1 aspect ratio with hover scale */}
      <Link
        to={productPath}
        onClick={(event) => handleProductClick(event, productPath)}
        className='block overflow-hidden'
      >
        <div className='market-aritii-product-image group-hover:scale-105'>
          <ProductImage data={data} className='w-full h-full object-cover' />
          
          {/* Sale badge - top left */}
          {isOnSale && (
            <span className='absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-tight uppercase bg-[#cc0c39] text-white shadow-sm'>
              {Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}% off
            </span>
          )}
          
          {/* Out of stock overlay */}
          {availableUnits < 1 && (
            <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>Out of stock</span>
            </div>
          )}
          
          {/* Stock status - top left (only if not sale badge) */}
          {!isOnSale && lowStock && availableUnits > 0 && (
            <span className='absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-tight uppercase bg-[#b12704] text-white shadow-sm'>
              Limited deal
            </span>
          )}
          
          {/* Best seller badge - top right */}
          {bestSeller && (
            <span className='absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold tracking-tight uppercase bg-[#e67a00] text-white shadow-sm'>
              #1 Best Seller
            </span>
          )}
          
          {/* Prime / Fast badge - bottom left */}
          {data?.isPrime && (
            <span className='absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold tracking-tight uppercase bg-blue-600 text-white shadow-md'>
              Aritii Express
            </span>
          )}
        </div>
      </Link>

      <div className='market-aritii-product-body'>
        {/* Shop name link */}
        <Link to={shopPath} className='mb-1 block'>
          <p className='text-xs text-[#6b7280] hover:text-[#75d04b] transition-colors line-clamp-1 font-medium'>{shopName}</p>
        </Link>

        {/* Product title: 2-line max with ellipsis */}
        <Link
          to={productPath}
          onClick={(event) => handleProductClick(event, productPath)}
          className='block mb-1.5'
        >
          <h4 className='text-sm font-semibold text-[#131921] dark:text-white line-clamp-2 leading-snug hover:text-[#75d04b] transition-colors'>{name}</h4>
        </Link>

        {/* Rating: Stars + review count (e.g., "4.5★ (234 reviews)") */}
        {rating > 0 && (
          <div className='flex items-center gap-1.5 mb-1.5'>
            <div className='flex items-center'>
              <Ratings rating={rating} />
            </div>
            <span className='text-xs text-[#6b7280]'>({reviewCount})</span>
          </div>
        )}

        {/* Price section: Aritii prominent price with fractional formatting */}
        <div className='mb-1.5'>
          <div className='flex items-baseline gap-1.5 flex-wrap'>
            <span className='text-xs font-semibold text-[#565959] self-start mt-0.5'>ETB</span>
            <span className='text-xl font-extrabold text-[#0f1111] dark:text-white leading-none tracking-tight'>
              {Number(displayPrice).toLocaleString()}
            </span>
            {isOnSale && (
              <span className='text-xs text-[#565959] line-through ml-1'>
                {Number(originalPrice).toLocaleString()} ETB
              </span>
            )}
          </div>
        </div>

        {/* Delivery / In stock cue */}
        {inStock && !lowStock && (
          <p className='text-xs font-medium text-[#007600] dark:text-green-400 mb-2'>
            In Stock
          </p>
        )}
        {lowStock && inStock && (
          <p className='text-xs font-bold text-[#b12704] mb-2'>
            Only {availableUnits} left in stock - order soon.
          </p>
        )}
        {!inStock && (
          <p className='text-xs font-semibold text-gray-500 mb-2'>
            Currently unavailable
          </p>
        )}

        {/* Add to cart button - Aritii marketplace amber button */}
        <button
          type='button'
          onClick={AddToCartHandler}
          disabled={!inStock}
          className={`w-full mt-auto inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full font-medium text-xs transition-colors duration-150 shadow-sm ${
            inStock
              ? 'bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-[#0f1111] border border-[#fcd200]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
          aria-label={!inStock ? name + ' is out of stock' : 'Add ' + name + ' to cart'}
        >
          <AiOutlineShoppingCart size={15} /> Add to Cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard
