// User Mutations Hook
// Combines all user mutations with business logic and error handling

import { useCallback } from "react";
import {
  useCreateUser,
  useUpdateUser,
  useChangeUserRole,
  useUpdateUserStatus,
  useDeactivateUser,
  useReactivateUser,
  useResendInvite,
} from "./useUsers";
import {
  UserInviteCreate,
  UserRoleChange,
  UserStatusUpdate,
  UserDeactivate,
  UserReactivate,
} from "@/utils/types/requests/user";

interface UseUserMutationsReturn {
  inviteUser: (payload: UserInviteCreate) => Promise<void>;
  changeUserRole: (user_id: string, payload: UserRoleChange, etag?: string) => Promise<void>;
  updateUserStatus: (user_id: string, status: "active" | "inactive", etag?: string) => Promise<void>;
  deactivateUser: (user_id: string, etag?: string) => Promise<void>; // @deprecated Use updateUserStatus instead
  reactivateUser: (user_id: string, etag?: string) => Promise<void>; // @deprecated Use updateUserStatus instead
  resendInvitation: (user_id: string) => Promise<void>;
  isInviting: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isReactivating: boolean;
  isResending: boolean;
}

/**
 * Hook that combines all user mutations with business logic
 * Encapsulates mutation handling and error management
 * @returns Mutation functions and loading states
 */
export function useUserMutations(): UseUserMutationsReturn {
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const changeRoleMutation = useChangeUserRole();
  const updateStatusMutation = useUpdateUserStatus();
  const resendMutation = useResendInvite();

  const inviteUser = useCallback(
    async (payload: UserInviteCreate) => {
      console.log("[useUserMutations] inviteUser called with payload:", payload);
      console.log("[useUserMutations] createMutation:", createMutation);
      console.log("[useUserMutations] isInviting:", createMutation.isPending);
      
      try {
        const result = await createMutation.mutateAsync(payload);
        console.log("[useUserMutations] Mutation successful, result:", result);
        return result;
      } catch (error) {
        console.error("[useUserMutations] Mutation error:", error);
        throw error;
      }
    },
    [createMutation]
  );

  const changeUserRole = useCallback(
    async (user_id: string, payload: UserRoleChange, etag?: string) => {
      await changeRoleMutation.mutateAsync({ user_id, payload, etag });
    },
    [changeRoleMutation]
  );

  const updateUserStatus = useCallback(
    async (user_id: string, status: "active" | "inactive", etag?: string) => {
      const payload: UserStatusUpdate = {
        user_id,
        status,
      };
      await updateStatusMutation.mutateAsync({ user_id, payload, etag });
    },
    [updateStatusMutation]
  );

  const deactivateUser = useCallback(
    async (user_id: string, etag?: string) => {
      // Use new API internally
      await updateUserStatus(user_id, "inactive", etag);
    },
    [updateUserStatus]
  );

  const reactivateUser = useCallback(
    async (user_id: string, etag?: string) => {
      // Use new API internally
      await updateUserStatus(user_id, "active", etag);
    },
    [updateUserStatus]
  );

  const resendInvitation = useCallback(
    async (user_id: string) => {
      await resendMutation.mutateAsync(user_id);
    },
    [resendMutation]
  );

  return {
    inviteUser,
    changeUserRole,
    updateUserStatus,
    deactivateUser,
    reactivateUser,
    resendInvitation,
    isInviting: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: updateStatusMutation.isPending,
    isReactivating: updateStatusMutation.isPending,
    isResending: resendMutation.isPending,
  };
}

