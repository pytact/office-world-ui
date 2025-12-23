// Login Form Component
// F-000: Core Platform Foundation - Authentication
// Reusable form component for user login

"use client";

import React, { useState, useMemo } from "react";
import { useAuthContext } from "@/context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Card } from "@/components/ui/Card";
import { colors, spacing, typography, borderRadius } from "@/theme/tokens";
import type { LoginRequest } from "@/utils/types/requests/auth";

export function LoginForm() {
  const { login, isLoading } = useAuthContext();

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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
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
      console.log("[LoginForm] Attempting login with:", { email: formData.email });
      await login(formData);
      console.log("[LoginForm] Login successful");
      // Login successful - AuthContext will update state
      // Login page's useEffect will handle redirect to "/"
      // No need to manually redirect here
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

      // Handle API errors - check for normalized error structure
      let errorMessage = "Login failed. Please check your credentials and try again.";

      if (error?.message) {
        // Normalized error from error-normalizer
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        // Direct API error response
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        // Generic error
        errorMessage = error.message;
      }

      // Check for network/CORS errors
      if (error?.statusCode === 0 || error?.isNetworkError) {
        errorMessage =
          "Network Error: Unable to connect to the server. Please check if the API server is running and CORS is configured correctly.";
      }

      setErrors({ general: errorMessage });
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

