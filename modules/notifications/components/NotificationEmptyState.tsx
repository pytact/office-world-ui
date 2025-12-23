// Notification Empty State Component
// F-003: Notifications System
// Following R7: Feature-specific empty state
// Following R14: Performance optimization with React.memo

"use client";

import React, { useMemo } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { colors, spacing } from "@/theme/tokens";

export const NotificationEmptyState = React.memo(function NotificationEmptyState() {
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: spacing[12],
      textAlign: "center",
      backgroundColor: colors.backgroundPrimary,
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <EmptyState message="No notifications found. You're all caught up!" />
    </div>
  );
});

