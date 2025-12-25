### 1. Feature Summary

The Audit Logging & Activity History feature provides a centralized, immutable, and company-scoped record of critical system and user actions across the platform. It enables governance, traceability, and compliance through read-only audit views with strict role-based visibility, without impacting business workflows.

---

### 2. Primary User Journeys

> **Note:** This feature is read-only and system-driven. Users consume audit information but do not create or modify audit records.

**Journey 1: CEO / HR Reviews Company Audit History**

* Step 1 → CEO or HR opens audit logs
* Step 2 → Filters logs by date, action, or entity
* Step 3 → Opens a log entry to review details

**Journey 2: Manager Reviews Task / Project Audit History**

* Step 1 → Manager opens audit logs
* Step 2 → Sees only task- and project-related entries
* Step 3 → Reviews activity details for oversight

---

### 3. Screens List

```
SCR_AUDIT_LOG_LIST
Route: /company/audit-logs
Short Purpose: Displays audit log entries based on role-scoped visibility rules.
```

```
SCR_AUDIT_LOG_DETAIL
Route: /company/audit-logs/:auditLogId
Short Purpose: Displays full details of a single audit log entry.
```

---

### 4. Screen Definitions

#### SCR_AUDIT_LOG_LIST

**4.1 Purpose**
Provides authorized users with a searchable, filterable view of audit activity relevant to their role and company.

**4.2 Key Actions**

* View audit log list
* Filter by date range
* Filter by action code or entity
* Navigate to audit log detail

**4.3 Major Sections (High-Level Structure)**

* Audit log list table
* Filter controls
* Empty-state messaging

**4.4 Navigation & Flow**

* Entry point for audit history review
* Selecting an entry opens SCR_AUDIT_LOG_DETAIL

---

#### SCR_AUDIT_LOG_DETAIL

**4.1 Purpose**
Displays a complete, read-only view of an individual audit log entry for inspection and traceability.

**4.2 Key Actions**

* View actor, action, and timestamp
* View affected entity reference
* View old and new values (masked where necessary)

**4.3 Major Sections (High-Level Structure)**

* Audit summary section
* Actor and context details
* Old values vs new values comparison
* Metadata section (IP, user agent, system notes)

**4.4 Navigation & Flow**

* Accessed from SCR_AUDIT_LOG_LIST
* Back navigation returns to audit log list

---

### 5. Cross-Feature Audit Touchpoints (Conceptual)

Audit logs are generated asynchronously for significant actions across all features, including:

* User and role changes (F-001)
* Company lifecycle actions (F-004)
* Employee lifecycle changes (F-005)
* Salary updates and payments (F-006)
* Project and task operations (F-007, F-008)
* Leave approvals and rejections (F-009)
* Attendance events and system auto-actions (F-010)

---

### 6. Visibility & Access Rules (UX-Level)

* CEO and HR can view all audit logs within their company
* Managers see only task- and project-related logs
* Employees have no access to audit logs
* SuperAdmin audit access is out of scope

---

### 7. Edge Cases or Alternate Paths

* Audit logs are never editable or deletable
* Failure to create an audit log does not block the originating action
* System-generated actions appear with a SYSTEM actor
* Sensitive field values may be masked at presentation time
* Audit logs are retained permanently and always read-only
