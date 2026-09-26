import { useEffect, useRef } from 'react';
import { onRequestEvents } from '@/services/realtime';

/**
 * Subscribes a component to Product-Requests realtime events.
 *
 * The handler is kept in a ref, so it always sees fresh props/state (tab,
 * selection, …) without resubscribing; the subscription only depends on
 * `requestId` (null → every event addressed to this user).
 *
 * Returns nothing — the unsubscribe runs on unmount.
 */
export default function useRequestEvents(handler, requestId = null) {
  const saved = useRef(handler);
  saved.current = handler;

  useEffect(() => {
    return onRequestEvents((event) => {
      if (saved.current) saved.current(event);
    }, requestId);
  }, [requestId]);
}
