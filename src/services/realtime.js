/**
 * Real-time events facade (backward-compatible delegation to centralized socketService).
 */
import {
  onRequestEvents,
  disconnectRealtime,
  socketService,
  ensureSocket,
  subscribeToRequest,
  subscribeToOrder,
  subscribeToDelivery,
  subscribeToShop,
  subscribeToNotifications,
  subscribeToMessages,
  useOrderRealtime,
  useDeliveryRealtime,
  useShopRealtime,
  useRequestRealtime,
} from '@/services/socketService';

export {
  onRequestEvents,
  disconnectRealtime,
  socketService,
  ensureSocket,
  subscribeToRequest,
  subscribeToOrder,
  subscribeToDelivery,
  subscribeToShop,
  subscribeToNotifications,
  subscribeToMessages,
  useOrderRealtime,
  useDeliveryRealtime,
  useShopRealtime,
  useRequestRealtime,
};

export default {
  onRequestEvents,
  disconnectRealtime,
};
