/**
 * Delivery pricing & delivery-time — the ONE place the storefront reads what
 * a delivery costs and when it arrives.
 *
 * Both facts are owned by the Delivery Service:
 *   * the FEE comes from `GET /delivery/zone/fee-quote` (the zone's quantity
 *     bands, or the platform default);
 *   * the DELIVERY TIME comes from the zone's own `estimatedDeliveryTime`
 *     rule, which the delivery admin edits.
 *
 * The cart used to show `subtotal * 3%` and checkout showed the server quote,
 * so the buyer saw two different shipping totals for the same basket; both
 * screens also guessed "+3 days" for the ETA. Everything now comes from one
 * server-owned quote, so the cart, the checkout and the order agree.
 */
import { locationService } from '@/services/location.service';

/** Round to 2 decimals without float drift (money, not percentages). */
export function money2(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

/**
 * How many days a zone's `estimatedDeliveryTime` rule means.
 *
 * The rule is free text that admins edit ("30-45 min", "2-3 days", "same
 * day"), so it is parsed leniently: the largest day figure wins, and a rule
 * expressed in minutes/hours means "today".
 *
 * @param {string|null} rule e.g. "2-3 days"
 * @returns {number} whole days (0 = same day)
 */
export function parseDeliveryDays(rule) {
  if (rule === null || rule === undefined) return null;
  const text = String(rule).trim().toLowerCase();
  if (!text) return null;

  // "same day" / "today" → today.
  if (/\b(same[\s-]?day|today|express|within\s+hours?)\b/.test(text)) return 0;

  const dayMatches = [...text.matchAll(/(\d+)\s*(?:-|to)?\s*(\d+)?\s*day/gi)];
  if (dayMatches.length) {
    const highest = dayMatches.reduce((max, match) => {
      const first = Number(match[1]) || 0;
      const second = match[2] === undefined ? first : Number(match[2]) || first;
      return Math.max(max, first, second);
    }, 0);
    return highest;
  }

  const hourMatches = [...text.matchAll(/(\d+)\s*(?:-|to)?\s*(\d+)?\s*hour/gi)];
  if (hourMatches.length) return 0;

  const minuteMatches = [...text.matchAll(/(\d+)\s*(?:-|to)?\s*(\d+)?\s*min/gi)];
  if (minuteMatches.length) return 0;

  return null;
}

/**
 * The date a delivery is expected to arrive, from the zone's rule.
 *
 * @param {string|null} rule the zone's `estimatedDeliveryTime`
 * @param {Date} [from] reference date (defaults to now)
 * @returns {Date|null} null when the zone has no usable rule — the caller then
 *   shows "Delivery time confirmed at checkout" instead of a made-up date.
 */
export function estimatedDeliveryDate(rule, from = new Date()) {
  const days = parseDeliveryDays(rule);
  if (days === null) return null;
  const date = new Date(from);
  date.setDate(date.getDate() + days);
  return date;
}

/** "Fri, Oct 24" — the format the storefront shows for an ETA. */
export function formatDeliveryDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * A human ETA line for the cart and the checkout.
 *
 * @param {string|null} rule the zone's `estimatedDeliveryTime`
 * @returns {{text: string, date: Date|null, days: number|null}}
 */
export function deliveryEta(rule) {
  const days = parseDeliveryDays(rule);
  const date = estimatedDeliveryDate(rule);
  if (date === null) {
    return {
      text: 'Delivery time confirmed at checkout',
      date: null,
      days: null,
    };
  }
  if (days === 0) {
    return { text: 'Delivery today', date, days };
  }
  const label = days === 1 ? '1 day' : `${days} days`;
  return { text: `Delivery in about ${label} — ${formatDeliveryDate(date)}`, date, days };
}

/**
 * Group a cart by shop and total the quantity of each — the unit the
 * Delivery Service prices a shipment in.
 *
 * @param {Array} cart
 * @returns {Map<string, number>} shopId → quantity
 */
export function cartQuantityByShop(cart) {
  const groups = new Map();
  for (const item of cart || []) {
    const shopId = String(item.shopId || item.shop?._id || 'unknown');
    const quantity = Number(item.quantity ?? item.qty ?? 1) || 1;
    groups.set(shopId, (groups.get(shopId) || 0) + quantity);
  }
  return groups;
}

/** A stable signature of the quantities, so a re-render does not re-quote. */
export function quantitySignature(groups) {
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([shopId, quantity]) => `${shopId}:${quantity}`)
    .join('|');
}

/**
 * Quote the delivery fee for every shop in the cart.
 *
 * Each shop is a separate shipment, so each is priced on its own quantity —
 * the same rule the Delivery Service applies server-side.
 *
 * @param {object} params
 * @param {Array} params.cart
 * @param {string} [params.zoneId]
 * @param {string} [params.locationId] the address's sector/location
 * @returns {Promise<{quotes: Record<string, number>, total: number, error: string,
 *   zone: object|null, eta: object}>}
 */
export async function quoteCartDelivery({ cart, zoneId, locationId } = {}) {
  const groups = cartQuantityByShop(cart);
  if (!groups.size || !zoneId) {
    return { quotes: {}, total: 0, error: '', zone: null, eta: deliveryEta(null) };
  }

  const entries = await Promise.all(
    [...groups.entries()].map(async ([shopId, quantity]) => {
      const quote = await locationService.quoteDeliveryFee(zoneId, quantity, locationId);
      return [shopId, money2(quote?.fee), quote];
    })
  );

  const quotes = Object.fromEntries(entries.map(([shopId, fee]) => [shopId, fee]));
  const total = money2(Object.values(quotes).reduce((sum, fee) => sum + Number(fee || 0), 0));

  // Every quote is for the same zone, so they all carry the same delivery-time
  // rule — take it from the first one. The ETA and the price therefore come
  // from the SAME server answer.
  const firstQuote = entries.length ? entries[0][2] : null;

  return {
    quotes,
    total,
    error: '',
    zone: firstQuote
      ? {
        zoneId: firstQuote.zoneId || null,
        estimatedDeliveryTime: firstQuote.estimatedDeliveryTime || null,
        codAvailable: firstQuote.codAvailable !== false,
        pickupAvailable: Boolean(firstQuote.pickupAvailable),
      }
      : null,
    eta: deliveryEta(firstQuote?.estimatedDeliveryTime || null),
  };
}

export default {
  money2,
  parseDeliveryDays,
  estimatedDeliveryDate,
  formatDeliveryDate,
  deliveryEta,
  cartQuantityByShop,
  quantitySignature,
  quoteCartDelivery,
};
