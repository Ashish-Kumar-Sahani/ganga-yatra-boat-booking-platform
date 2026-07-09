# 👨‍💻 23_Developer_Guidelines.md
## Complete Development Standards & Coding Guidelines
### GangaYatra Platform

> Version : 2.0.0  
> Module : Developer Guidelines  
> Audience : Developers, Contributors, Future Team Members

---

# 1. Purpose

This document defines the official development standards for the GangaYatra Platform.

Every contributor must follow these guidelines to ensure:

- Clean Architecture
- Scalable Code
- Maintainability
- Reusability
- Performance
- Security
- Consistency

---

# 2. Development Philosophy

The project follows the following principles:

```
Clean Code

↓

Modular Design

↓

Feature Based Structure

↓

Reusable Components

↓

Scalable Architecture

↓

Enterprise Standards
```

---

# 3. Project Architecture

The project follows a Feature-Driven Architecture.

```
Frontend

↓

Features

↓

Pages

↓

Components

↓

API

↓

Store

↓

Types
```

Backend

```
Modules

↓

Controller

↓

Service

↓

Model

↓

Routes

↓

Validation

↓

Utils
```

---

# 4. Technology Stack

## Frontend

```
React

Vite

TypeScript

TailwindCSS

React Router

Zustand

Axios
```

---

## Backend

```
Node.js

Express

TypeScript

MongoDB

Mongoose

JWT

Cloudinary

QRCode
```

---

## Future

```
Redis

BullMQ

Socket.IO

Docker

Kubernetes
```

---

# 5. Folder Structure Standards

## Frontend

```
src

features

auth

customer

owner

staff

admin

authority

shared

components

hooks

utils

types

assets
```

---

## Backend

```
src

modules

middlewares

utils

config

services

jobs

validators

types
```

---

# 6. Feature Structure

Every feature must follow this structure.

```
feature

api

components

pages

store

types
```

Example

```
bookings

api

components

pages

store

types
```

---

# 7. Component Rules

Each component must have a single responsibility.

Good

```
BookingCard
```

Bad

```
BookingCardWithPaymentAndAnalytics
```

---

# 8. Naming Convention

Components

```
PascalCase
```

Example

```
BoatCard.tsx

StaffTable.tsx

OwnerDashboard.tsx
```

---

Files

```
camelCase
```

Example

```
bookingApi.ts

staffStore.ts

ownerUtils.ts
```

---

Variables

```
camelCase
```

Example

```
boatList

customerBookings

paymentHistory
```

---

Constants

```
UPPER_CASE
```

Example

```
MAX_SEATS

API_TIMEOUT
```

---

# 9. API Naming

Good

```
getBookings()

createBooking()

deleteBoat()

updateSchedule()
```

Bad

```
fetchData()

save()

run()

go()
```

---

# 10. React Rules

Use Functional Components only.

```
✔ Hooks

✔ Functional Components

✖ Class Components
```

---

# 11. State Management

Use

```
Zustand
```

Avoid

```
Large Prop Drilling
```

Global State

```
Authentication

Theme

Notifications

Settings
```

Local State

```
Forms

Modals

Filters
```

---

# 12. Styling Rules

Only use

```
TailwindCSS
```

Avoid

```
Inline CSS

!important

Deep Nesting
```

---

# 13. TypeScript Rules

Never use

```
any
```

Instead

```
interface

type
```

Example

```
interface Boat {

id

name

capacity

}
```

---

# 14. Backend Rules

Controller

```
Only Request Handling
```

Service

```
Business Logic
```

Model

```
Database
```

Route

```
Endpoints
```

Utils

```
Reusable Functions
```

---

# 15. Database Rules

Use

```
Reference IDs

Indexes

Validation

Unique Keys
```

Never

```
Duplicate Data
```

---

# 16. Authentication Rules

Always

```
JWT

Role Middleware

Protect Routes
```

Never

```
Trust Frontend Roles
```

---

# 17. Error Handling

Every API should return

```
Success

Message

Data

Error
```

Example

```json
{
  "success": true,
  "message": "Booking Created",
  "data": {}
}
```

---

# 18. Logging

Use

```
console.log()

Development Only
```

Production

```
Logger Service
```

---

# 19. Git Workflow

```
main

↓

develop

↓

feature/*
```

Examples

```
feature/staff-module

feature/payment

feature/mobile-app
```

---

# 20. Commit Message Standards

Good

```
feat: add staff dashboard

fix: booking API issue

refactor: owner module

style: improve calendar UI

docs: update README
```

Bad

```
update

changes

fixed

done
```

---

# 21. Code Review Checklist

Before merging

```
✔ No TypeScript Errors

✔ No ESLint Errors

✔ API Tested

✔ UI Responsive

✔ Loading State

✔ Error State

✔ Empty State

✔ Authentication Checked
```

---

# 22. Performance Guidelines

Frontend

```
Lazy Loading

Memoization

Code Splitting

Image Optimization
```

Backend

```
Indexes

Pagination

Caching

Lean Queries
```

---

# 23. Security Guidelines

Always

```
Hash Passwords

JWT

Validate Inputs

Sanitize Data

Rate Limiter

HTTPS
```

Never

```
Store Plain Passwords

Expose Secrets

Trust Client Data
```

---

# 24. Environment Variables

Never commit

```
.env
```

Store

```
JWT_SECRET

MONGO_URI

RAZORPAY_SECRET

CLOUDINARY_SECRET
```

---

# 25. Testing Before Commit

Run

```
npm run lint

npm run build

npm run dev
```

Backend

```
API Testing

Thunder Client

Postman
```

---

# 26. Documentation Rules

Every module should include

```
Overview

Folder Structure

APIs

Database

Flow

Future Scope
```

---

# 27. Reusable Components

Create reusable components whenever possible.

Examples

```
DataTable

Modal

Loader

EmptyState

SearchBar

Pagination

StatusBadge

ConfirmationDialog
```

---

# 28. Common Utilities

```
Date Formatter

Currency Formatter

Owner Resolver

Pagination Helper

Validation Helper

Response Helper
```

---

# 29. Project Conventions

Always

```
Feature-Based Development

Role-Based Routing

Shared Components

Common API Layer

Strong Typing
```

---

# 30. Current Project Status

Completed

```
Architecture

Backend

Authentication

Booking

Owner Base

Staff Base
```

Current Work

```
Staff Module
```

Pending

```
Customer

Super Admin

Authority

Mobile App

Deployment

AI
```

---

# 31. Long-Term Coding Goals

The project should remain:

- Modular
- Maintainable
- Enterprise Ready
- Easily Extendable
- Team Friendly
- Well Documented

Every new feature must follow the same architecture without breaking existing modules.

---

# 32. Summary

These guidelines establish the coding standards for the GangaYatra Platform.

They ensure:

- Consistent folder structure
- Clean architecture
- Type-safe development
- Secure backend practices
- Reusable frontend components
- Scalable module design
- High code quality
- Easier collaboration

Following these rules will keep the project maintainable as it grows from a single-developer project into a large-scale enterprise platform.

---

# 📌 Next Document

➡ **24_Future_Enhancements.md**

This final document will outline the long-term vision of the platform, including AI-powered features, IoT integration, smart analytics, drone monitoring, autonomous boats, predictive maintenance, SaaS expansion, and nationwide deployment strategy.

---

**End of 23_Developer_Guidelines.md**