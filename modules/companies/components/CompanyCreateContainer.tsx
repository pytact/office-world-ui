// Company Create Container
// SCR_COMPANY_CREATE - Container component following R7
// Uses hooks for all logic, no API calls

"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCompanyForm, generateSlugFromName } from "@/hooks/useCompanyForm";
import { useCreateCompany } from "@/hooks/useCompanies";
import { useAuthContext } from "@/context";
import { companyRoutes } from "@/utils/routes";
import { AccessDenied } from "@/components/ui";
import { CompanyCreate } from "./CompanyCreate";

export function CompanyCreateContainer() {
  const router = useRouter();
  const { isSuperAdmin } = useAuthContext();
  const form = useCompanyForm();
  const createMutation = useCreateCompany();

  // SuperAdmin-only access
  if (!isSuperAdmin) {
    return <AccessDenied message="Only SuperAdmin can create companies" />;
  }

  const handleSlugGeneration = useCallback(
    (name: string) => {
      const generatedSlug = generateSlugFromName(name);
      form.setSlug(generatedSlug);
    },
    [form]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!form.isCreateValid) {
        return;
      }

      try {
        const payload = form.getCreatePayload();
        const response = await createMutation.mutateAsync(payload);
        
        // Navigate to company detail on success
        router.push(companyRoutes.platform.detail(response.data.company_id));
      } catch (error) {
        // Error handling is done by the mutation hook
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to create company:", error);
        }
      }
    },
    [form, createMutation, router]
  );

  const handleCancel = useCallback(() => {
    router.push(companyRoutes.platform.list);
  }, [router]);

  const handleSubmitForm = useCallback(
    (e: React.FormEvent) => {
      handleSubmit(e);
    },
    [handleSubmit]
  );

  return (
    <CompanyCreate
      form={form}
      onSubmit={handleSubmitForm}
      onCancel={handleCancel}
      onSlugGenerate={handleSlugGeneration}
      isLoading={createMutation.isPending}
      errors={form.errors}
    />
  );
}

