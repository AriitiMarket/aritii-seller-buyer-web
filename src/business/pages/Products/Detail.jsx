import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetail, transitionProduct } from '@/store/slices/productThunks';
import { ProductImage } from '@/components/common/ImageWithFallback';
import { getImageGallery } from '@/shared/utils/image';
import Loader from '@/components/common/Loading';
import { toast } from 'react-toastify';

const BusinessProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, isLoading } = useSelector((state) => state.products);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  // Every stored reference resolved for the browser (a "/uploads/…" path is
  // joined onto the gateway origin, not the storefront origin).
  const images = useMemo(() => getImageGallery(currentProduct), [currentProduct]);

  useEffect(() => {
    setError(null);
    setActiveImage(0);
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
  const badge = p.isActive === false
    ? { label: 'Deactivated (admin)', cls: 'bg-red-100 text-red-700' }
    : lifecycle === 'ARCHIVED'
    ? { label: 'Archived', cls: 'bg-gray-100 text-gray-600' }
    : lifecycle === 'PUBLISHED'
    ? { label: 'Published', cls: 'bg-green-100 text-green-700' }
    : { label: 'Draft', cls: 'bg-gray-100 text-gray-600' };

  const available = Math.max(0, Number(p.stock ?? 0) - Number(p.reserved ?? 0));

  return (
    <div className="min-h-screen space-y-6">
      <div className="bg-white dark:bg-[#1a222d] rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-xs mb-6">
        <div className="flex items-center justify-between sm:flex-row sm:items-center">
          <div>
            <Link to="/business/products" className="inline-flex items-center gap-1 text-xs font-semibold text-[#007185] dark:text-[#42a2b3] hover:underline">
              &larr; Back to products
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-1.5">{p.name}</h1>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${badge.cls}`}>
            {badge.label}
          </span>
        </div>
      </div>

      <div className="max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#1a222d] rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-xs">
            <div className="relative w-full h-64 bg-gray-50 dark:bg-gray-850 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
              <ProductImage
                src={images[activeImage] || undefined}
                data={p}
                objectFit="contain"
                className="w-full h-full object-contain p-4"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {images.slice(0, 6).map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-current={i === activeImage}
                    className={`w-14 h-14 shrink-0 object-cover rounded-lg border overflow-hidden transition-all ${
                      i === activeImage
                        ? 'border-[#75d04b] ring-2 ring-[#75d04b]/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#1a222d] rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-xs flex-1">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{p.name}</h2>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
              {p.category || 'No category'} · {p.shop?.name || 'Your shop'}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Selling price</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{Number(p.discountPrice || 0).toLocaleString()} {p.currency || 'ETB'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">List price</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{p.originalPrice ? Number(p.originalPrice).toLocaleString() : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Stock</p>
                <p className={`text-sm font-bold ${available < 1 ? 'text-red-600' : available <= 5 ? 'text-amber-600' : 'text-gray-900 dark:text-white'}`}>
                  {available} available{p.reserved ? ` · ${p.stock ?? 0} total (${p.reserved} reserved)` : ` / ${p.stock ?? 0} total`}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sold</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{p.sold_out || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">SKU</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{p.sku || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{Number(p.ratings || 0).toFixed(1)} / 5</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Last updated</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '—'}</p>
              </div>
            </div>

            {p.description && (
              <div className="mb-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">{p.description}</p>
              </div>
            )}

            <div className="flex gap-3">
              {lifecycle !== 'ARCHIVED' && (lifecycle === 'DRAFT' ? (
                <button
                  onClick={() => handleLifecycle('publish')}
                  className="px-4 py-2 bg-[#75d04b] hover:bg-[#5ac12f] text-white text-xs font-bold rounded-lg shadow-sm transition flex-1"
                >
                  Publish
                </button>
              ) : (
                <button
                  onClick={() => handleLifecycle('draft')}
                  className="px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 text-xs font-semibold rounded-lg shadow-sm transition flex-1"
                >
                  Move to draft
                </button>
              ))}
              {lifecycle === 'ARCHIVED' ? (
                <button
                  onClick={() => handleLifecycle('unarchive')}
                  className="px-4 py-2 bg-[#75d04b] hover:bg-[#5ac12f] text-white text-xs font-bold rounded-lg shadow-sm transition flex-1"
                >
                  Restore as draft
                </button>
              ) : null}
              <Link
                to={`/business/products/${p._id}/edit`}
                className="px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 text-xs font-semibold rounded-lg shadow-sm transition text-center flex-1"
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
