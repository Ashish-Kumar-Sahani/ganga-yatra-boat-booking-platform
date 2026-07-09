# 📖 09_Booking_Engine.md
## Complete Booking Management System
### GangaYatra Platform

> Version : 2.0.0  
> Module : Booking Engine  
> Status : Active Development

---

# 1. Overview

The Booking Engine is the heart of the GangaYatra Platform.

It manages the complete passenger journey from searching a route to completing the trip.

The engine supports multiple booking modes, QR ticket generation, seat allocation, payment integration, trip lifecycle management, and future AI-powered optimizations.

---

# 2. Booking Workflow

```
Customer

    │

    ▼

Search Route

    │

    ▼

Available Schedule

    │

    ▼

Available Slot

    │

    ▼

Select Seats

    │

    ▼

Passenger Details

    │

    ▼

Payment

    │

    ▼

Booking Created

    │

    ▼

QR Ticket Generated

    │

    ▼

Check-in

    │

    ▼

Board Boat

    │

    ▼

Trip Completed
```

---

# 3. Booking Types

Current System Supports

```
ONLINE

OFFLINE

EMERGENCY
```

---

## ONLINE

Customer books through website/mobile.

Flow

```
Customer

↓

Search

↓

Payment

↓

QR Ticket
```

---

## OFFLINE

Owner books directly.

Flow

```
Passenger

↓

Owner Counter

↓

Offline Booking

↓

QR Ticket
```

---

## EMERGENCY

Reserved seats.

Examples

```
VIP

Medical

Police

Government

Emergency Rescue
```

---

# 4. Booking Lifecycle

```
Searching

↓

Booking

↓

Payment

↓

Confirmed

↓

Check-In

↓

Trip Started

↓

Completed
```

Alternative

```
Booking

↓

Cancelled
```

---

# 5. Booking Status

Current

```
PENDING

CONFIRMED

CANCELLED

COMPLETED
```

Future

```
WAITING

ON_HOLD

FAILED

REFUNDED

NO_SHOW
```

---

# 6. Payment Status

Current

```
PENDING

PAID

FAILED

REFUNDED
```

Future

```
PARTIALLY_REFUNDED

PARTIAL_PAYMENT

COD
```

---

# 7. Check-in Status

Current

```
NOT_CHECKED_IN

CHECKED_IN

NO_SHOW
```

---

# 8. Booking Model

Current Structure

```
Booking

_id

customerId

slotId

bookingCode

bookingType

bookingStatus

paymentStatus

checkInStatus

seatsBooked

totalAmount

passengerName

passengerPhone

qrCode

cancelledAt

cancellationReason

createdAt

updatedAt
```

---

# 9. Booking Code

Current

```
WBB-174582924
```

Offline

```
WBB-OFF-174582924
```

Emergency

```
WBB-EMG-174582924
```

Future

```
VNS-2026-000001
```

---

# 10. Seat Allocation

Current

```
Total Seats

↓

Online Seats

↓

Offline Seats

↓

Emergency Seats
```

Validation

```
Online

+

Offline

+

Emergency

=

Total
```

---

# 11. Seat Availability

Online Booking

```
Available

=

Online Seats

-

Booked Online
```

Offline Booking

```
Available

=

Offline Seats

-

Booked Offline
```

Emergency

```
Available

=

Emergency Seats

-

Booked Emergency
```

---

# 12. Booking Validation

System Checks

```
Slot Exists

↓

Slot Open

↓

Seats Available

↓

Passenger Valid

↓

Payment Success

↓

Booking Create
```

---

# 13. QR Ticket Generation

Current

```
Booking Created

↓

Generate JSON

↓

QRCode.toDataURL()

↓

Save

↓

Return
```

QR Content

```json
{
   "bookingId":"...",
   "bookingCode":"..."
}
```

Future

```json
{
   "bookingCode":"",
   "tripId":"",
   "boatId":"",
   "ownerId":"",
   "encrypted":true
}
```

---

# 14. Owner Booking Flow

Owner Dashboard

↓

```
Offline Booking

↓

Select Slot

↓

Passenger

↓

Seat

↓

Confirm
```

---

# 15. Customer Booking Flow

Customer

↓

```
Route

↓

Schedule

↓

Slot

↓

Seats

↓

Payment

↓

Ticket
```

---

# 16. Staff Booking Access

Manager

Can

```
View

Create Offline

Cancel

Check-In
```

Driver

Can

```
Passenger List

Check-In

Trip Status
```

Captain

Can

```
Passenger List

Check-In

Complete Trip
```

Helper

Can

```
Passenger Check-in

Boarding
```

---

# 17. Booking APIs

Current

```
POST

/bookings
```

```
GET

/bookings/my-bookings
```

```
GET

/bookings/owner
```

```
GET

/bookings/all
```

```
PATCH

/bookings/cancel/:id
```

```
POST

/bookings/offline
```

```
POST

/bookings/emergency
```

```
POST

/bookings/verify-ticket
```

```
PATCH

/bookings/check-in
```

```
PATCH

/bookings/complete
```

---

# 18. Booking Search

Current

Search By

```
Booking Code

Passenger Name

Passenger Phone
```

Future

```
Date

Boat

Owner

Payment

Trip

Route

Status
```

---

# 19. Cancellation Flow

```
Customer

↓

Cancel

↓

Booking Status

↓

Seat Released

↓

Refund Process
```

Current

Seat automatically returns to

```
Online

Offline

Emergency
```

---

# 20. Refund Engine (Future)

```
Cancellation

↓

Refund Rules

↓

Gateway

↓

Wallet

↓

Customer
```

---

# 21. Booking Dashboard

Owner

```
Today's Booking

Upcoming

Completed

Cancelled

Revenue
```

Staff

```
Today's Passengers

Today's Trips

Checked-In

Pending
```

Customer

```
Upcoming

History

Cancelled

Wallet
```

---

# 22. Future Features

Waiting List

```
Full Slot

↓

Join Queue

↓

Auto Confirm
```

---

Family Booking

```
Multiple Passengers

↓

One QR
```

---

Group Booking

```
Schools

Tourists

Pilgrims

VIP
```

---

Recurring Booking

```
Daily

Weekly

Monthly
```

---

Corporate Booking

```
Companies

Travel Agents

Hotels
```

---

# 23. AI Features (Future)

AI Seat Recommendation

```
Suggest Best Slot
```

AI Demand Prediction

```
Festival Crowd

Weekend Rush

Peak Hours
```

AI Pricing

```
Dynamic Fare
```

AI Cancellation Prediction

```
Suggest Waiting List Fill
```

---

# 24. Booking State Diagram

```
PENDING

↓

PAID

↓

CONFIRMED

↓

CHECKED_IN

↓

TRIP_STARTED

↓

COMPLETED
```

Alternative

```
PENDING

↓

FAILED
```

or

```
CONFIRMED

↓

CANCELLED

↓

REFUND
```

---

# 25. Security

✔ QR Validation

✔ Seat Validation

✔ Duplicate Booking Prevention

✔ Owner Isolation

✔ Payment Verification

✔ Check-in Validation

✔ JWT Protected APIs

---

# 26. Roadmap

### Phase 1 ✅

- Online Booking
- Offline Booking
- Emergency Booking
- QR Ticket
- Cancellation

---

### Phase 2 (Current)

- Staff Check-In
- Trip Completion
- Owner Booking Dashboard
- Customer History

---

### Phase 3

- Waiting List
- Refund Engine
- Wallet Refund
- Group Booking

---

### Phase 4

- Dynamic Pricing
- AI Seat Allocation
- Smart Queue
- Auto Upgrade

---

### Phase 5

- Face Verification
- NFC Ticket
- Offline QR Validation
- AI Fraud Detection

---

# 27. Summary

The Booking Engine is designed to be a scalable, enterprise-grade system that supports:

- Online, Offline, and Emergency bookings
- QR-based digital tickets
- Secure seat allocation
- Complete booking lifecycle
- Role-based booking management
- Future AI-driven enhancements

It forms the operational backbone of the GangaYatra Platform and integrates closely with schedules, slots, payments, notifications, and staff operations.

---

# 📌 Next Document

➡ **10_Schedule_and_Slot_Engine.md**

This document will describe the complete scheduling architecture, slot generation, recurring schedules, daily operations, seat distribution, availability calculation, calendar integration, and future intelligent scheduling features.

---
**End of 09_Booking_Engine.md**