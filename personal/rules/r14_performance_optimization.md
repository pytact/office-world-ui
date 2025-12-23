# R14 — Performance Optimization

## Purpose

Establish a strict, modern, and scalable rulebook for **optimizing performance** across all React + Next.js applications.
This replaces the old `r_14_performance_optimization_updated.md` and is rewritten in the clean architecture style used in R2–R15.

The goal is to ensure:

* Zero unnecessary re-renders
* Optimal API usage
* Faster UI interactions
* Predictable architecture for performance
* Lightweight bundle size

---

## Instructions

1. Apply these rules to **all components, hooks, services, and modules**.
2. Performance rules MUST be followed before merging any PR.
3. Memoize ALL expensive operations.
4. Avoid re-renders by stabilizing references.
5. Use dynamic imports & virtualization where appropriate.
6. Use React Query for caching instead of storing server data in state/context.

---

## Core Principles

### 1. **Render Minimization**

* Avoid inline functions/objects/arrays.
* Memoize components (`React.memo`).
* Use `useCallback` for all handlers.
* Use `useMemo` for derived values.

### 2. **Caching & API Efficiency**

* Use React Query for ALL server data.
* Use proper `staleTime`/`gcTime` values.
* Avoid duplicate API hits.
* Preload and prefetch when beneficial.

### 3. **Lazy Loading & Code Splitting**

* Dynamic import heavy components.
* Avoid loading charts, editors, maps upfront.

### 4. **List Rendering Efficiency**

* Use virtualization for lists > 100 items.
* Use keys properly.
* Avoid rendering hidden DOM nodes.

### 5. **Bundle Size Reduction**

* Use modular imports.
* Avoid heavy libraries unless necessary.
* Prefer Day.js over Moment.

---

## Rendering Optimization Rules

### Rule 1 — Memoize UI Components

```tsx
export const UserCard = React.memo(function UserCard({ user }) {
  return <div>{user.name}</div>;
});
```

### Rule 2 — Memoize Event Handlers

```tsx
const handleSave = useCallback(() => save(data.id), [data.id]);
```

### Rule 3 — Memoize Derived Values

```tsx
const filtered = useMemo(() => users.filter(u => u.active), [users]);
```

### Rule 4 — No Inline Functions in JSX

❌ Wrong:

```tsx
<button onClick={() => remove(id)}>Remove</button>
```

✔ Correct:

```tsx
<button onClick={handleRemove}>Remove</button>
```

### Rule 5 — Avoid Passing Large Objects as Props

Pass IDs instead of entire objects.

---

## API Performance Rules (React Query)

### Rule 1 — Use `staleTime` to Reduce Refetching

```
List Data:     30 seconds
Detail Data:    5 minutes
Config Data:    Infinity
```

### Rule 2 — Avoid Duplicate Fetches

React Query dedupes based on `queryKey`.

### Rule 3 — Use `keepPreviousData` for Pagination

```ts
placeholderData: keepPreviousData,
```

### Rule 4 — Invalidate Cache After Mutations

```ts
await queryClient.invalidateQueries(["users"]);
```

---

## Lazy Loading Rules

### Dynamic Imports (Next.js)

```tsx
const Chart = dynamic(() => import("./Chart"), {
  ssr: false,
  loading: () => <Loader />,
});
```

### React Lazy

```tsx
const Editor = React.lazy(() => import("./Editor"));
```

Use for:

* Charts
* Editors
* Analytics modules
* Maps
* Heavy tables

---

## Virtualization Rules

Use virtualization for long lists:

```tsx
<FixedSizeList height={400} itemSize={50} itemCount={items.length}>
```

Benefits:

* Only visible items render
* Dramatically improves performance

---

## Debouncing & Throttling Rules

### Debounced Search

```tsx
const debouncedSearch = useDebounce(search, 400);
```

### Throttled Resize/Scroll

```tsx
const throttled = useThrottle(value, 200);
```

Never trigger API calls on every keystroke.

---

## Bundle Optimization Rules

### Rule 1 — Modular Imports Only

❌ Wrong:

```ts
import _ from "lodash";
```

✔ Correct:

```ts
import debounce from "lodash/debounce";
```

### Rule 2 — Remove Heavy Libraries

Replace:

* Moment.js → Day.js
* Lodash → Specific imports
* Large icons → smaller sets

### Rule 3 — Tree-shake Unused Code

Ensure libraries support ESM.

---

## Performance Checklist

### Rendering

* [ ] No inline anonymous functions
* [ ] Components wrapped in React.memo
* [ ] useCallback used for handlers
* [ ] useMemo used for heavy computations

### API

* [ ] Queries have defined staleTime
* [ ] Mutations invalidate correct keys
* [ ] No duplicate hits for same data

### UX

* [ ] Inputs debounced
* [ ] Heavy components lazy-loaded
* [ ] Tables > 100 rows virtualized

### Bundle

* [ ] No heavy imports
* [ ] No unused dependencies

---

## Enforcement Rules

1. No inline functions/objects.
2. All reusable components MUST use React.memo.
3. All handlers MUST use useCallback.
4. Derived values MUST use useMemo.
5. Lists MUST use virtualization if large.
6. All server data MUST use React Query.
7. Lazy load heavy features.
8. Avoid large dependencies whenever possible.
9. Cache settings (staleTime/gcTime) MUST be defined.
10. PR reviewers MUST verify performance rules.

---

## End of Document
