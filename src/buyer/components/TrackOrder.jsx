import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getAllOrdersOfUser } from '@/store/slices/orderThunks'
import { ORDER_STATUSES, normalizeStatus } from '@/shared/utils/orderStatus'
import OrderDeliveryCard from '@/shared/components/OrderDeliveryCard'
import {
  BsCheckCircle,
  BsHourglassSplit,
  BsBox2,
  BsTruck,
  BsExclamationCircle
} from 'react-icons/bs'
import '@/buyer/components/TrackOrder.css'

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order)
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const { id } = useParams()
  // Identity users carry `id` (UUID); `_id` is the Mongo-style fallback.
  const userId = user?.id || user?._id

  useEffect(() => {
    if (userId) {
      dispatch(getAllOrdersOfUser(userId))
    }
  }, [dispatch, userId])

  const data = orders?.find((item) => item._id === id)

  // Canonical order statuses only — the mirror of the Commerce state machine
  // (shared/utils/orderStatus.js). The previous map was keyed by statuses no
  // service ever writes ('Transferred to delivery partner', 'Shipping',
  // 'Received', 'On the way'), so every real order fell through to the generic
  // branch and the buyer was told nothing useful.
  const getStatusInfo = (status) => {
    const canonical = normalizeStatus(status) || ORDER_STATUSES.PROCESSING
    const statusMap = {
      [ORDER_STATUSES.PROCESSING]: {
        icon: BsHourglassSplit,
        title: 'Order Processing',
        message: 'The shop is preparing your order. Delivery is requested once it is confirmed.',
        className: 'status-processing'
      },
      [ORDER_STATUSES.CONFIRMED]: {
        icon: BsBox2,
        title: 'Order Confirmed',
        message: 'The shop accepted your order and is getting it ready for the provider.',
        className: 'status-processing'
      },
      [ORDER_STATUSES.SHIPPED]: {
        icon: BsTruck,
        title: 'Handed to Delivery',
        message: 'Your order left the shop with the provider network.',
        className: 'status-shipped'
      },
      [ORDER_STATUSES.IN_TRANSIT]: {
        icon: BsTruck,
        title: 'Out for Delivery',
        message: 'The provider is on the way to your delivery address.',
        className: 'status-shipped'
      },
      [ORDER_STATUSES.DELIVERED]: {
        icon: BsCheckCircle,
        title: 'Order Delivered',
        message: 'Your order has been successfully delivered! Thank you for your purchase.',
        className: 'status-delivered'
      },
      [ORDER_STATUSES.CANCELLED]: {
        icon: BsExclamationCircle,
        title: 'Order Cancelled',
        message: 'This order has been cancelled.',
        className: 'status-cancelled'
      },
      [ORDER_STATUSES.REFUND_REQUESTED]: {
        icon: BsHourglassSplit,
        title: 'Refund Requested',
        message: 'Your refund request has been received and is being reviewed.',
        className: 'status-refunding'
      },
      [ORDER_STATUSES.REFUND_APPROVED]: {
        icon: BsHourglassSplit,
        title: 'Refund Approved',
        message: 'Your refund was approved and will be processed shortly.',
        className: 'status-refunding'
      },
      [ORDER_STATUSES.REFUND_SUCCESS]: {
        icon: BsCheckCircle,
        title: 'Refund Completed',
        message: 'Your refund has been successfully processed and credited to your account.',
        className: 'status-refund-success'
      },
      [ORDER_STATUSES.REFUND_REJECTED]: {
        icon: BsExclamationCircle,
        title: 'Refund Rejected',
        message: 'Your refund request was rejected. Please contact support for details.',
        className: 'status-cancelled'
      }
    }

    return (
      statusMap[canonical] || {
        icon: BsHourglassSplit,
        title: canonical,
        message: `Order status: ${canonical}`,
        className: 'status-processing'
      }
    )
  }

  if (!data) {
    return (
      <div className="track-order-container">
        <div className="track-order-empty">
          <p style={{ fontSize: '16px', color: '#6b7280' }}>
            Order not found. Please check your order ID.
          </p>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(data.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="track-order-container">
      <div className={`track-status-card ${statusInfo.className}`}>
        <div className="status-icon">
          <StatusIcon size={48} />
        </div>
        <h2 className="status-title">{statusInfo.title}</h2>
        <p className="status-message">{statusInfo.message}</p>

        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            borderLeft: '4px solid currentColor'
          }}
        >
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            Order ID: <strong style={{ color: '#1f2937', fontFamily: 'monospace' }}>{data._id}</strong>
          </p>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '8px 0 0 0' }}>
            Order Date: <strong style={{ color: '#1f2937' }}>
              {new Date(data.createdAt).toLocaleDateString()}
            </strong>
          </p>
        </div>
      </div>

      {/* Real shipment detail for this order (ORDER ↔ DELIVERY bridge). */}
      <OrderDeliveryCard
        orderId={id}
        orderStatus={normalizeStatus(data.status)}
        className="mt-6"
      />
    </div>
  )
}

export default TrackOrder
