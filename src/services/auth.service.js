import api from "./api";

/**
 * Authentication Service
 * Handles user registration, login, logout, and profile management
 * All requests go through the API Gateway to Identity Service
 */

export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { name, email, password, phoneNumber, role }
   * @returns {Promise} - User object and JWT token
   */
  async register(userData) {
    const { data } = await api.post("/user/create-user", userData);
    return data;
  },

  /**
   * Login user with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise} - User object and JWT token
   */
  async login(email, password) {
    const { data } = await api.post("/user/login-user", {
      email,
      password,
    });
    return data;
  },

  /**
   * Get current authenticated user's profile
   * @returns {Promise} - User profile object
   */
  async getCurrentUser() {
    const { data } = await api.get("/user/getuser");
    return data.user || null;
  },

  /**
   * Logout current user
   * @returns {Promise}
   */
  async logout() {
    const { data } = await api.post("/user/logout");
    return data;
  },

  /**
   * Update user profile information
   * @param {Object} userData - { name, email, phoneNumber, password }
   * @returns {Promise} - Updated user object
   */
  async updateProfile(userData) {
    const { data } = await api.put("/user/update-user-info", userData);
    return data.user || null;
  },

  /**
   * Upload or update user avatar
   * @param {FormData} formData - FormData with 'image' field
   * @returns {Promise} - Updated user object with new avatar URL
   */
  async updateAvatar(formData) {
    const { data } = await api.put("/user/update-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.user || null;
  },
};

export default authService;
