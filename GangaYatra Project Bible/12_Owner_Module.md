# 🚤 12_Owner_Module.md
## Complete Boat Owner Management System
### GangaYatra Platform

> Version : 2.0.0  
> Module : Owner Management System  
> Status : Active Development

---

# 1. Overview

The Boat Owner Module is the business core of the GangaYatra Platform.

Every boat owner operates like an independent business inside the platform.

The owner can manage:

- Fleet
- Staff
- Routes
- Schedules
- Slots
- Bookings
- Customers
- Revenue
- Reports
- Notifications
- Payments

The platform is designed as a **Multi-Tenant SaaS Architecture**, where every owner's data is isolated from other owners.

---

# 2. Owner Architecture

```
                     BOAT OWNER
                          │
      ┌───────────────────┼───────────────────┐
      │                   │                   │
      ▼                   ▼                   ▼
     Boats             Staff              Routes
      │                   │                   │
      ▼                   ▼                   ▼
  Schedules          Attendance           Calendar
      │
      ▼
     Slots
      │
      ▼
   Bookings
      │
      ▼
 Revenue & Reports
```

---

# 3. Owner Responsibilities

Owner manages:

```
Fleet

↓

Staff

↓

Bookings

↓

Revenue

↓

Reports

↓

Business
```

---

# 4. Owner Dashboard

Current Dashboard

```
Hero Banner

↓

Statistics

↓

Revenue

↓

Bookings

↓

Boat Status

↓

Recent Bookings

↓

Quick Actions
```

---

# 5. Dashboard Statistics

Current

```
Total Boats

Active Boats

Today's Bookings

Today's Revenue

Monthly Revenue

Completed Trips

Pending Bookings

Staff Count
```

Future

```
Profit

Expenses

Fuel Cost

Average Rating

Growth %

Occupancy

Cancelled Trips

Passenger Count
```

---

# 6. Owner Sidebar

Current

```
Dashboard

Boats

Schedules

Bookings

Staff

Reports

Notifications

Settings
```

Future

```
Fleet

Calendar

Payments

Wallet

Maintenance

Analytics

Subscription

Support

Documents
```

---

# 7. Fleet Management

Owner Can

```
Create Boat

Update Boat

Delete Boat

Activate Boat

Deactivate Boat
```

---

# 8. Boat Assignment

Each Boat

```
Boat

↓

Captain

↓

Driver

↓

Helper
```

Future

```
Multiple Drivers

Multiple Helpers

Multiple Captains
```

---

# 9. Route Management

Owner Can

```
Create Route

Update Route

Disable Route

Festival Route
```

---

# 10. Schedule Management

Owner Can

```
Daily Schedule

Weekly Schedule

Special Schedule

Recurring Schedule
```

---

# 11. Slot Management

Every Schedule

↓

Automatically Creates

```
Slots

↓

Seat Allocation

↓

Booking Availability
```

---

# 12. Staff Management

Owner Can

```
Add Staff

Edit Staff

Assign Boat

Assign Schedule

Suspend Staff

Remove Staff
```

---

# 13. Customer Management

Owner Can View

```
Passengers

Frequent Customers

Cancelled Customers

Today's Customers
```

Future

```
VIP Customers

Blocked Customers

Loyalty Members
```

---

# 14. Booking Management

Current

```
Online Booking

Offline Booking

Emergency Booking

Check-in

Cancel Booking
```

Future

```
Group Booking

Corporate Booking

Tour Package

Waiting List
```

---

# 15. Revenue Module

Current

```
Today's Revenue

Monthly Revenue

Online Revenue

Offline Revenue

Emergency Revenue
```

Future

```
Profit

Expense

Fuel Cost

Maintenance Cost

Commission

Taxes
```

---

# 16. Payment Management

Owner Can View

```
Payments

Pending

Completed

Refund

Settlement
```

Future

```
Bank Transfer

UPI Settlement

Daily Settlement

Weekly Settlement
```

---

# 17. Reports Module

Current

```
Revenue

Bookings

Trips
```

Future

```
Passenger Report

Route Report

Fleet Report

Performance Report

Financial Report

Tax Report
```

---

# 18. Fleet Analytics

Future Dashboard

```
Boat Utilization

↓

Occupancy

↓

Revenue

↓

Maintenance

↓

Profitability
```

---

# 19. Staff Analytics

Owner Can See

```
Attendance

Performance

Trips

Working Hours

Ratings
```

---

# 20. Boat Health

Future

```
Engine

↓

Insurance

↓

Permit

↓

Fitness

↓

Maintenance
```

---

# 21. Permit Management

Current

Basic

Future

```
Permit Upload

↓

Verification

↓

Expiry Reminder

↓

Renewal
```

---

# 22. Notification Center

Owner Receives

```
New Booking

Payment

Trip Started

Trip Completed

Staff Alert

Permit Expiry

Weather Alert
```

---

# 23. Calendar

Current

```
Today's Trips

Upcoming Schedule
```

Future

```
Daily

Weekly

Monthly

Crew Calendar

Maintenance Calendar
```

---

# 24. Wallet

Future

Owner Wallet

```
Settlement

↓

Withdrawal

↓

Bank Transfer
```

---

# 25. Subscription

Future SaaS

```
Free

↓

Starter

↓

Professional

↓

Enterprise
```

---

# 26. Multi-City Support

Owner

↓

Can Operate

```
Varanasi

Prayagraj

Ayodhya

Haridwar

Rishikesh
```

---

# 27. Fleet Expansion

Future

```
Owner

↓

Boats

↓

Cities

↓

Branches
```

---

# 28. Branch Management

Future

```
Owner

↓

Branch

↓

Manager

↓

Fleet
```

---

# 29. AI Features

AI Revenue Prediction

```
Bookings

↓

Forecast
```

AI Pricing

```
Festival

↓

Increase Fare
```

AI Fleet Optimization

```
Idle Boat

↓

Suggest Route
```

AI Staff Assignment

```
Best Driver

↓

Assign Automatically
```

---

# 30. Owner APIs

Current

```
GET

/owner/dashboard
```

```
GET

/boats/my
```

```
GET

/schedules/owner
```

```
GET

/bookings/owner
```

```
GET

/staff/owner
```

Future

```
GET

/reports/owner
```

```
GET

/analytics/owner
```

---

# 31. Backend Flow

```
Owner Login

↓

JWT

↓

OwnerId

↓

Load

Boats

↓

Schedules

↓

Bookings

↓

Revenue

↓

Dashboard
```

---

# 32. Frontend Structure

```
owner

dashboard

boats

routes

schedules

slots

bookings

staff

reports

notifications

settings
```

Future

```
wallet

payments

fleet

maintenance

subscription

analytics
```

---

# 33. Security

✔ Owner Data Isolation

✔ JWT Authentication

✔ Role Middleware

✔ Owner Resource Filtering

✔ Audit Logging

---

# 34. KPIs (Future)

Dashboard Metrics

```
Revenue

Bookings

Occupancy

Trips

Fuel

Maintenance

Profit

Growth
```

---

# 35. Development Roadmap

### Phase 1 ✅

- Dashboard
- Boats
- Bookings
- Staff
- Revenue Cards

---

### Phase 2 (Current)

- Calendar
- Reports
- Notifications
- Schedule Management
- Staff Integration

---

### Phase 3

- Fleet Analytics
- Wallet
- Payments
- Maintenance

---

### Phase 4

- Subscription System
- Multi-City Management
- Branch Management

---

### Phase 5

- AI Revenue Prediction
- Dynamic Pricing
- Fleet Optimization
- Business Intelligence Dashboard

---

# 36. Current Development Status

✅ Owner Authentication

✅ Dashboard

✅ Boats Module

✅ Staff Module

✅ Schedule Module

✅ Booking Module

✅ Revenue Statistics

✅ Notifications (Basic)

🚧 Reports

🚧 Payments

🚧 Wallet

🚧 Subscription

🚧 Fleet Analytics

---

# 37. Summary

The Boat Owner Module transforms every owner into an independent business operator within the platform.

It provides:

- Fleet management
- Workforce management
- Booking operations
- Revenue tracking
- Business analytics
- Multi-tenant security
- Scalable SaaS architecture

This module is designed to grow from a single-boat owner to a large fleet operator managing hundreds of boats across multiple cities.

---

# 📌 Next Document

➡ **13_Customer_Module.md**

This document will describe the complete Customer ecosystem, including registration, booking flow, wallet, live tracking, ratings & reviews, loyalty system, profile management, booking history, and future AI-powered customer experience features.

---
**End of 12_Owner_Module.md**