// Companies List Container
// Container component following R7
// Uses hooks for all logic, no API calls

"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCompanies } from "@/hooks/useUsers";
import { Loader, ErrorState, EmptyState } from "@/components/ui";
import { CompaniesList } from "./CompaniesList";

export function CompaniesListContainer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useCompanies();

  const handleRetry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["companies"] });
    router.refresh();
  }, [queryClient, router]);

  if (isLoading) return <Loader message="Loading companies..." />;
  if (isError)
    return (
      <ErrorState
        message={error?.message || "Failed to load companies"}
        onRetry={handleRetry}
      />
    );

  const companies = data?.data?.items || [];

  if (!companies.length) {
    return <EmptyState message="No companies found" />;
  }

  return <CompaniesList companies={companies} />;
}

