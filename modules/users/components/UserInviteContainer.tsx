// UserInvite Container
// SCR_USER_INVITE - Container component following R7 and R10

"use client";

import React, { useCallback, useMemo } from "react";
import { useUserInviteForm } from "@/modules/users/forms/useUserInviteForm";
import { useUserInviteFormSubmit } from "@/modules/users/forms/useUserInviteFormSubmit";
import { useAuthContext } from "@/context";
import { useRoles, useCompanies } from "@/hooks/useUsers";
import { userRoutes } from "@/utils/routes";
import { UserInvite } from "./UserInvite";
import { Loader, ErrorState } from "@/components/ui";

export function UserInviteContainer() {
  const { isSuperAdmin, user } = useAuthContext();
  const form = useUserInviteForm();
  const { submit, isLoading } = useUserInviteFormSubmit(form);

  // Fetch roles for dropdown
  const { data: rolesData, isLoading: isLoadingRoles, error: rolesError } = useRoles();
  
  // Fetch companies for SuperAdmin only (hook already has enabled check)
  const { data: companiesData, isLoading: isLoadingCompanies, error: companiesError } = useCompanies();

  // Get current user role
  const currentUserRole = user?.role?.toLowerCase() || "";
  const isHR = currentUserRole === "hr";

  // Transform roles data for Select component
  // HR can only invite Manager and Employee roles
  // CEO cannot invite CEO role
  // Non-SuperAdmin users cannot invite SuperAdmin role
  const roleOptions = useMemo(() => {
    if (!rolesData?.data?.items) {
      return [{ value: "", label: "Select Role" }];
    }
    // Filter roles based on user permissions
    const filteredRoles = rolesData.data.items.filter((role) => {
      // HR can only invite Manager and Employee (not CEO, not HR)
      if (isHR) {
        return role.code === "manager" || role.code === "employee";
      }
      // CEO cannot invite CEO role
      if (role.code === "ceo" && currentUserRole === "ceo") return false;
      // Non-SuperAdmin users cannot invite SuperAdmin
      if (role.code === "superadmin" && !isSuperAdmin) return false;
      return true;
    });
    
    return [
      { value: "", label: "Select Role" },
      ...filteredRoles.map((role) => ({
        value: role.code,
        label: role.name,
      })),
    ];
  }, [rolesData, isHR, isSuperAdmin, currentUserRole]);

  // Transform companies data for Select component (SuperAdmin only)
  const companyOptions = useMemo(() => {
    if (!isSuperAdmin || !companiesData?.data?.items) {
      return [];
    }
    return companiesData.data.items.map((company) => ({
      value: company.slug,
      label: company.name,
    }));
  }, [companiesData, isSuperAdmin]);

  // Memoize the form submit handler to prevent recreation on every render
  // form.handleSubmit returns a function that handles validation and calls our submit
  const handleFormSubmit = useMemo(
    () => {
      console.log("[UserInviteContainer] Creating handleFormSubmit");
      return form.handleSubmit(
        async (values) => {
          console.log("[UserInviteContainer] Form validation passed, values:", values);
          try {
            await submit(values);
            console.log("[UserInviteContainer] Submit completed successfully");
          } catch (error) {
            console.error("[UserInviteContainer] Submit error:", error);
            throw error;
          }
        },
        (errors) => {
          console.error("[UserInviteContainer] Form validation failed:", errors);
        }
      );
    },
    [form, submit]
  );

  // Show loading state while fetching reference data
  if (isLoadingRoles || (isSuperAdmin && isLoadingCompanies)) {
    return <Loader message="Loading form data..." />;
  }

  // Show error state if reference data failed to load
  if (rolesError || (isSuperAdmin && companiesError)) {
    return (
      <ErrorState
        message={
          rolesError
            ? `Failed to load roles: ${rolesError.message}`
            : isSuperAdmin && companiesError
            ? `Failed to load companies: ${companiesError.message}`
            : "Failed to load form data. Please refresh the page."
        }
        onRetry={() => window.location.reload()}
      />
    );
  }

  console.log("[UserInviteContainer] Rendering UserInvite", { 
    handleFormSubmit: typeof handleFormSubmit,
    isLoading,
    roleOptionsCount: roleOptions.length 
  });

  return (
    <UserInvite
      form={form}
      onSubmit={handleFormSubmit}
      isLoading={isLoading}
      isSuperAdmin={isSuperAdmin}
      roleOptions={roleOptions}
      companyOptions={companyOptions}
    />
  );
}
