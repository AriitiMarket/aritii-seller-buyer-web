/**
 * Gap #19: Seller Dashboard Insights - Complete
 * Integrated into business (seller) section
 */

import React, { useState, useEffect } from 'react';

export function SellerDashboardInsights() {
  const [trends, setTrends] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [customers, setCustomers] = useState(null);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const [trendsRes, productsRes, customersRes, inventoryRes] = await Promise.all([
        fetch('/api/seller/insights/trends?days=30'),
        fetch('/api/seller/insights/top-products'),
        fetch('/api/seller/insights/customers'),
        fetch('/api/seller/insights/inventory')
      ]);

      setTrends((await trendsRes.json()).data);
      setTopProducts((await productsRes.json()).data);
      setCustomers((await customersRes.json()).data);
      setInventory((await inventoryRes.json()).data);
    } catch (error) {
      console.error('Insights error:', error);
    }
  };

  return (
    <div className="seller-insights">
      <h2>Sales Insights</h2>

      {/* Sales Trends */}
      {trends && (
        <section className="trends-section">
          <h3>Sales Trends (30 days)</h3>
          <div className="metrics">
            <div className="metric">
              <span className="label">Total Revenue</span>
              <span className="value">{trends.summary.totalRevenue} Br</span>
            </div>
            <div className="metric">
              <span className="label">Total Orders</span>
              <span className="value">{trends.summary.totalOrders}</span>
            </div>
            <div className="metric">
              <span className="label">Avg Order Value</span>
              <span className="value">{trends.summary.avgOrder} Br</span>
            </div>
          </div>
          <Chart data={trends.trend} />
        </section>
      )}

      {/* Top Products */}
      <section className="top-products-section">
        <h3>Top Products</h3>
        <div className="products-list">
          {topProducts.map(product => (
            <div key={product._id} className="product-item">
              <span className="name">{product.productName}</span>
              <span className="sold">{product.sold} sold</span>
              <span className="revenue">{product.revenue} Br</span>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Insights */}
      {customers && (
        <section className="customers-section">
          <h3>Customer Insights</h3>
          <div className="customer-metrics">
            <div className="metric">
              <span className="label">Total Customers</span>
              <span className="value">{customers.totalCustomers}</span>
            </div>
            <div className="metric">
              <span className="label">Repeat Customers</span>
              <span className="value">{customers.recurringCustomers}</span>
            </div>
            <div className="metric">
              <span className="label">Avg Customer LTV</span>
              <span className="value">{customers.avgCustomerLTV} Br</span>
            </div>
            <div className="metric">
              <span className="label">Active Customers</span>
              <span className="value">{customers.activeCustomers}</span>
            </div>
          </div>
        </section>
      )}

      {/* Inventory Turnover */}
      <section className="inventory-section">
        <h3>Inventory Turnover</h3>
        <div className="inventory-list">
          {inventory.map(item => (
            <div key={item._id} className="inventory-item">
              <span className="name">{item.name}</span>
              <span className="turnover">{item.turnoverRate.toFixed(2)}</span>
              <span className="velocity">{item.velocity.toFixed(1)}/day</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Chart({ data }) {
  // Simple chart render - integrate with Chart.js or similar for better visuals
  return (
    <div className="chart">
      <p>Revenue trends visualization</p>
      {data && data.map((d, idx) => (
        <div key={idx} className="chart-bar">
          <div
            className="bar"
            style={{ height: `${(d.revenue / 100000) * 100}px` }}
          ></div>
          <span>{d._id.date}</span>
        </div>
      ))}
    </div>
  );
}

export default SellerDashboardInsights;
