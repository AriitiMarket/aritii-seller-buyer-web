import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';
import { getAllProductsShop } from '@/store/slices/productThunks';
import Loader from '@/components/common/Loading';
import { FiFileText, FiDownload, FiCalendar, FiFilter, FiBarChart2, FiDollarSign, FiShoppingBag, FiUsers } from 'react-icons/fi';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import SafeChart from '@/business/shared/charts/SafeChart';
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus';

const Reports = () => {
  const { ShopOrders = [], isLoading } = useSelector((state) => state.order);
  const { shopProducts = [] } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const { activeShopId } = useBusinessShops();
  const dispatch = useDispatch();

  const [dateRange, setDateRange] = useState('30D');
  const [reportType, setReportType] = useState('sales');

  const shopId = activeShopId || seller?._id;

  useEffect(() => {
    if (shopId) {
      dispatch(getAllOrdersOfShop(shopId));
      dispatch(getAllProductsShop(shopId));
    }
  }, [dispatch, shopId]);

  // Calculate report data
  const reportData = React.useMemo(() => {
    // Revenue/completion only count Delivered orders (normalized so legacy
    // 'succeeded'/'DELIVERED' rows merge with canonical 'Delivered').
    const succeededOrders = ShopOrders.filter(o => normalizeStatus(o.status) === ORDER_STATUSES.DELIVERED);
    const totalRevenue = succeededOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
    const totalOrders = succeededOrders.length;
    const uniqueCustomers = new Set(succeededOrders.map(o => o.customerId || o.userId).filter(Boolean)).size;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Sales by month
    const monthlySales = {};
    succeededOrders.forEach(order => {
      const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
      monthlySales[month] = (monthlySales[month] || 0) + Number(order.totalPrice || 0);
    });

    // Top products
    const productSales = {};
    succeededOrders.forEach(order => {
      order.cart?.forEach(item => {
        productSales[item.name] = (productSales[item.name] || 0) + (Number(item.quantity) || 0);
      });
    });

    return {
      totalRevenue,
      totalOrders,
      uniqueCustomers,
      avgOrderValue,
      monthlySales,
      productSales,
    };
  }, [ShopOrders]);

  const salesChart = {
    labels: Object.keys(reportData.monthlySales),
    datasets: [{
      label: 'Revenue (ETB)',
      data: Object.values(reportData.monthlySales),
      backgroundColor: '#75d04b',
      borderRadius: 4,
    }],
  };

  const productChart = {
    labels: Object.keys(reportData.productSales).slice(0, 5),
    datasets: [{
      data: Object.values(reportData.productSales).slice(0, 5),
      backgroundColor: ['#75d04b', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'],
    }],
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Reports</h1>
                <p className="text-sm text-gray-600">View and download your business reports</p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-dark transition">
                <FiDownload size={18} />
                Export Report
              </button>
            </div>
          </div>

          {/* Report Type Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {[
                  { id: 'sales', label: 'Sales Report', icon: FiDollarSign },
                  { id: 'orders', label: 'Orders Report', icon: FiShoppingBag },
                  { id: 'products', label: 'Products Report', icon: FiFileText },
                  { id: 'customers', label: 'Customers Report', icon: FiUsers },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setReportType(tab.id)}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition flex items-center gap-2 ${
                      reportType === tab.id
                        ? 'border-brand-primary text-brand-primary-dark'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-gray-400" size={18} />
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                  >
                    <option value="7D">Last 7 Days</option>
                    <option value="30D">Last 30 Days</option>
                    <option value="90D">Last 90 Days</option>
                    <option value="1Y">Last Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="p-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiDollarSign className="text-green-600" size={20} />
                    <span className="text-sm text-gray-600">Total Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">ETB {reportData.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiShoppingBag className="text-blue-600" size={20} />
                    <span className="text-sm text-gray-600">Total Orders</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{reportData.totalOrders}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiUsers className="text-purple-600" size={20} />
                    <span className="text-sm text-gray-600">Unique Customers</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{reportData.uniqueCustomers}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiBarChart2 className="text-yellow-600" size={20} />
                    <span className="text-sm text-gray-600">Avg Order Value</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">ETB {reportData.avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Month</h3>
                  <div className="h-[300px]">
                    <SafeChart type="bar" data={salesChart} options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: { y: { beginAtZero: true } },
                    }} height={300} />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
                  <div className="h-[300px]">
                    <SafeChart type="doughnut" data={productChart} options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'bottom' } },
                    }} height={300} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reports;
