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
  approved: 'bg-green-50 text-green-700 border-green-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
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
          <h1 className="text-2xl md:text-3xl font-bold text-[#171A21]">My Reviews</h1>
          <p className="text-sm text-[#667085] mt-1">Reviews you've written on Aritii Market</p>
        </div>
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-[#E5E7EB] text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#20305C] mx-auto"></div>
          <p className="text-[#667085] text-sm mt-4">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#171A21]">My Reviews</h1>
        <p className="text-sm text-[#667085] mt-1">Reviews you've written on Aritii Market</p>
      </div>

      {/* Stats */}
      {myReviews.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB] flex items-center gap-4">
          <div className="bg-yellow-50 p-3 rounded-xl">
            <MdStar className="text-2xl text-yellow-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#171A21]">{myReviews.length} review{myReviews.length !== 1 ? 's' : ''}</p>
            <p className="text-xs text-[#667085]">Helpful reviews from your purchases</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-[#E5E7EB] text-center">
          <p className="text-[#667085] font-medium mb-1">Could not load your reviews</p>
          <p className="text-[#667085] text-sm">{error}</p>
        </div>
      ) : myReviews.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-[#E5E7EB] text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BiMessage className="text-3xl text-gray-300" />
          </div>
          <p className="text-[#667085] font-medium mb-1">No reviews yet</p>
          <p className="text-[#667085] text-sm">After purchasing a product, share your experience by leaving a review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myReviews.map((review) => (
            <div key={review._id} className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-all">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                  <ProductImage data={{ name: review.productName }} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-[#171A21] line-clamp-1">{review.productName || 'Product'}</h3>
                  {review.shop?.name && (
                    <p className="text-xs text-[#667085] mt-0.5">{review.shop.name}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <MdStar
                          key={i}
                          size={14}
                          className={i < Math.round(Number(review.rating || 0)) ? 'text-yellow-500' : 'text-gray-200'}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-[#667085]">{Number(review.rating || 0).toFixed(1)}</span>
                    {/* Moderation state, so a pending review is never mistaken for a lost one */}
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${STATUS_STYLES[review.status] || 'bg-[#F7F8FA] text-[#667085] border-[#E5E7EB]'}`}
                    >
                      {STATUS_LABELS[review.status] || review.status}
                    </span>
                  </div>
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-[#667085] mt-3 pt-3 border-t border-[#E5E7EB] leading-relaxed">{review.comment}</p>
              )}
              {review.createdAt && (
                <p className="text-[10px] text-gray-400 mt-2">
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
