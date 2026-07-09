# 🛡️ 08_Roles_and_Permissions.md
## Complete Role Based Access Control (RBAC)
### GangaYatra Platform

> Version : 2.0.0  
> Architecture : Enterprise RBAC (Role-Based Access Control)  
> Status : Active Development

---

# 1. Overview

The GangaYatra Platform supports multiple user roles. Every role has different responsibilities and access levels.

Instead of giving every user full access, the platform uses **Role-Based Access Control (RBAC)** to ensure that each user can only access the modules, APIs, and actions required for their responsibilities.

This improves:

- Security
- Data Isolation
- Performance
- Scalability
- Maintainability

---

# 2. User Hierarchy

```
                    SUPER ADMIN
                          │
      ┌───────────────────┼───────────────────┐
      │                   │                   │
      ▼                   ▼                   ▼
CITY AUTHORITY      BOAT OWNER         SYSTEM SETTINGS
                          │
          ┌───────────────┼─────────────────┐
          │               │                 │
          ▼               ▼                 ▼
      MANAGER         DRIVER          CAPTAIN
                          │
                          ▼
                      HELPER
                          
CUSTOMER
```

---

# 3. Available Roles

Current Roles

```
SUPER_ADMIN

CITY_AUTHORITY

BOAT_OWNER

MANAGER

DRIVER

CAPTAIN

HELPER

CUSTOMER
```

---

# 4. Role Responsibilities

---

## SUPER_ADMIN

Platform Owner

Responsible For

- Complete Platform
- Analytics
- All Cities
- All Owners
- Payments
- Reports
- User Management
- Settings

Access Level

```
100%
```

---

## CITY_AUTHORITY

Responsible For

- City Monitoring
- Boat Verification
- Permit Verification
- Route Approval
- Safety Reports

Cannot

- Delete Owner
- Access Financial Settings
- Platform Settings

Access

```
City Specific
```

---

## BOAT_OWNER

Responsible For

Own Business

Can Manage

- Boats
- Staff
- Routes
- Schedules
- Bookings
- Revenue
- Reports

Cannot

- Other Owners' Data

---

## MANAGER

Works Under

```
Boat Owner
```

Can Manage

- Boats

- Bookings

- Customers

- Calendar

- Reports

- Staff Attendance

- Payments

- Notifications

Cannot

- Delete Owner

- Change Subscription

- Delete Boat Owner Account

---

## DRIVER

Responsible For

Boat Operation

Can

- View Today's Trips

- View Assigned Boat

- Passenger List

- QR Check-in

- Live Tracking

Cannot

- Edit Routes

- Delete Boats

- View Reports

---

## CAPTAIN

Responsible For

Boat Navigation

Can

- Start Trip

- Complete Trip

- Passenger Verification

- Boat Status

Cannot

- Revenue

- Staff

- Reports

---

## HELPER

Responsible For

Passenger Assistance

Can

- Passenger Check-in

- Help Boarding

- View Today's Trips

Cannot

- Edit Anything

---

## CUSTOMER

Can

- Register

- Login

- Search Boats

- Book Tickets

- Cancel Booking

- Wallet

- Reviews

- Live Tracking

Cannot

- Staff Features

- Owner Features

---

# 5. Permission Levels

Permission Types

```
VIEW

CREATE

UPDATE

DELETE

EXPORT

APPROVE

VERIFY
```

---

# 6. Module Permission Matrix

| Module | Super Admin | Authority | Owner | Manager | Driver | Captain | Helper | Customer |
|---------|------------|-----------|--------|----------|---------|----------|----------|-----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Boats | ✅ | View | ✅ | ✅ | View | View | ❌ | ❌ |
| Routes | ✅ | Approve | ✅ | View | ❌ | ❌ | ❌ | View |
| Schedules | ✅ | View | ✅ | ✅ | View | View | View | View |
| Slots | ✅ | View | ✅ | View | ❌ | ❌ | ❌ | View |
| Bookings | ✅ | View | ✅ | ✅ | View | View | View | Own |
| Revenue | ✅ | ❌ | ✅ | View | ❌ | ❌ | ❌ | ❌ |
| Reports | ✅ | View | ✅ | View | ❌ | ❌ | ❌ | ❌ |
| Notifications | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Live Tracking | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | View | View |
| Staff | ✅ | View | ✅ | View | ❌ | ❌ | ❌ | ❌ |
| Attendance | ✅ | View | ✅ | ✅ | Own | Own | Own | ❌ |
| Payments | ✅ | ❌ | ✅ | View | ❌ | ❌ | ❌ | Own |
| Reviews | ✅ | View | View | View | ❌ | ❌ | ❌ | Own |

---

# 7. Owner Permission Breakdown

Owner Can

```
Create Boat

Update Boat

Delete Boat

Manage Staff

Assign Boats

Create Routes

Create Schedule

Offline Booking

Revenue

Reports

Wallet

Subscription

Settings
```

---

# 8. Manager Permissions

Manager Can

```
Dashboard

Bookings

Boats

Customers

Calendar

Reports

Attendance

Notifications

Payments (View)

Team
```

Manager Cannot

```
Delete Owner

Subscription

Platform Settings

Owner Account

System Settings
```

---

# 9. Driver Permissions

Driver Dashboard

```
Today's Trips

Assigned Boat

Passenger List

QR Scanner

Start Trip

Complete Trip

Live Tracking
```

Driver Cannot

```
Revenue

Staff

Routes

Payments

Reports

Analytics
```

---

# 10. Captain Permissions

Captain Dashboard

```
Assigned Boat

Today's Trips

Passenger List

Boat Status

Start Journey

Complete Journey

Emergency Report
```

---

# 11. Helper Permissions

Helper Dashboard

```
Today's Passengers

Boarding

Check-in

Trip Status
```

---

# 12. Customer Permissions

Customer Can

```
Register

Login

Book Ticket

Wallet

My Bookings

History

Cancel Booking

Reviews

Profile

Live Tracking
```

---

# 13. API Authorization

Example

Owner Route

```ts
allowRoles(
"BOAT_OWNER"
)
```

Manager Route

```ts
allowRoles(
"MANAGER"
)
```

Shared

```ts
allowRoles(
"BOAT_OWNER",
"MANAGER"
)
```

Staff

```ts
allowRoles(
"MANAGER",
"DRIVER",
"CAPTAIN",
"HELPER"
)
```

---

# 14. Frontend Route Protection

```
/admin

↓

SUPER_ADMIN
```

```
/authority

↓

CITY_AUTHORITY
```

```
/owner

↓

BOAT_OWNER
```

```
/staff

↓

MANAGER

DRIVER

CAPTAIN

HELPER
```

```
/customer

↓

CUSTOMER
```

---

# 15. Sidebar Visibility

Owner Sidebar

```
Dashboard

Boats

Schedules

Bookings

Revenue

Staff

Reports

Wallet

Settings
```

---

Manager Sidebar

```
Dashboard

Bookings

Boats

Customers

Calendar

Attendance

Notifications

Reports

Team
```

---

Driver Sidebar

```
Dashboard

Today's Trips

Boat

Passengers

Live Tracking

Notifications
```

---

Captain Sidebar

```
Dashboard

Trips

Boat Status

Passengers

Live Tracking
```

---

Helper Sidebar

```
Dashboard

Today's Trips

Passengers

Notifications
```

---

# 16. Backend Data Isolation

Staff never accesses data directly.

Flow

```
Driver Login

↓

ownerId

↓

Owner Boats

↓

Owner Schedule

↓

Owner Booking

↓

Filtered Response
```

This guarantees:

- No access to another owner's data
- Secure multi-tenant architecture

---

# 17. Future Permission System

Instead of fixed roles, each staff member will have granular permissions.

Example

```json
{
  "permissions": [
    "booking.view",
    "booking.update",
    "boat.view",
    "calendar.view",
    "passenger.checkin"
  ]
}
```

---

# 18. Permission Middleware (Future)

Example

```ts
allowPermission(
"booking.update"
)
```

Instead of

```ts
allowRoles(
"MANAGER"
)
```

This enables custom staff permissions without creating new roles.

---

# 19. Recommended Folder Structure

```
permissions/

permission.model.ts

permission.controller.ts

permission.routes.ts

permission.middleware.ts

permission.service.ts
```

---

# 20. Security Best Practices

✔ Never trust frontend role checks

✔ Always validate permissions on backend

✔ Filter owner-specific data using `ownerId`

✔ Avoid exposing unrelated records

✔ Log sensitive actions (delete, approve, payment)

✔ Keep permission logic centralized

---

# 21. RBAC Roadmap

### Phase 1 ✅

- Basic Roles
- JWT
- Role Middleware

---

### Phase 2 (Current)

- Staff Hierarchy
- Owner Resolution
- Shared Staff Dashboard

---

### Phase 3

- Permission Model
- Dynamic Sidebar
- Menu Authorization

---

### Phase 4

- Custom Role Builder
- Permission Editor
- Department-Based Access

---

### Phase 5

- Enterprise IAM
- Audit Trails
- Activity Logs
- Session Management
- Multi-Level Approval Workflows

---

# 22. Summary

The RBAC system is designed to:

- Secure every API
- Isolate owner data
- Allow staff to work with owner resources
- Scale from small boat operators to enterprise fleets
- Support future granular permissions without major architecture changes

This RBAC foundation ensures the GangaYatra Platform remains secure, maintainable, and extensible as new roles and features are introduced.

---

# 📌 Next Document

➡ **09_Booking_Engine.md**

This document will cover the complete booking lifecycle, including online, offline, emergency bookings, seat allocation, QR ticket generation, cancellations, refunds, check-in, trip completion, and booking state management.

---
**End of 08_Roles_and_Permissions.md**