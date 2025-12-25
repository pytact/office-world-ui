// Password Reset Container
// Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePasswordResetSubmitForm } from "@/modules/auth/forms";
import { useSubmitPasswordReset } from "@/hooks/useAuth";
import { PasswordResetForm } from "./PasswordResetForm";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/context/ToastContext";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";

export function PasswordResetContainer() {
  const params = useParams();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const token = params?.token as string;
  const form = usePasswordResetSubmitForm();
  const submitResetMutation = useSubmitPasswordReset();
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  // Validate token on mount (optional - can be done server-side)
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
    } else {
      // Token validation could be done here if needed
      // For now, we'll assume token is valid and let API handle validation
      setIsTokenValid(true);
    }
  }, [token]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!token) {
        showError("Invalid reset token");
        return;
      }

      // Trigger validation
      const isValid = await form.trigger();
      if (!isValid) {
        return;
      }

      try {
        const formValues = form.getValues();
        await submitResetMutation.mutateAsync({
          token,
          payload: {
            password: formValues.password,
            password_confirm: formValues.password_confirm,
          },
        });

        showSuccess("Password reset successfully. Please log in with your new password.");
        // Redirect to login after short delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (error) {
        const normalizedError = normalizeAPIError(error);
        
        // Map API errors to form fields
        if (normalizedError.fieldErrors) {
          Object.entries(normalizedError.fieldErrors).forEach(([field, message]) => {
            if (field === "password" || field === "password_confirm") {
              form.setError(field, {
                type: "server",
                message,
              });
            }
          });
        }

        // Show general error
        const errorMessage =
          normalizedError.message || "Failed to reset password. Please try again.";
        form.setError("root", {
          type: "server",
          message: errorMessage,
        });
        showError(errorMessage);
      }
    },
    [form, submitResetMutation, token, router, showSuccess, showError]
  );

  // Loading state
  if (isTokenValid === null) {
    return <Loader message="Validating reset token..." />;
  }

  // Error state - invalid token
  if (isTokenValid === false || !token) {
    return (
      <ErrorState
        message="Invalid or missing reset token"
        onRetry={() => router.push("/password-reset")}
      />
    );
  }

  // Map form errors
  const formErrors = Object.fromEntries(
    Object.entries(form.formState.errors).map(([key, error]) => [
      key,
      error?.message || "",
    ])
  );

  return (
    <PasswordResetForm
      form={form}
      onSubmit={handleSubmit}
      isLoading={submitResetMutation.isPending}
      errors={formErrors}
      rootError={form.formState.errors.root?.message}
    />
  );
}

