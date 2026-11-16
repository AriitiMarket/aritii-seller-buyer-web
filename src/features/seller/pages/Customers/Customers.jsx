import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';
import Loader from '@/components/common/Loading';
import { FiUsers, FiMail, FiPhone, FiMapPin, FiShoppingBag, FiDollarSign, FiSearch } from 'react-icons/fi';

const Customers = () => {
  const { ShopOrders = [], isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const sellerUserId = seller?.id || seller?._id;

  useEffect(() => {
    if (sellerUserId) {
      dispatch(getAllOrdersOfShop(sellerUserId));
    }
  }, [dispatch, sellerUserId]);

  // Aggregate customer data from orders — ONE entry per buyer, no duplicates.
  // Orders identify their buyer under different keys depending on the checkout
  // path (top-level `buyerId`, the embedded `user` snapshot's `id`/`_id`, or the
  // legacy `userId`), so all of them must resolve to the same map key or the
  // same buyer shows up several times. Orders without any id fall back to
  // email → phone so they still merge instead of piling up.
  const customerData = React.useMemo(() => {
    const customers = new Map();

    const keyFor = (order) => {
      const id = order.buyerId || order.user?.id || order.user?._id || order.userId;
      if (id) return `id:${id}`;
      const email = (order.user?.email || order.shippingAddress?.email || '').trim().toLowerCase();
      if (email) return `email:${email}`;
      const phone = order.user?.phoneNumber || order.destination?.phone || order.shippingAddress?.phone || '';
      return phone ? `phone:${phone}` : null;
    };

    ShopOrders.forEach((order) => {
      const key = keyFor(order);
      if (!key) return;

      const name = order.user?.name || order.shippingAddress?.fullName || '';
      const email = order.user?.email || order.shippingAddress?.email || 'N/A';
      // `destination.phone` is the delivery-contact phone written (and required)
      // at checkout; `shippingAddress.phone` is the legacy location.
      const phone = order.user?.phoneNumber || order.destination?.phone || order.shippingAddress?.phone || 'N/A';
      const address = order.destination?.fullAddress || order.shippingAddress?.address || 'N/A';

      const existing = customers.get(key);
      const orderDate = new Date(order.createdAt);
      const hasDate = !Number.isNaN(orderDate.getTime());

      if (!existing) {
        customers.set(key, {
          id: key.replace(/^[a-z]+:/, ''),
          name: name || email || 'Unknown',
          email,
          phone,
          address,
          totalOrders: 1,
          totalSpent: Number(order.totalPrice || 0),
          lastOrderDate: hasDate ? orderDate : null,
        });
        return;
      }

      existing.totalOrders += 1;
      existing.totalSpent += Number(order.totalPrice || 0);

      if (hasDate && (!existing.lastOrderDate || orderDate > existing.lastOrderDate)) {
        // A newer order refreshes the stored contact snapshot.
        existing.lastOrderDate = orderDate;
        if (name) existing.name = name;
        if (email !== 'N/A') existing.email = email;
        if (phone !== 'N/A') existing.phone = phone;
        if (address !== 'N/A') existing.address = address;
      } else {
        // Older orders only fill gaps — never overwrite fresher contact data.
        if (!existing.name && name) existing.name = name;
        if (existing.email === 'N/A' && email !== 'N/A') existing.email = email;
        if (existing.phone === 'N/A' && phone !== 'N/A') existing.phone = phone;
        if (existing.address === 'N/A' && address !== 'N/A') existing.address = address;
      }
    });

    return Array.from(customers.values());
  }, [ShopOrders]);

  // Sort customers
  const sortedCustomers = React.useMemo(() => {
    const sorted = [...customerData];
    if (sortBy === 'recent') {
      sorted.sort((a, b) => (b.lastOrderDate?.getTime() || 0) - (a.lastOrderDate?.getTime() || 0));
    } else if (sortBy === 'orders') {
      sorted.sort((a, b) => b.totalOrders - a.totalOrders);
    } else if (sortBy === 'spent') {
      sorted.sort((a, b) => b.totalSpent - a.totalSpent);
    }
    return sorted;
  }, [customerData, sortBy]);

  // Filter customers
  const filteredCustomers = React.useMemo(() => {
    if (!searchTerm) return sortedCustomers;
    const term = searchTerm.toLowerCase();
    return sortedCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.phone.toLowerCase().includes(term)
    );
  }, [sortedCustomers, searchTerm]);

  const totalCustomers = customerData.length;
  const totalRevenue = customerData.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = ShopOrders.length > 0 ? totalRevenue / ShopOrders.length : 0;

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
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Customers</h1>
                <p className="text-sm text-gray-600">Manage your customer relationships</p>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiUsers className="text-blue-600" size={20} />
                </div>
                <span className="text-sm text-gray-600">Total Customers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiDollarSign className="text-green-600" size={20} />
                </div>
                <span className="text-sm text-gray-600">Total Revenue</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">ETB {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiShoppingBag className="text-purple-600" size={20} />
                </div>
                <span className="text-sm text-gray-600">Avg Order Value</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">ETB {avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search customers by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
              >
                <option value="recent">Sort by: Most Recent</option>
                <option value="orders">Sort by: Most Orders</option>
                <option value="spent">Sort by: Highest Spent</option>
              </select>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-16">
                <FiUsers className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">No customers found</p>
                <p className="text-gray-500 text-sm">Customers will appear here once they place orders</p>
              </div>
            ) : (
              <>
                {/* Desktop: table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Orders</th>
                        <th className="px-6 py-4">Total Spent</th>
                        <th className="px-6 py-4">Last Order</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-brand-primary-light rounded-full flex items-center justify-center">
                                <span className="text-brand-primary-dark font-semibold">
                                  {customer.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{customer.name}</p>
                                <p className="text-xs text-gray-500">ID: {customer.id.slice(-8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <FiMail className="text-gray-400" size={14} />
                                <span className="truncate max-w-[200px]">{customer.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <FiPhone className="text-gray-400" size={14} />
                                <span>{customer.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <FiMapPin className="text-gray-400" size={14} />
                              <span className="truncate max-w-[150px]">{customer.address}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <FiShoppingBag className="text-gray-400" size={16} />
                              <span className="font-semibold text-gray-900">{customer.totalOrders}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <FiDollarSign className="text-gray-400" size={16} />
                              <span className="font-semibold text-gray-900">
                                {customer.totalSpent.toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: stacked section cards — no horizontal scroll */}
                <div className="md:hidden divide-y divide-gray-100">
                  {filteredCustomers.map((customer) => (
                    <div key={customer.id} className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-primary-light rounded-full flex items-center justify-center shrink-0">
                          <span className="text-brand-primary-dark font-semibold">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{customer.name}</p>
                          <p className="text-xs text-gray-500">ID: {customer.id.slice(-8)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="col-span-2">
                          <p className="text-xs text-gray-400">Email</p>
                          <p className="text-gray-900 truncate flex items-center gap-1.5">
                            <FiMail className="text-gray-400 shrink-0" size={14} />
                            {customer.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Phone</p>
                          <p className="text-gray-900 truncate">{customer.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Orders</p>
                          <p className="font-semibold text-gray-900">{customer.totalOrders}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Total spent</p>
                          <p className="font-semibold text-gray-900">{customer.totalSpent.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Last order</p>
                          <p className="text-gray-700">
                            {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-400">Location</p>
                          <p className="text-gray-700 truncate">{customer.address}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Pagination Info */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>Showing {filteredCustomers.length} of {totalCustomers} customers</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Customers;
