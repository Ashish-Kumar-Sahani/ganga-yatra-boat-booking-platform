# 💳 19_Payment_System.md
## Complete Payment & Financial Management System
### GangaYatra Platform

> Version : 2.0.0  
> Module : Payment System  
> Status : Partial Backend Completed

---

# 1. Overview

The Payment System is responsible for securely processing all financial transactions within the GangaYatra Platform.

It supports:

- Online Payments
- Offline Payments
- Emergency Bookings
- Refunds
- Wallet
- Owner Settlements
- Commission Management
- GST
- Invoices
- Financial Reports

The architecture is designed to scale from a single-city deployment to a nationwide SaaS platform.

---

# 2. Current Development Status

### Backend

```
Booking Payment Logic        ✅

Payment Status              ✅

Payment Model               🚧

Refund System               ❌

Owner Settlement            ❌

Wallet                      ❌

Commission                  ❌
```

### Frontend

```
Payment UI                  🚧

Payment Success             🚧

Payment Failure             ❌

Transaction History         ❌
```

---

# 3. Payment Architecture

```
Customer

↓

Booking

↓

Payment Gateway

↓

Verification

↓

Booking Confirmation

↓

Invoice

↓

Owner Settlement
```

---

# 4. Supported Payment Modes

Current

```
Online

Offline

Emergency
```

Future

```
UPI

Credit Card

Debit Card

Net Banking

Wallet

Google Pay

PhonePe

Paytm

Apple Pay
```

---

# 5. Payment Providers

Phase 1

```
Razorpay
```

Future

```
Stripe

Cashfree

PayU

CCAvenue
```

---

# 6. Booking Payment Flow

```
Search Boat

↓

Choose Schedule

↓

Select Seats

↓

Booking Created

↓

Payment

↓

Verification

↓

Booking Confirmed

↓

QR Ticket Generated
```

---

# 7. Payment States

```
PENDING

PAID

FAILED

REFUNDED

PARTIALLY_REFUNDED
```

---

# 8. Booking Types

```
ONLINE

OFFLINE

EMERGENCY
```

---

# 9. Online Payment Flow

```
Customer

↓

Create Booking

↓

Generate Razorpay Order

↓

Pay

↓

Webhook

↓

Verify Signature

↓

Update Payment

↓

Generate Ticket
```

---

# 10. Offline Payment

Collected by

```
Boat Owner

Boat Manager
```

Status

```
Cash Received

↓

Booking Confirmed

↓

Ticket Generated
```

---

# 11. Emergency Booking Payment

```
Authority

↓

Emergency Booking

↓

Immediate Confirmation

↓

Payment Recorded
```

---

# 12. Wallet (Future)

Customer Wallet

```
Recharge

↓

Wallet Balance

↓

Booking

↓

Refund

↓

Cashback
```

Owner Wallet

```
Settlement

↓

Withdraw

↓

Bank Transfer
```

---

# 13. Refund System

Trigger

```
Booking Cancelled

↓

Refund Policy

↓

Gateway

↓

Customer Wallet/Bank
```

Refund Status

```
Requested

Approved

Processing

Completed

Rejected
```

---

# 14. Refund Rules

Example

```
48 Hours Before

↓

100%

Refund
```

```
24 Hours Before

↓

50%

Refund
```

```
Less Than 2 Hours

↓

No Refund
```

Configurable by Admin.

---

# 15. Owner Settlement

Daily

```
Bookings

↓

Commission Deducted

↓

Settlement Amount

↓

Transfer
```

---

# 16. Commission Engine

Platform Commission

Example

```
Booking

₹1000

↓

10%

↓

Platform

₹100

↓

Owner

₹900
```

Future

```
City-wise Commission

Owner Plans

Subscription Commission
```

---

# 17. Transaction Lifecycle

```
Created

↓

Authorized

↓

Captured

↓

Settled

↓

Refunded
```

---

# 18. Payment Verification

```
Order ID

↓

Payment ID

↓

Signature

↓

Verify

↓

Success
```

---

# 19. Invoice System

Generated Automatically

Contains

```
Invoice Number

Booking ID

Customer

Boat

Route

GST

Amount

Payment Mode
```

Future

```
Download PDF

Email Invoice
```

---

# 20. GST

Future Support

```
GST Number

CGST

SGST

IGST
```

Invoice Example

```
Fare

₹1000

GST

₹180

Total

₹1180
```

---

# 21. Coupon Engine

Future

```
Promo Code

↓

Validate

↓

Apply Discount

↓

Final Amount
```

---

# 22. Offers

Examples

```
Festival Offer

Student Discount

Weekend Offer

Corporate Offer
```

---

# 23. Wallet Cashback

Future

```
Booking

↓

Cashback

↓

Wallet

↓

Reuse
```

---

# 24. Revenue Analytics

Charts

```
Daily Revenue

Weekly Revenue

Monthly Revenue

Yearly Revenue

Owner Revenue

City Revenue
```

---

# 25. Transaction History

Customer

```
Booking

Amount

Date

Status
```

Owner

```
Settlement

Commission

Net Amount
```

---

# 26. Payment Notifications

Customer

```
Payment Success

Payment Failed

Refund Success
```

Owner

```
Settlement Received
```

Admin

```
Payment Failure

Gateway Error
```

---

# 27. Payment Security

```
HTTPS

JWT

Webhook Signature

Encrypted Keys

PCI Compliance

Audit Logs
```

---

# 28. APIs

Current

```
POST

/payments/create-order
```

```
POST

/payments/verify
```

Future

```
GET

/payments/history
```

```
POST

/payments/refund
```

```
GET

/payments/invoice
```

```
GET

/payments/settlement
```

---

# 29. Frontend Structure

```
payments

api

components

pages

store

types
```

Components

```
PaymentCard

PaymentSummary

PaymentHistory

InvoiceView

RefundCard

WalletCard
```

---

# 30. Backend Structure

```
payments

controller

service

model

routes

webhooks

utils
```

---

# 31. Database Fields

Payment

```
BookingId

CustomerId

Amount

Gateway

OrderId

PaymentId

Status

CreatedAt
```

Settlement

```
OwnerId

GrossAmount

Commission

NetAmount

Status
```

---

# 32. Development Roadmap

### Phase 1

```
Razorpay Integration

Payment Verification

Booking Confirmation
```

---

### Phase 2

```
Invoices

Payment History

Transaction Logs
```

---

### Phase 3

```
Refund System

Commission Engine

Owner Settlement
```

---

### Phase 4

```
Wallet

Coupons

Cashback
```

---

### Phase 5

```
GST

Tax Reports

Accounting
```

---

### Phase 6

```
Subscription Billing

Multi-Gateway

International Payments
```

---

# 33. Future Vision

The Payment System is designed to evolve into a complete financial ecosystem for river transportation.

Future capabilities include:

- Multi-gateway support
- Automated settlements
- Wallet & loyalty integration
- Smart commission calculation
- Subscription billing
- GST-compliant invoicing
- AI-based fraud detection
- Financial dashboards

This module will seamlessly integrate with Bookings, Wallet, Notifications, Reports, and Analytics.

---

# 34. Summary

The Payment System manages:

- Online & Offline Payments
- Razorpay Integration
- Booking Verification
- Refunds
- Wallet
- Commission
- Settlements
- Invoices
- GST
- Financial Reports

It serves as the financial backbone of the GangaYatra Platform while ensuring secure, scalable, and transparent payment processing.

---

# 📌 Next Document

➡ **20_Deployment_Guide.md**

This document will explain the complete deployment architecture, including local development, staging, production, Docker, Nginx, PM2, MongoDB, Cloudinary, CI/CD, monitoring, backups, and scalability.

---

**End of 19_Payment_System.md**