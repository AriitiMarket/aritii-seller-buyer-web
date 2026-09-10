import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Store from '../../../store/redux/store'
import { getAllOrdersOfUser } from '../../../store/redux/actions/order'
import { getAllProducts } from '../../../store/redux/actions/product'
import { ProductImage } from '../../../components/common/ImageWithFallback'

// Buyer Account: My Reviews.
// Builds an honest "my reviews" view from backend data:
//  - The buyer's own orders (getAllOrdersOfUser) tell which products they bought.
//  - Product.reviews[] (returned by getAllProducts) contains the actual reviews.
//  - We surface ONLY the reviews this buyer authored (matched by their user id),
//    merged with the product + shop they belong to.
// If the backend has no per-user review endpoint, this IS the supported source.
const CustomerReviewsPage = () => {
  const user = useSelector((state) => state.user?.user)
  const orders = useSelector((state) => state.order?.orders || [])
  const products = useSelector((state) => state.product?.allProducts || state.product?.products || [])
  const loading = useSelector((state) => state.order?.isLoading || false)

  useEffect(() => {
    if (user?._id) Store.dispatch(getAllOrdersOfUser(user._id))
    Store.dispatch(getAllProducts())
    // eslint-disable-next-line
  }, [])

  if (loading) return <p className="py-20 text-center text-gray-400">Loading your reviews…</p>

  const myId = user?._id?.toString?.()
  // Extract this buyer's reviews from the products they bought.
  const myReviews = []
  products.forEach((p) => {
    p.reviews?.forEach((r) => {
      const rUser = r.user && (r.user._id || r.user.id)
      if (rUser && myId && rUser.toString() === myId) {
        myReviews.push({ product: p, rating: r.rating, comment: r.comment, date: r.createdAt || r.date })
      }
    })
  })

  return (
    <div className="rounded-[12px] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-[600] text-[#1F2937] mb-1">My Reviews</h2>
      <p className="text-sm text-gray-500 mb-4">Reviews you have written on Aritii Market.</p>
      {myReviews.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-gray-500 mb-3">You have not written any reviews yet.</p>
          <p className="text-sm text-gray-400">After buying a product, leave a review on its details page.</p>
        </div>
      ) : (
        <ul className="divide-y">
          {myReviews.map((r, i) => (
            <li key={i} className="py-4 flex gap-4 items-start">
              <ProductImage data={r.product} className="w-16 h-16 object-cover rounded-md" />
              <div className="flex-1">
                <p className="font-[600] text-sm text-[#1F2937]">{r.product.name}</p>
                <p className="text-sm text-[#F5A623]">{'★'.repeat(Math.round(Number(r.rating || 0)))}<span className="text-gray-300">{'★'.repeat(Math.max(0, 5 - Math.round(Number(r.rating || 0))))}</span></p>
                <p className="text-gray-700 text-sm mt-1">{r.comment}</p>
                <p className="text-xs text-gray-400 mt-1">{r.date ? new Date(r.date).toLocaleDateString() : ''}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CustomerReviewsPage