import api from '@/services/api';
import { tokenStore } from '@/services/tokenStore';
import { createPkcePair, discardPkce } from '@/services/pkce';

/**
 * Authentication Service — OAuth 2.1 Authorization Code Flow + PKCE (S256).
 *
 * Flow implemented here:
 *   1. client generates code_verifier / code_challenge (S256)
 *   2. POST /auth/authorize (login) or /auth/register (sign-up) with the
 *      challenge → the server returns a one-time authorization code
 *   3. POST /auth/token with grant_type=authorization_code + the verifier
 *      → short-lived access token, id token, rotating refresh token
 * No tokens are ever returned by a credential endpoint, and no cookies are used.
 */

const CLIENT_ID = 'aritii-eshop';

async function exchangeCodeForTokens(code, codeVerifier) {
  const { data } = await api.post('/auth/token', {
    grant_type: 'authorization_code',
    code,
    code_verifier: codeVerifier,
    client_id: CLIENT_ID,
  });
  const result = data.data || data;
  if (!result.access_token) {
    throw new Error('Token exchange failed');
  }
  tokenStore.setTokens({
    access_token: result.access_token,
    refresh_token: result.refresh_token,
    id_token: result.id_token,
  });
  return result;
}

export const authService = {
  /**
   * Register a new customer, then complete the PKCE code exchange.
   * @param {Object|FormData} userData - registration payload (may include avatar)
   */
  async register(userData) {
    const pkce = await createPkcePair();
    let payload;
    if (typeof FormData !== 'undefined' && userData instanceof FormData) {
      payload = userData;
      payload.append('code_challenge', pkce.codeChallenge);
      payload.append('code_challenge_method', pkce.codeChallengeMethod);
      payload.append('client_id', CLIENT_ID);
      payload.append('state', pkce.state);
    } else {
      payload = {
        ...userData,
        code_challenge: pkce.codeChallenge,
        code_challenge_method: pkce.codeChallengeMethod,
        client_id: CLIENT_ID,
        state: pkce.state,
      };
    }

    const { data } = await api.post('/auth/register', payload);
    const issued = data.data || data;
    if (!issued.code) throw new Error('Authorization code not issued');

    const tokens = await exchangeCodeForTokens(issued.code, pkce.codeVerifier);
    discardPkce(pkce);
    if (issued.user) tokenStore.setUser(issued.user);
    return { ...tokens, user: issued.user };
  },

  /**
   * Log in with email + password through the authorization endpoint.
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    const pkce = await createPkcePair();
    const { data } = await api.post('/auth/authorize', {
      email,
      password,
      code_challenge: pkce.codeChallenge,
      code_challenge_method: pkce.codeChallengeMethod,
      client_id: CLIENT_ID,
      state: pkce.state,
    });
    const issued = data.data || data;
    if (!issued.code) throw new Error('Authorization code not issued');

    const tokens = await exchangeCodeForTokens(issued.code, pkce.codeVerifier);
    discardPkce(pkce);
    // Populate the user profile from the freshly issued access token.
    try {
      await this.getCurrentUser();
    } catch (err) {
      /* profile fetch is best-effort; tokens are already stored */
    }
    return tokens;
  },

  async getCurrentUser() {
    const { data } = await api.get('/user/getuser');
    const user = (data.data || data).user || data.user;
    if (user) tokenStore.setUser(user);
    return user || null;
  },

  async logout() {
    const refreshToken = tokenStore.getRefreshToken();
    try {
      // RFC 7009 revocation — server-side session teardown.
      const { data } = await api.post('/auth/revoke', { token: refreshToken });
      return data;
    } finally {
      tokenStore.clear();
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('aritii.business.selectedShopId');
      }
    }
  },

  async updateProfile(userData) {
    const { data } = await api.put('/user/update-user-info', userData);
    return (data.data || data).user || data.user || null;
  },

  async changePassword({ oldPassword, newPassword, confirmPassword }) {
    const { data } = await api.put('/user/update-user-password', {
      oldPassword,
      newPassword,
      confirmPassword,
    });
    return data;
  },

  async updateAvatar(formData) {
    const { data } = await api.put('/user/update-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return (data.data || data).user || data.user || null;
  },
};

export default authService;
