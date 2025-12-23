# R17 — UX Perception & Intent Governance

## Purpose

R17 introduces a **mandatory UX governance layer** that sits **above R1–R16**.
It ensures that every screen, flow, and interaction is:

- Visually clear
- Predictable to users
- Cognitively light
- Intentionally designed

This rule **does not replace** engineering rules.
It **controls perception, clarity, and user confidence**.

R17 exists to fix the gap where UI is *technically correct* but *experientially weak*.

---

## Core Principle (Non-Negotiable)

> **If a user cannot immediately understand what to look at and what to do next, the UX has failed — even if the code is perfect.**

---

## Rule Positioning & Precedence

**Execution Order (Mandatory):**

1. R17 — UX Perception & Intent Governance
2. R1–R16 — Engineering & UI Architecture Rules

R17 decisions are:
- GLOBAL
- MANDATORY
- IMMUTABLE per feature
- NOT overridable by components

---

## UX FAILURE SIGNALS (What R17 Prevents)

R17 MUST be applied if you observe:

- UI feels "flat" or "crowded"
- Users hesitate before clicking
- Everything looks equally important
- Pages feel consistent but confusing
- Primary action is not obvious

---

## PHASE-UX-0 — UX INTENT LOCK (MANDATORY)

This phase runs **BEFORE ANY STRUCTURE, ROUTING, OR COMPONENT WORK**.

### For EVERY SCREEN, answer ALL questions below.
No code. No layout. No components.

### A. Screen Classification

Each screen MUST be classified as ONE:

- Decision Screen (choose / approve / confirm)
- Monitoring Screen (observe / track / review)
- Creation Screen (create / edit / input)
- Setup Screen (rare / admin / configuration)

---

### B. Primary Intent (Single Only)

Each screen MUST have **ONE and only ONE** primary user intent:

Examples:
- Create record
- Review status
- Approve request
- Fix issue

❌ Multiple primary intents are NOT allowed.

---

### C. Primary Action

Define the ONE action that completes the screen’s purpose.

Rules:
- Only one primary CTA allowed
- Must be visually dominant
- Must be reachable within 3 seconds

---

### D. Secondary Actions

List all secondary actions.

Rules:
- Secondary actions MUST NOT compete visually
- Must be grouped or visually reduced
- May be hidden behind menus or secondary sections

---

### E. Attention Anchor

Define where the user’s eye MUST land first:

Examples:
- Page title
- KPI card
- Primary CTA
- Status indicator

If this is unclear → UX is invalid.

---

### F. Exit Path (Post-Action Flow)

After the primary action succeeds:

- Where does the user go?
- What confirmation do they receive?
- What is the next recommended action?

A screen without an exit path is UX-broken.

---

## PHASE-UX-1 — VISUAL DOMINANCE RULE

Every screen MUST define a **visual hierarchy**.

### Dominance Levels (Mandatory)

1. Primary (dominant)
2. Secondary (supporting)
3. Tertiary (background)

Rules:
- Only ONE dominant element per screen
- Dominance achieved via size, spacing, or contrast
- Never via color abuse

If everything looks equal → FAIL.

---

## PHASE-UX-2 — INFORMATION DENSITY CONTROL

### Cognitive Load Rule

> A user must never see more than **7 actionable items** at once.

If exceeded:
- Collapse sections
- Hide advanced actions
- Use progressive disclosure

Rules:
- Rare actions MUST be visually demoted
- Admin actions MUST be separated
- Destructive actions MUST be isolated

---

## PHASE-UX-3 — SCREEN FREQUENCY CLASSIFICATION

Each screen MUST be tagged as:

- High-Frequency (daily / repeated)
- Medium-Frequency
- Low-Frequency (admin / setup)

### UI Rules by Frequency

**High-Frequency:**
- Minimal UI
- Fewer labels
- Faster paths

**Low-Frequency:**
- More guidance
- Helper text allowed
- Explicit labels

---

## PHASE-UX-4 — FLOW CONTINUITY RULE

Screens MUST NOT exist in isolation.

Rules:
- Every screen must suggest the next step
- Success must guide forward
- Empty states must educate
- Error states must recover

No dead-end screens allowed.

---

## PHASE-UX-5 — NO-FIGMA UX COMPENSATION MODE

If Figma is NOT available, this mode becomes mandatory.

### Required Outputs (Text-Only)

For each screen:

- Visual priority list (top → bottom)
- Section grouping definition
- Empty state description
- Error state description
- Success confirmation description

This replaces visual mockups with **intent-driven UX clarity**.

---

## UX VALIDATION CHECKLIST (MANDATORY)

A feature is UX-valid ONLY if ALL are true:

- [ ] Screen has ONE clear purpose
- [ ] Primary action is obvious
- [ ] Secondary actions are demoted
- [ ] User knows what to do next
- [ ] Screen does not overwhelm
- [ ] UX intent was locked before build

If ANY fail → feature must be revised.

---

## Enforcement Rules

1. R17 MUST run before R1–R16
2. No UI work without UX Intent Lock
3. UX intent CANNOT be changed mid-feature
4. Engineering rules cannot override UX intent
5. PRs MUST include UX intent summary

---

## Final Statement

> **Great UI is not built by components.
> It is built by intention, hierarchy, and restraint.**

R17 ensures your system produces UI that is:
- Clear
- Predictable
- Calm
- Human-friendly

---

## End of R17