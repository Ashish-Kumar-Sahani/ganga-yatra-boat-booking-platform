# 🚤 GangaYatra — Enterprise River Mobility & Boat Booking Platform

---

## 📄 Executive Summary
The **GangaYatra Platform** is a state-of-the-art, enterprise-grade river transportation, fleet logistics, and tourism scheduling system. Engineered specifically for the dense river mobility ecosystem of **Varanasi, Uttar Pradesh**, GangaYatra digitizes booking workflows, boat fleet operations, crew scheduling, safety audits, passenger tracking, and city-level regulatory oversight.

---

## 🚀 Key Platform Features & Modules

*   **Multi-Role Dashboards:** Customized portals for 5 distinct stakeholders (Super Admin, City Authority, Boat Owner, Crew/Staff, and Customer).
*   **Dynamic Scheduling & Slot Engine:** Custom scheduling matrix that translates weekly templates into daily booking slots with automated seat capacity checks.
*   **Simulated Payments & Digital Wallets:** Core booking transactions integrated with a simulated Razorpay payment gateway and in-app credit/debit wallet.
*   **QR-Based Ticket Verification:** Automated QR Code generation on tickets, complete with a verification workflow for boat crew check-ins.
*   **Safety & Compliance Audits:** Comprehensive tracking of safety permits, weather indicators, life jacket logs, and city-level safety enforcement.

---

## 👥 Decoupled Stakeholder Workflows

### 👑 1. Super Admin (Control Center)
*   **System Analytics:** Live telemetry tracking platform revenue, user registration trends, active routes, and boat statistics.
*   **Master Operations:** Full CRUD interfaces for editing cities, active ghat configurations, shipping routes, and dynamic pricing metrics.
*   **Audits & Access:** Centralized management of verified Boat Owners, City Authorities, and Customers.
*   **Campaigns & Settings:** System logs, promo codes, tax parameters, and role-based permissions management.

### 🏛️ 2. City Authority (Regulatory Portal)
*   **Permit & Boat Verification:** Standardized workflow for approving new boat registrations and route-operating licenses.
*   **Safety Inspections:** Logging physical safety checks, capacity bounds, and safety equipment audits.
*   **Violation Registry:** Record operational violations, track complaints, and log action items.
*   **Refund Approvals:** Approve cancellation refund allocations.

### 💼 3. Boat Owner (Fleet Dashboard)
*   **Fleet Management:** Add, edit, and flag vessels under active management.
*   **Schedule & Slot Scheduler:** Create operational timetables, customize dynamic ticket pricing, and modify seat allocations.
*   **Offline Direct Booking:** Direct-counter ticketing engine for walk-in tourists.
*   **Staff & Crew Roster:** Assign captains, drivers, and helpers to scheduled boat routes.
*   **Revenue Analytics:** Visual daily earnings reports, cash vs. online ledger splits, and wallet withdrawals.

### ⚓ 4. Boat Crew & Staff (Operations Dashboard)
*   **Operations View:** Mobile-first dashboard for managers, drivers, and crew.
*   **Assigned Schedule Calendar:** Real-time access to assigned boats, trips, and boarding ghat schedules.
*   **QR Ticket Scanning:** Scanning workflow simulator to verify passenger tickets prior to boarding.
*   **Check-In/Out Attendance:** Real-time crew attendance logs.

### 👤 5. Customer App
*   **Search & Filters:** Real-time search engine by source/destination ghats, boat class, and boarding schedules.
*   **Interactive Checkout:** Slot selection, passenger manifest input, and promo discount options.
*   **Digital Wallet & Ticket Locker:** Dynamic QR code tickets, transaction history, and wallet balances.
*   **Ratings & Reviews:** Post-trip driver and boat rating feedback.

---

## 🖥️ Page-by-Page Feature Specifications

### 🧑‍💻 Customer Module Pages (`/customer`)
*   **Dashboard (`/customer/dashboard`):** A customized panel presenting active bookings, recent wallet transactions, live river weather warnings, and quick shortcuts for route searching.
*   **Search Trips (`/customer/search-trips` & `/customer/search`):** Search engine filtering slots by date, boarding ghat, drop ghat, and boat type (Wooden, Motor, Bajra, Cruise).
*   **Boat Details (`/customer/boat-details/:slotId`):** Show details for selected boats, including technical specs, active safety permits, ratings, crew details, and customer reviews.
*   **Booking Checkout (`/customer/booking/:slotId`):** Interface for adding passenger details, selecting seats, applying promotional coupons, and reviewing trip itinerary details.
*   **Payment Simulator (`/customer/payment/:bookingId`):** Simulated Razorpay client interface mimicking successful/failed card, UPI, and wallet transactions.
*   **My Bookings & Tickets (`/customer/bookings` & `/customer/tickets`):** Dashboard listing upcoming, active, and past trips with download links for digital tickets containing dynamic validation QR codes.
*   **Wallet Module (`/customer/wallet`):** Displays balance statement, transaction history, refund deposits, and payout setup options.
*   **Review Management (`/customer/reviews`):** Tab for submitting post-trip ratings and text feedback for captains and boats.
*   **Live Tracking (`/customer/tracking`):** Simulated mapping tracker showing the real-time position of the assigned vessel along the Ganga river route.

### 💼 Boat Owner Module Pages (`/owner`)
*   **Owner Dashboard (`/owner/dashboard`):** Central landing page showing overall fleet revenue graphs, bookings status charts, weather data, and crew shift notifications.
*   **Vessel Manager (`/owner/boats` & `/owner/add-boat`):** Add and track boats including capacity, fuel parameters, technical status, and registration documents upload.
*   **Schedule Manager (`/owner/schedules` & `/owner/add-schedule`):** Define weekly recurring routes or set up custom trip templates.
*   **Slot Configurator (`/owner/slots`):** Granular controller to enable/disable slots on a given day and configure premium pricing for specific slots.
*   **Offline Counter (`/owner/offline-booking`):** Quick walk-in counter booking interface for on-the-spot tourists paying with cash.
*   **Staff Manager (`/owner/staff`):** Employee onboarding portal for hiring and mapping crew (captains, drivers, helpers) to specific schedule routines.
*   **Earnings Tracker (`/owner/earnings`):** Account statements detailing commission structures, offline cash handovers, and settlement requests history.

### 🏛️ City Authority Module Pages (`/authority`)
*   **Authority Dashboard (`/authority/dashboard`):** High-level summary of river traffic, pending permits, safety audit logs, and active weather status.
*   **Boat Verification (`/authority/boats`):** Document preview screen to approve/reject new boat listings and verify fitness certifications.
*   **Route & Permit Approvals (`/authority/routes` & `/authority/permits`):** Review and sign off on route-operating permit requests submitted by boat owners.
*   **Safety Inspections (`/authority/inspections`):** Digital audit forms to record physical inspections, life jackets count, and safety gear verification status.
*   **Violations Registry (`/authority/violations`):** Panel to file safety violations, track fines, and log vessel suspension actions.
*   **Refund Panel (`/authority/refunds` & `/authority/refunds/:bookingId`):** Automated ledger to verify passenger refunds for trips cancelled due to high water levels or weather issues.

### 👑 Super Admin Module Pages (`/admin`)
*   **Admin Dashboard (`/admin/dashboard`):** Consolidated operations summary showing global bookings, registration trends, and combined transaction metrics.
*   **User Directory (`/admin/users`, `/admin/boat-owners`, `/admin/authorities`):** Complete user profiles management, verification status logs, and user suspension switches.
*   **Geographic Master (`/admin/cities`, `/admin/ghats`, `/admin/routes`):** Master configuration to manage Varanasi and future city registries, active ghat terminals, and operating routes.
*   **Marketing Coupons (`/admin/offers`):** Panels to create promo discount coupon codes, configure minimum order limits, and set expiration limits.
*   **Reports & Audit (`/admin/reports` & `/admin/analytics`):** Exportable financial databases, system logs history, and API performance telemetry.

### ⚓ Boat Crew (Staff) Module Pages (`/staff`)
*   **Staff Dashboard (`/staff/dashboard`):** Showcases the crew member's shift status, daily tasks calendar, weather advisory, and current boat assignment.
*   **Trip Calendar (`/staff/calendar` & `/staff/bookings`):** Chronological agenda listing passenger manifests, check-in checklists, and ghat route guidelines.
*   **QR Scanner Simulator (`/staff/live-tracking`):** Scanning interface mimicking validation checks on customer tickets to secure passengers boarding.
*   **Attendance Tracker (`/staff/attendance`):** Location-bounded daily check-in / check-out button logging shift attendance history.

---

## 💻 Tech Stack & Decoupled Architecture

| Layer | Technology | Primary Function |
| :--- | :--- | :--- |
| **Frontend Web** | React 18, TypeScript, Vite | Single Page Application (SPA), dynamic dark/light themes. |
| **State Management** | Zustand | Client state storage for sessions, booking carts, and themes. |
| **Routing** | React Router v6 | Role-based layout guards (`ProtectedRoute`, `RoleRoute`, `PermissionGuard`). |
| **Styling** | Tailwind CSS | Utility-first styling with responsive breakpoint grids. |
| **Backend API** | Node.js, Express.js (ESM) | High-throughput REST API with structured controllers. |
| **Database** | MongoDB Atlas & Mongoose | Document storage with complex indexes for location, booking slots, and timelines. |
| **Utilities** | Nodemailer, QRCode, Multer | Automated registration OTPs, ticket barcode generation, and secure asset uploads. |
| **Asset Storage** | Cloudinary | Cloud management for registration papers and profile photos. |
| **Mobile App** | React Native, Expo, Router | Cross-platform app architecture (established base under `/MobileApp`). |

---

## 🏗 Overall Architecture

```
                                  +-------------------+
                                  |    React Web App   |
                                  | (Customer/Owner/  |
                                  | Admin/Staff/Govt) |
                                  +---------+---------+
                                            |
                                            | REST API Requests (HTTPS)
                                            v
                                  +---------+---------+
                                  |  Express Backend  |
                                  |     (Node/TS)     |
                                  +----+---------+----+
                                       |         |
                  +--------------------+         +--------------------+
                  |                                                   |
                  v                                                   v
         +--------+--------+                                 +--------+--------+
         |     MongoDB     |                                 |   Cloudinary    |
         |  (Data Storage) |                                 |  (Image Assets) |
         +-----------------+                                 +-----------------+
```

---

## 📂 Project Structure

```
ganga-yatra-boat-booking-platform/
├── Backend/                 # Express REST API (TypeScript)
│   ├── src/
│   │   ├── config/          # DB connection & Cloudinary setup
│   │   ├── middlewares/     # JWT Auth, Role validation & error handlers
│   │   ├── modules/         # Modular backend domains (auth, boats, bookings, etc.)
│   │   ├── services/        # Third-party integrations (Nodemailer, QR, etc.)
│   │   └── app.ts           # Route registrations & Express instance
│   └── tsconfig.json
├── Frontend/                # React Web Application (Vite + TS)
│   ├── src/
│   │   ├── app/             # Entry point & App.tsx routing
│   │   ├── components/      # UI components (Buttons, inputs, tables)
│   │   ├── features/        # Feature domains (admin, auth, customer, staff, etc.)
│   │   ├── layouts/         # Layout shells for different dashboards
│   │   ├── stores/          # Zustand global state stores
│   │   └── index.css        # Core Tailwind imports
│   └── package.json
├── MobileApp/               # React Native Expo boilerplate
└── package.json             # Root workspace setup
```

---

# 📊 Current Development Progress

| Module / Feature | Status | Completion % | Description |
| :--- | :---: | :---: | :--- |
| **Authentication & RBAC** | ✅ Complete | 100% | OTP registration, JWT login, custom PermissionGuards for web dashboards. |
| **Boat & Route Fleet Setup** | ✅ Complete | 100% | Boat CRUD, route definitions, city/ghat mappings. |
| **Scheduling & Slot Engines** | ✅ Complete | 100% | Reusable schedules, hourly dynamic slots creation, real-time availability. |
| **Booking & Ticket Engines** | ✅ Complete | 100% | Online customer checkout, offline owner walk-ins, dynamic QR generation. |
| **Payments & Wallet Systems** | ✅ Complete | 100% | Razorpay simulation, customer wallet credits/debits, refunds management. |
| **Staff & Crew Management** | ✅ Complete | 100% | Attendance tracking, shift check-in/out, crew schedules. |
| **Owner Dashboard Analytics** | ✅ Complete | 100% | Daily income graphs, schedule charts, fleet status indicators. |
| **City Authority Portal** | ✅ Complete | 100% | Boat verification, route permit approval, safety checks, violation tracking. |
| **Super Admin Control Center** | ✅ Complete | 100% | Comprehensive control over all users, masters, promotions, and settings. |
| **Mobile Application** | 🚧 In Setup | 10% | Expo boilerplate, initial routing, ready for Mobile layouts. |
| **AI Features** | ⏳ Planned | 0% | AI-based passenger demand prediction, weather tracking routing. |

---

# 🚀 Running Locally

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB (local instance or MongoDB Atlas URI)
*   Cloudinary Account (for media uploads)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Ashish-Kumar-Sahani/ganga-yatra-boat-booking-platform.git
   cd ganga-yatra-boat-booking-platform
   ```

2. Install workspace dependencies:
   ```bash
   npm install
   cd Backend && npm install
   cd ../Frontend && npm install
   cd ..
   ```

3. Setup environment variables:
   *   Create a `.env` file in the `Backend` directory containing:
       ```env
       PORT=5000
       MONGO_URI=your_mongodb_connection_uri
       JWT_SECRET=your_jwt_signing_key
       EMAIL_USER=your_nodemailer_email
       EMAIL_PASS=your_nodemailer_password
       CLOUDINARY_CLOUD_NAME=your_cloudinary_name
       CLOUDINARY_API_KEY=your_cloudinary_api_key
       CLOUDINARY_API_SECRET=your_cloudinary_api_secret
       ```

### Execution Commands
Start the full development environment (Backend and Frontend simultaneously) from the root folder:
```bash
npm run dev
```
*   **Backend API** will run at: [http://localhost:5000](http://localhost:5000)
*   **Frontend Client** will run at: [http://localhost:5173](http://localhost:5173)

---

# 📚 Project Documentation

The complete technical design documentation, indexing every design file, database schema, and layout is available in the **[GangaYatra Project Bible](file:///c:/Users/ak694/Coding/ganga-yatra-boat-booking-platform/GangaYatra%20Project%20Bible)** directory. 

*   To navigate the documentation index, refer to **[00_Project_Index.md](file:///c:/Users/ak694/Coding/ganga-yatra-boat-booking-platform/GangaYatra%20Project%20Bible/00_Project_Index.md)**.
*   For DB schemas, refer to **[05_Database_Design.md](file:///c:/Users/ak694/Coding/ganga-yatra-boat-booking-platform/GangaYatra%20Project%20Bible/05_Database_Design.md)**.
*   For REST endpoints, refer to **[06_API_Documentation.md](file:///c:/Users/ak694/Coding/ganga-yatra-boat-booking-platform/GangaYatra%20Project%20Bible/06_API_Documentation.md)**.

---

# 🤖 AI-Assisted Development
This project is built and optimized using modern AI design assistants (**Antigravity AI**, **ChatGPT**, and VS Code extensions). Design iterations, frontend state setups, and backend API routing patterns were reviewed and improved through AI-guided analysis before landing in the production code.
