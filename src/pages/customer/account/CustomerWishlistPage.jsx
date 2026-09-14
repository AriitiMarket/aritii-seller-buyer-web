import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { ProductImage } from '../../../components/common/ImageWithFallback'
import { AiOutlineHeart } from 'react-icons/ai'
import { MdArrowForward, MdShoppingCart } from 'react-icons/md'
import { toast } from 'react-toastify'
import { addTocart } from '../../../store/redux/actions/cart'

// Buyer Account: Wishlist with modern card-based grid
// Displays saved products in a responsive card layout
const CustomerWishlistPage = () => {
  const dispatch = useDispatch()
  const wishlist = useSelector((state) => state.wishlist?.wishlist || [])

  if (wishlist.length === 0) {
    return (
      <div className="w-full bg-gray-50 min-h-screen py-6 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-sm text-gray-600 mt-1">Save your favorite products and shop them anytime</p>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AiOutlineHeart className="text-4xl text-red-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium mb-2">Your wishlist is empty</p>
            <p className="text-gray-500 text-sm mb-6">Start adding products to your wishlist to keep track of items you love</p>
            <Link to="/products" className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition inline-block">
              Discover Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen py-6 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-sm text-gray-600 mt-1">{wishlist.length} item(s) saved</p>
          </div>
          <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-200">
            <p className="text-red-700 font-bold text-lg">{wishlist.length}</p>
            <p className="text-red-600 text-xs font-medium">Saved Items</p>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {wishlist.map((w) => {
            const p = w.product || w
            return (
              <WishlistCard key={p._id || w._id} product={p} dispatch={dispatch} />
            )
          })}
        </div>
      </div>
    </div>
  )
}

const WishlistCard = ({ product, dispatch }) => {
  const p = product

  const handleAddToCart = async () => {
    if (!p || !p._id) {
      toast.error('Invalid product')
      return
    }

    if (p.stock <= 0) {
      toast.error('This product is out of stock')
      return
    }

    try {
      const cartData = {
        _id: p._id,
        name: p.name,
        price: p.discountPrice || p.price,
        image: p.image || p.images?.[0],
        shop: p.shop,
        qty: 1,
      }
      
      await dispatch(addTocart(cartData))
      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition group h-full flex flex-col">
      {/* Product Image Container */}
      <div className="relative w-full h-44 bg-gray-100 overflow-hidden flex-shrink-0">
        <Link to={`/product/${p.name?.toLowerCase().replace(/ /g, '-')}`}>
          <ProductImage 
            data={p} 
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
        </Link>
        
        {/* Wishlist Badge */}
        <div className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-md hover:bg-red-700 transition">
          <AiOutlineHeart className="text-base" />
        </div>

        {/* Discount Badge if available */}
        {p.discount && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
            -{p.discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/product/${p.name?.toLowerCase().replace(/ /g, '-')}`}
          className="block">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 hover:text-teal-600 transition">
            {p.name}
          </h3>
        </Link>

        {/* Shop Name */}
        {p.shop && (
          <p className="text-xs text-gray-500 mt-1.5 flex-shrink-0">{p.shop.name || 'Aritii Shop'}</p>
        )}

        {/* Rating */}
        {p.rating && (
          <div className="flex items-center gap-1 mt-2 text-xs flex-shrink-0">
            <span className="text-yellow-500 font-medium">★ {Number(p.rating || 0).toFixed(1)}</span>
            <span className="text-gray-400">({p.reviews?.length || 0})</span>
          </div>
        )}

        {/* Price Section */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-teal-600">
              {Number(p.discountPrice || p.price || 0).toLocaleString()} ETB
            </span>
            {p.discountPrice && p.price && (
              <span className="text-xs text-gray-500 line-through">
                {Number(p.price).toLocaleString()} ETB
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className={`text-xs font-semibold mb-4 inline-flex px-2.5 py-1 rounded-full ${p.stock > 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Link to={`/product/${p.name?.toLowerCase().replace(/ /g, '-')}`}
            className="flex-1 px-3 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-1 border border-teal-700 shadow-sm hover:shadow-md">
            <MdShoppingCart className="text-sm" />
            <span className="hidden sm:inline">View Product</span>
            <span className="sm:hidden">View</span>
          </Link>
          <button 
            onClick={handleAddToCart}
            disabled={p.stock <= 0}
            className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition border border-red-200 hover:border-red-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {p.stock > 0 ? 'Add Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomerWishlistPage
