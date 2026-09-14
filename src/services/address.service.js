import api from "./api";

/**
 * Address Service
 * Manages buyer's saved delivery addresses
 */

export const addressService = {
  /**
   * Get all saved addresses for current user
   * @returns {Promise} - Array of address objects
   */
  async getAll() {
    const { data } = await api.get("/address/list");
    return data.addresses || [];
  },

  /**
   * Add a new delivery address
   * @param {Object} addressData - { address1, address2, city, country, zipCode, addressType }
   * @returns {Promise} - Created address object
   */
  async add(addressData) {
    const { data } = await api.post("/address/add", addressData);
    return data.address || null;
  },

  /**
   * Delete a saved address
   * @param {string} addressId - Address ID to delete
   * @returns {Promise}
   */
  async delete(addressId) {
    const { data } = await api.delete(`/address/${addressId}`);
    return data;
  },
};

export default addressService;
