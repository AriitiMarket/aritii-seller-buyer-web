/**
 * Environment configuration — the ONLY place that reads `import.meta.env`.
 * Never hard-code API URLs or secrets anywhere else in the app.
 */
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const ENV = Object.freeze({
  /** Gateway base URL, always without a trailing slash. */
  API_URL: rawApiUrl.replace(/\/+$/, ''),
  APP_NAME: 'aritii market',
  IS_DEV: Boolean(import.meta.env.DEV),
  IS_PROD: Boolean(import.meta.env.PROD),
  MODE: import.meta.env.MODE,
});

export default ENV;