import api from '@/services/api';

/**
 * Two-Factor Authentication Service
 * Endpoints for managing and setting up 2FA
 */
export const twoFactorService = {
  /**
   * Get current 2FA status for the authenticated user
   */
  async getStatus() {
    const { data } = await api.get('/user/2fa/status');
    return data.data || data;
  },

  /**
   * Initiate 2FA setup
   * @param {Object} params
   * @param {'TOTP' | 'EMAIL' | 'SMS'} params.method
   * @param {string} [params.phoneNumber]
   * @param {string} [params.email]
   */
  async setup({ method = 'TOTP', phoneNumber, email }) {
    const { data } = await api.post('/user/2fa/setup', {
      method,
      phoneNumber: phoneNumber || undefined,
      email: email || undefined,
    });
    return data.data || data;
  },

  /**
   * Verify setup code and enable 2FA
   * @param {Object} params
   * @param {string} params.code
   * @param {'TOTP' | 'EMAIL' | 'SMS'} [params.method]
   * @param {string} [params.phoneNumber]
   */
  async verifySetup({ code, method, phoneNumber }) {
    const { data } = await api.post('/user/2fa/verify-setup', {
      code: String(code).trim(),
      method,
      phoneNumber: phoneNumber || undefined,
    });
    return data.data || data;
  },

  /**
   * Disable 2FA with user's password
   * @param {string} password
   */
  async disable(password) {
    const { data } = await api.post('/user/2fa/disable', { password });
    return data.data || data;
  },

  /**
   * Regenerate 10 emergency backup codes
   */
  async regenerateBackupCodes() {
    const { data } = await api.post('/user/2fa/backup-codes/regenerate', {});
    return data.data || data;
  },
};

export default twoFactorService;
