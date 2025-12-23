# R4-HTTP Client

## Purpose
Create a unified, consistent, and secure HTTP client for all API communication.  
This client handles:
- Authentication (token injection)
- Error handling (normalized)
- Request/response interceptors
- Base URL configuration
- Multiple backend API clients
- SSR/browser compatibility

This ensures predictable behavior, zero duplicate Axios logic, and clean service layer functions.

## Instructions

1. Create HTTP client factory in:
```
lib/httpClient.ts
```

2. Create exported client instances in:
```
lib/http.ts
```

3. Use Axios as the base HTTP library.

4. Configure:
- Base URL (from environment)
- Content-Type headers
- Request interceptor (token)
- Response interceptor (errors)

5. Export all configured clients (e.g., organizationsClient, xrayClient, webTestsClient).

6. Services must:
- Import specific client
- Alias it as `http`
- Use typed API calls (`http.get<T>()`)
- Always return `response.data`

7. Use URLSearchParams for query parameters.

## Schema

```ts
// lib/httpClient.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import { localStorageKeys } from "@/utils/constants/common";

export interface ApiSuccess<T> {
  success: boolean;
  status?: number;
  data: T;
  message?: string;
}

export interface ApiListResult<T> {
  items: T[];
  total: number;
  take: number;
  skip: number;
  search_term: string;
}

export function createHttpClient(apiBaseUrl: string): AxiosInstance {
  const instance = axios.create({
    baseURL: apiBaseUrl,
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== "undefined") {
        const token = sessionStorage.getItem(localStorageKeys.accessToken);
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => Promise.reject(error)
  );

  return instance;
}
```

---

```ts
// lib/http.ts
import { createHttpClient } from "./httpClient";

const ORGANIZATIONS_API_BASE_URL = process.env.NEXT_PUBLIC_ORG_API_BASE_URL!;
const CYBERXRAY_API_BASE_URL = process.env.NEXT_PUBLIC_XRAY_API_BASE_URL!;
const WEB_TESTS_API_BASE_URL = process.env.NEXT_PUBLIC_WEB_TESTS_API_BASE_URL!;

export const organizationsClient = createHttpClient(ORGANIZATIONS_API_BASE_URL);
export const xrayClient = createHttpClient(CYBERXRAY_API_BASE_URL);
export const webTestsClient = createHttpClient(WEB_TESTS_API_BASE_URL);
```

## Example (Service Layer)

```ts
// services/members.ts
import { organizationsClient as http } from "@/lib/http";
import { MemberBase, MemberListParams } from "@/utils/types/requests/members";
import { MemberResultSchema, MemberResultSchemaList } from "@/utils/types/responses/members";

const basePath = "/organizations";

export const MemberService = {
  async list(params?: MemberListParams): Promise<MemberResultSchemaList> {
    const searchParams = new URLSearchParams();

    if (params?.org_id) searchParams.append("org_id", params.org_id);
    if (params?.skip !== undefined) searchParams.append("skip", params.skip.toString());
    if (params?.take !== undefined) searchParams.append("take", params.take.toString());
    if (params?.search) searchParams.append("search", params.search);

    if (params?.role?.length) {
      params.role.forEach((role) => searchParams.append("role", role));
    }

    const r = await http.get<MemberResultSchemaList>(
      `${basePath}/members/list?${searchParams.toString()}`
    );
    return r.data;
  },

  async get(id: string, org_id: string): Promise<MemberResultSchema> {
    const r = await http.get<MemberResultSchema>(
      `${basePath}/${org_id}/members/${id}`
    );
    return r.data;
  },

  async create(org_id: string, payload: MemberBase): Promise<MemberResultSchema> {
    const r = await http.post<MemberResultSchema>(
      `${basePath}/${org_id}/members`,
      payload
    );
    return r.data;
  },
};
```

## File Naming Convention

| Purpose | File |
|--------|------|
| HTTP client factory | `lib/httpClient.ts` |
| Exported API clients | `lib/http.ts` |
| Service functions | `services/{resource}.ts` |

- File names must be camelCase.
- Use `http` alias inside services.

## Important Notes

- Never create Axios instances inside services.
- Token logic must live only in request interceptor.
- Always return `response.data` from services.
- No raw fetch calls anywhere.
- Use environment variables for base URLs.
- Use URLSearchParams for query strings.
- Do not catch errors inside service; let interceptors handle them.
- Use TypeScript generics: `http.get<MyType>()`.
- Must support multiple API bases (organizations, xray, web-tests).

## End of Document