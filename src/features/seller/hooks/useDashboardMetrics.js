import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsShop } from '@/store/slices/productThunks';
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';
import { getAllEventsShop } from '@/store/slices/eventThunks';
import { useBusinessShops } from '@/features/seller/hooks/useBusinessShops';
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus';

/**
 * Custom hook encapsulating seller dashboard data subscriptions and metric calculations.
 */
export function useDashboardMetrics() {
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const { shops, activeShop, activeShopId, hasMultipleShops, selectShop } = useBusinessShops();
  const { shopProducts } = useSelector((state) => state.products);
  const { ShopOrders } = useSelector((state) => state.order);
  const [timeFilter] = useState('7D');

  const shopId = activeShopId || seller?._id;
  const userId = seller?.id || seller?._id;

  useEffect(() => {
    if (shopId && activeShop && activeShop.status !== 'DRAFT' && activeShop.status !== 'PENDING_APPROVAL') {
      dispatch(getAllProductsShop(shopId));
      if (userId) {
        dispatch(getAllOrdersOfShop(userId));
        dispatch(getAllEventsShop(userId));
      }
    }
  }, [dispatch, shopId, activeShop, userId]);

  const totalRevenue = useMemo(() =>
    String(
      ShopOrders
        ?.filter((order) => normalizeStatus(order.status) === ORDER_STATUSES.DELIVERED)
        .reduce((acc, order) => acc + (Number(order.totalPrice) || 0), 0) || 0
    ),
    [ShopOrders]
  );

  const totalOrders = ShopOrders?.length || 0;
  const totalProducts = shopProducts?.length || 0;

  const pendingOrders = ShopOrders?.filter((o) => normalizeStatus(o.status) === ORDER_STATUSES.PROCESSING).length || 0;
  const completedOrders = ShopOrders?.filter((o) => normalizeStatus(o.status) === ORDER_STATUSES.DELIVERED).length || 0;
  const cancelledOrders = ShopOrders?.filter((o) => normalizeStatus(o.status) === ORDER_STATUSES.CANCELLED).length || 0;

  const outOfStock = shopProducts?.filter((p) => Number(p.stock ?? 0) <= 0).length || 0;
  const lowStockProducts = shopProducts?.filter((p) => {
    const a = Math.max(0, Number(p.stock ?? 0) - Number(p.reserved ?? 0));
    return a > 0 && a <= 5;
  }) || [];

  const recentOrders = ShopOrders
    ? [...ShopOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
    : [];

  const shopName = activeShop?.name || 'your shop';

  return {
    seller,
    userId,
    activeShop,
    activeShopId,
    hasMultipleShops,
    shops,
    selectShop,
    shopName,
    timeFilter,
    totalRevenue,
    totalOrders,
    totalProducts,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    outOfStock,
    lowStockProducts,
    recentOrders,
  };
}

export default useDashboardMetrics;
