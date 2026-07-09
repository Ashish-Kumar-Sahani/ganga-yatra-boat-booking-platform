# 🗓️ 10_Schedule_and_Slot_Engine.md
## Complete Schedule & Slot Management System
### GangaYatra Platform

> Version : 2.0.0  
> Module : Schedule & Slot Engine  
> Status : Active Development

---

# 1. Overview

The Schedule & Slot Engine is responsible for managing the operational timeline of every boat.

It controls:

- Boat availability
- Daily schedules
- Route assignments
- Seat distribution
- Slot generation
- Booking availability
- Calendar integration
- Staff trip planning

This module acts as the operational backbone of the entire booking platform.

---

# 2. Architecture

```
Boat

    │

    ▼

Route

    │

    ▼

Schedule

    │

    ▼

Slot

    │

    ▼

Bookings

    │

    ▼

Passengers
```

---

# 3. Relationship Diagram

```
Boat (1)

↓

Many Schedules

↓

Each Schedule

↓

Many Slots

↓

Each Slot

↓

Many Bookings
```

---

# 4. Current Schedule Model

```
Schedule

_id

boatId

routeId

departureTime

arrivalTime

totalSeats

onlineSeats

offlineSeats

emergencySeats

scheduleType

isActive

createdAt

updatedAt
```

---

# 5. Future Schedule Model

```
Schedule

_id

boatId

routeId

scheduleDate

departureTime

arrivalTime

boardingTime

tripDuration

repeatType

repeatDays

status

crew

weatherStatus

createdBy

updatedBy
```

---

# 6. Schedule Types

Current

```
DAILY

WEEKLY

SPECIAL
```

Future

```
DAILY

WEEKLY

MONTHLY

SEASONAL

FESTIVAL

PRIVATE

CHARTER
```

---

# 7. Schedule Lifecycle

```
Created

↓

Approved

↓

Published

↓

Open

↓

Running

↓

Completed

↓

Archived
```

---

# 8. Schedule Status

Current

```
isActive

true

false
```

Future

```
DRAFT

ACTIVE

RUNNING

COMPLETED

CANCELLED

SUSPENDED
```

---

# 9. Seat Distribution

Current Validation

```
Online

+

Offline

+

Emergency

=

Total Seats
```

Example

```
Total

30
```

```
Online

18
```

```
Offline

8
```

```
Emergency

4
```

---

# 10. Slot Engine

Each Schedule automatically creates booking slots.

```
Schedule

↓

Slot

↓

Bookings
```

Example

```
Assi Ghat

↓

Dashashwamedh

↓

08:00 AM

↓

Slot
```

---

# 11. Slot Model

```
Slot

_id

scheduleId

onlineSeats

offlineSeats

emergencySeats

bookedOnlineSeats

bookedOfflineSeats

bookedEmergencySeats

status

createdAt
```

---

# 12. Slot Status

```
OPEN

FULL

CLOSED

RUNNING

COMPLETED

CANCELLED
```

---

# 13. Seat Availability

Available Online

```
onlineSeats

-

bookedOnlineSeats
```

Available Offline

```
offlineSeats

-

bookedOfflineSeats
```

Available Emergency

```
emergencySeats

-

bookedEmergencySeats
```

---

# 14. Schedule Creation Flow

```
Owner

↓

Boat

↓

Route

↓

Schedule

↓

Validation

↓

Slot Generation

↓

Publish
```

---

# 15. Schedule Validation

Before Saving

System Checks

```
Boat Exists

↓

Route Exists

↓

Seat Validation

↓

Departure Time

↓

Arrival Time

↓

Duplicate Schedule

↓

Save
```

---

# 16. Duplicate Prevention

Future Validation

System Should Prevent

```
Same Boat

Same Date

Same Time
```

Example

```
Boat A

08:00 AM

Already Exists

↓

Reject
```

---

# 17. Owner Schedule

Owner Can

```
Create

Edit

Delete

Pause

Resume

View Calendar
```

---

# 18. Staff Schedule

Manager

```
View

Assign Crew

Update Status
```

Driver

```
View Today's Trips
```

Captain

```
Start Trip

End Trip
```

Helper

```
Passenger Boarding
```

---

# 19. Calendar Integration

Current

```
Schedule

↓

Calendar

↓

Today's Trips

↓

Upcoming Trips
```

Future

```
Month View

Week View

Day View

Timeline View

Crew Calendar
```

---

# 20. Today's Trips

Displays

```
Boat

Route

Departure

Arrival

Passengers

Status
```

---

# 21. Upcoming Trips

Shows

```
Date

Boat

Route

Time

Crew

Status
```

---

# 22. Staff Assignment (Future)

```
Schedule

↓

Driver

↓

Captain

↓

Helper

↓

Manager
```

Example

```
Schedule

↓

Boat A

↓

Driver

Ramesh

↓

Captain

Amit

↓

Helper

Suresh
```

---

# 23. Weather Integration

Future

```
Weather API

↓

Storm

↓

Heavy Rain

↓

Schedule Suspended
```

---

# 24. Festival Scheduling

Special Schedules

```
Dev Deepawali

Ganga Dussehra

Kartik Purnima

Mahashivratri
```

System Can

```
Increase Trips

Increase Boats

Increase Seats
```

---

# 25. Dynamic Schedule

Future AI

Predict

```
Rush Hours

↓

Generate Extra Trips
```

---

# 26. Route Availability

Before Publishing

System Checks

```
Boat

↓

Permit

↓

Route

↓

Schedule

↓

Publish
```

---

# 27. APIs

Current

```
GET

/schedules
```

```
GET

/schedules/owner
```

```
GET

/schedules/route/:routeId
```

```
POST

/schedules
```

```
PUT

/schedules/:id
```

```
PATCH

/schedules/:id/status
```

```
DELETE

/schedules/:id
```

---

# 28. Current Backend Flow

```
Owner Login

↓

getOwnerId()

↓

Owner Boats

↓

Schedules

↓

Populate Route

↓

Populate Boat

↓

Return
```

---

# 29. Current Frontend

Owner

```
Schedules Page

Calendar

Today's Trips

Upcoming Trips
```

Staff

```
Today's Trips

Upcoming Schedule

Trip Calendar
```

Customer

```
Search Route

Available Schedules

Available Slots
```

---

# 30. Recommended Improvements

Add

```
scheduleDate
```

Add

```
boardingTime
```

Add

```
tripDuration
```

Add

```
crewMembers
```

Add

```
remarks
```

---

# 31. Future Calendar UI

Replace Monthly Calendar

With

```
Today's Trips

Tomorrow

Next 7 Days

Next 30 Days
```

Professional Cards

```
Boat

↓

Departure

↓

Arrival

↓

Passengers

↓

Status
```

---

# 32. AI Schedule Generator

Future

```
Historical Data

↓

Crowd Prediction

↓

Generate Best Timetable
```

---

# 33. AI Route Optimization

```
Traffic

Weather

Crowd

Water Level

↓

Suggest Best Route
```

---

# 34. Smart Notifications

Before Trip

```
24 Hours

↓

2 Hours

↓

30 Minutes

↓

Boat Ready
```

---

# 35. Security

✔ Duplicate Prevention

✔ Owner Isolation

✔ Route Validation

✔ Permit Validation

✔ Time Validation

✔ Seat Validation

---

# 36. Development Roadmap

### Phase 1 ✅

- Schedule CRUD
- Slot CRUD
- Seat Validation

---

### Phase 2 (Current)

- Owner Calendar
- Staff Calendar
- Today's Trips
- Upcoming Trips

---

### Phase 3

- Schedule Date
- Weekly Calendar
- Crew Assignment
- Boarding Time

---

### Phase 4

- Recurring Schedule
- Festival Schedule
- Dynamic Trips

---

### Phase 5

- AI Timetable
- Weather Integration
- Smart Scheduling
- Automatic Slot Generation

---

# 37. Summary

The Schedule & Slot Engine manages the operational execution of the platform.

It connects:

- Boats
- Routes
- Staff
- Bookings
- Calendar
- Customers

This module ensures that every boat trip is properly planned, seats are accurately allocated, and bookings remain synchronized with real-time operational schedules.

It is designed to evolve into an intelligent scheduling system powered by AI, weather insights, demand prediction, and dynamic route management.

---

# 📌 Next Document

➡ **11_Staff_Module.md**

This document will explain the complete Staff Management System, including Owner–Staff hierarchy, authentication, permissions, crew assignment, attendance, dashboard architecture, and future workforce management features.

---
**End of 10_Schedule_and_Slot_Engine.md**