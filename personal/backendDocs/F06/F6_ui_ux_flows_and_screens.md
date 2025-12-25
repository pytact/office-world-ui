### 1. Feature Summary

The Salary & History Management feature provides a secure, auditable system for managing employee compensation. It enables CEO and HR to configure time-based salaries, maintain immutable salary history, manage bank information, execute monthly salary payments, and ensure salary slips are generated and delivered without exposing salary data through employee-facing UI.

---

### 2. Primary User Journeys

**Journey 1: Configure Initial Salary for an Employee**

* Step 1 → CEO or HR opens employee salary management
* Step 2 → Adds a new salary configuration with effective start date
* Step 3 → Submits configuration
* Step 4 → Salary becomes the active salary record

**Journey 2: Update Salary (Increment / Change)**

* Step 1 → CEO or HR initiates salary update
* Step 2 → Enters new salary amount and effective date
* Step 3 → Confirms update
* Step 4 → Previous salary period is auto-closed and history is recorded

**Journey 3: Manage Employee Bank Information**

* Step 1 → CEO or HR opens bank information section
* Step 2 → Updates bank account details
* Step 3 → Saves changes → applied to future payments only

**Journey 4: Execute Monthly Salary Payment**

* Step 1 → CEO or HR selects salary payment action for a given month
* Step 2 → System uses active salary configuration
* Step 3 → Confirms payment execution
* Step 4 → Salary payment record is created and salary slip is generated
* Step 5 → Salary slip is emailed to employee

**Journey 5: Employee Receives Salary Slip**

* Step 1 → System emails salary slip to employee
* Step 2 → Employee downloads salary slip from email

---

### 3. Screens List

```
SCR_EMPLOYEE_SALARY_OVERVIEW
Route: /company/employees/:employeeId/salary
Short Purpose: Allows CEO and HR to view and manage salary, bank info, and payment history for an employee.
```

```
SCR_SALARY_PAYMENT_CREATE
Route: /company/employees/:employeeId/salary/payments/create
Short Purpose: Enables CEO and HR to record a salary payment for a specific month.
```

---

### 4. Screen Definitions

#### SCR_EMPLOYEE_SALARY_OVERVIEW

**4.1 Purpose**
Provides a centralized view of an employee’s salary configuration, history, bank information, and past salary payments.

**4.2 Key Actions**

* View active salary configuration
* View salary history
* Add or update salary configuration
* View and update bank information
* View salary payment history
* Initiate salary payment

**4.3 Major Sections (High-Level Structure)**

* Active salary summary
* Salary history list
* Bank information section
* Salary payment history table

**4.4 Navigation & Flow**

* Accessed from employee detail screen (F-005)
* Initiating payment navigates to SCR_SALARY_PAYMENT_CREATE
* Salary updates refresh overview state

---

#### SCR_SALARY_PAYMENT_CREATE

**4.1 Purpose**
Allows CEO and HR to record a completed salary payment for an employee.

**4.2 Key Actions**

* Select month and year
* Review payable amount
* Confirm salary payment

**4.3 Major Sections (High-Level Structure)**

* Payment period selector
* Salary summary snapshot
* Confirmation action area

**4.4 Navigation & Flow**

* Accessed from SCR_EMPLOYEE_SALARY_OVERVIEW
* Successful submission redirects back to salary overview

---

### 5. Modal(s) / Dialog Flow

**MOD_SALARY_UPDATE_CONFIRMATION**

* Trigger: Add or update salary configuration
* Purpose: Confirm salary change and effective date
* Outcome:

  * New salary configuration created
  * Previous configuration auto-closed

**MOD_SALARY_PAYMENT_CONFIRMATION**

* Trigger: Execute salary payment
* Purpose: Confirm immutable payment creation
* Outcome:

  * SalaryPayment record created
  * Salary slip generated and emailed

---

### 6. Edge Cases or Alternate Paths

* Employees have no UI access to salary or bank screens
* Managers have no visibility into salary data
* Salary configuration cannot overlap existing effective periods
* Duplicate salary payments for the same month/year are blocked
* Bank info changes do not affect past salary payments
* Deactivated employees can still have salary history viewed
* Salary and bank records cannot be deleted or edited retroactively
