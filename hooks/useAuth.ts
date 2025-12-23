// Auth Hooks
// F-000: Core Platform Foundation - Authentication
// React Query hooks for authentication operations + Context wrapper
// Following R7 rules: Components consume context via custom hooks

import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import {
  LoginRequest,
  ActivationRequest,
  RequestPasswordResetRequest,
  SubmitPasswordResetRequest,
} from "@/utils/types/requests/auth";
import { useAuthContext } from "@/context/AuthContext";
import type { AuthUser } from "@/context/AuthContext"

// React Query Hooks (API Operations)
  

/**
 * Hook for user login
 * @returns Mutation object with login function and state
 */
export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginRequest) => AuthService.login(payload),
  });
}

/**
 * Hook for user logout
 * @returns Mutation object with logout function and state
 */
export function useLogout() {
  return useMutation({
    mutationFn: () => AuthService.logout(),
  });
}

/**
 * Hook for validating activation token
 * @param token - Activation token to validate
 * @returns Query object with validation data and state
 */
export function useValidateActivationToken(token: string | null) {
  return useQuery({
    queryKey: ["auth", "activation", "validate", token],
    queryFn: () => {
      if (!token) throw new Error("Token is required");
      return AuthService.validateActivationToken(token);
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for activating user account
 * @returns Mutation object with activate function and state
 */
export function useActivate() {
  return useMutation({
    mutationFn: ({
      token,
      payload,
    }: {
      token: string;
      payload: ActivationRequest;
    }) => AuthService.activate(token, payload),
  });
}

/**
 * Hook for requesting password reset
 * @returns Mutation object with requestPasswordReset function and state
 */
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (payload: RequestPasswordResetRequest) =>
      AuthService.requestPasswordReset(payload),
  });
}

/**
 * Hook for submitting password reset
 * @returns Mutation object with submitPasswordReset function and state
 */
export function useSubmitPasswordReset() {
  return useMutation({
    mutationFn: ({
      token,
      payload,
    }: {
      token: string;
      payload: SubmitPasswordResetRequest;
    }) => AuthService.submitPasswordReset(token, payload),
  });
}

// ============================================
// Context Wrapper Hook (R7 Compliance)
// ============================================

/**
 * Custom hook to consume Auth Context
 * Wraps useAuthContext with a simpler name following R7 patterns
 * Components should use this hook instead of accessing context directly
 * 
 * @returns Auth context value with user, token, and auth methods
 */
export function useAuth() {
  return useAuthContext();
}

/**
 * Type export for AuthUser
 * Re-exported for convenience
 */
export type { AuthUser };
