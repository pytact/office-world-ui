// Notification Hooks
// F-003: Notifications System
// React Query hooks for notification operations with caching
// Following R5 (Custom Hooks) and R9 (Caching) rules

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { NotificationService } from "@/services/notification.service";
import {
  NotificationListParams,
  NotificationBulkReadUpdate,
} from "@/utils/types/requests/notification";

/**
 * Hook for listing notifications with pagination, filtering, and sorting
 * GET /api/v1/notifications
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns Query object with notification list data and state
 */
export function useListNotifications(params?: NotificationListParams) {
  return useQuery({
    queryKey: [
      "notifications",
      params?.page,
      params?.page_size,
      params?.is_read,
      params?.type,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => NotificationService.list(params),
    staleTime: 30 * 1000, // 30 seconds - notifications change frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Smooth pagination transitions
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for getting a single notification by ID
 * GET /api/v1/notifications/{notification_id}
 * @param notification_id - Notification ID (UUID)
 * @returns Query object with notification data and state
 */
export function useGetNotification(notification_id: string | null) {
  return useQuery({
    queryKey: ["notification", notification_id],
    queryFn: () => {
      if (!notification_id) throw new Error("Notification ID is required");
      return NotificationService.getById(notification_id);
    },
    enabled: !!notification_id, // Only run query if notification_id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes - notification details are relatively stable
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus for fresh data
  });
}

/**
 * Hook for creating a notification
 * NOTE: Not supported by API - notifications are system-generated only
 * This hook throws an error to indicate the operation is not available
 * @returns Mutation object that always throws an error
 */
export function useCreateNotification() {
  return useMutation({
    mutationFn: () => NotificationService.create(),
  });
}

/**
 * Hook for updating a notification (marks as read)
 * PATCH /api/v1/notifications/{notification_id}/read
 * Alias for useMarkAsRead - provided for consistency with CRUD pattern
 * @returns Mutation object with update function and state
 */
export function useUpdateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      notification_id,
      etag,
    }: {
      notification_id: string;
      etag?: string;
    }) => NotificationService.update(notification_id, etag),
    onSuccess: async (_, variables) => {
      // Invalidate notification list
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      // Invalidate specific notification
      await queryClient.invalidateQueries({
        queryKey: ["notification", variables.notification_id],
      });
      // Invalidate unread count
      await queryClient.invalidateQueries({ queryKey: ["notifications", "count"] });
    },
  });
}

/**
 * Hook for deleting a notification
 * NOTE: Not supported by API - no delete endpoint exists
 * This hook throws an error to indicate the operation is not available
 * @returns Mutation object that always throws an error
 */
export function useDeleteNotification() {
  return useMutation({
    mutationFn: () => NotificationService.delete(),
  });
}

/**
 * Hook for marking a single notification as read
 * PATCH /api/v1/notifications/{notification_id}/read
 * @returns Mutation object with markAsRead function and state
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      notification_id,
      etag,
    }: {
      notification_id: string;
      etag?: string;
    }) => NotificationService.markAsRead(notification_id, etag),
    onSuccess: async (_, variables) => {
      // Invalidate notification list
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      // Invalidate specific notification
      await queryClient.invalidateQueries({
        queryKey: ["notification", variables.notification_id],
      });
      // Invalidate unread count
      await queryClient.invalidateQueries({ queryKey: ["notifications", "count"] });
    },
  });
}

/**
 * Hook for bulk marking notifications as read or unread
 * PATCH /api/v1/notifications/read
 * @returns Mutation object with bulkMarkAsRead function and state
 */
export function useBulkMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NotificationBulkReadUpdate) =>
      NotificationService.bulkMarkAsRead(payload),
    onSuccess: async () => {
      // Invalidate notification list
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      // Invalidate unread count
      await queryClient.invalidateQueries({ queryKey: ["notifications", "count"] });
    },
  });
}

/**
 * Hook for getting unread notification count
 * GET /api/v1/notifications/count
 * Used for badge display in navigation
 * @returns Query object with unread count data and state
 */
export function useGetUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "count"],
    queryFn: () => NotificationService.getUnreadCount(),
    staleTime: 30 * 1000, // 30 seconds - count changes frequently
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus for accurate count
  });
}

