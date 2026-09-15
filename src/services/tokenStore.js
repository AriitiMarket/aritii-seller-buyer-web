// Token store — in-memory token management. No cookies, no localStorage.
// Access token: in memory only (never persisted).
// Refresh token: managed by the client, sent in request body (never in cookies).
let _accessToken = null;
let _refreshToken = null;
let _idToken = null;
let _user = null;
let _refreshPromise = null;

export const tokenStore = {
  getAccessToken() { return _accessToken; },
  getRefreshToken() { return _refreshToken; },
  getIdToken() { return _idToken; },
  getUser() { return _user; },

  setTokens({ access_token, refresh_token, id_token }) {
    if (access_token) _accessToken = access_token;
    if (refresh_token) _refreshToken = refresh_token;
    if (id_token) _idToken = id_token;
  },

  setUser(user) { _user = user; },

  clear() {
    _accessToken = null;
    _refreshToken = null;
    _idToken = null;
    _user = null;
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
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: _refreshToken }),
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
