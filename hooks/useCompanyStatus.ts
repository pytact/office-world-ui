// Company Status Hook
// Encapsulates status-related business logic and derived fields
// Following R5 rules: Business logic in hooks

import { useMemo } from "react";
import { CompanyResponse, CompanyProfileResponse } from "@/utils/types/responses/company";

interface UseCompanyStatusParams {
  isActive: boolean;
  isDeleted?: boolean;
  userRole?: "superadmin" | "ceo" | "hr" | "manager" | "employee";
}

interface UseCompanyStatusReturn {
  statusLabel: string;
  statusBadge: {
    label: string;
    variant: "success" | "error" | "warning" | "default";
  };
  canActivate: boolean;
  canDeactivate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isEditable: boolean;
  isReadOnly: boolean;
}

/**
 * Hook for deriving company status-related fields and action permissions
 * Encapsulates status label derivation and action state logic
 * @param params - Company status and user role information
 * @returns Status labels, badges, and action permissions
 */
export function useCompanyStatus(
  params: UseCompanyStatusParams
): UseCompanyStatusReturn {
  const { isActive, isDeleted = false, userRole } = params;

  const statusLabel = useMemo(() => {
    return isActive ? "Active" : "Inactive";
  }, [isActive]);

  const statusBadge = useMemo(() => {
    if (isDeleted) {
      return { label: "Deleted", variant: "default" as const };
    }
    if (isActive) {
      return { label: "Active", variant: "success" as const };
    }
    return { label: "Inactive", variant: "error" as const };
  }, [isActive, isDeleted]);

  const canActivate = useMemo(() => {
    return !isActive && userRole === "superadmin";
  }, [isActive, userRole]);

  const canDeactivate = useMemo(() => {
    return isActive && userRole === "superadmin";
  }, [isActive, userRole]);

  const canEdit = useMemo(() => {
    return userRole === "superadmin";
  }, [userRole]);

  const canDelete = useMemo(() => {
    return userRole === "superadmin";
  }, [userRole]);

  const isEditable = useMemo(() => {
    // For CEO/HR: can only edit when company is active
    if (userRole === "ceo" || userRole === "hr") {
      return isActive === true;
    }
    // For SuperAdmin: can always edit
    return userRole === "superadmin";
  }, [isActive, userRole]);

  const isReadOnly = useMemo(() => {
    return !isEditable;
  }, [isEditable]);

  return {
    statusLabel,
    statusBadge,
    canActivate,
    canDeactivate,
    canEdit,
    canDelete,
    isEditable,
    isReadOnly,
  };
}

/**
 * Hook for deriving status from CompanyResponse
 * Convenience hook that extracts status fields from company response
 * @param companyData - Company response data
 * @param userRole - Current user role
 * @returns Status labels, badges, and action permissions
 */
export function useCompanyStatusFromResponse(
  companyData: CompanyResponse | null | undefined,
  userRole?: "superadmin" | "ceo" | "hr" | "manager" | "employee"
): UseCompanyStatusReturn {
  return useCompanyStatus({
    isActive: companyData?.is_active ?? false,
    isDeleted: companyData?.is_deleted ?? false,
    userRole,
  });
}

/**
 * Hook for deriving status from CompanyProfileResponse
 * Convenience hook for CEO/HR profile view
 * @param profileData - Company profile response data
 * @param userRole - Current user role (should be "ceo" or "hr")
 * @returns Status labels, badges, and action permissions
 */
export function useCompanyProfileStatus(
  profileData: CompanyProfileResponse | null | undefined,
  userRole?: "superadmin" | "ceo" | "hr" | "manager" | "employee"
): UseCompanyStatusReturn {
  return useCompanyStatus({
    isActive: profileData?.is_active ?? false,
    isDeleted: false, // Profile response doesn't include is_deleted
    userRole,
  });
}

