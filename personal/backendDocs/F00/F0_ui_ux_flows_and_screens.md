### 1. Feature Summary

The Core Platform Foundation feature establishes the essential system layer required for all other features in officeWorld. It provides secure authentication, invitation-based onboarding, predefined roles and permissions, and multi-tenant isolation. This feature enables SuperAdmin and invited users to access the platform reliably while enforcing foundational security and governance rules.

---

### 2. Primary User Journeys

**Journey 1: SuperAdmin Login**

* Step 1 → SuperAdmin opens the platform login screen
* Step 2 → Enters email and password
* Step 3 → Submits credentials
* Step 4 → On successful authentication, lands on platform-level dashboard

**Journey 2: Invited User Account Activation**

* Step 1 → User receives invitation email with activation link
* Step 2 → Clicks activation link within validity period
* Step 3 → Opens account activation screen
* Step 4 → Sets name and password
* Step 5 → Submits activation form
* Step 6 → Redirected to login screen

**Journey 3: Standard User Login & Logout**

* Step 1 → User opens login screen
* Step 2 → Enters email and password
* Step 3 → Authenticated into company context
* Step 4 → User initiates logout action
* Step 5 → Session ends and user is returned to login screen

---

### 3. Screens List

```
SCR_AUTH_LOGIN  
Route: /login  
Short Purpose: Allows users and SuperAdmin to authenticate using email and password.
```

```
SCR_AUTH_ACTIVATION  
Route: /activate/:token  
Short Purpose: Enables invited users to activate their account by setting initial credentials.
```

```
SCR_AUTH_PASSWORD_RESET_REQUEST  
Route: /password-reset  
Short Purpose: Allows users to request a password reset email.
```

```
SCR_AUTH_PASSWORD_RESET  
Route: /password-reset/:token  
Short Purpose: Allows users to set a new password using a valid reset token.
```

---

### 4. Screen Definitions

#### SCR_AUTH_LOGIN

**4.1 Purpose**
Provides a single entry point for all users, including SuperAdmin, to authenticate into the platform.

**4.2 Key Actions**

* Enter email and password
* Submit login credentials
* Navigate to password reset request

**4.3 Major Sections (High-Level Structure)**

* Authentication form area
* Validation and error messaging area
* Supporting navigation links (e.g., forgot password)

**4.4 Navigation & Flow**

* Entry point for unauthenticated users
* Successful login redirects to appropriate dashboard based on role
* Password reset link navigates to SCR_AUTH_PASSWORD_RESET_REQUEST

---

#### SCR_AUTH_ACTIVATION

**4.1 Purpose**
Allows invited users to complete onboarding by setting their name and password using a valid invitation token.

**4.2 Key Actions**

* View invitation context
* Enter name and password
* Submit activation

**4.3 Major Sections (High-Level Structure)**

* Activation form area
* Invitation status messaging

**4.4 Navigation & Flow**

* Accessed via invitation email link
* Successful activation redirects to SCR_AUTH_LOGIN
* Expired or invalid token leads to error state

---

#### SCR_AUTH_PASSWORD_RESET_REQUEST

**4.1 Purpose**
Enables users to initiate a password reset flow by requesting a reset email.

**4.2 Key Actions**

* Enter registered email address
* Submit reset request

**4.3 Major Sections (High-Level Structure)**

* Email input form
* Submission feedback messaging

**4.4 Navigation & Flow**

* Accessed from SCR_AUTH_LOGIN
* Successful submission informs user to check email

---

#### SCR_AUTH_PASSWORD_RESET

**4.1 Purpose**
Allows users to set a new password using a valid reset token.

**4.2 Key Actions**

* Enter new password
* Confirm password
* Submit password change

**4.3 Major Sections (High-Level Structure)**

* Password reset form
* Token validity and error messaging

**4.4 Navigation & Flow**

* Accessed via password reset email link
* Successful reset redirects to SCR_AUTH_LOGIN

---

### 5. Modal(s) / Dialog Flow

Not applicable for this feature. All interactions are handled via full screens.

---

### 6. Edge Cases or Alternate Paths

* Invalid login credentials result in inline authentication error messaging
* Inactive or deactivated users are blocked from login
* Expired invitation tokens prevent activation and require manual resend
* Expired or invalid password reset tokens block password change and show error state
* SuperAdmin access bypasses company context selection
