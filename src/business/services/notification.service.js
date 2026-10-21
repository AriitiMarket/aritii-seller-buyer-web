/**
 * Notification API Service
 * Handles all notification-related API calls for seller portal
 * Uses centralized API client with interceptors
 */

import BaseService from '@/services/BaseService';
import { ENV } from '@/app/config';
import { tokenStore } from '@/services/tokenStore';

class NotificationService extends BaseService {
  /**
   * Get all notifications with filters and pagination
   * Backend: GET /notifications
   * @param {Object} filters - Filter options
   * @param {number} filters.page - Page number (default: 1)
   * @param {number} filters.limit - Items per page (default: 20)
   * @param {string} filters.type - Notification type filter
   * @param {boolean} filters.read - Read status filter
   * @param {string} filters.startDate - Start date (ISO string)
   * @param {string} filters.endDate - End date (ISO string)
   * @returns {Promise<Object>} Notifications with pagination
   */
  async getNotifications(filters = {}) {
    const { page = 1, limit = 20, type, read, startDate, endDate } = filters;
    const params = { page, limit };
    
    if (type) params.type = type;
    if (typeof read === 'boolean') params.read = read;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    return this.get('/notifications', params);
  }

  /**
   * Mark a single notification as read
   * Backend: PATCH /notifications/:notificationId/read
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Updated notification
   */
  async markAsRead(notificationId) {
    return this.patch(`/notifications/${notificationId}/read`);
  }

  /**
   * Mark all notifications as read
   * Backend: POST /notifications/read-all
   * @returns {Promise<Object>} Result with count of updated notifications
   */
  async markAllAsRead() {
    return this.post('/notifications/read-all');
  }

  /**
   * Get unread notifications count
   * Backend: GET /notifications/unread-count
   * @returns {Promise<number>} Unread count
   */
  async getUnreadCount() {
    const response = await this.get('/notifications/unread-count');
    // Backend may return { count: number } or just the number
    return response?.count ?? response?.data?.count ?? response;
  }

  /**
   * Delete a notification
   * Backend: DELETE /notifications/:notificationId
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteNotification(notificationId) {
    return this.delete(`/notifications/${notificationId}`);
  }

  /**
   * Subscribe to real-time notification events via WebSocket
   * Uses native WebSocket API (not Socket.IO) for lightweight connection
   * 
   * @param {(notification: Object) => void} onNotification - Callback when new notification arrives
   * @returns {() => void} Unsubscribe function to close the connection
   */
  subscribeToRealTime(onNotification) {
    if (typeof window === 'undefined') {
      console.warn('[NotificationService] subscribeToRealTime: window is undefined (SSR)');
      return () => {};
    }

    const accessToken = tokenStore.getAccessToken();
    if (!accessToken) {
      console.warn('[NotificationService] subscribeToRealTime: no access token available');
      return () => {};
    }

    // Build WebSocket URL from API URL (replace /api with ws endpoint)
    const wsUrl = ENV.API_URL.replace(/^http/, 'ws').replace(/\/api\/?$/, '') + '/ws/notifications';
    
    let ws = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const baseReconnectDelay = 1000; // 1 second
    let isIntentionalClose = false;

    const connect = () => {
      if (isIntentionalClose) return;
      
      try {
        ws = new WebSocket(`${wsUrl}?token=${encodeURIComponent(accessToken)}`);
        
        ws.onopen = () => {
          console.log('[NotificationService] WebSocket connected');
          reconnectAttempts = 0;
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && typeof onNotification === 'function') {
              onNotification(data);
            }
          } catch (error) {
            console.error('[NotificationService] Failed to parse WebSocket message:', error);
          }
        };

        ws.onclose = (event) => {
          console.log('[NotificationService] WebSocket closed:', event.code, event.reason);
          
          if (!isIntentionalClose && reconnectAttempts < maxReconnectAttempts) {
            const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts); // Exponential backoff
            reconnectAttempts++;
            console.log(`[NotificationService] Reconnecting in ${delay}ms (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
            setTimeout(connect, delay);
          }
        };

        ws.onerror = (error) => {
          console.error('[NotificationService] WebSocket error:', error);
        };
      } catch (error) {
        console.error('[NotificationService] Failed to create WebSocket:', error);
        
        if (!isIntentionalClose && reconnectAttempts < maxReconnectAttempts) {
          const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts);
          reconnectAttempts++;
          setTimeout(connect, delay);
        }
      }
    };

    // Initial connection
    connect();

    // Return unsubscribe function
    return () => {
      isIntentionalClose = true;
      if (ws) {
        ws.close(1000, 'Intentional unsubscribe');
        ws = null;
      }
    };
  }
}

export default new NotificationService();