# R5-Custom Hooks

## Purpose
Define reusable, predictable, and consistent **custom React hooks** that encapsulate UI logic, form logic, business logic, and state transformations.  
Custom hooks ensure:
- No duplicated logic inside components
- Clean UI components
- Reusable logic across pages and screens
- Predictable structure and naming

## Instructions
1. Create hook files inside the global hooks directory:
```
src/hooks/useSomething.ts
```
2. Hook file name must start with:
```
use{Feature}.ts
```
3. Hook function name must start with `use`.
4. Hooks must return an **object**, never an array.
5. Keep hooks focused on a **single responsibility**.
6. Use React utilities:
   - `useState`
   - `useCallback`
   - `useMemo`
   - `useEffect` (only when necessary)
7. For data/API logic, wrap React Query hooks inside custom hooks.
8. For UI state, keep only local UI logic inside the hook.
9. Write full TypeScript types for params and return values.

## Schema
```ts
// src/hooks/use{Feature}.ts
import { useState, useCallback, useMemo } from "react";

interface Use{Feature}Params {
  // hook input parameters
}

interface Use{Feature}Return {
  // returned values
}

/**
 * Hook description
 * @param params - parameter description
 * @returns object containing state, computed values, handlers
 */
export function use{Feature}(params: Use{Feature}Params): Use{Feature}Return {
  const [state, setState] = useState("");

  const computed = useMemo(() => {
    // Derived computation
    return state.toUpperCase();
  }, [state]);

  const onChange = useCallback((value: string) => {
    setState(value);
  }, []);

  return {
    state,
    computed,
    onChange,
  };
}
```

## Example

### UI State Hook
```ts
// src/hooks/useUserTable.ts
import { useState } from "react";

export function useUserTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  return {
    search,
    setSearch,
    page,
    setPage,
  };
}
```

### API Logic Hook (React Query Based)
```ts
// src/hooks/useUsers.ts
import { useUserListQuery } from "@/services/queries/users";

export function useUsers() {
  const query = useUserListQuery();

  return {
    users: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
```

### Form Hook (React Hook Form + Zod)
```ts
// src/hooks/useUserForm.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema, UserFormSchema } from "@/utils/schemas/users";

export function useUserForm(defaults?: Partial<UserFormSchema>) {
  const form = useForm<UserFormSchema>({
    resolver: zodResolver(UserSchema),
    defaultValues: defaults,
  });

  return form;
}
```

### Data Mapping / Transformation Hook
```ts
// src/hooks/useMappedUsers.ts
import { useUserListQuery } from "@/services/queries/users";
import { format } from "date-fns";

export function useMappedUsers() {
  const { data } = useUserListQuery();

  const mapped = data?.data?.map(u => ({
    ...u,
    createdAtFormatted: format(new Date(u.created_at), "dd MMM yyyy"),
  }));

  return mapped;
}
```

## File Naming Convention
- File location:
```
src/hooks/useFeature.ts
```
- Must start with “use”
- Use PascalCase after “use”:  
  `useUserForm.ts`, `useProjectFilters.ts`, `usePagination.ts`

## Hook Naming Pattern
```
use<Feature><Purpose>
```
Examples:
- `useUserForm`
- `useUserFilters`
- `useProjectStats`
- `usePagination`
- `useDebounce`

## Important Notes
- Do NOT include JSX inside hooks.
- Hooks must return a **stable object**.
- No API or business logic inside components — use hooks instead.
- Use React Query hooks inside custom hooks for server state.
- Keep hooks single-purpose.
- Use `useCallback` to prevent re-renders.
- Use `useMemo` for expensive calculations.
- Handle SSR safely using:
```
typeof window !== "undefined"
```
- Always export hooks using named exports.

## End of Document