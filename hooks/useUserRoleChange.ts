// User Role Change Hook
// Encapsulates role change modal business logic
// Following R5 rules: Business logic in hooks

import { useState, useCallback, useMemo } from "react";
import { UserRoleChange } from "@/utils/types/requests/user";
import { RoleResponse } from "@/utils/types/responses/user";

interface UseUserRoleChangeParams {
  currentRoleCode: string;
  availableRoles: RoleResponse[];
  currentUserId: string;
  targetUserId: string;
  currentUserRole: string;
}

interface UseUserRoleChangeReturn {
  selectedRoleCode: string;
  setSelectedRoleCode: (roleCode: string) => void;
  reset: () => void;
  getPayload: () => UserRoleChange;
  isValid: boolean;
  hasChanges: boolean;
  canChangeRole: boolean;
  filteredRoles: RoleResponse[];
  warningMessage: string | null;
  errors: Record<string, string>;
}

/**
 * Hook for managing user role change modal logic
 * Encapsulates role selection, validation, and business rules
 * @param params - Current role, available roles, and user context
 * @returns Role change state, handlers, validation, and business logic
 */
export function useUserRoleChange(
  params: UseUserRoleChangeParams
): UseUserRoleChangeReturn {
  const [selectedRoleCode, setSelectedRoleCode] = useState(
    params.currentRoleCode
  );

  const reset = useCallback(() => {
    setSelectedRoleCode(params.currentRoleCode);
  }, [params.currentRoleCode]);

  const getPayload = useCallback((): UserRoleChange => {
    return {
      role_code: selectedRoleCode,
    };
  }, [selectedRoleCode]);

  const hasChanges = useMemo(() => {
    return selectedRoleCode !== params.currentRoleCode;
  }, [selectedRoleCode, params.currentRoleCode]);

  const canChangeRole = useMemo(() => {
    // Cannot change own role
    if (params.currentUserId === params.targetUserId) {
      return false;
    }
    // SuperAdmin, CEO, HR can change roles
    return (
      params.currentUserRole === "superadmin" ||
      params.currentUserRole === "ceo" ||
      params.currentUserRole === "hr"
    );
  }, [
    params.currentUserId,
    params.targetUserId,
    params.currentUserRole,
  ]);

  const filteredRoles = useMemo(() => {
    let filtered = params.availableRoles;
    
    // Filter out SuperAdmin role for company users (only SuperAdmin can assign SuperAdmin)
    if (params.currentUserRole !== "superadmin") {
      filtered = filtered.filter((role) => role.code !== "superadmin");
    }
    
    // Filter out CEO role for HR users (HR cannot assign CEO role)
    if (params.currentUserRole === "hr") {
      filtered = filtered.filter((role) => role.code !== "ceo");
    }
    
    return filtered;
  }, [params.availableRoles, params.currentUserRole]);

  const warningMessage = useMemo(() => {
    // CEO cardinality warning
    if (selectedRoleCode === "ceo" && selectedRoleCode !== params.currentRoleCode) {
      return "Warning: Only one CEO is allowed per company. If the company already has a CEO, this change will fail.";
    }
    return null;
  }, [selectedRoleCode, params.currentRoleCode]);

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};

    if (!selectedRoleCode) {
      errs.roleCode = "Role is required";
    }

    if (!canChangeRole) {
      if (params.currentUserId === params.targetUserId) {
        errs.general = "You cannot change your own role";
      } else {
        errs.general = "You do not have permission to change user roles";
      }
    }

    return errs;
  }, [selectedRoleCode, canChangeRole, params.currentUserId, params.targetUserId]);

  const isValid = useMemo(() => {
    return (
      Object.keys(errors).length === 0 &&
      !!selectedRoleCode &&
      hasChanges &&
      canChangeRole
    );
  }, [errors, selectedRoleCode, hasChanges, canChangeRole]);

  return {
    selectedRoleCode,
    setSelectedRoleCode,
    reset,
    getPayload,
    isValid,
    hasChanges,
    canChangeRole,
    filteredRoles,
    warningMessage,
    errors,
  };
}

