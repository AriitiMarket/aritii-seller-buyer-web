import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AddShopModal from '@/business/components/AddShopModal';
import Loading from '@/components/common/Loading';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { sellerService } from '@/services/seller.service';
import { SellerEmptyState } from '@/business/components';
import {
  FiPlus,
  FiRefreshCw,
  FiExternalLink,
  FiCheckCircle,
  FiCheck,
  FiMapPin,
  FiPackage,
  FiClock,
  FiAlertCircle,
  FiSettings,
} from 'react-icons/fi';

const STATUS_CONFIG = {
  ACTIVE: { label: 'Active', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: FiCheckCircle },
  APPROVED: { label: 'Approved', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: FiCheckCircle },
  PENDING_APPROVAL: { label: 'Pending Approval', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: FiClock },
  SUSPENDED: { label: 'Suspended', bg: 'bg-red-50 text-red-700 border-red-200', icon: FiAlertCircle },
  INACTIVE: { label: 'Inactive', bg: 'bg-gray-100 text-gray-600 border-gray-200', icon: FiAlertCircle },
};

const locationLabel = (shop) => {
  const snap = shop.locationSnapshot || {};
  const parts = [snap.regionName, snap.cityName, snap.sectorName].filter(Boolean);
  return parts.length ? parts.join(' › ') : shop.address || 'Location not specified';
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
        title="Could not load stores"
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
          title="No store created yet"
          description="Your seller account is approved! Create your first store to start listing products on Aritii Marketplace."
          action={{ onClick: () => setAddOpen(true), label: 'Create Your Store' }}
          icon="🏪"
        />
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Store Management</h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                {hasMultipleShops
                  ? `You have ${shops.length} registered stores under your seller account.`
                  : 'Manage your store profile, catalog, and public presence on Aritii.'}
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              {canAddShop && (
                <button
                  type="button"
                  onClick={() => setAddOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] text-xs font-bold rounded-lg border border-[#a88734] transition shadow-xs cursor-pointer"
                >
                  <FiPlus size={14} />
                  <span>Add New Store</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => refresh()}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-700 transition shadow-xs cursor-pointer"
              >
                <FiRefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Shop list or empty state */}
          {shops.length === 0 && !isApproved ? (
            <SellerEmptyState
              title="No store open yet"
              description="Your business does not have a store on the platform yet. Complete your seller application to open a store."
              action={{ to: '/seller-registration', label: 'Complete Seller Application' }}
              icon="🏪"
            />
          ) : shops.length === 0 ? null : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {shops.map((shop) => {
                const isActive = shop._id === activeShopId;
                const status = STATUS_CONFIG[shop.status] || STATUS_CONFIG.ACTIVE;
                const StatusIcon = status.icon;

                return (
                  <div
                    key={shop._id}
                    className={`bg-white dark:bg-[#1a222d] rounded-xl p-5 shadow-xs border transition-all flex flex-col justify-between ${
                      isActive
                        ? 'border-amber-400 ring-1 ring-amber-300/50'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <div>
                      {/* Top Row: Store Avatar, Name, Status */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {shop.avatar?.url ? (
                            <img
                              src={shop.avatar.url}
                              alt={shop.name}
                              className="w-11 h-11 rounded-lg object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-extrabold flex items-center justify-center text-base border border-amber-300/80 flex-shrink-0">
                              {(shop.name || 'S').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h2 className="font-bold text-gray-900 dark:text-white truncate text-base">
                              {shop.name || 'Unnamed store'}
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate flex items-center gap-1">
                              <FiMapPin size={11} className="flex-shrink-0" />
                              <span className="truncate">{locationLabel(shop)}</span>
                            </p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border flex-shrink-0 ${status.bg}`}
                        >
                          <StatusIcon size={11} />
                          <span>{status.label}</span>
                        </span>
                      </div>

                      {/* Store Description / Category */}
                      {shop.category && (
                        <div className="mb-3">
                          <span className="text-[11px] font-medium px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded">
                            {shop.category}
                          </span>
                        </div>
                      )}

                      {/* Store Metrics */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-xs mb-4">
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                          <FiPackage size={13} className="text-amber-600" />
                          <span>
                            <strong className="font-bold text-gray-900 dark:text-white">
                              {shop.productCount ?? 0}
                            </strong>{' '}
                            products
                          </span>
                        </div>
                        <div className="text-right text-gray-500 dark:text-gray-400">
                          {isActive && (
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold inline-flex items-center gap-0.5">
                              <FiCheck size={12} /> Active in Console
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        {hasMultipleShops && (
                          <button
                            type="button"
                            onClick={() => selectShop(shop._id)}
                            disabled={isActive}
                            className={`flex-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                              isActive
                                ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {isActive ? 'Current' : 'Select'}
                          </button>
                        )}
                        <Link
                          to={`/business/shops/${shop._id}`}
                          className="flex-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] border border-[#a88734] text-center transition shadow-xs"
                        >
                          Manage Store
                        </Link>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <Link
                          to={`/shops/${shop._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-semibold"
                        >
                          <span>Public Storefront</span>
                          <FiExternalLink size={11} />
                        </Link>
                        <Link
                          to="/business/settings"
                          onClick={() => selectShop(shop._id)}
                          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white inline-flex items-center gap-1 font-semibold"
                        >
                          <FiSettings size={11} />
                          <span>Settings</span>
                        </Link>
                      </div>
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
