### 1. Feature Summary

The Employee Management feature provides a secure, company-bound system of record for managing personnel data. It enforces a strict one-to-one relationship between users and employees, applies role-based and field-level visibility controls, and preserves historical data while supporting downstream HR workflows such as salary, leave, and attendance.

---

### 2. Primary User Journeys

**Journey 1: CEO / HR Creates an Employee Record**

* Step 1 → CEO or HR opens employee management
* Step 2 → Initiates employee creation
* Step 3 → Selects an existing user
* Step 4 → Enters required employee details
* Step 5 → Submits → employee record is created and activated

**Journey 2: CEO / HR Updates Employee Information**

* Step 1 → CEO or HR opens employee detail
* Step 2 → Edits allowed fields
* Step 3 → Saves changes

**Journey 3: Deactivate or Reactivate an Employee**

* Step 1 → CEO or HR opens employee detail
* Step 2 → Deactivates employee → login blocked
* Step 3 → Optionally reactivates employee later

**Journey 4: Soft Delete Employee**

* Step 1 → CEO opens employee detail
* Step 2 → Initiates soft delete
* Step 3 → Confirms action → employee hidden from standard lists

**Journey 5: Manager Views Employee List (Limited)**

* Step 1 → Manager opens employee list
* Step 2 → Views limited professional information only

**Journey 6: Employee Views Own Profile**

* Step 1 → Employee opens own profile
* Step 2 → Views personal and professional information (read-only)

---

### 3. Screens List

```
SCR_EMPLOYEE_LIST
Route: /company/employees
Short Purpose: Displays company employees with role-based visibility rules.
```

```
SCR_EMPLOYEE_CREATE
Route: /company/employees/create
Short Purpose: Enables CEO and HR to create a new employee record.
```

```
SCR_EMPLOYEE_DETAIL
Route: /company/employees/:employeeId
Short Purpose: Displays employee details and lifecycle management actions.
```

```
SCR_EMPLOYEE_SELF_PROFILE
Route: /me/profile
Short Purpose: Allows employees to view their own employee profile.
```

---

### 4. Screen Definitions

#### SCR_EMPLOYEE_LIST

**4.1 Purpose**
Provides a company-scoped overview of employees with visibility filtered by role.

**4.2 Key Actions**

* View employee list
* Filter by department, status (where permitted)
* Navigate to employee detail
* Initiate employee creation (CEO / HR only)

**4.3 Major Sections (High-Level Structure)**

* Employee list table
* Filter controls
* Primary action area (create employee)

**4.4 Navigation & Flow**

* Entry point for employee management
* Selecting a row opens SCR_EMPLOYEE_DETAIL
* Create action navigates to SCR_EMPLOYEE_CREATE

---

#### SCR_EMPLOYEE_CREATE

**4.1 Purpose**
Allows CEO and HR to create a new employee record linked to an existing user.

**4.2 Key Actions**

* Select user
* Enter employee details
* Submit creation

**4.3 Major Sections (High-Level Structure)**

* Employee creation form
* Validation and error messaging

**4.4 Navigation & Flow**

* Accessed from SCR_EMPLOYEE_LIST
* Successful creation redirects to SCR_EMPLOYEE_DETAIL

---

#### SCR_EMPLOYEE_DETAIL

**4.1 Purpose**
Displays full employee information and enables lifecycle actions based on role.

**4.2 Key Actions**

* View employee information
* Edit allowed fields (CEO / HR)
* Deactivate or reactivate employee
* Soft delete employee (CEO only)

**4.3 Major Sections (High-Level Structure)**

* Employee summary section
* Personal and professional details sections
* Lifecycle and administrative actions

**4.4 Navigation & Flow**

* Accessed from SCR_EMPLOYEE_LIST
* Lifecycle actions update state and remain on detail screen
* Back navigation returns to employee list

---

#### SCR_EMPLOYEE_SELF_PROFILE

**4.1 Purpose**
Allows an employee to view their own profile information in a read-only manner.

**4.2 Key Actions**

* View personal and professional details

**4.3 Major Sections (High-Level Structure)**

* Profile summary
* Personal information section
* Professional information section

**4.4 Navigation & Flow**

* Accessible only to Employee role
* No navigation to other employee records

---

### 5. Modal(s) / Dialog Flow

**MOD_EMPLOYEE_DEACTIVATE_CONFIRMATION**

* Trigger: Deactivate employee action
* Purpose: Confirm access-impacting lifecycle change
* Outcome: Employee deactivated or action cancelled

**MOD_EMPLOYEE_DELETE_CONFIRMATION**

* Trigger: Soft delete employee action
* Purpose: Confirm logical removal while preserving data
* Outcome: Employee soft-deleted or action cancelled

---

### 6. Edge Cases or Alternate Paths

* Managers cannot view CEO or HR employees
* Managers cannot see sensitive or personal fields
* Employees cannot access employee list or other profiles
* Soft-deleted employees hidden from standard lists
* Soft-deleted employees visible only to CEO
* Deactivated employees are blocked from login
* SuperAdmin has no access to any employee screens
