import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import CreateEvent from '../../components/seller/CreateEvent.jsx'

/**
 * Modular create-event page (seller). Composes the existing backend-backed
 * event/promotion creation form (image upload/URL, pricing, dates, category)
 * inside the shared seller layout.
 */
const SellerCreateEventPage = () => (
  <SellerLayout sidebarActive={6}>
    <div className="bg-white rounded-md shadow p-3">
      <h1 className="text-xl font-Poppins font-semibold mb-1">Create Event / Promotion</h1>
      <p className="text-sm text-brand-muted mb-3">Create a promotional event for your shop products. Events appear in the marketplace.</p>
      <CreateEvent />
    </div>
  </SellerLayout>
)

export default SellerCreateEventPage