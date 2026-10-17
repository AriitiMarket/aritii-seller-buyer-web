import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai'
import { ProductImage } from '@/components/common/ImageWithFallback'
import Ratings from '@/components/common/Ratings'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistThunks'
import { addTocart, updateCartQuantity } from '@/store/slices/cartThunks'
import { toast } from 'react-toastify'

const ProductListItem = ({ data, variant = 'default', basePath = '' }) => {
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

  return (
    <article className='market-list-item'>
      <Link to={productPath} className='market-list-item-image flex-shrink-0 block relative'>
        <ProductImage data={data} className='w-full h-full object-cover rounded-md' />
        {availableUnits < 1 && (
          <span className='absolute top-1 left-1 market-stock-tag market-stock-tag-low text-[10px]'>Out of stock</span>
        )}
        {lowStock && (
          <span className='absolute top-1 left-1 market-stock-tag market-stock-tag-low text-[10px]'>Only {availableUnits} left</span>
        )}
      </Link>

      <div className='flex-1 min-w-0 flex flex-col justify-between'>
        <div>
          <Link to={shopPath} className='mb-1'>
            <p className='market-body-sm text-market-on-surface-variant hover:text-market-secondary transition-colors line-clamp-1'>{shopName}</p>
          </Link>

          <Link to={productPath} className='block'>
            <h3 className='market-title-md text-market-on-surface line-clamp-2 mb-1 hover:text-market-primary transition-colors'>{name}</h3>
          </Link>

          <div className='flex items-center gap-2 mt-1'>
            <Ratings rating={rating} />
            {soldCount > 0 && (
              <span className='market-body-sm text-market-on-surface-variant'>({soldCount} bought)</span>
            )}
          </div>

          <p className={`market-body-sm mt-1 font-medium ${inStock ? 'text-market-price' : 'text-market-tertiary'}`}>
            {inStock ? 'In Stock' + (availableUnits <= 10 ? ' - only ' + availableUnits + ' left' : '') : 'Currently unavailable'}
          </p>

          {data?.category && (
            <p className='market-body-sm text-market-on-surface-variant mt-1 capitalize'>in {data.category}</p>
          )}

          {!isPublic && (
            <button
              type='button'
              onClick={toggleWishlist}
              className='mt-3 self-start inline-flex items-center gap-1.5 market-body-sm text-market-on-surface-variant hover:text-market-secondary transition-colors'
              aria-label={click ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              {click ? <AiFillHeart size={16} className='text-market-tertiary' /> : <AiOutlineHeart size={16} />}
              {click ? 'Saved' : 'Save'}
            </button>
          )}
        </div>

        <div className='flex-shrink-0 w-48 flex flex-col items-start'>
          <div className='flex items-baseline gap-1 mb-1'>
            <span className='market-body-sm text-market-on-surface'>ETB</span>
            <span className='market-price-lg'>{Number(displayPrice).toLocaleString()}</span>
          </div>

          {data?.originalPrice && data?.originalPrice > displayPrice && (
            <div className='flex items-center gap-2 mt-0.5'>
              <span className='market-original-price'>{Number(data.originalPrice).toLocaleString()} ETB</span>
              <span className='market-savings-badge'>{Math.round(((data.originalPrice - displayPrice) / data.originalPrice) * 100)}%</span>
            </div>
          )}

          <p className='market-body-sm text-market-on-surface-variant mt-1'>
            {displayPrice > 0 ? 'ETB ' + Math.round(displayPrice * 0.02) + ' delivery' : 'Delivery calculated at checkout'}
          </p>

          <span className='absolute bottom-2 left-2 market-delivery-tag market-delivery-tag-fast text-[10px] hidden md:block'>Fast delivery</span>

          {isPublic ? (
            <Link
              to='/login'
              className='mt-3 w-full text-center px-3 py-2 market-btn-primary text-market-on-primary'
            >
              Sign in to buy
            </Link>
          ) : (
            <button
              type='button'
              onClick={AddToCartHandler}
              disabled={!inStock}
              className={`mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 market-btn-primary ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={inStock ? 'Add ' + name + ' to cart' : name + ' is out of stock'}
            >
              <AiOutlineShoppingCart size={16} /> Add to cart
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProductListItem
