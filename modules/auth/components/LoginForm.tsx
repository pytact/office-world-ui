// Login Form Component
// F-000: Core Platform Foundation - Authentication
// Reusable form component for user login

"use client";

import React, { useState, useMemo } from "react";
import { useAuthContext } from "@/context";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Card } from "@/components/ui/Card";
import { colors, spacing, typography, borderRadius } from "@/theme/tokens";
import type { LoginRequest } from "@/utils/types/requests/auth";

export function LoginForm() {
  const { login, isLoading } = useAuthContext();
  const { showError } = useToast();

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      } else if (formData.email.trim().length > 255) {
        newErrors.email = "Email address is too long (maximum 255 characters)";
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (formData.password.length > 128) {
      newErrors.password = "Password is too long (maximum 128 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await login(formData);
    } catch (error: any) {
      // Enhanced error logging
      console.error("[LoginForm] Login error:", {
        error,
        errorType: error?.constructor?.name,
        errorMessage: error?.message,
        errorResponse: error?.response,
        errorData: error?.response?.data,
        normalizedError: error,
      });

      const newErrors: typeof errors = {};

      // Check for network/CORS errors first
      if (error?.statusCode === 0 || error?.isNetworkError) {
        newErrors.general =
          "Network Error: Unable to connect to the server. Please check if the API server is running and CORS is configured correctly.";
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      // Handle API error codes and status codes
      const statusCode = error?.statusCode || error?.response?.status;
      const errorCode = error?.error?.code || error?.response?.data?.error?.code;
      
      // Handle field-specific errors from API (check both normalized and raw response)
      const fieldErrors = error?.fieldErrors || 
        (error?.response?.data?.error?.details?.reduce((acc: Record<string, string>, detail: any) => {
          if (detail.field && detail.issue) {
            acc[detail.field] = detail.issue;
          }
          return acc;
        }, {} as Record<string, string>));
      
      if (fieldErrors) {
        // Map field errors to form fields
        if (fieldErrors.email) {
          newErrors.email = fieldErrors.email;
        }
        if (fieldErrors.password) {
          newErrors.password = fieldErrors.password;
        }
      }

      // Map error codes to user-friendly messages
      if (statusCode === 401) {
        if (errorCode === "INVALID_CREDENTIALS") {
          // For INVALID_CREDENTIALS, if we have field errors, they're already set above
          // Only show general error if no field errors were set
          if (!newErrors.email && !newErrors.password) {
            newErrors.general = error?.message || "Invalid email or password. Please check your credentials and try again.";
          }
        } else if (errorCode === "TOKEN_EXPIRED") {
          newErrors.general = "Your session has expired. Please log in again.";
        } else if (errorCode === "UNAUTHENTICATED") {
          newErrors.general = "Authentication failed. Please check your credentials.";
        } else {
          // Fallback for other 401 errors
          if (!newErrors.email && !newErrors.password) {
            newErrors.general = error?.message || "Invalid email or password. Please check your credentials and try again.";
          }
        }
      } else if (statusCode === 403) {
        if (errorCode === "ACCOUNT_INACTIVE") {
          newErrors.general = "Your account is inactive. Please contact your administrator.";
        } else if (errorCode === "ACCOUNT_DELETED") {
          newErrors.general = "Your account has been deleted. Please contact support.";
        } else if (errorCode === "COMPANY_INACTIVE") {
          newErrors.general = "Your company account is inactive. Please contact your administrator.";
        } else {
          newErrors.general = "Access denied. Please contact your administrator.";
        }
      } else if (statusCode === 400) {
        // Validation errors - use field errors if available, otherwise use message
        if (errorCode === "VALIDATION_FAILED" || errorCode === "INVALID_REQUEST") {
          if (Object.keys(newErrors).length === 0) {
            // No field errors, show general validation message
            newErrors.general = error?.message || "Please check your input and try again.";
          }
        } else {
          newErrors.general = error?.message || "Invalid request. Please check your input and try again.";
        }
      } else if (statusCode === 422) {
        // Unprocessable entity - validation errors
        if (Object.keys(newErrors).length === 0) {
          newErrors.general = error?.message || "Validation failed. Please check your input and try again.";
        }
      } else if (statusCode === 500) {
        newErrors.general = "Server error. Please try again later or contact support if the issue persists.";
      } else {
        // Fallback to error message or default
        // Only set general error if no field errors are present
        if (!newErrors.email && !newErrors.password && !newErrors.general) {
          newErrors.general = error?.message || "Login failed. Please check your credentials and try again.";
        }
      }

      // Ensure at least one error is shown
      if (Object.keys(newErrors).length === 0) {
        newErrors.general = error?.message || "Login failed. Please check your credentials and try again.";
      }

      console.log("[LoginForm] Final errors to display:", newErrors);
      setErrors(newErrors);

      // Show error in toast notification
      // Priority: field errors > general error
      if (newErrors.email) {
        showError(newErrors.email);
      } else if (newErrors.password) {
        showError(newErrors.password);
      } else if (newErrors.general) {
        showError(newErrors.general);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoized styles for better performance - Modern spacing and hierarchy
  const formStyle = useMemo(
    () => ({
      width: "100%",
      maxWidth: "420px",
    } as const),
    []
  );

  const headerStyle = useMemo(
    () => ({
      marginBottom: spacing[12],
      textAlign: "left",
    } as const),
    []
  );

  const headingStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h2,
      fontWeight: typography.fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: spacing[3],
      lineHeight: typography.lineHeight.h2,
      margin: `0 0 ${spacing[3]} 0`,
      letterSpacing: "-0.02em",
    } as const),
    []
  );

  const subtitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      color: colors.textMuted,
      lineHeight: typography.lineHeight.body,
      margin: 0,
      fontWeight: typography.fontWeight.normal,
    } as const),
    []
  );

  const errorMessageStyle = useMemo(
    () => ({
      backgroundColor: colors.errorBg,
      color: colors.errorText,
      padding: `${spacing[4]} ${spacing[5]}`,
      borderRadius: borderRadius.md,
      marginBottom: spacing[8],
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      lineHeight: typography.lineHeight.body,
    } as const),
    []
  );

  const fieldGroupStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[3],
      marginBottom: spacing[8],
    } as const),
    []
  );

  const labelStyle = useMemo(
    () => ({
      display: "block",
      marginBottom: spacing[2],
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.medium,
      color: colors.textPrimary,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  return (
    <Card padding="lg" variant="elevated">
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={headerStyle}>
          <h1 style={headingStyle}>Welcome back</h1>
          <p style={subtitleStyle}>Sign in to your account to continue</p>
        </div>

        {errors.general && (
          <div style={errorMessageStyle}>
            {errors.general}
          </div>
        )}

        <div style={fieldGroupStyle}>
          <label htmlFor="email" style={labelStyle}>
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={!!errors.email}
            errorMessage={errors.email}
            disabled={isSubmitting || isLoading}
            autoComplete="email"
            required
          />
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor="password" style={labelStyle}>
            Password
          </label>
          <PasswordInput
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            error={!!errors.password}
            errorMessage={errors.password}
            disabled={isSubmitting || isLoading}
            autoComplete="current-password"
            required
          />
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting || isLoading}
          disabled={isSubmitting || isLoading}
          size="lg"
          style={{ width: "100%", marginTop: spacing[2] }}
        >
          Sign In
        </Button>
      </form>
    </Card>
  );
}

