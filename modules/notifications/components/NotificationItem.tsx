// Notification Item Component
// F-003: Notifications System
// Following R7: Pure UI component for individual notification card

"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TransformedNotification } from "@/hooks/useNotificationTransformations";
import { colors, spacing, typography } from "@/theme/tokens";

interface NotificationItemProps {
  notification: TransformedNotification;
  onMarkAsRead: (notification_id: string, etag?: string) => Promise<void>;
  isMarkingAsRead: boolean;
}

export const NotificationItem = React.memo(function NotificationItem({
  notification,
  onMarkAsRead,
  isMarkingAsRead,
}: NotificationItemProps) {
  const router = useRouter();

  const handleMarkAsRead = useCallback(() => {
    onMarkAsRead(notification.id);
  }, [notification.id, onMarkAsRead]);

  const handleNavigate = useCallback(() => {
    if (notification.related_record_url) {
      router.push(notification.related_record_url);
    }
  }, [notification.related_record_url, router]);

  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleMarkAsRead();
    },
    [handleMarkAsRead]
  );

  const cardWrapperStyle = useMemo(
    () => ({
      backgroundColor: notification.is_unread
        ? colors.backgroundSecondary
        : colors.backgroundPrimary,
      cursor: notification.related_record_url ? "pointer" : "default",
    } as const),
    [notification.is_unread, notification.related_record_url]
  );

  const contentStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[3],
    } as const),
    []
  );

  const headerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: spacing[4],
    } as const),
    []
  );

  const titleContainerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[2],
      flex: 1,
    } as const),
    []
  );

  const titleRowStyle = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      gap: spacing[2],
    } as const),
    []
  );

  const titleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: notification.is_unread
        ? colors.textPrimary
        : colors.textMuted,
      lineHeight: typography.lineHeight.body,
      margin: 0,
    } as const),
    [notification.is_unread]
  );

  const unreadIndicatorStyle = useMemo(
    () => ({
      width: spacing[2],
      height: spacing[2],
      borderRadius: "9999px",
      backgroundColor: colors.primary,
    } as const),
    []
  );

  const messageStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      lineHeight: typography.lineHeight.small,
      margin: 0,
    } as const),
    []
  );

  const badgeContainerStyle = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      gap: spacing[3],
      flexWrap: "wrap" as const,
    } as const),
    []
  );

  const badgeTextStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.caption,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      lineHeight: typography.lineHeight.caption,
    } as const),
    []
  );

  const buttonStyle = useMemo(
    () => ({
      minWidth: "auto",
      paddingLeft: spacing[3],
      paddingRight: spacing[3],
    } as const),
    []
  );

  return (
    <div style={cardWrapperStyle} onClick={handleNavigate}>
      <Card>
        <div style={contentStyle}>
          <div style={headerStyle}>
            <div style={titleContainerStyle}>
              <div style={titleRowStyle}>
                <h3 style={titleStyle}>{notification.title}</h3>
                {notification.is_unread && (
                  <div style={unreadIndicatorStyle} />
                )}
              </div>

              <p style={messageStyle}>{notification.message}</p>

              <div style={badgeContainerStyle}>
                <Badge variant="default">
                  {notification.notification_type_label}
                </Badge>
                <span style={badgeTextStyle}>
                  {notification.notification_age_label}
                </span>
              </div>
            </div>

            {notification.is_unread && (
              <Button
                onClick={handleButtonClick}
                isLoading={isMarkingAsRead}
                disabled={isMarkingAsRead}
                style={buttonStyle}
              >
                Mark as Read
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
});

