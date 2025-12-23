// Employee Permissions Hook
// Encapsulates role-based permission checks for Employee Management
// Following R5 rules: Business logic in hooks
// Uses AuthContext for role information (R7: Context consumed via hooks)

import { useAuthContext } from "@/context/AuthContext";

interface UseEmployeePermissionsReturn {
  // Role checks
  isCEO: boolean;
  isHR: boolean;
  isManager: boolean;
  isEmployee: boolean;
  isSuperAdmin: boolean;

  // Permission checks
  canViewEmployeeList: boolean;
  canViewEmployeeDetail: boolean;
  canCreateEmployee: boolean;
  canUpdateEmployee: boolean;
  canDeleteEmployee: boolean;
  canViewOwnProfile: boolean;

  // Access helpers
  hasEmployeeAccess: boolean;
  canAccessEmployeeManagement: boolean;
}

/**
 * Hook for Employee Management role-based permissions
 * Encapsulates all permission logic based on user role
 * Uses AuthContext to get current user role
 * 
 * Permission Matrix:
 * - CEO: Full access (create, read, update, delete, view all)
 * - HR: Full access (create, read, update, delete, view all)
 * - Manager: Read-only access (view list and detail, limited fields, cannot see CEO/HR)
 * - Employee: Self-profile only (view own profile, no list/detail access)
 * - SuperAdmin: No access (explicitly excluded)
 * 
 * @returns Permission flags and role checks
 */
export function useEmployeePermissions(): UseEmployeePermissionsReturn {
  const { user } = useAuthContext();

  // Role checks
  const isCEO = user?.role === "ceo";
  const isHR = user?.role === "hr";
  const isManager = user?.role === "manager";
  const isEmployee = user?.role === "employee";
  const isSuperAdmin = user?.is_super_admin ?? false;

  // Permission checks based on role
  const canViewEmployeeList = isCEO || isHR || isManager;
  const canViewEmployeeDetail = isCEO || isHR || isManager;
  const canCreateEmployee = isCEO || isHR;
  const canUpdateEmployee = isCEO || isHR;
  const canDeleteEmployee = isCEO || isHR;
  const canViewOwnProfile = isEmployee || isCEO || isHR || isManager;

  // Access helpers
  const hasEmployeeAccess = canViewEmployeeList || canViewOwnProfile;
  const canAccessEmployeeManagement = canViewEmployeeList || canCreateEmployee;

  return {
    isCEO,
    isHR,
    isManager,
    isEmployee,
    isSuperAdmin,
    canViewEmployeeList,
    canViewEmployeeDetail,
    canCreateEmployee,
    canUpdateEmployee,
    canDeleteEmployee,
    canViewOwnProfile,
    hasEmployeeAccess,
    canAccessEmployeeManagement,
  };
}

