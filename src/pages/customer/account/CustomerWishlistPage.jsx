import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ProductImage } from '../../../components/common/ImageWithFallback'

const EmptyWishlist = () => (
  <div className="py-16 text-center">
    <p className="text-lg text-gray-500 mb-3">Your wishlist is empty.</p>
    <Link to="/products" className="px-5 py-2 rounded-md bg-[#C0392B] text-white font-[500]">Discover products</Link>
  </div>
)

// Buyer Account: Wishlist.
// Reads the buyer's own saved products from localStorage-backed wishlist state
// (addToWishlist/removeFromWishlist reducer). Private to this browser/buyer.
const CustomerWishlistPage = () => {
  const wishlist = useSelector((state) => state.wishlist?.wishlist || [])

  return (
    <div className="rounded-[12px] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-[600] text-[#1F2937] mb-4">My Wishlist</h2>
      {wishlist.length === 0 ? <EmptyWishlist /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((w) => {
            const p = w.product || w
            return (
              <Link key={p._id || w._id} to={`/product/${p.name?.toLowerCase().replace(/ /g, '-')}`}
                className="rounded-[12px] border p-3 hover:shadow-md">
                <ProductImage data={p} className="w-full h-40 object-cover rounded-md" />
                <p className="mt-2 font-[600] text-sm text-[#1F2937] line-clamp-1">{p.name}</p>
                <p className="text-[#C0392B] font-[700] text-sm">{Number(p.discountPrice || p.price || 0).toLocaleString()} ETB</p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CustomerWishlistPage