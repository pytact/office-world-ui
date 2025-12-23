# R13 — Styling

## Purpose

Define a strict, modern, and scalable **styling architecture** using TailwindCSS + Design Tokens + Component-Level Styling. This replaces the old `r_13` file (fileciteturn14file0) and is rewritten in the clean standardized rulebook format used in R2–R13.

The goal is to achieve:

* Pixel-perfect Figma matching
* Zero inline CSS
* Token-driven UI consistency
* Clean, modern, professional styling
* Responsive layouts that follow exact design specifications

---

## Instructions

1. All design tokens MUST be defined in:

```
src/theme/tokens/
```

2. Global base styles MUST be placed in:

```
src/theme/styles/
```

3. UI components MUST use Tailwind classes only.
4. NO raw hex codes in components — use tokens.
5. Extract exact values from Figma/wireframes (colors, spacing, radius, fonts).
6. All feature-level components must use UI primitives.
7. Never use emojis in styling, CSS, or class names.

---

## Styling Architecture Breakdown

We follow **3 core styling layers**:

### Layer 1 — Design Tokens (Global System)

Tokens define colors, spacing, typography, radii, shadows.

Example:

```ts
// tokens/colors.ts
export const colors = {
  primary: "#2563EB",
  primaryHover: "#1E40AF",
  danger: "#EF4444",
  text: "#0F172A",
};
```

### Layer 2 — Tailwind Utilities

Used for:

* spacing
* layout (grid/flex)
* alignment
* shadows
* radii
* responsiveness
* typography

### Layer 3 — UI Components (Reusable)

Styled using:

```
src/components/ui/
```

---

## Updated Styling Rules (Improved)

### Rule 1 — NO inline styles

```tsx
// ❌ Wrong
<div style={{ marginTop: 10 }} />

// ✔ Correct
<div className="mt-3" />
```

### Rule 2 — NO raw hex values in components

```tsx
// ❌ Wrong
'text-[#2563EB]'

// ✔ Correct
'text-primary'
```

### Rule 3 — Must follow Figma spacing scale

```
4px → 1
8px → 2
12px → 3
16px → 4
24px → 6
```

### Rule 4 — No arbitrary spacing unless explicitly required

```
❌ p-[17px]
✔ p-4
```

### Rule 5 — Typography via tokens only

```tsx
<h1 className="text-h1">Dashboard</h1>
```

### Rule 6 — Consistent radius from tokens

```
rounded-md (6px)
rounded-lg (8px)
rounded-xl (12px)
```

### Rule 7 — Respect design-specific shadows

```
shadow-sm
shadow-md
shadow-lg
```

### Rule 8 — Dark Mode must follow theme variables

```tsx
bg-background-dark text-text-dark
```

---

## Tailwind Configuration Rules

Extend Tailwind with tokens:

```ts
extend: {
  colors,
  spacing: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    6: "24px",
  },
  borderRadius: {
    md: "6px",
    lg: "8px",
    xl: "12px",
  },
}
```

---

## Component Styling Rules

All UI primitives must:

* Use Tailwind classes
* Follow design tokens
* Support variants (primary, outline, ghost)
* Support sizes (sm, md, lg)

Example — Button:

```tsx
export function Button({ variant = "primary", children }) {
  const base = "px-4 py-3 rounded-lg font-medium";
  const variants = {
    primary: "bg-primary text-white hover:bg-primaryHover",
    outline: "border border-primary text-primary hover:bg-primary/10",
    ghost: "text-primary hover:bg-gray-50",
  };
  return <button className={`${base} ${variants[variant]}`}>{children}</button>;
}
```

---

## Responsive Rules

Breakpoints must follow design:

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

Example:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
```

---

## Layout Rules

* Use grid/flex for layout
* Avoid absolute positioning
* Containers must follow Figma max-width

Example:

```tsx
<div className="max-w-7xl mx-auto p-6"></div>
```

---

## Animation Rules

Use Tailwind transitions only:

```tsx
<div className="transition-all duration-200 hover:scale-105"></div>
```

---

## Pixel-Perfect Figma Implementation Rules

Every UI element must match Figma exactly:

* Exact spacing values
* Exact radii
* Exact shadows
* Exact typography
* Exact layout grid

---

## Enforcement Rules

1. No inline CSS
2. No raw pixel values unless from Figma
3. No raw hex colors in components
4. No emojis in UI styling
5. All spacing must use tokens
6. All typography must use token classes
7. UI must match Figma precisely
8. Layouts must match grid system
9. All feature components must use UI primitives
10. Consistency is mandatory acro
