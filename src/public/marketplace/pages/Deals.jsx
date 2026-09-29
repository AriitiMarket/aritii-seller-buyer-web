import React from 'react';
import SectionHeader from '@/public/components/SectionHeader';
import Breadcrumb from '@/public/marketplace/components/Breadcrumb';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import { usePromotions } from '@/shared/hooks/usePromotions';
import { formatDate } from '@/shared/utils/format';

/**
 * Deals / Promotions page (canonical route: /deals).
 *
 * Deals are PROMOTIONS: commercial offers and campaigns. They are deliberately
 * NOT the same feature as events, and they are not catalog items.
 */
const DealsPage = () => {
  const { promotions, supported, loading, error } = usePromotions();

  const renderBody = () => {
    if (loading) return <Loading variant="inline" label="Loading deals…" />;

    if (error) {
      return <EmptyState title="Could not load deals" description={error} />;
    }

    if (promotions.length === 0) {
      return (
        <EmptyState
          title="No deals available right now"
          description={
            supported
              ? 'New promotions from businesses will appear here.'
              : 'Business promotions are not exposed by the backend yet.'
          }
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {promotions.map((promotion) => (
          <div
            key={promotion._id || promotion.title}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            {promotion.banner ? (
              <img
                src={promotion.banner}
                alt={promotion.title}
                className="w-full h-40 md:h-48 object-cover"
              />
            ) : null}
            <div className="p-5 md:p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{promotion.title}</h3>
              {promotion.description ? (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{promotion.description}</p>
              ) : null}
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                {promotion.discountPercent ? (
                  <span className="px-2 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold">
                    -{promotion.discountPercent}%
                  </span>
                ) : null}
                {promotion.endsAt ? <span>Ends {formatDate(promotion.endsAt)}</span> : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Deals & Promotions' }]} />
      
      <SectionHeader
        title="Deals & Promotions"
        description="Current commercial offers from Aritii businesses"
      />
      {renderBody()}
    </>
  );
};

export default DealsPage;
