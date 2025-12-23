### 1. Feature Summary

The Notifications System provides a centralized, asynchronous mechanism to inform users about critical onboarding and workflow events through email-first delivery and limited in-app notifications. It ensures users stay informed without blocking core business processes, while maintaining strict company scoping and predictable behavior.

---

### 2. Primary User Journeys

> **Note:** This feature is largely system-driven. User interaction is limited to consuming notifications rather than configuring them.

**Journey 1: Invited User Receives Invitation Notification**

* Step 1 → System emits invitation event
* Step 2 → Invitation email is sent to user
* Step 3 → User opens email and proceeds to activation flow (F-000)

**Journey 2: Manager Receives Leave Request Notification**

* Step 1 → Employee submits leave request
* Step 2 → System generates notification
* Step 3 → Manager receives email notification

**Journey 3: User Receives Leave Decision Notification**

* Step 1 → Leave is approved or rejected
* Step 2 → System generates notification
* Step 3 → User receives email and in-app notification

**Journey 4: User Receives Task Update Notification**

* Step 1 → Task is assigned or permissions change
* Step 2 → System generates notification
* Step 3 → User receives email and in-app notification

---

### 3. Screens List

```
SCR_NOTIFICATION_INBOX
Route: /notifications
Short Purpose: Displays in-app notifications related to tasks and leave events.
```

---

### 4. Screen Definitions

#### SCR_NOTIFICATION_INBOX

**4.1 Purpose**
Provides users with a lightweight, read-only view of recent in-app notifications for awareness of task and leave activity.

**4.2 Key Actions**

* View list of notifications
* Mark notification as read
* Navigate to related record (task or leave)

**4.3 Major Sections (High-Level Structure)**

* Notification list area
* Read / unread state indicators
* Empty-state messaging

**4.4 Navigation & Flow**

* Accessible from global navigation (if permitted)
* Selecting a notification navigates to related feature screen
* Read state updates without leaving screen

---

### 5. Notification Trigger Flows (Conceptual)

* Business event occurs (invite, leave, task)
* System emits notification event
* Notification record is created
* Email notification is sent asynchronously
* In-app notification is created (if applicable)

---

### 6. Error & Failure Handling

* Email delivery failure is logged
* Business workflow proceeds regardless of notification outcome
* In-app notification creation failures do not block workflows

---

### 7. Edge Cases & Alternate Paths

* Deactivated users may still receive email notifications
* In-app notifications are not generated for invitation events
* Users without relevant permissions may receive notifications but be blocked when navigating to related screens
* Notification inbox may be empty for users without task or leave involvement

---

### 8. Cross-Feature Integration Notes

* Invitation notifications integrate with F-000 activation flow
* Leave notifications integrate with Leave Management (F-009)
* Task notifications integrate with Task Management (F-008)
* RBAC (F-002) governs access to related records linked from notifications
