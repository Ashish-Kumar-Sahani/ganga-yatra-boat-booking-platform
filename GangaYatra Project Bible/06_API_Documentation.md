# 🌐 06_API_Documentation.md
## Complete REST API Documentation
### GangaYatra Platform

> Version : 2.0.0  
> API Style : RESTful API  
> Backend : Express + TypeScript  
> Authentication : JWT Bearer Token  
> Base URL (Development) : `http://localhost:7000/api`

---

# 1. Introduction

This document contains complete documentation for every API used by the GangaYatra Platform.

Every module follows REST standards.

```
GET

POST

PUT

PATCH

DELETE
```

Authentication is JWT based.

Every protected API requires

```
Authorization

Bearer <JWT_TOKEN>
```

---

# 2. Response Standard

## Success Response

```json
{
    "success": true,
    "message": "Boat created successfully",
    "data": {}
}
```

---

## Error Response

```json
{
    "success": false,
    "message": "Boat not found"
}
```

---

# 3. Authentication APIs

Base URL

```
/api/auth
```

---

## Register

```
POST

/auth/register
```

Body

```json
{
    "name":"Ashish Kumar",
    "email":"abc@gmail.com",
    "phone":"9876543210",
    "password":"12345678",
    "role":"CUSTOMER"
}
```

Permission

```
Public
```

---

## Login

```
POST

/auth/login
```

Body

```json
{
    "email":"abc@gmail.com",
    "password":"12345678"
}
```

Response

```json
{
    "token":"",
    "user":{}
}
```

---

## My Profile

```
GET

/auth/me
```

Permission

```
All Logged Users
```

---

## Forgot Password

```
POST

/auth/forgot-password
```

---

## Verify OTP

```
POST

/auth/verify-otp
```

---

## Reset Password

```
POST

/auth/reset-password
```

---

# 4. Users APIs

Base

```
/api/users
```

---

## Get Users

```
GET

/users
```

Permission

```
SUPER_ADMIN
```

---

## Get User

```
GET

/users/:id
```

---

## Update User

```
PUT

/users/:id
```

---

## Delete User

```
DELETE

/users/:id
```

---

# 5. City APIs

Base

```
/api/cities
```

---

## Get Cities

```
GET

/cities
```

---

## Create City

```
POST

/cities
```

Permission

```
SUPER_ADMIN
```

---

## Update City

```
PUT

/cities/:id
```

---

## Delete City

```
DELETE

/cities/:id
```

---

# 6. Ghat APIs

Base

```
/api/ghats
```

---

## Get Ghats

```
GET

/ghats
```

---

## Get Ghats by City

```
GET

/ghats/city/:cityId
```

---

## Create Ghat

```
POST

/ghats
```

---

## Update Ghat

```
PUT

/ghats/:id
```

---

## Delete Ghat

```
DELETE

/ghats/:id
```

---

# 7. Route APIs

Base

```
/api/routes
```

---

## Get Routes

```
GET

/routes
```

---

## Search Routes

```
GET

/routes/search
```

Query

```
source

destination

date
```

---

## Create Route

```
POST

/routes
```

---

## Update Route

```
PUT

/routes/:id
```

---

## Delete Route

```
DELETE

/routes/:id
```

---

# 8. Boat APIs

Base

```
/api/boats
```

---

## Get Boats

```
GET

/boats
```

---

## Get My Boats

```
GET

/boats/my
```

Permission

```
BOAT_OWNER

MANAGER
```

---

## Boat Details

```
GET

/boats/:id
```

---

## Create Boat

```
POST

/boats
```

Multipart Form

```
image

boatName

boatNumber

capacity
```

---

## Update Boat

```
PUT

/boats/:id
```

---

## Delete Boat

```
DELETE

/boats/:id
```

---

## Toggle Boat Status

```
PATCH

/boats/:id/status
```

---

# 9. Schedule APIs

Base

```
/api/schedules
```

---

## Get All

```
GET

/schedules
```

---

## Owner Schedules

```
GET

/schedules/owner
```

Permission

```
Owner

Manager

Driver

Captain

Helper
```

---

## Route Schedules

```
GET

/schedules/route/:routeId
```

---

## Create Schedule

```
POST

/schedules
```

Body

```json
{
  "boatId":"",
  "routeId":"",
  "scheduleDate":"",
  "departureTime":"",
  "arrivalTime":"",
  "totalSeats":20
}
```

---

## Update Schedule

```
PUT

/schedules/:id
```

---

## Delete Schedule

```
DELETE

/schedules/:id
```

---

# 10. Slot APIs

Base

```
/api/slots
```

---

## Get Slots

```
GET

/slots
```

---

## Schedule Slots

```
GET

/slots/schedule/:scheduleId
```

---

## Create Slot

```
POST

/slots
```

---

## Update Slot

```
PUT

/slots/:id
```

---

## Delete Slot

```
DELETE

/slots/:id
```

---

# 11. Booking APIs

Base

```
/api/bookings
```

---

## Create Booking

```
POST

/bookings
```

Permission

```
CUSTOMER
```

---

## Offline Booking

```
POST

/bookings/offline
```

Permission

```
Owner

Manager
```

---

## Emergency Booking

```
POST

/bookings/emergency
```

---

## My Bookings

```
GET

/bookings/my-bookings
```

---

## Owner Bookings

```
GET

/bookings/owner
```

Permission

```
Owner

Manager

Driver

Captain

Helper
```

---

## Booking Details

```
GET

/bookings/:id
```

---

## Cancel Booking

```
PATCH

/bookings/cancel/:id
```

---

## Complete Booking

```
PATCH

/bookings/complete/:id
```

---

## Check-In

```
PATCH

/bookings/checkin/:bookingCode
```

---

## Verify Ticket

```
POST

/bookings/verify-ticket
```

---

## No Show

```
PATCH

/bookings/no-show/:id
```

---

# 12. Staff APIs

Base

```
/api/staff
```

---

## Owner Staff

```
GET

/staff/owner
```

---

## Create Staff

```
POST

/staff
```

---

## Update Staff

```
PUT

/staff/:id
```

---

## Delete Staff

```
DELETE

/staff/:id
```

---

## Assign Boat

Future

```
PATCH

/staff/:id/assign
```

---

## Attendance

Future

```
GET

/staff/attendance
```

---

# 13. Payment APIs

Base

```
/api/payments
```

---

## Create Payment

```
POST

/payments
```

---

## Verify Payment

```
POST

/payments/verify
```

---

## Refund

```
POST

/payments/refund
```

---

## Owner Revenue

```
GET

/payments/owner
```

---

# 14. Notification APIs

Base

```
/api/notifications
```

---

## My Notifications

```
GET

/notifications
```

---

## Read Notification

```
PATCH

/notifications/:id/read
```

---

## Delete Notification

```
DELETE

/notifications/:id
```

---

# 15. Reports APIs

Base

```
/api/reports
```

Available

```
Revenue Report

Booking Report

Boat Report

Trip Report

Staff Report
```

---

# 16. Analytics APIs

Base

```
/api/analytics
```

Future

```
Revenue

Growth

Top Boats

Top Routes

Bookings

Customers

Cities
```

---

# 17. Wallet APIs (Future)

```
GET

/wallet
```

```
POST

/wallet/add-money
```

```
POST

/wallet/withdraw
```

---

# 18. Reviews APIs (Future)

```
GET

/reviews
```

```
POST

/reviews
```

```
DELETE

/reviews/:id
```

---

# 19. Role Permission Matrix

| API | Customer | Staff | Owner | Admin |
|------|----------|-------|--------|--------|
| Login | ✅ | ✅ | ✅ | ✅ |
| Register | ✅ | ❌ | ❌ | ❌ |
| Boats | 👀 | 👀 | ✏️ | ✅ |
| Schedule | 👀 | 👀 | ✏️ | ✅ |
| Slots | 👀 | 👀 | ✏️ | ✅ |
| Booking | ✅ | 👀 | 👀 | ✅ |
| Staff | ❌ | ❌ | ✅ | ✅ |
| Reports | ❌ | 👀 | 👀 | ✅ |
| Analytics | ❌ | ❌ | 👀 | ✅ |

Legend:

- 👀 View
- ✏️ Create / Update
- ✅ Full Access
- ❌ No Access

---

# 20. HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | Deleted |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

# 21. API Development Standards

Every API should:

- Return consistent JSON
- Validate inputs
- Check authentication
- Check role permissions
- Handle errors gracefully
- Log important operations
- Use appropriate HTTP status codes
- Avoid exposing sensitive data

---

# 22. Future API Enhancements

Planned improvements:

- API Versioning (`/api/v2`)
- Swagger / OpenAPI Documentation
- Rate Limiting
- Request Validation with Zod
- Response DTOs
- Pagination & Filtering
- WebSocket APIs for Live Tracking
- GraphQL Gateway (optional)
- API Monitoring & Metrics

---

# 📌 Next Document

➡ **07_Authentication_System.md**

This document will explain the complete authentication and authorization system, including JWT flow, OTP reset, role-based access control, middleware architecture, login lifecycle, session management, and future security enhancements.

---
**End of 06_API_Documentation.md**