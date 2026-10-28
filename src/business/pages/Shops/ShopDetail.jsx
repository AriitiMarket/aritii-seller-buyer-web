import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Loading from '@/components/common/Loading';
import ShopProfileData from '@/business/components/ShopProfileData';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { SellerEmptyState } from '@/business/components';
import { FiArrowLeft, FiMapPin, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

const STATUS_CONFIG = {
  ACTIVE: { label: 'Active', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: FiCheckCircle },
  APPROVED: { label: 'Approved', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: FiCheckCircle },
  PENDING_APPROVAL: { label: 'Pending Approval', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: FiClock },
  SUSPENDED: { label: 'Suspended', bg: 'bg-red-50 text-red-700 border-red-200', icon: FiAlertCircle },
};

const ShopDetailPage = () => {
  const { id } = useParams();
  const { shops, loading } = useBusinessShops();
  const shop = shops.find((item) => (item._id || item.id) === id);

  if (loading && shops.length === 0) {
    return <Loading variant="inline" label="Loading store details…" />;
  }

  if (!shop) {
    return (
      <SellerEmptyState
        title="Store not found"
        description="This store does not belong to your account or is no longer available."
        action={{ to: '/business/shops', label: 'Back to Stores' }}
        icon="🏪"
      />
    );
  }

  const status = STATUS_CONFIG[shop.status] || {
    label: shop.status || 'Active',
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: FiCheckCircle,
  };
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {shop.name || 'Store'}
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.bg}`}
            >
              <StatusIcon size={12} />
              <span>{status.label}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex-wrap">
            {shop.address && (
              <span className="flex items-center gap-1">
                <FiMapPin size={12} />
                <span>{shop.address}</span>
              </span>
            )}
            {shop.category && (
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded font-medium">
                {shop.category}
              </span>
            )}
          </div>
        </div>

        <Link
          to="/business/shops"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition w-fit"
        >
          <FiArrowLeft size={13} />
          <span>Back to All Stores</span>
        </Link>
      </div>

      {/* Store Tabs and Content */}
      <ShopProfileData isOwner shopId={id} />
    </div>
  );
};

export default ShopDetailPage;
