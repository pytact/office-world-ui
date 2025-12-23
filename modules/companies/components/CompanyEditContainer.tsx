// Company Edit Container
// SCR_COMPANY_EDIT_PLATFORM - Container component following R7
// Uses hooks for all logic, no API calls

"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCompanyDetail } from "@/hooks/useCompanyDetail";
import { useCompanyProfileForm } from "@/hooks/useCompanyProfileForm";
import { useUpdateCompany } from "@/hooks/useCompanies";
import { useAuthContext } from "@/context";
import { companyRoutes } from "@/utils/routes";
import { Loader, ErrorState, AccessDenied } from "@/components/ui";
import { extractETagFromUpdatedAt } from "@/utils/helpers/etag";
import { CompanyEdit } from "./CompanyEdit";
import { useToast } from "@/context/ToastContext";

export function CompanyEditContainer() {
  const params = useParams();
  const router = useRouter();
  const { isSuperAdmin } = useAuthContext();
  const { showSuccess, showError } = useToast();
  const companyId = params?.companyId as string | null;

  const {
    company,
    isLoading,
    isError,
    error,
    refetch,
  } = useCompanyDetail({ company_id: companyId });

  const form = useCompanyProfileForm({
    isActive: company?.is_active ?? true,
  });

  const updateMutation = useUpdateCompany();

  // Extract ETag from updated_at field
  const etag = useMemo(() => {
    if (!company) {
      return null;
    }
    return extractETagFromUpdatedAt(company);
  }, [company]);

  // Populate form when company data loads
  useEffect(() => {
    if (company) {
      form.resetToDefaults({
        description: company.description || null,
        address: company.address || null,
        city: company.city || null,
        state: company.state || null,
        country: company.country || null,
        postal_code: company.postal_code || null,
        website: company.website || null,
        logo_url: company.logo_url || null,
      });
    }
  }, [company, form]);

  // SuperAdmin-only access
  if (!isSuperAdmin) {
    return <AccessDenied message="Only SuperAdmin can edit companies" />;
  }

  if (isLoading) return <Loader message="Loading company details..." />;
  if (isError)
    return (
      <ErrorState
        message={error?.message || "Failed to load company details"}
        onRetry={refetch}
      />
    );
  if (!company) {
    return <ErrorState message="Company not found" onRetry={refetch} />;
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!form.isValid || !company) {
        return;
      }

      try {
        const payload = form.getPayload();
        await updateMutation.mutateAsync({
          company_id: company.company_id,
          payload,
          etag: etag || undefined,
        });
        showSuccess("Company updated successfully");
        router.push(companyRoutes.platform.detail(company.company_id));
      } catch (error: any) {
        showError(error?.message || "Failed to update company");
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to update company:", error);
        }
      }
    },
    [form, company, updateMutation, router, etag, showSuccess, showError]
  );

  const handleCancel = useCallback(() => {
    router.push(companyRoutes.platform.detail(company.company_id));
  }, [router, company]);

  return (
    <CompanyEdit
      companyName={company.name}
      companyId={company.company_id}
      form={form}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={updateMutation.isPending}
      errors={form.errors}
    />
  );
}

