# 🏗️ 02_System_Architecture.md
## Complete System Architecture
### GangaYatra Platform

> Version: 2.0.0  
> Status: Active Development  
> Architecture Type: Enterprise Scalable Modular Monolith (Future Microservices Ready)

---

# 1. Architecture Overview

The GangaYatra Platform follows a modern layered architecture designed for scalability, maintainability, and future migration to microservices.

```
                   Internet
                       │
             React / Mobile App
                       │
                REST API (HTTPS)
                       │
                Express Backend
                       │
      ┌─────────────────────────────────┐
      │                                 │
 Authentication              Business Modules
      │                                 │
      └─────────────────────────────────┘
                       │
                 MongoDB Database
                       │
        Cloudinary / QR / Payment APIs
```

---

# 2. High Level Architecture

```
                   CLIENT LAYER
──────────────────────────────────────────────

React Web
React Native
Admin Panel
Owner Panel
Staff Panel

──────────────────────────────────────────────

                API LAYER

Express.js
JWT Authentication
Role Middleware
Validation
Error Handling

──────────────────────────────────────────────

             BUSINESS LAYER

Authentication

Users

Cities

Ghats

Routes

Boats

Schedules

Slots

Bookings

Payments

Notifications

Reports

Reviews

Wallet

Analytics

──────────────────────────────────────────────

             DATABASE LAYER

MongoDB

──────────────────────────────────────────────

         THIRD PARTY SERVICES

Cloudinary

QR Generator

Payment Gateway

SMS

Email

Push Notifications
```

---

# 3. System Layers

The project is divided into independent layers.

---

## Presentation Layer

Responsible for UI.

Contains

```
React

TailwindCSS

Components

Pages

Layouts

Hooks

Store
```

Responsibilities

- UI
- Forms
- Tables
- Charts
- Navigation
- State Management

---

## API Layer

Responsible for communication.

```
Axios

REST APIs

JWT Headers

Request Handling
```

Responsibilities

- Send requests
- Receive responses
- Token management

---

## Business Layer

Contains all business logic.

Examples

```
Booking Logic

Payment Logic

Seat Allocation

Owner Validation

Permission Validation

Revenue Calculation
```

---

## Data Layer

MongoDB Collections

```
Users

Cities

Ghats

Routes

Boats

Schedules

Slots

Bookings

Payments

Notifications

Reviews

Reports
```

---

# 4. Frontend Architecture

Current structure

```
src

components

features

layouts

pages

hooks

store

types

api

utils

assets
```

Feature-based architecture is used.

Each feature contains

```
api/

components/

pages/

store/

types/
```

Example

```
owner

boats

staff

dashboard

reports

earnings
```

Example

```
customer

dashboard

wallet

booking

review

tracking
```

Example

```
staff

dashboard

boats

calendar

bookings

attendance

notifications
```

---

# 5. Backend Architecture

Backend follows Modular Architecture.

```
src

config

middlewares

modules

utils

jobs

server.ts
```

Modules

```
auth

users

boats

cities

ghats

routes

schedules

slots

bookings

payments

tickets

notifications

reports

wallet

analytics

offers
```

Every module contains

```
model

controller

routes

(optional)

service

validation
```

---

# 6. Request Flow

Example

Customer books ticket

```
React

↓

Axios

↓

Express Route

↓

Middleware

↓

JWT Validation

↓

Role Validation

↓

Controller

↓

Business Logic

↓

MongoDB

↓

Controller

↓

Response

↓

React

↓

UI Update
```

---

# 7. Authentication Flow

```
Login

↓

Verify Password

↓

Generate JWT

↓

Store Token

↓

Frontend

↓

Protected API

↓

JWT Middleware

↓

Role Middleware

↓

Controller
```

---

# 8. Authorization Flow

```
User

↓

JWT

↓

Role

↓

Permission

↓

Controller
```

Example

Owner cannot access

```
Super Admin APIs
```

Customer cannot access

```
Owner APIs
```

Staff can only access

```
Assigned resources
```

---

# 9. Current User Hierarchy

```
SUPER_ADMIN

│

├── CITY_AUTHORITY

│

├── BOAT_OWNER

│      │

│      ├── MANAGER

│      │

│      ├── DRIVER

│      │

│      ├── CAPTAIN

│      │

│      └── HELPER

│

└── CUSTOMER
```

---

# 10. Owner Hierarchy

```
Boat Owner

↓

Boats

↓

Schedules

↓

Slots

↓

Bookings

↓

Revenue

↓

Reports
```

---

# 11. Staff Hierarchy

```
Boat Owner

↓

Staff

↓

Assigned Boat

↓

Assigned Schedule

↓

Passenger List

↓

Trip

↓

Completion
```

Every staff member belongs to one owner.

```
ownerId
```

Staff can optionally be assigned to

```
assignedBoatId
```

---

# 12. Booking Architecture

```
Customer

↓

Route

↓

Schedule

↓

Slot

↓

Booking

↓

Payment

↓

QR Ticket

↓

Check-In

↓

Completed
```

---

# 13. Schedule Architecture

```
Boat

↓

Schedule

↓

Slot

↓

Online Seats

↓

Offline Seats

↓

Emergency Seats
```

---

# 14. Database Relationship

```
Owner

↓

Boat

↓

Schedule

↓

Slot

↓

Booking

↓

Payment
```

---

More detailed

```
City

↓

Ghats

↓

Routes

↓

Schedules

↓

Slots

↓

Bookings
```

---

# 15. Staff Relationship

```
Owner

↓

Staff

↓

Assigned Boat

↓

Schedules

↓

Trips
```

---

# 16. Calendar Architecture

Owner creates

```
Boat

↓

Schedule

↓

Date

↓

Time

↓

Seats
```

Staff automatically sees

```
Today's Trips

↓

Upcoming Trips

↓

Assigned Boats
```

---

# 17. Payment Architecture

```
Booking

↓

Payment

↓

Success

↓

Ticket

↓

Notification
```

Future

```
Razorpay

UPI

Wallet

Refund
```

---

# 18. Notification Architecture

```
Booking Created

↓

Notification Service

↓

Database

↓

Push

↓

Email

↓

SMS
```

---

# 19. QR Verification Flow

```
Booking

↓

QR Generated

↓

Passenger

↓

Staff Scanner

↓

Verification

↓

Check In

↓

Trip Starts
```

---

# 20. Live Tracking Flow (Future)

```
GPS Device

↓

Boat

↓

Backend

↓

Socket.IO

↓

Customer

↓

Live Map
```

---

# 21. AI Layer (Future)

```
Bookings

↓

Analytics

↓

AI Engine

↓

Prediction

↓

Recommendations
```

Possible AI modules:

- Demand Prediction
- Dynamic Pricing
- Route Optimization
- Boat Utilization
- Fraud Detection
- Smart Notifications

---

# 22. Security Architecture

Security layers:

```
HTTPS

↓

JWT

↓

Role Middleware

↓

Owner Validation

↓

Input Validation

↓

Rate Limiter

↓

MongoDB
```

Additional protections planned:

- Refresh Tokens
- Device Session Tracking
- Audit Logs
- API Request Logging
- Two-Factor Authentication (2FA)

---

# 23. Deployment Architecture

Current (Development)

```
Frontend (Vite)

↓

localhost:5173

↓

Backend

↓

localhost:7000

↓

MongoDB Atlas
```

Production (Planned)

```
Cloudflare

↓

Frontend (Vercel)

↓

Backend (Render / Railway / VPS)

↓

MongoDB Atlas

↓

Cloudinary

↓

Payment Gateway

↓

Monitoring
```

---

# 24. Scalability Strategy

Current architecture is a **Modular Monolith**.

Future migration path:

```
Monolith

↓

Service Separation

↓

Microservices

↓

API Gateway

↓

Event Bus

↓

Independent Scaling
```

Candidate microservices:

- Authentication Service
- Booking Service
- Payment Service
- Notification Service
- Analytics Service
- AI Service
- Live Tracking Service

---

# 25. Current Development Status

### Completed ✅

- Authentication
- Users
- Boats
- Routes
- Cities
- Ghats
- Booking Engine
- Slot Engine
- Owner Dashboard
- Staff Dashboard (in progress)
- Role-based Authentication

### In Progress 🚧

- Staff Calendar
- Staff Bookings
- Attendance
- Reports
- Notifications
- Live Tracking

### Not Started ⏳

- Super Admin Module
- City Authority Module
- Mobile Application
- AI Features
- Wallet
- Ratings & Reviews
- Advanced Analytics

---

# 26. Design Principles

The architecture follows these principles:

- Feature-based frontend organization
- Modular backend structure
- Separation of concerns
- Reusable UI components
- Role-based access control
- API-first development
- Scalable data model
- Future-ready microservice compatibility

---

# 📌 Next Document

➡ **03_Backend_Architecture.md**

This document will explain the backend in depth, including folder structure, middleware flow, request lifecycle, module responsibilities, utilities, background jobs, configuration files, coding standards, and best practices for maintaining the backend.

---
**End of 02_System_Architecture.md**