### 1. Feature Summary

The Attendance Management feature provides a reliable, server-time–driven system to track daily employee presence using immutable check-in and check-out events. It ensures accurate worked-time calculation across refreshes and sessions, enforces strict visibility rules, and avoids approvals or payroll coupling.

---

### 2. Primary User Journeys

**Journey 1: Employee Checks In**

* Step 1 → Employee opens attendance entry point
* Step 2 → Initiates check-in
* Step 3 → System records server-time check-in and starts live counter

**Journey 2: Employee Checks Out**

* Step 1 → Employee opens attendance entry point
* Step 2 → Initiates check-out
* Step 3 → System records server-time check-out and finalizes worked time

**Journey 3: Employee Views Today’s Attendance**

* Step 1 → Employee opens attendance screen
* Step 2 → Views live counter (if checked in) or final worked time (if checked out)

**Journey 4: Manager / HR / CEO Reviews Attendance**

* Step 1 → Manager, HR, or CEO opens attendance overview
* Step 2 → Views attendance records by employee and date

---

### 3. Screens List

```
SCR_ATTENDANCE_TODAY
Route: /attendance/today
Short Purpose: Allows employees to check in/out and view today’s worked time.
```

```
SCR_ATTENDANCE_LOGS
Route: /company/attendance
Short Purpose: Displays attendance records for authorized roles.
```

```
SCR_ATTENDANCE_DETAIL
Route: /company/attendance/:employeeId/:date
Short Purpose: Displays a single day’s attendance details and logs for an employee.
```

---

### 4. Screen Definitions

#### SCR_ATTENDANCE_TODAY

**4.1 Purpose**
Provides employees with a single daily control point for attendance actions and real-time visibility into worked time.

**4.2 Key Actions**

* Check in (once per day)
* Check out (once per day)
* View live working-time counter

**4.3 Major Sections (High-Level Structure)**

* Attendance status indicator
* Primary action controls (check-in / check-out)
* Live worked-time display

**4.4 Navigation & Flow**

* Accessible to employees only
* After check-in, live counter runs based on server time
* After check-out, attendance becomes read-only for the day

---

#### SCR_ATTENDANCE_LOGS

**4.1 Purpose**
Allows managers, HR, and CEO to review attendance records across employees.

**4.2 Key Actions**

* View attendance records
* Filter by employee or date
* Navigate to attendance detail

**4.3 Major Sections (High-Level Structure)**

* Attendance list table
* Filter controls

**4.4 Navigation & Flow**

* Entry point for attendance oversight
* Selecting a record opens SCR_ATTENDANCE_DETAIL

---

#### SCR_ATTENDANCE_DETAIL

**4.1 Purpose**
Displays a detailed view of a single employee’s attendance for a specific day.

**4.2 Key Actions**

* View check-in and check-out times
* View total worked time
* View immutable attendance logs

**4.3 Major Sections (High-Level Structure)**

* Attendance summary section
* Worked-time breakdown
* Attendance log list

**4.4 Navigation & Flow**

* Accessed from SCR_ATTENDANCE_LOGS
* Read-only for all roles

---

### 5. Real-Time Behavior (Conceptual)

* Live counter derives from server-stored check-in time
* Counter resumes correctly after refresh or re-login
* Counter stops permanently after check-out
* Day boundary resets at employee local midnight

---

### 6. Modal(s) / Dialog Flow

**MOD_ATTENDANCE_CHECKOUT_CONFIRMATION**

* Trigger: Check-out action
* Purpose: Confirm finalization of attendance for the day
* Outcome:

  * Attendance status transitions to CHECKED_OUT
  * Record becomes immutable

---

### 7. Edge Cases or Alternate Paths

* Attempting second check-in on the same day is blocked
* Attempting check-out without prior check-in is blocked
* Deactivated employees can view historical attendance but cannot check in
* Attendance records remain visible after employee deactivation
* SuperAdmin has no access to attendance screens
* Attendance cannot be edited or corrected through UI
