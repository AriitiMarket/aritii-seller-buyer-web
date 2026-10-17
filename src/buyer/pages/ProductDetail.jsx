import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@/shared/components/Breadcrumbs';
import { Link, useParams, useLocation } from 'react-router-dom';
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
 *
 * Navigation: breadcrumbs preserve the referrer URL so users can return to
 * their filtered results (category, search, etc.) without losing their context.
 */
const ProductDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { products: allProducts = [], error: productsError } = useProducts();
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(productsError || null);

  // Try to infer the referrer category/search from the back button or URL.
  // Fall back to /products if no referrer.
  const referrer = location.state?.from || document.referrer;
  const productsLink = referrer && (referrer.includes('/products') || referrer.includes('/product/'))
    ? new URL(referrer).pathname + new URL(referrer).search
    : '/products';

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
                className="inline-block px-5 py-2.5 bg-market-primary text-market-on-primary hover:bg-market-primary-hover rounded-xl font-semibold transition-colors"
              >
                Back to products
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <Breadcrumbs items={[
            { label: 'Home', to: '/' },
            { label: 'Products', to: productsLink },
            { label: data?.name || 'Loading...' }
          ]} />
          <ProductDetail data={data} basePath="/products" />
          <SuggestedProducts data={data} />
        </>
      )}
    </>
  );
};

export default ProductDetailsPage;
