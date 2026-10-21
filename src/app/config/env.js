/**
 * Environment configuration — the ONLY place that reads `import.meta.env`.
 * Never hard-code API URLs or secrets anywhere else in the app.
 *
 * The configured value is validated before use. A malformed or host-less value
 * (`:8000/api`, `//localhost:8000/api`, a bare path) previously reached axios
 * verbatim and the browser failed every request with
 * `net::ERR_NAME_NOT_RESOLVED :8000/api/…` — a silent outage that looks like a
 * backend problem. Falls back, in order: the configured URL, the current origin
 * (the API is served under the same host in every deployed environment), then
 * the local development gateway.
 */
const DEFAULT_API_URL = 'http://localhost:3000/api';

function normalizeApiUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  // A path-only value (or one that only carries a port) is not a usable origin.
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(raw)) return '';
  try {
    const parsed = new URL(raw);
    if (!parsed.hostname) return '';
    return `${parsed.origin}${parsed.pathname}`.replace(/\/+$/, '');
  } catch (_err) {
    return '';
  }
}

function sameOriginApiUrl() {
  if (typeof window === 'undefined' || !window.location?.origin) return '';
  return `${window.location.origin}/api`;
}

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL)
  || sameOriginApiUrl()
  || DEFAULT_API_URL;

export const ENV = Object.freeze({
  /** Gateway base URL, always without a trailing slash. */
  API_URL,
  APP_NAME: 'aritii market',
  IS_DEV: Boolean(import.meta.env.DEV),
  IS_PROD: Boolean(import.meta.env.PROD),
  MODE: import.meta.env.MODE,
});

export default ENV;