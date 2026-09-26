/**
 * Formatting helpers shared by every domain. Pure functions only — no React,
 * no store access, so they are safe to reuse in services and tests.
 */

/** Format a number as Aritii currency (ETB). */
export function formatCurrency(value, { currency = 'ETB', fallback = '—' } = {}) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return fallback;
  return `${currency} ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/** Format an ISO date string for display (e.g. "12 Mar 2026"). */
export function formatDate(value, fallback = '—') {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Format an ISO date string as date + time. */
export function formatDateTime(value, fallback = '—') {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return `${formatDate(value)} · ${date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

/** Shorten long ids for display in tables. */
export function shortId(id, length = 8) {
  if (!id) return '—';
  const value = String(id);
  return value.length <= length ? value : `#${value.slice(-length)}`;
}

/** Derive initials from a person or shop name. */
export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}
