import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  socketService,
  subscribeToRequest,
  subscribeToOrder,
  subscribeToDelivery,
  subscribeToShop,
  subscribeToNotifications,
  subscribeToMessages,
  disconnectSocket,
  resetSocket,
  getSocketStatus,
} from '@/services/socketService';
import { tokenStore } from '@/services/tokenStore';

// Mock socket.io-client
const mockSocket = {
  connected: false,
  id: 'socket-test-123',
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  removeAllListeners: vi.fn(),
};

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => {
    mockSocket.connected = true;
    return mockSocket;
  }),
}));

describe('socketService — Centralized Real-Time WebSocket Architecture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetSocket();
    mockSocket.connected = false;
    tokenStore.setTokens({ access_token: 'valid-jwt-token-xyz' });
  });

  afterEach(() => {
    resetSocket();
    tokenStore.clear();
  });

  it('lazily initializes socket with dynamic token authentication', () => {
    expect(mockSocket.connect).not.toHaveBeenCalled();

    const unsubscribe = subscribeToOrder('ord-999', () => {});
    expect(mockSocket.connected).toBe(true);
    expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('order:status_updated', expect.any(Function));
    expect(mockSocket.emit).toHaveBeenCalledWith('order:subscribe', { orderIds: ['ord-999'] });

    unsubscribe();
  });

  it('subscribes to and receives order lifecycle updates', () => {
    const orderHandler = vi.fn();
    const unsubscribe = subscribeToOrder('ord-12345', orderHandler);

    // Find the registered 'order:status_updated' handler
    const registeredCall = mockSocket.on.mock.calls.find(
      ([event]) => event === 'order:status_updated'
    );
    expect(registeredCall).toBeDefined();
    const eventDispatcher = registeredCall[1];

    // Dispatch update for this order
    eventDispatcher({ orderId: 'ord-12345', status: 'shipped' });
    expect(orderHandler).toHaveBeenCalledWith({ orderId: 'ord-12345', status: 'shipped' });

    // Different order should not fire this handler
    eventDispatcher({ orderId: 'ord-99999', status: 'delivered' });
    expect(orderHandler).toHaveBeenCalledTimes(1);

    unsubscribe();
  });

  it('subscribes to and receives delivery tracking updates', () => {
    const deliveryHandler = vi.fn();
    const unsubscribe = subscribeToDelivery('del-567', deliveryHandler);

    expect(mockSocket.emit).toHaveBeenCalledWith('delivery:subscribe', { deliveryIds: ['del-567'] });

    const registeredCall = mockSocket.on.mock.calls.find(
      ([event]) => event === 'delivery:location_updated'
    );
    expect(registeredCall).toBeDefined();
    const eventDispatcher = registeredCall[1];

    eventDispatcher({ deliveryId: 'del-567', location: { lat: 9.03, lng: 38.74 } });
    expect(deliveryHandler).toHaveBeenCalledWith({
      deliveryId: 'del-567',
      location: { lat: 9.03, lng: 38.74 },
    });

    unsubscribe();
  });

  it('subscribes to and receives merchant shop updates', () => {
    const shopHandler = vi.fn();
    const unsubscribe = subscribeToShop('shop-777', shopHandler);

    expect(mockSocket.emit).toHaveBeenCalledWith('shop:subscribe', { shopIds: ['shop-777'] });

    const registeredCall = mockSocket.on.mock.calls.find(
      ([event]) => event === 'shop:stock_alert'
    );
    expect(registeredCall).toBeDefined();
    const eventDispatcher = registeredCall[1];

    eventDispatcher({ shopId: 'shop-777', lowStockCount: 3 });
    expect(shopHandler).toHaveBeenCalledWith({ shopId: 'shop-777', lowStockCount: 3 });

    unsubscribe();
  });

  it('subscribes to notifications and messaging channels', () => {
    const notifHandler = vi.fn();
    const msgHandler = vi.fn();

    const unsubNotif = subscribeToNotifications(notifHandler);
    const unsubMsg = subscribeToMessages(msgHandler);

    const notifCall = mockSocket.on.mock.calls.find(([e]) => e === 'notification:received');
    const msgCall = mockSocket.on.mock.calls.find(([e]) => e === 'message:received');

    expect(notifCall).toBeDefined();
    expect(msgCall).toBeDefined();

    notifCall[1]({ id: 'n-1', text: 'New promo available' });
    expect(notifHandler).toHaveBeenCalledWith({ id: 'n-1', text: 'New promo available' });

    msgCall[1]({ id: 'm-1', text: 'Where is my order?' });
    expect(msgHandler).toHaveBeenCalledWith({ id: 'm-1', text: 'Where is my order?' });

    unsubNotif();
    unsubMsg();
  });

  it('emits unsubscription when the last listener for a room unregisters', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    const unsub1 = subscribeToOrder('ord-shared', handler1);
    const unsub2 = subscribeToOrder('ord-shared', handler2);

    // Unsubscribing first listener shouldn't emit unsubscribe yet
    unsub1();
    expect(mockSocket.emit).not.toHaveBeenCalledWith('order:unsubscribe', expect.anything());

    // Unsubscribing second listener cleans up room and emits unsubscription
    unsub2();
    expect(mockSocket.emit).toHaveBeenCalledWith('order:unsubscribe', { orderIds: ['ord-shared'] });
  });

  it('re-subscribes active rooms automatically on reconnect', () => {
    subscribeToOrder('ord-reconnect-1', () => {});
    subscribeToDelivery('del-reconnect-2', () => {});
    subscribeToShop('shop-reconnect-3', () => {});
    subscribeToRequest('req-reconnect-4', () => {});

    // Find the 'connect' listener that syncs subscriptions
    const connectCall = mockSocket.on.mock.calls.find(([e]) => e === 'connect');
    expect(connectCall).toBeDefined();
    const onConnect = connectCall[1];

    mockSocket.emit.mockClear();

    // Trigger reconnect callback
    onConnect();

    expect(mockSocket.emit).toHaveBeenCalledWith('order:subscribe', {
      orderIds: ['ord-reconnect-1'],
    });
    expect(mockSocket.emit).toHaveBeenCalledWith('delivery:subscribe', {
      deliveryIds: ['del-reconnect-2'],
    });
    expect(mockSocket.emit).toHaveBeenCalledWith('shop:subscribe', {
      shopIds: ['shop-reconnect-3'],
    });
    expect(mockSocket.emit).toHaveBeenCalledWith('request:subscribe', {
      requestIds: ['req-reconnect-4'],
    });
  });

  it('cleanly disconnects socket and removes listeners on disconnectSocket()', () => {
    subscribeToOrder('ord-disconnect', () => {});
    expect(getSocketStatus().connected).toBe(true);

    disconnectSocket();

    expect(mockSocket.removeAllListeners).toHaveBeenCalled();
    expect(mockSocket.disconnect).toHaveBeenCalled();
    expect(getSocketStatus().connected).toBe(false);
  });

  it('exposes all subscription and control methods on the socketService singleton facade', () => {
    expect(typeof socketService.ensureSocket).toBe('function');
    expect(typeof socketService.connectSocket).toBe('function');
    expect(typeof socketService.disconnectSocket).toBe('function');
    expect(typeof socketService.subscribeToOrder).toBe('function');
    expect(typeof socketService.subscribeToDelivery).toBe('function');
    expect(typeof socketService.subscribeToShop).toBe('function');
    expect(typeof socketService.subscribeToRequest).toBe('function');
    expect(typeof socketService.getSocketStatus).toBe('function');
  });
});
