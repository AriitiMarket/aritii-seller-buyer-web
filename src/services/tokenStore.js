// Access tokens stay in memory. Session storage retains the rotating refresh
// token across a page reload without sharing it between browser tabs.
const STORAGE_KEY = 'aritii.auth';
let _accessToken = null;
let _refreshToken = null;
let _idToken = null;
let _user = null;
let _refreshPromise = null;
// The role the visitor signed in AS (BUYER / SELLER / PROVIDER). Persisted with
// the refresh token so a page reload still lands a pending seller/provider back
// on their application screen instead of the buyer dashboard.
let _loginRole = null;

function readStoredTokens() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function persistRefreshToken() {
  try {
    if (_refreshToken) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        refresh_token: _refreshToken,
        login_role: _loginRole || null,
      }));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage may be unavailable in privacy-restricted browsers.
  }
}

const storedTokens = typeof window !== 'undefined' ? readStoredTokens() : {};
_refreshToken = storedTokens.refresh_token || null;
_loginRole = storedTokens.login_role || null;

export const tokenStore = {
  getAccessToken() { return _accessToken; },
  getRefreshToken() { return _refreshToken; },
  getIdToken() { return _idToken; },
  getUser() { return _user; },
  getLoginRole() { return _loginRole; },

  setTokens({ access_token, refresh_token, id_token }) {
    if (access_token) _accessToken = access_token;
    if (refresh_token) _refreshToken = refresh_token;
    if (id_token) _idToken = id_token;
    persistRefreshToken();
  },

  setUser(user) { _user = user; },

  /** Remember which role this session signed in as. */
  setLoginRole(role) {
    _loginRole = role ? String(role).toUpperCase() : null;
    persistRefreshToken();
  },

  clear() {
    _accessToken = null;
    _refreshToken = null;
    _idToken = null;
    _user = null;
    _loginRole = null;
    persistRefreshToken();
  },

  isAuthenticated() { return !!_accessToken; },
};

// Token refresh logic — deduplicates concurrent refresh attempts.
let _onRefreshFail = null;

export function setOnRefreshFail(fn) { _onRefreshFail = fn; }

export async function refreshAccessToken() {
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      // OAuth 2.1 refresh: rotated at the token endpoint with the
      // refresh_token grant. Returns a NEW refresh token (rotation) — the
      // previous one is invalidated server-side.
      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: _refreshToken,
          client_id: 'aritii-eshop',
        }),
      });

      if (!response.ok) {
        throw new Error('Refresh failed');
      }

      const data = await response.json();
      tokenStore.setTokens({
        access_token: data.data?.access_token || data.access_token,
        refresh_token: data.data?.refresh_token || data.refresh_token,
        id_token: data.data?.id_token || data.id_token,
      });
      return tokenStore.getAccessToken();
    } catch (err) {
      tokenStore.clear();
      if (_onRefreshFail) _onRefreshFail();
      throw err;
    } finally {
      _refreshPromise = null;
    }
  })();

  return _refreshPromise;
}
