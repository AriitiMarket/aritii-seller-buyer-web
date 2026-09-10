import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SellerLayout from '../SellerLayout.jsx'
import { getAllProductsShop } from '../../store/redux/actions/product.js'
import { ProductImage } from '../../components/common/ImageWithFallback.jsx'
import Loader from '../../components/common/Loader.jsx'

/**
 * Inventory / stock management. Shows the seller's own products with live
 * stock levels, low-stock highlights and a quick link to edit stock. Uses only
 * real backend data (Product.stock field) — no invented metrics.
 */
const SellerInventoryPage = () => {
  const dispatch = useDispatch()
  const { products = [], isLoading } = useSelector((state) => state.products)
  const { seller } = useSelector((state) => state.seller)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    if (seller && seller._id) dispatch(getAllProductsShop(seller._id))
  }, [dispatch, seller])

  if (isLoading || !seller) return (
    <SellerLayout sidebarActive={13}><Loader /></SellerLayout>
  )

  const lowStock = products.filter((p) => Number(p.stock) <= 5 && Number(p.stock) > 0)
  const outOfStock = products.filter((p) => Number(p.stock) === 0)
  const inStock = products.filter((p) => Number(p.stock) > 5)

  const view = filter === 'LOW' ? lowStock : filter === 'OUT' ? outOfStock : filter === 'IN' ? inStock : products

  return (
    <SellerLayout sidebarActive={13}>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-Poppins font-semibold">Inventory / Stock</h1>
        <Link to="/dashboard-create-product" className="text-sm text-brand-primary hover:underline">+ Add product</Link>
      </div>
      <p className="text-sm text-brand-muted mb-3">Live stock levels for your own products. Low-stock rows are highlighted.</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {[['ALL', `All (${products.length})`], ['IN', `In stock (${inStock.length})`], ['LOW', `Low stock (${lowStock.length})`], ['OUT', `Out of stock (${outOfStock.length})`]].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === k ? 'bg-brand-primary text-white' : 'bg-white border text-brand-charcoal'}`}
          >
            {l}
          </button>
        ))}
      </div>

      {view.length === 0 ? (
        <div className="bg-white rounded-md shadow p-8 text-center text-brand-muted">No products in this view.</div>
      ) : (
        <div className="bg-white rounded-md shadow overflow-hidden">
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
                const st = Number(p.stock)
                const status = st === 0 ? 'OUT' : st <= 5 ? 'LOW' : 'IN'
                return (
                  <tr key={p._id} className={`border-t ${status === 'LOW' ? 'bg-amber-50' : ''} ${status === 'OUT' ? 'bg-red-50' : ''}`}>
                    <td className="px-3 py-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 shrink-0">
                        <ProductImage data={p} className="w-full h-full object-cover" />
                      </div>
                      <span className="line-clamp-1">{p.name}</span>
                    </td>
                    <td className="px-3 py-2 font-medium">{st}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${status === 'IN' ? 'bg-green-100 text-green-700' : status === 'LOW' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {status === 'IN' ? 'In stock' : status === 'LOW' ? 'Low stock' : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <Link to={`/dashboard-edit-product/${p._id}`} className="text-brand-primary hover:underline">Edit stock</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </SellerLayout>
  )
}

export default SellerInventoryPage