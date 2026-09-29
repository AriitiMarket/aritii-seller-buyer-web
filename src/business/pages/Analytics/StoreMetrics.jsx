import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersOfShop } from '@/store/slices/orderThunks'
import { getAllProductsShop } from '@/store/slices/productThunks'
import { useBusinessShops } from '@/business/hooks/useBusinessShops'
import Loader from '@/components/common/Loading'
import { FiDollarSign, FiShoppingCart, FiPackage, FiAlertCircle, FiTrendingUp, FiUsers } from 'react-icons/fi'
import { RevenueTrendChart, CategoryChart, OrderStatusChart, MonthlyOrdersChart } from '@/business/shared/charts'
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus'

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

const BusinessStoreMetricsPage = () => {
  const dispatch = useDispatch()
  const { ShopOrders = [], isLoading } = useSelector((state) => state.order)
  const { shopProducts = [] } = useSelector((state) => state.products)
  const { seller } = useSelector((state) => state.seller)
  const [timeFilter, setTimeFilter] = useState('30D')

  const { activeShopId } = useBusinessShops()
  const shopId = activeShopId || seller?.id

  useEffect(() => {
    if (shopId) {
      dispatch(getAllOrdersOfShop(shopId))
      dispatch(getAllProductsShop(shopId))
    }
  }, [dispatch, shopId])

  if (isLoading || !seller) return (
    <>
    <Loader />
  </>
  )

  // Revenue only from Delivered orders (normalized so legacy spellings merge);
  // never count Processing/Cancelled/Refund toward revenue.
  const succeeded = ShopOrders.filter((o) => normalizeStatus(o.status) === ORDER_STATUSES.DELIVERED)
  const revenue = succeeded.reduce((s, o) => s + (Number(o.totalPrice) || 0), 0)
  const lowStock = shopProducts.filter((p) => Number(p.stock) <= 5 && Number(p.stock) > 0)
  const outOfStock = shopProducts.filter((p) => Number(p.stock) === 0)

  // Best sellers: aggregate quantity by product from order cart lines
  const soldMap = new Map()
  ShopOrders.forEach((o) => (o.cart || []).forEach((li) => {
    const id = li.productId || li.product || li._id || 'unknown'
    const nm = li.name || 'Product'
    const quantity = Number(li.quantity) || 1
    const cur = soldMap.get(id) || { name: nm, quantity: 0 }
    cur.quantity += quantity
    soldMap.set(id, cur)
  }))
  const bestSellers = [...soldMap.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5)

  const totalStockUnits = shopProducts.reduce((s, p) => s + (Number(p.stock) || 0), 0)
  const completedOrders = succeeded.length
  const uniqueCustomers = new Set(ShopOrders.map(o => o.buyerId || o.userId).filter(Boolean)).size

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Store Analytics</h1>
        <p className="text-gray-600">Comprehensive insights into your store performance.</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          label="Total Revenue" 
          value={`ETB ${revenue.toLocaleString()}`} 
          sub="From delivered orders"
          tone="green"
          icon={FiDollarSign}
        />
        <MetricCard 
          label="Total Orders" 
          value={ShopOrders.length} 
          sub="All orders for your shop"
          tone="blue"
          icon={FiShoppingCart}
          trend={completedOrders > 0 ? `${completedOrders} delivered` : undefined}
        />
        <MetricCard 
          label="Active Products" 
          value={shopProducts.length} 
          sub="Products in your shop"
          tone="blue"
          icon={FiPackage}
          trend={totalStockUnits > 0 ? `${totalStockUnits} units` : 'No stock'}
        />
        <MetricCard 
          label="Customers" 
          value={uniqueCustomers} 
          sub="Unique customers"
          tone="purple"
          icon={FiUsers}
        />
      </div>

      {/* Revenue Trend Chart */}
      <RevenueTrendChart timeFilter={timeFilter} setTimeFilter={setTimeFilter} ShopOrders={ShopOrders} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales by Category */}
        <CategoryChart ShopOrders={ShopOrders} products={shopProducts} />

        {/* Order Status Distribution */}
        <OrderStatusChart ShopOrders={ShopOrders} />
      </div>

      {/* Monthly Orders Comparison */}
      <MonthlyOrdersChart ShopOrders={ShopOrders} />

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
                  <span className="text-green-700 font-bold text-lg">{b.quantity} sold</span>
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
    </>
  )
}

export default BusinessStoreMetricsPage