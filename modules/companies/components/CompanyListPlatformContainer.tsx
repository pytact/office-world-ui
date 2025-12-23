// Company List Platform Container
// SCR_COMPANY_LIST_PLATFORM - Container component following R7
// Uses hooks for all logic, no API calls

"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCompanyListData } from "@/hooks/useCompanyListData";
import { useAuthContext } from "@/context";
import { Loader, ErrorState, EmptyState, AccessDenied } from "@/components/ui";
import { CompanyListPlatform } from "./CompanyListPlatform";

export function CompanyListPlatformContainer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isSuperAdmin } = useAuthContext();

  const {
    companies,
    isLoading,
    isError,
    error,
    pagination,
    filters,
    paginationControls,
    refetch,
  } = useCompanyListData();

  const handleRetry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["companies"] });
    refetch();
  }, [queryClient, refetch]);

  // SuperAdmin-only access
  if (!isSuperAdmin) {
    return <AccessDenied message="Only SuperAdmin can access company management" />;
  }

  if (isLoading) return <Loader message="Loading companies..." />;
  if (isError)
    return (
      <ErrorState
        message={error?.message || "Failed to load companies"}
        onRetry={handleRetry}
      />
    );
  if (!companies.length && !filters.hasActiveFilters)
    return <EmptyState message="No companies found" />;

  return (
    <CompanyListPlatform
      companies={companies}
      pagination={pagination}
      filters={filters}
      paginationControls={paginationControls}
    />
  );
}

