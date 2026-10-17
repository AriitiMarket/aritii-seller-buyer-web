import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetail, transitionProduct } from '@/store/slices/productThunks';
import { ProductImage } from '@/components/common/ImageWithFallback';
import Loader from '@/components/common/Loading';
import { toast } from 'react-toastify';
import { SellerStatusBadge } from '@/business/components';

const BusinessProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, isLoading } = useSelector((state) => state.products);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    dispatch(getProductDetail(id)).catch((err) => {
      setError(err?.response?.data?.message || err?.message || 'Could not load product');
    });
  }, [dispatch, id]);

  const handleLifecycle = async (action) => {
    const labels = {
      publish: 'Product published',
      draft: 'Product moved to draft',
      archive: 'Product archived',
      unarchive: 'Product restored as draft',
    };
    try {
      await dispatch(transitionProduct(id, action));
      toast.success(labels[action] || 'Product updated');
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Action failed');
    }
  };

  if (error) {
    return (
      <div className="seller-empty-state text-center py-16">
        <span className="seller-empty-state-icon">⚠️</span>
        <h3 className="seller-empty-state-title">Could not load product</h3>
        <p className="seller-empty-state-desc">{error}</p>
        <Link to="/business/products" className="seller-btn-primary">
          Back to products
        </Link>
      </div>
    );
  }
  if (isLoading || !currentProduct) return <Loader />;

  const p = currentProduct;
  const lifecycle = p.status || 'PUBLISHED';
  const images = Array.isArray(p.images) ? p.images : [];
  const badge = p.isActive === false
    ? { label: 'Deactivated (admin)', cls: 'bg-red-100 text-red-700' }
    : lifecycle === 'ARCHIVED'
    ? { label: 'Archived', cls: 'bg-gray-100 text-gray-600' }
    : lifecycle === 'PUBLISHED'
    ? { label: 'Published', cls: 'bg-green-100 text-green-700' }
    : { label: 'Draft', cls: 'bg-gray-100 text-gray-600' };

  const available = Math.max(0, Number(p.stock ?? 0) - Number(p.reserved ?? 0));

  return (
    <div className="seller-shell-bg min-h-screen space-y-6">
      <div className="seller-section-header">
        <div className="flex items-center justify-between sm:flex-row sm:items-center">
          <div>
            <Link to="/business/products" className="inline-flex items-center gap-1 text-sm text-market-primary hover:underline">
              &larr; Back to products
            </Link>
            <h1 className="seller-section-header-title mt-2">{p.name}</h1>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${badge.cls}`}>
            {badge.label}
          </span>
        </div>
      </div>

      <div className="max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="seller-form-section">
            <div className="relative w-full h-64 bg-market-surface-container-low rounded-xl overflow-hidden">
              <ProductImage data={p} className="w-full h-full object-contain p-4" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                {images.slice(0, 6).map((img, i) => {
                  const src = typeof img === 'string' ? img : img?.url;
                  return src ? (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-14 h-14 object-cover rounded border cursor-pointer hover:border-market-primary"
                    />
                  ) : null;
                })}
              </div>
            )}
          </div>

          <div className="seller-form-section flex-1">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-xl font-bold text-market-on-surface">{p.name}</h2>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-sm text-market-on-surface-variant mb-4">
              {p.category || 'No category'} · {p.shop?.name || 'Your shop'}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-market-on-surface-variant">Selling price</p>
                <p className="font-semibold text-market-on-surface">{Number(p.discountPrice || 0).toLocaleString()} {p.currency || 'ETB'}</p>
              </div>
              <div>
                <p className="text-sm text-market-on-surface-variant">List price</p>
                <p className="font-semibold text-market-on-surface">{p.originalPrice ? Number(p.originalPrice).toLocaleString() : '—'}</p>
              </div>
              <div>
                <p className="text-sm text-market-on-surface-variant">Stock</p>
                <p className={`font-semibold ${available < 1 ? 'text-red-600' : available <= 5 ? 'text-amber-600' : 'text-market-on-surface'}`}>
                  {available} available{p.reserved ? ` · ${p.stock ?? 0} total (${p.reserved} reserved)` : ` / ${p.stock ?? 0} total`}
                </p>
              </div>
              <div>
                <p className="text-sm text-market-on-surface-variant">Sold</p>
                <p className="font-semibold text-market-on-surface">{p.sold_out || 0}</p>
              </div>
              <div>
                <p className="text-sm text-market-on-surface-variant">SKU</p>
                <p className="font-semibold text-market-on-surface">{p.sku || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-market-on-surface-variant">Rating</p>
                <p className="font-semibold text-market-on-surface">{Number(p.ratings || 0).toFixed(1)} / 5</p>
              </div>
              <div>
                <p className="text-sm text-market-on-surface-variant">Created</p>
                <p className="font-semibold text-market-on-surface">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</p>
              </div>
              <div>
                <p className="text-sm text-market-on-surface-variant">Last updated</p>
                <p className="font-semibold text-market-on-surface">{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '—'}</p>
              </div>
            </div>

            {p.description && (
              <div className="mb-6 pt-4 border-t border-market-border">
                <p className="text-sm text-market-on-surface-variant mb-1 font-medium">Description</p>
                <p className="text-market-on-surface-variant text-sm whitespace-pre-wrap">{p.description}</p>
              </div>
            )}

            <div className="flex gap-3">
              {lifecycle !== 'ARCHIVED' && (lifecycle === 'DRAFT' ? (
                <button
                  onClick={() => handleLifecycle('publish')}
                  className="seller-btn-primary flex-1"
                >
                  Publish
                </button>
              ) : (
                <button
                  onClick={() => handleLifecycle('draft')}
                  className="seller-btn-secondary flex-1"
                >
                  Move to draft
                </button>
              ))}
              {lifecycle === 'ARCHIVED' ? (
                <button
                  onClick={() => handleLifecycle('unarchive')}
                  className="seller-btn-primary flex-1"
                >
                  Restore as draft
                </button>
              ) : null}
              <Link
                to={`/business/products/${p._id}/edit`}
                className="seller-btn-secondary flex-1"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProductDetailPage;
