import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersOfShop } from '../../../../store/redux/actions/order.js'
import { getAllProductsShop } from '../../../../store/redux/actions/product.js'
import Loader from '../../../../components/common/Loader.jsx'
import { FiDollarSign, FiShoppingCart, FiPackage, FiAlertCircle, FiTrendingUp } from 'react-icons/fi'

const MetricCard = ({ label, value, sub, tone = 'green', icon: Icon }) => {
  const bgMap = { green: 'bg-green-50', blue: 'bg-blue-50', yellow: 'bg-yellow-50', red: 'bg-red-50' }
  const textMap = { green: 'text-green-700', blue: 'text-blue-700', yellow: 'text-yellow-700', red: 'text-red-700' }
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase mb-2">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
        <div className={`p-3 rounded-lg ${bgMap[tone] || bgMap.green}`}>
          <Icon className={`text-lg ${textMap[tone] || textMap.green}`} />
        </div>
      </div>
    </div>
  )
}

const BusinessAnalyticsPage = () => {
  const dispatch = useDispatch()
  const { seller } = useSelector((state) => state.seller)
  const { products = [], isLoading: productsLoading } = useSelector((state) => state.products)
  const { orders = [], isLoading: ordersLoading } = useSelector((state) => state.order || {})

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id))
      dispatch(getAllProductsShop(seller._id))
    }
  }, [dispatch, seller])

  if (productsLoading || ordersLoading || !seller) return <Loader />

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0)
  const totalProducts = products.length
  const lowStockCount = products.filter((p) => Number(p.stock) <= 5 && Number(p.stock) > 0).length
  const outOfStockCount = products.filter((p) => Number(p.stock) === 0).length

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Analytics</h1>
        <p className="text-sm text-gray-600">Real-time metrics for your shop based on orders and inventory.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Revenue" value={`${Number(totalRevenue).toLocaleString()} ETB`} icon={FiDollarSign} tone="green" />
        <MetricCard label="Total Orders" value={orders.length} icon={FiShoppingCart} tone="blue" />
        <MetricCard label="Total Products" value={totalProducts} icon={FiPackage} tone="green" />
        <MetricCard label="Low / Out of Stock" value={lowStockCount + outOfStockCount} sub={`${lowStockCount} low, ${outOfStockCount} out`} icon={FiAlertCircle} tone="yellow" />
      </div>

      {orders.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order._id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div>
                  <span className="font-semibold text-gray-900">#{order._id?.slice?.(-8)?.toUpperCase()}</span>
                  <span className="ml-2 text-sm text-gray-600">{order.products?.length || 0} items</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{Number(order.totalPrice || 0).toLocaleString()} ETB</p>
                  <p className="text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BusinessAnalyticsPage
