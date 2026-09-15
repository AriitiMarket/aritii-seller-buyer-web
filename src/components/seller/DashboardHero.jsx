import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop } from '../../store/redux/actions/product';
import { getAllOrdersOfShop } from '../../store/redux/actions/order';
import { getAllEventsShop } from '../../store/redux/actions/event';
import { MdShoppingBag, MdInventory2, MdEventNote } from "react-icons/md";
import { BiCreditCard } from "react-icons/bi";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const { ShopOrders } = useSelector((state) => state.order);
  const { events } = useSelector((state) => state.events);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllProductsShop(seller._id));
      dispatch(getAllOrdersOfShop(seller._id));
      dispatch(getAllEventsShop(seller._id));
    }
  }, [dispatch, seller]);

  const totalRevenue =
    ShopOrders
      ?.filter((order) => order.status === "succeeded")
      .reduce((acc, order) => acc + order.totalPrice, 0)
      .toFixed(2) || "0.00";

  const totalOrders = ShopOrders?.length || 0;
  const totalProducts = products?.length || 0;
  const totalEvents = events?.length || 0;

  const recentOrders = ShopOrders ? [...ShopOrders].slice(0, 5) : [];

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen space-y-6">

      {/* Welcome Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {seller?.name}
        </h1>
        <p className="text-sm text-gray-600">
          Manage your shop, track orders, and monitor your storefront performance.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BiCreditCard}
          label="Total Revenue"
          value={`ETB ${Number(totalRevenue).toLocaleString()}`}
          color="bg-green-50 text-green-700"
          iconColor="text-green-600"
        />
        <StatCard
          icon={MdShoppingBag}
          label="Total Orders"
          value={totalOrders}
          color="bg-blue-50 text-blue-700"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={MdInventory2}
          label="Products"
          value={totalProducts}
          color="bg-yellow-50 text-yellow-700"
          iconColor="text-yellow-600"
        />
        <StatCard
          icon={MdEventNote}
          label="Events"
          value={totalEvents}
          color="bg-purple-50 text-purple-700"
          iconColor="text-purple-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <QuickActionButton 
            to="/my-dashboard/business/products/create" 
            label="Create Product" 
            bgColor="bg-green-100 hover:bg-green-200"
            textColor="text-green-700"
            icon="📦"
          />
          <QuickActionButton 
            to="/my-dashboard/business/products/create" 
            label="Create Event" 
            bgColor="bg-purple-100 hover:bg-purple-200"
            textColor="text-purple-700"
            icon="🎉"
          />
          <QuickActionButton 
            to="/my-dashboard/business/products/create" 
            label="Create Coupon" 
            bgColor="bg-yellow-100 hover:bg-yellow-200"
            textColor="text-yellow-700"
            icon="🏷️"
          />
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
          <Link
            to="/my-dashboard/business/orders"
            className="text-sm text-green-600 hover:text-green-700 font-semibold underline"
          >
            View all orders
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10">
            <MdShoppingBag className="text-5xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 text-sm mb-2">You have no orders yet.</p>
            <p className="text-gray-500 text-xs">Share your shop link to start receiving orders.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <Link 
                        to={`/order/${order._id}`}
                        className="font-semibold text-gray-900 hover:text-green-600"
                      >
                        #{order._id?.slice(-8)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {order.cart?.length ?? 0} item{(order.cart?.length ?? 0) !== 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'succeeded' || order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      ETB {Number(order.totalPrice || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Shop Performance Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-900 mb-4">Shop Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 font-semibold uppercase mb-1">Active Products</p>
            <p className="text-2xl font-bold text-blue-900">{totalProducts}</p>
            <p className="text-xs text-blue-600 mt-1">Ready to sell</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-600 font-semibold uppercase mb-1">Active Events</p>
            <p className="text-2xl font-bold text-purple-900">{totalEvents}</p>
            <p className="text-xs text-purple-600 mt-1">Running promotions</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-xs text-green-600 font-semibold uppercase mb-1">Total Customers</p>
            <p className="text-2xl font-bold text-green-900">{recentOrders.length > 0 ? recentOrders.length : 0}</p>
            <p className="text-xs text-green-600 mt-1">Recent orders</p>
          </div>
        </div>
      </div>

    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, iconColor }) => (
  <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
    <div className="flex items-start justify-between mb-3">
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className={`text-xl ${iconColor}`} />
      </div>
    </div>
  </div>
);

const QuickActionButton = ({ to, label, bgColor, textColor, icon }) => (
  <Link
    to={to}
    className={`px-4 py-3 rounded-lg ${bgColor} ${textColor} text-sm font-semibold text-center transition flex items-center justify-center gap-2`}
  >
    <span>{icon}</span>
    {label}
  </Link>
);

export default DashboardHero;