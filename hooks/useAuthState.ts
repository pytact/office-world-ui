// Auth State Hook
// Manages authentication state and token storage

import { useState, useCallback, useEffect } from "react";

interface AuthUser {
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

interface UseAuthStateReturn {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
}

/**
 * Hook for managing authentication state
 * Handles token storage and user state synchronization
 * @returns Auth state and handlers
 */
export function useAuthState(): UseAuthStateReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Initialize from sessionStorage on mount
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
          // Invalid stored user data
          sessionStorage.removeItem("auth_user");
        }
      }
    }
  }, []);

  const setAuth = useCallback((newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("access_token", newToken);
      sessionStorage.setItem("auth_user", JSON.stringify(newUser));
    }
  }, []);

  const clearAuth = useCallback(() => {
    setToken(null);
    setUser(null);

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("auth_user");
    }
  }, []);

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

  return {
    user,
    token,
    isAuthenticated,
    isSuperAdmin,
    setAuth,
    clearAuth,
    updateUser,
  };
}

