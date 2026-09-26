import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ShopInfo from '@/business/components/ShopInfo'
import ShopProfileData from '@/business/components/ShopProfileData'
import AddShopModal from '@/business/components/AddShopModal'
import Loading from '@/components/common/Loading'
import EmptyState from '@/components/common/EmptyState'
import { useBusinessShops } from '@/business/hooks/useBusinessShops'
import { sellerService } from '@/services/seller.service'

const STATUS_LABELS = {
  PENDING_APPROVAL: 'Pending approval',
  APPROVED: 'Approved',
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  INACTIVE: 'Inactive',
}

const STATUS_STYLES = {
  APPROVED: 'bg-green-50 text-green-700',
  ACTIVE: 'bg-green-50 text-green-700',
  PENDING_APPROVAL: 'bg-amber-50 text-amber-700',
  SUSPENDED: 'bg-red-50 text-red-700',
  INACTIVE: 'bg-gray-100 text-gray-600',
}

const locationLabel = (shop) => {
  const snap = shop.locationSnapshot || {}
  const parts = [snap.regionName, snap.cityName, snap.sectorName].filter(Boolean)
  return parts.length ? parts.join(' › ') : shop.address || '—'
}

/**
 * Business → Shops.
 *
 * Lists EVERY shop this business owns (name, status, location, real product
 * count). Ownership is enforced by the backend: `/shop/getseller` only ever
 * returns the caller's shops. The active shop's profile + catalog are shown
 * below, and "Manage" opens the per-shop detail page.
 */
const BusinessShopsPage = () => {
  const { shops, activeShopId, hasMultipleShops, selectShop, loading, error, refresh } = useBusinessShops()
  const [sellerType, setSellerType] = useState(null)
  const [addOpen, setAddOpen] = useState(false)

  // sellerType decides whether a second store is allowed at all: BUSINESS may
  // own several shops (each with its own category), INDIVIDUAL exactly one.
  useEffect(() => {
    let active = true
    sellerService
      .getMyApplication()
      .then((application) => {
        if (active) setSellerType(application?.sellerType || 'INDIVIDUAL')
      })
      .catch(() => {
        if (active) setSellerType('INDIVIDUAL')
      })
    return () => {
      active = false
    }
  }, [])

  const canAddShop = sellerType === 'BUSINESS'

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Store Management</h1>
            <p className="text-sm text-gray-600">
              {hasMultipleShops
                ? `Manage your ${shops.length} stores and their settings`
                : 'Manage your store profile and settings'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {canAddShop && (
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-primary text-white hover:opacity-90"
              >
                Add shop
              </button>
            )}
            <button
              type="button"
              onClick={() => refresh()}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>
        {sellerType && !canAddShop && (
          <p className="mt-3 text-xs text-gray-500">
            Individual accounts operate a single store. Convert to a business account to open more shops under different
            categories.
          </p>
        )}
      </div>

      <AddShopModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() => refresh()}
      />

      {error ? (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {loading && shops.length === 0 ? (
        <Loading variant="inline" label="Loading your stores…" />
      ) : shops.length === 0 ? (
        <EmptyState
          title="No store yet"
          description="Your business does not have a store on the platform yet. You can open one from seller onboarding."
          action={
            <Link to="/seller-registration" className="inline-block px-5 py-2.5 bg-brand-primary text-white rounded-lg font-semibold">
              Open a store
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shops.map((shop) => {
            const isActive = shop._id === activeShopId
            return (
              <div
                key={shop._id}
                className={`bg-white rounded-xl p-5 shadow-sm border ${isActive ? 'border-brand-primary' : 'border-gray-100'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 truncate">{shop.name || 'Unnamed store'}</h2>
                    <p className="text-xs text-gray-500 mt-1 truncate">{locationLabel(shop)}</p>
                  </div>
                  <span
                    className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[shop.status] || 'bg-gray-100 text-gray-600'}`}
                  >
                    {STATUS_LABELS[shop.status] || shop.status || 'Pending approval'}
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-600">
                  {shop.productCount ?? 0} product{(shop.productCount ?? 0) === 1 ? '' : 's'}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => selectShop(shop._id)}
                    disabled={isActive}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                  >
                    {isActive ? 'Selected' : 'Select'}
                  </button>
                  <Link
                    to={`/business/shops/${shop._id}`}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-primary text-white"
                  >
                    Manage
                  </Link>
                  <Link
                    to="/business/settings"
                    onClick={() => selectShop(shop._id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* The active shop's profile + catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:sticky lg:top-4">
            <ShopInfo isOwner={true} shopId={activeShopId} />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <ShopProfileData isOwner={true} shopId={activeShopId} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessShopsPage
