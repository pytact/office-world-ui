// Auth Context
// Global authentication context provider and custom hook
// F-000: Core Platform Foundation - Authentication

"use client";

import React, { createContext, useContext, useCallback, useEffect } from "react";
import { useLogin, useLogout } from "@/hooks/useAuth";
import { LoginRequest } from "@/utils/types/requests/auth";
import { LoginResponse } from "@/utils/types/responses/auth";

export interface AuthUser {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  org_id: string | null;
  company_slug: string | null;
  company_is_active: boolean | null;
  is_super_admin: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Auth Context Provider
 * Manages global authentication state and integrates with auth hooks
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  // Initialize state from sessionStorage
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load auth state from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("access_token");
      const storedUser = sessionStorage.getItem("auth_user");

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          sessionStorage.removeItem("auth_user");
        }
      }

      setIsLoading(false);
    }
  }, []);

  // Login handler
  const login = useCallback(
    async (payload: LoginRequest) => {
      try {
        const response: LoginResponse = await loginMutation.mutateAsync(payload);
        
        // Debug logging in development
        if (process.env.NODE_ENV === "development") {
          console.log("[AuthContext] Login response:", response);
        }
        
        // Verify response structure matches API spec
        if (!response?.data) {
          console.error("[AuthContext] Invalid response structure:", response);
          throw new Error("Invalid response format: missing data field");
        }
        
        if (!response.data.access_token) {
          console.error("[AuthContext] Missing access_token:", response.data);
          throw new Error("Invalid response format: missing access_token");
        }
        
        if (!response.data.user) {
          console.error("[AuthContext] Missing user:", response.data);
          throw new Error("Invalid response format: missing user field");
        }

        const newToken = response.data.access_token;
        const newUser = response.data.user;

        // Debug logging
        if (process.env.NODE_ENV === "development") {
          console.log("[AuthContext] Setting auth state:", {
            hasToken: !!newToken,
            user: newUser,
          });
        }

        setToken(newToken);
        setUser(newUser);

        if (typeof window !== "undefined") {
          sessionStorage.setItem("access_token", newToken);
          sessionStorage.setItem("auth_user", JSON.stringify(newUser));
        }
      } catch (error) {
        // Enhanced error logging
        if (process.env.NODE_ENV === "development") {
          console.error("[AuthContext] Login error:", error);
        }
        // Re-throw normalized error for proper handling in LoginForm
        throw error;
      }
    },
    [loginMutation]
  );

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();

      setToken(null);
      setUser(null);

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("auth_user");
      }
    } catch (error) {
      // Even if logout API fails, clear local state
      setToken(null);
      setUser(null);

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("auth_user");
      }
    }
  }, [logoutMutation]);

  // Update user handler
  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null;

      const updated = { ...prev, ...updates };

      if (typeof window !== "undefined") {
        sessionStorage.setItem("auth_user", JSON.stringify(updated));
      }

      return updated;
    });
  }, []);

  const isAuthenticated = !!token && !!user;
  const isSuperAdmin = user?.is_super_admin ?? false;

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated,
    isSuperAdmin,
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to consume Auth Context
 * Must be used within AuthProvider
 * Following R7 rules: Context consumed via custom hook
 * 
 * @returns Auth context value
 * @throws Error if used outside AuthProvider
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}

