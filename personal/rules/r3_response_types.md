# R3-Response Types

## Purpose
Define TypeScript interfaces for all API responses ensuring safe parsing, predictable UI rendering, and consistent backend alignment.

## Instructions
1. Create response type files in:
```
utils/types/response/{resource}.ts
```
2. File name must be:
```
user.ts
project.ts
task.ts
```
3. Define:
- Entity Response
- List Response
- Mutation Response
- Error Response

## Schema
```ts
// utils/types/response/{resource}.ts

export interface {Resource}Response {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface {Resource}ListResponse {
  data: {Resource}Response[];
  total: number;
  page: number;
  pageSize: number;
}

export interface {Resource}MutationResponse {
  message: string;
  data?: {Resource}Response | null;
}

export interface APIErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  fieldErrors?: Record<string, string>;
}
```

## Example
```ts
// utils/types/response/user.ts

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface UserListResponse {
  data: UserResponse[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserMutationResponse {
  message: string;
  data?: UserResponse | null;
}

export interface APIErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  fieldErrors?: Record<string, string>;
}
```

## Important Notes
- File name = `{resource}.ts`
- Response fields must match backend exactly
- Use PascalCase for interface names
- No renaming of backend fields
- No any/unknown

## End of Document