// User Detail Actions Hook
// Encapsulates user detail screen business logic
// Following R5 rules: Business logic in hooks

import { useState, useCallback, useMemo } from "react";
import { UserDetailResponse } from "@/utils/types/responses/user";

interface UseUserDetailActionsParams {
  userData?: UserDetailResponse | null;
}

interface UseUserDetailActionsReturn {
  isEditMode: boolean;
  enterEditMode: () => void;
  exitEditMode: () => void;
  etag: string | null;
  setEtag: (etag: string | null) => void;
  canEdit: boolean;
  canChangeRole: boolean;
  canDeactivate: boolean;
  canReactivate: boolean;
  canResendInvite: boolean;
  canReassignCompany: boolean;
  currentUserRole: string | null;
  viewedUserId: string | null;
}

/**
 * Hook for managing user detail screen actions and permissions
 * Encapsulates edit mode, ETag management, and action visibility logic
 * @param params - User data and context
 * @returns Action state, handlers, and permission flags
 */
export function useUserDetailActions(
  params?: UseUserDetailActionsParams
): UseUserDetailActionsReturn {
  const [isEditMode, setIsEditMode] = useState(false);
  const [etag, setEtag] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [viewedUserId, setViewedUserId] = useState<string | null>(null);

  // Extract ETag from response headers (would need to be passed from component)
  // For now, we'll manage it via setEtag callback
  const handleEtagUpdate = useCallback((newEtag: string | null) => {
    setEtag(newEtag);
  }, []);

  // Update state when user data changes
  useMemo(() => {
    if (params?.userData?.data) {
      setViewedUserId(params.userData.data.user_id);
      // ETag would come from response headers, stored here for convenience
      // In real implementation, extract from response.headers['etag']
    }
  }, [params?.userData]);

  const enterEditMode = useCallback(() => {
    setIsEditMode(true);
  }, []);

  const exitEditMode = useCallback(() => {
    setIsEditMode(false);
  }, []);

  // Permission logic (would typically come from auth context)
  // For now, these are computed based on user role comparison
  const canEdit = useMemo(() => {
    // Users can edit their own details, or SuperAdmin/CEO/HR can edit any user
    // This logic would be enhanced with actual auth context
    return true; // Placeholder - should check against current user role
  }, []);

  const canChangeRole = useMemo(() => {
    // SuperAdmin, CEO, HR can change roles
    // Cannot change own role
    return (
      (currentUserRole === "superadmin" ||
        currentUserRole === "ceo" ||
        currentUserRole === "hr") &&
      viewedUserId !== null // Would compare with current user ID
    );
  }, [currentUserRole, viewedUserId]);

  const canDeactivate = useMemo(() => {
    // SuperAdmin, CEO, HR can deactivate
    // Cannot deactivate own account
    return (
      (currentUserRole === "superadmin" ||
        currentUserRole === "ceo" ||
        currentUserRole === "hr") &&
      viewedUserId !== null // Would compare with current user ID
    );
  }, [currentUserRole, viewedUserId]);

  const canReactivate = useMemo(() => {
    // SuperAdmin, CEO, HR can reactivate
    return (
      currentUserRole === "superadmin" ||
      currentUserRole === "ceo" ||
      currentUserRole === "hr"
    );
  }, [currentUserRole]);

  const canResendInvite = useMemo(() => {
    // SuperAdmin, CEO, HR can resend invites
    // Only if user can_resend_invite is true
    return (
      (currentUserRole === "superadmin" ||
        currentUserRole === "ceo" ||
        currentUserRole === "hr") &&
      (params?.userData?.data?.can_resend_invite ?? false)
    );
  }, [currentUserRole, params?.userData?.data?.can_resend_invite]);

  const canReassignCompany = useMemo(() => {
    // Only SuperAdmin can reassign companies
    return currentUserRole === "superadmin";
  }, [currentUserRole]);

  return {
    isEditMode,
    enterEditMode,
    exitEditMode,
    etag,
    setEtag: handleEtagUpdate,
    canEdit,
    canChangeRole,
    canDeactivate,
    canReactivate,
    canResendInvite,
    canReassignCompany,
    currentUserRole,
    viewedUserId,
  };
}

