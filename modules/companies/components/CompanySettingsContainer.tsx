// Company Settings Container
// Container component following R7

"use client";

import React, { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCompanyDetail } from "@/hooks/useCompanyDetail";
import { useAuthContext } from "@/context";
import { companyRoutes } from "@/utils/routes";
import { Loader, ErrorState, AccessDenied } from "@/components/ui";
import { CompanySettings } from "./CompanySettings";

export function CompanySettingsContainer() {
  const params = useParams();
  const router = useRouter();
  const { isSuperAdmin } = useAuthContext();
  const companyId = params?.companyId as string | null;

  const {
    company,
    isLoading,
    isError,
    error,
    status,
    refetch,
  } = useCompanyDetail({ company_id: companyId });

  const handleCancel = useCallback(() => {
    if (company) {
      router.push(companyRoutes.platform.detail(company.company_id));
    } else {
      router.push(companyRoutes.platform.list);
    }
  }, [router, company]);

  // SuperAdmin-only access
  if (!isSuperAdmin) {
    return <AccessDenied message="Only SuperAdmin can access company settings" />;
  }

  if (isLoading) return <Loader message="Loading company settings..." />;
  if (isError)
    return (
      <ErrorState
        message={error?.message || "Failed to load company settings"}
        onRetry={refetch}
      />
    );
  if (!company) {
    return <ErrorState message="Company not found" onRetry={refetch} />;
  }

  return (
    <CompanySettings
      company={company}
      status={status}
      onCancel={handleCancel}
    />
  );
}

