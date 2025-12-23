# R9 — Caching

## Purpose
Define strict, predictable, and efficient **caching rules** using React Query to optimize performance, reduce API calls, and deliver a smooth user experience.

Caching improves:
- Perceived speed
- Reduced server load
- Smooth navigation
- Offline-friendly UI
- Data consistency

---

## Instructions
1. All server data MUST use **React Query** for caching.
2. Do NOT store server data inside:
   - Context
   - useState
   - Custom hooks (unless using React Query)
3. Each query must define:
   - `queryKey`
   - `queryFn`
   - `staleTime`
   - `gcTime`
4. Mutations MUST invalidate relevant queries.
5. Pagination MUST use `keepPreviousData`.
6. All query files must be placed in:
```
src/lib/{resource}ApiQuery.ts
```
7. Stale time must always be explicitly set.
8. Avoid cache collisions by using fully descriptive query keys.

---

## Schema
### Basic Cached Query
```ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export const useGet{Resource} = (id: string) => {
  return useQuery({
    queryKey: ["{resource}", id],
    queryFn: () => Service.get(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
```

### Mutation + Cache Invalidation
```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreate{Resource} = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => Service.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["{resources}"] });
    },
  });
};
```

### Query Key Patterns
```ts
["user", userId]
["users", { skip, take, search }]
["organization", orgId, "members"]
```

---

## Example — Real Caching Strategies
### List Query (Frequent Updates)
```ts
export const useGetUserList = (params) => {
  return useQuery({
    queryKey: ["users", params.skip, params.take, params.search],
    queryFn: () => UserService.list(params),
    staleTime: 30_000, // 30 sec
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};
```

### Single Item Query (Stable)
```ts
export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => UserService.get(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
```

### Static Data (Never Stale)
```ts
export const useGetConfig = () => {
  return useQuery({
    queryKey: ["config"],
    queryFn: ConfigService.get,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
```

---

## Cache Invalidation Rules
### After Create
```ts
invalidateQueries(["users"])
```

### After Update
```ts
invalidateQueries(["users"])
invalidateQueries(["user", id])
```

### After Delete
```ts
invalidateQueries(["users"])
```

### After Bulk Update
```ts
invalidateQueries({ queryKey: ["users"] })
```

---

## Optimistic Update
```ts
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => UserService.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries(["user", id]);

      const previous = queryClient.getQueryData(["user", id]);

      queryClient.setQueryData(["user", id], (old: any) => ({
        ...old,
        status,
      }));

      return { previous };
    },
    onError: (err, vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["user", vars.id], ctx.previous);
      }
    },
    onSettled: (_, __, vars) => {
      queryClient.invalidateQueries(["user", vars.id]);
    },
  });
};
```

---

## Query Key Guidelines
### Good
```ts
["users", { skip: 0, take: 10, search: "john" }]
["organization", orgId, "members"]
```
### Bad
```ts
["data"]             // Too generic
["users"]            // Missing filters → collisions
```

---

## Stale Time Guidelines
```ts
Infinity   → Static config data
5 min      → User details, project configs
30 sec     → Lists, table data
0          → Realtime dashboards
```

---

## GC Time Guidelines
```ts
10 min  → Frequent data
2 min   → Less accessed data
∞       → Static config
```

---

## Important Notes
- All API reads MUST use React Query.
- No caching inside useState or Context.
- Mutations MUST invalidate relevant queries.
- Query keys MUST include filters.
- Pagination MUST use keepPreviousData.
- Refetch intervals may be used for real-time data.
- staleTime & gcTime MUST be explicitly set.
- Test cache behavior for freshness.

---

## End of Document