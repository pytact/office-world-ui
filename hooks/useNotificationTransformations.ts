// Notification Transformations Hook
// Encapsulates data transformations and derived fields
// Following R5 rules: All transformations in hooks

import { useMemo } from "react";
import { NotificationResponse } from "@/utils/types/responses/notification";

export interface TransformedNotification extends NotificationResponse {
  is_unread: boolean;
  notification_age_label: string;
  notification_type_label: string;
  related_record_url: string | null;
}

/**
 * Calculate relative time label from timestamp
 * @param createdAt - ISO 8601 UTC datetime string
 * @returns Human-readable time label
 */
function getRelativeTimeLabel(createdAt: string): string {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  // Format absolute date for older notifications
  return created.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: created.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Get human-readable label for notification type
 * @param type - Notification type enum
 * @returns Display label
 */
function getNotificationTypeLabel(type: string): string {
  const labelMap: Record<string, string> = {
    leave_request: "Leave Request",
    leave_approval: "Leave Approved",
    leave_rejection: "Leave Rejected",
    leave_manager_approval: "Manager Leave Approval",
    task_assignment: "Task Assigned",
    task_permission_change: "Task Permission Changed",
    task_status_change: "Task Status Changed",
    user_activation: "Account Activated",
    user_deactivation: "Account Deactivated",
  };

  return labelMap[type] || type;
}

/**
 * Construct related record URL from notification data
 * @param relatedTable - Source table name
 * @param relatedRecordId - Related record ID
 * @returns Navigation URL or null
 */
function getRelatedRecordUrl(
  relatedTable: string | null,
  relatedRecordId: string | null
): string | null {
  if (!relatedTable || !relatedRecordId) return null;

  const routeMap: Record<string, string> = {
    leaves: "/leaves",
    tasks: "/tasks",
  };

  const baseRoute = routeMap[relatedTable];
  return baseRoute ? `${baseRoute}/${relatedRecordId}` : null;
}

/**
 * Transform a single notification with derived fields
 * @param notification - Raw notification response
 * @returns Transformed notification with derived fields
 */
export function transformNotification(
  notification: NotificationResponse
): TransformedNotification {
  return {
    ...notification,
    is_unread: !notification.is_read,
    notification_age_label: getRelativeTimeLabel(notification.created_at),
    notification_type_label: getNotificationTypeLabel(notification.type),
    related_record_url: getRelatedRecordUrl(
      notification.related_table,
      notification.related_record_id
    ),
  };
}

/**
 * Hook for transforming notification data
 * Encapsulates all data transformations and derived field calculations
 * @param notifications - Array of raw notification responses
 * @returns Array of transformed notifications
 */
export function useNotificationTransformations(
  notifications: NotificationResponse[]
): TransformedNotification[] {
  return useMemo(() => {
    return notifications.map(transformNotification);
  }, [notifications]);
}

