import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AiFillHeart, AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai'
import { ProductImage } from '@/components/common/ImageWithFallback'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistThunks'
import { addTocart, updateCartQuantity } from '@/store/slices/cartThunks'
import { toast } from 'react-toastify'
import Ratings from '@/components/common/Ratings'

const ProductCard = ({ data, variant = 'default', basePath = '' }) => {
  const [click, setClick] = useState(false)
  const dispatch = useDispatch()
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
  const soldCount = data?.sold_out ?? data?.total_sell ?? 0
  const rating = data?.ratings ?? data?.rating ?? 0

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

  return (
    <article className='market-shop-tile'>
      <Link to={productPath} className='block'>
        <div className='market-shop-tile-image relative'>
          <ProductImage data={data} className='w-full h-full object-cover' />
          {availableUnits < 1 && (
            <span className='absolute top-2 left-2 market-stock-tag market-stock-tag-low'>Out of stock</span>
          )}
          {lowStock && (
            <span className='absolute top-2 left-2 market-stock-tag market-stock-tag-low'>Only {availableUnits} left</span>
          )}
          {bestSeller && (
            <span className='absolute top-2 right-2 market-best-seller-badge'>Best seller</span>
          )}
          {!isPublic && (
            <button
              type='button'
              disabled={!inStock}
              className={`absolute bottom-2 right-2 w-9 h-9 rounded-full shadow-md flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-market-secondary/30 transition-colors ${(!inStock) ? 'bg-market-surface-container-high text-market-on-surface-variant cursor-not-allowed' : 'bg-market-primary text-market-on-primary hover:bg-market-primary-hover'}`}
              onClick={AddToCartHandler}
              aria-label={!inStock ? name + ' is out of stock' : 'Add ' + name + ' to cart'}
            >
              <AiOutlineShoppingCart size={18} />
            </button>
          )}
          {!isPublic && (
            <button
              type='button'
              onClick={toggleWishlist}
              className={`absolute top-2 right-2 w-9 h-9 rounded-full shadow-md flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-market-secondary/30 transition-colors ${click ? 'bg-market-tertiary text-market-on-tertiary' : 'bg-market-surface/90 text-market-on-surface hover:bg-market-surface-container-high'}`}
              aria-label={click ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              {click ? <AiFillHeart size={18} className='text-market-on-tertiary' /> : <AiOutlineHeart size={18} />}
            </button>
          )}
          <span className='absolute bottom-2 left-2 market-delivery-tag market-delivery-tag-fast'>Fast delivery</span>
        </div>
      </Link>

      <div className='market-shop-tile-body'>
        <Link to={shopPath} className='mb-1'>
          <p className='market-body-sm text-market-on-surface-variant hover:text-market-secondary transition-colors line-clamp-1'>{shopName}</p>
        </Link>

        <Link to={productPath} className='flex-1'>
          <h4 className='market-title-sm text-market-on-surface line-clamp-2 min-h-[2.6rem] leading-snug hover:text-market-primary transition-colors'>{name}</h4>
        </Link>

        <div className='flex items-center gap-1 mt-2 mb-1'>
          <Ratings rating={rating} />
          {soldCount > 0 && (
             <span className='market-body-sm text-market-on-surface-variant'>({soldCount} bought)</span>
          )}
        </div>

        <div className='market-shop-tile-price-row'>
          <span className='market-shop-tile-price'>{Number(displayPrice).toLocaleString()} ETB</span>
          {data?.originalPrice && data?.originalPrice > displayPrice && (
            <div className='flex items-center gap-2'>
              <span className='market-original-price'>{Number(data.originalPrice).toLocaleString()} ETB</span>
              <span className='market-savings-badge'>{Math.round(((data.originalPrice - displayPrice) / data.originalPrice) * 100)}% off</span>
            </div>
          )}
        </div>

        {lowStock && (
          <p className='market-body-sm mt-1 text-market-tertiary font-semibold'>Hurry, only {availableUnits} left in stock.</p>
        )}

        {!isPublic ? (
          <button
            type='button'
            onClick={AddToCartHandler}
            disabled={!inStock}
            className={`market-shop-tile-action ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={!inStock ? name + ' is out of stock' : 'Add ' + name + ' to cart'}
          >
            <AiOutlineShoppingCart size={16} /> Add to cart
          </button>
        ) : (
          <Link
            to='/login'
            className='market-shop-tile-action public'
          >
            Sign in to buy
          </Link>
        )}
      </div>
    </article>
  );
}

export default ProductCard
