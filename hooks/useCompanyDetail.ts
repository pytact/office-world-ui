// Company Detail Hook
// Encapsulates detail view transformations and derived fields
// Following R5 rules: Business logic in hooks

import { useMemo } from "react";
import { useGetCompany } from "./useCompanies";
import {
  useCompanyDetailTransformation,
  type TransformedCompanyDetail,
} from "./useCompanyTransformations";
import { useCompanyStatusFromResponse } from "./useCompanyStatus";
import { useAuthContext } from "@/context/AuthContext";
import { extractETagFromUpdatedAt } from "@/utils/helpers/etag";

interface UseCompanyDetailParams {
  company_id: string | null;
}

interface UseCompanyDetailReturn {
  // Query state
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  // Transformed data
  company: TransformedCompanyDetail | null;
  rawCompany: ReturnType<typeof useGetCompany>["data"];

  // Status and permissions
  status: ReturnType<typeof useCompanyStatusFromResponse>;

  // ETag for concurrency control
  etag: string | null;
}

/**
 * Hook that fetches and transforms company detail data
 * Combines useGetCompany with transformations and status logic
 * Encapsulates all business logic for company detail screens
 * @param params - Company ID to fetch
 * @returns Company data, loading state, error, and derived fields
 */
export function useCompanyDetail(
  params: UseCompanyDetailParams
): UseCompanyDetailReturn {
  const { company_id } = params;

  // Get current user role from auth context
  const { user } = useAuthContext();
  const userRole = user?.role as
    | "superadmin"
    | "ceo"
    | "hr"
    | "manager"
    | "employee"
    | undefined;

  // Fetch company data
  const query = useGetCompany(company_id);

  // Transform company data
  const transformedCompany = useCompanyDetailTransformation(
    query.data?.data || null
  );

  // Derive status and permissions
  const status = useCompanyStatusFromResponse(
    query.data?.data || null,
    userRole
  );

  // Extract ETag from updated_at field (F-004 API spec: ETag format is based on updated_at)
  // ETag format: "20240120T103000Z" (converted from ISO 8601 timestamp)
  const etag = useMemo(() => {
    if (!query.data?.data) {
      return null;
    }
    return extractETagFromUpdatedAt(query.data.data);
  }, [query.data?.data]);

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    company: transformedCompany,
    rawCompany: query.data,
    status,
    etag,
  };
}

