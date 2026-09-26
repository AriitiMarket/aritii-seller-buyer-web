import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProductDetail, transitionProduct } from '@/store/slices/productThunks'
import { ProductImage } from '@/components/common/ImageWithFallback'
import Loader from '@/components/common/Loading'
import { toast } from 'react-toastify'

/**
 * Seller product detail — full view of an owned product: images, pricing,
 * stock, lifecycle status + publish/draft control, and a link to the edit form.
 */
const BusinessProductDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentProduct, isLoading } = useSelector((state) => state.products)
  const [error, setError] = useState(null)

  useEffect(() => {
    setError(null)
    dispatch(getProductDetail(id)).catch((err) => {
      setError(err?.response?.data?.message || err?.message || 'Could not load product')
    })
  }, [dispatch, id])

  const handleLifecycle = async (action) => {
    const labels = {
      publish: 'Product published',
      draft: 'Product moved to draft',
      archive: 'Product archived — it is no longer in the marketplace',
      unarchive: 'Product restored as a draft',
    }
    try {
      await dispatch(transitionProduct(id, action))
      toast.success(labels[action] || 'Product updated')
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Action failed')
    }
  }

  if (error) {
    return (
      <div className="p-4">
        <Link to="/business/products" className="text-sm text-brand-primary hover:underline">&larr; Back to products</Link>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    )
  }
  if (isLoading || !currentProduct) return <Loader />

  const p = currentProduct
  const lifecycle = p.status || 'PUBLISHED'
  const images = Array.isArray(p.images) ? p.images : []
  const badge = p.isActive === false
    ? { label: 'Deactivated (admin)', cls: 'bg-red-100 text-red-700' }
    : lifecycle === 'ARCHIVED'
    ? { label: 'Archived', cls: 'bg-gray-100 text-gray-600' }
    : lifecycle === 'PUBLISHED'
    ? { label: 'Published', cls: 'bg-green-100 text-green-700' }
    : { label: 'Draft', cls: 'bg-gray-100 text-gray-600' }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <Link to="/business/products" className="inline-flex items-center gap-1 text-sm text-brand-primary hover:underline">
          &larr; Back to products
        </Link>
        <div className="flex items-center gap-2">
          {/* An archived listing is retired: offer only Restore, not publish/draft. */}
          {lifecycle !== 'ARCHIVED' && (lifecycle === 'DRAFT' ? (
            <button onClick={() => handleLifecycle('publish')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition">
              Publish
            </button>
          ) : (
            <button onClick={() => handleLifecycle('draft')} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition">
              Move to draft
            </button>
          ))}
          {lifecycle === 'ARCHIVED' ? (
            <button onClick={() => handleLifecycle('unarchive')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition">
              Restore as draft
            </button>
          ) : (
            <button
              onClick={() => handleLifecycle('archive')}
              title="Archive (hide from the storefront, keep the record)"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition"
            >
              Archive
            </button>
          )}
          <Link to={`/business/products/${p._id}/edit`} className="inline-flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-dark transition">
            Edit
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 shrink-0">
            <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              <ProductImage data={p} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {images.slice(0, 6).map((img, i) => {
                  const src = typeof img === 'string' ? img : img?.url
                  return src ? <img key={i} src={src} alt="" className="w-14 h-14 object-cover rounded border" /> : null
                })}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{p.name}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${badge.cls}`}>{badge.label}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{p.category || 'No category'} · {p.shop?.name || 'Your shop'}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 text-sm">
              <div>
                <p className="text-gray-500">Selling price</p>
                <p className="font-semibold text-gray-900">{Number(p.discountPrice || 0).toLocaleString()} {p.currency || 'ETB'}</p>
              </div>
              <div>
                <p className="text-gray-500">List price</p>
                <p className="font-semibold text-gray-900">{p.originalPrice ? Number(p.originalPrice).toLocaleString() : '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Stock</p>
                {(() => {
                  const available = Math.max(0, Number(p.stock ?? 0) - Number(p.reserved ?? 0))
                  return (
                    <p className={`font-semibold ${available < 1 ? 'text-red-600' : available <= 5 ? 'text-amber-600' : 'text-gray-900'}`}>
                      {available} available{p.reserved ? ` · ${p.stock ?? 0} total (${p.reserved} reserved)` : ` / ${p.stock ?? 0} total`}
                    </p>
                  )
                })()}
              </div>
              <div>
                <p className="text-gray-500">Sold</p>
                <p className="font-semibold text-gray-900">{p.sold_out || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">SKU</p>
                <p className="font-semibold text-gray-900">{p.sku || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Rating</p>
                <p className="font-semibold text-gray-900">{Number(p.ratings || 0).toFixed(1)} / 5</p>
              </div>
              <div>
                <p className="text-gray-500">Created</p>
                <p className="font-semibold text-gray-900">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Last updated</p>
                <p className="font-semibold text-gray-900">{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '—'}</p>
              </div>
            </div>

            {p.description && (
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-gray-500 text-sm mb-1">Description</p>
                <p className="text-gray-700 whitespace-pre-line text-sm">{p.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessProductDetailPage
