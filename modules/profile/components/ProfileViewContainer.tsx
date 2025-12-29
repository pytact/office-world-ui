// Profile View Container
// Container component following R7
// Following R17: UX Perception & Intent Governance

"use client";

import React, { useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context";
import { useUserUpdateForm } from "@/modules/users/forms/useUserUpdateForm";
import { useUserUpdateFormSubmit } from "@/modules/users/forms/useUserUpdateFormSubmit";
import { useGetMe } from "@/hooks/useAuth";
import { extractETagFromUpdatedAt } from "@/utils/helpers/etag";
import { Loader, ErrorState } from "@/components/ui";
import { ProfileView } from "./ProfileView";
import { useToast } from "@/context/ToastContext";

export function ProfileViewContainer() {
  const router = useRouter();
  const { user: authUser, updateUser } = useAuthContext();
  const { showSuccess, showError } = useToast();

  const { data: userData, isLoading, error, refetch } = useGetMe();

  const form = useUserUpdateForm();

  // Extract user_id from /auth/me response
  const userId = useMemo(() => {
    return userData?.data?.user?.user_id || authUser?.user_id || "";
  }, [userData?.data?.user?.user_id, authUser?.user_id]);

  // Reset form when user data loads
  // Preserve actual values from API response
  useEffect(() => {
    if (userData?.data?.user) {
      // Use actual values from API - don't convert to null if they exist
      const firstName = userData.data.user.first_name ?? null;
      const lastName = userData.data.user.last_name ?? null;
      
      form.reset({
        first_name: firstName,
        last_name: lastName,
      });
    }
  }, [userData?.data?.user, form]);

  const etag = useMemo(() => {
    if (!userData?.data?.user) return null;
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
            first_name: values.first_name || "",
            last_name: values.last_name || "",
          });
        }
        showSuccess("Profile updated successfully");
        // Stay on profile page after update
      } catch (error) {
        showError("Failed to update profile");
      }
    },
    [submit, authUser, updateUser, showSuccess, showError]
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

  // Get email and role from /auth/me response or fallback to authUser
  const userEmail = userData.data.user.email || authUser.email;
  const userRole = userData.data.context?.role?.code || authUser.role;

  return (
    <ProfileView
      email={userEmail}
      role={userRole}
      form={form}
      onSubmit={form.handleSubmit(handleSubmit)}
      onCancel={handleCancel}
      isLoading={isSubmitting}
    />
  );
}

