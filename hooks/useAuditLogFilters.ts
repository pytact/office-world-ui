// Audit Log Filters Hook
// Encapsulates filter state management for audit log lists
// Following R5 rules: Business logic in hooks

import { useState, useCallback, useMemo } from "react";
import { AuditLogListParams } from "@/utils/types/requests/auditLog";

interface UseAuditLogFiltersParams {
  initialStartDate?: string | null;
  initialEndDate?: string | null;
  initialActionCode?: string | null;
  initialTableName?: string | null;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UseAuditLogFiltersReturn {
  startDate: string | null;
  endDate: string | null;
  actionCode: string | null;
  tableName: string | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
  setStartDate: (startDate: string | null) => void;
  setEndDate: (endDate: string | null) => void;
  setActionCode: (actionCode: string | null) => void;
  setTableName: (tableName: string | null) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: "asc" | "desc") => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  getParams: () => Partial<AuditLogListParams>;
}

/**
 * Hook for managing audit log list filter state
 * Encapsulates all filter logic and transformations
 * 
 * @param params - Initial filter values
 * @returns Filter state, handlers, and computed params
 */
export function useAuditLogFilters(
  params?: UseAuditLogFiltersParams
): UseAuditLogFiltersReturn {
  const [startDate, setStartDate] = useState<string | null>(
    params?.initialStartDate ?? null
  );
  const [endDate, setEndDate] = useState<string | null>(
    params?.initialEndDate ?? null
  );
  const [actionCode, setActionCode] = useState<string | null>(
    params?.initialActionCode ?? null
  );
  const [tableName, setTableName] = useState<string | null>(
    params?.initialTableName ?? null
  );
  const [sortBy, setSortBy] = useState<string>(
    params?.initialSortBy || "created_at"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    params?.initialSortOrder || "desc"
  );

  const resetFilters = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    setActionCode(null);
    setTableName(null);
    setSortBy("created_at");
    setSortOrder("desc");
  }, []);

  const hasActiveFilters = useMemo(() => {
    return !!(
      startDate ||
      endDate ||
      actionCode ||
      tableName ||
      sortBy !== "created_at" ||
      sortOrder !== "desc"
    );
  }, [startDate, endDate, actionCode, tableName, sortBy, sortOrder]);

  const getParams = useCallback((): Partial<AuditLogListParams> => {
    return {
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      action_code: actionCode || undefined,
      table_name: tableName || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    };
  }, [startDate, endDate, actionCode, tableName, sortBy, sortOrder]);

  return {
    startDate,
    endDate,
    actionCode,
    tableName,
    sortBy,
    sortOrder,
    setStartDate,
    setEndDate,
    setActionCode,
    setTableName,
    setSortBy,
    setSortOrder,
    resetFilters,
    hasActiveFilters,
    getParams,
  };
}

