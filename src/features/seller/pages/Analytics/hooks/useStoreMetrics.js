import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfShop } from '@/store/slices/orderThunks';
import { getAllProductsShop } from '@/store/slices/productThunks';
import { useBusinessShops } from '@/features/seller/hooks/useBusinessShops';
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus';

/**
 * Custom hook encapsulating store analytics data fetching and windowed metric computations.
 */
export function useStoreMetrics() {
  const dispatch = useDispatch();
  const { ShopOrders = [], isLoading } = useSelector((state) => state.order);
  const { shopProducts = [] } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const [timeFilter, setTimeFilter] = useState('30D');

  const { activeShopId } = useBusinessShops();
  const shopId = activeShopId || seller?.id;
  const userId = seller?.id || seller?._id;

  useEffect(() => {
    if (shopId) {
      if (userId) {
        dispatch(getAllOrdersOfShop(userId));
      }
      dispatch(getAllProductsShop(shopId));
    }
  }, [dispatch, shopId, userId]);

  const metrics = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    switch (timeFilter) {
      case '7D':
        start.setDate(now.getDate() - 7);
        break;
      case '30D':
        start.setDate(now.getDate() - 30);
        break;
      case '90D':
        start.setDate(now.getDate() - 90);
        break;
      case '1Y':
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        start.setDate(now.getDate() - 30);
    }

    const inWindow = (o) => {
      const dt = o.createdAt ? new Date(o.createdAt) : null;
      return dt && dt >= start && dt <= now;
    };

    const windowOrders = ShopOrders.filter(inWindow);
    const succeeded = windowOrders.filter(
      (o) => normalizeStatus(o.status) === ORDER_STATUSES.DELIVERED
    );

    const revenue = succeeded.reduce(
      (s, o) =>
        s +
        Number(
          o.subtotal ??
            Math.max(0, Number(o.totalPrice) - Number(o.shippingFee || 0))
        ),
      0
    );

    const lowStock = shopProducts.filter(
      (p) => Number(p.stock) <= 5 && Number(p.stock) > 0
    );
    const outOfStock = shopProducts.filter((p) => Number(p.stock) === 0);

    const soldMap = new Map();
    succeeded.forEach((o) =>
      (o.cart || []).forEach((li) => {
        const id = li.productId || li.product || li._id || 'unknown';
        const nm = li.name || 'Product';
        const quantity = Number(li.quantity ?? li.qty) || 1;
        const unitPrice = Number(li.discountPrice ?? li.price ?? 0);
        const cur = soldMap.get(id) || { name: nm, quantity: 0, revenue: 0 };
        cur.quantity += quantity;
        cur.revenue += unitPrice * quantity;
        soldMap.set(id, cur);
      })
    );

    const bestSellers = [...soldMap.values()]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const totalStockUnits = shopProducts.reduce(
      (s, p) => s + (Number(p.stock) || 0),
      0
    );
    const completedOrders = succeeded.length;
    const uniqueCustomers = new Set(
      windowOrders.map((o) => o.buyerId || o.userId).filter(Boolean)
    ).size;

    return {
      windowOrders,
      revenue,
      lowStock,
      outOfStock,
      bestSellers,
      totalStockUnits,
      completedOrders,
      uniqueCustomers,
    };
  }, [ShopOrders, shopProducts, timeFilter]);

  return {
    isLoading: isLoading || !seller,
    seller,
    shopProducts,
    timeFilter,
    setTimeFilter,
    ...metrics,
  };
}

export default useStoreMetrics;
