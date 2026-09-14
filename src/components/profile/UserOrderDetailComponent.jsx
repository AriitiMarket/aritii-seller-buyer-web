import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getAllOrdersOfUser } from '../../store/redux/actions/order.js'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { BsFillBagFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { RxCross1 } from 'react-icons/rx'
import { resolveImageUrl } from '../../utils/image'
import './UserOrderDetailComponent.css'

const UserOrderDetailComponent = () => {
  const { orders } = useSelector((state) => state.order)
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const { id } = useParams()

  const [open, setOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [rating, setRating] = useState(1)

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id))
    }
  }, [dispatch, user?._id])

  const data = orders?.find((item) => item._id === id)

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
      dispatch(getAllOrdersOfUser(user._id))
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
      const res = await api.put(`/order/refund-order/${id}`, {
        status: 'Processing refund'
      })
      toast.success(res.data.message || 'Refund request submitted!')
      dispatch(getAllOrdersOfUser(user._id))
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
        <BsFillBagFill size={28} color="#0B6E4F" />
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
              color: data.status === 'Delivered' ? '#10b981' : '#f59e0b'
            }}
          >
            {data.status}
          </strong>
        </div>
      </div>

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
            !item.isReviewed && (data.status === 'Delivered' || data.status === 'succeeded')

          return (
            <div key={index} className="order-item">
              <img
                src={productImage || '/product-placeholder.svg'}
                alt={item.name}
                className="order-item-image"
              />
              <div className="order-item-info">
                <div className="order-item-name">{item.name}</div>
                <div className="order-item-price">
                  US${item.discountPrice} × {item.qty}
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
            <strong style={{ color: '#0B6E4F' }}>
              {data?.paymentInfo?.status || 'Not Paid'}
            </strong>
          </p>
          <p>Total: <strong>US${data?.totalPrice}</strong></p>
        </div>
      </div>

      {/* Order Total */}
      <div className="order-total">
        <p>
          Total Amount: <strong>US${data?.totalPrice}</strong>
        </p>
      </div>

      {/* Actions */}
      <div className="order-actions">
        <Link to="/">
          <button className="action-btn">Send Message</button>
        </Link>
        {data?.status === 'succeeded' && (
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
                      ) || '/product-placeholder.svg'
                    }
                    alt={selectedItem.name}
                    className="review-product-image"
                  />
                  <div className="review-product-info">
                    <h4>{selectedItem.name}</h4>
                    <p>US${selectedItem.discountPrice} × {selectedItem.qty}</p>
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
