# Project: officeWorld
# Feature: F-010 — Attendance Management

## Purpose
Provide a reliable, server-time–driven attendance tracking system that records
employee presence per day using immutable check-in and check-out events, derives
worked time accurately, and enforces strict visibility and integrity rules—
without approvals, edits, or payroll impact.

---

# Domain Model: F-010 — Attendance Management

## 1. Domain Glossary
| Term | Definition | Examples |
|------|------------|----------|
| Attendance | Daily presence record for an employee | 2025-03-10 attendance |
| Check-In | First recorded work start for the day | 09:12 AM |
| Check-Out | Recorded work end for the day | 06:41 PM |
| Attendance Log | Immutable event log of actions | CHECK_IN event |
| Worked Time | Derived duration between check-in and check-out | 9h 29m |
| Server Time | Authoritative timestamp source | UTC time |

---

## 2. Entities and Relationships

### 2.1 Entity List
| Entity | Description |
|--------|-------------|
| Attendance | One-per-day attendance record for an employee |
| AttendanceLog | Append-only event log for attendance actions |

---

### 2.2 Entity Details

#### Attendance
- **Description**:  
  Represents a single employee’s attendance for one calendar day, driven entirely
  by server timestamps. Exactly one attendance record exists per employee per day.

- **Key Fields (business-level)**:

  | Field | Description | Notes |
  |------|-------------|-------|
  | Employee | Attending employee | Required |
  | Company | Owning company | Required |
  | AttendanceDate | Local calendar date | Derived from timezone |
  | CheckInTime | Server timestamp of check-in | UTC |
  | CheckOutTime | Server timestamp of check-out | UTC |
  | Status | Attendance lifecycle state | ENUM-controlled |
  | WorkedTime | Derived duration | Read-only |

- **Status ENUM**:
```text
NOT_STARTED
CHECKED_IN
CHECKED_OUT
Rules:

Exactly one Attendance per employee per day

Status transitions are linear and irreversible

Attendance is immutable after CHECKED_OUT

AttendanceLog
Description:
Immutable, append-only log that records every attendance action with contextual
metadata for audit and traceability.

Key Fields (business-level):

Field	Description	Notes
Attendance	Related attendance record	Required
Employee	Acting employee	Required
ActionType	Attendance action	ENUM-controlled
ActionTime	Server timestamp	UTC
Location	Optional location info	Free text
IPAddress	Client IP	Optional
DeviceInfo	Client device details	Optional
Notes	System notes	Optional

ActionType ENUM:

text
Copy code
CHECK_IN
CHECK_OUT
2.3 Relationship Overview (Text Diagram)
text
Copy code
Company 1..* Attendance
Employee 1..* Attendance
Attendance 1..* AttendanceLog
