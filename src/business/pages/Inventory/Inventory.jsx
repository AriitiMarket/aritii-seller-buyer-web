import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getAllProductsShop } from '@/store/slices/productThunks'
import productService from '@/services/product.service'
import { toast } from 'react-toastify'
import { ProductImage } from '@/components/common/ImageWithFallback'
import Loader from '@/components/common/Loading'
import { useBusinessShops } from '@/business/hooks/useBusinessShops'

/**
 * Inventory / stock management. Shows the seller's own products with live
 * stock levels, low-stock highlights and a quick link to edit stock. Uses only
 * real backend data (Product.stock field) — no invented metrics.
 */
const BusinessInventoryPage = () => {
  const dispatch = useDispatch()
  const { shopProducts = [], isLoading } = useSelector((state) => state.products)
  const { seller } = useSelector((state) => state.seller)
  const { shops, activeShop, activeShopId, hasMultipleShops, selectShop } = useBusinessShops()
  const [filter, setFilter] = useState('ALL')

  // Inline stock panel: restock / set-total / movement history for one product.
  const [stockFor, setStockFor] = useState(null)
  const [stockQty, setStockQty] = useState('')
  const [stockNote, setStockNote] = useState('')
  const [movements, setMovements] = useState(null) // null = panel history hidden
  const [busy, setBusy] = useState(false)

  // Prefer the real shop id — seller._id is the identity user id and may not
  // match shopId on the products (same rule as every other business page).
  const shopId = activeShopId || seller?._id

  useEffect(() => {
    // includeInactive: a deactivated ("unlisted") product must stay visible in
    // the seller's own inventory, otherwise it could never be re-activated.
    if (shopId) dispatch(getAllProductsShop(shopId, { includeInactive: true }))
  }, [dispatch, shopId])

  if (isLoading || !seller) return (
    <>
    <Loader />
  </>
  )

  // available = stock − reserved (units a buyer can still take). Buckets and
  // badges must use this, not raw stock, or fully-reserved rows look "in stock".
  const availableUnits = (p) => Math.max(0, Number(p.stock ?? 0) - Number(p.reserved ?? 0))
  const lowStock = shopProducts.filter((p) => { const a = availableUnits(p); return a <= 5 && a > 0 })
  const outOfStock = shopProducts.filter((p) => availableUnits(p) < 1)
  const inStock = shopProducts.filter((p) => availableUnits(p) > 5)
  const unlisted = shopProducts.filter((p) => p.isActive === false || p.status === 'DRAFT' || p.status === 'ARCHIVED')

  const reloadList = () => {
    if (shopId) dispatch(getAllProductsShop(shopId, { includeInactive: true }))
  }

  const openStockPanel = async (p) => {
    if (stockFor && stockFor._id === p._id) {
      setStockFor(null); setMovements(null); return
    }
    setStockFor(p); setStockQty(''); setStockNote(''); setMovements(null)
  }

  const loadHistory = async () => {
    if (!stockFor) return
    try {
      setMovements(await productService.getStockHistory(stockFor._id))
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || 'Could not load history')
      setMovements([])
    }
  }

  // mode: 'restock' adds qty · 'set' replaces total stock (backend writes the ledger)
  const applyStock = async (mode) => {
    if (!stockFor) return
    const qty = Number(stockQty)
    if (!Number.isFinite(qty) || qty < 0 || (mode === 'restock' && qty <= 0)) {
      toast.error('Enter a valid quantity'); return
    }
    setBusy(true)
    try {
      if (mode === 'restock') await productService.restock(stockFor._id, qty, stockNote)
      else await productService.adjustStock(stockFor._id, qty, stockNote)
      toast.success(mode === 'restock' ? `Restocked ${qty} unit(s)` : `Stock set to ${qty}`)
      reloadList()
      if (movements) await loadHistory()
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || 'Stock update failed')
    } finally {
      setBusy(false)
    }
  }

  const view =
    filter === 'LOW' ? lowStock
    : filter === 'OUT' ? outOfStock
    : filter === 'IN' ? inStock
    : filter === 'UNLISTED' ? unlisted
    : shopProducts

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary-dark mb-1">
            {activeShop?.name || 'Your store'}
          </p>
          <h1 className="text-xl font-Poppins font-semibold">Inventory / Stock</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {hasMultipleShops && (
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Shop:</span>
              <select
                value={activeShopId || ''}
                onChange={(e) => selectShop(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-brand-primary focus:outline-none"
                aria-label="Select active shop"
              >
                {shops.map((s) => (
                  <option key={s._id} value={s._id}>{s.name || 'Unnamed shop'}</option>
                ))}
              </select>
            </label>
          )}
          <Link to="/business/products/create" className="text-sm text-brand-primary hover:underline">+ Add product</Link>
        </div>
      </div>
      <p className="text-sm text-brand-muted mb-3">Live stock levels for your own products. Low-stock rows are highlighted.</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {[['ALL', `All (${shopProducts.length})`], ['IN', `In stock (${inStock.length})`], ['LOW', `Low stock (${lowStock.length})`], ['OUT', `Out of stock (${outOfStock.length})`], ['UNLISTED', `Unlisted (${unlisted.length})`]].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === k ? 'bg-brand-primary text-white' : 'bg-white border text-brand-charcoal'}`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Inline stock panel — restock / set total / movement history */}
      {stockFor && (
        <div className="bg-white rounded-md shadow p-4 mb-4 border-l-4 border-brand-primary">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-900">{stockFor.name}</p>
              <p className="text-xs text-gray-500">
                Current stock: {stockFor.stock} · Reserved: {stockFor.reserved || 0} ·
                {' '}<span className="text-gray-400">+ Restock adds the quantity · Set total replaces it</span>
              </p>
            </div>
            <button
              onClick={() => { setStockFor(null); setMovements(null) }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Quantity</label>
              <input
                type="number" min="0" step="1" value={stockQty}
                onChange={(e) => setStockQty(e.target.value)}
                className="w-32 px-2 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="0"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-gray-500 mb-1">Note (optional)</label>
              <input
                type="text" value={stockNote}
                onChange={(e) => setStockNote(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="e.g. new delivery"
              />
            </div>
            <button
              disabled={busy}
              onClick={() => applyStock('restock')}
              className="px-3 py-1.5 bg-brand-primary text-white rounded text-sm disabled:opacity-50"
            >
              + Restock
            </button>
            <button
              disabled={busy}
              onClick={() => applyStock('set')}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50"
            >
              Set total
            </button>
            <button
              onClick={() => (movements ? setMovements(null) : loadHistory())}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm"
            >
              {movements ? 'Hide history' : 'History'}
            </button>
          </div>
          {movements && (
            <div className="mt-3 max-h-56 overflow-y-auto divide-y divide-gray-100 text-sm">
              {movements.length === 0 && (
                <p className="py-3 text-gray-500">No stock movements yet.</p>
              )}
              {movements.map((m) => (
                <div key={m._id} className="py-2 flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700 shrink-0">
                    {m.type}
                  </span>
                  <span className={`font-semibold shrink-0 ${m.quantity < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </span>
                  <span className="text-gray-500 shrink-0">{m.stockBefore} → {m.stockAfter}</span>
                  <span className="flex-1 truncate text-gray-600">{m.note}</span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view.length === 0 ? (
        <div className="bg-white rounded-md shadow p-8 text-center text-brand-muted">No products in this view.</div>
      ) : (
        <div className="bg-white rounded-md shadow overflow-hidden">
          {/* Desktop: table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-cream text-left">
                <tr>
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">Stock</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {view.map((p) => {
                  const st = availableUnits(p)
                  const status = st < 1 ? 'OUT' : st <= 5 ? 'LOW' : 'IN'
                  return (
                    <tr key={p._id} className={`border-t ${status === 'LOW' ? 'bg-amber-50' : ''} ${status === 'OUT' ? 'bg-red-50' : ''}`}>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 shrink-0">
                            <ProductImage data={p} className="w-full h-full object-cover" />
                          </div>
                          <span className="line-clamp-1">{p.name}</span>
                          {(p.isActive === false || p.status === 'DRAFT' || p.status === 'ARCHIVED') && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-600 shrink-0">
                              {p.isActive === false ? 'Unlisted' : p.status === 'ARCHIVED' ? 'Archived' : 'Draft'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 font-medium">
                        {st}
                        {p.reserved ? <span className="text-gray-400 font-normal"> / {p.stock}</span> : null}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${status === 'IN' ? 'bg-green-100 text-green-700' : status === 'LOW' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {status === 'IN' ? 'In stock' : status === 'LOW' ? 'Low stock' : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <button
                          onClick={() => openStockPanel(p)}
                          className={`mr-2 text-sm ${stockFor && stockFor._id === p._id ? 'text-brand-primary font-semibold' : 'text-brand-primary hover:underline'}`}
                        >
                          Stock
                        </button>
                        <Link to={`/business/products/${p._id}/edit`} className="text-sm text-gray-600 hover:underline">Edit</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked section cards — no horizontal scroll */}
          <div className="md:hidden divide-y divide-gray-100">
            {view.map((p) => {
              const st = availableUnits(p)
              const status = st < 1 ? 'OUT' : st <= 5 ? 'LOW' : 'IN'
              return (
                <div
                  key={p._id}
                  className={`p-4 space-y-3 ${status === 'LOW' ? 'bg-amber-50/50' : ''} ${status === 'OUT' ? 'bg-red-50/50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 shrink-0">
                        <ProductImage data={p} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{p.name}</p>
                        {(p.isActive === false || p.status === 'DRAFT' || p.status === 'ARCHIVED') && (
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-600">
                            {p.isActive === false ? 'Unlisted' : p.status === 'ARCHIVED' ? 'Archived' : 'Draft'}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${status === 'IN' ? 'bg-green-100 text-green-700' : status === 'LOW' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {status === 'IN' ? 'In stock' : status === 'LOW' ? 'Low stock' : 'Out'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Available</p>
                      <p className="font-semibold text-gray-900">
                        {st}
                        {p.reserved ? <span className="text-gray-400 font-normal"> / {p.stock}</span> : null}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Reserved</p>
                      <p className="font-semibold text-gray-900">{p.reserved || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-1 border-t border-gray-100">
                    <button
                      onClick={() => openStockPanel(p)}
                      className={`text-sm font-medium ${stockFor && stockFor._id === p._id ? 'text-brand-primary font-semibold' : 'text-brand-primary hover:underline'}`}
                    >
                      Manage stock
                    </button>
                    <Link to={`/business/products/${p._id}/edit`} className="text-sm text-gray-600 hover:underline">Edit</Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default BusinessInventoryPage