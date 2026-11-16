import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { reviewService } from '@/services'
import { ProductImage } from '@/components/common/ImageWithFallback'
import { MdStar } from 'react-icons/md'
import { BiMessage } from 'react-icons/bi'

/**
 * Buyer - My Reviews (canonical route: /my-dashboard/reviews).
 *
 * Reads through reviewService.getMine() -> GET /review/get-my-reviews, which
 * returns the caller's own reviews in EVERY moderation state. That matters: a
 * review the buyer just submitted is still 'pending', so a catalogue-based read
 * (approved only) would make it look as though the submission was lost.
 */
const STATUS_STYLES = {
  approved: 'bg-[#f3ffee] dark:bg-[#75d04b]/15 text-[#75d04b] border-[#75d04b]/30',
  pending: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  rejected: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
}

const STATUS_LABELS = {
  approved: 'Published',
  pending: 'Awaiting review',
  rejected: 'Not published',
}

const BuyerReviewsPage = () => {
  const user = useSelector((state) => state.user?.user)
  const [myReviews, setMyReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    reviewService
      .getMine()
      .then((result) => {
        if (active) setMyReviews(result.reviews || [])
      })
      .catch((err) => {
        if (!active) return
        setMyReviews([])
        setError(err?.response?.data?.message || err.message || 'Could not load your reviews')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [user?._id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Reviews</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Reviews you've written on Aritii Market</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#75d04b] mx-auto" />
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Reviews</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Reviews you've written on Aritii Market</p>
      </div>

      {/* Stats */}
      {myReviews.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-xl">
            <MdStar className="text-2xl text-yellow-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{myReviews.length} review{myReviews.length !== 1 ? 's' : ''}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Helpful reviews from your purchases</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-900 dark:text-white font-medium mb-1">Could not load your reviews</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
        </div>
      ) : myReviews.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <BiMessage className="text-3xl text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-900 dark:text-white font-medium mb-1">No reviews yet</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">After purchasing a product, share your experience by leaving a review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myReviews.map((review) => (
            <div key={review._id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-[#75d04b]/50 transition-all">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex-shrink-0 overflow-hidden">
                  <ProductImage data={{ name: review.productName }} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">{review.productName || 'Product'}</h3>
                  {review.shop?.name && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{review.shop.name}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <MdStar
                          key={i}
                          size={14}
                          className={i < Math.round(Number(review.rating || 0)) ? 'text-yellow-500' : 'text-gray-200 dark:text-gray-700'}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{Number(review.rating || 0).toFixed(1)}</span>
                    {/* Moderation state, so a pending review is never mistaken for a lost one */}
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${STATUS_STYLES[review.status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}
                    >
                      {STATUS_LABELS[review.status] || review.status}
                    </span>
                  </div>
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 leading-relaxed">{review.comment}</p>
              )}
              {review.createdAt && (
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BuyerReviewsPage
