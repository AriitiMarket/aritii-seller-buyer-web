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

/**
 * Extract the most recently created address from user payload.
 * The backend appends the newly created address with a generated _id at the end of user.addresses.
 * @param {object} payload - Identity service response payload
 * @returns {object|null} The latest address object or null if unavailable
 */
function newestAddress(payload) {
  const addresses = (payload && payload.user && payload.user.addresses) || [];
  return Array.isArray(addresses) && addresses.length ? addresses[addresses.length - 1] : null;
}

/**
 * Extract the full updated list of addresses from user payload.
 * @param {object} payload - Identity service response payload
 * @returns {Array<object>} List of user addresses
 */
function updatedAddress(payload) {
  const addresses = (payload && payload.user && payload.user.addresses) || [];
  return Array.isArray(addresses) ? addresses : [];
}

export const addressService = {
  /**
   * Get all saved delivery addresses for the currently authenticated buyer.
   * Backend: GET /address
   * @returns {Promise<Array<object>>} List of saved address objects
   */
  async getAll() {
    const { data } = await api.get("/address");
    return data.addresses || [];
  },

  /**
   * Add a new delivery address to the user's profile.
   * Backend: POST /address
   * @param {Object} addressData - Address fields { address1, address2, city, country, zipCode, addressType, isDefault }
   * @returns {Promise<object|null>} The newly created address object with server-assigned ID
   */
  async add(addressData) {
    const { data } = await api.post("/address", addressData);
    return newestAddress(data);
  },

  /**
   * Update an existing delivery address in the user's profile.
   * Backend: PUT /address/:addressId
   * @param {string} addressId - Unique address ID to update
   * @param {Object} addressData - Modified address fields
   * @returns {Promise<Array<object>>} Updated array of user addresses
   */
  async update(addressId, addressData) {
    const { data } = await api.put(`/address/${addressId}`, addressData);
    return updatedAddress(data);
  },

  /**
   * Delete a saved delivery address from the user's profile.
   * Backend: DELETE /address/:addressId
   * @param {string} addressId - Unique address ID to remove
   * @returns {Promise<object>} API deletion response
   */
  async delete(addressId) {
    const { data } = await api.delete(`/address/${addressId}`);
    return data;
  },
};

export default addressService;
