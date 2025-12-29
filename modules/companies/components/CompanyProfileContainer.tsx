// Company Profile Container
// SCR_COMPANY_PROFILE - Container component following R7
// Uses hooks for all logic, no API calls

"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetCompanyProfile } from "@/hooks/useCompanies";
import { useCompanyProfileForm } from "@/hooks/useCompanyProfileForm";
import { useUpdateCompanyProfile } from "@/hooks/useCompanies";
import { useListCompanyUsers } from "@/hooks/useUsers";
import { useAuthContext } from "@/context";
import { Loader, ErrorState, AccessDenied } from "@/components/ui";
import { extractETagFromUpdatedAt } from "@/utils/helpers/etag";
import { CompanyProfile } from "./CompanyProfile";

export function CompanyProfileContainer() {
  const router = useRouter();
  const { user, isSuperAdmin } = useAuthContext();

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS (Rules of Hooks)
  // This ensures hooks are always called in the same order on every render
  const profileQuery = useGetCompanyProfile();
  const form = useCompanyProfileForm({
    isActive: profileQuery.data?.data?.is_active ?? false,
  });
  const updateMutation = useUpdateCompanyProfile();

  // Fetch user count for analytics (first page only for total count)
  // company_id will be auto-detected from current user
  const { data: usersData } = useListCompanyUsers(undefined, { 
    page: 1, 
    page_size: 1 
  });
  const userCount = usersData?.data?.total || 0;

  // Extract ETag from updated_at field (F-004 API spec: ETag format is based on updated_at)
  // ETag format: "20240120T103000Z" (converted from ISO 8601 timestamp)
  const etag = useMemo(() => {
    if (!profileQuery.data?.data) {
      return null;
    }
    return extractETagFromUpdatedAt(profileQuery.data.data);
  }, [profileQuery.data?.data]);

  // Populate form when profile data loads
  useEffect(() => {
    if (profileQuery.data?.data) {
      form.resetToDefaults(profileQuery.data.data);
    }
  }, [profileQuery.data?.data, form]);

  // ALL useCallback hooks must also be called before conditional returns
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!form.isValid || !form.hasChanges) {
        return;
      }

      try {
        const payload = form.getPayload();
        await updateMutation.mutateAsync({
          payload,
          etag: etag || undefined,
        });
        profileQuery.refetch();
      } catch (error) {
        // Error handling is done by the mutation hook
      }
    },
    [form, updateMutation, profileQuery, etag]
  );

  const handleCancel = useCallback(() => {
    if (profileQuery.data?.data) {
      form.resetToDefaults(profileQuery.data.data);
    }
  }, [form, profileQuery.data?.data]);

  const handleSubmitForm = useCallback(
    (e: React.FormEvent) => {
      handleSubmit(e);
    },
    [handleSubmit]
  );

  // CEO/HR only access - check AFTER all hooks are called
  if (isSuperAdmin) {
    return <AccessDenied message="SuperAdmin should use platform company management" />;
  }

  if (user?.role !== "ceo" && user?.role !== "hr") {
    return <AccessDenied message="Only CEO and HR can access company profile" />;
  }

  if (profileQuery.isLoading) return <Loader message="Loading company profile..." />;
  if (profileQuery.isError)
    return (
      <ErrorState
        message={profileQuery.error?.message || "Failed to load company profile"}
        onRetry={profileQuery.refetch}
      />
    );
  if (!profileQuery.data?.data) {
    return <ErrorState message="Company profile not found" onRetry={profileQuery.refetch} />;
  }

  return (
    <CompanyProfile
      profile={profileQuery.data.data}
      form={form}
      onSubmit={handleSubmitForm}
      onCancel={handleCancel}
      isLoading={updateMutation.isPending}
      errors={form.errors}
      userCount={userCount}
    />
  );
}

