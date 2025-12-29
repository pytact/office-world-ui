// User Hooks
// F-001: User & Role Management
// React Query hooks for user operations with caching
// Following R5 (Custom Hooks) and R9 (Caching) rules

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { UserService } from "@/services/user.service";
import {
  UserInviteCreate,
  UserUpdate,
  UserRoleChange,
  UserCompanyReassign,
  UserStatusUpdate,
  UserPlatformListParams,
  UserCompanyListParams,
} from "@/utils/types/requests/user";
import { useAuthContext } from "@/context";

/**
 * Hook for listing platform users (SuperAdmin only)
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns Query object with user list data and state
 */
export function useListUsers(params?: UserPlatformListParams) {
  const { isSuperAdmin } = useAuthContext();

  return useQuery({
    queryKey: [
      "users",
      "platform",
      params?.page,
      params?.page_size,
      params?.search,
      params?.company_slug,
      params?.role_code,
      params?.status,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => UserService.list(params),
    enabled: isSuperAdmin, // Only run query for SuperAdmin
    staleTime: 30 * 1000, // 30 seconds - list data changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Smooth pagination transitions
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for listing company users (SuperAdmin, CEO, HR, Manager)
 * GET /api/v1/companies/{company_id}/users
 * @param company_id - Company ID (optional, will auto-detect from current user if not provided)
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns Query object with user list data and state
 */
export function useListCompanyUsers(
  company_id?: string | null,
  params?: UserCompanyListParams
) {
  const { user: currentUser } = useAuthContext();
  const currentUserId = currentUser?.user_id || null;
  
  // Get current user's company_id if company_id is not provided
  const { data: currentUserData } = useGetUser(currentUserId);
  const resolvedCompanyId = company_id || currentUserData?.data?.company?.company_id || null;

  return useQuery({
    queryKey: [
      "users",
      "company",
      resolvedCompanyId,
      params?.page,
      params?.page_size,
      params?.search,
      params?.role_code,
      params?.status,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => {
      if (!resolvedCompanyId) {
        throw new Error("Company ID is required");
      }
      return UserService.listCompany(resolvedCompanyId, params);
    },
    enabled: !!resolvedCompanyId, // Only run query if company_id is available
    staleTime: 30 * 1000, // 30 seconds - list data changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Smooth pagination transitions
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for getting a single user by ID
 * @param user_id - User ID (UUID)
 * @returns Query object with user data and state
 */
export function useGetUser(user_id: string | null) {
  return useQuery({
    queryKey: ["user", user_id],
    queryFn: () => {
      if (!user_id) {
        throw new Error("User ID is required");
      }
      
      return UserService.getById(user_id);
    },
    enabled: !!user_id, // Only run query if user_id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes - user details are relatively stable
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus for fresh data
  });
}

/**
 * Hook for creating/inviting a new user
 * @returns Mutation object with create function and state
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserInviteCreate) => UserService.create(payload),
    onSuccess: async () => {
      // Invalidate both platform and company user lists
      await queryClient.invalidateQueries({ queryKey: ["users", "platform"] });
      await queryClient.invalidateQueries({ queryKey: ["users", "company"] });
    },
  });
}

/**
 * Hook for updating user information (name, etc.)
 * @returns Mutation object with update function and state
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      user_id,
      payload,
      etag,
    }: {
      user_id: string;
      payload: UserUpdate;
      etag?: string;
    }) => UserService.update(user_id, payload, etag),
    onSuccess: async (_, variables) => {
      // Invalidate user lists
      await queryClient.invalidateQueries({ queryKey: ["users", "platform"] });
      await queryClient.invalidateQueries({ queryKey: ["users", "company"] });
      // Invalidate specific user
      await queryClient.invalidateQueries({ queryKey: ["user", variables.user_id] });
      // Invalidate /auth/me query (used for profile views)
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

/**
 * Hook for changing user role within the same company
 * @returns Mutation object with changeRole function and state
 */
export function useChangeUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      user_id,
      payload,
      etag,
    }: {
      user_id: string;
      payload: UserRoleChange;
      etag?: string;
    }) => UserService.changeRole(user_id, payload, etag),
    onSuccess: async (_, variables) => {
      // Invalidate user lists
      await queryClient.invalidateQueries({ queryKey: ["users", "platform"] });
      await queryClient.invalidateQueries({ queryKey: ["users", "company"] });
      // Invalidate specific user
      await queryClient.invalidateQueries({ queryKey: ["user", variables.user_id] });
    },
  });
}

/**
 * Hook for reassigning user to different company (SuperAdmin only)
 * @returns Mutation object with reassignCompany function and state
 */
export function useReassignCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      user_id,
      company_id,
      payload,
      etag,
    }: {
      user_id: string;
      company_id: string;
      payload: UserCompanyReassign;
      etag?: string;
    }) => UserService.reassignCompany(user_id, company_id, payload, etag),
    onSuccess: async (_, variables) => {
      // Invalidate user lists
      await queryClient.invalidateQueries({ queryKey: ["users", "platform"] });
      await queryClient.invalidateQueries({ queryKey: ["users", "company"] });
      // Invalidate specific user
      await queryClient.invalidateQueries({ queryKey: ["user", variables.user_id] });
    },
  });
}

/**
 * Hook for updating user status (activate/deactivate)
 * PATCH /api/v1/users/{user_id}/status
 * @returns Mutation object with updateStatus function and state
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      user_id,
      payload,
      etag,
    }: {
      user_id: string;
      payload: UserStatusUpdate;
      etag?: string;
    }) => UserService.updateStatus(user_id, payload, etag),
    onSuccess: async (_, variables) => {
      // Invalidate user lists
      await queryClient.invalidateQueries({ queryKey: ["users", "platform"] });
      await queryClient.invalidateQueries({ queryKey: ["users", "company"] });
      // Invalidate specific user
      await queryClient.invalidateQueries({ queryKey: ["user", variables.user_id] });
    },
  });
}

/**
 * @deprecated Use useUpdateUserStatus instead
 * Hook for deactivating a user (soft delete equivalent)
 * @returns Mutation object with deactivate function and state
 */
export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      user_id,
      etag,
    }: {
      user_id: string;
      etag?: string;
    }) => UserService.deactivate(user_id, etag),
    onSuccess: async (_, variables) => {
      // Invalidate user lists
      await queryClient.invalidateQueries({ queryKey: ["users", "platform"] });
      await queryClient.invalidateQueries({ queryKey: ["users", "company"] });
      // Invalidate specific user
      await queryClient.invalidateQueries({ queryKey: ["user", variables.user_id] });
    },
  });
}

/**
 * @deprecated Use useUpdateUserStatus instead
 * Hook for reactivating a user
 * @returns Mutation object with reactivate function and state
 */
export function useReactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      user_id,
      etag,
    }: {
      user_id: string;
      etag?: string;
    }) => UserService.reactivate(user_id, etag),
    onSuccess: async (_, variables) => {
      // Invalidate user lists
      await queryClient.invalidateQueries({ queryKey: ["users", "platform"] });
      await queryClient.invalidateQueries({ queryKey: ["users", "company"] });
      // Invalidate specific user
      await queryClient.invalidateQueries({ queryKey: ["user", variables.user_id] });
    },
  });
}

/**
 * Hook for resending invitation to a user
 * @returns Mutation object with resendInvite function and state
 */
export function useResendInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user_id: string) => UserService.resendInvite(user_id),
    onSuccess: async (_, user_id) => {
      // Invalidate user lists
      await queryClient.invalidateQueries({ queryKey: ["users", "platform"] });
      await queryClient.invalidateQueries({ queryKey: ["users", "company"] });
      // Invalidate specific user
      await queryClient.invalidateQueries({ queryKey: ["user", user_id] });
    },
  });
}

/**
 * Hook for listing available roles (for invitation form dropdown)
 * GET /api/v1/roles
 * Accessible by SuperAdmin, CEO, HR
 * @returns Query object with roles list data and state
 */
export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => UserService.getRoles(),
    staleTime: 10 * 60 * 1000, // 10 minutes - roles are relatively static
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false, // Roles don't change frequently
  });
}

/**
 * Hook for listing all companies (for SuperAdmin invitation form)
 * GET /api/v1/companies
 * SuperAdmin only
 * @returns Query object with companies list data and state
 */
export function useCompanies() {
  const { isSuperAdmin } = useAuthContext();

  return useQuery({
    queryKey: ["companies"],
    queryFn: () => UserService.getCompanies(),
    enabled: isSuperAdmin, // Only run query for SuperAdmin
    staleTime: 5 * 60 * 1000, // 5 minutes - companies change less frequently
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false, // Companies don't change frequently
  });
}
