import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '@/styles/styles';
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { ProductImage } from '@/components/common/ImageWithFallback';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistThunks';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { addTocart, updateCartQuantity } from '@/store/slices/cartThunks';
import Ratings from '@/components/common/Ratings';


// THE DATA WE DEAL WITH HERE IS THE REAL PRODUCT DATA LOADED FROM THE
// BACKEND (via redux -> /product/get-all-products) and passed to this
// component as the `data` prop, then displayed in card format.


const ProductCard = ({ data, variant = 'default', basePath = '' }) => {

  const [click, setClick] = useState(false);
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist || {})
  const { cart } = useSelector((state) => state.cart || {})
  const { isAuthenticated } = useSelector((state) => state.user || {})

  // What the buyer can actually order right now.
  //   • the marketplace/public payload publishes `available` (stock − units
  //     reserved by open orders) — prefer it;
  //   • a full-snapshot payload (authenticated list) ships `stock` + `reserved`,
  //     so derive the same figure instead of showing the raw counter, which
  //     overstates availability (it counts units promised to orders that are
  //     not confirmed yet).
  const availableUnits = data?.available !== undefined && data?.available !== null
    ? Number(data.available)
    : data?.reserved !== undefined && data?.reserved !== null
      ? Math.max(0, Number(data?.stock ?? 0) - Number(data.reserved))
      : Number(data?.stock ?? 0);


  const AddToCartHandler = async (id) => {
    if (!cart) return;
    const isItemExist = cart.find((i) => (i.productId || i._id) === id);
    if (isItemExist) {
      const nextQty = (isItemExist.quantity || 1) + 1;
      if (nextQty > availableUnits) {
        toast.error(`Only ${availableUnits} items available in stock`);
        return;
      }
      await dispatch(updateCartQuantity(id, nextQty));
      toast.success('Cart updated');
    } else {
      if (availableUnits < 1) {
        toast.error('Product stock limited!');
      } else {
        const cartData = { ...data, quantity: 1 };
        const added = await dispatch(addTocart(cartData));
        if (added) toast.success('Item added to cart');
      }
    }
  };

  // Add to wishlist — backend call; toast only on confirmed success.
  // `click` is driven purely by the wishlist state via the useEffect below,
  // so a failed request never leaves a stale filled heart.
  const addToWishlistHandler = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to save items to your wishlist');
      return;
    }
    const saved = await dispatch(addToWishlist(product));
    if (saved) toast.success('Saved to wishlist');
  };

  const removeFromWishlistHandler = async (product) => {
    const removed = await dispatch(removeFromWishlist(product));
    if (removed) toast.success('Removed from wishlist');
  };


// Jo jo products pehle hee wishlist main added hain to reload k baad b wo added rhen
  useEffect(() => {
    if (wishlist && data && wishlist.find((i) => i && i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data]);


  const d = data?.name || '';
  const productId = data?._id || ''; // Use _id for routing to match backend
  const shopName = data?.shop?.name || 'Unknown shop';
  const shopId = data?.shop?._id || '';
    const displayPrice = data?.discountPrice ?? data?.originalPrice ?? 0;
  const soldCount = data?.total_sell ?? data?.sold_out ?? 0;
  
  const isPublic = variant === 'public';

  const productPath = basePath ? `${basePath}/product/${productId}` : `/product/${productId}`;
  const shopPath = basePath ? `${basePath}/shops/${shopId}` : `/shops/${shopId}`;

  return (
    <article className="group w-full bg-white dark:bg-gray-900 dark:border-gray-700 rounded-2xl border border-[#E5E7EB] shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-white dark:bg-gray-900 overflow-hidden">
        <Link to={productPath} className="block w-full h-full">
          <ProductImage 
            data={data}
            className='w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105'
            alt={d} 
          />
        </Link>

        {/* Action Icons (hidden in public variant) */}
        {!isPublic && (
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {click ? (
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors"
                onClick={() => removeFromWishlistHandler(data)}
                aria-label={`Remove ${d || 'product'} from wishlist`}
              >
                <AiFillHeart size={18} />
              </button>
            ) : (
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-[#171A21] hover:bg-[#F7F8FA] dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20305C] transition-colors"
                onClick={() => addToWishlistHandler(data)}
                aria-label={`Add ${d || 'product'} to wishlist`}
              >
                <AiOutlineHeart size={18} />
              </button>
            )}
            <Link
              to={productPath}
              className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-[#171A21] hover:bg-[#F7F8FA] dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20305C] transition-colors"
              aria-label={`View ${d || 'product'} details`}
            >
              <AiOutlineEye size={18} />
            </Link>
          </div>
        )}

        {/* Out-of-stock badge — the backend hides these from public lists, but
            a stale cache/owner view can still render the card. */}
        {availableUnits < 1 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-semibold shadow">
            Out of stock
          </span>
        )}

        {/* Add to Cart Button (hidden in public variant) */}
        {!isPublic && (
          <button
            type="button"
            disabled={availableUnits < 1}
            className={`absolute bottom-2 right-2 w-8 h-8 rounded-full shadow-md flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 transition-colors ${
              availableUnits < 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#20305C] text-white hover:bg-[#2C3F6E] focus-visible:ring-[#20305C]'
            }`}
            onClick={() => AddToCartHandler(data._id)}
            aria-label={availableUnits < 1 ? `${d || 'product'} is out of stock` : `Add ${d || 'product'} to cart`}
          >
            <AiOutlineShoppingCart size={18} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Shop Name */}
        <Link to={shopPath} className="mb-1">
          <h5 className={`${styles.shop_name} text-xs text-[#667085] dark:text-gray-400 hover:text-[#20305C] transition-colors`}>
            {shopName}
          </h5> 
        </Link>

        {/* Product Name */}
        <Link to={productPath} className="flex-1">
          <h4 className='font-medium text-gray-900 dark:text-white text-sm sm:text-base line-clamp-2 min-h-[2.5rem] leading-snug'>
            {d.length > 50 ? d.slice(0, 50) + "..." : d}
          </h4>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <Ratings rating={data?.ratings} />
          {soldCount > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              ({soldCount} sold)
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className='flex flex-col'>
            <h5 className={`${styles.productDiscountPrice} text-lg font-bold text-gray-900 dark:text-white`}>
              {`${displayPrice} ETB`}
            </h5>
            {data?.originalPrice && data?.originalPrice > displayPrice && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 line-through">
                  {data.originalPrice} ETB
                </span>
                <span className="text-xs text-[#20305C] font-semibold">
                  {Math.round(((data.originalPrice - displayPrice) / data.originalPrice) * 100)}% off
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Best Seller Badge */}
        {soldCount > 10 && (
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#20305C]/10 text-[#20305C] text-xs font-semibold rounded-full">
              <span className="w-1.5 h-1.5 bg-[#20305C] rounded-full"></span>
              Best Seller
            </span>
          </div>
        )}
      </div>
    </article>
  )
}

export default ProductCard
