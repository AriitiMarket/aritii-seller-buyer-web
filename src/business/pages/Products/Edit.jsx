import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProductDetail, updateProduct, transitionProduct } from '@/store/slices/productThunks'
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories'
import Loader from '@/components/common/Loading'
import { toast } from 'react-toastify'
import { AiOutlineArrowLeft } from 'react-icons/ai'

/** Seller Edit Product — edits exactly the fields the backend validator accepts. */
const BusinessProductEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { currentProduct, isLoading } = useSelector((state) => state.products)
  const { categories } = useCatalogCategories({ type: 'product' })

  const [form, setForm] = useState(null)
  const [images, setImages] = useState([])
  const [originalImages, setOriginalImages] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    let active = true
    setLoadError(null)
    dispatch(getProductDetail(id))
      .then((product) => {
        if (!active || !product) return
        setImages(product.images || [])
        setOriginalImages(product.images || [])
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
        })
      })
      .catch((err) => {
        if (!active) return
        setLoadError(err?.response?.data?.message || err?.message || 'Could not load product')
      })
    return () => { active = false }
  }, [dispatch, id])

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form) return
    if (!form.name || form.name.trim().length < 2) { toast.error('Product name is required (min 2 chars)'); return }
    if (form.name.trim().length > 200) { toast.error('Product name must be at most 200 chars'); return }
    if (!form.description || form.description.trim().length < 10) { toast.error('Description must be at least 10 chars'); return }
    if (form.description.trim().length > 5000) { toast.error('Description must be at most 5000 chars'); return }
    if (!Number.isFinite(Number(form.discountPrice)) || Number(form.discountPrice) <= 0) { toast.error('Price must be greater than 0'); return }
    if (form.originalPrice !== '' && Number(form.originalPrice) > 0 && Number(form.discountPrice) > Number(form.originalPrice)) {
      toast.error('Selling price cannot exceed the original price'); return
    }
    if (!Number.isFinite(Number(form.stock)) || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) { toast.error('Stock must be a whole number >= 0'); return }
    setSaving(true)
    try {
      // Gallery: only touch it when the seller actually changed the list.
      //   • emptied            → clearImages=true (explicit "remove everything")
      //   • any other change   → replace with EXACTLY the final list; entries
      //     already stored (files this service saved) are recognised server-side
      //     and never lost to the http(s)-only policy.
      const imagesChanged =
        images.length !== originalImages.length ||
        images.some((src, i) => src !== originalImages[i])
      let imageFields = {}
      if (imagesChanged) {
        if (images.length === 0) {
          imageFields = { clearImages: 'true' }
        } else {
          imageFields = { keepExistingImages: 'false', imageUrls: images.join(',') }
        }
      }

      await dispatch(updateProduct(id, {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        tags: form.tags,
        sku: form.sku,
        originalPrice: form.originalPrice === '' ? undefined : Number(form.originalPrice),
        discountPrice: Number(form.discountPrice),
        stock: Number(form.stock),
        lowStockThreshold: Number(form.lowStockThreshold),
        ...imageFields,
      }))
      toast.success('Product updated')
      navigate('/business/products')
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleLifecycle = async (action) => {
    try {
      await dispatch(transitionProduct(id, action));
      const messages = {
        publish: 'Product published',
        draft: 'Product moved to draft',
        unarchive: 'Product restored as a draft',
      };
      toast.success(messages[action] || 'Product updated');
      const nextStatus = action === 'publish' ? 'PUBLISHED'
        : action === 'unarchive' ? 'DRAFT'
        : 'DRAFT';
      setForm((prev) => (prev ? { ...prev, status: nextStatus } : prev));
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Action failed');
    }
  }

  if (loadError) {
    return (
      <div className="p-8">
        <Link to="/business/products" className="text-sm text-brand-primary hover:underline">&larr; Back to products</Link>
        <p className="text-red-600 mt-2">{loadError}</p>
      </div>
    )
  }
  if (!form) return <Loader />

  const inputCls = 'mt-1 block w-full px-3 h-[38px] border border-gray-300 rounded-[4px] text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary'

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Link to="/business/products" className="inline-flex items-center gap-1 text-sm text-brand-primary hover:underline mb-2">
            <AiOutlineArrowLeft size={16} /> Back to products
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-600 mt-1">
            Status:{' '}
            <span className={`font-semibold ${
              form.status === 'PUBLISHED' ? 'text-green-600'
                : form.status === 'ARCHIVED' ? 'text-amber-600'
                : 'text-gray-500'
            }`}>
              {form.status === 'PUBLISHED' ? 'Published'
                : form.status === 'ARCHIVED' ? 'Archived'
                : 'Draft'}
            </span>
            {!isLoading && currentProduct?.isActive === false && (
              <span className="ml-2 text-red-600 font-semibold">(deactivated by admin)</span>
            )}
          </p>
        </div>
        {form.status === 'ARCHIVED' ? (
          <button onClick={() => handleLifecycle('unarchive')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition">
            Restore as draft
          </button>
        ) : form.status === 'DRAFT' ? (
          <button onClick={() => handleLifecycle('publish')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition">
            Publish
          </button>
        ) : (
          <button onClick={() => handleLifecycle('draft')} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition">
            Move to draft
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input type="text" value={form.name} onChange={setField('name')} className={inputCls} required minLength={2} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description *</label>
          <textarea value={form.description} onChange={setField('description')} rows={4} required minLength={10}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-[4px] text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <p className="text-xs text-gray-500 mt-1">
            Remove a photo or paste an image URL. Emptying the list removes every photo when you save.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            {images.length === 0 && (
              <p className="text-xs text-amber-600">No images — a product without photos is hard to sell.</p>
            )}
            {images.map((src, index) => (
              <div key={`${src}-${index}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                <img src={src} alt={`Product image ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                  className="absolute top-0 right-0 w-5 h-5 bg-black/60 text-white text-xs flex items-center justify-center hover:bg-red-600 transition"
                  title="Remove image"
                  aria-label={`Remove image ${index + 1}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => {
                const value = imageUrl.trim();
                if (!value) return;
                if (!/^https?:\/\//i.test(value) && !/^data:image\//i.test(value)) {
                  toast.error('Enter a full http(s) image URL');
                  return;
                }
                if (images.includes(value)) {
                  toast.info('That image is already in the gallery');
                  return;
                }
                setImages((prev) => [...prev, value]);
                setImageUrl('');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition shrink-0"
            >
              Add
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select value={form.category} onChange={setField('category')} className={inputCls}>
              <option value="">Select category…</option>
              {(categories || []).map((c) => (
                <option key={c._id || c.title} value={c.title}>{c.title}</option>
              ))}
              {form.category && !(categories || []).some((c) => c.title === form.category) && (
                <option value={form.category}>{form.category}</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <input type="text" value={form.tags} onChange={setField('tags')} className={inputCls} placeholder="comma,separated" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <input type="text" value={form.sku} onChange={setField('sku')} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">List price (before discount)</label>
            <input type="number" min="0" step="0.01" value={form.originalPrice} onChange={setField('originalPrice')} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Selling price (ETB) *</label>
            <input type="number" min="0.01" step="0.01" value={form.discountPrice} onChange={setField('discountPrice')} className={inputCls} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock *</label>
            <input type="number" min="0" step="1" value={form.stock} onChange={setField('stock')} className={inputCls} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Low-stock threshold</label>
            <input type="number" min="0" step="1" value={form.lowStockThreshold} onChange={setField('lowStockThreshold')} className={inputCls} />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="px-5 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-dark transition disabled:opacity-60">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button type="button" onClick={() => navigate('/business/products')} className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default BusinessProductEditPage
