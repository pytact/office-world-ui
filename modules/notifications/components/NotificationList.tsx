// Notification List Component
// F-003: Notifications System
// Following R7: Pure UI component for rendering notification list
// Following R14: Performance optimization with React.memo

"use client";

import React, { useMemo } from "react";
import { NotificationItem } from "./NotificationItem";
import { TransformedNotification } from "@/hooks/useNotificationTransformations";
import { spacing } from "@/theme/tokens";

interface NotificationListProps {
  notifications: TransformedNotification[];
  onMarkAsRead: (notification_id: string, etag?: string) => Promise<void>;
  isMarkingAsRead: boolean;
}

export const NotificationList = React.memo(function NotificationList({
  notifications,
  onMarkAsRead,
  isMarkingAsRead,
}: NotificationListProps) {
  const listStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[5],
    } as const),
    []
  );

  return (
    <div style={listStyle}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          isMarkingAsRead={isMarkingAsRead}
        />
      ))}
    </div>
  );
});

