### 1. Feature Summary

The RBAC & Permission Engine feature establishes a centralized authorization layer that deterministically enforces role-based permissions across all platform features. It ensures that backend APIs and frontend UI behavior consistently reflect predefined, company-scoped permissions with inheritance resolved at design time and enforced at runtime.

---

### 2. Primary User Journeys

> **Note:** This feature is primarily system-driven and has minimal standalone user journeys. Its impact is expressed through enforcement, visibility, and blocked actions across other features.

**Journey 1: Authorized User Performs Allowed Action**

* Step 1 → User accesses a feature screen
* Step 2 → System evaluates permissions for requested action
* Step 3 → Action is allowed and proceeds normally

**Journey 2: Unauthorized User Attempts Restricted Action**

* Step 1 → User attempts an action (e.g., edit, delete, approve)
* Step 2 → Permission check fails
* Step 3 → Action is blocked and user receives access-denied feedback

**Journey 3: Permission Change Takes Effect**

* Step 1 → User role or status is changed (via F-001)
* Step 2 → Permission cache is invalidated
* Step 3 → Subsequent requests reflect updated permissions

---

### 3. Screens List

This feature introduces **no standalone screens**.

Permission enforcement is applied across:

* All existing and future feature screens
* All backend API-driven actions

---

### 4. Enforcement Touchpoints (UX-Relevant)

#### 4.1 Action-Level Enforcement

**Purpose**
Ensure users can only execute actions explicitly permitted by their role.

**Examples**

* Create, edit, or delete actions hidden or disabled when not permitted
* Approval actions blocked for unauthorized roles

---

#### 4.2 Screen-Level Visibility

**Purpose**
Ensure entire screens or sections are inaccessible when permissions are missing.

**Examples**

* Employee user cannot access user management screens
* Manager cannot access salary-related screens

---

#### 4.3 Data-Level Restrictions

**Purpose**
Prevent exposure of sensitive data even when screen access is allowed.

**Examples**

* Manager can see user lists but not personal or salary fields
* Employee sees only self-related data

---

### 5. Permission Evaluation Flow (Conceptual)

* User initiates request (UI or API)
* System resolves company context
* PermissionSet is retrieved from cache or recomputed
* Requested resource-action is evaluated
* Allow → proceed
* Deny → return access-denied state

---

### 6. Error & Blocked States

* Action hidden entirely when permission is absent
* Disabled action with explanatory messaging (optional)
* Access-denied screen or message for direct URL access

---

### 7. Edge Cases & Alternate Paths

* SuperAdmin permissions evaluated through global role, not company scope
* Deactivated users fail all permission checks
* Company deactivation blocks all company-scoped permissions
* Permission changes take effect immediately after cache invalidation
* UI must not rely solely on cached frontend permission state

---

### 8. Cross-Feature Integration Notes

* User & Role changes (F-001) must trigger permission cache invalidation
* All feature UX flows must assume permission checks at every action boundary
* Frontend permission checks are advisory; backend remains authoritative
