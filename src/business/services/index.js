/**
 * Business (Seller) API Services Index
 * Central export point for all seller-specific API services
 */

// Core seller services
export { default as ordersService } from './orders.service';
export { default as returnsService } from './returns.service';
export { default as sellerMetricsService } from './sellerMetrics.service';
export { default as sellerPaymentsService } from './sellerPayments.service';
export { default as walletService } from './wallet.service';
export { default as insightsService } from './insights.service';
export { default as commissionService } from './commission.service';
export { default as deliveryZoneService } from './deliveryZone.service';
export { default as notificationService } from './notification.service';

// Feature services
export { orderNotesService, orderExportService } from './orderNotes.service';
export { default as promotionService } from './promotionService';
export { default as requestService } from './requestService';

// Legacy seller service (from @/services)
export { sellerService } from '@/services/seller.service';

/**
 * Usage in seller components:
 * 
 * import { ordersService, insightsService, commissionService } from '@/business/services'
 * 
 * // Get shop orders with pagination
 * const orders = await ordersService.getShopOrders(shopId, { page: 1, limit: 20 })
 * 
 * // Get seller insights
 * const trends = await insightsService.getTrends(shopId, '30d')
 * 
 * // Get commission breakdown
 * const breakdown = await commissionService.getCommissionBreakdown(orderId)
 */