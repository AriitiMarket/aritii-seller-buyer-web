import api from '@/services/api';
import { deliveryService } from '@/services/delivery.service';

/**
 * API service for delivery provider operations.
 * 
 * This service wraps the existing delivery service APIs for provider-specific operations.
 * It uses the real backend delivery service endpoints documented in delivery.service.js
 */

export const providerDeliveryApi = {
  /**
   * Get available assignments for the provider
   * Uses the real delivery service assignment endpoint
   */
  getAvailableWork: async (params = {}) => {
    try {
      const result = await deliveryService.getAssignments({
        status: 'pending',
        ...params,
      });
      return {
        assignments: result.assignments,
        count: result.count,
        supported: result.supported,
      };
    } catch (error) {
      console.error('Failed to fetch available work:', error);
      return { assignments: [], count: 0, supported: false };
    }
  },

  /**
   * Accept or reject an assignment
   * Uses the real delivery service respond endpoint
   */
  respondToAssignment: async (assignmentId, accepted, reason = '') => {
    try {
      const assignment = await deliveryService.respondToAssignment(assignmentId, accepted, reason);
      return { assignment, success: true };
    } catch (error) {
      console.error('Failed to respond to assignment:', error);
      return { assignment: null, success: false, error };
    }
  },

  /**
   * Get provider's deliveries (shipments)
   * Uses the real delivery service delivery endpoint
   */
  getProviderDeliveries: async (params = {}) => {
    try {
      const result = await deliveryService.getDeliveries(params);
      return {
        deliveries: result.deliveries,
        count: result.count,
        total: result.total,
        totalPages: result.totalPages,
        supported: result.supported,
      };
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
      return { deliveries: [], count: 0, total: 0, totalPages: 0, supported: false };
    }
  },

  /**
   * Get delivery details
   * Uses the real delivery service delivery endpoint
   */
  getDeliveryDetails: async (deliveryId) => {
    try {
      const delivery = await deliveryService.getDelivery(deliveryId);
      return { delivery, success: true };
    } catch (error) {
      console.error('Failed to fetch delivery details:', error);
      return { delivery: null, success: false, error };
    }
  },

  /**
   * Update a rider's delivery through the grouped dispatch lifecycle.
   */
  updateDeliveryStatus: async (deliveryId, status, data = {}) => {
    try {
      const delivery = await deliveryService.getDelivery(deliveryId);
      if (!delivery?.assignmentId) throw new Error('Delivery is not linked to a rider assignment');
      const batchId = delivery.assignmentId;
      if (status === 'pickup') {
        const batch = await deliveryService.getMyDispatchBatch(batchId);
        if (batch?.status === 'accepted') await deliveryService.startDispatchPickup(batchId);
        await deliveryService.confirmDispatchPickup(batchId, delivery.sellerId);
      } else if (status === 'in_transit') {
        await deliveryService.startDispatchTransit(batchId);
      } else if (status === 'delivered') {
        if (delivery.paymentMethod === 'COD' && data.proofOfDelivery?.codConfirmed !== true) {
          return { success: false, message: 'Confirm the COD amount before marking this delivery complete' };
        }
        await deliveryService.confirmDispatchDelivery(batchId, delivery.orderId, data);
      } else {
        throw new Error(`Status ${status} is not available through the rider workflow`);
      }
      return { success: true };
    } catch (error) {
      console.error('Failed to update delivery status:', error);
      return { success: false, error };
    }
  },

  /**
   * Get the rider's real grouped dispatch assignments.
   */
  getProviderBatches: async (params = {}) => {
    try {
      const result = await deliveryService.getMyDispatchBatches(params);
      const batches = (result.assignments || []).map((batch) => ({
        ...batch,
        id: batch._id,
        originalStatus: batch.status,
        status: ({ waiting_acceptance: 'AVAILABLE', accepted: 'ASSIGNED', picking_up: 'IN_PROGRESS', picked_up: 'IN_PROGRESS', in_transit: 'IN_PROGRESS', completed: 'COMPLETED', cancelled: 'CANCELLED' })[batch.status] || batch.status,
        count: (batch.deliveries || []).length,
        assignments: (batch.deliveries || []).map((item) => ({
          ...item,
          _id: item.deliveryId,
          pickupAddress: item.origin,
          dropoffAddress: item.destination,
        })),
      }));
      return { batches, count: result.total ?? batches.length, supported: true };
    } catch (error) {
      console.error('Failed to fetch batches:', error);
      if ([404, 501].includes(error?.response?.status)) return { batches: [], count: 0, supported: false };
      throw error;
    }
  },

  /**
   * Get batch details
   */
  getBatchDetails: async (batchId) => {
    try {
      const result = await deliveryService.getMyDispatchBatch(batchId);
      if (!result) return { batch: null, success: false };
      return {
        batch: {
          ...result,
          id: result._id,
          originalStatus: result.status,
          count: (result.deliveries || []).length,
          assignments: (result.deliveries || []).map((item) => ({
            ...item,
            _id: item.deliveryId,
            pickupAddress: item.origin,
            dropoffAddress: item.destination,
          })),
        },
        success: true,
      };
    } catch (error) {
      console.error('Failed to fetch batch details:', error);
      return { batch: null, success: false, error };
    }
  },

  /**
   * Accept a batch (multiple assignments)
   */
  acceptBatch: async (batchId) => {
    try {
      await deliveryService.respondToDispatchBatch(batchId, true);
      return { success: true };
    } catch (error) {
      console.error('Failed to accept batch:', error);
      return { success: false, error };
    }
  },

  /**
   * Update provider availability status
   * Uses the real delivery service provider online endpoint
   */
  updateAvailability: async (providerId, online) => {
    try {
      const provider = await deliveryService.setOnline(providerId, online);
      return { provider, success: true };
    } catch (error) {
      console.error('Failed to update availability:', error);
      return { provider: null, success: false, error };
    }
  },

  /**
   * Get provider warnings/notifications
   * This is a placeholder - actual warnings depend on backend implementation
   */
  getProviderWarnings: async () => {
    try {
      // For now, return empty array
      return { warnings: [], count: 0, supported: false };
    } catch (error) {
      console.error('Failed to fetch warnings:', error);
      return { warnings: [], count: 0, supported: false };
    }
  },

  /**
   * Mark warning as read
   */
  markWarningRead: async (warningId) => {
    try {
      // Placeholder
      return { success: true };
    } catch (error) {
      console.error('Failed to mark warning as read:', error);
      return { success: false, error };
    }
  },

  /**
   * Get provider profile
   * This is a placeholder - actual profile depends on backend implementation
   */
  getProviderProfile: async () => {
    try {
      // For now, return empty profile
      return { profile: null, supported: false };
    } catch (error) {
      console.error('Failed to fetch provider profile:', error);
      return { profile: null, supported: false, error };
    }
  },

  /**
   * Update provider profile
   */
  updateProviderProfile: async (profileData) => {
    try {
      // Placeholder
      return { success: false, message: 'Profile update not yet implemented' };
    } catch (error) {
      console.error('Failed to update provider profile:', error);
      return { success: false, error };
    }
  },

  /**
   * Upload proof of delivery
   * This is a placeholder - actual proof upload depends on backend implementation
   */
  uploadProofOfDelivery: async (deliveryId, file) => {
    try {
      // Placeholder
      return { success: false, message: 'Proof upload not yet implemented' };
    } catch (error) {
      console.error('Failed to upload proof:', error);
      return { success: false, error };
    }
  },

  /**
   * Confirm COD collection through the batch delivery proof workflow.
   */
  confirmCodCollection: async (deliveryId, amount) => {
    try {
      const delivery = await deliveryService.getDelivery(deliveryId);
      if (!delivery?.assignmentId) throw new Error('Delivery is not linked to an active assignment');
      if (Number(amount) !== Number(delivery.paymentAmount)) {
        return { success: false, message: 'Collected amount must equal the order total' };
      }
      await deliveryService.confirmDispatchDelivery(delivery.assignmentId, delivery.orderId, {
        proofOfDelivery: { codConfirmed: true, codCollectedAmount: Number(amount), confirmedAt: new Date().toISOString() },
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to confirm COD:', error);
      return { success: false, error };
    }
  },

  /**
   * Get tracking for a delivery
   * Uses the real delivery service tracking endpoint
   */
  getDeliveryTracking: async (deliveryId) => {
    try {
      const result = await deliveryService.getTracking(deliveryId);
      return { events: result.events, supported: result.supported };
    } catch (error) {
      console.error('Failed to fetch tracking:', error);
      return { events: [], supported: false };
    }
  },

  /**
   * Get latest location for a delivery
   * Uses the real delivery service tracking endpoint
   */
  getLatestLocation: async (deliveryId) => {
    try {
      const location = await deliveryService.getLatestLocation(deliveryId);
      return { location, success: true };
    } catch (error) {
      console.error('Failed to fetch latest location:', error);
      return { location: null, success: false, error };
    }
  },
};

export default providerDeliveryApi;
