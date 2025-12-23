# R8 — API Calls & Error Handling

## Purpose
Provide a clean, predictable, and standardized pattern for **API calls**, **error handling**, and **service-layer architecture** across the application.  
This ensures:
- No raw Axios/fetch inside components
- All errors follow a normalized structure
- All API calls are fully typed
- Consistent loading, empty, and error states
- Unified retry, logging, and error mapping

---

## Instructions
1. All API calls must be created inside:
```
src/services/{resource}.ts
```
2. Use the global HTTP client defined in R4.
```
src/lib/http.ts
```
3. Every service function MUST:
- Be fully typed (request + response)
- Return `response.data` only
- Throw a normalized error

4. Separate responsibilities:
- **Services → API calls**
- **Hooks → Query logic** (R5)
- **Components → Rendering/UI only** (R7)

5. Error normalization must be centralized.
```
src/core/http/normalizers/error-normalizer.ts
```

---

## Schema
### Service Function
```ts
// src/services/{resource}.ts
import { http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";

import {
  {Resource}Create,
  {Resource}Update,
  {Resource}ListParams,
} from "@/utils/types/requests/{resource}";

import {
  {Resource}Response,
  {Resource}ListResponse,
  {Resource}MutationResponse,
} from "@/utils/types/responses/{resource}";

export const {Resource}Service = {
  list: async (params?: {Resource}ListParams): Promise<{Resource}ListResponse> => {
    try {
      const r = await http.get<{Resource}ListResponse>("/{resources}", { params });
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  get: async (id: string): Promise<{Resource}Response> => {
    try {
      const r = await http.get<{Resource}Response>(`/{resources}/${id}`);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  create: async (payload: {Resource}Create): Promise<{Resource}MutationResponse> => {
    try {
      const r = await http.post<{Resource}MutationResponse>("/{resources}", payload);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  update: async (id: string, payload: {Resource}Update): Promise<{Resource}MutationResponse> => {
    try {
      const r = await http.patch<{Resource}MutationResponse>(`/{resources}/${id}` , payload);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  delete: async (id: string) => {
    try {
      const r = await http.delete(`/{resources}/${id}`);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};
```

---

## Error Normalizer (Centralized)
```ts
// src/core/http/normalizers/error-normalizer.ts
export function normalizeAPIError(error: any) {
  return {
    message: error?.response?.data?.message || "Unknown error occurred",
    statusCode: error?.response?.status || 500,
    error: error?.response?.data?.error,
    fieldErrors: error?.response?.data?.fieldErrors || {},
  };
}
```

---

## Error Component
```tsx
// src/components/common/ErrorComponent.tsx
interface ErrorComponentProps {
  error: Error | any;
  onRetry?: () => void;
}

export function ErrorComponent({ error, onRetry }: ErrorComponentProps) {
  const message = error?.message || "Unexpected error occurred";

  return (
    <div className="p-4 text-center space-y-2">
      <h2 className="font-semibold text-red-600">Error</h2>
      <p className="text-gray-600">{message}</p>
      {onRetry && (
        <button className="px-4 py-2 border rounded" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
```

---

## API Query Hook Example
```ts
import { useQuery } from "@tanstack/react-query";
import { {Resource}Service } from "@/services/{resource}";

export function useGet{Resource}List(params?: {Resource}ListParams) {
  return useQuery({
    queryKey: ["{resources}", params],
    queryFn: () => {Resource}Service.list(params),
    retry: 2,
    staleTime: 30000,
  });
}
```

---

## Component Example (with error handling)
```tsx
// components/{resource}/{Resource}List.tsx
"use client";

import { useGet{Resource}List } from "@/hooks/useGet{Resource}List";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { Loader } from "@/components/common/Loader";

export function {Resource}List() {
  const { data, isLoading, error, refetch } = useGet{Resource}List({ skip: 0, take: 10 });

  if (isLoading) return <Loader />;
  if (error) return <ErrorComponent error={error} onRetry={refetch} />;
  if (!data?.items?.length) return <div>No data found</div>;

  return <div>{JSON.stringify(data.items)}</div>;
}
```

---

## File Naming Convention
| Type | Naming |
|------|--------|
| Service | `src/services/{resource}.ts` |
| Error Component | `src/components/common/ErrorComponent.tsx` |
| Query Hook | `src/hooks/useGet{Resource}List.ts` |

---

## Important Notes
- Never use Axios/fetch directly in components.
- Always normalize errors.
- Always return `response.data`.
- Use retry strategies in React Query.
- Mutations must display toast messages.
- Validation errors (422) must map to form errors.
- Use typed params and responses.
- No data transformation in services.
- All UI states must be handled: loading, error, empty, success.

---

## End of Document
