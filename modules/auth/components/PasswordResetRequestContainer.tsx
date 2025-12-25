// Password Reset Request Container
// Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { usePasswordResetRequestForm } from "@/modules/auth/forms";
import { useRequestPasswordReset } from "@/hooks/useAuth";
import { PasswordResetRequestForm } from "./PasswordResetRequestForm";
import { useToast } from "@/context/ToastContext";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";

export function PasswordResetRequestContainer() {
  const router = useRouter();
  const { showError } = useToast();
  const form = usePasswordResetRequestForm();
  const requestResetMutation = useRequestPasswordReset();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Trigger validation
      const isValid = await form.trigger();
      if (!isValid) {
        return;
      }

      try {
        const formValues = form.getValues();
        await requestResetMutation.mutateAsync({
          email: formValues.email,
        });

        // Success - show success message
        setSuccessMessage(
          "If an account with that email exists, we've sent password reset instructions. Please check your email."
        );
      } catch (error) {
        const normalizedError = normalizeAPIError(error);
        
        // Map API errors to form fields
        if (normalizedError.fieldErrors) {
          Object.entries(normalizedError.fieldErrors).forEach(([field, message]) => {
            form.setError(field as keyof typeof formValues, {
              type: "server",
              message,
            });
          });
        }

        // Show general error
        const errorMessage =
          normalizedError.message || "Failed to send reset email. Please try again.";
        form.setError("root", {
          type: "server",
          message: errorMessage,
        });
        showError(errorMessage);
      }
    },
    [form, requestResetMutation, showError]
  );

  const handleBack = useCallback(() => {
    router.push("/login");
  }, [router]);

  // Map form errors
  const formErrors = Object.fromEntries(
    Object.entries(form.formState.errors).map(([key, error]) => [
      key,
      error?.message || "",
    ])
  );

  return (
    <PasswordResetRequestForm
      form={form}
      onSubmit={handleSubmit}
      onBack={handleBack}
      isLoading={requestResetMutation.isPending}
      errors={formErrors}
      rootError={form.formState.errors.root?.message}
      successMessage={successMessage}
    />
  );
}

