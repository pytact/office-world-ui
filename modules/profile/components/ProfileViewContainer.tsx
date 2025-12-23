// Profile View Container
// Container component following R7
// Following R17: UX Perception & Intent Governance

"use client";

import React, { useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context";
import { useUserUpdateForm } from "@/modules/users/forms/useUserUpdateForm";
import { useUserUpdateFormSubmit } from "@/modules/users/forms/useUserUpdateFormSubmit";
import { useGetUser } from "@/hooks/useUsers";
import { extractETagFromUpdatedAt } from "@/utils/helpers/etag";
import { Loader, ErrorState } from "@/components/ui";
import { ProfileView } from "./ProfileView";
import { useToast } from "@/context/ToastContext";

export function ProfileViewContainer() {
  const router = useRouter();
  const { user: authUser, updateUser } = useAuthContext();
  const { showSuccess, showError } = useToast();

  const { data: userData, isLoading, error, refetch } = useGetUser(
    authUser?.user_id || null
  );

  const form = useUserUpdateForm();

  // Reset form when user data loads
  // Preserve actual values from API response
  useEffect(() => {
    if (userData?.data) {
      // Use actual values from API - don't convert to null if they exist
      const firstName = userData.data.first_name ?? null;
      const lastName = userData.data.last_name ?? null;
      
      form.reset({
        first_name: firstName,
        last_name: lastName,
      });
    }
  }, [userData?.data, form]);

  const etag = useMemo(() => {
    if (!userData?.data) return null;
    return extractETagFromUpdatedAt(userData.data);
  }, [userData?.data]);

  const { submit, isLoading: isSubmitting } = useUserUpdateFormSubmit(
    form,
    authUser?.user_id || "",
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
  if (!authUser || !userData?.data) {
    return <ErrorState message="User not found" />;
  }

  return (
    <ProfileView
      email={authUser.email}
      role={authUser.role}
      form={form}
      onSubmit={form.handleSubmit(handleSubmit)}
      onCancel={handleCancel}
      isLoading={isSubmitting}
    />
  );
}

