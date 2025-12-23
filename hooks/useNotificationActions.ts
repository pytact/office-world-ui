// Notification Actions Hook
// Encapsulates notification action logic (mark as read/unread)
// Following R5 rules: Business logic in hooks

import { useCallback } from "react";
import { useMarkAsRead, useBulkMarkAsRead } from "./useNotifications";
import { NotificationBulkReadUpdate } from "@/utils/types/requests/notification";

interface UseNotificationActionsReturn {
  markAsRead: (notification_id: string, etag?: string) => Promise<void>;
  markAsUnread: (notification_ids: string[]) => Promise<void>;
  bulkMarkAsRead: (notification_ids: string[]) => Promise<void>;
  bulkMarkAsUnread: (notification_ids: string[]) => Promise<void>;
  isMarkingAsRead: boolean;
  isBulkMarking: boolean;
  markAsReadError: Error | null;
  bulkMarkError: Error | null;
}

/**
 * Hook for managing notification actions
 * Encapsulates all action logic for notifications
 * @returns Action handlers and loading/error states
 */
export function useNotificationActions(): UseNotificationActionsReturn {
  const markAsReadMutation = useMarkAsRead();
  const bulkMarkAsReadMutation = useBulkMarkAsRead();

  const markAsRead = useCallback(
    async (notification_id: string, etag?: string) => {
      await markAsReadMutation.mutateAsync({ notification_id, etag });
    },
    [markAsReadMutation]
  );

  const markAsUnread = useCallback(
    async (notification_ids: string[]) => {
      const payload: NotificationBulkReadUpdate = {
        action: "unread",
        notification_ids,
      };
      await bulkMarkAsReadMutation.mutateAsync(payload);
    },
    [bulkMarkAsReadMutation]
  );

  const bulkMarkAsRead = useCallback(
    async (notification_ids: string[]) => {
      const payload: NotificationBulkReadUpdate = {
        action: "read",
        notification_ids,
      };
      await bulkMarkAsReadMutation.mutateAsync(payload);
    },
    [bulkMarkAsReadMutation]
  );

  const bulkMarkAsUnread = useCallback(
    async (notification_ids: string[]) => {
      const payload: NotificationBulkReadUpdate = {
        action: "unread",
        notification_ids,
      };
      await bulkMarkAsReadMutation.mutateAsync(payload);
    },
    [bulkMarkAsReadMutation]
  );

  return {
    markAsRead,
    markAsUnread,
    bulkMarkAsRead,
    bulkMarkAsUnread,
    isMarkingAsRead: markAsReadMutation.isPending,
    isBulkMarking: bulkMarkAsReadMutation.isPending,
    markAsReadError: markAsReadMutation.error as Error | null,
    bulkMarkError: bulkMarkAsReadMutation.error as Error | null,
  };
}

