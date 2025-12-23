// Notification Filters Hook
// Encapsulates filter state management for notification lists
// Following R5 rules: Business logic in hooks

import { useState, useCallback, useMemo } from "react";
import { NotificationType } from "@/utils/types/requests/notification";

interface UseNotificationFiltersParams {
  initialIsRead?: boolean | null;
  initialType?: NotificationType | null;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UseNotificationFiltersReturn {
  isRead: boolean | null;
  type: NotificationType | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
  setIsRead: (value: boolean | null) => void;
  setType: (value: NotificationType | null) => void;
  setSortBy: (value: string) => void;
  setSortOrder: (value: "asc" | "desc") => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  getParams: () => {
    is_read?: boolean | null;
    type?: NotificationType | null;
    sort_by?: string;
    sort_order?: "asc" | "desc";
  };
}

/**
 * Hook for managing notification list filter state
 * Encapsulates all filter logic and transformations
 * @param params - Initial filter values
 * @returns Filter state, handlers, and computed params
 */
export function useNotificationFilters(
  params?: UseNotificationFiltersParams
): UseNotificationFiltersReturn {
  const [isRead, setIsRead] = useState<boolean | null>(
    params?.initialIsRead ?? null
  );
  const [type, setType] = useState<NotificationType | null>(
    params?.initialType ?? null
  );
  const [sortBy, setSortBy] = useState<string>(
    params?.initialSortBy || "created_at"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    params?.initialSortOrder || "desc"
  );

  const resetFilters = useCallback(() => {
    setIsRead(null);
    setType(null);
    setSortBy("created_at");
    setSortOrder("desc");
  }, []);

  const hasActiveFilters = useMemo(() => {
    return !!(
      isRead !== null ||
      type ||
      sortBy !== "created_at" ||
      sortOrder !== "desc"
    );
  }, [isRead, type, sortBy, sortOrder]);

  const getParams = useCallback(() => {
    return {
      is_read: isRead !== null ? isRead : undefined,
      type: type || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    };
  }, [isRead, type, sortBy, sortOrder]);

  return {
    isRead,
    type,
    sortBy,
    sortOrder,
    setIsRead,
    setType,
    setSortBy,
    setSortOrder,
    resetFilters,
    hasActiveFilters,
    getParams,
  };
}

