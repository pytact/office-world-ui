// Leave Permissions Hook
// Encapsulates permission checks for leave operations
// Following R5 rules: Business logic in hooks

import { useMemo } from "react";
import { LeaveDetail } from "@/utils/types/responses/leave";

type UserRole = "superadmin" | "ceo" | "hr" | "manager" | "employee";

interface UseLeavePermissionsParams {
  userRole?: UserRole | null;
  employeeId?: string | null; // Current user's employee_id (for leave comparisons)
  leave?: LeaveDetail | null;
}

interface UseLeavePermissionsReturn {
  canCreateLeave: boolean;
  canApprove: boolean;
  canReject: boolean;
  canCancel: boolean;
  canViewAllLeaves: boolean;
  isReadOnly: boolean;
}

/**
 * Hook for checking leave-related permissions based on user role, user ID, and leave data
 * Encapsulates permission logic following F-009 feature spec
 * @param params - User role, user ID, and leave information
 * @returns Permission flags for leave operations
 */
export function useLeavePermissions(
  params?: UseLeavePermissionsParams
): UseLeavePermissionsReturn {
  const { userRole, employeeId, leave } = params || {};

  const permissions = useMemo(() => {
    if (!leave || !userRole) {
      // Default permissions when data is missing
      return {
        canCreateLeave: userRole === "employee" || userRole === "manager" || userRole === "hr" || userRole === "ceo",
        canApprove: false,
        canReject: false,
        canCancel: false,
        canViewAllLeaves: userRole === "hr" || userRole === "ceo" || userRole === "superadmin",
        isReadOnly: true,
      };
    }

    // Use employeeId for comparisons (leave requests use employee_id, not user_id)
    // Note: CEO might not have employeeId, so we need to handle null case
    const isApplicant = employeeId ? leave.employee_id === employeeId : false;
    const isManagerApprover = employeeId ? leave.manager_approver_id === employeeId : false;
    const isHRApprover = employeeId ? leave.hr_approver_id === employeeId : false;
    
    // For CEO: Check if applicant is HR by comparing applicant employee_id with hr_approver_id
    // If applicant is the HR approver, it's likely an HR leave (heuristic, backend will enforce)
    const isLikelyHRLeave = leave.employee_id === leave.hr_approver_id;
    
    const managerStatus = leave.manager_status;
    const hrStatus = leave.hr_status;
    
    const isPendingManager = managerStatus === "PENDING_MANAGER";
    const isApprovedManager = managerStatus === "APPROVED_MANAGER";
    const isPendingHR = hrStatus === "PENDING_HR";
    const isTerminal = 
      managerStatus === "REJECTED_MANAGER" ||
      hrStatus === "REJECTED_HR" ||
      managerStatus === "CANCELLED" ||
      hrStatus === "CANCELLED" ||
      hrStatus === "APPROVED_HR";

    // Determine if leave is pending (can be cancelled)
    const isPending = isPendingManager || (isApprovedManager && isPendingHR);

    // SuperAdmin: Cannot create or approve leaves (not part of workflow)
    if (userRole === "superadmin") {
      return {
        canCreateLeave: false,
        canApprove: false,
        canReject: false,
        canCancel: false,
        canViewAllLeaves: true,
        isReadOnly: true,
      };
    }

    // CEO: Can view all, approve/reject HR leave only
    // Per spec: "Approve or reject HR leave requests"
    // CEO can approve ANY HR leave (where applicant is HR)
    // For HR leave: manager stage is skipped, so manager_status = APPROVED_MANAGER and hr_status = PENDING_HR
    // Heuristic: If applicant employee_id === hr_approver_id, it's an HR leave
    // Backend will enforce the actual requirement
    if (userRole === "ceo") {
      // CEO can approve if:
      // 1. Leave is at HR stage (hr_status = PENDING_HR)
      // 2. Manager has approved (manager_status = APPROVED_MANAGER) - this is auto-set for HR leave
      // 3. Not in terminal state
      // 4. Not the applicant (CEO can't approve own leave)
      // 5. Likely an HR leave (applicant is the HR approver) - heuristic for identifying HR leave
      const canApproveHRLeave = 
        isPendingHR && 
        isApprovedManager && 
        !isTerminal &&
        !isApplicant && // Cannot approve own leave
        isLikelyHRLeave; // Heuristic: applicant is HR approver (indicates HR leave)

      return {
        canCreateLeave: true,
        canApprove: canApproveHRLeave,
        canReject: canApproveHRLeave,
        canCancel: isApplicant && isPending,
        canViewAllLeaves: true,
        isReadOnly: false,
      };
    }

    // HR: Can view all, approve/reject at HR stage, cannot approve own leave
    // HR can only approve/reject leaves where they are the assigned HR approver
    // Per spec: "Approve or reject employee leave requests (after manager approval)"
    // and "Approve or reject manager leave requests"
    // But user requirement: HR should only see approve/reject buttons when they are the assigned HR approver
    // IMPORTANT: HR cannot approve their own leave (HR leave) - only CEO can approve HR leave
    if (userRole === "hr") {
      // HR cannot approve HR leave (where applicant is HR)
      // HR leave is identified by: applicant employee_id === hr_approver_id
      const isHRLeave = isLikelyHRLeave; // Heuristic: applicant is HR approver
      
      const canApproveAtHRStage = 
        isPendingHR && 
        isApprovedManager && 
        !isTerminal &&
        isHRApprover && // HR must be the assigned HR approver
        !isApplicant && // Cannot approve own leave
        !isHRLeave; // HR cannot approve HR leave (only CEO can)

      return {
        canCreateLeave: true,
        canApprove: canApproveAtHRStage,
        canReject: canApproveAtHRStage,
        canCancel: isApplicant && isPending,
        canViewAllLeaves: true,
        isReadOnly: false,
      };
    }

    // Manager: Can approve/reject at manager stage, cannot approve own leave
    if (userRole === "manager") {
      const canApproveAtManagerStage = 
        isPendingManager && 
        !isTerminal &&
        isManagerApprover &&
        !isApplicant; // Cannot approve own leave

      return {
        canCreateLeave: true,
        canApprove: canApproveAtManagerStage,
        canReject: canApproveAtManagerStage,
        canCancel: isApplicant && isPending,
        canViewAllLeaves: false, // Only sees assigned leaves
        isReadOnly: false,
      };
    }

        // Employee: Can create, cancel own pending leaves, cannot approve/reject
        // Employee can cancel leave if not approved by Manager (manager_status = PENDING_MANAGER)
        if (userRole === "employee") {
          const canCancelPending = isApplicant && isPendingManager; // Can cancel only if manager hasn't approved yet
          
          return {
            canCreateLeave: true,
            canApprove: false,
            canReject: false,
            canCancel: canCancelPending,
            canViewAllLeaves: false, // Only sees own leaves
            isReadOnly: false,
          };
        }

    // Default: no permissions
    return {
      canCreateLeave: false,
      canApprove: false,
      canReject: false,
      canCancel: false,
      canViewAllLeaves: false,
      isReadOnly: true,
    };
  }, [userRole, employeeId, leave]);

  return permissions;
}

