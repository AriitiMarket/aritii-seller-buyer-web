import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '@/shared/components/ProductCard';
import SectionHeader from '@/public/components/SectionHeader';
import { publicContentService } from '@/public/services/publicContentService';

/**
 * DealsSection - Special offers and discounted products
 * Similar to Amazon's Deals section
 */
const DealsSection = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    let active = true;
    publicContentService.getFeaturedProducts().then((items) => {
      if (active) {
        // Filter products with discounts
        const discountedProducts = items.filter(p => p.discountPrice && p.originalPrice && p.discountPrice < p.originalPrice);
        setProducts(discountedProducts.slice(0, 8));
      }
    }).catch(() => {
      if (active) setProducts([]);
    });
    return () => { active = false; };
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-[#FDF6EC] dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Today's Deals"
          description="Limited-time offers on top products"
          viewAllLink="/deals"
        />

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {products.map((product) => (
            <ProductCard 
              data={product} 
              key={product._id || product.id} 
              variant="public"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { DealsSection };
export default DealsSection;
