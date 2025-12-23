# UI Foundation Configuration
## officeWorld SaaS Platform

**Version:** 1.0.0  
**Status:** LOCKED (Phase-0 Complete)  
**Date:** 2024

---

## ⚠️ FOUNDATION RULES

This document defines the **GLOBAL UI FOUNDATION** for the entire officeWorld project.

### Enforcement Rules

- **GLOBAL**: All decisions apply to the entire project
- **MANDATORY**: Must be followed everywhere
- **IMMUTABLE**: Cannot be changed mid-project
- **ENFORCED**: No component- or page-level overrides allowed

**Any UI decision not finalized in this document is NOT allowed later.**

---

## 1. Layout System

### 1.1 Primary Application Layout
- **Layout Type**: Sidebar (left)
- **Sidebar Behavior**: Fixed left sidebar
- **Top Navigation**: Not included (sidebar-only layout)

### 1.2 Responsive Priority
- **Strategy**: Responsive
- **Approach**: Equal consideration for all breakpoints
- **Breakpoints**: Standard (sm, md, lg, xl)

### 1.3 Page Width Behavior
- **Default**: Full-width
- **Container Strategy**: Full-width pages with internal content containers as needed

---

## 2. Navigation Rules

### 2.1 Navigation Depth
- **Type**: Role-based dynamic menus
- **Structure**: Menu items dynamically generated based on user role
- **Hierarchy**: Single-level navigation (no nested accordions)

### 2.2 Active Navigation State
- **Style**: Background highlight
- **Implementation**: Active menu item shows background color change
- **Color**: Uses PRIMARY color token for active state

---

## 3. Color System

### 3.1 Color Strategy
- **Approach**: Neutral + accent
- **Base**: Neutral grays with accent colors for actions

### 3.2 Theme Support
- **Modes**: Light + Dark
- **Implementation**: Full theme switching support required

### 3.3 Primary Color Palette

```typescript
// Brand Colors
PRIMARY: "#272757"           // Primary brand color
PRIMARY_HOVER: "#1E1E3F"     // Darker shade for hover states
SECONDARY: "#8686AC"          // Secondary/accent color
SECONDARY_HOVER: "#6B6B8F"    // Darker shade for hover states
NEUTRAL_BASE: "#505081"       // Neutral base color
```

### 3.4 Background Colors

```typescript
BACKGROUND_PRIMARY: "#FFFFFF"      // Main application background
BACKGROUND_SECONDARY: "#F8F9FA"    // Secondary backgrounds (cards, panels)
BACKGROUND_NEUTRAL: "#505081"      // Neutral backgrounds
BACKGROUND_DARK: "#1E1E3F"         // Dark theme background
```

### 3.5 Text Colors

```typescript
TEXT_PRIMARY: "#000000"       // Primary text color
TEXT_SECONDARY: "#000000"     // Secondary text color (same as primary)
TEXT_MUTED: "#636363"         // Muted/disabled text color
TEXT_DISABLED: "#636363"      // Disabled text color
TEXT_INVERSE: "#FFFFFF"       // Text on dark backgrounds
```

### 3.6 Status Colors

```typescript
// Success (Green)
SUCCESS: "#10B981"
SUCCESS_BG: "#D1FAE5"
SUCCESS_TEXT: "#065F46"

// Warning (Yellow)
WARNING: "#F59E0B"
WARNING_BG: "#FEF3C7"
WARNING_TEXT: "#92400E"

// Error (Red)
ERROR: "#EF4444"
ERROR_BG: "#FEE2E2"
ERROR_TEXT: "#991B1B"

// Info (Blue)
INFO: "#3B82F6"
INFO_BG: "#DBEAFE"
INFO_TEXT: "#1E40AF"
```

### 3.7 Border Colors

```typescript
BORDER_DEFAULT: "#E5E7EB"    // Default borders
BORDER_FOCUS: "#272757"       // Focus borders (uses primary)
BORDER_ERROR: "#EF4444"       // Error borders
BORDER_LIGHT: "#F3F4F6"       // Light borders
```

### 3.8 Navigation Colors

```typescript
NAV_ACTIVE_BG: "#272757"      // Active navigation background
NAV_ACTIVE_TEXT: "#FFFFFF"    // Active navigation text
NAV_HOVER_BG: "#505081"       // Navigation hover background
NAV_TEXT: "#000000"           // Default navigation text
NAV_BG: "#FFFFFF"             // Navigation background
```

---

## 4. Typography System

### 4.1 Font Source
- **Type**: System font
- **Fallback**: System font stack

### 4.2 Font Family

```typescript
FONT_FAMILY: "Times New Roman, serif"
FONT_FAMILY_SYSTEM: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
```

### 4.3 Font Weights

```typescript
FONT_WEIGHT_MEDIUM: 500  // Only weight available
```

**Note**: Only Medium (500) weight is available. Use this for all text.

### 4.4 Typography Scale

**Strategy**: Fluid / Responsive Scale

```typescript
// Heading Scale (Fluid)
H1: {
  fontSize: "clamp(2rem, 5vw, 3rem)",
  fontWeight: 500,
  lineHeight: 1.2
}

H2: {
  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
  fontWeight: 500,
  lineHeight: 1.3
}

H3: {
  fontSize: "clamp(1.5rem, 3vw, 2rem)",
  fontWeight: 500,
  lineHeight: 1.4
}

H4: {
  fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
  fontWeight: 500,
  lineHeight: 1.4
}

H5: {
  fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
  fontWeight: 500,
  lineHeight: 1.5
}

H6: {
  fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
  fontWeight: 500,
  lineHeight: 1.5
}

// Body Text
BODY: {
  fontSize: "clamp(0.875rem, 1vw, 1rem)",
  fontWeight: 500,
  lineHeight: 1.6
}

// Small Text
SMALL: {
  fontSize: "clamp(0.75rem, 0.875vw, 0.875rem)",
  fontWeight: 500,
  lineHeight: 1.5
}

// Caption
CAPTION: {
  fontSize: "clamp(0.625rem, 0.75vw, 0.75rem)",
  fontWeight: 500,
  lineHeight: 1.4
}
```

---

## 5. Spacing System

### 5.1 Spacing Density
- **Strategy**: Comfortable
- **Base Unit**: 4px grid system

### 5.2 Spacing Tokens

```typescript
SPACING_0: "0px"
SPACING_1: "4px"
SPACING_2: "8px"
SPACING_3: "12px"
SPACING_4: "16px"
SPACING_5: "20px"
SPACING_6: "24px"
SPACING_8: "32px"
SPACING_10: "40px"
SPACING_12: "48px"
SPACING_16: "64px"
SPACING_20: "80px"
SPACING_24: "96px"
```

### 5.3 Usage Guidelines
- Use spacing tokens for all padding and margins
- Follow 4px grid system strictly
- Comfortable density means generous spacing between elements

---

## 6. Border Radius

### 6.1 Border Radius Strategy
- **Style**: Sharp (0–4px)
- **Maximum**: 4px

### 6.2 Border Radius Tokens

```typescript
RADIUS_NONE: "0px"
RADIUS_SM: "2px"
RADIUS_MD: "4px"
RADIUS_MAX: "4px"  // Maximum allowed
```

### 6.3 Usage Guidelines
- Use sharp corners (0–4px) for all components
- Maximum border radius is 4px
- No rounded corners beyond this limit

---

## 7. Shadows

### 7.1 Shadow Strategy
- **Style**: Soft shadow
- **Usage**: Cards and elevated components

### 7.2 Shadow Tokens

```typescript
SHADOW_NONE: "none"
SHADOW_SM: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
SHADOW_MD: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
SHADOW_LG: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
SHADOW_CARD: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"  // Soft shadow for cards
SHADOW_ELEVATED: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
```

---

## 8. Card System

### 8.1 Card Design Style
- **Style**: Soft shadow
- **Background**: White (#FFFFFF)
- **Border**: Optional light border

### 8.2 Card Tokens

```typescript
CARD_BG: "#FFFFFF"
CARD_SHADOW: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
CARD_BORDER_RADIUS: "4px"
CARD_PADDING: "24px"
CARD_BORDER: "1px solid #E5E7EB"  // Optional
```

---

## 9. Button System

### 9.1 Button Variants
- **Available**: Primary only
- **Note**: Only Primary variant is allowed. No Secondary, Outline, Ghost, or Icon-only buttons.

### 9.2 Button Tokens

```typescript
BUTTON_PRIMARY_BG: "#272757"
BUTTON_PRIMARY_TEXT: "#FFFFFF"
BUTTON_PRIMARY_HOVER: "#1E1E3F"
BUTTON_PRIMARY_ACTIVE: "#1E1E3F"
BUTTON_DISABLED_BG: "#E5E7EB"
BUTTON_DISABLED_TEXT: "#636363"
BUTTON_PADDING_X: "16px"
BUTTON_PADDING_Y: "12px"
BUTTON_BORDER_RADIUS: "4px"
BUTTON_FONT_SIZE: "1rem"
BUTTON_FONT_WEIGHT: 500
```

### 9.3 Button Behaviors
- **Loading State**: Required (spinner + disabled state)
- **Disabled State**: Required
- **Permission-based Visibility**: Required (hide/show based on user permissions)

### 9.4 Button States

```typescript
// Primary Button States
PRIMARY_DEFAULT: {
  backgroundColor: "#272757",
  color: "#FFFFFF"
}

PRIMARY_HOVER: {
  backgroundColor: "#1E1E3F",
  color: "#FFFFFF"
}

PRIMARY_DISABLED: {
  backgroundColor: "#E5E7EB",
  color: "#636363",
  cursor: "not-allowed"
}

PRIMARY_LOADING: {
  backgroundColor: "#272757",
  color: "#FFFFFF",
  opacity: 0.7
}
```

---

## 10. Data Display Rules

### 10.1 Preferred Data Presentation
- **Strategy**: Mixed (Cards + Tables)
- **Usage**: Use cards for summary views, tables for detailed lists

### 10.2 Table Features
- **Pagination**: Required
- **Sorting**: Not allowed
- **Filtering**: Not allowed
- **Sticky Headers**: Not allowed

### 10.3 Table Tokens

```typescript
TABLE_BG: "#FFFFFF"
TABLE_HEADER_BG: "#F8F9FA"
TABLE_BORDER: "1px solid #E5E7EB"
TABLE_ROW_HOVER: "#F8F9FA"
TABLE_CELL_PADDING: "16px"
```

---

## 11. Form System

### 11.1 Form Layout
- **Strategy**: Adaptive
- **Behavior**: Automatically adjusts based on screen size and form complexity

### 11.2 Form Validation
- **Strategy**: Both (inline + on submit)
- **Inline Validation**: Show errors as user types/leaves field
- **Submit Validation**: Validate all fields on form submission

### 11.3 Form Tokens

```typescript
INPUT_BG: "#FFFFFF"
INPUT_BORDER: "1px solid #E5E7EB"
INPUT_BORDER_FOCUS: "1px solid #272757"
INPUT_BORDER_ERROR: "1px solid #EF4444"
INPUT_BORDER_RADIUS: "4px"
INPUT_PADDING: "12px 16px"
INPUT_TEXT_COLOR: "#000000"
INPUT_PLACEHOLDER_COLOR: "#636363"
INPUT_DISABLED_BG: "#F3F4F6"
INPUT_DISABLED_TEXT: "#636363"
```

---

## 12. Animation & Feedback

### 12.1 Animation Policy
- **Strategy**: None
- **Rule**: No animations, transitions, or motion effects allowed

### 12.2 Feedback System
- **Strategy**: Both (global toasts + inline alerts)
- **Global Toasts**: For success/error messages
- **Inline Alerts**: For form validation and contextual feedback

### 12.3 Toast Tokens

```typescript
TOAST_SUCCESS_BG: "#D1FAE5"
TOAST_SUCCESS_TEXT: "#065F46"
TOAST_SUCCESS_BORDER: "#10B981"
TOAST_ERROR_BG: "#FEE2E2"
TOAST_ERROR_TEXT: "#991B1B"
TOAST_ERROR_BORDER: "#EF4444"
TOAST_WARNING_BG: "#FEF3C7"
TOAST_WARNING_TEXT: "#92400E"
TOAST_WARNING_BORDER: "#F59E0B"
TOAST_INFO_BG: "#DBEAFE"
TOAST_INFO_TEXT: "#1E40AF"
TOAST_INFO_BORDER: "#3B82F6"
```

---

## 13. Figma & Design Source

### 13.1 Figma Status
- **Status**: Not started
- **Note**: No Figma designs available. All design decisions are defined in code.

### 13.2 Design Tokens Source
- **Source**: Defined in code
- **Location**: Design tokens defined in this configuration file and implemented in theme/tokens directory

---

## 14. Dark Theme Support

### 14.1 Dark Theme Colors

```typescript
// Dark Theme Backgrounds
DARK_BACKGROUND_PRIMARY: "#1E1E3F"
DARK_BACKGROUND_SECONDARY: "#272757"
DARK_BACKGROUND_NEUTRAL: "#505081"

// Dark Theme Text
DARK_TEXT_PRIMARY: "#FFFFFF"
DARK_TEXT_SECONDARY: "#E5E7EB"
DARK_TEXT_MUTED: "#9CA3AF"
DARK_TEXT_DISABLED: "#6B7280"

// Dark Theme Borders
DARK_BORDER_DEFAULT: "#374151"
DARK_BORDER_FOCUS: "#8686AC"
DARK_BORDER_ERROR: "#EF4444"

// Dark Theme Navigation
DARK_NAV_ACTIVE_BG: "#272757"
DARK_NAV_ACTIVE_TEXT: "#FFFFFF"
DARK_NAV_HOVER_BG: "#505081"
DARK_NAV_TEXT: "#E5E7EB"
DARK_NAV_BG: "#1E1E3F"
```

---

## 15. Component Specifications

### 15.1 Sidebar Component

```typescript
SIDEBAR_WIDTH: "256px"
SIDEBAR_BG: "#FFFFFF"
SIDEBAR_BORDER: "1px solid #E5E7EB"
SIDEBAR_PADDING: "24px"
SIDEBAR_ITEM_PADDING: "12px 16px"
SIDEBAR_ITEM_BORDER_RADIUS: "4px"
```

### 15.2 Page Container

```typescript
PAGE_PADDING: "24px"
PAGE_MAX_WIDTH: "100%"  // Full-width
PAGE_BG: "#FFFFFF"
```

### 15.3 Badge Component

```typescript
BADGE_PADDING: "4px 12px"
BADGE_BORDER_RADIUS: "4px"
BADGE_FONT_SIZE: "0.875rem"
BADGE_FONT_WEIGHT: 500
```

---

## 16. Usage Guidelines

### 16.1 Color Usage Rules

1. **NEVER use direct hex values in components**
2. **ALWAYS use color tokens**
3. **Primary color** → buttons, links, active states
4. **Secondary color** → badges, highlights, accents
5. **Status colors** → success, warning, error, info states

### 16.2 Typography Usage Rules

1. **ONLY use Times New Roman font family**
2. **ONLY use Medium (500) font weight**
3. **Use fluid/responsive typography scale**
4. **Follow heading hierarchy (H1–H6)**

### 16.3 Spacing Usage Rules

1. **ALWAYS use spacing tokens**
2. **Follow 4px grid system**
3. **Use comfortable density (generous spacing)**
4. **No arbitrary spacing values**

### 16.4 Border Radius Rules

1. **Maximum border radius: 4px**
2. **Use sharp corners (0–4px)**
3. **No rounded corners beyond 4px**

### 16.5 Button Usage Rules

1. **ONLY use Primary button variant**
2. **Include loading and disabled states**
3. **Implement permission-based visibility**
4. **No other button variants allowed**

### 16.6 Animation Rules

1. **NO animations allowed**
2. **NO transitions**
3. **NO motion effects**
4. **Instant state changes only**

---

## 17. Implementation Checklist

### 17.1 Theme Setup
- [ ] Create theme/tokens directory structure
- [ ] Implement all color tokens
- [ ] Implement typography tokens
- [ ] Implement spacing tokens
- [ ] Implement border radius tokens
- [ ] Implement shadow tokens
- [ ] Set up dark theme support

### 17.2 Component Library
- [ ] Create Primary Button component
- [ ] Create Card component (soft shadow)
- [ ] Create Table component (pagination only)
- [ ] Create Form components (adaptive layout)
- [ ] Create Toast component (global)
- [ ] Create Alert component (inline)
- [ ] Create Badge component
- [ ] Create Sidebar component (left, fixed)

### 17.3 Layout System
- [ ] Implement left sidebar layout
- [ ] Implement full-width page container
- [ ] Implement responsive breakpoints
- [ ] Implement role-based dynamic navigation

### 17.4 Validation
- [ ] Ensure no direct hex values in components
- [ ] Ensure only token-based color usage
- [ ] Ensure only Times New Roman font
- [ ] Ensure only Medium (500) font weight
- [ ] Ensure no animations
- [ ] Ensure only Primary button variant
- [ ] Ensure border radius max 4px

---

## 18. Enforcement

### 18.1 Code Review Checklist

All code reviews must verify:

- [ ] No direct hex color values
- [ ] Only token-based colors used
- [ ] Only Times New Roman font family
- [ ] Only Medium (500) font weight
- [ ] No animations or transitions
- [ ] Only Primary button variant
- [ ] Border radius ≤ 4px
- [ ] Comfortable spacing density
- [ ] Soft shadow for cards
- [ ] Full-width pages
- [ ] Left sidebar layout
- [ ] Role-based navigation

### 18.2 Linting Rules

Configure ESLint/Prettier to enforce:
- Color token usage (no hex values)
- Typography token usage
- Spacing token usage
- Border radius limits
- No animation CSS properties

---

## 19. Change Log

### Version 1.0.0 (Phase-0 Lock)
- Initial UI foundation locked
- All design tokens defined
- Global rules established
- Component specifications documented

---

## 20. Contact & Questions

For questions about this foundation:
- Refer to this document first
- All decisions are final and immutable
- No exceptions without project-wide approval

---

**END OF UI FOUNDATION CONFIGURATION**

This document is the single source of truth for all UI decisions in the officeWorld project.

