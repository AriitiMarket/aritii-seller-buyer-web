/**
 * Centralized Socket.IO Client Architecture (Singleton)
 *
 * Provides resilient, authenticated real-time WebSocket event syncing
 * across buyer, seller, and delivery portals.
 *
 * Core Features:
 * - Lazy initialization with exponential backoff and jitter.
 * - Dynamic token injection via tokenStore on handshake and reconnection.
 * - Room-based event scoping for orders, deliveries, shops, and product requests.
 * - Automatic re-subscription of active rooms upon socket reconnect.
 * - Memory-leak-free unsubscription handlers.
 * - Idiomatic React lifecycle hooks (useOrderRealtime, useDeliveryRealtime, etc.).
 */
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { ENV } from '@/app/config';
import { tokenStore } from '@/services/tokenStore';

/**
 * Socket.IO origin fallback chain:
 * 1. ENV.SOCKET_URL (if explicitly configured)
 * 2. ENV.API_URL with trailing /api stripped
 */
const SOCKET_ORIGIN = ENV.SOCKET_URL || ENV.API_URL.replace(/\/api\/?$/, '');

let socket = null;
let explicitAuthToken = null;

// Track active room keys to re-subscribe automatically on reconnection
const activeSubscriptions = {
  requests: new Set(),
  orders: new Set(),
  deliveries: new Set(),
  shops: new Set(),
};

// Handlers indexed by room key or wildcard '*'
const handlers = {
  requests: new Map(), // key -> Set<handler>
  orders: new Map(), // key -> Set<handler>
  deliveries: new Map(), // key -> Set<handler>
  shops: new Map(), // key -> Set<handler>
  notifications: new Set(),
  messages: new Set(),
  general: new Map(), // eventName -> Set<handler>
};

const callSafely = (handler, payload) => {
  try {
    handler(payload);
  } catch (error) {
    console.error('[socketService] Event handler execution error:', error);
  }
};

const dispatchToGroup = (groupMap, targetKey, payload) => {
  const wildcardGroup = groupMap.get('*');
  if (wildcardGroup) {
    [...wildcardGroup].forEach((handler) => callSafely(handler, payload));
  }
  if (targetKey && targetKey !== '*') {
    const specificGroup = groupMap.get(String(targetKey));
    if (specificGroup) {
      [...specificGroup].forEach((handler) => callSafely(handler, payload));
    }
  }
};

/**
 * Flushes all active room subscriptions to the backend gateway.
 * Executed immediately upon 'connect' or reconnection.
 */
function syncActiveSubscriptions() {
  if (!socket || !socket.connected) return;

  if (activeSubscriptions.requests.size > 0) {
    socket.emit('request:subscribe', { requestIds: [...activeSubscriptions.requests] });
  }
  if (activeSubscriptions.orders.size > 0) {
    socket.emit('order:subscribe', { orderIds: [...activeSubscriptions.orders] });
  }
  if (activeSubscriptions.deliveries.size > 0) {
    socket.emit('delivery:subscribe', { deliveryIds: [...activeSubscriptions.deliveries] });
  }
  if (activeSubscriptions.shops.size > 0) {
    socket.emit('shop:subscribe', { shopIds: [...activeSubscriptions.shops] });
  }
}

/**
 * Ensures a single shared Socket.IO instance exists and is wired to dispatchers.
 */
export function ensureSocket() {
  if (socket) return socket;
  if (typeof window === 'undefined') return null;

  const currentToken = explicitAuthToken || tokenStore.getAccessToken();
  if (!currentToken) return null;

  socket = io(SOCKET_ORIGIN, {
    // Dynamic token injection on every connection attempt (handles 10m rotation)
    auth: (done) => {
      const token = explicitAuthToken || tokenStore.getAccessToken();
      done({ token: token || undefined });
    },
    reconnection: true,
    reconnectionAttempts: 15,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
    timeout: 10000,
    transports: ['websocket', 'polling'],
  });

  // Re-sync all room subscriptions on reconnect
  socket.on('connect', syncActiveSubscriptions);

  // Incoming Product Request events
  socket.on('request:event', (event) => {
    if (!event || typeof event.type !== 'string') return;
    dispatchToGroup(handlers.requests, event.requestId, event);
  });

  // Incoming Order lifecycle events
  const handleOrderEvent = (event) => {
    if (!event) return;
    const orderId = event.orderId || event._id || event.id;
    dispatchToGroup(handlers.orders, orderId, event);
  };
  socket.on('order:status_updated', handleOrderEvent);
  socket.on('order:event', handleOrderEvent);
  socket.on('order:created', handleOrderEvent);
  socket.on('order:cancelled', handleOrderEvent);

  // Incoming Delivery & GPS tracking events
  const handleDeliveryEvent = (event) => {
    if (!event) return;
    const deliveryId = event.deliveryId || event.orderId || event.id;
    dispatchToGroup(handlers.deliveries, deliveryId, event);
  };
  socket.on('delivery:location_updated', handleDeliveryEvent);
  socket.on('delivery:status_updated', handleDeliveryEvent);
  socket.on('delivery:event', handleDeliveryEvent);
  socket.on('delivery:assigned', handleDeliveryEvent);

  // Incoming Merchant/Shop events
  const handleShopEvent = (event) => {
    if (!event) return;
    const shopId = event.shopId || event.id;
    dispatchToGroup(handlers.shops, shopId, event);
  };
  socket.on('shop:event', handleShopEvent);
  socket.on('shop:stock_alert', handleShopEvent);
  socket.on('shop:new_order', handleShopEvent);

  // Global user notifications
  const handleNotification = (event) => {
    if (!event) return;
    [...handlers.notifications].forEach((h) => callSafely(h, event));
  };
  socket.on('notification:received', handleNotification);
  socket.on('notification:new', handleNotification);

  // Direct chat & request messaging
  const handleMessage = (event) => {
    if (!event) return;
    [...handlers.messages].forEach((h) => callSafely(h, event));
  };
  socket.on('message:received', handleMessage);
  socket.on('chat:message', handleMessage);
  socket.on('request.message.created', handleMessage);

  // Catch connection errors silently without crashing UI; REST fallbacks remain active
  socket.on('connect_error', (error) => {
    if (ENV.IS_DEV) {
      console.warn('[socketService] Real-time connection degraded, falling back to REST polling:', error?.message);
    }
  });

  return socket;
}

/**
 * Helper to subscribe a handler to a keyed room group and register clean unsubscription.
 */
function subscribeToRoomGroup({ groupMap, activeSet, emitEvent, key, handler }) {
  const instance = ensureSocket();
  const roomKey = key ? String(key) : '*';

  if (!groupMap.has(roomKey)) {
    groupMap.set(roomKey, new Set());
  }
  groupMap.get(roomKey).add(handler);

  if (roomKey !== '*') {
    activeSet.add(roomKey);
    if (instance && instance.connected) {
      instance.emit(`${emitEvent}:subscribe`, { [`${emitEvent}Ids`]: [roomKey] });
    }
  }

  return () => {
    const group = groupMap.get(roomKey);
    if (!group) return;
    group.delete(handler);

    if (group.size === 0) {
      groupMap.delete(roomKey);
      if (roomKey !== '*') {
        activeSet.delete(roomKey);
        if (socket && socket.connected) {
          socket.emit(`${emitEvent}:unsubscribe`, { [`${emitEvent}Ids`]: [roomKey] });
        }
      }
    }
  };
}

/**
 * Subscribes to Product Request real-time signals.
 */
export function subscribeToRequest(requestId, handler) {
  if (typeof handler !== 'function') return () => {};
  return subscribeToRoomGroup({
    groupMap: handlers.requests,
    activeSet: activeSubscriptions.requests,
    emitEvent: 'request',
    key: requestId,
    handler,
  });
}

/**
 * Subscribes to Order lifecycle updates (processing, confirmed, shipped, delivered).
 */
export function subscribeToOrder(orderId, handler) {
  if (typeof handler !== 'function') return () => {};
  return subscribeToRoomGroup({
    groupMap: handlers.orders,
    activeSet: activeSubscriptions.orders,
    emitEvent: 'order',
    key: orderId,
    handler,
  });
}

/**
 * Subscribes to Delivery live tracking and status updates.
 */
export function subscribeToDelivery(deliveryId, handler) {
  if (typeof handler !== 'function') return () => {};
  return subscribeToRoomGroup({
    groupMap: handlers.deliveries,
    activeSet: activeSubscriptions.deliveries,
    emitEvent: 'delivery',
    key: deliveryId,
    handler,
  });
}

/**
 * Subscribes to Merchant Shop alerts and new order notifications.
 */
export function subscribeToShop(shopId, handler) {
  if (typeof handler !== 'function') return () => {};
  return subscribeToRoomGroup({
    groupMap: handlers.shops,
    activeSet: activeSubscriptions.shops,
    emitEvent: 'shop',
    key: shopId,
    handler,
  });
}

/**
 * Subscribes to real-time notification events.
 */
export function subscribeToNotifications(handler) {
  if (typeof handler !== 'function') return () => {};
  ensureSocket();
  handlers.notifications.add(handler);
  return () => {
    handlers.notifications.delete(handler);
  };
}

/**
 * Subscribes to real-time chat and direct messages.
 */
export function subscribeToMessages(handler) {
  if (typeof handler !== 'function') return () => {};
  ensureSocket();
  handlers.messages.add(handler);
  return () => {
    handlers.messages.delete(handler);
  };
}

/**
 * General event listener registration with cleanup callback.
 */
export function on(eventName, handler) {
  if (!eventName || typeof handler !== 'function') return () => {};
  const instance = ensureSocket();
  if (!handlers.general.has(eventName)) {
    handlers.general.set(eventName, new Set());
    if (instance) {
      instance.on(eventName, (data) => {
        const group = handlers.general.get(eventName);
        if (group) [...group].forEach((h) => callSafely(h, data));
      });
    }
  }
  handlers.general.get(eventName).add(handler);

  return () => {
    const group = handlers.general.get(eventName);
    if (!group) return;
    group.delete(handler);
    if (group.size === 0) {
      handlers.general.delete(eventName);
      if (socket) socket.off(eventName);
    }
  };
}

/**
 * Emit an event through the socket client safely.
 */
export function emit(eventName, data) {
  if (!socket) return;
  socket.emit(eventName, data);
}

/**
 * Explicitly connects or switches auth credentials.
 */
export function connectSocket(token = null) {
  if (token) explicitAuthToken = token;
  if (!socket) {
    return ensureSocket();
  }
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

/**
 * Disconnects the socket connection on logout or portal switch.
 * Active subscriptions are retained so re-authentication instantly re-subscribes.
 */
export function disconnectSocket() {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
  explicitAuthToken = null;
}

/**
 * Completely resets socket and clears all subscription records.
 */
export function resetSocket() {
  disconnectSocket();
  activeSubscriptions.requests.clear();
  activeSubscriptions.orders.clear();
  activeSubscriptions.deliveries.clear();
  activeSubscriptions.shops.clear();
  handlers.requests.clear();
  handlers.orders.clear();
  handlers.deliveries.clear();
  handlers.shops.clear();
  handlers.notifications.clear();
  handlers.messages.clear();
  handlers.general.clear();
}

/**
 * Returns current status of socket connectivity and subscriptions.
 */
export function getSocketStatus() {
  return {
    connected: Boolean(socket?.connected),
    id: socket?.id || null,
    origin: SOCKET_ORIGIN,
    activeSubscriptions: {
      requests: [...activeSubscriptions.requests],
      orders: [...activeSubscriptions.orders],
      deliveries: [...activeSubscriptions.deliveries],
      shops: [...activeSubscriptions.shops],
    },
  };
}

// ── Backward-compatible Aliases for Existing Callers ──────────────
export const onRequestEvents = (handler, requestId = null) => subscribeToRequest(requestId, handler);
export const disconnectRealtime = () => disconnectSocket();

// ── React Lifecycle Hooks ─────────────────────────────────────────

export function useOrderRealtime(orderId, handler) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!orderId) return undefined;
    const unsubscribe = subscribeToOrder(orderId, (event) => {
      if (handlerRef.current) handlerRef.current(event);
    });
    return unsubscribe;
  }, [orderId]);
}

export function useDeliveryRealtime(deliveryId, handler) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!deliveryId) return undefined;
    const unsubscribe = subscribeToDelivery(deliveryId, (event) => {
      if (handlerRef.current) handlerRef.current(event);
    });
    return unsubscribe;
  }, [deliveryId]);
}

export function useShopRealtime(shopId, handler) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!shopId) return undefined;
    const unsubscribe = subscribeToShop(shopId, (event) => {
      if (handlerRef.current) handlerRef.current(event);
    });
    return unsubscribe;
  }, [shopId]);
}

export function useRequestRealtime(requestId, handler) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    const unsubscribe = subscribeToRequest(requestId, (event) => {
      if (handlerRef.current) handlerRef.current(event);
    });
    return unsubscribe;
  }, [requestId]);
}

export function useSocketNotifications(handler) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    const unsubscribe = subscribeToNotifications((event) => {
      if (handlerRef.current) handlerRef.current(event);
    });
    return unsubscribe;
  }, []);
}

export function useSocketMessages(handler) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    const unsubscribe = subscribeToMessages((event) => {
      if (handlerRef.current) handlerRef.current(event);
    });
    return unsubscribe;
  }, []);
}

export const socketService = {
  ensureSocket,
  connectSocket,
  disconnectSocket,
  resetSocket,
  getSocketStatus,
  subscribeToRequest,
  subscribeToOrder,
  subscribeToDelivery,
  subscribeToShop,
  subscribeToNotifications,
  subscribeToMessages,
  on,
  emit,
  onRequestEvents,
  disconnectRealtime,
};

export default socketService;
