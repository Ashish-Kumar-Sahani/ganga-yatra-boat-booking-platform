# 🎨 04_Frontend_Architecture.md
## Complete Frontend Architecture
### GangaYatra Platform

> Version : 2.0.0
> Frontend Stack : React + TypeScript + Vite + TailwindCSS
> Status : Active Development

---

# 1. Introduction

The frontend follows a **Feature-Based Enterprise Architecture**.

Instead of grouping files by type (pages, components, api...), every business feature is isolated into its own module.

This architecture makes the project:

- Scalable
- Easy to maintain
- Easy for teams
- Easy to test
- Future proof

---

# 2. Technology Stack

Framework

React 19

Language

TypeScript

Bundler

Vite

Styling

TailwindCSS

Routing

React Router DOM

HTTP Client

Axios

State Management

Zustand

Charts

Recharts

Icons

Lucide React

Forms

React Hook Form (Future)

Validation

Zod (Future)

---

# 3. Current Frontend Folder Structure

```

src

api

assets

components

features

hooks

layouts

routes

store

types

utils

App.tsx

main.tsx

```

---

# 4. Feature Based Architecture

Each feature is completely independent.

```

feature

↓

api

↓

components

↓

pages

↓

store

↓

types

```

Example

```

boats

api

components

pages

store

types

```

Everything related to boats remains inside the boats folder.

No unrelated files should be placed outside.

---

# 5. Current Features

```

features

auth

customer

owner

staff

admin

authority

public

```

---

# 6. Authentication Module

```

auth

api

loginApi.ts

registerApi.ts

components

LoginForm.tsx

pages

Login.tsx

Register.tsx

ForgotPassword.tsx

VerifyOTP.tsx

ResetPassword.tsx

store

authStore.ts

types

auth.types.ts

```

Responsibilities

- Login
- Logout
- Register
- JWT
- Forgot Password
- OTP

---

# 7. Public Module

Contains all pages that do not require login.

```

public

home

cities

ghats

boatDetails

searchRoute

searchResults

booking

payment

ticket

```

---

# 8. Customer Module

```

customer

dashboard

bookings

wallet

tracking

reviews

profile

notifications

```

Future

- Live Tracking
- AI Suggestions
- Rewards
- Loyalty

---

# 9. Owner Module

```

owner

dashboard

boats

routes

schedules

slots

bookings

earnings

reports

calendar

staff

permits

notifications

```

Owner controls the business.

---

# 10. Staff Module

Current Structure

```

staff

attendance

boats

bookings

calendar

customers

dashboard

liveTracking

notifications

payments

reports

settings

team

layout

```

Future

```

attendance

boats

bookings

calendar

checkin

tickets

profile

settings

```

---

# 11. Super Admin Module

Not started yet.

Planned structure

```

admin

dashboard

owners

boats

cities

ghats

routes

staff

users

analytics

settings

reports

subscriptions

```

---

# 12. Authority Module

Future

```

authority

dashboard

permits

boats

routes

inspection

violations

reports

```

---

# 13. Feature Structure Standard

Every feature must follow

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

boats

api

boatApi.ts

components

BoatCard.tsx

BoatTable.tsx

BoatStats.tsx

pages

Boats.tsx

store

boatStore.ts

types

boat.types.ts

```

---

# 14. Components Folder

Contains reusable UI.

```

components

layout

common

cards

charts

tables

modals

buttons

forms

```

Should never contain business logic.

---

# 15. Layout System

Current

```

OwnerLayout

CustomerLayout

StaffLayout

AdminLayout

```

Every layout includes

Sidebar

Navbar

Outlet

Footer

---

# 16. Routing Architecture

```

Public Routes

↓

Protected Route

↓

Role Route

↓

Feature Pages

```

Example

```

/

↓

login

↓

dashboard

↓

boats

↓

bookings

```

---

# 17. Route Protection

```

User

↓

JWT

↓

Auth Store

↓

ProtectedRoute

↓

RoleRoute

↓

Page

```

---

# 18. State Management

Current

Zustand

Stores

```

authStore

boatStore

bookingStore

calendarStore

reportStore

```

Future

```

notificationStore

walletStore

trackingStore

settingsStore

```

---

# 19. API Layer

Every feature owns its own API.

Example

```

boats

boatApi.ts

```

Never call axios directly inside pages.

Correct

```

Page

↓

API

↓

Axios

↓

Backend

```

---

# 20. Types

Every feature owns its own types.

Example

```

boat.types.ts

booking.types.ts

calendar.types.ts

```

Avoid

```

any
```

Use interfaces everywhere.

---

# 21. UI Principles

Reusable

Responsive

Dark Mode Ready

Minimal

Professional

Consistent

---

# 22. Design System

Colors

Primary

Blue

Secondary

Orange

Success

Green

Danger

Red

Warning

Amber

Neutral

Slate

---

# 23. Component Categories

Cards

Tables

Charts

Forms

Dialogs

Buttons

Statistics

Timeline

Calendar

Maps

---

# 24. Naming Convention

Pages

```

Dashboard.tsx

```

Components

```

BoatCard.tsx

```

API

```

boatApi.ts

```

Store

```

boatStore.ts

```

Types

```

boat.types.ts

```

---

# 25. Current Development Status

## Public

✅ Home

✅ Login

✅ Register

✅ Search Route

---

## Customer

🚧 Dashboard

🚧 Wallet

🚧 Reviews

🚧 Live Tracking

---

## Owner

✅ Dashboard

✅ Boats

✅ Bookings

🚧 Staff

🚧 Calendar

🚧 Reports

---

## Staff

🚧 Dashboard

🚧 Boats

🚧 Calendar

🚧 Bookings

🚧 Attendance

---

## Admin

⏳ Not Started

---

## Authority

⏳ Not Started

---

## Mobile

⏳ Not Started

---

# 26. Performance Strategy

Lazy Loading

React.memo

Code Splitting

Dynamic Imports

Image Optimization

Virtualized Tables (Future)

---

# 27. Future UI Improvements

- Dark Mode
- RTL Support
- Theme Engine
- Offline Support
- PWA
- Mobile Responsive Dashboard
- Multi-language
- Accessibility (WCAG)
- Skeleton Loading
- Infinite Scroll
- Global Search
- Command Palette

---

# 28. Development Guidelines

- Keep pages thin.
- Business logic belongs in API/store.
- Components should be reusable.
- Use feature folders only.
- Avoid duplicated UI.
- Keep imports absolute using `@/`.
- Prefer interfaces over `any`.
- Maintain consistent naming conventions.
- Follow responsive-first design.

---

# 📌 Next Document

➡ **05_Database_Design.md**

This document will cover the complete MongoDB schema, all collections, relationships, indexes, ObjectId references, normalization strategy, and future database expansion plan.

---
**End of 04_Frontend_Architecture.md**