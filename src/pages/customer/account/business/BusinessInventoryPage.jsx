import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getAllProductsShop } from '../../../../store/redux/actions/product.js'
import { ProductImage } from '../../../../components/common/ImageWithFallback.jsx'
import Loader from '../../../../components/common/Loader.jsx'

const BusinessInventoryPage = () => {
  const dispatch = useDispatch()
  const { products = [], isLoading } = useSelector((state) => state.products)
  const { seller } = useSelector((state) => state.seller)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    if (seller && seller._id) dispatch(getAllProductsShop(seller._id))
  }, [dispatch, seller])

  if (isLoading || !seller) return <Loader />

  const lowStock = products.filter((p) => Number(p.stock) <= 5 && Number(p.stock) > 0)
  const outOfStock = products.filter((p) => Number(p.stock) === 0)
  const inStock = products.filter((p) => Number(p.stock) > 5)
  const view = filter === 'LOW' ? lowStock : filter === 'OUT' ? outOfStock : filter === 'IN' ? inStock : products

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Inventory / Stock</h1>
          <Link to="/my-dashboard/business/products/create" className="text-sm font-semibold text-teal-600 hover:text-teal-700">+ Add product</Link>
        </div>
        <p className="text-sm text-gray-600">Live stock levels for your products. Low-stock rows are highlighted.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[['ALL', `All (${products.length})`], ['IN', `In stock (${inStock.length})`], ['LOW', `Low stock (${lowStock.length})`], ['OUT', `Out of stock (${outOfStock.length})`]].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === k ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{l}</button>
        ))}
      </div>

      {view.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center text-gray-500">No products in this view.</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">Product</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Stock</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {view.map((p) => {
                const st = Number(p.stock)
                const status = st === 0 ? 'OUT' : st <= 5 ? 'LOW' : 'IN'
                return (
                  <tr key={p._id} className={`border-t border-gray-100 ${status === 'LOW' ? 'bg-amber-50' : ''} ${status === 'OUT' ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 shrink-0">
                        <ProductImage data={p} className="w-full h-full object-cover" />
                      </div>
                      <span className="line-clamp-1 font-medium text-gray-900">{p.name}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{st}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status === 'IN' ? 'bg-green-100 text-green-700' : status === 'LOW' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {status === 'IN' ? 'In stock' : status === 'LOW' ? 'Low stock' : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/dashboard-edit-product/${p._id}`} className="text-teal-600 hover:text-teal-700 font-semibold text-sm">Edit stock</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BusinessInventoryPage
