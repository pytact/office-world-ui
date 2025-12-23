# R2-Request Types

## Purpose
Define TypeScript interfaces for all API request payloads to ensure type safety, improve developer experience, and catch errors at compile time.

## Instructions
1. Create request type files in:
```
utils/types/requests/{resource}.ts
```
2. File name must be:
```
user.ts
product.ts
order.ts
```
3. Define:
- Base interface
- Create interface
- Update interface
- List params
- Optional status update
4. Use `| null` for nullable fields
5. Always export all interfaces

## Schema
```ts
// utils/types/requests/{resource}.ts

export interface {Resource}Base {
  field1: string;
  field2?: string | null;
  status?: "active" | "inactive" | null;
}

export interface {Resource}Create extends {Resource}Base {
  requiredField: string;
}

export interface {Resource}Update {
  field1?: string | null;
  field2?: string | null;
  status?: "active" | "inactive" | null;
}

export interface {Resource}ListParams {
  skip?: number;
  take?: number;
  search?: string | null;
  status?: string[] | [];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
```

## Example
```ts
// utils/types/requests/user.ts

export interface UserBase {
  name: string;
  email: string;
  description?: string | null;
  status?: "active" | "inactive" | null;
}

export interface UserCreate extends UserBase {
  password: string;
  role: "admin" | "user";
  confirmPassword: string;
}

export interface UserUpdate {
  name?: string | null;
  email?: string | null;
  description?: string | null;
  status?: "active" | "inactive" | null;
  role?: "admin" | "user" | null;
}

export interface UserListParams {
  skip?: number;
  take?: number;
  search?: string | null;
  status?: string[] | [];
  role?: string[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UserStatusUpdate {
  status: "active" | "inactive";
  notes?: string | null;
}
```

## Important Notes
- File name = `{resource}.ts`
- Must match backend field names exactly
- Use PascalCase for interface names
- No `any`, no `unknown`

## End of Document