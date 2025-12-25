### 1. Feature Summary

The Task Management & Assignment feature provides an execution-focused system for creating, owning, assigning, and completing work items within a company. Tasks enforce strict ownership, granular assignee permissions (viewer/editor), optional project linkage, and clear visibility boundaries, while supporting notifications for task-related events.

---

### 2. Primary User Journeys

**Journey 1: Create a Task (Standalone or Project-Linked)**

* Step 1 → User (CEO, Manager, or Employee) opens task list
* Step 2 → Initiates task creation
* Step 3 → Enters task details and optionally selects a project
* Step 4 → Submits → task is created with creator as immutable owner

**Journey 2: Assign Users to a Task**

* Step 1 → Task owner opens task detail
* Step 2 → Adds assignees and selects permission (Viewer / Editor)
* Step 3 → Confirms assignment → notifications sent

**Journey 3: Assignee Works on a Task**

* Step 1 → Assignee opens assigned task
* Step 2 → Views or edits task based on permission
* Step 3 → Changes are saved (editors only)

**Journey 4: Task Owner Manages Task Status**

* Step 1 → Owner opens task detail
* Step 2 → Changes task status (e.g., TODO → IN_PROGRESS → DONE)
* Step 3 → Status update is applied and notifications sent

**Journey 5: Delete a Task**

* Step 1 → Task owner initiates delete
* Step 2 → Confirms hard deletion
* Step 3 → Task is permanently removed

---

### 3. Screens List

```
SCR_TASK_LIST
Route: /company/tasks
Short Purpose: Displays tasks visible to the user based on ownership and assignment.
```

```
SCR_TASK_CREATE
Route: /company/tasks/create
Short Purpose: Allows authorized users to create a new task.
```

```
SCR_TASK_DETAIL
Route: /company/tasks/:taskId
Short Purpose: Displays task details, assignments, and actions based on permissions.
```

---

### 4. Screen Definitions

#### SCR_TASK_LIST

**4.1 Purpose**
Provides a personalized list of tasks the user owns or is assigned to, with optional project context.

**4.2 Key Actions**

* View task list
* Filter by status or project (where applicable)
* Navigate to task detail
* Create new task

**4.3 Major Sections (High-Level Structure)**

* Task list table
* Filter and search controls
* Primary action area (create task)

**4.4 Navigation & Flow**

* Entry point for task management
* Selecting a task opens SCR_TASK_DETAIL
* Create action navigates to SCR_TASK_CREATE

---

#### SCR_TASK_CREATE

**4.1 Purpose**
Allows users to create a new task with optional project association.

**4.2 Key Actions**

* Enter task name and description
* Optionally select project
* Submit task creation

**4.3 Major Sections (High-Level Structure)**

* Task creation form
* Optional project selector
* Validation messaging

**4.4 Navigation & Flow**

* Accessed from SCR_TASK_LIST
* Successful creation redirects to SCR_TASK_DETAIL

---

#### SCR_TASK_DETAIL

**4.1 Purpose**
Displays full task information and enables task-specific actions based on ownership and assignment permissions.

**4.2 Key Actions**

* View task details
* Edit task (owner and editors)
* Change task status (owner only)
* Manage assignees and permissions (owner only)
* Delete task (owner only)

**4.3 Major Sections (High-Level Structure)**

* Task summary section
* Status and lifecycle controls
* Assignment and permission section
* Task content area

**4.4 Navigation & Flow**

* Accessed from SCR_TASK_LIST
* Actions update task state and remain on detail screen
* Back navigation returns to task list

---

### 5. Modal(s) / Dialog Flow

**MOD_TASK_ASSIGNMENT**

* Trigger: Add or update task assignees
* Purpose: Assign users with viewer or editor permissions
* Outcome:

  * TaskAssignment records updated
  * Notifications sent

**MOD_TASK_STATUS_CHANGE**

* Trigger: Change task status
* Purpose: Confirm lifecycle transition
* Outcome:

  * Task status updated

**MOD_TASK_DELETE_CONFIRMATION**

* Trigger: Delete task
* Purpose: Confirm irreversible task deletion
* Outcome:

  * Task permanently removed

---

### 6. Edge Cases or Alternate Paths

* Editors cannot change task status or assignments
* Viewers have read-only access
* HR has read-only access to all tasks
* Employees see only tasks they own or are assigned to
* Tasks in terminal states (DONE, CANCELLED) are read-only
* Tasks linked to INACTIVE or COMPLETED projects respect project-level task restrictions
* Deleted tasks cannot be recovered
