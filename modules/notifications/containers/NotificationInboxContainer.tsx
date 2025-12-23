// Notification Inbox Container
// F-003: Notifications System
// Following R7: Container component with hooks and business logic

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNotificationListData } from "@/hooks/useNotificationListData";
import { useNotificationActions } from "@/hooks/useNotificationActions";
import { Loader, ErrorState } from "@/components/ui";
import { NotificationList } from "../components/NotificationList";
import { NotificationFilters } from "../components/NotificationFilters";
import { NotificationPagination } from "../components/NotificationPagination";
import { NotificationEmptyState } from "../components/NotificationEmptyState";
import { colors, spacing, typography } from "@/theme/tokens";

export function NotificationInboxContainer() {
  const listData = useNotificationListData();
  const actions = useNotificationActions();
  const pathname = usePathname();

  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[6],
      padding: spacing[6],
      backgroundColor: colors.backgroundPrimary,
    } as const),
    []
  );

  const backLinkStyle = useMemo(
    () => ({
      color: colors.primary,
      textDecoration: "none",
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.body,
      marginBottom: spacing[4],
      display: "inline-block",
    } as const),
    []
  );

  // Determine back link based on current route context
  const backLink = useMemo(() => {
    if (pathname?.startsWith("/platform")) {
      return "/platform/dashboard";
    } else if (pathname?.startsWith("/company")) {
      return "/company/dashboard";
    }
    return "/"; // Fallback
  }, [pathname]);

  if (listData.isLoading) {
    return <Loader message="Loading notifications..." />;
  }

  if (listData.isError && listData.error) {
    return (
      <ErrorState
        message={listData.error.message || "Failed to load notifications"}
        onRetry={listData.refetch}
      />
    );
  }

  if (!listData.notifications.length && !listData.isLoading) {
    return <NotificationEmptyState />;
  }

  return (
    <div style={containerStyle}>
      <div>
        <Link href={backLink} style={backLinkStyle}>
          ← Back to Dashboard
        </Link>
      </div>
      <NotificationFilters filters={listData.filters} />

      <NotificationList
        notifications={listData.notifications}
        onMarkAsRead={actions.markAsRead}
        isMarkingAsRead={actions.isMarkingAsRead}
      />

      {listData.pagination.totalPages > 1 && (
        <NotificationPagination
          pagination={listData.pagination}
          paginationControls={listData.paginationControls}
        />
      )}
    </div>
  );
}
