// Notification Context
// Feature-specific notification context provider and custom hook
// F-003: Notifications System

"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useGetUnreadCount } from "@/hooks/useNotifications";

interface NotificationContextValue {
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  hasUnreadNotifications: boolean;
  refetchUnreadCount: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: React.ReactNode;
}

/**
 * Notification Context Provider
 * Manages global notification state (unread count)
 * Uses React Query for data fetching and caching
 */
export function NotificationProvider({ children }: NotificationProviderProps) {
  const { data, isLoading, error, refetch } = useGetUnreadCount();

  const unreadCount = useMemo(() => {
    return data?.data?.unread_count || 0;
  }, [data?.data?.unread_count]);

  const hasUnreadNotifications = useMemo(() => {
    return unreadCount > 0;
  }, [unreadCount]);

  const value: NotificationContextValue = {
    unreadCount,
    isLoading,
    error: error as Error | null,
    hasUnreadNotifications,
    refetchUnreadCount: refetch,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Custom hook to consume Notification Context
 * Must be used within NotificationProvider
 * Following R7 rules: Context consumed via custom hook
 *
 * @returns Notification context value
 * @throws Error if used outside NotificationProvider
 */
export function useNotificationContext(): NotificationContextValue {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }

  return context;
}

