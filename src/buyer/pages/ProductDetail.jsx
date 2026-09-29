import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@/shared/components/Breadcrumbs';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '@/shared/hooks/useProducts';
import { productService } from '@/services';
import { useAuth } from '@/auth/hooks/useAuth';
import ProductDetail from '@/buyer/components/ProductDetail';
import SuggestedProducts from '@/buyer/components/SuggestedProducts';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';

/**
 * Product detail page (canonical route: /product/:id).
 *
 * Resolution order:
 *   1. The product store, seeded by useProducts (catalog cache).
 *   2. Public endpoint for guests / authenticated endpoint for signed-in users.
 */
const ProductDetailsPage = () => {
  const { id } = useParams();
  const { products: allProducts = [], error: productsError } = useProducts();
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(productsError || null);

  useEffect(() => {
    let active = true;

    if (id && allProducts.length > 0) {
      const fromStore = allProducts.find(
        (item) => (item._id || item.id) === id
      );
      if (fromStore) {
        setData(fromStore);
        setLoading(false);
        return;
      }
    }

    if (!active) return;
    setLoading(true);
    setError(null);

    if (!id) {
      setError('No product id provided');
      setData(null);
      setLoading(false);
      return;
    }

    // Guests must use the public endpoint — the authenticated one 401s and the
    // interceptor force-redirects to /login.
    const fetcher = isAuthenticated ? productService.getById(id) : productService.getPublicById(id);

    fetcher
      .then((fetched) => {
        if (!active) return;
        setData(fetched || null);
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err.response?.data?.message ||
            err.message ||
            'Could not load product'
        );
        setData(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, allProducts, isAuthenticated]);

  return (
    <>
      {loading ? (
        <Loading variant="inline" label="Loading product…" />
      ) : error || !data ? (
        <div className="max-w-3xl mx-auto py-16">
          <EmptyState
            title="Product not found"
            description={
              error || 'This product is not available on Aritii Market.'
            }
            action={
              <Link
                to="/products"
                className="inline-block px-5 py-2.5 bg-[#20305C] hover:bg-[#2C3F6E] text-white rounded-xl font-semibold transition-colors"
              >
                Back to products
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label: data?.name || 'Loading...' }]} />
          <ProductDetail data={data} />
          <SuggestedProducts data={data} />
        </>
      )}
    </>
  );
};

export default ProductDetailsPage;
