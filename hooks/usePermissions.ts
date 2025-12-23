// Permission Hooks
// F-002: RBAC & Permission Engine
// React Query hooks for permission operations with caching
// Following R5 (Custom Hooks) and R9 (Caching) rules

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { PermissionService } from "@/services/permission.service";
import {
  PermissionListParams,
  PermissionCreate,
  PermissionUpdate,
} from "@/utils/types/requests/permission";

export function useGetPermission() {
  return useQuery({
    queryKey: ["permission", "me"],
    queryFn: () => PermissionService.get(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useListPermission(params?: PermissionListParams) {
  return useQuery({
    queryKey: ["permissions", "list", params],
    queryFn: () => PermissionService.list(params),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: false,
  });
}

export function useCreatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PermissionCreate) => PermissionService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["permission"] });
    },
  });
}

export function useUpdatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: PermissionUpdate;
    }) => PermissionService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["permission"] });
    },
  });
}

export function useDeletePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PermissionService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["permission"] });
    },
  });
}

