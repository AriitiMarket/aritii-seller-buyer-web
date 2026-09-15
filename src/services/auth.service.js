import api from "./api";
import { tokenStore } from "./tokenStore";

/**
 * Authentication Service — OAuth 2.1 + OIDC.
 * All tokens stored in memory via tokenStore. No cookies.
 */
export const authService = {
  async register(userData) {
    const { data } = await api.post("/user/create-user", userData);
    const result = data.data || data;
    // Store tokens from response.
    if (result.access_token) {
      tokenStore.setTokens({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        id_token: result.id_token,
      });
    }
    if (result.user) tokenStore.setUser(result.user);
    return result;
  },

  async login(email, password) {
    const { data } = await api.post("/user/login-user", { email, password });
    const result = data.data || data;
    if (result.access_token) {
      tokenStore.setTokens({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        id_token: result.id_token,
      });
    }
    if (result.user) tokenStore.setUser(result.user);
    return result;
  },

  async getCurrentUser() {
    const { data } = await api.get("/user/getuser");
    const user = (data.data || data).user || data.user;
    if (user) tokenStore.setUser(user);
    return user || null;
  },

  async logout() {
    const refreshToken = tokenStore.getRefreshToken();
    try {
      const { data } = await api.post("/user/logout", { refresh_token: refreshToken });
      return data;
    } finally {
      tokenStore.clear();
    }
  },

  async updateProfile(userData) {
    const { data } = await api.put("/user/update-user-info", userData);
    return (data.data || data).user || data.user || null;
  },

  async updateAvatar(formData) {
    const { data } = await api.put("/user/update-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return (data.data || data).user || data.user || null;
  },
};

export default authService;
