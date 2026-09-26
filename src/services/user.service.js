import api from '@/services/api';

/**
 * User Service — public profile lookups.
 *
 * Used by the Product Request workspaces to show the counterparty's public
 * profile (display name, avatar, member since) before/while negotiating.
 * Only public profile fields are ever rendered; nothing private is requested.
 */
export const userService = {
  /**
   * Public profile of a platform user (buyer or seller).
   * @param {string} userId — identity user id
   * @returns {Promise<object|null>}
   */
  async getPublicProfile(userId) {
    if (!userId) return null;
    try {
      const { data } = await api.get(`/user/user-info/${userId}`);
      return data?.user || null;
    } catch {
      return null;
    }
  },
};

export default userService;
