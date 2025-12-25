### 1. Feature Summary

The Reports & Analytics feature provides a read-only, role-aware reporting layer that aggregates data from operational domains (attendance, leave, salary, tasks, projects, employees, and audits). It enables decision-making and oversight through filtered views and PDF exports while enforcing strict company scoping and RBAC.

---

### 2. Primary User Journeys

**Journey 1: View a Report**

* Step 1 → User opens Reports
* Step 2 → Selects a report type
* Step 3 → System validates role access
* Step 4 → Aggregated report view is displayed

**Journey 2: Apply Filters to a Report**

* Step 1 → User selects filters (date range, status, project, employee where permitted)
* Step 2 → System validates filter scope by role
* Step 3 → Report view refreshes with filtered data

**Journey 3: Export Report as PDF**

* Step 1 → User triggers export on current report view
* Step 2 → System generates PDF snapshot asynchronously
* Step 3 → User downloads generated PDF

---

### 3. Screens List

```
SCR_REPORTS_HOME
Route: /reports
Short Purpose: Entry point for selecting available reports based on role.
```

```
SCR_REPORT_VIEW
Route: /reports/:reportType
Short Purpose: Displays a selected report with filters and aggregated data.
```

---

### 4. Screen Definitions

#### SCR_REPORTS_HOME

**4.1 Purpose**
Provides users with a list of reports they are authorized to access.

**4.2 Key Actions**

* View available report types
* Select a report

**4.3 Major Sections (High-Level Structure)**

* Report type list
* Role-based empty states

**4.4 Navigation & Flow**

* Entry point for reporting
* Selecting a report navigates to SCR_REPORT_VIEW

---

#### SCR_REPORT_VIEW

**4.1 Purpose**
Displays aggregated, read-only data for a specific report type.

**4.2 Key Actions**

* View report data
* Apply allowed filters
* Export report as PDF

**4.3 Major Sections (High-Level Structure)**

* Report header (type, description)
* Filter bar
* Data visualization area (tables/charts)
* Export action area

**4.4 Navigation & Flow**

* Accessed from SCR_REPORTS_HOME
* Filter changes refresh data in-place
* Export generates a downloadable PDF snapshot

---

### 5. Report Types & Visibility (UX-Level)

* **ATTENDANCE** → Employee (self), Manager, HR, CEO
* **LEAVE** → Employee (self), HR, CEO
* **SALARY_SUMMARY** → HR, CEO (company totals only)
* **EMPLOYEE** → HR, CEO
* **TASK** → Employee (self), Manager, HR, CEO
* **PROJECT** → Manager, HR, CEO
* **AUDIT_SUMMARY** → HR, CEO

---

### 6. Export Flow (Conceptual)

* Export captures the current filtered report view
* PDF generation may be asynchronous
* Exported artifact is immutable and read-only
* Export respects role-based visibility and masking

---

### 7. Edge Cases or Alternate Paths

* No available reports → role-specific empty state
* Filters outside role scope are blocked
* Large datasets may show loading states
* Export failures show non-blocking error messaging
* Reports never allow navigation to edit underlying records
