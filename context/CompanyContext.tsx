// Company Context
// Feature-specific company context provider and custom hook
// F-004: Platform Company Management

"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useGetCompanyProfile } from "@/hooks/useCompanies";
import {
  useCompanyProfileTransformation,
  type TransformedCompanyProfile,
} from "@/hooks/useCompanyTransformations";
import { useCompanyProfileStatus } from "@/hooks/useCompanyStatus";
import { useAuthContext } from "./AuthContext";

interface CompanyContextValue {
  // Company profile data (CEO/HR only)
  profile: TransformedCompanyProfile | null;
  rawProfile: ReturnType<typeof useGetCompanyProfile>["data"];

  // Status and permissions
  status: ReturnType<typeof useCompanyProfileStatus>;

  // Query state
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  // Computed values
  isCompanyActive: boolean;
  canEditProfile: boolean;
  isSuperAdmin: boolean;
}

const CompanyContext = createContext<CompanyContextValue | undefined>(undefined);

interface CompanyProviderProps {
  children: React.ReactNode;
}

/**
 * Company Context Provider
 * Manages company profile state for CEO/HR users
 * Uses React Query for data fetching and caching
 * Note: Only provides data for non-SuperAdmin users (CEO/HR)
 * SuperAdmin should use useCompanyDetail hook for specific company management
 */
export function CompanyProvider({ children }: CompanyProviderProps) {
  const { user } = useAuthContext();
  const isSuperAdmin = user?.is_super_admin ?? false;

  // Only fetch company profile for CEO/HR users
  // SuperAdmin doesn't need this context as they manage multiple companies
  const profileQuery = useGetCompanyProfile();

  // Transform profile data
  const transformedProfile = useCompanyProfileTransformation(
    profileQuery.data?.data || null
  );

  // Derive status and permissions
  const status = useCompanyProfileStatus(
    profileQuery.data?.data || null,
    user?.role as "superadmin" | "ceo" | "hr" | "manager" | "employee" | undefined
  );

  // Computed values
  const isCompanyActive = useMemo(() => {
    return profileQuery.data?.data?.is_active ?? false;
  }, [profileQuery.data?.data?.is_active]);

  const canEditProfile = useMemo(() => {
    // Only CEO/HR can edit profile, and only when company is active
    return !isSuperAdmin && isCompanyActive && status.isEditable;
  }, [isSuperAdmin, isCompanyActive, status.isEditable]);

  const value: CompanyContextValue = {
    profile: transformedProfile,
    rawProfile: profileQuery.data,
    status,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error as Error | null,
    refetch: profileQuery.refetch,
    isCompanyActive,
    canEditProfile,
    isSuperAdmin,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
}

/**
 * Custom hook to consume Company Context
 * Must be used within CompanyProvider
 * Following R6 rules: Context consumed via custom hook
 *
 * @returns Company context value
 * @throws Error if used outside CompanyProvider
 */
export function useCompanyContext(): CompanyContextValue {
  const context = useContext(CompanyContext);

  if (context === undefined) {
    throw new Error(
      "useCompanyContext must be used within a CompanyProvider"
    );
  }

  return context;
}

