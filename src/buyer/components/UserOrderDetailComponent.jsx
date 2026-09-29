import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getAllOrdersOfUser } from '@/store/slices/orderThunks'
import api from '@/services/api'
import { toast } from 'react-toastify'
import { BsFillBagFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { RxCross1 } from 'react-icons/rx'
import { resolveImageUrl } from '@/shared/utils/image'
import { normalizeStatus } from '@/shared/utils/orderStatus'
import OrderDeliveryCard from '@/shared/components/OrderDeliveryCard'
import '@/buyer/components/UserOrderDetailComponent.css'
import { PlaceholderProduct } from '@/assets'

const UserOrderDetailComponent = () => {
  const { orders } = useSelector((state) => state.order)
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const { id } = useParams()

  const [open, setOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [rating, setRating] = useState(1)

  // Identity users carry `id` (UUID); `_id` is the Mongo-style fallback.
  const userId = user?.id || user?._id

  useEffect(() => {
    if (userId) {
      dispatch(getAllOrdersOfUser(userId))
    }
  }, [dispatch, userId])

  const data = orders?.find((item) => item._id === id)
  // Legacy rows still carry 'PENDING'/'CONFIRMED' — normalize before display
  // (see shared/utils/orderStatus.js).
  const orderStatus = normalizeStatus(data?.status) || 'Processing'

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.put('/product/create-new-review', {
        user,
        rating,
        comment,
        productId: selectedItem?._id,
        orderId: id
      })
      toast.success(res.data.message || 'Review submitted successfully!')
      if (userId) dispatch(getAllOrdersOfUser(userId))
      setComment('')
      setRating(1)
      setOpen(false)
      setSelectedItem(null)
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || 'Failed to submit review'
      )
    }
  }

  const handleRefundRequest = async () => {
    try {
      // Canonical target — the backend normalizes aliases, but sending the
      // documented value keeps the request honest and auditable.
      const res = await api.put(`/order/refund-order/${id}`, {
        status: 'Refund Requested'
      })
      toast.success(res.data.message || 'Refund request submitted!')
      if (userId) dispatch(getAllOrdersOfUser(userId))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request refund')
    }
  }

  if (!data) {
    return (
      <div className="order-detail-container">
        <p style={{ textAlign: 'center', color: '#6b7280' }}>Order not found</p>
      </div>
    )
  }

  return (
    <div className="order-detail-container">
      {/* Header */}
      <div className="order-detail-header">
        <BsFillBagFill size={28} color="#20305C" />
        <h1>Order Details</h1>
      </div>

      {/* Meta Information */}
      <div className="order-detail-meta">
        <div className="order-meta-item">
          Order ID: <strong>#{data._id?.slice(0, 8)}</strong>
        </div>
        <div className="order-meta-item">
          Placed on: <strong>{new Date(data.createdAt).toLocaleDateString()}</strong>
        </div>
        <div className="order-meta-item">
          Status:{' '}
          <strong
            style={{
              color:
                orderStatus === 'Delivered'
                  ? '#10b981'
                  : orderStatus === 'Cancelled'
                    ? '#ef4444'
                    : '#f59e0b'
            }}
          >
            {orderStatus}
          </strong>
        </div>
      </div>

      {/* Delivery (ORDER ↔ DELIVERY bridge). Rendered for every order: when no
          shipment is linked yet the panel explains why, instead of disappearing. */}
      <OrderDeliveryCard orderId={id} orderStatus={orderStatus} className="mt-6 mb-2" />

      {/* Order Items */}
      <div className="order-items-section">
        <h3>Order Items</h3>
        {data?.cart?.map((item, index) => {
          const productImage = resolveImageUrl(
            item?.images?.[0] ||
              item?.image_Url?.[0] ||
              item?.image_Url ||
              item?.image ||
              item?.thumbnail
          )
          const isEligibleForReview =
            !item.isReviewed &&
            normalizeStatus(data.status) === 'Delivered' &&
            // Reviews belong to a catalogue product; an item agreed through
            // Request Management may not have one.
            Boolean(item._id || item.productId)

          return (
            <div key={index} className="order-item">
              <img
                src={productImage || PlaceholderProduct}
                alt={item.name}
                className="order-item-image"
              />
              <div className="order-item-info">
                <div className="order-item-name">{item.name}</div>
                <div className="order-item-price">
                  ETB {item.discountPrice} × {item.quantity ?? item.qty ?? 1}
                </div>
              </div>
              {isEligibleForReview && (
                <button
                  className="review-btn"
                  onClick={() => {
                    setSelectedItem(item)
                    setOpen(true)
                  }}
                >
                  Write a Review
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Order Summary */}
      <div className="order-summary-section">
        {/* Shipping Address */}
        <div className="summary-group">
          <h4>Shipping Address</h4>
          <p>
            {data?.shippingAddress?.address1} {data?.shippingAddress?.address2}
          </p>
          <p>{data?.shippingAddress?.city}, {data?.shippingAddress?.country}</p>
          <p>{data?.shippingAddress?.zipCode}</p>
          <p>{user?.phoneNumber}</p>
        </div>

        {/* Payment Information */}
        <div className="summary-group">
          <h4>Payment Information</h4>
          <p>
            Status:{' '}
            <strong style={{ color: (() => {
              const s = String(data?.paymentStatus || data?.paymentInfo?.status || 'Not Paid').toUpperCase();
              if (/NOT PAID|UNPAID/.test(s)) return '#B54708'; // amber — payment outstanding
              if (/FAIL|CANCEL|DECLIN|REFUND/.test(s)) return '#D92D20'; // red — negative outcome
              if (/PAID|SUCCESS|COMPLETE/.test(s)) return '#16A34A'; // green — settled
              if (/PENDING|PROCESSING/.test(s)) return '#B54708'; // amber — in flight
              return '#667085'; // secondary text — unknown/neutral
            })() }}>
              {data?.paymentStatus
                || (data?.paymentInfo?.status
                  ? String(data.paymentInfo.status).toUpperCase()
                  : 'Not Paid')}
            </strong>
          </p>
          <p>Total: <strong>ETB {data?.totalPrice}</strong></p>
        </div>
      </div>

      {/* Order Total */}
      <div className="order-total">
        <p>
          Total Amount: <strong>ETB {data?.totalPrice}</strong>
        </p>
      </div>

      {/* Actions */}
      <div className="order-actions">
        <Link to="/">
          <button className="action-btn">Send Message</button>
        </Link>
        {normalizeStatus(data?.status) === 'Delivered' && (
          <button className="action-btn danger" onClick={handleRefundRequest}>
            Request Refund
          </button>
        )}
      </div>

      {/* Review Modal */}
      {open && selectedItem && (
        <div className="review-modal">
          <div className="review-modal-content">
            <div className="review-modal-header">
              <h2>Write a Review</h2>
              <button
                className="review-modal-close"
                onClick={() => {
                  setOpen(false)
                  setSelectedItem(null)
                }}
              >
                <RxCross1 />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit}>
              <div className="review-modal-body">
                {/* Product Info */}
                <div className="review-product">
                  <img
                    src={
                      resolveImageUrl(
                        selectedItem?.images?.[0] ||
                          selectedItem?.image_Url?.[0] ||
                          selectedItem?.image_Url ||
                          selectedItem?.image ||
                          selectedItem?.thumbnail
                      ) || PlaceholderProduct
                    }
                    alt={selectedItem.name}
                    className="review-product-image"
                  />
                  <div className="review-product-info">
                    <h4>{selectedItem.name}</h4>
                    <p>ETB {selectedItem.discountPrice} × {selectedItem.quantity ?? selectedItem.qty ?? 1}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="review-rating-section">
                  <h5>
                    Your Rating <span style={{ color: '#ef4444' }}>*</span>
                  </h5>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        className={`star-btn ${rating >= i ? 'active' : ''}`}
                        onClick={() => setRating(i)}
                      >
                        {rating >= i ? (
                          <AiFillStar size={24} />
                        ) : (
                          <AiOutlineStar size={24} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="review-comment-section">
                  <label>
                    Your Review
                    <span style={{ marginLeft: '4px', color: '#9ca3af', fontWeight: 400 }}>
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                  />
                </div>
              </div>

              <div className="review-modal-footer">
                <button
                  type="button"
                  className="review-modal-btn review-modal-btn--secondary"
                  onClick={() => {
                    setOpen(false)
                    setSelectedItem(null)
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="review-modal-btn review-modal-btn--primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserOrderDetailComponent
