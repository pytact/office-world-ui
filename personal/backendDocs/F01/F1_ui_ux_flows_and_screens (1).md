### 1. Feature Summary

The User & Role Management feature enables controlled, invitation-based onboarding and ongoing lifecycle management of users within strict company and role boundaries. It allows SuperAdmin and company-level admins (CEO, HR) to invite users, assign roles, manage activation status, and enforce role-based visibility rules across the platform.

---

### 2. Primary User Journeys

**Journey 1: SuperAdmin Invites User to a Company**

* Step 1 → SuperAdmin opens platform user management
* Step 2 → Selects target company
* Step 3 → Initiates user invitation
* Step 4 → Assigns role
* Step 5 → Sends invitation → user enters pending state

**Journey 2: CEO / HR Invites User to Own Company**

* Step 1 → CEO or HR opens company user list
* Step 2 → Clicks “Invite User”
* Step 3 → Enters user email and selects role
* Step 4 → Sends invitation

**Journey 3: Resend Invitation to Inactive User**

* Step 1 → Admin views pending / inactive users
* Step 2 → Selects user
* Step 3 → Triggers re-invitation
* Step 4 → New invitation token is issued

**Journey 4: Change User Role After Activation**

* Step 1 → Authorized admin opens user detail
* Step 2 → Initiates role change
* Step 3 → Selects new role
* Step 4 → Confirms change → role updated

**Journey 5: Deactivate / Reactivate User**

* Step 1 → Admin opens user detail
* Step 2 → Deactivates user → login blocked
* Step 3 → Optionally reactivates user later

---

### 3. Screens List

```
SCR_USER_LIST_PLATFORM
Route: /platform/users
Short Purpose: Allows SuperAdmin to view and manage all users across companies.
```

```
SCR_USER_LIST_COMPANY
Route: /company/users
Short Purpose: Allows CEO and HR to manage users within their own company.
```

```
SCR_USER_DETAIL
Route: /users/:userId
Short Purpose: Displays user details, role, status, and management actions.
```

```
SCR_USER_INVITE
Route: /users/invite
Short Purpose: Enables authorized admins to invite a new user and assign role.
```

---

### 4. Screen Definitions

#### SCR_USER_LIST_PLATFORM

**4.1 Purpose**
Provides SuperAdmin with full visibility into all users across all companies for centralized governance.

**4.2 Key Actions**

* View all users
* Filter by company, role, status
* Navigate to user detail
* Initiate user invitation

**4.3 Major Sections (High-Level Structure)**

* User list table
* Filter and search controls
* Primary action area (invite user)

**4.4 Navigation & Flow**

* Entry point for SuperAdmin user management
* Selecting a user opens SCR_USER_DETAIL
* Invite action navigates to SCR_USER_INVITE

---

#### SCR_USER_LIST_COMPANY

**4.1 Purpose**
Allows CEO and HR to manage users within their own company boundaries.

**4.2 Key Actions**

* View company users
* Filter by role or status
* Navigate to user detail
* Invite new users

**4.3 Major Sections (High-Level Structure)**

* Company-scoped user list
* Filter controls
* Invite user trigger

**4.4 Navigation & Flow**

* Entry point for company-level user management
* Selecting a user opens SCR_USER_DETAIL
* Invite action navigates to SCR_USER_INVITE

---

#### SCR_USER_DETAIL

**4.1 Purpose**
Displays user-specific information and enables lifecycle and role management actions.

**4.2 Key Actions**

* View user status and role
* Change user role (authorized roles only)
* Deactivate or reactivate user
* Resend invitation (if inactive)

**4.3 Major Sections (High-Level Structure)**

* User summary panel
* Role and status section
* Administrative action controls

**4.4 Navigation & Flow**

* Accessed from user list screens
* Actions update user state and remain on detail screen
* Back navigation returns to originating list

---

#### SCR_USER_INVITE

**4.1 Purpose**
Enables authorized admins to invite a new user with an assigned role and company context.

**4.2 Key Actions**

* Enter user email
* Select role
* Submit invitation

**4.3 Major Sections (High-Level Structure)**

* Invitation form
* Role selection area
* Submission feedback

**4.4 Navigation & Flow**

* Accessed from user list screens
* Successful submission redirects back to user list

---

### 5. Modal(s) / Dialog Flow

**MOD_USER_ROLE_CHANGE**

* Trigger: Change role action from SCR_USER_DETAIL
* Purpose: Confirm and apply a new role to an existing user
* Steps:

  * Select new role
  * Confirm change
* Outcome:

  * Role updated successfully
  * Cardinality rules enforced (e.g., single CEO)

---

### 6. Edge Cases or Alternate Paths

* Attempting to assign a second CEO role is blocked with error messaging
* Managers cannot access user lists containing sensitive data
* Employees have no access to user management screens
* Deactivated users are visible but marked inactive
* Re-invitation only available for inactive, non-activated users
* Company admins cannot access platform-wide user lists
