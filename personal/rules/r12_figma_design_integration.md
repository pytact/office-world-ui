# R12 — Figma Design Integration

## Purpose

Provide a precise, scalable, and enforceable workflow for converting **Figma designs → production‑ready UI**. This prevents UI drift, ensures pixel‑perfect execution, and standardizes how developers interpret and implement Figma layouts.

This rule replaces the old file r_12 and follows the updated version (fileciteturn13file0) but rewritten in the clean R2–R11 rulebook style.

---

## Instructions

1. All design-driven tokens MUST be placed inside:

```
src/theme/tokens/
```

2. All global styling MUST be placed inside:

```
src/theme/styles/
```

3. All reusable UI primitives MUST be defined in:

```
src/components/ui/
```

4. No feature may create new primitive UI elements.
5. Every screen MUST implement Figma spacing, color, typography, and sizing **exactly**.
6. Components must follow Figma component library definitions.
7. No raw values allowed — only tokens.

---

## Schema — Token Definitions

### Colors

```ts
// tokens/colors.ts
export const colors = {
  primary: "#2563EB",
  secondary: "#64748B",
  danger: "#EF4444",
  success: "#10B981",
};
```

### Typography

```ts
// tokens/typography.ts
export const typography = {
  h1: "text-4xl font-bold",
  h2: "text-3xl font-semibold",
  body: "text-base font-normal",
};
```

### Spacing (4px Grid)

```
4px, 8px, 12px, 16px, 20px, 24px
```

---

## Rule Set (Updated)

### Rule 1 — UI MUST match Figma exactly

* Same spacing
* Same colors
* Same typography
* Same radius
* Same shadows
* Same grid layout

### Rule 2 — Extract ALL design tokens

Tokens MUST be extracted from Figma before writing components:

* Colors
* Spacing
* Radius
* Shadows
* Typography

### Rule 3 — No raw hex codes or pixel values

❌ Wrong:

```tsx
className="text-[#2563EB]"
```

✔ Correct:

```tsx
className="text-primary"
```

### Rule 4 — Use Tailwind theme extension

Tokens must be mapped in Tailwind config.

### Rule 5 — UI primitives MUST come from design system

Examples:

* Button
* Input
* Select
* Card
* Tabs
* Badges

### Rule 6 — Spacing MUST match Figma spacing

Example mapping:

```
16px → p-4
24px → p-6
```

### Rule 7 — Use design tokens internally for consistency

Typography must use defined text styles.

---

## Figma → UI Workflow

### Step 1 — Inspect Layout Grid

Extract:

* max width
* margins
* columns
* responsive breakpoints

### Step 2 — Extract spacing

Document:

* padding
* gaps
* alignment

### Step 3 — Extract Typography

Each text element → match token.

### Step 4 — Extract Colors

Map fills, strokes, shadows.

### Step 5 — Identify Components

Any repeating visual element → UI primitive.

### Step 6 — Build components using Tailwind

Never use inline styles.

---

## Example — Button Implementation

**Figma:**

* Height: 40px
* Padding: 16px × 12px
* Radius: 8px
* Font: Medium 14px
* Color: Primary (#2563EB)

**UI:**

```tsx
export function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="h-10 px-4 py-3 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover"
    >
      {children}
    </button>
  );
}
```

---

## Responsive Rules

Breakpoints MUST match Figma:

```
sm: 640px
md: 768px
tl: 1024px
xl: 1280px
```

---

## Enforcement Rules

1. No raw color codes in components.
2. All spacing follows design tokens.
3. No ad-hoc CSS unless sanctioned.
4. All typography must follow token definitions.
5. No UI primitives inside feature modules.
6. Responsive layout must match design.
7. Dark mode must follow theme tokens.
8. All UI must map 1:1 with Figma components.

---

## End of Document
