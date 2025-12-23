// Company Settings Container for CEO
// Container component following R7

"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGetCompanyProfile } from "@/hooks/useCompanies";
import { useListCompanyUsers } from "@/hooks/useUsers";
import { useAuthContext } from "@/context";
import { companyRoutes } from "@/utils/routes";
import { Loader, ErrorState, AccessDenied } from "@/components/ui";
import { CompanySettingsCEO } from "./CompanySettingsCEO";

export function CompanySettingsCEOContainer() {
  const router = useRouter();
  const { user, isSuperAdmin } = useAuthContext();

  // CEO/HR only access
  if (isSuperAdmin) {
    return <AccessDenied message="SuperAdmin should use platform company settings" />;
  }

  if (user?.role !== "ceo" && user?.role !== "hr") {
    return <AccessDenied message="Only CEO and HR can access company settings" />;
  }

  const profileQuery = useGetCompanyProfile();
  const { data: usersData } = useListCompanyUsers({ page: 1, page_size: 1 });
  const userCount = usersData?.data?.total || 0;

  const handleCancel = useCallback(() => {
    router.push(companyRoutes.profile.view);
  }, [router]);

  if (profileQuery.isLoading) return <Loader message="Loading company settings..." />;
  if (profileQuery.isError)
    return (
      <ErrorState
        message={profileQuery.error?.message || "Failed to load company settings"}
        onRetry={profileQuery.refetch}
      />
    );
  if (!profileQuery.data?.data) {
    return <ErrorState message="Company profile not found" onRetry={profileQuery.refetch} />;
  }

  return (
    <CompanySettingsCEO
      profile={profileQuery.data.data}
      userCount={userCount}
      onCancel={handleCancel}
    />
  );
}

