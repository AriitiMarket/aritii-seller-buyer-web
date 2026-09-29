import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '@/shared/components/ProductCard';
import SectionHeader from '@/public/components/SectionHeader';
import { publicContentService } from '@/public/services/publicContentService';

/**
 * TrendingProducts - Popular and trending products
 * Shows best-selling and highly-rated products
 */
const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    let active = true;
    publicContentService.getFeaturedProducts().then((items) => {
      if (active) {
        // Sort by sales count to get trending products
        const trendingProducts = items
          .filter(p => p.total_sell || p.sold_out)
          .sort((a, b) => (b.total_sell || b.sold_out || 0) - (a.total_sell || a.sold_out || 0))
          .slice(0, 8);
        setProducts(trendingProducts);
      }
    }).catch(() => {
      if (active) setProducts([]);
    });
    return () => { active = false; };
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="home-brand-section home-brand-section--products py-10 md:py-14 bg-[#FDF6EC] dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Trending Now"
          description="Most popular products this week"
          viewAllLink="/best-selling"
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

export { TrendingProducts };
export default TrendingProducts;
