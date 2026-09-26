import React from 'react'
import { MdCheckCircle, MdLocalShipping, MdPending, MdCancel } from 'react-icons/md'
import { normalizeStatus } from '@/shared/utils/orderStatus'

const STATUS_MAP = {
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700 border-green-200', icon: <MdCheckCircle size={14} /> },
  succeeded: { label: 'Delivered', color: 'bg-green-100 text-green-700 border-green-200', icon: <MdCheckCircle size={14} /> },
  completed: { label: 'Delivered', color: 'bg-green-100 text-green-700 border-green-200', icon: <MdCheckCircle size={14} /> },
  shipped: { label: 'On the way', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <MdLocalShipping size={14} /> },
  'out for delivery': { label: 'On the way', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <MdLocalShipping size={14} /> },
  // Backend state machine (orders/constants/orderStatuses.js)
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <MdCheckCircle size={14} /> },
  'in transit': { label: 'On the way', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <MdLocalShipping size={14} /> },
  'refund requested': { label: 'Refund requested', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <MdPending size={14} /> },
  'refund approved': { label: 'Refund approved', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <MdPending size={14} /> },
  'refund success': { label: 'Refunded', color: 'bg-green-100 text-green-700 border-green-200', icon: <MdCheckCircle size={14} /> },
  'refund rejected': { label: 'Refund rejected', color: 'bg-red-100 text-red-700 border-red-200', icon: <MdCancel size={14} /> },
  processing: { label: 'Processing', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <MdPending size={14} /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200', icon: <MdCancel size={14} /> },
  failed: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200', icon: <MdCancel size={14} /> },
  pending: { label: 'Pending', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: <MdPending size={14} /> },
}

const DEFAULT_STATUS = { label: 'Pending', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: <MdPending size={14} /> }

export function getOrderStatus(status) {
  const s = String(normalizeStatus(status) || 'pending').toLowerCase()
  return STATUS_MAP[s] || DEFAULT_STATUS
}

export function isOrderDelivered(status) {
  const s = String(normalizeStatus(status) || '').toLowerCase()
  return s === 'delivered' || s === 'succeeded' || s === 'completed' || s === 'refund success'
}

export function isOrderCancelled(status) {
  const s = String(normalizeStatus(status) || '').toLowerCase()
  return s === 'cancelled' || s === 'failed'
}

export function isOrderInProgress(status) {
  const s = String(normalizeStatus(status) || '').toLowerCase()
  return !isOrderDelivered(s) && !isOrderCancelled(s)
}

export function isOrderTrackable(status) {
  const s = String(normalizeStatus(status) || '').toLowerCase()
  return s === 'shipped' || s === 'out for delivery' || s === 'processing' || s === 'in transit'
}

export function isOrderCancellable(status) {
  const s = String(normalizeStatus(status) || '').toLowerCase()
  // Only Processing/Confirmed may be cancelled (matches backend whitelist).
  // The old check let refund-state orders show a Cancel button that always 400'd.
  return s === 'processing' || s === 'confirmed' || s === 'pending'
}

export function formatPrice(amount) {
  return `${Number(amount || 0).toLocaleString()} ETB`
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}
