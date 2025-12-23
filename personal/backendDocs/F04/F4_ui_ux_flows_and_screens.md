### 1. Feature Summary

The Platform Company Management feature enables SuperAdmin to centrally provision, govern, and control the lifecycle of tenant companies. It also allows CEO and HR to update limited, non-governance company profile information without impacting access control, data isolation, or tenant integrity.

---

### 2. Primary User Journeys

**Journey 1: SuperAdmin Creates a Company**

* Step 1 → SuperAdmin opens platform company management
* Step 2 → Initiates company creation
* Step 3 → Enters required company identifiers
* Step 4 → Submits creation → company is created in inactive or active state (per system default)

**Journey 2: SuperAdmin Activates or Deactivates a Company**

* Step 1 → SuperAdmin opens company detail
* Step 2 → Triggers activate or deactivate action
* Step 3 → Confirms action
* Step 4 → Company status updates and access is immediately enforced

**Journey 3: SuperAdmin Deletes a Company**

* Step 1 → SuperAdmin opens company detail
* Step 2 → Initiates hard delete action
* Step 3 → Confirms irreversible deletion
* Step 4 → Company and all associated data are removed

**Journey 4: CEO / HR Updates Company Profile**

* Step 1 → CEO or HR opens company profile
* Step 2 → Edits allowed profile fields
* Step 3 → Saves changes

---

### 3. Screens List

```
SCR_COMPANY_LIST_PLATFORM
Route: /platform/companies
Short Purpose: Allows SuperAdmin to view, search, and manage all tenant companies.
```

```
SCR_COMPANY_CREATE
Route: /platform/companies/create
Short Purpose: Enables SuperAdmin to create a new tenant company.
```

```
SCR_COMPANY_DETAIL_PLATFORM
Route: /platform/companies/:companyId
Short Purpose: Displays company details and lifecycle controls for SuperAdmin.
```

```
SCR_COMPANY_PROFILE
Route: /company/profile
Short Purpose: Allows CEO and HR to view and edit limited company profile information.
```

---

### 4. Screen Definitions

#### SCR_COMPANY_LIST_PLATFORM

**4.1 Purpose**
Provides SuperAdmin with a centralized overview of all companies for governance and oversight.

**4.2 Key Actions**

* View list of companies
* Search and filter by name and status
* Navigate to company detail
* Initiate company creation

**4.3 Major Sections (High-Level Structure)**

* Company list table
* Search and filter controls
* Primary action area (create company)

**4.4 Navigation & Flow**

* Entry point for platform-level company management
* Selecting a company opens SCR_COMPANY_DETAIL_PLATFORM
* Create action navigates to SCR_COMPANY_CREATE

---

#### SCR_COMPANY_CREATE

**4.1 Purpose**
Allows SuperAdmin to create a new tenant company with required identifiers.

**4.2 Key Actions**

* Enter company name
* Enter company slug
* Submit creation

**4.3 Major Sections (High-Level Structure)**

* Company creation form
* Validation and error messaging

**4.4 Navigation & Flow**

* Accessed from SCR_COMPANY_LIST_PLATFORM
* Successful creation redirects to SCR_COMPANY_DETAIL_PLATFORM

---

#### SCR_COMPANY_DETAIL_PLATFORM

**4.1 Purpose**
Provides SuperAdmin with full visibility into a company’s profile, status, and lifecycle controls.

**4.2 Key Actions**

* View company metadata and status
* Activate or deactivate company
* Hard delete company

**4.3 Major Sections (High-Level Structure)**

* Company summary section
* Lifecycle status section
* Governance action controls

**4.4 Navigation & Flow**

* Accessed from SCR_COMPANY_LIST_PLATFORM
* Lifecycle actions update status and remain on detail screen
* Back navigation returns to company list

---

#### SCR_COMPANY_PROFILE

**4.1 Purpose**
Allows CEO and HR to manage limited, non-governance company profile information.

**4.2 Key Actions**

* View company profile
* Edit allowed profile fields
* Save profile changes

**4.3 Major Sections (High-Level Structure)**

* Company profile form
* Read-only governance fields

**4.4 Navigation & Flow**

* Accessible to CEO and HR within company context
* Successful save remains on profile screen

---

### 5. Modal(s) / Dialog Flow

**MOD_COMPANY_STATUS_CONFIRMATION**

* Trigger: Activate or deactivate company action
* Purpose: Confirm lifecycle change that impacts user access
* Steps:

  * Display impact warning
  * Confirm or cancel action
* Outcome:

  * Company status updated or unchanged

**MOD_COMPANY_DELETE_CONFIRMATION**

* Trigger: Hard delete company action
* Purpose: Confirm irreversible company deletion
* Steps:

  * Display irreversible action warning
  * Require explicit confirmation
* Outcome:

  * Company deleted permanently or action cancelled

---

### 6. Edge Cases or Alternate Paths

* Deactivated companies are visible but marked inactive
* All users of a deactivated company are blocked from login
* CEO and HR cannot edit immutable fields (name, slug)
* Non-SuperAdmin users cannot access platform company screens
* Attempting to access company profile for inactive company shows read-only or blocked state
* Hard deletion cannot be undone
