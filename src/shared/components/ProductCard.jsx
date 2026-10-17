import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiFillHeart, AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai'
import { ProductImage } from '@/components/common/ImageWithFallback'
import Loading from '@/components/common/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistThunks'
import { addTocart, updateCartQuantity } from '@/store/slices/cartThunks'
import { toast } from 'react-toastify'
import Ratings from '@/components/common/Ratings'

const ProductCard = ({ data, variant = 'default', basePath = '' }) => {
  const [click, setClick] = useState(false)
  const [navigating, setNavigating] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Delay before force-navigating to the product detail page so a loading
  // state can be shown to the user after they click a product.
  const PRODUCT_CLICK_DELAY_MS = 800

  const handleProductClick = (event, path) => {
    event.preventDefault()
    setNavigating(true)
    setTimeout(() => {
      navigate(path)
    }, PRODUCT_CLICK_DELAY_MS)
  }
  const { wishlist } = useSelector((state) => state.wishlist || {})
  const { cart } = useSelector((state) => state.cart || {})
  const { isAuthenticated } = useSelector((state) => state.user || {})

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
        toast.error('Only ' + availableUnits + ' items available in stock')
        return
      }
      await dispatch(updateCartQuantity(id, nextQty))
      toast.success('Cart updated')
    } else {
      if (availableUnits < 1) {
        toast.error('Product stock limited!')
      } else {
        const added = await dispatch(addTocart({ ...data, quantity: 1 }))
        if (added) toast.success('Item added to cart')
      }
    }
  }

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save items to your wishlist')
      return
    }
    if (click) {
      await dispatch(removeFromWishlist(data))
      toast.success('Removed from wishlist')
    } else {
      await dispatch(addToWishlist(data))
      toast.success('Saved to wishlist')
    }
  }

  const inStock = availableUnits > 0
  const lowStock = inStock && availableUnits <= 8
  const bestSeller = soldCount > 10

  // Format rating display: "4.5★ (234 reviews)"
  const ratingDisplay = rating ? `${rating}★ (${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'})` : ''

  // Show a loading state while the click-delay waits before force-navigating
  // to the product detail page.
  if (navigating) {
    return <Loading variant="inline" label="Loading product…" />
  }

  return (
    <article className='market-amazon-product-card group'>
      {/* Wishlist button - top right with 44px touch target */}
      {!isPublic && (
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
        <div className='market-amazon-product-image group-hover:scale-105'>
          <ProductImage data={data} className='w-full h-full object-cover' />
          
          {/* Sale badge - top left */}
          {isOnSale && (
            <span className='absolute top-2 left-2 inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold tracking-tight uppercase bg-[#75d04b] text-white shadow-md'>
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
            <span className='absolute top-2 left-2 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight uppercase bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 shadow-md'>
              Only {availableUnits} left
            </span>
          )}
          
          {/* Best seller badge - top right */}
          {bestSeller && (
            <span className='absolute top-2 right-2 inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold tracking-tight uppercase bg-orange-500 text-white shadow-md'>
              Best seller
            </span>
          )}
          
          {/* Prime badge - bottom left */}
          {data?.isPrime && (
            <span className='absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold tracking-tight uppercase bg-blue-600 text-white shadow-md'>
              Prime
            </span>
          )}
        </div>
      </Link>

      <div className='market-amazon-product-body'>
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

        {/* Price section: with strikethrough original and savings badge */}
        <div className='mb-1.5'>
          <div className='flex items-center gap-2 flex-wrap'>
            <span className='text-lg font-bold text-[#131921] dark:text-white'>{Number(displayPrice).toLocaleString()} ETB</span>
            {isOnSale && (
              <>
                <span className='text-xs line-through text-[#6b7280]'>{Number(originalPrice).toLocaleString()} ETB</span>
              </>
            )}
          </div>
        </div>

        {/* Stock status badge */}
        {inStock && !lowStock && (
          <p className='text-xs font-semibold text-green-700 dark:text-green-400 mb-1.5 inline-block px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded'>
            ✓ In stock
          </p>
        )}
        {lowStock && inStock && (
          <p className='text-xs font-semibold text-red-700 dark:text-red-400 mb-1.5 inline-block px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded'>
            Only {availableUnits} left
          </p>
        )}
        {!inStock && (
          <p className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 inline-block px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded'>
            Out of stock
          </p>
        )}

        {/* Add to cart button or link */}
        {!isPublic ? (
          <button
            type='button'
            onClick={AddToCartHandler}
            disabled={!inStock}
            className={`w-full mt-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 min-h-[44px] ${
              inStock
                ? 'bg-[#75d04b] text-white hover:bg-[#5ac12f] active:scale-95 shadow-sm hover:shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700'
            }`}
            aria-label={!inStock ? name + ' is out of stock' : 'Add ' + name + ' to cart'}
          >
            <AiOutlineShoppingCart size={18} /> Add to cart
          </button>
        ) : (
          <Link
            to='/login'
            className='w-full mt-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm text-[#75d04b] border-2 border-[#75d04b] hover:bg-[#75d04b] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md min-h-[44px]'
          >
            Sign in to buy
          </Link>
        )}
      </div>
    </article>
  );
}

export default ProductCard
