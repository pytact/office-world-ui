# R11 — Routing

## Purpose

Define a strict, predictable, and scalable routing architecture for all applications using **Next.js App Router** or **React Router**. Routing must:

* Ensure consistent navigation patterns across all features
* Support dynamic paths (`[id]`, slug routing, nested routes)
* Enforce clean separation between route files and UI components
* Enable route protection (auth + role-based)
* Integrate predictably with layouts, hooks, and context

---

## Instructions

1. All routing MUST follow the framework’s file-based or component-based rules.
2. All route pages MUST be **container components** — no UI inside route files.
3. Dynamic routes MUST use standardized patterns:

   * Next.js → `[id]`
   * React Router → `:id`
4. All navigation MUST use standard helpers (`Link`, `router.push`, `useNavigate`).
5. Route protection MUST use a centralized guard.
6. Feature routing must follow the **4‑page structure**:

```
/<feature>              → List page
/<feature>/create       → Create page
/<feature>/:id          → Detail page
/<feature>/:id/edit     → Edit page
```

7. Layout files must be used for persistent navigation, tabs, or breadcrumbs.

---

## Schema — Next.js App Router

```tsx
src/app/(routes)/<feature>/page.tsx        // List
src/app/(routes)/<feature>/create/page.tsx // Create
src/app/(routes)/<feature>/[id]/page.tsx   // Detail
src/app/(routes)/<feature>/[id]/edit/page.tsx // Edit
```

### Next.js Container Page

```tsx
// src/app/(routes)/users/page.tsx
"use client";
import { UserListContainer } from "@/modules/users/components/UserListContainer";

export default function Page() {
  return <UserListContainer />;
}
```

---

## Schema — React Router

```tsx
<Routes>
  <Route path="/users" element={<UserList />} />
  <Route path="/users/create" element={<UserCreate />} />
  <Route path="/users/:id" element={<UserDetail />} />
  <Route path="/users/:id/edit" element={<UserEdit />} />
</Routes>
```

---

## Route Guard Template

```tsx
// src/core/guards/route-guard.tsx
import { useAuth } from "../context/auth.context";
import { redirect } from "next/navigation";

export function RouteGuard({ children, roles }) {
  const { user } = useAuth();

  if (!user) redirect("/login");
  if (roles && !roles.includes(user.role)) redirect("/403");

  return children;
}
```

---

## Navigation Rules

### Prefer:

```tsx
router.push("/users/create");
```

### Avoid:

```tsx
window.location.href = "/users/create"; // ❌
```

### URL Helper Example

```ts
export const userRoutes = {
  list: "/users",
  create: "/users/create",
  detail: (id: string) => `/users/${id}`,
  edit: (id: string) => `/users/${id}/edit`,
};
```

---

## Dynamic Routes

### Next.js

```
src/app/(routes)/users/[id]/page.tsx
```

### React Router

```
/users/:id
```

---

## Layout Structure

```tsx
src/app/(routes)/users/layout.tsx
```

Used for:

* Tabs
* Breadcrumbs
* Side panels
* Section headers

---

## Breadcrumb Guidelines

Breadcrumbs must reflect routing hierarchy:

* `/users` → Users
* `/users/create` → Create
* `/users/:id` → Detail
* `/users/:id/edit` → Edit

---

## Lazy Loading Rules

### Next.js

```tsx
const UserList = dynamic(() => import("@/containers/UserList"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
```

### React Router

```tsx
const UserList = React.lazy(() => import("./UserList"));
```

---

## Important Notes

* Never perform API calls directly inside route files.
* Route files must only load containers.
* Dynamic routes must use `[id]` or `:id`.
* Always use layouts for grouping pages.
* Route protection must be centralized.
* Always use helper route functions.
* Never build URLs manually.
* All route pages must be minimal and clean.

---

## End of Document
