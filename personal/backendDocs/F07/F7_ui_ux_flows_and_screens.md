### 1. Feature Summary

The Project Management feature provides lightweight, company-scoped project containers used to organize tasks into initiatives. Projects do not introduce membership or permission models of their own; visibility and access are fully derived from task assignments and enforced through project lifecycle status.

---

### 2. Primary User Journeys

**Journey 1: CEO / Manager Creates a Project**

* Step 1 → CEO or Manager opens project list
* Step 2 → Initiates project creation
* Step 3 → Enters project name and initial status
* Step 4 → Submits → project is created

**Journey 2: CEO / Manager Updates Project Status**

* Step 1 → CEO or Manager opens project detail
* Step 2 → Changes project status (ACTIVE / INACTIVE / COMPLETED)
* Step 3 → Confirms update
* Step 4 → Task edit behavior updates based on status

**Journey 3: Manager Organizes Tasks Into Projects**

* Step 1 → Manager views task list
* Step 2 → Assigns tasks to a project or moves between projects
* Step 3 → Project task list reflects updates

**Journey 4: Employee Views Relevant Projects**

* Step 1 → Employee opens project list
* Step 2 → Sees only projects containing assigned tasks
* Step 3 → Opens project to view tasks

**Journey 5: HR Views Projects (Read-Only)**

* Step 1 → HR opens project list
* Step 2 → Views project details without edit access

---

### 3. Screens List

```
SCR_PROJECT_LIST
Route: /company/projects
Short Purpose: Displays company projects with role-based visibility.
```

```
SCR_PROJECT_CREATE
Route: /company/projects/create
Short Purpose: Allows CEO and Manager to create a new project.
```

```
SCR_PROJECT_DETAIL
Route: /company/projects/:projectId
Short Purpose: Displays project details and associated tasks.
```

---

### 4. Screen Definitions

#### SCR_PROJECT_LIST

**4.1 Purpose**
Provides a company-scoped overview of projects, filtered by task-derived visibility.

**4.2 Key Actions**

* View project list
* Navigate to project detail
* Create new project (CEO / Manager only)

**4.3 Major Sections (High-Level Structure)**

* Project list table
* Status indicators
* Primary action area (create project)

**4.4 Navigation & Flow**

* Entry point for project management
* Selecting a project opens SCR_PROJECT_DETAIL
* Create action navigates to SCR_PROJECT_CREATE

---

#### SCR_PROJECT_CREATE

**4.1 Purpose**
Allows authorized roles to create a new project container.

**4.2 Key Actions**

* Enter project name
* Select initial status
* Submit creation

**4.3 Major Sections (High-Level Structure)**

* Project creation form
* Validation messaging

**4.4 Navigation & Flow**

* Accessed from SCR_PROJECT_LIST
* Successful creation redirects to SCR_PROJECT_DETAIL

---

#### SCR_PROJECT_DETAIL

**4.1 Purpose**
Displays project information and its associated tasks, respecting lifecycle constraints.

**4.2 Key Actions**

* View project metadata
* Update project status (CEO / Manager only)
* View associated tasks

**4.3 Major Sections (High-Level Structure)**

* Project summary section
* Status control section
* Task list area

**4.4 Navigation & Flow**

* Accessed from SCR_PROJECT_LIST
* Task interactions depend on project status
* Back navigation returns to project list

---

### 5. Modal(s) / Dialog Flow

**MOD_PROJECT_STATUS_CONFIRMATION**

* Trigger: Change project status
* Purpose: Confirm lifecycle change impacting task mutability
* Outcome:

  * Project status updated
  * Task editability enforced

---

### 6. Edge Cases or Alternate Paths

* Projects with no tasks are visible to CEO and Manager only
* Employees see projects only after tasks are assigned
* INACTIVE or COMPLETED projects block task modifications
* Deleted projects cascade-delete associated tasks
* HR and Employees cannot create or modify projects
* Tasks can exist without any project association
