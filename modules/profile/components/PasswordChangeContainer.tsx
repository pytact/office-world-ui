// Password Change Container
// Container component following R7

"use client";

import React, { useCallback, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context";
import { useUpdateUser } from "@/hooks/useUsers";
import { useGetUser } from "@/hooks/useUsers";
import { extractETagFromUpdatedAt } from "@/utils/helpers/etag";
import { PasswordChange } from "./PasswordChange";
import { useToast } from "@/context/ToastContext";

export function PasswordChangeContainer() {
  const router = useRouter();
  const { user: authUser, updateUser } = useAuthContext();
  const { showSuccess, showError } = useToast();
  const updateUserMutation = useUpdateUser();

  // Get user data to extract ETag
  const { data: userData } = useGetUser(authUser?.user_id || null);

  const etag = useMemo(() => {
    if (!userData?.data) return null;
    return extractETagFromUpdatedAt(userData.data);
  }, [userData?.data]);

  const [error, setError] = useState<string | undefined>();

  const handleCancel = useCallback(() => {
    router.push("/me/profile");
  }, [router]);

  const handleSubmit = useCallback(
    async (currentPassword: string, newPassword: string) => {
      setError(undefined);

      if (!authUser?.user_id) {
        setError("User ID not found");
        return;
      }

      if (!etag) {
        setError("Unable to verify user data. Please refresh and try again.");
        return;
      }

      if (!currentPassword || !newPassword) {
        setError("Current password and new password are required");
        return;
      }

      try {
        // Update password using PATCH /v1/users/{user_id}
        await updateUserMutation.mutateAsync({
          user_id: authUser.user_id,
          payload: {
            current_password: currentPassword,
            new_password: newPassword,
          },
          etag,
        });

        showSuccess("Password changed successfully");
        router.push("/me/profile");
      } catch (error: any) {
        const errorMessage = error?.message || "Failed to change password";
        setError(errorMessage);
        showError(errorMessage);
      }
    },
    [authUser, etag, updateUserMutation, router, showSuccess, showError]
  );

  return (
    <PasswordChange
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={updateUserMutation.isPending}
      error={error}
    />
  );
}

