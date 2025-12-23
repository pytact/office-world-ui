# R14 — Error Prevention & Common Issues

## Purpose

Provide a strict, predictable, and enforceable rulebook for **preventing errors**, avoiding common pitfalls, and eliminating instability across the entire frontend codebase.

This replaces the old **r_15_error_prevention_and_common_issues_updated.md** and is rewritten in the **new R2–R14 enterprise rulebook style**.

The goal is:

* Reduce production bugs
* Standardize prevention strategies
* Enforce architectural discipline
* Improve developer consistency
* Catch mistakes before they reach runtime

---

## Instructions

1. Apply these rules to **every feature, every module, every developer**.
2. All rules are **mandatory** — no exceptions.
3. Use strict TypeScript + ESLint + architectural constraints.
4. Avoid anti-patterns that commonly introduce regressions.
5. Integrate checks into CI/CD to prevent merges that break standards.

---

## Core Principles

### 1. **Strict Type Safety First**

* Never use `any`, `unknown`, `Record<string, any>`.
* Always define request/response types (R2, R3).
* All components/hooks/services must be fully typed.

### 2. **Predictable API Behavior**

* Normalize all errors (R8).
* Always use typed services.
* No API call inside components.

### 3. **Clean Rendering Patterns**

* No inline objects/functions.
* Use memoization (`useMemo`, `useCallback`).
* Use React.memo for UI primitives.

### 4. **Single Responsibility for Each Layer**

* Components = UI only.
* Hooks = state + logic.
* Services = API calls only.
* Context = global app state only.

### 5. **Zero Duplication**

* All duplicated code MUST be centralized.

---

## Common Issues & How to Prevent Them

### Issue 1 — API Shape Mismatch

**Cause:** Incorrect or outdated request/response structures.

**Prevention:**

* Always sync types with backend spec.
* Centralize request types (R2).
* Centralize response types (R3).
* Backend naming MUST be used exactly.

---

### Issue 2 — Unhandled API Errors

**Cause:** Missing or inconsistent error mapping.

**Prevention:**

* Always wrap service calls in try/catch.
* Always use `normalizeAPIError` (R8).
* UI must use `<ErrorComponent />`.

---

### Issue 3 — Re-render Loops

**Cause:** Inline functions, objects, or state mismanagement.

**Prevention:**

* Wrap handlers in `useCallback`.
* Derived values in `useMemo`.
* Avoid passing large objects as props.

---

### Issue 4 — Stale API Data

**Cause:** Missing cache, inconsistent invalidation.

**Prevention:**

* Use React Query for all server data.
* Set `staleTime` and `gcTime` (R9).
* Use invalidation rules after mutations.

---

### Issue 5 — Form Validation Errors

**Cause:** Missing schema validation.

**Prevention:**

* Always use Zod schemas (R10).
* Always map backend fieldErrors.
* Never validate inside JSX.

---

### Issue 6 — UI/UX Inconsistency

**Cause:** Ad-hoc styling or spacing.

**Prevention: (R12, R14)**

* Use design tokens only.
* Follow Figma exact spacing.
* Use Tailwind utilities only.
* Never use raw CSS unless approved.

---

### Issue 7 — Broken Routing

**Cause:** Manually building URLs or missing guards.

**Prevention (R11):**

* Use route helper functions.
* Use centralized RouteGuard.
* Follow the 4-page route structure.

---

### Issue 8 — Leaking Server State into Context

**Cause:** Misunderstanding of app vs server state.

**Prevention:**

* Only React Query stores server data.
* Context stores global UI state only.
* Never put API data inside context.

---

### Issue 9 — Incorrect Feature Boundaries

**Cause:** Mixing components, hooks, services.

**Prevention:**

* Follow strict module boundaries:

```
src/modules/<feature>/components/
src/modules/<feature>/hooks/
src/modules/<feature>/forms/
src/modules/<feature>/services/
```

---

### Issue 10 — Context Provider Not Wrapping Components

**Cause:** Using context hooks (`useAuthContext`, `useOrganizationContext`, etc.) in components that are not wrapped by their respective providers.

**Common Scenarios:**
* Layout file in wrong location (e.g., `src/app/layout.tsx` instead of `app/layout.tsx` in Next.js App Router)
* Providers not included in root layout
* Client component using context before providers are mounted
* Server component trying to use client-side context hooks

**Error Message:**
```
Error: useAuthContext must be used within an AuthProvider
Error: useOrganizationContext must be used within an OrganizationProvider
```

**Prevention:**

* **Next.js App Router:** Always place root layout at `app/layout.tsx` (NOT `src/app/layout.tsx`)
* **Ensure providers wrap all routes:**
  ```tsx
  // app/layout.tsx (CORRECT)
  import { AppProviders } from "@/components/providers/AppProviders";
  
  export default function RootLayout({ children }) {
    return (
      <html>
        <body>
          <AppProviders>{children}</AppProviders>
        </body>
      </html>
    );
  }
  ```

* **Verify provider structure:**
  ```tsx
  // components/providers/AppProviders.tsx
  export function AppProviders({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <OrganizationProvider>
            {children}
          </OrganizationProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  }
  ```

* **Check provider order:** React Query → Auth → Organization (outer to inner)
* **Ensure all context-using components are client components:** Add `"use client"` directive
* **Never use context hooks in server components:** Only in client components

**Debugging Steps:**
1. Verify `app/layout.tsx` exists and includes `AppProviders`
2. Check that `AppProviders` includes all required providers
3. Ensure components using context have `"use client"` directive
4. Verify provider nesting order is correct
5. Check browser console for provider-related errors

---

### Issue 11 — CORS/Network Errors During API Calls

**Cause:** Cross-Origin Resource Sharing (CORS) policy blocking requests from frontend to backend, or network connectivity issues.

**Common Scenarios:**
* Frontend running on `localhost:3000` trying to access backend on different origin (e.g., `192.168.1.17:8000`)
* Backend CORS configuration not allowing frontend origin
* Network errors due to server being down or unreachable
* Axios network errors without proper error handling

**Error Messages:**
```
Network Error
ERR_NETWORK
Provisional headers are shown (in browser DevTools)
Access to XMLHttpRequest has been blocked by CORS policy
```

**Prevention:**

* **Backend CORS Configuration:**
  * Ensure backend allows frontend origin in CORS headers
  * Example for FastAPI:
    ```python
    from fastapi.middleware.cors import CORSMiddleware
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    ```

* **Error Handler Must Detect Network Errors:**
  ```ts
  // utils/helpers/errorHandler.ts
  if (error instanceof AxiosError && !error.response && error.request) {
    if (error.code === "ERR_NETWORK") {
      return {
        message: "Network Error: Unable to connect to the server. Please check if the API server is running and CORS is configured correctly.",
        statusCode: 0,
      };
    }
  }
  ```

* **UI Must Show Clear Error Messages:**
  ```tsx
  // Handle network errors in form submission
  if (normalizedError?.statusCode === 0) {
    form.setError("root", {
      type: "server",
      message: "Network Error: Unable to connect to the server. Please check if the API server is running and CORS is configured correctly.",
    });
  }
  ```

* **Environment Variable Check:**
  * Always verify `NEXT_PUBLIC_API_URL` is set correctly
  * Use `.env.local` for local development
  * Never hardcode API URLs

* **Development Setup:**
  * Use same origin for frontend and backend during development (proxy)
  * Or configure backend to allow frontend origin
  * Test API connectivity independently (using Postman/curl)

**Debugging Steps:**
1. Check browser DevTools Network tab for failed requests
2. Look for CORS error messages in Console tab
3. Verify `NEXT_PUBLIC_API_URL` environment variable is set
4. Test API endpoint directly (curl/Postman) to verify backend is running
5. Check backend CORS configuration allows frontend origin
6. Verify network connectivity (ping backend server)
7. Check if backend server is running and accessible

**Common Solutions:**
* **Backend CORS Fix:** Add frontend origin to allowed origins in backend
* **Proxy Setup:** Use Next.js rewrites to proxy API calls (same origin)
* **Environment Variables:** Ensure `NEXT_PUBLIC_API_URL` matches actual backend URL
* **Network Check:** Verify backend server is running and accessible

---

## Error Prevention Rules (Mandatory)

### Rule 1 — No silent failures

Every error MUST be shown to the UI or logged properly.

### Rule 2 — No console.logs in production

Use only a centralized logger.

### Rule 3 — No hard-coded strings

Centralize messages and labels.

### Rule 4 — No duplicated logic

Extract reusable functions.

### Rule 5 — No untyped inputs/outputs

Everything must be typed.

### Rule 6 — No mixed responsibilities

One function = one job.

### Rule 7 — No inline logic in JSX

JSX must be clean.

### Rule 8 — No direct manipulation of DOM

Use React patterns.

---

## Best Practices for Stability

### Use defensive coding

```ts
if (!data) return [];
```

### Always handle loading and empty states

```tsx
if (isLoading) return <Loader />;
if (!data.length) return <Empty />;
```

### Use Suspense for heavy features

Lazy load expensive components.

### Keep components small

Max 250 lines per file.

### Always test behavior before merging

* API response handling
* Error states
* Permission logic
* Routing
* Form validation

---

## Checklist Before Merge

### Type Safety

* [ ] No `any` or untyped values
* [ ] All request & response types match backend
* [ ] All functions/components fully typed

### Code Quality

* [ ] No console.logs
* [ ] No inline logic
* [ ] No duplicated code
* [ ] Uses memoization correctly

### Stability

* [ ] All API errors mapped
* [ ] All UI states handled
* [ ] No infinite loops or re-renders
* [ ] Proper routing structure

### Architecture

* [ ] Feature boundaries respected
* [ ] No API calls in components
* [ ] React Query used for all server data
* [ ] Context used only for UI/app state

---

## Enforcement Rules

1. ALL rules are mandatory.
2. PR reviewer MUST reject code that violates any rule.
3. CI must block builds on ESLint/Type errors.
4. All developers must follow R1–R15 architecture standards.
5. Violations must be fixed before merge.

---

## End of Document
