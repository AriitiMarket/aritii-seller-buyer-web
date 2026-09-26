import React, { useEffect, useState } from 'react';
import ShopCard from '@/shared/components/ShopCard';
import SectionHeader from '@/public/components/SectionHeader';
import { publicContentService } from '@/public/services/publicContentService';

/**
 * PopularShops - Shop cards with ratings and product counts
 * Fetches first 6 shops from Redux state (backend data)
 */

const SelectedShops = () => {
  const [shops, setShops] = useState([]);
  useEffect(() => {
    let active = true;
    publicContentService.getFeaturedShops().then((items) => {
      if (active) setShops(items);
    }).catch(() => {
      if (active) setShops([]);
    });
    return () => { active = false; };
  }, []);

  if (shops.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Popular Shops"
          description="Trusted sellers loved by our community"
          viewAllLink="/shops"
        />

        {/* Shop Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {shops.slice(0, 8).map((shop) => (
            <ShopCard 
              data={shop} 
              key={shop._id || shop.id} 
              variant="public"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { SelectedShops };
export default SelectedShops;
