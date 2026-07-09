# 🔐 07_Authentication_System.md
## Complete Authentication & Authorization Architecture
### GangaYatra Platform

> Version : 2.0.0  
> Authentication : JWT + Role Based Access Control (RBAC)  
> Backend : Express + TypeScript + MongoDB  
> Current Status : Active Development

---

# 1. Overview

Authentication is one of the core pillars of the GangaYatra Platform.

Every protected action in the application is secured using:

- JWT Authentication
- Role-Based Authorization
- Owner Hierarchy
- Staff Hierarchy
- Permission Middleware
- Future Refresh Token Support

The authentication system is designed to support thousands of boat owners, staff members, customers, city authorities, and administrators while maintaining security and scalability.

---

# 2. Authentication Flow

```
                Register
                    │
                    ▼
            User Stored in MongoDB
                    │
                    ▼
              Login Request
                    │
                    ▼
        Email + Password Verification
                    │
         Password Hash Compare
                    │
                    ▼
            JWT Token Generated
                    │
                    ▼
        Token Returned to Frontend
                    │
                    ▼
      LocalStorage / Zustand Store
                    │
                    ▼
 Authorization Header (Bearer Token)
                    │
                    ▼
             Protected API Access
```

---

# 3. User Roles

Current System Roles

```
SUPER_ADMIN

CITY_AUTHORITY

BOAT_OWNER

MANAGER

DRIVER

CAPTAIN

HELPER

CUSTOMER
```

---

# 4. User Model

Current Structure

```ts
User

_id

name

email

phone

password

role

ownerId

cityId

isActive

resetOtp

resetOtpExpire

resetOtpVerified

createdAt

updatedAt
```

---

# 5. Owner Relationship

Customer

```
ownerId = null
```

Boat Owner

```
ownerId = null
```

Manager

```
ownerId = BoatOwnerId
```

Driver

```
ownerId = BoatOwnerId
```

Captain

```
ownerId = BoatOwnerId
```

Helper

```
ownerId = BoatOwnerId
```

This relationship allows every staff member to automatically inherit the owner's resources.

---

# 6. JWT Structure

Current Payload

```json
{
   "id":"USER_ID",
   "role":"MANAGER"
}
```

Future Payload

```json
{
   "id":"USER_ID",
   "role":"DRIVER",
   "ownerId":"OWNER_ID",
   "permissions":[]
}
```

---

# 7. Login Process

Step 1

```
POST

/api/auth/login
```

↓

Step 2

Find User

```
User.findOne()
```

↓

Step 3

Password Compare

```
bcrypt.compare()
```

↓

Step 4

JWT Generate

```
jwt.sign()
```

↓

Step 5

Return

```
token

user
```

↓

Step 6

Store

```
LocalStorage

Zustand
```

↓

Step 7

Redirect Dashboard

---

# 8. Dashboard Redirection

Current Logic

```
SUPER_ADMIN

↓

/admin/dashboard
```

```
BOAT_OWNER

↓

/owner/dashboard
```

```
MANAGER

↓

/staff/dashboard
```

```
DRIVER

↓

/staff/dashboard
```

```
CAPTAIN

↓

/staff/dashboard
```

```
HELPER

↓

/staff/dashboard
```

```
CUSTOMER

↓

/customer/dashboard
```

```
CITY_AUTHORITY

↓

/authority/dashboard
```

---

# 9. Protect Middleware

Every secured API uses

```
protect
```

Flow

```
Authorization Header

↓

Bearer Token

↓

JWT Verify

↓

User Find

↓

Attach req.user

↓

next()
```

---

# 10. Authorization Middleware

```
allowRoles()
```

Example

```ts
allowRoles(
"BOAT_OWNER",
"MANAGER"
)
```

Only these roles can access the route.

---

# 11. Owner Resolution

Staff never owns boats.

Instead

```
Driver

↓

Owner

↓

Owner Boats

↓

Owner Schedules

↓

Owner Bookings
```

Utility

```
getOwnerId()

```

Logic

```
Owner Login

↓

return owner._id
```

Staff Login

↓

```
return user.ownerId
```

---

# 12. Staff Authentication

Current Architecture

```
Owner

↓

Creates Staff

↓

Staff Stored

↓

Login

↓

Owner Resources Loaded
```

Manager

```
Can Access

Bookings

Schedules

Calendar

Boats

Reports

Notifications

Attendance
```

Driver

```
Can Access

Trips

Today's Schedule

Passengers

QR Scanner

Live Tracking
```

Captain

```
Trips

Passengers

Boat Status

Live Tracking
```

Helper

```
Passenger List

Check-in

Boat Assistance
```

---

# 13. Forgot Password Flow

```
Forgot Password

↓

OTP Generated

↓

Save

resetOtp

resetOtpExpire

↓

Send OTP

↓

Verify OTP

↓

resetOtpVerified = true

↓

Reset Password

↓

Hash Password

↓

Save

↓

Clear OTP
```

---

# 14. Password Security

Passwords are never stored in plain text.

```
bcrypt.hash()
```

Current

```
Salt

10 Rounds
```

Future

```
12 Rounds
```

---

# 15. Session Lifecycle

```
Login

↓

JWT Generated

↓

Frontend Stores Token

↓

Every Request

↓

Bearer Token

↓

Middleware

↓

Authorized
```

Logout

↓

```
LocalStorage Clear

Zustand Clear

Redirect Login
```

---

# 16. Frontend Authentication

Current Store

```
authStore

user

token

isAuthenticated
```

Functions

```
login()

logout()

updateUser()
```

---

# 17. Route Protection

Public Pages

```
/

Login

Register

Forgot Password

Search Route

Cities

Ghats
```

Protected Pages

```
Owner

Staff

Customer

Admin

Authority
```

Unauthorized users are redirected to

```
/login
```

---

# 18. Authentication APIs

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

/auth/me
```

```
POST

/auth/forgot-password
```

```
POST

/auth/verify-otp
```

```
POST

/auth/reset-password
```

---

# 19. Current Folder Structure

Backend

```
middlewares/

auth.middleware.ts

role.middleware.ts
```

```
utils/

getOwnerId.ts
```

Frontend

```
features/auth

api

store

pages

components
```

---

# 20. Current Security Features

✅ JWT Authentication

✅ Role Middleware

✅ Password Hashing

✅ Owner Hierarchy

✅ Protected APIs

✅ OTP Reset Password

---

# 21. Planned Security Enhancements

Refresh Tokens

```
Access Token

15 Minutes
```

```
Refresh Token

7 Days
```

---

Device Login History

```
Windows

Android

iPhone

Tablet
```

---

Email Verification

```
Register

↓

Email Link

↓

Verify

↓

Login Enabled
```

---

Two Factor Authentication

```
Password

↓

OTP

↓

Dashboard
```

---

Login Attempt Protection

```
5 Wrong Passwords

↓

Temporary Lock

↓

Retry Later
```

---

IP Tracking

```
Login IP

Location

Browser

OS
```

---

Token Blacklisting

```
Logout

↓

Blacklist Token

↓

Reject Future Requests
```

---

Audit Logs

```
Login

Logout

Password Change

Role Change

Permission Change
```

---

# 22. Authentication Roadmap

### Phase 1 ✅

- JWT Login
- Register
- Forgot Password
- Role Middleware

---

### Phase 2 (Current)

- Staff Authentication
- Owner Resolution
- Staff Dashboard
- Permission System

---

### Phase 3

- Refresh Tokens
- Email Verification
- Device Sessions

---

### Phase 4

- Google Login
- Microsoft Login
- Aadhaar Verification
- DigiLocker Integration

---

### Phase 5

- Face Recognition Login
- QR Staff Login
- Offline Authentication
- Biometric Login (Mobile)

---

# 23. Authentication Best Practices

✔ Never expose passwords

✔ Always hash passwords

✔ Use HTTPS in production

✔ Short-lived access tokens

✔ Validate every protected request

✔ Never trust frontend roles

✔ Always resolve owner on backend

✔ Use centralized permission middleware

✔ Log authentication events

✔ Rotate secrets periodically

---

# 24. Summary

The authentication system is designed to support:

- Customers booking boats securely
- Boat Owners managing fleets
- Staff inheriting owner resources
- Super Admin controlling the platform
- City Authorities monitoring compliance

It provides a scalable foundation for future enterprise-level security enhancements while keeping the current implementation clean, maintainable, and extensible.

---

# 📌 Next Document

➡ **08_Roles_and_Permissions.md**

This document will define the complete Role-Based Access Control (RBAC) system, including permission matrices for every module, role hierarchy, menu visibility, API authorization, feature access levels, and future granular permission architecture.

---
**End of 07_Authentication_System.md**