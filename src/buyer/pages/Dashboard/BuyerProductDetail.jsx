import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '@/shared/hooks/useProducts';
import { productService } from '@/services';
import ProductDetail from '@/buyer/components/ProductDetail';
import SuggestedProducts from '@/buyer/components/SuggestedProducts';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import { MdArrowBack } from 'react-icons/md';

const BuyerProductDetail = () => {
  const { id } = useParams();
  const { products: allProducts = [] } = useProducts();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    if (id && allProducts.length > 0) {
      const fromStore = allProducts.find((item) => (item._id || item.id) === id);
      if (fromStore) {
        setData(fromStore);
        setLoading(false);
        return;
      }
    }

    if (!id) {
      setError('No product id provided');
      setData(null);
      setLoading(false);
      return;
    }

    productService
      .getById(id)
      .then((fetched) => {
        if (!active) return;
        setData(fetched || null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.response?.data?.message || err.message || 'Could not load product');
        setData(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [id, allProducts]);

  return (
    <div className="space-y-6">
      <Link
        to="/my-dashboard/marketplace"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-market-on-surface-variant hover:text-market-secondary transition"
      >
        <MdArrowBack size={18} />
        Back to Marketplace
      </Link>

      {loading ? (
        <Loading variant="inline" label="Loading product…" />
      ) : error || !data ? (
        <div className="max-w-3xl mx-auto py-16">
          <EmptyState
            title="Product not found"
            description={error || 'This product is not available on Aritii Market.'}
            action={
              <Link
                to="/my-dashboard/marketplace"
                className="inline-block px-5 py-2.5 bg-market-primary text-market-on-primary rounded-lg font-semibold hover:opacity-90 transition"
              >
                Back to Marketplace
              </Link>
            }
          />
        </div>
      ) : (
        <>
          {/* ProductDetail keeps basePath="/my-dashboard" for its SHOP links
              (/my-dashboard/shops/:id); SuggestedProducts renders product cards,
              whose canonical route is /my-dashboard/marketplace/product/:id. */}
          <ProductDetail data={data} basePath="/my-dashboard" />
          <SuggestedProducts data={data} basePath="/my-dashboard/marketplace" />
        </>
      )}
    </div>
  );
};

export default BuyerProductDetail;
