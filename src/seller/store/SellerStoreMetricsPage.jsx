import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SellerLayout from '../SellerLayout.jsx'
import { getAllOrdersOfShop } from '../../store/redux/actions/order.js'
import { getAllProductsShop } from '../../store/redux/actions/product.js'
import Loader from '../../components/common/Loader.jsx'
import { FiDollarSign, FiShoppingCart, FiPackage, FiAlertCircle, FiTrendingUp } from 'react-icons/fi'

/**
 * Real store analytics computed live from the seller's own orders and products
 * (no invented/static data). Shows sales totals, order health, low stock and
 * best sellers — all scoped to the logged-in seller's shop.
 */
const MetricCard = ({ label, value, sub, tone = 'green', icon: Icon, trend }) => {
  const bgColorMap = {
    green: 'bg-green-50',
    blue: 'bg-blue-50',
    yellow: 'bg-yellow-50',
    red: 'bg-red-50'
  }
  
  const textColorMap = {
    green: 'text-green-700',
    blue: 'text-blue-700',
    yellow: 'text-yellow-700',
    red: 'text-red-700'
  }

  const iconBgMap = {
    green: 'bg-green-100',
    blue: 'bg-blue-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100'
  }

  return (
    <div className={`${bgColorMap[tone]} rounded-lg border border-gray-200 shadow-sm p-6 transition-transform hover:shadow-md hover:scale-105`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold">{label}</p>
          <p className={`text-3xl font-bold mt-3 ${textColorMap[tone]}`}>{value}</p>
          {sub && <p className="text-xs text-gray-600 mt-2">{sub}</p>}
          {trend && (
            <div className="flex items-center mt-2 text-xs text-green-600 font-medium">
              <FiTrendingUp size={14} className="mr-1" />
              {trend}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${iconBgMap[tone]} p-3 rounded-lg`}>
            <Icon size={24} className={textColorMap[tone]} />
          </div>
        )}
      </div>
    </div>
  )
}

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

  const totalStockUnits = products.reduce((s, p) => s + (Number(p.stock) || 0), 0)
  const completedOrders = succeeded.length

  return (
    <SellerLayout sidebarActive={12}>
      <div className="mb-8">
        <h1 className="text-3xl font-Poppins font-bold mb-2">Store Analytics</h1>
        <p className="text-gray-600">Live metrics from your own orders and inventory.</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          label="Total Revenue" 
          value={`$${revenue.toLocaleString()}`} 
          sub="Paid orders (excl. refunds)"
          tone="green"
          icon={FiDollarSign}
          trend={completedOrders > 0 ? `+${revenue}` : 'No sales'}
        />
        <MetricCard 
          label="Total Orders" 
          value={ShopOrders.length} 
          sub="All orders for your shop"
          tone="blue"
          icon={FiShoppingCart}
          trend={completedOrders > 0 ? `${completedOrders} completed` : 'Pending'}
        />
        <MetricCard 
          label="Active Products" 
          value={products.length} 
          sub="Products in your shop"
          tone="blue"
          icon={FiPackage}
          trend={totalStockUnits > 0 ? `${totalStockUnits} units in stock` : 'No stock'}
        />
        <MetricCard 
          label="Out of Stock" 
          value={outOfStock.length} 
          tone={outOfStock.length > 0 ? 'red' : 'green'}
          sub={outOfStock.length ? 'Restock needed' : 'All in stock'}
          icon={FiAlertCircle}
          trend={outOfStock.length > 0 ? 'Action required' : 'Healthy'}
        />
      </div>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiAlertCircle size={20} className="text-yellow-700" />
            <h3 className="font-bold text-yellow-900 text-lg">Low Stock Alerts ({lowStock.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lowStock.map((p) => (
              <div key={p._id} className="bg-white rounded p-3 border border-yellow-100">
                <p className="font-medium text-gray-800">{p.name}</p>
                <p className="text-sm text-yellow-700 font-semibold">{p.stock} units remaining</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Sellers & Inventory Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Sellers Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiTrendingUp size={20} className="text-green-700" />
            Top Selling Products
          </h3>
          {bestSellers.length ? (
            <div className="space-y-3">
              {bestSellers.map((b, idx) => (
                <div key={b.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">
                      #{idx + 1}
                    </span>
                    <span className="text-gray-800 font-medium">{b.name}</span>
                  </div>
                  <span className="text-green-700 font-bold text-lg">{b.qty} sold</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No sales yet. Orders will appear here once placed.</p>
            </div>
          )}
        </div>

        {/* Inventory Snapshot Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiPackage size={20} className="text-blue-700" />
            Inventory Snapshot
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
              <span className="text-gray-700 font-medium">Total Stock Units</span>
              <span className="bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded">
                {totalStockUnits}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
              <span className="text-gray-700 font-medium">Low Stock (1-5 units)</span>
              <span className="bg-yellow-100 text-yellow-700 font-bold px-4 py-2 rounded">
                {lowStock.length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded">
              <span className="text-gray-700 font-medium">Out of Stock</span>
              <span className="bg-red-100 text-red-700 font-bold px-4 py-2 rounded">
                {outOfStock.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}

export default SellerStoreMetricsPage