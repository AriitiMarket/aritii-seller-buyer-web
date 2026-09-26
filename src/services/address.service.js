import api from "@/services/api";

/**
 * Address Service
 * Manages buyer's saved delivery addresses.
 *
 * Contract (Identity Service, REST):
 *   GET    /address          -> { addresses: [...] }
 *   POST   /address          -> { user }   (address appended to user.addresses)
 *   PUT    /address/:id      -> { user }   (address updated in user.addresses)
 *   DELETE /address/:id      -> { user }
 */

function newestAddress(payload) {
  // The API returns the updated user; the newly created address carries a
  // generated _id and is appended last.
  const addresses = (payload && payload.user && payload.user.addresses) || [];
  return Array.isArray(addresses) && addresses.length ? addresses[addresses.length - 1] : null;
}

function updatedAddress(payload) {
  const addresses = (payload && payload.user && payload.user.addresses) || [];
  return Array.isArray(addresses) ? addresses : [];
}

export const addressService = {
  /**
   * Get all saved addresses for current user
   * @returns {Promise} - Array of address objects
   */
  async getAll() {
    const { data } = await api.get("/address");
    return data.addresses || [];
  },

  /**
   * Add a new delivery address
   * @param {Object} addressData - { address1, address2, city, country, zipCode, addressType }
   * @returns {Promise} - Created address object
   */
  async add(addressData) {
    const { data } = await api.post("/address", addressData);
    return newestAddress(data);
  },

  /**
   * Update an existing delivery address
   * @param {string} addressId - Address ID to update
   * @param {Object} addressData - Updated address fields
   * @returns {Promise} - Updated address object
   */
  async update(addressId, addressData) {
    const { data } = await api.put(`/address/${addressId}`, addressData);
    return updatedAddress(data);
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
