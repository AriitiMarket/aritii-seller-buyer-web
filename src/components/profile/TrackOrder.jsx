import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getAllOrdersOfUser } from '../../store/redux/actions/order'
import {
  BsCheckCircle,
  BsHourglassSplit,
  BsBox2,
  BsGeoAlt,
  BsTruck,
  BsExclamationCircle
} from 'react-icons/bs'
import './TrackOrder.css'

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order)
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const { id } = useParams()

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id))
    }
  }, [dispatch, user?._id])

  const data = orders?.find((item) => item._id === id)

  const getStatusInfo = (status) => {
    const statusMap = {
      Processing: {
        icon: BsHourglassSplit,
        title: 'Order Processing',
        message: 'Your order is being processed at the shop. Please wait while we prepare your items.',
        className: 'status-processing'
      },
      'Transferred to delivery partner': {
        icon: BsBox2,
        title: 'Transferred to Delivery',
        message: 'Your order has been handed over to our delivery partner. Shipment is on the way!',
        className: 'status-shipped'
      },
      Shipping: {
        icon: BsTruck,
        title: 'Shipping In Progress',
        message: 'Your order is currently in transit with our delivery partner.',
        className: 'status-shipped'
      },
      Received: {
        icon: BsGeoAlt,
        title: 'Arrived in Your City',
        message: 'Your order has arrived in your city. Our delivery person will deliver it soon.',
        className: 'status-shipped'
      },
      'On the way': {
        icon: BsTruck,
        title: 'Out for Delivery',
        message: 'Your delivery person is on their way to your location with your order.',
        className: 'status-shipped'
      },
      Delivered: {
        icon: BsCheckCircle,
        title: 'Order Delivered',
        message: 'Your order has been successfully delivered! Thank you for your purchase.',
        className: 'status-delivered'
      },
      'Processing refund': {
        icon: BsHourglassSplit,
        title: 'Refund Processing',
        message: 'Your refund request is being processed. This may take a few business days.',
        className: 'status-refunding'
      },
      'Refund Success': {
        icon: BsCheckCircle,
        title: 'Refund Completed',
        message: 'Your refund has been successfully processed and credited to your account.',
        className: 'status-refund-success'
      },
      Cancelled: {
        icon: BsExclamationCircle,
        title: 'Order Cancelled',
        message: 'This order has been cancelled.',
        className: 'status-cancelled'
      }
    }

    return (
      statusMap[status] || {
        icon: BsHourglassSplit,
        title: 'Order Status',
        message: `Order status: ${status}`,
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
  )
}

export default TrackOrder
