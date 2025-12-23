# R7 — Using Hooks and Context in Components (Updated)
## Frontend Architecture Rule — Updated Version

=============================
# Purpose
Define strict, consistent rules for **using hooks and context inside React components**, ensuring:
- Clean separation of concerns
- Zero API logic inside components
- Predictable UI behavior
- Performance-safe component structure
- Maximum reusability

=============================
# Goals
- Prevent components from becoming “smart”
- Keep UI components focused on rendering only
- Enforce the use of custom hooks for business logic
- Ensure proper integration with context
- Avoid repeated or duplicated logic

=============================
# File Location
Components MUST follow this location pattern:
```
src/modules/<feature>/components/
```
Shared UI components MUST live here:
```
src/components/ui/
```

=============================
# Component Responsibilities (Strict)
Components should ONLY:
- Render UI
- Consume hooks
- Consume context
- Handle simple events (click, change)
- Render conditional UI (loading, error, empty states)

Components must NEVER:
- Call API directly
- Perform data transformations
- Contain large business logic
- Manage server state
- Construct payloads manually

=============================
# Updated Rules (Improved)

## Rule 1 — Components MUST use hooks for all logic
Correct:
```tsx
const { users, isLoading } = useUsers();
```
Incorrect:
```tsx
const users = await http.get("/users");
```

## Rule 2 — Components MUST NOT build payloads.
Payload creation belongs to hooks.
```tsx
// ❌ Bad
onSubmit={() => createUser({ name, email })}

// ✅ Good
const { submitUser } = useUserFormSubmit();
onSubmit={submitUser}
```

## Rule 3 — Components MUST NOT transform API responses
Wrong:
```tsx
const formatted = users.map(u => formatDate(u.created_at));
```
Correct:
```tsx
const { formattedUsers } = useMappedUsers();
```

## Rule 4 — Always consume context via custom hooks
Correct:
```tsx
const { user } = useAuth();
```
Incorrect:
```tsx
useContext(AuthContext);
```

## Rule 5 — Components must show all UI states
Every data-driven component MUST support:
- Loading state
- Empty state
- Error state
- Success state

Template:
```tsx
if (isLoading) return <Loader />;
if (error) return <Error message={error.message} />;
if (!data?.length) return <Empty />;
```

## Rule 6 — Split complex components into UI + Container
```
UserTableContainer.tsx → uses hooks
UserTable.tsx → purely UI
```

## Rule 7 — Components must remain small and SRP-driven

=============================
# Component Template (Updated)
```tsx
import { useUsers } from "../hooks/useUsers";
import { Loader, ErrorState, EmptyState } from "@/components/ui";

export function UserTableContainer() {
  const { users, isLoading, error } = useUsers();

  if (isLoading) return <Loader />;
  if (error) return <ErrorState message={error.message} />;
  if (!users.length) return <EmptyState />;

  return <UserTable users={users} />;
}
```

=============================
# UI Component Template (Pure Rendering)
```tsx
export function UserTable({ users }) {
  return (
    <table className="w-full">
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

=============================
# Context Usage Inside Components
Components use context ONLY through custom hooks:
```tsx
const { theme, toggleTheme } = useTheme();
```
Never access context directly.

=============================
# Event Handler Rules
Handlers must be simple and call hook functions:
```tsx
<button onClick={deleteUser}>Delete</button>
```
No inline API logic:
```tsx
<button onClick={() => http.delete(`/users/${id}`)}>Delete</button> // ❌
```

=============================
# Folder Naming Rules
- `ComponentName.tsx` → Pure component
- `ComponentNameContainer.tsx` → Contains hooks & logic

=============================
# Enforcement Rules
1. No API calls inside components
2. No context usage without custom hook wrapper
3. No payload creation inside components
4. No data transformation inside components
5. Must include all UI states
6. Must follow container + UI separation
7. Must keep components small and SRP-compliant
8. Must import types, not define inline interfaces

=============================
# End of Document