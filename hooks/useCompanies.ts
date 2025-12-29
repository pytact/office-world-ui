// Company Hooks
// F-004: Platform Company Management
// React Query hooks for company operations with caching
// Following R5 (Custom Hooks) and R9 (Caching) rules

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { CompanyService } from "@/services/company.service";
import {
  CompanyCreate,
  CompanyUpdate,
  CompanyProfileUpdate,
  CompanyListParams,
} from "@/utils/types/requests/company";

/**
 * Hook for listing companies with pagination, search, filtering, and sorting
 * GET /api/v1/companies
 * SuperAdmin only
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns Query object with company list data and state
 */
export function useListCompanies(params?: CompanyListParams) {
  return useQuery({
    queryKey: [
      "companies",
      params?.page,
      params?.page_size,
      params?.search,
      params?.status,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => CompanyService.list(params),
    staleTime: 30 * 1000, // 30 seconds - list data changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Smooth pagination transitions
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for getting a single company by ID
 * GET /api/v1/companies/{company_id}
 * SuperAdmin only
 * @param company_id - Company ID (UUID)
 * @returns Query object with company data and state
 */
export function useGetCompany(company_id: string | null) {
  return useQuery({
    queryKey: ["company", company_id],
    queryFn: () => {
      if (!company_id) {
        throw new Error("Company ID is required");
      }

      return CompanyService.getById(company_id);
    },
    enabled: !!company_id, // Only run query if company_id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes - company details are relatively stable
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus for fresh data
  });
}

/**
 * Hook for creating a new company
 * POST /api/v1/companies
 * SuperAdmin only
 * @returns Mutation object with create function and state
 */
export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CompanyCreate) => CompanyService.create(payload),
    onSuccess: async (data) => {
      // Invalidate company list
      await queryClient.invalidateQueries({ queryKey: ["companies"] });
      // Invalidate specific company if we have the ID
      if (data?.data?.company_id) {
        await queryClient.invalidateQueries({
          queryKey: ["company", data.data.company_id],
        });
      }
    },
  });
}

/**
 * Hook for updating company information or activating/deactivating
 * PATCH /api/v1/companies/{company_id}
 * SuperAdmin only
 * @returns Mutation object with update function and state
 */
export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      company_id,
      payload,
      etag,
    }: {
      company_id: string;
      payload: CompanyUpdate;
      etag?: string;
    }) => CompanyService.update(company_id, payload, etag),
    onSuccess: async (_, variables) => {
      // Invalidate company list
      await queryClient.invalidateQueries({ queryKey: ["companies"] });
      // Invalidate specific company
      await queryClient.invalidateQueries({
        queryKey: ["company", variables.company_id],
      });
      // Invalidate company profile (in case CEO/HR is viewing)
      await queryClient.invalidateQueries({ queryKey: ["company", "profile"] });
    },
  });
}

/**
 * Hook for deleting a company (hard delete, irreversible)
 * DELETE /api/v1/companies/{company_id}
 * SuperAdmin only
 * @returns Mutation object with delete function and state
 */
export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      company_id,
      etag,
    }: {
      company_id: string;
      etag?: string;
    }) => CompanyService.delete(company_id, etag),
    onSuccess: async (_, variables) => {
      // Invalidate company list
      await queryClient.invalidateQueries({ queryKey: ["companies"] });
      // Remove specific company from cache (it no longer exists)
      await queryClient.removeQueries({
        queryKey: ["company", variables.company_id],
      });
    },
  });
}

/**
 * Hook for getting own company profile
 * GET /api/v1/company/profile
 * CEO/HR only (company determined from JWT org_id)
 * @returns Query object with company profile data and state
 */
export function useGetCompanyProfile() {
  return useQuery({
    queryKey: ["company", "profile"],
    queryFn: () => CompanyService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes - profile data is relatively stable
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus for fresh data
  });
}

/**
 * Hook for updating company profile fields
 * PATCH /api/v1/company/profile
 * CEO/HR only (non-governance fields)
 * Note: Updates are blocked when company is inactive (is_active: false)
 * @returns Mutation object with updateProfile function and state
 */
export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      etag,
    }: {
      payload: CompanyProfileUpdate;
      etag?: string;
    }) => CompanyService.updateProfile(payload, etag),
    onSuccess: async () => {
      // Invalidate company profile
      await queryClient.invalidateQueries({ queryKey: ["company", "profile"] });
      // Note: We don't invalidate the full company list here since this is a profile-only update
      // If needed, the SuperAdmin detail view will refetch when accessed
    },
  });
}

