import api from '@/services/api';
import { deliveryService } from '@/services/delivery.service';

/**
 * API service for delivery provider operations.
 *
 * This service wraps the existing delivery service APIs for provider-specific operations.
 * It uses the real backend delivery service endpoints documented in delivery.service.js
 */

/**
 * The Delivery document keeps the parties under `origin` / `destination` and
 * expresses proof as `proofRules` / `proofOfDelivery`; the rider screens read
 * flat fields (`sellerName`, `buyerPhone`, `proofRequired`, ...). Derive them
 * here, once, so every rider screen agrees — and expose the dispatch batch
 * that holds the delivery (`assignmentId`) which the status workflow needs.
 */
const hydrateRiderDelivery = (delivery) => {
  if (!delivery) return delivery;
  return {
    ...delivery,
    estimatedEarnings: delivery.estimatedEarnings ?? delivery.delivererEarning,
    pickupAddress: delivery.pickupAddress || delivery.origin || null,
    deliveryAddress: delivery.deliveryAddress || delivery.destination || null,
    sellerName: delivery.sellerName || delivery.origin?.shopName || '',
    sellerPhone: delivery.sellerPhone || delivery.origin?.contactPhone || '',
    buyerName: delivery.buyerName || delivery.destination?.contactName || '',
    buyerPhone: delivery.buyerPhone || delivery.destination?.contactPhone || '',
    deliveryInstructions:
      delivery.deliveryInstructions ||
      delivery.destination?.additionalInstructions ||
      '',
    proofRequired:
      delivery.proofRequired ??
      Boolean(
        delivery.proofRules?.requireCodConfirmation ||
        delivery.proofRules?.requireConfirmation ||
        delivery.proofRules?.requirePhoto ||
        delivery.proofRules?.requireSignature
      ),
    proofSubmitted: delivery.proofSubmitted ?? Boolean(delivery.proofOfDelivery),
    batchId: delivery.batchId || delivery.assignmentId || null,
  };
};

/**
 * Shape one dispatch batch (`GET /delivery/dispatch/mine`) for the screens:
 * the raw batch status (`waiting_acceptance`, `picking_up`, ...) maps onto the
 * display vocabulary — including `rejected`, which the service can answer with
 * — and each held delivery gets the same derived party names the individual
 * delivery cards show.
 */
const BATCH_DISPLAY_STATUS = {
  waiting_acceptance: 'AVAILABLE',
  accepted: 'ASSIGNED',
  picking_up: 'IN_PROGRESS',
  picked_up: 'IN_PROGRESS',
  in_transit: 'IN_PROGRESS',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
  rejected: 'REJECTED',
};

const mapDispatchBatch = (batch) => ({
  ...batch,
  id: batch._id,
  originalStatus: batch.status,
  status: BATCH_DISPLAY_STATUS[batch.status] || batch.status,
  count: (batch.deliveries || []).length,
  assignments: (batch.deliveries || []).map((item) => ({
    ...item,
    _id: item.deliveryId,
    pickupAddress: item.origin,
    dropoffAddress: item.destination,
    sellerName: item.sellerName || item.origin?.shopName || '',
    buyerName: item.buyerName || item.destination?.contactName || '',
  })),
});

/**
 * The rider's own Provider document id.
 *
 * The delivery list is a shared endpoint: the platform scopes it by every role
 * the account holds, so an account that is a rider AND a buyer also sees the
 * parcels it bought. The rider screens want DELIVERY WORK only, so they pass
 * their own provider id as the lens — the service narrows the list with it
 * (a query parameter can only narrow a tenant's own view).
 */
let ownProviderId = null;
let ownProviderIdRequest = null;

const resolveOwnProviderId = async () => {
  if (ownProviderId) return ownProviderId;
  if (!ownProviderIdRequest) {
    ownProviderIdRequest = api
      .get('/delivery/provider/me')
      .then(({ data }) => {
        ownProviderId = data?.provider?._id || null;
        return ownProviderId;
      })
      .catch(() => null);
  }
  return ownProviderIdRequest;
};

export const providerDeliveryApi = {
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
      // LENSED TO THIS RIDER: only the deliveries this provider is actually
      // carrying. Without the lens the list also carries the parcels the same
      // account bought as a customer — work that has nothing to do with the
      // rider's round.
      const providerId = await resolveOwnProviderId();
      const result = await deliveryService.getDeliveries({
        ...params,
        ...(providerId ? { providerId } : {}),
      });
      return {
        deliveries: (result.deliveries || []).map(hydrateRiderDelivery),
        count: result.count,
        total: result.total,
        totalPages: result.totalPages,
        supported: result.supported,
      };
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
      return { deliveries: [], count: 0, total: 0, totalPages: 0, supported: false, error };
    }
  },

  /** Count the provider's full queue using server totals, not a display page. */
  getProviderDeliveryMetrics: async () => {
    try {
      const activeStatuses = ['assigned', 'reassigned', 'pickup', 'in_transit'];
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      // Same lens as the list: the metrics must count the rider's OWN work.
      const providerId = await resolveOwnProviderId();
      const lens = providerId ? { providerId } : {};
      const [active, completed] = await Promise.all([
        Promise.all(activeStatuses.map((status) => deliveryService.getDeliveries({ ...lens, status, limit: 1 }))),
        deliveryService.getDeliveries({
          ...lens,
          status: 'delivered',
          completedFrom: startOfDay.toISOString(),
          completedTo: now.toISOString(),
          limit: 1,
        }),
      ]);
      if ([...active, completed].some((result) => !result.supported)) {
        return { activeDeliveries: 0, completedToday: 0, supported: false };
      }
      return {
        activeDeliveries: active.reduce((sum, result) => sum + result.total, 0),
        completedToday: completed.total,
        supported: true,
      };
    } catch (error) {
      console.error('Failed to fetch provider delivery metrics:', error);
      return { activeDeliveries: 0, completedToday: 0, supported: false, error };
    }
  },

  getProviderCoverage: async () => {
    const { data } = await api.get('/delivery/provider/me/coverage');
    return data?.coverage || { zones: [], port: null, city: null };
  },

  /**
   * Get delivery details
   * Uses the real delivery service delivery endpoint
   */
  getDeliveryDetails: async (deliveryId) => {
    try {
      const delivery = hydrateRiderDelivery(await deliveryService.getDelivery(deliveryId));
      return { delivery, success: true };
    } catch (error) {
      console.error('Failed to fetch delivery details:', error);
      return { delivery: null, success: false, supported: error?.response?.status !== 501, error };
    }
  },

  /**
   * Update a rider's delivery.
   *
   * Two paths, one outcome:
   *   * a GROUPED dispatch assignment advances through the batch endpoints
   *     (pickup plan → transit → deliver);
   *   * a SINGLE assignment advances through the assignment's own advance
   *     route. Before that route existed a rider with one order could not
   *     pick it up, mark it in transit or complete it — the delivery sat in
   *     `assigned` until an admin closed it by hand.
   */
  updateDeliveryStatus: async (deliveryId, status, data = {}) => {
    try {
      const delivery = await deliveryService.getDelivery(deliveryId);
      if (!delivery?.assignmentId) throw new Error('Delivery is not linked to a rider assignment');

      // A batch assignment id is not a plain Assignment id, so the batch read
      // tells the two apart. It 404s (rather than throwing) for a single
      // assignment, which is exactly the branch we want.
      const batch = await deliveryService.getMyDispatchBatch(delivery.assignmentId);

      if (!batch) {
        // SINGLE assignment — advance it through the assignment route.
        if (status === 'delivered'
          && delivery.paymentMethod === 'COD'
          && data.proofOfDelivery?.codConfirmed !== true) {
          return { success: false, message: 'Confirm the COD amount before marking this delivery complete' };
        }
        await deliveryService.advanceAssignment(delivery.assignmentId, status, data);
        return { success: true };
      }

      const batchId = delivery.assignmentId;
      if (status === 'pickup') {
        if (batch.status === 'waiting_acceptance') {
          return { success: false, message: 'Accept the batch assignment before starting pickup.' };
        }
        if (batch.status === 'accepted') await deliveryService.startDispatchPickup(batchId);
        await deliveryService.confirmDispatchPickup(batchId, delivery.sellerId);
      } else if (status === 'in_transit') {
        const allStopsConfirmed = (batch.pickupPlan || []).every((stop) => stop.completed);
        if (!allStopsConfirmed) {
          return { success: false, message: 'Confirm every seller pickup before starting delivery.' };
        }
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
      const batches = (result.assignments || []).map(mapDispatchBatch);
      return { batches, count: result.total ?? batches.length, totalPages: result.totalPages ?? 1, supported: true };
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
      if (!result) return { batch: null, success: false, supported: true, error: new Error('Batch not found') };
      return { batch: mapDispatchBatch(result), success: true };
    } catch (error) {
      console.error('Failed to fetch batch details:', error);
      return { batch: null, success: false, supported: error?.response?.status !== 501, error };
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
   * RIDER ACTIONS on an assigned batch.
   *
   * These are the buttons in the batch detail screen (start pickup, confirm a
   * seller stop, start delivery, complete an order). They used to be missing here
   * and only existed on the lower-level service, so `runBatchAction('…')` threw
   * `providerDeliveryApi[action] is not a function` and the whole screen died on
   * the first click.
   */
  startDispatchPickup: async (batchId) => {
    try {
      const assignment = await deliveryService.startDispatchPickup(batchId);
      return { success: true, assignment };
    } catch (error) {
      console.error('Failed to start pickup:', error);
      return { success: false, error };
    }
  },

  confirmDispatchPickup: async (batchId, sellerId) => {
    try {
      const assignment = await deliveryService.confirmDispatchPickup(batchId, sellerId);
      return { success: true, assignment };
    } catch (error) {
      console.error('Failed to confirm pickup:', error);
      return { success: false, error };
    }
  },

  startDispatchTransit: async (batchId) => {
    try {
      const assignment = await deliveryService.startDispatchTransit(batchId);
      return { success: true, assignment };
    } catch (error) {
      console.error('Failed to start delivery:', error);
      return { success: false, error };
    }
  },

  confirmDispatchDelivery: async (batchId, orderId, proof = {}) => {
    try {
      const assignment = await deliveryService.confirmDispatchDelivery(batchId, orderId, proof);
      return { success: true, assignment };
    } catch (error) {
      console.error('Failed to complete delivery:', error);
      return { success: false, error };
    }
  },

  rejectDispatchBatch: async (batchId, reason = '') => {
    try {
      const assignment = await deliveryService.respondToDispatchBatch(batchId, false, reason);
      return { success: true, assignment };
    } catch (error) {
      console.error('Failed to reject assignment:', error);
      return { success: false, error };
    }
  },

  /**
   * Get provider profile — the caller's own provider record.
   * Resolved through `GET /delivery/provider/me`, so the portal needs no id.
   */
  getProviderProfile: async () => {
    try {
      const { data } = await api.get('/delivery/provider/me');
      return { profile: data?.provider || null, supported: true };
    } catch (error) {
      console.error('Failed to fetch provider profile:', error);
      if ([403, 404].includes(error?.response?.status)) {
        return { profile: null, supported: false, message: 'This account is not a delivery provider' };
      }
      throw error;
    }
  },

  // NOTE: there is intentionally no updateProviderProfile here. The delivery
  // API only lets a provider flip their own availability
  // (PUT /delivery/provider/:id/online → updateAvailability below); profile
  // fields (name/phone/vehicle/plate) are updated through the admin-only
  // PUT /delivery/provider/:id, so a rider must never call it.

  // NOTE: there is intentionally no uploadProofOfDelivery here. The delivery
  // service has no file-upload route — proof (photo/signature reference, COD
  // confirmation) is submitted inline in the `…/deliver` payload via
  // confirmDispatchDelivery, which confirmCodCollection already calls.

  /**
   * Confirm COD collection through the batch delivery proof workflow.
   */
  confirmCodCollection: async (deliveryId, amount, additionalProof = {}) => {
    try {
      const delivery = await deliveryService.getDelivery(deliveryId);
      if (!delivery?.assignmentId) throw new Error('Delivery is not linked to an active assignment');
      if (Number(amount) !== Number(delivery.paymentAmount)) {
        return { success: false, message: 'Collected amount must equal the order total' };
      }
      const proof = {
        ...additionalProof,
        codConfirmed: true,
        codCollectedAmount: Number(amount),
        confirmedAt: new Date().toISOString(),
      };
      const batch = await deliveryService.getMyDispatchBatch(delivery.assignmentId);
      if (batch) {
        await deliveryService.confirmDispatchDelivery(delivery.assignmentId, delivery.orderId, { proofOfDelivery: proof });
      } else {
        await deliveryService.advanceAssignment(delivery.assignmentId, 'delivered', { proofOfDelivery: proof });
      }
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
