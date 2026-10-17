import React from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '@/components/common/EmptyState';
import Loading from '@/components/common/Loading';
import ShopProfileData from '@/business/components/ShopProfileData';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { SellerEmptyState } from '@/business/components';

const ShopDetailPage = () => {
  const { id } = useParams();
  const { shops, loading } = useBusinessShops();
  const shop = shops.find((item) => item._id === id);

  if (loading && shops.length === 0) {
    return <Loading variant="inline" label="Loading shop…" />;
  }

  if (!shop) {
    return (
      <SellerEmptyState
        title="Shop not found"
        description="This shop does not belong to your business, or it is still being set up."
        action={{ to: '/business/shops', label: 'Back to my shops' }}
        icon="🏪"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-market-on-surface">{shop.name || 'Shop'}</h1>
          <p className="text-sm text-market-on-surface-variant">Owner view — this is what buyers see on your public shop page.</p>
        </div>
        <Link to="/business/shops" className="seller-btn-secondary w-full sm:w-auto text-center sm:text-left">
          Back to my shops
        </Link>
      </div>
      <ShopProfileData isOwner shopId={id} />
    </div>
  );
};

export default ShopDetailPage;
