import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '@/components/common/Loading';
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';
import { 
  SellerSearchAndFilters, 
  SellerEmptyState
} from '@/business/components';
import BulkOrderActions from '@/business/components/BulkOrderActions';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { ORDER_STATUSES, normalizeStatus } from '@/shared/utils/orderStatus';


const ORDER_TABS = [
  { key: 'all', label: 'All Orders' },
  { key: 'new', label: 'New Orders' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

const matchesTabStatus = (status, tab) => {
  const s = normalizeStatus(status) || '';
  if (tab === 'all') return true;
  if (tab === 'new') return s === ORDER_STATUSES.PROCESSING;
  if (tab === 'confirmed') return s === ORDER_STATUSES.CONFIRMED;
  if (tab === 'shipped') return s === ORDER_STATUSES.SHIPPED || s === ORDER_STATUSES.IN_TRANSIT;
  if (tab === 'delivered') return s === ORDER_STATUSES.DELIVERED;
  if (tab === 'cancelled') return s === ORDER_STATUSES.CANCELLED;
  if (tab === 'refund') return s.toLowerCase().includes('refund');
  return true;
};

const AllOrdersOfASingleShop = () => {
  const { ShopOrders = [], isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { activeShopId } = useBusinessShops();

  const dispatch = useDispatch();
  const sellerTargetId = activeShopId || seller?.id || seller?._id;
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    if (sellerTargetId) {
      dispatch(getAllOrdersOfShop(sellerTargetId));
    }
  }, [dispatch, sellerTargetId, page, limit]);





  const filteredOrders = ShopOrders?.filter((order) => {
    const matchesTab = matchesTabStatus(order.status, activeTab);
    const matchesSearch = !searchTerm || order._id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  }) || [];

  if (isLoading) return <Loader />;
  if (ShopOrders.length === 0 && !isLoading) {
    return (
      <SellerEmptyState
        title="No orders yet"
        description="Your orders will appear here once customers start buying from your shop."
        action={{ to: '/business/products', label: 'Manage Products' }}
        icon="📦"
      />
    );
  }


  return (
    <div className="space-y-6">
      <SellerSearchAndFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={ORDER_TABS}
        onFilterChange={setActiveTab}
        activeFilter={activeTab}
        placeholder="Search orders…"
      />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-market-on-surface">Orders</h2>
          <p className="text-sm text-market-on-surface-variant">Manage orders for your shop</p>
        </div>
      </div>

      {/* Bulk Actions UI */}
      <BulkOrderActions 
        orders={filteredOrders} 
        onRefresh={() => dispatch(getAllOrdersOfShop(sellerTargetId))}
      />

      {/* Pagination Info */}
      <div className="flex items-center justify-between text-sm text-market-on-surface-variant">
        <p>Showing {filteredOrders.length} of {ShopOrders.length} orders</p>
        <div className="flex items-center gap-2">
          <label htmlFor="limit" className="text-xs">Items per page:</label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="px-2 py-1 text-xs border rounded"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AllOrdersOfASingleShop;
