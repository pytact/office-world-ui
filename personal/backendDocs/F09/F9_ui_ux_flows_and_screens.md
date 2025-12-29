### 1. Feature Summary

The Leave Management Workflow feature provides a deterministic, role-driven process for employees to request time off and for organizations to approve or reject those requests through a structured approval chain. It enforces strict validation rules, mandatory rejection reasons, and role-based visibility while integrating notifications for key workflow events.

---

### 2. Primary User Journeys

**Journey 1: Employee Applies for Leave**

* Step 1 → Employee opens leave management
* Step 2 → Initiates new leave request
* Step 3 → Selects leave type, date range, and day type
* Step 4 → Enters reason and submits request
* Step 5 → System validates request and routes to first approver

**Journey 2: Manager Reviews Employee Leave**

* Step 1 → Manager opens pending leave approvals
* Step 2 → Reviews leave details
* Step 3 → Approves or rejects request
* Step 4 → If approved, request moves to HR
* Step 5 → If rejected, workflow ends with reason

**Journey 3: HR Reviews Leave Request**

* Step 1 → HR opens pending leave approvals
* Step 2 → Reviews leave details
* Step 3 → Approves or rejects request
* Step 4 → Approved leave completes workflow

**Journey 4: CEO Reviews HR Leave**

* Step 1 → CEO opens pending HR leave approvals
* Step 2 → Reviews leave details
* Step 3 → Approves or rejects request

**Journey 5: Employee Cancels Pending Leave**

* Step 1 → Employee opens own leave request
* Step 2 → Cancels request while pending
* Step 3 → Leave moves to cancelled state

---

### 3. Screens List

```
SCR_LEAVE_LIST
Route: /company/leaves
Short Purpose: Displays leave requests based on role-specific visibility rules.
```

```
SCR_LEAVE_CREATE
Route: /company/leaves/create
Short Purpose: Allows employees to submit a new leave request.
```

```
SCR_LEAVE_DETAIL
Route: /company/leaves/:leaveId
Short Purpose: Displays leave request details and approval actions.
```

```
SCR_LEAVE_APPROVAL_QUEUE
Route: /company/leaves/approvals
Short Purpose: Displays leave requests awaiting the user’s approval.
```

---

### 4. Screen Definitions

#### SCR_LEAVE_LIST

**4.1 Purpose**
Provides a role-filtered view of leave requests relevant to the current user.

**4.2 Key Actions**

* View leave requests
* Filter by status or date
* Navigate to leave detail
* Create new leave request (Employee only)

**4.3 Major Sections (High-Level Structure)**

* Leave list table
* Filter controls
* Primary action area (apply for leave)

**4.4 Navigation & Flow**

* Entry point for leave management
* Selecting a leave opens SCR_LEAVE_DETAIL
* Create action navigates to SCR_LEAVE_CREATE

---

#### SCR_LEAVE_CREATE

**4.1 Purpose**
Allows employees to submit a new leave request with required validations.

**4.2 Key Actions**

* Select leave type
* Select date range and day type
* Enter reason
* Submit leave request

**4.3 Major Sections (High-Level Structure)**

* Leave request form
* Validation and error messaging

**4.4 Navigation & Flow**

* Accessed from SCR_LEAVE_LIST
* Successful submission redirects to SCR_LEAVE_DETAIL

---

#### SCR_LEAVE_DETAIL

**4.1 Purpose**
Displays full details of a leave request and supports role-specific actions.

**4.2 Key Actions**

* View leave details
* Approve or reject leave (approvers only)
* Cancel leave (applicant, pending only)

**4.3 Major Sections (High-Level Structure)**

* Leave summary section
* Approval status timeline
* Action controls

**4.4 Navigation & Flow**

* Accessed from leave list or approval queue
* Actions update leave state and remain on detail screen

---

#### SCR_LEAVE_APPROVAL_QUEUE

**4.1 Purpose**
Provides approvers with a focused view of leave requests awaiting their action.

**4.2 Key Actions**

* View pending approvals
* Navigate to leave detail

**4.3 Major Sections (High-Level Structure)**

* Pending approval list

**4.4 Navigation & Flow**

* Entry point for managers, HR, and CEO approvals
* Selecting a request opens SCR_LEAVE_DETAIL

---

### 5. Modal(s) / Dialog Flow

**MOD_LEAVE_REJECTION**

* Trigger: Reject leave action
* Purpose: Capture mandatory rejection reason
* Outcome:

  * Leave rejected with reason recorded

**MOD_LEAVE_CANCELLATION_CONFIRMATION**

* Trigger: Cancel leave request
* Purpose: Confirm applicant-initiated cancellation
* Outcome:

  * Leave status set to CANCELLED

---

### 6. Edge Cases or Alternate Paths

* Overlapping leave requests are blocked at submission
* Leave on weekends or holidays is blocked
* Leave requests cannot be edited after submission
* Rejected leaves are terminal and immutable
* Cancelled leaves do not trigger notifications
* Visibility of leave requests is strictly role-based
* Deactivated employees cannot submit leave requests
