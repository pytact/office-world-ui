// Employee Names Hook
// Utility hook to fetch employee names by IDs
// Used for displaying employee names in task assignments

import { useQueries } from "@tanstack/react-query";
import { EmployeeService } from "@/services/employee.service";

interface UseEmployeeNamesParams {
  employeeIds: string[];
  enabled?: boolean;
}

interface EmployeeNameMap {
  [employeeId: string]: string | null;
}

/**
 * Hook to fetch employee names for a list of employee IDs
 * Returns a map of employee_id -> employee name
 * @param employeeIds - Array of employee IDs to fetch names for
 * @param enabled - Whether to enable the queries (default: true)
 * @returns Map of employee_id -> name, loading state, and error state
 */
export function useEmployeeNames({
  employeeIds,
  enabled = true,
}: UseEmployeeNamesParams) {
  const queries = useQueries({
    queries: employeeIds.map((employeeId) => ({
      queryKey: ["employee", employeeId],
      queryFn: () => EmployeeService.getById(employeeId),
      enabled: enabled && !!employeeId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1, // Only retry once to avoid too many requests
    })),
  });

  const isLoading = queries.some((query) => query.isLoading);
  const hasError = queries.some((query) => query.isError);

  // Build map of employee_id -> name
  const employeeNames: EmployeeNameMap = {};
  queries.forEach((query, index) => {
    const employeeId = employeeIds[index];
    if (query.data?.data?.user?.first_name && query.data.data.user.last_name) {
      employeeNames[employeeId] = `${query.data.data.user.first_name} ${query.data.data.user.last_name}`;
    } else if (query.data?.data?.user?.email) {
      employeeNames[employeeId] = query.data.data.user.email;
    } else {
      employeeNames[employeeId] = null; // Fallback to ID if name not available
    }
  });

  return {
    employeeNames,
    isLoading,
    hasError,
  };
}

