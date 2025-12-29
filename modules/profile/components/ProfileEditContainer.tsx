// Profile Edit Container
// Container component following R7

"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context";
import { useUserUpdateForm } from "@/modules/users/forms/useUserUpdateForm";
import { useUserUpdateFormSubmit } from "@/modules/users/forms/useUserUpdateFormSubmit";
import { useGetMe } from "@/hooks/useAuth";
import { extractETagFromUpdatedAt } from "@/utils/helpers/etag";
import { Loader, ErrorState } from "@/components/ui";
import { ProfileEdit } from "./ProfileEdit";
import { useToast } from "@/context/ToastContext";

export function ProfileEditContainer() {
  const router = useRouter();
  const { user: authUser, updateUser } = useAuthContext();
  const { showSuccess, showError } = useToast();

  const { data: userData, isLoading, error, refetch } = useGetMe();

  // Extract user_id from /auth/me response
  const userId = useMemo(() => {
    return userData?.data?.user?.user_id || authUser?.user_id || "";
  }, [userData?.data?.user?.user_id, authUser?.user_id]);

  const formDefaultValues = useMemo(
    () => ({
      first_name: userData?.data?.user?.first_name || null,
      last_name: userData?.data?.user?.last_name || null,
    } as const),
    [userData?.data?.user?.first_name, userData?.data?.user?.last_name]
  );

  const form = useUserUpdateForm({
    defaultValues: formDefaultValues,
  });

  const etag = useMemo(() => {
    if (!userData?.data?.user) return null;
    // Extract ETag from updated_at field
    return extractETagFromUpdatedAt(userData.data.user);
  }, [userData?.data?.user]);

  const { submit, isLoading: isSubmitting } = useUserUpdateFormSubmit(
    form,
    userId,
    etag
  );

  const handleCancel = useCallback(() => {
    if (authUser?.is_super_admin) {
      router.push("/platform/dashboard");
    } else {
      router.push("/company/dashboard");
    }
  }, [router, authUser]);

  const handleSubmit = useCallback(
    async (values: Parameters<typeof submit>[0]) => {
      try {
        await submit(values);
        // Update auth context with new name
        if (authUser) {
          updateUser({
            first_name: values.first_name || authUser.first_name,
            last_name: values.last_name || authUser.last_name,
          });
        }
        showSuccess("Profile updated successfully");
        // Navigation handled by router based on current path
        if (authUser?.is_super_admin) {
          router.push("/platform/dashboard");
        } else {
          router.push("/company/dashboard");
        }
      } catch (error) {
        showError("Failed to update profile");
      }
    },
    [submit, router, authUser, updateUser, showSuccess, showError]
  );

  if (isLoading) return <Loader message="Loading profile..." />;
  if (error)
    return (
      <ErrorState
        message={error.message || "Failed to load profile"}
        onRetry={() => refetch()}
      />
    );
  if (!authUser || !userData?.data?.user) {
    return <ErrorState message="User not found" />;
  }

  // Get email from /auth/me response or fallback to authUser
  const userEmail = userData.data.user.email || authUser.email;

  return (
    <ProfileEdit
      email={userEmail}
      form={form}
      onSubmit={form.handleSubmit(handleSubmit)}
      onCancel={handleCancel}
      isLoading={isSubmitting}
    />
  );
}

