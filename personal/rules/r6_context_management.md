# R7 — Using Hooks and Context in Components

## Purpose

Define strict, predictable, and scalable rules for **using hooks and context inside React components**. This ensures:

* Clean UI components with no business logic
* Centralized logic inside hooks (R5)
* Smooth integration with context (R6)
* Consistent loading / error / empty state handling
* Zero API calls inside components

---

## Instructions

1. All components must import logic **only from hooks and context hooks**.
2. API calls must be performed using **React Query hooks inside custom hooks**.
3. Components should remain small, focused, and rendering-only.
4. Each data-driven component must display all UI states.
5. Use container + UI component separation.
6. Never transform API data inside components.
7. Never create payloads inside components.
8. All context must be consumed through custom hooks.

---

## Schema

```tsx
// components/{feature}/{Component}Container.tsx
"use client";

import { useGet{Resource}List } from "@/services/queries/{resource}";
import { use{Feature} } from "@/hooks/use{Feature}";
import { use{Context}Context } from "@/context/{context}";
import { Loader, ErrorState, EmptyState } from "@/components/ui";

export function {Component}Container() {
  const { data, isLoading, error } = useGet{Resource}List();
  const { value, handler } = use{Feature}();
  const { contextValue } = use{Context}Context();

  if (isLoading) return <Loader />;
  if (error) return <ErrorState message={error.message} />;
  if (!data?.length) return <EmptyState />;

  return <{Component} data={data} />;
}
```

---

## Example — Container Component

```tsx
// components/users/UserTableContainer.tsx
"use client";

import { useUsers } from "@/hooks/useUsers";
import { Loader, ErrorState, EmptyState } from "@/components/ui";
import { UserTable } from "./UserTable";

export function UserTableContainer() {
  const { users, isLoading, error } = useUsers();

  if (isLoading) return <Loader />;
  if (error) return <ErrorState message={error.message} />;
  if (!users.length) return <EmptyState />;

  return <UserTable users={users} />;
}
```

---

## Example — UI Component (Pure Rendering)

```tsx
// components/users/UserTable.tsx
export function UserTable({ users }) {
  return (
    <table className="w-full">
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.name}</td>
            <td>{u.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## Component Rules

### ✔ Components SHOULD

* Render UI
* Use hooks for business logic
* Use context via custom context hooks
* Handle loading, empty, error, success states
* Trigger simple event handlers only

### ❌ Components MUST NOT

* Call APIs directly
* Transform API data
* Build or mutate payloads
* Call useContext directly
* Contain complex branching logic
* Contain business rules (move to hooks)

---

## Event Handler Rules

Correct:

```tsx
<button onClick={deleteUser}>Delete</button>
```

Incorrect:

```tsx
<button onClick={() => http.delete(`/users/${id}`)}>Delete</button>
```

---

## Folder Naming Rules

```
components/{Feature}/{Component}Container.tsx  → logic + hooks
components/{Feature}/{Component}.tsx          → pure UI
```

---

## Hook & Context Usage Rules

Correct:

```tsx
const { theme } = useThemeContext();
```

Incorrect:

```tsx
useContext(ThemeContext);
```

---

## Important Notes

* Always split Container/UI for complex components.
* Never define inline interfaces; import all types.
* Never place API calls inside components.
* Use debouncing hooks for search inputs.
* Always show retry button in error states.
* Combine multiple hooks cleanly.

---

## End of Docu
