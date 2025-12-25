ui_data_contract.md
1. Feature Summary

The Attendance Management feature provides a server-time–driven, immutable system to track daily employee presence via check-in and check-out events. It ensures accurate worked-time calculation across refreshes and sessions, enforces strict role-based visibility, and avoids approvals, edits, or payroll coupling.

2. Screens Covered
- SCR_ATTENDANCE_TODAY
- SCR_ATTENDANCE_LOGS
- SCR_ATTENDANCE_DETAIL

3. Data Requirements Per Screen
3.1 Screen ID
SCR_ATTENDANCE_TODAY
Route: /attendance/today

3.2 Reads (Server Data Required)
Reads:
- Attendance:
    fields:
      - attendance_date
      - check_in_time
      - check_out_time
      - status
      - worked_time
- Context:
    fields:
      - server_time
      - employee_timezone


Returned only for the authenticated employee and only for today’s local date.

3.3 Writes (Actions / Mutations)
Writes:
- check_in_attendance
- check_out_attendance

3.4 Query Parameters
Query Parameters:
- none

3.5 Derived or Aggregated Fields
Derived Fields:
- live_worked_time        // server_time - check_in_time (while checked in)
- can_check_in  (boolean)
- can_check_out (boolean)


Derived from status and existence of check-in/check-out timestamps.

3.6 UI Data Constraints

Exactly one check-in and one check-out per day

Check-out is mandatory to finalize attendance

Attendance becomes immutable after CHECKED_OUT

Live counter must resume correctly after refresh or re-login

Deactivated employees may view history but cannot check in/out

3.1 Screen ID
SCR_ATTENDANCE_LOGS
Route: /company/attendance

3.2 Reads (Server Data Required)
Reads:
- Attendance:
    fields:
      - attendance_date
      - status
      - worked_time
- Employee:
    fields:
      - id
      - user.first_name
      - user.last_name


Visibility rules:

Manager: all employees’ attendance

HR / CEO: full company attendance

Employee: no access to this screen

3.3 Writes (Actions / Mutations)
Writes:
- none

3.4 Query Parameters
Query Parameters:
- employee_id        // HR / CEO only
- start_date
- end_date
- status
- page
- page_size
- sort_by
- sort_order

3.5 Derived or Aggregated Fields
Derived Fields:
- attendance_status_label

3.6 UI Data Constraints

Server-side pagination and filtering required

Data must be strictly company-scoped

Attendance records remain visible even after employee deactivation

SuperAdmin must never receive attendance data

3.1 Screen ID
SCR_ATTENDANCE_DETAIL
Route: /company/attendance/:employeeId/:date

3.2 Reads (Server Data Required)
Reads:
- Attendance:
    fields:
      - attendance_date
      - check_in_time
      - check_out_time
      - status
      - worked_time
- AttendanceLog:
    fields:
      - action_type
      - action_time
      - location
      - ip_address
      - device_info
      - notes
- Employee:
    fields:
      - user.first_name
      - user.last_name

3.3 Writes (Actions / Mutations)
Writes:
- none

3.4 Query Parameters
Query Parameters:
- employeeId (path parameter)
- date       (path parameter)

3.5 Derived or Aggregated Fields
Derived Fields:
- none

3.6 UI Data Constraints

Read-only for all roles

Immutable event log must be returned in chronological order

Only one Attendance record may exist per employee per day

Date resolution must respect employee local timezone

4. Proposed API Hints (Not Final API Spec)
Proposed API Hints:
- GET  /api/v1/attendance/today
- POST /api/v1/attendance/check-in
- POST /api/v1/attendance/check-out
- GET  /api/v1/company/attendance
- GET  /api/v1/company/attendance/{employeeId}/{date}

5. Cross-Screen Data Dependencies
SCR_ATTENDANCE_TODAY and SCR_ATTENDANCE_DETAIL both depend on:
- Attendance
- AttendanceLog (detail only)

F-005 (Employee Management) provides:
- Employee identity and timezone

F-002 (RBAC) enforces:
- Role-based visibility and access

6. Data Edge Cases

Second check-in attempt on the same day

Check-out attempt without prior check-in

Page refresh or logout during active check-in

Day boundary crossing at employee local midnight

Deactivated employee viewing historical attendance

Missing check-out (attendance remains CHECKED_IN)

Direct URL access to unauthorized attendance detail

Concurrent check-in/check-out requests