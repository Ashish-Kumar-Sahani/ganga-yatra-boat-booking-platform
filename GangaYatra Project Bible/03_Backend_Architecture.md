# ⚙️ 03_Backend_Architecture.md
## Complete Backend Architecture
### GangaYatra Platform

> Version: 2.0.0  
> Status: Active Development  
> Backend Stack: Node.js + Express + TypeScript + MongoDB

---

# 1. Introduction

The backend is the core engine of the GangaYatra Platform.

It is responsible for:

- Authentication
- Authorization
- Business Logic
- Database Management
- QR Ticket Generation
- Booking Engine
- Staff Management
- Owner Management
- Reports
- Notifications
- Future AI Integration

The project follows a **Modular Monolith Architecture**, making it easy to convert into Microservices in the future.

---

# 2. Technology Stack

## Runtime

Node.js

---

## Language

TypeScript

---

## Framework

Express.js

---

## Database

MongoDB

Mongoose ODM

---

## Authentication

JWT

bcrypt

OTP

---

## File Upload

Multer

Cloudinary

---

## Utilities

QRCode

dotenv

cors

helmet (planned)

compression (planned)

express-rate-limit (planned)

---

# 3. Backend Folder Structure

```
Backend/

src/

config/

middlewares/

modules/

jobs/

utils/

types/

server.ts
```

---

# 4. Config Folder

```
config/

db.ts

cloudinary.ts

razorpay.ts

socket.ts

env.ts
```

Purpose

Centralized configuration.

Examples

MongoDB

Cloudinary

JWT Secret

Payment Keys

Socket.io

---

# 5. Middlewares

```
middlewares/

auth.middleware.ts

role.middleware.ts

city.middleware.ts

permit.middleware.ts

upload.middleware.ts

error.middleware.ts
```

Responsibilities

Authentication

Authorization

Validation

Error Handling

Upload Processing

---

## Authentication Middleware

Responsibilities

Read JWT

Verify Token

Fetch User

Attach User

```
req.user
```

Used in every protected API.

---

## Role Middleware

Controls permissions.

Example

```
allowRoles(

"SUPER_ADMIN",

"BOAT_OWNER"

)
```

Only allowed roles can access APIs.

---

## Upload Middleware

Processes

Boat Images

Documents

Certificates

Future

Videos

---

## Permit Middleware

Ensures

Boat permit

is valid before

creating schedule.

---

# 6. Utility Folder

```
utils/

getOwnerId.ts

generateBookingCode.ts

dateHelpers.ts

validators.ts
```

Purpose

Reusable logic.

Should NEVER contain database business logic.

---

Example

```
getOwnerId()

generateQRCode()

moneyFormatter()

dateFormatter()
```

---

# 7. Jobs Folder

Future Background Tasks

```
jobs/

weather.job.ts

notification.job.ts

permitExpiry.job.ts
```

Examples

Weather updates

Permit expiry

Daily reports

Scheduled notifications

---

# 8. Modules Folder

Every feature is isolated.

```
modules/

auth/

users/

boats/

cities/

ghats/

routes/

schedules/

slots/

bookings/

payments/

tickets/

notifications/

wallet/

reports/

analytics/

reviews/

staff/
```

Each module contains

```
model

controller

routes

(optional)

service

validation
```

---

# 9. Current Modules

## Auth

Responsible for

Register

Login

Forgot Password

OTP

Reset Password

JWT

---

## Users

Stores

Customers

Owners

Managers

Drivers

Helpers

Captains

Authorities

Admins

---

## Boats

Stores

Boat Details

Capacity

Permit

Status

Images

Owner

---

## Routes

Stores

Source Ghat

Destination Ghat

Distance

Fare

---

## Schedule

Stores

Boat

Time

Seat Distribution

Schedule Type

---

## Slots

Stores

Actual seat availability

Online

Offline

Emergency

---

## Booking

Stores

Passenger

Payment

QR

Seat Count

Status

---

## Payments

Stores

Payment status

Future

UPI

Wallet

Refund

---

## Staff

Stores

Owner Staff

Assigned Boat

Role

Status

Attendance (future)

---

# 10. Request Lifecycle

Example

Customer Booking

```
Client

↓

Axios

↓

Express Route

↓

Auth Middleware

↓

Role Middleware

↓

Controller

↓

Business Logic

↓

MongoDB

↓

Response

↓

Frontend
```

---

# 11. Controller Responsibilities

Controllers should only

Receive Request

Validate

Call Business Logic

Return Response

Avoid writing large business logic directly inside controllers.

Future

Move logic to

```
services/
```

---

# 12. Models

Every module owns its model.

Example

Boat

Schedule

Booking

Slot

User

Payment

Review

Never access MongoDB directly from frontend.

---

# 13. Route Design

REST API Standard

Example

```
GET

POST

PUT

PATCH

DELETE
```

Example

```
GET

/api/boats
```

```
POST

/api/bookings
```

```
PUT

/api/routes/:id
```

---

# 14. Error Response Format

Recommended

```json
{
    "success": false,
    "message": "Boat not found"
}
```

Success

```json
{
    "success": true,
    "data": { }
}
```

Maintain one response format across all modules.

---

# 15. Current Authentication Flow

```
Login

↓

JWT

↓

Frontend Storage

↓

Authorization Header

↓

Backend Middleware

↓

Controller
```

---

# 16. Role Hierarchy

```
SUPER_ADMIN

↓

CITY_AUTHORITY

↓

BOAT_OWNER

↓

MANAGER

↓

DRIVER

↓

CAPTAIN

↓

HELPER

↓

CUSTOMER
```

---

# 17. Owner Mapping

Every staff belongs to one owner.

```
User

↓

ownerId

↓

Boat Owner
```

Example

```
Owner

↓

Driver

↓

Assigned Boat

↓

Today's Schedule
```

---

# 18. Database Access Rules

Controller

↓

Model

↓

MongoDB

Never

Frontend

↓

MongoDB

---

# 19. Logging

Current

console.log()

Future

Use

```
Winston

Morgan

Pino
```

Store logs

Daily

Weekly

Error

Security

---

# 20. Validation Strategy

Current

Controller validation.

Future

Move to

```
Zod

or

Joi
```

Each API should validate

Request

Response

DTO

---

# 21. Future Service Layer

Current

```
Controller

↓

Model
```

Future

```
Controller

↓

Service

↓

Repository

↓

Model
```

Cleaner architecture.

---

# 22. Future Repository Layer

```
Controller

↓

Service

↓

Repository

↓

Database
```

Useful when migrating to SQL or Microservices.

---

# 23. Security Checklist

Implemented

✅ JWT

✅ Password Hashing

✅ Role Middleware

Planned

⬜ Helmet

⬜ Rate Limiter

⬜ CSRF

⬜ Refresh Tokens

⬜ Device Sessions

⬜ Audit Logs

⬜ API Monitoring

---

# 24. Performance Improvements

Future

Redis Cache

Aggregation Pipelines

Indexes

Lazy Population

Pagination

Background Jobs

Queue System

---

# 25. Coding Standards

Use async/await.

Use TypeScript interfaces.

Avoid duplicate logic.

Create reusable utilities.

Keep controllers small.

Use proper HTTP status codes.

Always validate request data.

Never expose sensitive fields like passwords.

---

# 26. Current Backend Progress

## ✅ Completed

- Authentication
- JWT Middleware
- User Module
- Boats Module
- Cities Module
- Ghats Module
- Routes Module
- Booking Engine
- Slot Engine
- QR Ticket Generation
- Staff Module (basic)
- Owner Mapping

## 🚧 In Progress

- Staff Permissions
- Schedule Improvements
- Calendar APIs
- Reports
- Notifications

## ⏳ Planned

- Wallet
- AI Engine
- Live Tracking
- Mobile APIs
- Audit Logs
- Subscription System
- Dynamic Pricing

---

# 27. Backend Design Goals

The backend is designed to be:

- Modular
- Scalable
- Secure
- Maintainable
- Testable
- Microservice-ready
- Enterprise-grade

Every new feature should follow the same architecture to keep the codebase consistent and easy to maintain.

---

# 📌 Next Document

➡ **04_Frontend_Architecture.md**

The next document covers the complete frontend architecture, feature-based folder structure, layouts, routing, state management, reusable components, API integration strategy, and UI development guidelines.

---
**End of 03_Backend_Architecture.md**