import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ShopInfo from '@/business/components/ShopInfo';
import ShopProfileData from '@/business/components/ShopProfileData';
import AddShopModal from '@/business/components/AddShopModal';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { sellerService } from '@/services/seller.service';
import { SellerEmptyState } from '@/business/components';

const STATUS_LABELS = {
  PENDING_APPROVAL: 'Pending approval',
  APPROVED: 'Approved',
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  INACTIVE: 'Inactive',
};

const STATUS_STYLES = {
  APPROVED: 'bg-green-100 text-green-700',
  ACTIVE: 'bg-green-100 text-green-700',
  PENDING_APPROVAL: 'bg-amber-100 text-amber-700',
  SUSPENDED: 'bg-red-100 text-red-700',
  INACTIVE: 'bg-gray-100 text-gray-600',
};

const locationLabel = (shop) => {
  const snap = shop.locationSnapshot || {};
  const parts = [snap.regionName, snap.cityName, snap.sectorName].filter(Boolean);
  return parts.length ? parts.join(' › ') : shop.address || '—';
};

const BusinessShopsPage = () => {
  const { shops, activeShopId, hasMultipleShops, selectShop, loading, error, refresh } = useBusinessShops();
  const { isSeller } = useSelector((state) => state.seller || {});
  const [sellerType, setSellerType] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const isApproved = isSeller;

  useEffect(() => {
    let active = true;
    sellerService
      .getMyApplication()
      .then((application) => {
        if (active) setSellerType(application?.sellerType || 'INDIVIDUAL');
      })
      .catch(() => {
        if (active) setSellerType('INDIVIDUAL');
      });
    return () => { active = false; };
  }, []);

  const canAddShop = sellerType === 'BUSINESS' || isApproved;

  if (loading) return <Loading />;
  if (error) {
    return (
      <SellerEmptyState
        title="Could not load shops"
        description={error}
        action={{ to: '/business/shops', label: 'Try again' }}
        icon="⚠️"
      />
    );
  }

  return (
    <>
      {/* If approved but no shops, show empty state with shop creation option */}
      {isApproved && shops.length === 0 ? (
        <SellerEmptyState
          title="No store yet"
          description="Your seller account is approved! Create your first shop to start selling on Aritii Marketplace."
          action={{ onClick: () => setAddOpen(true), label: 'Create Your First Shop' }}
          icon="🏪"
        />
      ) : (
        <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-market-on-surface">Store Management</h2>
            <p className="text-sm text-market-on-surface-variant">
              {hasMultipleShops ? `Manage your ${shops.length} stores` : 'Manage your store profile and settings'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {canAddShop && (
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="seller-btn-primary flex-1 sm:flex-auto text-center sm:text-left"
              >
                Add shop
              </button>
            )}
            <button
              type="button"
              onClick={() => refresh()}
              disabled={loading}
              className="seller-btn-secondary flex-1 sm:flex-auto text-center sm:text-left"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Shop list or empty state */}
        {shops.length === 0 && !isApproved ? (
          <SellerEmptyState
            title="No store yet"
            description="Your business does not have a store on the platform yet. Complete your seller application to open a store."
            action={{ to: '/seller-registration', label: 'Complete Seller Application' }}
            icon="🏪"
          />
        ) : shops.length === 0 ? null : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {shops.map((shop) => {
              const isActive = shop._id === activeShopId;
              return (
                <div
                  key={shop._id}
                  className={`bg-white dark:bg-[#1a1f2a] rounded-xl p-4 sm:p-5 shadow-sm border ${isActive ? 'border-market-primary' : 'border-market-border'} transition-colors hover:border-market-primary`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <h2 className="font-semibold text-market-on-surface truncate text-sm sm:text-base">
                        {shop.name || 'Unnamed store'}
                      </h2>
                      <p className="text-xs text-market-on-surface-variant mt-1 truncate">
                        {locationLabel(shop)}
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[shop.status] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {STATUS_LABELS[shop.status] || shop.status || 'Pending approval'}
                    </span>
                  </div>
                  <p className="text-sm text-market-on-surface-variant mb-4">
                    {shop.productCount ?? 0} product{(shop.productCount ?? 0) === 1 ? '' : 's'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => selectShop(shop._id)}
                      disabled={isActive}
                      className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg border border-market-border text-market-on-surface-variant hover:bg-market-surface-container-high disabled:opacity-60 transition-colors ${isActive ? 'bg-market-surface-container-low text-market-primary border-market-primary' : ''}`}
                    >
                      {isActive ? 'Selected' : 'Select'}
                    </button>
                    <Link
                      to={`/business/shops/${shop._id}`}
                      className="flex-1 px-3 py-2 text-sm font-semibold rounded-lg bg-market-primary text-market-on-primary text-center transition-colors"
                    >
                      Manage
                    </Link>
                    <Link
                      to="/business/settings"
                      onClick={() => selectShop(shop._id)}
                      className="flex-1 px-3 py-2 text-sm font-semibold rounded-lg border border-market-border text-market-on-surface-variant hover:bg-market-surface-container-high text-center transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}
      {/* Add Shop Modal */}
      <AddShopModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() => {
          setAddOpen(false);
          refresh();
        }}
      />
    </>
  );
};

export default BusinessShopsPage;
