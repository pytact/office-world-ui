// Notification Service
// F-003: Notifications System
// Following R8 rules: API Calls & Error Handling

import { http } from "@/utils/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { buildIfMatchHeaders } from "@/utils/helpers/etag";

import {
  NotificationListParams,
  NotificationBulkReadUpdate,
} from "@/utils/types/requests/notification";

import {
  NotificationListResponse,
  NotificationDetailResponse,
  NotificationMutationResponse,
  NotificationBulkUpdateResponse,
  NotificationCountResponse,
} from "@/utils/types/responses/notification";

const basePath = "/v1";

export const NotificationService = {
  /**
   * GET /api/v1/notifications
   * List in-app notifications with pagination, filtering, and sorting
   */
  list: async (
    params?: NotificationListParams
  ): Promise<NotificationListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.page !== undefined) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.page_size !== undefined) {
        searchParams.append("page_size", params.page_size.toString());
      }
      if (params?.is_read !== undefined && params.is_read !== null) {
        searchParams.append("is_read", params.is_read.toString());
      }
      if (params?.type) {
        searchParams.append("type", params.type);
      }
      if (params?.sort_by) {
        searchParams.append("sort_by", params.sort_by);
      }
      if (params?.sort_order) {
        searchParams.append("sort_order", params.sort_order);
      }

      const queryString = searchParams.toString();
      const url = `${basePath}/notifications${queryString ? `?${queryString}` : ""}`;

      const r = await http.get<NotificationListResponse>(url);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/notifications/{notification_id}
   * Retrieve single notification by ID
   */
  getById: async (
    notification_id: string
  ): Promise<NotificationDetailResponse> => {
    try {
      const r = await http.get<NotificationDetailResponse>(
        `${basePath}/notifications/${notification_id}`
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * PATCH /api/v1/notifications/{notification_id}/read
   * Mark single notification as read
   * Requires If-Match header with ETag for concurrency control
   */
  markAsRead: async (
    notification_id: string,
    etag?: string
  ): Promise<NotificationMutationResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.patch<NotificationMutationResponse>(
        `${basePath}/notifications/${notification_id}/read`,
        undefined,
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * UPDATE - Alias for markAsRead()
   * The only update operation available for notifications is marking as read
   */
  update: async (
    notification_id: string,
    etag?: string
  ): Promise<NotificationMutationResponse> => {
    return NotificationService.markAsRead(notification_id, etag);
  },

  /**
   * PATCH /api/v1/notifications/read
   * Bulk mark notifications as read or unread
   */
  bulkMarkAsRead: async (
    payload: NotificationBulkReadUpdate
  ): Promise<NotificationBulkUpdateResponse> => {
    try {
      const r = await http.patch<NotificationBulkUpdateResponse>(
        `${basePath}/notifications/read`,
        payload
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/notifications/count
   * Get unread notification count for badge display
   */
  getUnreadCount: async (): Promise<NotificationCountResponse> => {
    try {
      const r = await http.get<NotificationCountResponse>(
        `${basePath}/notifications/count`
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * CREATE - Not supported by API
   * Notifications are created internally by the system via async workers (Celery)
   * This function throws an error to indicate the operation is not available
   */
  create: async (): Promise<never> => {
    throw normalizeAPIError(
      new Error(
        "Notification creation is not supported via API. Notifications are system-generated only."
      )
    );
  },

  /**
   * DELETE - Not supported by API
   * There is no delete endpoint for notifications in the API spec
   * This function throws an error to indicate the operation is not available
   */
  delete: async (): Promise<never> => {
    throw normalizeAPIError(
      new Error("Notification deletion is not supported via API.")
    );
  },
};

