import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Store from '../../../store/redux/store'
import { getAllOrdersOfUser } from '../../../store/redux/actions/order'
import { getAllProducts } from '../../../store/redux/actions/product'
import { ProductImage } from '../../../components/common/ImageWithFallback'
import { MdStar, MdArrowForward } from 'react-icons/md'
import { BiMessage } from 'react-icons/bi'

// Buyer Account: My Reviews with modern card design
// Displays reviews written by the customer on products they purchased
const CustomerReviewsPage = () => {
  const user = useSelector((state) => state.user?.user)
  const orders = useSelector((state) => state.order?.orders || [])
  const products = useSelector((state) => state.product?.allProducts || state.product?.products || [])
  const loading = useSelector((state) => state.order?.isLoading || false)

  useEffect(() => {
    if (user?._id) Store.dispatch(getAllOrdersOfUser(user._id))
    Store.dispatch(getAllProducts())
    // eslint-disable-next-line
  }, [user?._id])

  const myId = user?._id?.toString?.()
  
  // Extract this buyer's reviews from the products they bought
  const myReviews = []
  products.forEach((p) => {
    p.reviews?.forEach((r) => {
      const rUser = r.user && (r.user._id || r.user.id)
      if (rUser && myId && rUser.toString() === myId) {
        myReviews.push({ 
          product: p, 
          rating: r.rating, 
          comment: r.comment, 
          date: r.createdAt || r.date,
          verified: !!r.verified
        })
      }
    })
  })

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <BiMessage className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Loading your reviews…</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen py-6 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-sm text-gray-600 mt-1">Reviews you've written on Aritii Market</p>
        </div>

        {/* Stats Card */}
        {myReviews.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
            <div className="bg-yellow-50 p-3 rounded-lg">
              <MdStar className="text-2xl text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{myReviews.length} review{myReviews.length !== 1 ? 's' : ''}</p>
              <p className="text-xs text-gray-600">Helpful reviews from your purchases</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {myReviews.length === 0 ? (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BiMessage className="text-4xl text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium mb-2">You haven't written any reviews yet</p>
            <p className="text-gray-500 text-sm mb-6">After purchasing a product, share your experience by leaving a review on its details page</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myReviews.map((review, idx) => (
              <ReviewCard key={idx} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const ReviewCard = ({ review }) => {
  const r = review
  const ratingStars = Math.round(Number(r.rating || 0))
  const fullStars = '★'.repeat(ratingStars)
  const emptyStars = '★'.repeat(Math.max(0, 5 - ratingStars))

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
      {/* Header with Product Image and Info */}
      <div className="flex gap-4 mb-4">
        <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
          <ProductImage 
            data={r.product} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
            {r.product.name}
          </h3>
          {r.product.shop && (
            <p className="text-xs text-gray-500 mt-1">
              from {r.product.shop.name || 'Aritii Shop'}
            </p>
          )}
          
          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              <span className="text-yellow-500 text-sm font-bold">{fullStars}</span>
              <span className="text-gray-300 text-sm">{emptyStars}</span>
            </div>
            <span className="text-xs font-medium text-gray-600">
              {ratingStars}.0 out of 5
            </span>
            {r.verified && (
              <span className="ml-auto px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                ✓ Verified Purchase
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          {r.comment || 'No comment provided'}
        </p>

        {/* Review Date */}
        <p className="text-xs text-gray-500">
          {r.date ? new Date(r.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) : ''}
        </p>
      </div>
    </div>
  )
}

export default CustomerReviewsPage
