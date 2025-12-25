// User Activation Container
// Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActivationForm } from "@/modules/auth/forms";
import { useValidateActivationToken, useActivate } from "@/hooks/useAuth";
import { ActivationForm } from "./ActivationForm";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/context/ToastContext";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";

export function ActivationContainer() {
  const params = useParams();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const token = params?.token as string;
  const form = useActivationForm();

  // Validate token on mount
  const {
    data: validationData,
    isLoading: isValidating,
    error: validationError,
  } = useValidateActivationToken(token || null);

  const activateMutation = useActivate();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!token) {
        showError("Invalid activation token");
        return;
      }

      // Trigger validation
      const isValid = await form.trigger();
      if (!isValid) {
        return;
      }

      try {
        const formValues = form.getValues();
        await activateMutation.mutateAsync({
          token,
          payload: {
            first_name: formValues.first_name,
            last_name: formValues.last_name,
            password: formValues.password,
            password_confirm: formValues.password_confirm,
          },
        });

        showSuccess("Account activated successfully! Please log in with your credentials.");
        // Redirect to login after short delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (error) {
        const normalizedError = normalizeAPIError(error);
        
        // Map API errors to form fields
        if (normalizedError.fieldErrors) {
          Object.entries(normalizedError.fieldErrors).forEach(([field, message]) => {
            if (
              field === "first_name" ||
              field === "last_name" ||
              field === "password" ||
              field === "password_confirm"
            ) {
              form.setError(field as any, {
                type: "server",
                message,
              });
            }
          });
        }

        // Show general error
        const errorMessage =
          normalizedError.message || "Failed to activate account. Please try again.";
        form.setError("root", {
          type: "server",
          message: errorMessage,
        });
        showError(errorMessage);
      }
    },
    [form, activateMutation, token, router, showSuccess, showError]
  );

  // Loading state - validating token
  if (isValidating) {
    return <Loader message="Validating invitation token..." />;
  }

  // Error state - invalid or expired token
  if (validationError || !token) {
    const errorMessage =
      validationError
        ? (normalizeAPIError(validationError).message || "Invalid or expired invitation token")
        : "Invalid or missing activation token";
    
    return (
      <ErrorState
        message={errorMessage}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Token validation failed (not 200)
  if (!validationData) {
    return (
      <ErrorState
        message="Invalid or expired invitation token"
        onRetry={() => window.location.reload()}
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
    <ActivationForm
      form={form}
      onSubmit={handleSubmit}
      isLoading={activateMutation.isPending}
      errors={formErrors}
      rootError={form.formState.errors.root?.message}
      email={validationData.data?.email}
      companyName={validationData.data?.company_name}
    />
  );
}

