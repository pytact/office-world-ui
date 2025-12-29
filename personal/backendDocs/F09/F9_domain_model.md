

# Project: officeWorld
# Feature: F-009 — Leave Management

## Purpose
Provide a deterministic, role-driven leave management workflow that supports
employee leave requests with strict approval chains, mandatory validations,
clear visibility rules, and auditable outcomes—without handling leave balances
or payroll calculations.

---

# Domain Model: F-009 — Leave Management

## 1. Domain Glossary
| Term | Definition | Examples |
|------|------------|----------|
| Leave Request | A request for time off submitted by an employee | Annual leave |
| Leave Type | Category of leave | Casual, Sick |
| Leave Status | Workflow state of a leave request | PENDING_HR |
| Half-Day | Partial day leave | FIRST_HALF |
| Approver | Role responsible for approving leave | Manager |
| Rejection Reason | Mandatory explanation for rejection | Work dependency |
| Cancellation | Applicant-initiated withdrawal | Cancel before approval |

---

## 2. Entities and Relationships

### 2.1 Entity List
| Entity | Description |
|--------|-------------|
| LeaveRequest | Workflow-driven request for employee leave |

---

### 2.2 Entity Details

#### LeaveRequest
- **Description**:  
  Represents a request for leave submitted by an employee. The request follows
  a role-based approval workflow and ends in a terminal state.

- **Key Fields (business-level)**:

  | Field | Description | Notes |
  |------|-------------|-------|
  | Employee | Applicant employee | Required |
  | Company | Owning company | Required |
  | LeaveType | Type of leave | ENUM-controlled |
  | StartDate | Leave start date | Inclusive |
  | EndDate | Leave end date | Inclusive |
  | DayType | Full or half day | ENUM-controlled |
  | NumberOfDays | Calculated duration | Derived |
  | Reason | Reason for leave | Mandatory |
  | Status | Workflow status | ENUM-controlled |
  | ManagerApprover | Assigned manager | Exactly one |
  | ManagerApprovedBy | Manager approver | Nullable |
  | ManagerApprovedAt | Approval timestamp | Nullable |
  | HRApprovedBy | HR approver | Nullable |
  | HRApprovedAt | Approval timestamp | Nullable |
  | RejectionReason | Reason for rejection | Mandatory if rejected |
  | CreatedAt | Submission time | Immutable |

- **Status ENUM**:
```text
SUBMITTED
PENDING_MANAGER
PENDING_HR
APPROVED
REJECTED
CANCELLED
DayType ENUM:

text
Copy code
FULL_DAY
FIRST_HALF
SECOND_HALF
Relationships:

LeaveRequest belongs to exactly one Employee

LeaveRequest belongs to exactly one Company

LeaveRequest has exactly one Manager approver

HR and CEO act as final approvers depending on role

2.3 Relationship Overview (Text Diagram)
text
Copy code
Company 1..* LeaveRequest
Employee 1..* LeaveRequest
Manager 1..* LeaveRequest (as approver)
HR 1..* LeaveRequest (as approver)
CEO 1..* LeaveRequest (as approver)