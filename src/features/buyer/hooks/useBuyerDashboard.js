import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useProducts } from '@/shared/hooks/useProducts';
import { useShops } from '@/shared/hooks/useShops';
import { getAllOrdersOfUser } from '@/store/slices/orderThunks';
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus';

/**
 * Custom hook encapsulating buyer dashboard state, product queries, and metrics.
 */
export function useBuyerDashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const { products: allProducts = [] } = useProducts();
  const { shops = [] } = useShops();
  const orders = useSelector((state) => state.order?.orders || []);
  const cart = useSelector((state) => state.cart?.cart || []);
  const wishlist = useSelector((state) => state.wishlist?.wishlist || []);

  const userId = user?._id || user?.id;
  useEffect(() => {
    if (userId) dispatch(getAllOrdersOfUser(userId));
  }, [dispatch, userId]);

  const recommendedProducts = allProducts.slice(0, 8);
  const newArrivals = [...allProducts]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 8);
  const topShops = shops.slice(0, 4);

  // Active orders (not delivered, cancelled, completed, refunded, or failed)
  const activeOrders = orders.filter((o) => {
    const s = normalizeStatus(o.orderStatus || o.status);
    return (
      s !== ORDER_STATUSES.DELIVERED &&
      s !== ORDER_STATUSES.CANCELLED &&
      s !== 'Refund Success' &&
      s !== 'Refund Rejected' &&
      s !== 'Completed'
    );
  }).slice(0, 3);

  const inTransitCount = orders.filter((o) => {
    const s = normalizeStatus(o.orderStatus || o.status);
    return (
      s === ORDER_STATUSES.SHIPPED ||
      s === ORDER_STATUSES.IN_TRANSIT ||
      s === ORDER_STATUSES.CONFIRMED
    );
  }).length;

  const cartCount = cart?.reduce((t, i) => t + Number(i.quantity ?? 1), 0) || 0;

  return {
    user,
    orders,
    activeOrders,
    inTransitCount,
    cartCount,
    wishlistCount: wishlist?.length || 0,
    recommendedProducts,
    newArrivals,
    topShops,
  };
}

export default useBuyerDashboard;
