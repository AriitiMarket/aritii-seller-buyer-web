// Product-Requests realtime (Socket.io, co-located with the API Gateway).
//
// Model:
//   * one shared socket per browser tab, opened lazily the first time a
//     Product Requests surface mounts, authenticated with the same access
//     token the REST client uses (handshake auth, no cookies);
//   * the gateway puts the socket in `user:<id>` automatically and, when we
//     ask, in each `request:<id>` room — a client can only ever receive
//     events for requests that belong to it;
//   * events are SIGNALS (`request.event`), never full state: every handler
//     refetches whatever actually changed over REST, so realtime can only add
//     freshness — it can never corrupt local state.
//
// Handlers are registered per key: `'*'` (everything addressed to this user)
// or a specific requestId. Register a handler under ONE key only, otherwise
// it fires twice for the same event.
import { io } from 'socket.io-client';
import { ENV } from '@/app/config';
import { tokenStore } from '@/services/tokenStore';

/** `VITE_API_URL` is `…/api`; sockets live on the gateway origin. */
const SOCKET_ORIGIN = ENV.API_URL.replace(/\/api\/?$/, '');

let socket = null;
const handlers = new Map(); // '*' | requestId -> Set<handler>

const callSafely = (handler, event) => {
  try {
    handler(event);
  } catch (error) {
    console.error('[realtime] handler failed', error);
  }
};

function pushSubscriptions() {
  if (!socket) return;
  const requestIds = [...handlers.keys()].filter((key) => key !== '*');
  if (requestIds.length) socket.emit('request:subscribe', { requestIds });
}

function ensureSocket() {
  if (socket) return socket;
  if (typeof window === 'undefined' || !tokenStore.getAccessToken()) return null;

  socket = io(SOCKET_ORIGIN, {
    // Fresh token on every (re)connect — access tokens rotate every ~10 min.
    auth: (done) => done({ token: tokenStore.getAccessToken() }),
    reconnection: true,
    reconnectionDelayMax: 5000,
    timeout: 8000,
  });

  socket.on('connect', pushSubscriptions);
  socket.on('request:event', (event) => {
    if (!event || typeof event.requestId !== 'string' || typeof event.type !== 'string') return;
    const global = handlers.get('*');
    if (global) [...global].forEach((handler) => callSafely(handler, event));
    const specific = handlers.get(event.requestId);
    if (specific) [...specific].forEach((handler) => callSafely(handler, event));
  });
  socket.on('connect_error', () => {
    /* silent: REST keeps working, the next attempt reuses a fresh token */
  });

  return socket;
}

/**
 * Subscribe to request realtime events.
 *
 * @param {(event: {type: string, requestId: string, actorId: string|null, data: object}) => void} handler
 * @param {string|null} requestId  null → every event addressed to this user
 * @returns {() => void} unsubscribe
 */
export function onRequestEvents(handler, requestId = null) {
  const instance = ensureSocket();
  if (!instance || typeof handler !== 'function') return () => {};

  const key = requestId ? String(requestId) : '*';
  if (!handlers.has(key)) handlers.set(key, new Set());
  handlers.get(key).add(handler);
  if (requestId) instance.emit('request:subscribe', { requestIds: [key] });

  return () => {
    const group = handlers.get(key);
    if (!group) return;
    group.delete(handler);
    if (group.size === 0) {
      handlers.delete(key);
      if (requestId && socket) socket.emit('request:unsubscribe', { requestIds: [key] });
    }
  };
}

/** Drop the socket (logout) — subscriptions survive for the next login. */
export function disconnectRealtime() {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}

export default { onRequestEvents, disconnectRealtime };
