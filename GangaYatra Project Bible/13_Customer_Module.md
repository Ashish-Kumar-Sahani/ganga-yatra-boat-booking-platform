# 👤 13_Customer_Module.md
## Complete Customer Management System
### GangaYatra Platform

> Version : 2.0.0  
> Module : Customer Module  
> Status : Active Development

---

# 1. Overview

The Customer Module is the primary user-facing component of the GangaYatra Platform.

Every passenger interacts with the platform through this module.

The goal is to provide a seamless experience from searching a route to completing a boat journey.

The module includes:

- Registration
- Login
- Route Search
- Boat Search
- Booking
- Payments
- Digital Tickets
- Live Tracking
- Reviews
- Wallet
- Notifications
- Booking History
- Profile Management

---

# 2. Customer Journey

```
Register

↓

Login

↓

Search City

↓

Search Route

↓

View Boats

↓

Select Schedule

↓

Select Seats

↓

Payment

↓

Booking Confirmation

↓

QR Ticket

↓

Live Tracking

↓

Board Boat

↓

Trip Complete

↓

Rate Trip
```

---

# 3. Customer Dashboard

Current

```
Dashboard

↓

Statistics

↓

Upcoming Trips

↓

Recent Bookings

↓

Offers

↓

Quick Actions
```

Future

```
Personalized Recommendations

Favorite Routes

Nearby Ghats

Weather

Loyalty Status
```

---

# 4. Customer Sidebar

Current

```
Dashboard

My Bookings

Booking History

Wallet

Reviews

Profile
```

Future

```
Live Tracking

Favorite Routes

Offers

Support

Notifications

Settings

Documents
```

---

# 5. Customer Profile

Current

```
Name

Email

Phone

City

Address
```

Future

```
Photo

Gender

DOB

Emergency Contact

Language

Nationality

Government ID
```

---

# 6. Authentication

Customer Uses

```
Email

Password
```

Future

```
OTP Login

Google Login

Apple Login

Phone Login

Biometric Login
```

---

# 7. Search System

Current

```
City

↓

Ghats

↓

Routes

↓

Schedules
```

Future

```
Nearby Boats

Nearby Ghats

AI Search

Voice Search
```

---

# 8. Route Search

Customer Can Search

```
Source Ghat

↓

Destination Ghat

↓

Travel Date

↓

Passengers
```

System Returns

```
Available Boats

↓

Schedules

↓

Seats

↓

Fare
```

---

# 9. Boat Details

Displays

```
Boat Name

Boat Number

Boat Type

Capacity

Available Seats

Images

Fare

Duration
```

Future

```
Ratings

Facilities

Owner

Safety Score

Crew Details
```

---

# 10. Booking Process

```
Select Schedule

↓

Passenger Details

↓

Seat Selection

↓

Payment

↓

Booking Created

↓

QR Ticket
```

---

# 11. Ticket System

Customer Receives

```
Booking ID

Booking Code

QR Code

Trip Details

Passenger Details
```

Future

```
Download PDF

Apple Wallet

Google Wallet
```

---

# 12. My Bookings

Current

```
Upcoming

Completed

Cancelled
```

Future

```
Refunded

No Show

Pending Payment
```

---

# 13. Booking History

Displays

```
Date

Route

Boat

Fare

Status
```

Future

```
Invoices

Trip Photos

Review Status
```

---

# 14. Live Tracking 🚧

**Current Status:** Planned

Purpose

Allow customers to track their booked boat in real time.

Flow

```
Boat Starts

↓

GPS Location

↓

Server

↓

Customer Dashboard

↓

Live Map
```

Features

```
Current Position

Estimated Arrival

Speed

Remaining Distance

Trip Status
```

Future

```
Google Maps

Leaflet Maps

Offline Tracking

River Navigation
```

---

# 15. Ratings & Reviews 🚧

**Current Status:** Planned

Customer Can Rate

```
Boat

Crew

Captain

Driver

Overall Experience
```

Review Example

```
⭐⭐⭐⭐⭐

Boat was clean.

Captain was very helpful.
```

Future

```
Photo Reviews

Video Reviews

Verified Reviews

AI Review Moderation
```

---

# 16. Wallet 🚧

Current

Basic Structure Planned

Future

```
Wallet Balance

↓

Recharge

↓

Booking Payment

↓

Refund

↓

Cashback
```

Payment Sources

```
UPI

Cards

Net Banking

Wallet
```

---

# 17. Notifications

Customer Receives

```
Booking Confirmed

Payment Success

Trip Reminder

Boat Delayed

Trip Started

Trip Completed

Offers
```

Future

```
Push Notification

SMS

WhatsApp

Email
```

---

# 18. Favorite Routes

Future

Customer Can Save

```
Assi Ghat

↓

Dashashwamedh Ghat
```

One-click booking.

---

# 19. Favorite Boats

Future

```
Luxury Boat

↓

Favorite

↓

Quick Booking
```

---

# 20. Loyalty Program

Future

```
Every Booking

↓

Points Earned

↓

Redeem Rewards
```

Levels

```
Silver

Gold

Platinum

Diamond
```

---

# 21. Referral Program

Future

```
Invite Friend

↓

Friend Registers

↓

Reward

↓

Wallet Credit
```

---

# 22. Offers

Future

Examples

```
Festival Discount

Weekend Offer

Student Discount

Family Package

Corporate Package
```

---

# 23. Customer Support

Future

```
Live Chat

Support Tickets

Emergency Call

Complaint Portal
```

---

# 24. Complaint System

Customer Can Report

```
Boat Issue

Staff Behavior

Payment Issue

Refund Issue

Safety Issue
```

---

# 25. AI Assistant

Future

AI Can Help

```
Suggest Best Route

Best Boat

Best Time

Cheapest Fare

Fastest Journey
```

---

# 26. AI Recommendations

Based On

```
History

↓

Favorite Routes

↓

Previous Bookings

↓

Travel Pattern
```

---

# 27. Customer APIs

Current

```
POST

/auth/register
```

```
POST

/auth/login
```

```
GET

/bookings/my-bookings
```

Future

```
GET

/customer/dashboard
```

```
GET

/customer/live-tracking
```

```
POST

/reviews
```

```
GET

/offers
```

```
GET

/wallet
```

---

# 28. Frontend Structure

Current

```
customer

dashboard

bookings

history

wallet

reviews

profile
```

Future

```
liveTracking

notifications

offers

support

favorites

documents

settings
```

---

# 29. Current Development Status

✅ Login

✅ Registration

✅ Route Search

✅ Booking

✅ Ticket

✅ Booking History

🚧 Live Tracking

🚧 Reviews

🚧 Wallet

🚧 Notifications

🚧 Offers

🚧 Support

---

# 30. Security

✔ JWT Authentication

✔ Customer Isolation

✔ Payment Validation

✔ QR Ticket Validation

✔ Booking Ownership Validation

---

# 31. Development Roadmap

### Phase 1 ✅

- Authentication
- Booking
- Ticket
- Profile

---

### Phase 2 (Current)

- Customer Dashboard
- Booking History
- Route Search

---

### Phase 3

- Live Tracking
- Ratings & Reviews
- Wallet

---

### Phase 4

- Loyalty Program
- Offers
- Notifications
- Support

---

### Phase 5

- AI Travel Assistant
- Smart Recommendations
- Voice Booking
- Personalized Dashboard

---

# 32. Future Vision

The Customer Module is designed to become a **complete digital travel companion** for river transportation.

It will evolve from a simple booking interface into an intelligent platform offering:

- Real-time journey management
- Personalized recommendations
- Loyalty rewards
- AI assistance
- Seamless digital payments
- Enhanced passenger safety

---

# 33. Summary

The Customer Module provides the complete passenger experience, covering:

- Registration & Authentication
- Route Discovery
- Booking & Payments
- Digital Ticketing
- Trip Management
- Live Tracking (Planned)
- Reviews & Ratings (Planned)
- Wallet & Rewards (Planned)
- AI-powered Recommendations (Future)

This module focuses on delivering a fast, secure, and user-friendly journey while integrating seamlessly with the Booking Engine, Schedule Engine, Payment System, and Notification System.

---

# 📌 Next Document

➡ **14_Super_Admin_Module.md**

This document will describe the complete Super Admin system, including platform management, city management, owner approval, analytics, revenue monitoring, user administration, permissions, audit logs, and SaaS platform controls.

---
**End of 13_Customer_Module.md**