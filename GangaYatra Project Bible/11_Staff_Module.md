# 👥 11_Staff_Module.md
## Complete Staff Management System
### GangaYatra Platform

> Version : 2.0.0  
> Module : Staff Management  
> Status : Active Development

---

# 1. Overview

The Staff Module is one of the most important modules in the GangaYatra Platform.

Unlike traditional boat booking platforms where only owners manage operations, this system introduces a complete workforce management architecture.

Every Boat Owner can create and manage their own staff members.

Staff members inherit the owner's resources while only accessing features permitted for their role.

The Staff Module includes:

- Staff Authentication
- Staff Dashboard
- Boat Assignment
- Schedule Assignment
- Attendance
- Live Tracking
- Notifications
- Permissions
- Workforce Management

---

# 2. Staff Hierarchy

```
                Boat Owner
                     │
     ┌───────────────┼───────────────┐
     │               │               │
     ▼               ▼               ▼
 Manager         Captain         Driver
                                     │
                                     ▼
                                  Helper
```

Owner is the only person who owns business resources.

Every staff member works under an Owner.

---

# 3. Staff Architecture

```
Owner

↓

Creates Staff

↓

Staff Linked

↓

ownerId Stored

↓

Staff Login

↓

Owner Resources Loaded

↓

Role Based Dashboard
```

---

# 4. Staff Relationship

Current Database

```
User

_id

ownerId

role
```

Example

```
Owner

_id

65AB12...
```

Manager

```
ownerId

65AB12...
```

Driver

```
ownerId

65AB12...
```

Captain

```
ownerId

65AB12...
```

Helper

```
ownerId

65AB12...
```

---

# 5. Staff Roles

Current

```
MANAGER

DRIVER

CAPTAIN

HELPER
```

Future

```
ACCOUNTANT

SECURITY

TICKET_OPERATOR

FLEET_MANAGER

MAINTENANCE

SUPERVISOR

SAFETY_OFFICER
```

---

# 6. Current Staff Model

```
Staff

_id

ownerId

name

phone

email

role

assignedBoatId

status

createdAt

updatedAt
```

---

# 7. Future Staff Model

```
Staff

_id

ownerId

employeeCode

employeeType

department

joiningDate

salary

documents

emergencyContact

aadhaar

license

experience

assignedBoatId

permissions

status
```

---

# 8. Staff Login Flow

```
Owner

↓

Create Staff

↓

Staff Receives Login

↓

Login

↓

JWT

↓

Role Detection

↓

Dashboard
```

---

# 9. Staff Dashboard

Common Dashboard

```
Dashboard

Notifications

Profile
```

Role-specific modules appear automatically.

---

# 10. Manager Dashboard

Modules

```
Dashboard

Bookings

Boats

Customers

Calendar

Reports

Attendance

Payments

Notifications

Team
```

---

# 11. Driver Dashboard

Modules

```
Dashboard

Today's Trips

Assigned Boat

Passengers

QR Scanner

Live Tracking

Notifications
```

---

# 12. Captain Dashboard

Modules

```
Dashboard

Trips

Boat Status

Passenger List

Trip History

Live Tracking
```

---

# 13. Helper Dashboard

Modules

```
Dashboard

Today's Trips

Passengers

Boarding

Notifications
```

---

# 14. Staff Authentication

Uses same authentication system.

```
Login

↓

JWT

↓

Role

↓

Owner Resolution

↓

Dashboard
```

---

# 15. Owner Resolution

Every staff API first resolves Owner.

```
Driver

↓

ownerId

↓

Owner Boats

↓

Owner Schedule

↓

Owner Booking
```

Utility

```
getOwnerId()
```

---

# 16. Staff Permissions

Manager

```
Booking

Boat

Schedule

Reports

Attendance
```

Driver

```
Passengers

Today's Trips

QR Scan
```

Captain

```
Boat Status

Trip Start

Trip End
```

Helper

```
Passenger Boarding

Check-in
```

---

# 17. Staff CRUD

Current APIs

```
GET

/staff/owner
```

```
POST

/staff
```

```
PUT

/staff/:id
```

```
DELETE

/staff/:id
```

---

# 18. Boat Assignment

Every staff can optionally be assigned to a boat.

```
Boat

↓

Driver

Captain

Helper
```

Future

Multiple Crew

```
Boat

↓

Captain

↓

Driver

↓

Helper
```

---

# 19. Schedule Assignment

Future

```
Schedule

↓

Assign Crew

↓

Driver

Captain

Helper
```

Crew automatically receives notifications.

---

# 20. Attendance System

Current

Basic Attendance

Future

```
Clock In

↓

GPS Verify

↓

Working

↓

Clock Out
```

---

# 21. Shift Management

Future

Morning

```
06:00

↓

02:00
```

Evening

```
02:00

↓

10:00
```

Night

```
10:00

↓

06:00
```

---

# 22. Leave Management

Future

```
Leave Request

↓

Owner Approval

↓

Calendar Updated
```

---

# 23. Salary Module

Future

```
Attendance

↓

Salary

↓

Bonus

↓

Deduction

↓

Settlement
```

---

# 24. Employee Code

Future

```
EMP0001

EMP0002

EMP0003
```

Unique for every employee.

---

# 25. Staff Status

Current

```
ACTIVE

INACTIVE
```

Future

```
ACTIVE

ON_LEAVE

SUSPENDED

TERMINATED

RETIRED
```

---

# 26. Staff Notification

Receive

```
Today's Trip

Boat Assigned

Emergency

Weather Alert

Passenger Delay
```

---

# 27. Staff Performance

Future

Driver

```
Trips Completed

Passengers

Ratings
```

Captain

```
Safety Score

Trip Completion
```

Helper

```
Passenger Feedback
```

---

# 28. Staff Documents

Future

```
Driving License

Boat License

Aadhaar

PAN

Medical Certificate

Police Verification
```

---

# 29. Staff Profile

Contains

```
Personal Info

Documents

Assigned Boat

Attendance

Trips

Performance

Salary
```

---

# 30. Team Management

Owner Can

```
Add Staff

Remove Staff

Assign Boat

Assign Schedule

Suspend

Activate
```

---

# 31. Staff Folder Structure

```
staff

dashboard

boats

bookings

calendar

attendance

notifications

reports

payments

team

layout
```

Future

```
documents

salary

performance

leave

training
```

---

# 32. Backend Flow

```
Owner Login

↓

Create Staff

↓

ownerId Stored

↓

Staff Login

↓

Owner Resources Loaded

↓

Role Filter

↓

Dashboard
```

---

# 33. Frontend Flow

```
Login

↓

Auth Store

↓

Role Detect

↓

Staff Layout

↓

Sidebar

↓

Modules
```

---

# 34. Security

✔ Owner Isolation

✔ JWT

✔ Role Middleware

✔ Permission Middleware (Future)

✔ Data Filtering

---

# 35. AI Features

Future

AI Attendance

```
Face Recognition
```

AI Crew Allocation

```
Best Driver

↓

Assign Automatically
```

AI Performance

```
Late

↓

Warnings

↓

Suggestions
```

---

# 36. Development Roadmap

### Phase 1 ✅

- Staff CRUD
- Owner Linking
- Boat Assignment

---

### Phase 2 (Current)

- Staff Dashboard
- Calendar
- Bookings
- Notifications

---

### Phase 3

- Attendance
- Performance
- Leave Management

---

### Phase 4

- Salary
- Document Verification
- Shift Planning

---

### Phase 5

- AI Workforce
- Smart Crew Assignment
- Face Attendance
- Driver Safety Score

---

# 37. Current Development Status

✅ Staff Login

✅ Shared Staff Dashboard

✅ Owner Resolution (`getOwnerId()`)

✅ Staff CRUD

✅ Boat Assignment

✅ Calendar Integration

✅ Booking Visibility

🚧 Attendance Module

🚧 Performance Tracking

🚧 Leave Management

🚧 Salary System

🚧 Document Verification

---

# 38. Summary

The Staff Module transforms the GangaYatra Platform into a professional workforce management platform.

It enables:

- Multi-level staff management
- Secure owner-resource inheritance
- Role-specific dashboards
- Boat and schedule assignments
- Future AI-powered workforce optimization

This architecture is scalable enough to support individual boat owners, large fleet operators, tourism companies, and government-managed river transport systems.

---

# 📌 Next Document

➡ **12_Owner_Module.md**

This document will cover the complete Boat Owner ecosystem, including owner dashboard architecture, fleet management, revenue analytics, staff administration, operational controls, subscription management, and future business intelligence features.

---
**End of 11_Staff_Module.md**