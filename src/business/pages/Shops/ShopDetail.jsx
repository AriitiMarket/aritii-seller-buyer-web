import React from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '@/components/common/EmptyState';
import Loading from '@/components/common/Loading';
import ShopProfileData from '@/business/components/ShopProfileData';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';

/**
 * Business - one shop's detail (/business/shops/:id).
 *
 * Because a business can own several shops, this page resolves the shop from the
 * business's own shop list (useBusinessShops) and renders the owner view of its
 * public profile + catalog. The backend still enforces ownership.
 */
const ShopDetailPage = () => {
  const { id } = useParams();
  const { shops, loading } = useBusinessShops();
  const shop = shops.find((item) => item._id === id);

  if (loading && shops.length === 0) {
    return <Loading variant="inline" label="Loading shop…" />;
  }

  if (!shop) {
    return (
      <EmptyState
        title="Shop not found in this business"
        description="This shop does not belong to your business, or it is still being set up."
        action={
          <Link
            to="/business/shops"
            className="inline-block px-5 py-2.5 bg-brand-primary text-white rounded-lg font-semibold"
          >
            Back to my shops
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-5 md:p-6 shadow-sm border border-gray-100">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    {shop.name || 'Shop'}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Owner view - this is what buyers see on your public shop page.
        </p>
      </div>
      <ShopProfileData isOwner shopId={id} />
    </div>
  );
};

export default ShopDetailPage;
