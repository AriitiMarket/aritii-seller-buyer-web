import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { getAllOrdersOfUser } from '@/store/slices/orderThunks'
import api from '@/services/api'
import { toast } from 'react-toastify'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { RxCross1 } from 'react-icons/rx'
import { MdShoppingBag, MdArrowBack, MdCheckCircle, MdLocalShipping, MdReceiptLong } from 'react-icons/md'
import { FiPrinter } from 'react-icons/fi'
import { resolveImageUrl } from '@/shared/utils/image'
import { normalizeStatus } from '@/shared/utils/orderStatus'
import { formatOrderAddress } from '@/shared/utils/destination'
import OrderDeliveryCard from '@/features/buyer/components/OrderDeliveryCard'
import '@/buyer/components/UserOrderDetailComponent.css'
import { PlaceholderProduct } from '@/assets'

const OrderDetailComponent = () => {
  const { orders } = useSelector((state) => state.order)
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const { id } = useParams()

  const [open, setOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [rating, setRating] = useState(1)
  const [activeTab, setActiveTab] = useState('items')
  const [submitting, setSubmitting] = useState(false)
  const [confirmingReceipt, setConfirmingReceipt] = useState(false)

  const userId = user?.id || user?._id

  useEffect(() => {
    if (userId) {
      dispatch(getAllOrdersOfUser(userId))
    }
  }, [dispatch, userId])

  const data = orders?.find((item) => item._id === id)
  const orderStatus = normalizeStatus(data?.status) || 'Processing'
  // The order's own destination snapshot — the one place that knows the
  // region/city/sector hierarchy the delivery was addressed to.
  const orderAddress = formatOrderAddress(data)
  // The shop the order was placed with — the only place a buyer can reach the
  // seller from an order.
  const sellerId = data?.shop?._id || data?.shopId || (typeof data?.shop === 'string' ? data.shop : null)

  const getTimelineStatus = () => {
    const status = String(normalizeStatus(data?.status) || '').toLowerCase()
    const timeline = []

    timeline.push({
      step: 'Order Placed',
      completed: true,
      date: data?.createdAt,
      icon: <MdCheckCircle className="w-6 h-6 text-green-600" />
    })

    if (['processing', 'confirmed', 'shipped', 'in transit', 'delivered', 'completed'].includes(status)) {
      timeline.push({
        step: 'Processing',
        completed: true,
        date: data?.createdAt,
        icon: <MdCheckCircle className="w-6 h-6 text-green-600" />
      })
    } else {
      timeline.push({
        step: 'Processing',
        completed: false,
        date: null,
        icon: <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
      })
    }

    if (['shipped', 'in transit', 'delivered', 'completed'].includes(status)) {
      timeline.push({
        step: 'Shipped',
        completed: true,
        date: data?.shippedAt,
        icon: <MdCheckCircle className="w-6 h-6 text-green-600" />
      })
    } else {
      timeline.push({
        step: 'Shipped',
        completed: false,
        date: null,
        icon: <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
      })
    }

    if (['in transit', 'delivered', 'completed'].includes(status)) {
      timeline.push({
        step: 'In Transit',
        completed: true,
        date: data?.dispatchedAt,
        icon: <MdLocalShipping className="w-6 h-6 text-green-600" />
      })
    } else if (['shipped'].includes(status)) {
      timeline.push({
        step: 'In Transit',
        completed: false,
        date: null,
        icon: <div className="w-6 h-6 border-2 border-blue-300 rounded-full animate-pulse" />
      })
    } else {
      timeline.push({
        step: 'In Transit',
        completed: false,
        date: null,
        icon: <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
      })
    }

    if (['delivered', 'completed'].includes(status)) {
      timeline.push({
        step: 'Delivered',
        completed: true,
        date: data?.deliveredAt,
        icon: <MdCheckCircle className="w-6 h-6 text-green-600" />
      })
    } else {
      timeline.push({
        step: 'Delivered',
        completed: false,
        date: null,
        icon: <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
      })
    }

    if (['cancelled', 'refund requested', 'refund approved', 'refund success'].includes(status)) {
      timeline.push({
        step: 'Cancelled/Refunded',
        completed: true,
        date: null,
        icon: <RxCross1 className="w-6 h-6 text-red-600" />
      })
    }

    return timeline
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    // Client-side validation
    if (!rating || rating < 1 || rating > 5) {
      toast.error('Please select a rating (1-5 stars)')
      return
    }
    if (!comment || comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters')
      return
    }
    if (!selectedItem?.productId && !selectedItem?._id) {
      toast.error('Product not found')
      return
    }

    setSubmitting(true)
    try {
      const res = await api.put('/product/create-new-review', {
        // Backend gets user from verified token, don't send from frontend
        rating,
        comment: comment.trim(),
        productId: selectedItem?.productId || selectedItem?._id,
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
    } finally {
      setSubmitting(false)
    }
  }

  const handleRefundRequest = async () => {
    try {
      const res = await api.put(`/order/refund-order/${id}`, {
        status: 'Refund Requested'
      })
      toast.success(res.data.message || 'Refund request submitted!')
      if (userId) dispatch(getAllOrdersOfUser(userId))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request refund')
    }
  }

  const handleConfirmReceipt = async () => {
    if (confirmingReceipt) return
    setConfirmingReceipt(true)
    try {
      const res = await api.post(`/order/${id}/confirm-receipt`)
      toast.success(res.data?.message || 'Order receipt confirmed!')
      if (userId) dispatch(getAllOrdersOfUser(userId))
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to confirm receipt')
    } finally {
      setConfirmingReceipt(false)
    }
  }

  if (!data) {
    return (
      <div className="w-full max-w-4xl mx-auto py-16 text-center">
        <MdShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Order not found</p>
      </div>
    )
  }

  const items = data?.cart || data?.products || data?.items || []
  const timeline = getTimelineStatus()

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link to="/user/orders" className="inline-flex items-center gap-2 text-[#75d04b] hover:underline font-semibold text-sm">
        <MdArrowBack size={18} />
        Back to Orders
      </Link>

      {/* Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Order ID</p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">#{data._id?.slice(0, 8)}</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full text-xs font-semibold transition"
              title="Print Order Receipt"
            >
              <FiPrinter size={15} />
              <span>Print Receipt</span>
            </button>
            <Link
              to={`/user/track/order/${data._id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold transition"
            >
              <MdLocalShipping size={16} />
              <span>Track</span>
            </Link>
            {(orderStatus === 'Delivered' || orderStatus === 'Completed') && (
              data.buyerConfirmedReceipt ? (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-semibold">
                  <MdCheckCircle size={15} />
                  <span>Receipt Confirmed</span>
                </span>
              ) : (
                <button
                  onClick={handleConfirmReceipt}
                  disabled={confirmingReceipt}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#75d04b] hover:brightness-95 text-white rounded-full text-xs font-semibold transition shadow-sm disabled:opacity-50"
                  title="Confirm that you have received your order"
                >
                  <MdReceiptLong size={15} />
                  <span>{confirmingReceipt ? 'Confirming...' : 'Confirm Receipt'}</span>
                </button>
              )
            )}
            <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-semibold text-xs ${
              orderStatus === 'Delivered' || orderStatus === 'Completed'
                ? 'bg-[#75d04b]/15 text-[#75d04b]'
                : orderStatus === 'Cancelled'
                  ? 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                  : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
            }`}>
              {orderStatus === 'Delivered' || orderStatus === 'Completed' ? <MdCheckCircle /> : null}
              {orderStatus}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Order Date</p>
            <p className="text-gray-900 dark:text-white font-semibold mt-1">{new Date(data.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Total</p>
            <p className="text-gray-900 dark:text-white font-semibold mt-1">ETB {Number(data.totalPrice || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Payment</p>
            <p className={`font-semibold mt-1 ${
              String(data?.paymentStatus || 'Not Paid').toUpperCase().includes('PAID')
                ? 'text-[#75d04b]'
                : 'text-amber-500'
            }`}>
              {data?.paymentStatus || 'Pending'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Shipping Status</p>
            <p className="text-gray-900 dark:text-white font-semibold mt-1">{orderStatus}</p>
          </div>
        </div>
      </div>

      {/* Delivery Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Delivery Timeline</h2>
        <div className="space-y-4">
          {timeline.map((step, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                {step.icon}
                {idx < timeline.length - 1 && (
                  <div className={`w-0.5 h-12 mt-2 ${step.completed ? 'bg-[#75d04b]' : 'bg-gray-200 dark:bg-gray-700'}`} />
                )}
              </div>
              <div className="pt-1 pb-6">
                <p className="font-semibold text-gray-900 dark:text-white">{step.step}</p>
                {step.date && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(step.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Tracking Integration */}
      <OrderDeliveryCard orderId={id} orderStatus={orderStatus} />

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 flex gap-6">
        <button
          onClick={() => setActiveTab('items')}
          className={`py-3 px-1 font-semibold text-sm border-b-2 transition ${
            activeTab === 'items'
              ? 'border-[#75d04b] text-[#75d04b]'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Items ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`py-3 px-1 font-semibold text-sm border-b-2 transition ${
            activeTab === 'details'
              ? 'border-[#75d04b] text-[#75d04b]'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Details
        </button>
      </div>

      {/* Items Tab */}
      {activeTab === 'items' && (
        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-6 space-y-4 transition-colors">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Items</h2>
          {items.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No items in this order</p>
          ) : (
            items.map((item, index) => {
              const productImage = resolveImageUrl(
                item?.images?.[0] ||
                  item?.image_Url?.[0] ||
                  item?.image_Url ||
                  item?.image ||
                  item?.thumbnail
              )
              const productId = item.productId || item._id
              const qty = item.quantity ?? item.qty ?? 1
              const lineTotal = Number(item.discountPrice || item.price || 0) * qty
              const isEligibleForReview =
                !item.isReviewed &&
                normalizeStatus(data.status) === 'Delivered' &&
                Boolean(productId)

              return (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:shadow-md transition">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={productImage || PlaceholderProduct}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md bg-gray-100 dark:bg-gray-700"
                    />
                    <div className="flex-1">
                      <Link to={`/product/${productId}`} className="font-semibold text-gray-900 dark:text-white hover:text-[#75d04b] transition line-clamp-2">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Sold by {typeof item.shop === 'string' ? item.shop : (item.shop?.name || item.shopName || 'Unknown')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Quantity: {qty}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                        ETB {lineTotal.toLocaleString()}
                      </p>
                    </div>
                    {isEligibleForReview && (
                      <button
                        onClick={() => {
                          setSelectedItem(item)
                          setOpen(true)
                        }}
                        className="h-11 px-4 bg-[#75d04b] text-white rounded-full font-semibold text-sm hover:brightness-95 transition shadow-xs"
                      >
                        Write Review
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="space-y-4">
          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Shipping Address</h3>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p className="font-semibold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
              {orderAddress.lines.length > 0 ? (
                orderAddress.lines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)
              ) : (
                <p>No delivery address on this order</p>
              )}
              {(orderAddress.phone || user?.phoneNumber) && (
                <p className="mt-2">{orderAddress.phone || user?.phoneNumber}</p>
              )}
              {(data?.deliveryZoneName || data?.destination?.deliveryZoneName || data?.portName || data?.destination?.portName) && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                  {(data?.deliveryZoneName || data?.destination?.deliveryZoneName) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-800 dark:text-blue-300">
                      <span>📍 Delivery Zone:</span> {data?.deliveryZoneName || data?.destination?.deliveryZoneName}
                    </span>
                  )}
                  {(data?.portName || data?.destination?.portName) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      <span>⚓ Fulfillment Port:</span> {data?.portName || data?.destination?.portName}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Payment Method</h3>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-white mb-2">
                Status: <span className={Number(data?.totalPrice || 0) > 0 ? 'text-[#75d04b]' : 'text-amber-500'}>
                  {data?.paymentStatus || (data?.paymentInfo?.status ? String(data.paymentInfo.status).toUpperCase() : 'Pending')}
                </span>
              </p>
              <p>{data?.paymentInfo?.method || 'Not specified'}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-6 space-y-3 transition-colors">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">ETB {Number(data.subtotal || data.totalPrice || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                <span className="text-gray-900 dark:text-white">ETB {Number(data.shippingCost || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tax</span>
                <span className="text-gray-900 dark:text-white">ETB {Number(data.tax || 0).toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-[#75d04b]">ETB {Number(data.totalPrice || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Contact Seller */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Need help with this order?
            </p>
            {sellerId ? (
              <Link
                to={`/shops/${sellerId}`}
                className="inline-flex items-center gap-2 h-11 px-5 bg-[#75d04b] text-white rounded-full font-semibold text-sm hover:brightness-95 transition shadow-xs"
              >
                Contact Seller
              </Link>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This order has no shop attached — please contact support.
              </p>
            )}
          </div>

          {/* Return/Refund Section */}
          {id && (
            <div id="refund" className="bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-800 p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Returns & Refunds</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                You can return items within 30 days of delivery
              </p>
              {normalizeStatus(data?.status) === 'Delivered' && (
                <button
                  onClick={handleRefundRequest}
                  className="h-11 px-5 bg-amber-600 text-white rounded-full font-semibold text-sm hover:bg-amber-700 transition"
                >
                  Request Return/Refund
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      {open && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Write a Review</h2>
              <button
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition"
                onClick={() => {
                  setOpen(false)
                  setSelectedItem(null)
                }}
              >
                <RxCross1 size={20} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit}>
              {/* Product Info */}
              <div className="flex gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
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
                  className="w-16 h-16 object-cover rounded-md bg-gray-100 dark:bg-gray-700"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">{selectedItem.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ETB {selectedItem.discountPrice}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Your Rating <span className="text-red-600">*</span>
                </h5>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i)}
                      className="text-2xl transition hover:scale-110"
                    >
                      {rating >= i ? (
                        <AiFillStar className="text-amber-400" />
                      ) : (
                        <AiOutlineStar className="text-gray-300 dark:text-gray-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="font-semibold text-gray-900 dark:text-white text-sm mb-2 block">
                  Your Review <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-md p-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#75d04b] focus:border-[#75d04b] resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    setSelectedItem(null)
                  }}
                  className="flex-1 h-11 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 h-11 px-4 rounded-full font-semibold transition ${
                    submitting
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-[#75d04b] text-white hover:brightness-95 shadow-xs'
                  }`}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetailComponent
