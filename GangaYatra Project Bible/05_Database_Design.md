# 🗄️ 05_Database_Design.md
## Complete Database Design
### GangaYatra Platform

> Version : 2.0.0  
> Database : MongoDB Atlas / MongoDB Local  
> ODM : Mongoose  
> Status : Active Development

---

# 1. Introduction

The GangaYatra Platform uses **MongoDB** as the primary database because it provides:

- High scalability
- Flexible schema
- Fast development
- Easy relationship handling through ObjectId
- Cloud deployment support
- Excellent performance for booking systems

The database is designed using a **Reference-Based Data Model**, where collections are connected using MongoDB ObjectIds.

---

# 2. Database Overview

```
                    MongoDB

        ┌──────────────────────────────┐
        │          USERS               │
        └──────────────┬───────────────┘
                       │
             ownerId   │
                       │
             assignedBoatId
                       │
                       ▼
        ┌──────────────────────────────┐
        │           BOATS              │
        └──────────────┬───────────────┘
                       │
                   boatId
                       │
                       ▼
        ┌──────────────────────────────┐
        │        SCHEDULES             │
        └──────────────┬───────────────┘
                       │
                 scheduleId
                       │
                       ▼
        ┌──────────────────────────────┐
        │          SLOTS               │
        └──────────────┬───────────────┘
                       │
                    slotId
                       │
                       ▼
        ┌──────────────────────────────┐
        │         BOOKINGS             │
        └──────────────┬───────────────┘
                       │
                   paymentId
                       │
                       ▼
        ┌──────────────────────────────┐
        │         PAYMENTS             │
        └──────────────────────────────┘
```

---

# 3. Database Collections

Current collections planned:

```
users

cities

ghats

routes

boats

schedules

slots

bookings

payments

notifications

reviews

wallets

offers

permits

attendance

reports

analytics

tickets
```

Future

```
subscriptions

auditLogs

gpsTracking

weatherLogs

tripHistory

staffPermissions

deviceSessions
```

---

# 4. Collection Relationship

```
User
 │
 ├── Owner
 │      │
 │      ├── Boats
 │      │      │
 │      │      ├── Schedules
 │      │      │      │
 │      │      │      ├── Slots
 │      │      │      │      │
 │      │      │      │      ├── Bookings
 │      │      │      │      │      │
 │      │      │      │      │      └── Payments
 │      │
 │      └── Staff
 │             │
 │             ├── Driver
 │             ├── Captain
 │             ├── Manager
 │             └── Helper
 │
 └── Customer
```

---

# 5. User Collection

Stores every person in the system.

```
User

↓

Customer

Boat Owner

Manager

Driver

Captain

Helper

Authority

Super Admin
```

Important Fields

```
_id

name

email

password

phone

role

ownerId

cityId

isActive

createdAt
```

Relationships

```
cityId

↓

City
```

```
ownerId

↓

Boat Owner
```

---

# 6. City Collection

Stores all supported cities.

Example

```
Varanasi

Prayagraj

Ayodhya

Haridwar

Goa
```

Fields

```
_id

name

state

country

riverName

isActive
```

---

# 7. Ghat Collection

Every city contains multiple ghats.

Example

```
Assi Ghat

Dashashwamedh

Rajendra Prasad

Manikarnika
```

Fields

```
cityId

name

location

latitude

longitude
```

Relationship

```
City

↓

Ghats
```

---

# 8. Route Collection

A boat travels on a route.

Example

```
Assi

↓

Dashashwamedh
```

Fields

```
sourceGhatId

destinationGhatId

distance

estimatedTime

baseFare
```

Relationship

```
Ghat

↓

Route
```

---

# 9. Boat Collection

Stores every boat.

Fields

```
ownerId

cityId

boatName

boatNumber

capacity

boatType

status

permitVerified

documents

image
```

Relationship

```
Owner

↓

Boat
```

One owner

↓

Many boats

---

# 10. Staff Relationship

```
Owner

↓

Staff

↓

Assigned Boat
```

Fields

```
ownerId

assignedBoatId

role

status
```

Example

```
Owner

↓

Driver

↓

Boat A
```

---

# 11. Schedule Collection

Every boat has schedules.

```
Boat

↓

Schedule
```

Fields

```
boatId

routeId

departureTime

arrivalTime

scheduleDate

scheduleType

totalSeats

onlineSeats

offlineSeats

emergencySeats

isActive
```

Schedule Types

```
DAILY

WEEKLY

SPECIAL
```

---

# 12. Slot Collection

Every schedule generates slots.

Example

Morning

Afternoon

Evening

Fields

```
scheduleId

onlineSeats

offlineSeats

emergencySeats

bookedOnlineSeats

bookedOfflineSeats

bookedEmergencySeats

status
```

Status

```
OPEN

FULL

CLOSED
```

---

# 13. Booking Collection

Stores all bookings.

Fields

```
customerId

slotId

bookingCode

bookingType

paymentStatus

bookingStatus

passengerName

passengerPhone

totalAmount

qrCode
```

Booking Types

```
ONLINE

OFFLINE

EMERGENCY
```

Status

```
PENDING

CONFIRMED

CANCELLED

COMPLETED
```

---

# 14. Payment Collection

Stores payment details.

Fields

```
bookingId

transactionId

amount

paymentMethod

paymentStatus

refundStatus

paidAt
```

Methods

```
UPI

CARD

NETBANKING

WALLET

CASH
```

---

# 15. Review Collection

Stores customer reviews.

Fields

```
customerId

boatId

rating

comment

createdAt
```

---

# 16. Notification Collection

Stores notifications.

Fields

```
userId

title

message

type

isRead

createdAt
```

Types

```
BOOKING

PAYMENT

SYSTEM

PROMOTION
```

---

# 17. Wallet Collection

Future

Stores

```
balance

transactions

cashback

rewardPoints
```

---

# 18. Permit Collection

Stores government permits.

Fields

```
boatId

permitNumber

validFrom

validTill

status
```

Status

```
ACTIVE

EXPIRED

REJECTED
```

---

# 19. Attendance Collection

Future

Stores staff attendance.

Fields

```
staffId

date

checkIn

checkOut

workingHours
```

---

# 20. Ticket Collection

Future

Stores QR tickets.

Fields

```
bookingId

ticketNumber

qrCode

verifiedBy

verifiedAt
```

---

# 21. Analytics Collection

Future

Stores summarized analytics.

Examples

```
Daily Revenue

Monthly Revenue

Bookings

Trips

Top Routes
```

---

# 22. Database Index Strategy

Indexes improve performance.

Current

```
email

boatNumber

bookingCode

ownerId

boatId

scheduleId

slotId

routeId
```

Future Compound Indexes

```
ownerId + boatId

boatId + scheduleDate

customerId + createdAt

bookingStatus + paymentStatus
```

---

# 23. Data Flow

```
Customer

↓

Booking

↓

Slot

↓

Schedule

↓

Boat

↓

Owner
```

---

# 24. Cascade Logic

Deleting Owner

↓

Cannot delete

↓

Must archive

Deleting Boat

↓

Check schedules

↓

Archive

Deleting Schedule

↓

Delete Slots

↓

Archive Bookings

---

# 25. Database Naming Convention

Collections

Plural

```
users

boats

bookings
```

References

```
ownerId

boatId

routeId

slotId

customerId
```

---

# 26. Data Integrity Rules

- Email must be unique.
- Boat number must be unique.
- Booking code must be unique.
- Staff must belong to one owner.
- Schedule must belong to one boat.
- Slot must belong to one schedule.
- Booking must belong to one slot.

---

# 27. Current Database Status

## ✅ Completed

- Users
- Boats
- Routes
- Ghats
- Cities
- Bookings
- Slots
- Schedules
- Payments (basic)

## 🚧 In Progress

- Staff
- Reports
- Notifications
- Reviews

## ⏳ Planned

- Wallet
- Attendance
- GPS Tracking
- AI Analytics
- Audit Logs
- Subscription

---

# 28. Future Database Improvements

- Soft Delete
- Version History
- Audit Trail
- Redis Cache
- Read Replicas
- Data Archiving
- Sharding
- Multi-Tenant Support

---

# 29. Entity Relationship Summary

```
City
 └── Ghats
      └── Routes
           └── Schedules
                └── Slots
                     └── Bookings
                          └── Payments

Owner
 ├── Boats
 └── Staff

Customer
 └── Bookings
```

---

# 30. Database Design Principles

- Use ObjectId references instead of duplication.
- Keep collections normalized where practical.
- Use indexes on frequently queried fields.
- Prefer soft deletes for business-critical data.
- Archive historical records instead of removing them.
- Design schemas to support future AI analytics and multi-city expansion.

---

# 📌 Next Document

➡ **06_API_Documentation.md**

This document will describe every REST API in the project, including endpoints, request/response formats, authentication requirements, role permissions, error responses, and examples for all major modules.

---
**End of 05_Database_Design.md**