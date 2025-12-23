# R16 — Reusable Components

## Purpose

Define a strict, scalable, and enforceable rulebook for building **reusable UI components** across the entire application.
This replaces the old `r_16_reusable_components_updated.md` and the previous R16 (fileciteturn18file0 fileciteturn18file1), rewritten in the clean architectural style used from R2–R15.

The goal:

* Zero duplicated components
* Maximum UI reusability
* Consistent design system usage
* Cleaner feature modules
* Reduced bundle size and maintenance cost

---

## Instructions

1. ALL reusable UI components MUST be placed inside:

```
src/components/ui/
```

2. Feature-specific components MUST live inside:

```
src/modules/<feature>/components/
```

3. NEVER create a new component before checking existing ones.
4. If a similar component exists → refactor it to support props.
5. Reusable components MUST be generic, typed, and Figma-aligned.
6. No business logic is allowed inside UI primitives.
7. All components MUST support variants, sizes, and states.

---

## Component Layers

### Layer 1 — UI Primitives (Global)

Reusable, design-system aligned components:

* Button
* Input
* Select
* Modal
* Tabs
* Card
* Badge
* Table (base)
* Pagination
* Alert
* Form components

### Layer 2 — Feature Components

Examples:

* UserTable
* ProfileCard
* ProjectOverviewCard

These **compose primitives**, NOT create new UI patterns.

### Layer 3 — Screens / Containers

Contain business logic and hook usage.
NEVER contain UI primitives internally.

---

## Updated Rules (Improved)

### Rule 1 — A reusable component MUST be generic

Correct:

```tsx
<Button>Save</Button>
```

Incorrect:

```tsx
<SaveButton />
```

### Rule 2 — NO business logic inside reusable components

❌ Wrong:

```tsx
export function Button() {
  const { user } = useAuth();
}
```

✔ Correct:

```tsx
export function Button({ onClick }) { ... }
```

### Rule 3 — Components MUST support:

* `variant`
* `size`
* `state` (loading, disabled)

### Rule 4 — MUST use design tokens (R12 / R14)

No hex values or random CSS.

### Rule 5 — MUST be fully typed

Interfaces MUST live inside:

```
src/utils/types/component/
```

### Rule 6 — Composition > Inheritance

Correct:

```tsx
<Card>
  <Card.Header />
  <Card.Body />
</Card>
```

### Rule 7 — MUST support `className` override

---

## Component API Template

```ts
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "subtle" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}
```

---

## Styling Rules

Reusable components MUST:

* Use Tailwind only
* Follow spacing tokens
* Follow typography tokens
* Use semantic hover/active/disabled states

Example:

```tsx
<button className={`${base} ${variants[variant]} ${sizes[size]}`}>{children}</button>
```

---

## Accessibility Rules

Every component MUST:

* Support ARIA attributes
* Support keyboard navigation
* Use semantic HTML
* Provide visible focus

Example:

```tsx
<input aria-label="Email" />
```

---

## Reusability Patterns

### Pattern 1 — Props-Based Reusability

Convert similar components into ONE:

```tsx
<TeamMembersSection maxMembers={3} showHeader={true} />
```

### Pattern 2 — Shared Data Files

All repeated datasets MUST live in:

```
src/data/
```

### Pattern 3 — Layout Variants

```tsx
<AboutSection layout="landing" />
```

---

## When To Create a Reusable Component

You MUST create one if:

* UI is used in 2+ places
* Is part of the design system
* Figma defines it as a reusable primitive
* Feature components repeat the same structure

---

## When NOT To Create a Reusable Component

Do NOT create a reusable component if:

* It is used only once
* It contains business logic
* It is layout-specific
* It violates Figma styling rules
* It is too custom to generalize

---

## Enforcement Rules

1. MUST search the codebase before creating new components.
2. MUST refactor existing components instead of duplicating.
3. MUST follow design tokens.
4. MUST maintain accessibility.
5. MUST create variants and sizes for primitives.
6. MUST keep feature components free of UI primitives.
7. MUST remove any duplicated component on detection.

---

## End of Document
