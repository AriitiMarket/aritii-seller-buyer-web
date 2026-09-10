import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SellerLayout from '../SellerLayout.jsx'
import { getAllOrdersOfShop } from '../../store/redux/actions/order.js'
import { getAllProductsShop } from '../../store/redux/actions/product.js'
import Loader from '../../components/common/Loader.jsx'

/**
 * Real store analytics computed live from the seller's own orders and products
 * (no invented/static data). Shows sales totals, order health, low stock and
 * best sellers — all scoped to the logged-in seller's shop.
 */
const MetricCard = ({ label, value, sub, tone = 'brand-primary' }) => (
  <div className="bg-white rounded-lg border border-brand-border shadow-sm p-4">
    <p className="text-xs uppercase tracking-wide text-brand-muted">{label}</p>
    <p className={`text-2xl font-bold mt-1 text-${tone}`}>{value}</p>
    {sub && <p className="text-xs text-brand-muted mt-1">{sub}</p>}
  </div>
)

const SellerStoreMetricsPage = () => {
  const dispatch = useDispatch()
  const { ShopOrders = [], isLoading } = useSelector((state) => state.order)
  const { products = [] } = useSelector((state) => state.products)
  const { seller } = useSelector((state) => state.seller)

  useEffect(() => {
    if (seller && seller._id) {
      dispatch(getAllOrdersOfShop(seller._id))
      dispatch(getAllProductsShop(seller._id))
    }
  }, [dispatch, seller])

  if (isLoading || !seller) return (
    <SellerLayout sidebarActive={12}><Loader /></SellerLayout>
  )

  const succeeded = ShopOrders.filter((o) => !/cancel|refund/i.test(o.status || ''))
  const revenue = succeeded.reduce((s, o) => s + (Number(o.totalPrice) || 0), 0)
  const lowStock = products.filter((p) => Number(p.stock) <= 5 && Number(p.stock) > 0)
  const outOfStock = products.filter((p) => Number(p.stock) === 0)

  // Best sellers: aggregate quantity by product from order cart lines
  const soldMap = new Map()
  ShopOrders.forEach((o) => (o.cart || []).forEach((li) => {
    const id = li.productId || li.product || li._id || 'unknown'
    const nm = li.name || 'Product'
    const qty = Number(li.quantity) || 1
    const cur = soldMap.get(id) || { name: nm, qty: 0 }
    cur.qty += qty
    soldMap.set(id, cur)
  }))
  const bestSellers = [...soldMap.values()].sort((a, b) => b.qty - a.qty).slice(0, 5)

  return (
    <SellerLayout sidebarActive={12}>
      <h1 className="text-xl font-Poppins font-semibold mb-1">Store Analytics</h1>
      <p className="text-sm text-brand-muted mb-4">Live metrics from your own orders and inventory.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Revenue" value={`$ ${revenue.toLocaleString()}`} sub="Paid orders (excl. refunds)" />
        <MetricCard label="Total Orders" value={ShopOrders.length} sub="All orders for your shop" />
        <MetricCard label="Active Products" value={products.length} sub="Products in your shop" />
        <MetricCard label="Out of Stock" value={outOfStock.length} tone="brand-danger" sub={outOfStock.length ? 'Restock needed' : 'All in stock'} />
      </div>

      {lowStock.length > 0 && (
        <div className="mt-4 bg-amber-50 rounded-lg p-4">
          <h3 className="font-semibold text-amber-800">Low Stock Alerts ({lowStock.length})</h3>
          <ul className="list-disc mt-1 text-sm">
            {lowStock.map((p) => (
              <li key={p._id} className="text-brand-charcoal">{p.name} — {p.stock} left</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <h3 className="font-semibold text-brand-charcoal mb-2">Best Sellers</h3>
          {bestSellers.length ? (
            <ul className="space-y-2 text-sm">
              {bestSellers.map((b) => (
                <li key={b.name} className="flex justify-between">
                  <span className="text-brand-charcoal">{b.name}</span>
                  <span className="text-brand-primary font-medium">{b.qty} sold</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-brand-muted text-sm">No sales yet. Orders will appear here once placed.</p>
          )}
        </div>
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <h3 className="font-semibold text-brand-charcoal mb-2">Inventory Snapshot</h3>
          <div className="flex justify-between text-sm">
            <span>Total stock units</span>
            <span className="font-medium">{products.reduce((s, p) => s + (Number(p.stock) || 0), 0)}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Low stock ({'>'}0 ≤5)</span>
            <span className="text-amber-700 font-medium">{lowStock.length}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Out of stock</span>
            <span className="text-brand-danger font-medium">{outOfStock.length}</span>
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}

export default SellerStoreMetricsPage