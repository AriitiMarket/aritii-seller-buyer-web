import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetail, updateProduct } from '@/store/slices/productThunks';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';
import Loader from '@/components/common/Loading';
import { toast } from 'react-toastify';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { resolveImageUrl } from '@/shared/utils/image';
import { PlaceholderProduct } from '@/assets';

const MAX_IMAGES = 8;

/**
 * Local preview of a just-picked file. The object URL is created once and
 * revoked on unmount — creating it during render would leak a blob URL on
 * every re-render.
 */
const NewImagePreview = ({ file }) => {
  const [src] = useState(() => URL.createObjectURL(file));

  useEffect(() => () => URL.revokeObjectURL(src), [src]);

  return (
    <img
      src={src || PlaceholderProduct}
      alt=""
      className="w-20 h-20 object-cover rounded-lg border border-market-border"
    />
  );
};

const BusinessProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.products);
  const { categories } = useCatalogCategories({ type: 'product' });

  const [form, setForm] = useState(null);
  // Gallery = the references already stored on the product (minus the ones the
  // seller removed). `newFiles` are the files picked in this session.
  const [gallery, setGallery] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoadError(null);
    dispatch(getProductDetail(id))
      .then((product) => {
        if (!active || !product) return;
        setGallery(Array.isArray(product.images) ? [...product.images] : []);
        setNewFiles([]);
        setForm({
          name: product.name || '',
          description: product.description || '',
          category: product.category || '',
          tags: product.tags || '',
          sku: product.sku || '',
          originalPrice: product.originalPrice ?? '',
          discountPrice: product.discountPrice ?? '',
          stock: product.stock ?? '',
          lowStockThreshold: product.lowStockThreshold ?? 5,
          status: product.status || 'PUBLISHED',
        });
      })
      .catch((err) => {
        if (!active) return;
        setLoadError(err?.response?.data?.message || err?.message || 'Could not load product');
      });
    return () => { active = false; };
  }, [dispatch, id]);

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const totalImages = gallery.length + newFiles.length;

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = '';
    if (!picked.length) return;
    const room = Math.max(0, MAX_IMAGES - gallery.length - newFiles.length);
    if (picked.length > room) {
      toast.warning(`A product can have at most ${MAX_IMAGES} images`);
    }
    setNewFiles((prev) => [...prev, ...picked].slice(0, room));
  };

  const removeStoredImage = (index) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;
    if (!form.name || form.name.trim().length < 2) { toast.error('Product name is required (min 2 chars)'); return; }
    if (form.name.trim().length > 200) { toast.error('Product name must be at most 200 chars'); return; }
    if (!form.description || form.description.trim().length < 10) { toast.error('Description must be at least 10 chars'); return; }
    if (form.description.trim().length > 5000) { toast.error('Description must be at most 5000 chars'); return; }
    if (!Number.isFinite(Number(form.discountPrice)) || Number(form.discountPrice) <= 0) { toast.error('Price must be greater than 0'); return; }
    if (form.originalPrice !== '' && Number(form.originalPrice) > 0 && Number(form.discountPrice) > Number(form.originalPrice)) {
      toast.error('Selling price cannot exceed the original price'); return;
    }
    if (!Number.isFinite(Number(form.stock)) || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) {
      toast.error('Stock must be a whole number >= 0'); return;
    }
    setSaving(true);
    try {
      // Multipart: the gallery is sent as `imageUrls` (one entry per reference
      // — NOT comma-joined, so a data:image payload is never split) and the
      // new pictures as `productImg` files. The backend replaces the gallery
      // with exactly what it receives, so a removed image really disappears.
      const payload = new FormData();
      payload.append('name', form.name.trim());
      payload.append('description', form.description.trim());
      payload.append('category', form.category);
      payload.append('tags', form.tags);
      payload.append('sku', form.sku);
      payload.append('originalPrice', Number(form.originalPrice) || 0);
      payload.append('discountPrice', Number(form.discountPrice));
      payload.append('stock', Number(form.stock));
      payload.append('lowStockThreshold', Number(form.lowStockThreshold) || 0);

      gallery.forEach((ref) => payload.append('imageUrls', String(ref)));
      newFiles.forEach((file) => payload.append('productImg', file));
      // Nothing left at all -> explicit "empty the gallery" instruction.
      if (!gallery.length && !newFiles.length) payload.append('clearImages', 'true');

      await dispatch(updateProduct(id, payload));
      toast.success('Product updated');
      navigate('/business/products');
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <Loader />;
  if (loadError) {
    return (
      <div className="seller-empty-state text-center py-16">
        <span className="seller-empty-state-icon">⚠️</span>
        <h3 className="seller-empty-state-title">Could not load product</h3>
        <p className="seller-empty-state-desc">{loadError}</p>
        <Link to="/business/products" className="seller-btn-primary">
          Back to products
        </Link>
      </div>
    );
  }
  if (!form) return <Loader />;

  const inputCls = `seller-form-input ${saving ? 'opacity-50' : ''}`;

  return (
    <div className="seller-shell-bg min-h-screen space-y-6">
      <div className="seller-section-header">
        <div className="flex items-center justify-between sm:flex-row sm:items-center">
          <div>
            <Link to="/business/products" className="inline-flex items-center gap-1 text-sm text-market-primary hover:underline">
              <AiOutlineArrowLeft size={16} /> Back to products
            </Link>
            <h1 className="seller-section-header-title mt-2">Edit Product</h1>
          </div>
          {saving && (
            <span className="text-sm text-market-on-surface-variant animate-pulse">Saving…</span>
          )}
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="seller-form-section space-y-6">
          <div className="seller-form-group">
            <label className="seller-form-label">Product Name</label>
            <input
              type="text"
              value={form.name}
              onChange={setField('name')}
              className={inputCls}
              required
            />
          </div>

          <div className="seller-form-group">
            <label className="seller-form-label">Description</label>
            <textarea
              value={form.description}
              onChange={setField('description')}
              rows={4}
              className={inputCls}
              required
            />
          </div>

          {/* Gallery — the stored references are shown as thumbnails and can
              be removed; new pictures are uploaded as files. */}
          <div className="seller-form-group">
            <label className="seller-form-label">
              Product Images ({totalImages}/{MAX_IMAGES})
            </label>
            <p className="text-xs text-market-on-surface-variant mb-2">
              The first image is the one shown on product cards.
            </p>
            <div className="flex flex-wrap gap-3">
              {gallery.map((ref, index) => {
                const src = resolveImageUrl(ref) || PlaceholderProduct;
                return (
                  <div key={`${ref}-${index}`} className="relative">
                    <img
                      src={src}
                      alt=""
                      className="w-20 h-20 object-cover rounded-lg border border-market-border"
                    />
                    <button
                      type="button"
                      onClick={() => removeStoredImage(index)}
                      disabled={saving}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center hover:bg-red-600 transition disabled:opacity-50"
                      title="Remove image"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      ×
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                );
              })}

              {newFiles.map((file, index) => (
                <div key={`${file.name}-${file.size}-${index}`} className="relative">
                  <NewImagePreview file={file} />
                  <button
                    type="button"
                    onClick={() => removeNewFile(index)}
                    disabled={saving}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center hover:bg-red-600 transition disabled:opacity-50"
                    title="Remove image"
                    aria-label={`Remove new image ${index + 1}`}
                  >
                    ×
                  </button>
                  <span className="absolute bottom-1 left-1 bg-market-primary text-white text-[10px] px-1 rounded">
                    New
                  </span>
                </div>
              ))}

              {totalImages < MAX_IMAGES && (
                <label className="w-20 h-20 rounded-lg border-2 border-dashed border-market-border flex flex-col items-center justify-center text-xs text-market-on-surface-variant cursor-pointer hover:border-market-primary transition">
                  <span className="text-xl leading-none">+</span>
                  <span className="mt-1">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFiles}
                    disabled={saving}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="seller-form-group">
              <label className="seller-form-label">Category</label>
              <select
                value={form.category}
                onChange={setField('category')}
                className="seller-form-select"
              >
                <option value="">Select category…</option>
                {(categories || []).map((c) => (
                  <option key={c._id || c.title} value={c.title}>{c.title}</option>
                ))}
                {form.category && !(categories || []).some((c) => c.title === form.category) && (
                  <option value={form.category}>{form.category}</option>
                )}
              </select>
            </div>
            <div className="seller-form-group">
              <label className="seller-form-label">Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={setField('tags')}
                className={inputCls}
                placeholder="comma,separated"
              />
            </div>
            <div className="seller-form-group">
              <label className="seller-form-label">SKU</label>
              <input
                type="text"
                value={form.sku}
                onChange={setField('sku')}
                className={inputCls}
              />
            </div>
            <div className="seller-form-group">
              <label className="seller-form-label">List price (before discount)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.originalPrice}
                onChange={setField('originalPrice')}
                className={inputCls}
              />
            </div>
            <div className="seller-form-group">
              <label className="seller-form-label">Selling price (ETB)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.discountPrice}
                onChange={setField('discountPrice')}
                className={inputCls}
                required
              />
            </div>
            <div className="seller-form-group">
              <label className="seller-form-label">Stock</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={setField('stock')}
                className={inputCls}
                required
              />
            </div>
            <div className="seller-form-group">
              <label className="seller-form-label">Low-stock threshold</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.lowStockThreshold}
                onChange={setField('lowStockThreshold')}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Link
              to="/business/products"
              className="seller-btn-secondary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="seller-btn-primary"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessProductEditPage;
