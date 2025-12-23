// UserEdit Container
// User Edit Page - Container component following R7 and R10
// Route: /users/:id/edit

"use client";

import React, { useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { useMappedUser } from "@/hooks/useMappedUser";
import { useUserUpdateForm } from "@/modules/users/forms/useUserUpdateForm";
import { useUserUpdateFormSubmit } from "@/modules/users/forms/useUserUpdateFormSubmit";
import { useRouter } from "next/navigation";
import { Loader, ErrorState } from "@/components/ui";
import { UserEdit } from "./UserEdit";
import { userRoutes } from "@/utils/routes";

export function UserEditContainer() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string | null;

  const { user, isLoading, error, etag } = useMappedUser(userId);

  const formDefaultValues = useMemo(
    () => ({
      first_name: user?.firstName || null,
      last_name: user?.lastName || null,
    } as const),
    [user?.firstName, user?.lastName]
  );

  const form = useUserUpdateForm({
    defaultValues: formDefaultValues,
  });

  const { submit, isLoading: isSubmitting } = useUserUpdateFormSubmit(
    form,
    userId || "",
    etag || undefined // ETag is required for PATCH operations
  );

  const handleCancel = React.useCallback(() => {
    if (userId) {
      router.push(userRoutes.shared.detail(userId));
    }
  }, [router, userId]);

  const handleSubmit = React.useCallback(
    async (values: Parameters<typeof submit>[0]) => {
      try {
        await submit(values);
        if (userId) {
          router.push(userRoutes.shared.detail(userId));
        }
      } catch (error) {
        // Error handled by form
      }
    },
    [submit, router, userId]
  );

  if (isLoading) return <Loader message="Loading user details..." />;
  if (error)
    return (
      <ErrorState
        message={error.message || "Failed to load user details"}
        onRetry={useCallback(() => {
          router.refresh();
        }, [router])}
      />
    );
  if (!user) return <ErrorState message="User not found" />;

  return (
    <UserEdit
      user={user}
      form={form}
      onSubmit={form.handleSubmit(handleSubmit)}
      onCancel={handleCancel}
      isLoading={isSubmitting}
    />
  );
}

